<script lang="ts">
  import type { GameState, NPC, Bill, Issue, QuickInteractionType } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';
  import { getSentimentTier, getRelationshipChangeNarrative, createRng, pick } from '../../core/utils';
  import { selectQuickBark, loadQuickBarks } from '../../core/bark-engine';
  import { changeSentiment, addIntelEntry } from '../../stores/actions';
  import { findCommitteeForBill } from '../../core/committees';

  let { gameState, npc, interactionType, onComplete }: {
    gameState: GameState;
    npc: NPC;
    interactionType: QuickInteractionType;
    onComplete: () => void;
  } = $props();

  // Seeded RNG for deterministic quick interactions
  const qiRng = createRng(gameState.seed + gameState.currentDay * 300 + npc.id.charCodeAt(0));

  $effect(() => { loadQuickBarks(); });

  let phase: 'initial' | 'engaged' | 'resolved' = $state('initial');
  let chosenVerb: string | null = $state(null);
  let verbsUsed = $state(0);
  let netShift = $state(0); // accumulated sentiment change
  let intelLines: string[] = $state([]);
  let resolutionBark = $state('');
  let declineTaken = $state(false);

  let sentimentScore = $derived(gameState.sentiment[npc.id] ?? 0);
  let sentimentTier = $derived(getSentimentTier(sentimentScore));

  // ═══════════════════════════════════════════════════════════
  // Type-specific framing, verbs, and intel
  // Each type surfaces 2-3 verbs tuned to the moment and pulls
  // intel lines from live game state (not hardcoded filler).
  // ═══════════════════════════════════════════════════════════

  let typeLabel = $derived.by(() => {
    switch (interactionType) {
      case 'early_bird': return 'EARLY BIRD';
      case 'ambush':     return 'AMBUSH';
      case 'hallway':    return 'HALLWAY ENCOUNTER';
      case 'lingerer':   return 'LINGERER';
    }
  });

  let typeFraming = $derived.by(() => {
    switch (interactionType) {
      case 'early_bird': return 'THEY CAUGHT YOU BEFORE THE DAY STARTED.';
      case 'ambush':     return 'THEY WERE WAITING FOR YOU.';
      case 'hallway':    return 'A PASSING MOMENT IN THE CORRIDOR.';
      case 'lingerer':   return "THEY'RE IN NO HURRY. YOU HAVE A MINUTE OR TWO.";
    }
  });

  const BARK_TYPE_MAP: Record<QuickInteractionType, string> = {
    early_bird: 'ambush',
    ambush:     'ambush',
    hallway:    'vote_read',
    lingerer:   'holding_up',
  };

  // Opening bark — pulls authored corpus first, falls back per type
  let openingBark = $derived.by(() => {
    const barkType = BARK_TYPE_MAP[interactionType];
    const category = interactionType === 'ambush' ? 'vote_ask' : 'opening';
    const authored = selectQuickBark(qiRng, npc, barkType, category);
    if (authored) return `"${authored.toUpperCase()}"`;
    switch (interactionType) {
      case 'early_bird':
        return `"YOU'RE IN EARLY TOO. GOOD — I WANTED A WORD BEFORE THINGS GET LOUD."`;
      case 'ambush':
        return `"I'VE BEEN LOOKING FOR YOU. WE NEED TO TALK — NOT ON THE CALENDAR, JUST NOW."`;
      case 'hallway':
        return `"FANCY RUNNING INTO YOU HERE. WALK WITH ME A MINUTE?"`;
      case 'lingerer':
        return `"MIND IF I BEND YOUR EAR? I'VE GOT A FEW MINUTES AND NOWHERE TO BE."`;
    }
  });

  // ── Verbs: type-specific set ──
  interface QIVerb { id: string; label: string; tag: string }

  let availableVerbs = $derived.by((): QIVerb[] => {
    switch (interactionType) {
      case 'early_bird':
        return [
          { id: 'prebrief',    label: 'PREBRIEF ON THE DAY',    tag: 'SCHEDULE' },
          { id: 'ask_desk',    label: "ASK WHAT'S ON THEIR DESK", tag: 'INTEL'    },
          { id: 'small_talk',  label: 'SMALL TALK & COFFEE',    tag: 'GOODWILL' },
        ];
      case 'ambush':
        return [
          { id: 'hear_ask',       label: 'HEAR THEIR ASK',           tag: 'INTEL'     },
          { id: 'deflect_respect',label: 'DEFLECT WITH RESPECT',     tag: 'NEUTRAL'   },
          { id: 'promise_follow', label: 'PROMISE TO FOLLOW UP',     tag: 'GOODWILL'  },
        ];
      case 'hallway':
        return [
          { id: 'temp_check',  label: 'QUICK TEMP-CHECK',      tag: 'INTEL'    },
          { id: 'ask_vote',    label: 'ASK ABOUT A VOTE',      tag: 'INTEL'    },
          { id: 'mention_yours',label: 'MENTION YOUR BILL',    tag: 'GOODWILL' },
        ];
      case 'lingerer':
        // Lingerer gets 2 actions
        return [
          { id: 'ask_member',     label: 'ASK ABOUT A MEMBER',    tag: 'INTEL'   },
          { id: 'ask_committee',  label: 'ASK ABOUT A COMMITTEE', tag: 'INTEL'   },
          { id: 'share_gossip',   label: 'TRADE GOSSIP',          tag: 'SOCIAL'  },
        ];
    }
  });

  let isLingerer = $derived(interactionType === 'lingerer');
  let maxVerbs = $derived(isLingerer ? 2 : 1);

  // Decline affordance
  let declineLabel = $derived.by(() => {
    switch (interactionType) {
      case 'early_bird': return 'SKIP';
      case 'ambush':     return 'DIVERT';
      case 'hallway':    return 'PASS';
      case 'lingerer':   return 'LEAVE';
    }
  });

  // Declining an ambush is the only move that damages the relationship — UI
  // flags that narratively (no numbers).
  let declineRisky = $derived(interactionType === 'ambush');

  // ═══════════════════════════════════════════════════════════
  // Game-state-derived intel builders
  // ═══════════════════════════════════════════════════════════

  function npcActiveBill(): Bill | null {
    return npc.activeBill
      ? gameState.npcBills.find(b => b.id === npc.activeBill) ?? null
      : null;
  }

  function npcCommitteeNames(): string[] {
    return npc.committeeMemberships
      .map(cid => gameState.committees.find(c => c.id === cid)?.name ?? null)
      .filter((n): n is string => !!n);
  }

  /** A bill the NPC has a real stake in — their own, or one they cosponsor */
  function stakedBill(): Bill | null {
    const own = npcActiveBill();
    if (own) return own;
    const cosp = gameState.npcBills.find(b =>
      b.cosponsors.includes(npc.id) && b.stage !== 'law' && b.stage !== 'dead'
    );
    return cosp ?? null;
  }

  function todayOnCalendar(): string | null {
    const todays = gameState.schedule.filter(e =>
      e.day === gameState.currentDay && (e.type === 'committee_hearing' || e.type === 'floor_vote' || e.type === 'caucus')
    );
    if (todays.length === 0) return null;
    const first = todays[0];
    return `${first.label.toUpperCase()} TODAY.`;
  }

  function randomHotIssue(): Issue | null {
    const hot = (Object.keys(gameState.issueTemperatures) as Issue[])
      .filter(k => gameState.issueTemperatures[k] === 'hot');
    if (hot.length === 0) return null;
    return pick(qiRng, hot);
  }

  function anotherMember(): NPC | null {
    const others = gameState.npcs.filter(n =>
      n.id !== npc.id && (n.hasActiveBill || gameState.committees.some(c => c.chair === n.id))
    );
    if (others.length === 0) return null;
    return pick(qiRng, others);
  }

  // ═══════════════════════════════════════════════════════════
  // Verb handlers — each produces live intel + a sentiment shift
  // ═══════════════════════════════════════════════════════════

  function runVerb(verb: QIVerb) {
    const lines: string[] = [];
    let shift = 0;

    if (verb.id === 'prebrief') {
      // What's on the NPC's plate today + schedule read
      const today = todayOnCalendar();
      const bill = stakedBill();
      if (bill) {
        const comm = findCommitteeForBill(bill, gameState);
        lines.push(`THEY ARE WATCHING #${bill.number} ${bill.name.toUpperCase()}.`);
        if (comm) lines.push(`BILL IS IN ${comm.name.toUpperCase()}.`);
      }
      if (today) lines.push(today);
      if (lines.length === 0) lines.push('NOTHING PRESSING ON THEIR CALENDAR TODAY.');
      shift = 3;
    } else if (verb.id === 'ask_desk') {
      // Deep read on what they're working on
      const bill = npcActiveBill();
      if (bill) {
        lines.push(`WORKING #${bill.number} ${bill.name.toUpperCase()} — STAGE: ${bill.stage.toUpperCase()}.`);
        if (bill.cosponsors.length > 0) {
          lines.push(`${bill.cosponsors.length} COSPONSOR${bill.cosponsors.length === 1 ? '' : 'S'} SIGNED ON.`);
        }
        logIntel('bill_status',
          `${npc.name.toUpperCase()}'S #${bill.number} AT ${bill.stage.toUpperCase()}`,
          lines.join(' · '),
          { billIds: [bill.id], importance: 'medium' });
      } else {
        lines.push(`NO BILL OF THEIR OWN — THEY'RE WORKING COMMITTEES.`);
        const cnames = npcCommitteeNames();
        if (cnames.length > 0) lines.push(`ON: ${cnames.join(', ').toUpperCase()}.`);
      }
      shift = 2;
    } else if (verb.id === 'small_talk') {
      lines.push('A FEW WORDS ABOUT NOTHING. THEY RELAX A LITTLE.');
      shift = 4;
    } else if (verb.id === 'hear_ask') {
      // Ambush: reveal what they want from you
      const bill = npcActiveBill();
      if (bill) {
        lines.push(`THEY WANT MOVEMENT ON #${bill.number} ${bill.name.toUpperCase()}.`);
        const comm = findCommitteeForBill(bill, gameState);
        if (comm && gameState.player.committees.includes(comm.id)) {
          lines.push(`YOU SIT ON THE COMMITTEE — THEY KNOW IT.`);
        }
        logIntel('bill_support',
          `${npc.name.toUpperCase()} PUSHING #${bill.number}`,
          lines.join(' · '),
          { billIds: [bill.id], importance: 'medium' });
      } else if (npc.primaryThreat >= 50) {
        lines.push(`THEY SOUND STRESSED — PRIMARY PRESSURE IS REAL.`);
        logIntel('npc_primary_status',
          `${npc.name.toUpperCase()} FEELING PRIMARY HEAT`,
          lines.join(' · '),
          { importance: 'low' });
      } else {
        lines.push(`THEY WANT TO BE HEARD. NO CLEAR ASK YET.`);
      }
      shift = 3;
    } else if (verb.id === 'deflect_respect') {
      lines.push('YOU PROMISE NOTHING. THEY ACCEPT THE DEFLECTION.');
      shift = 0;
    } else if (verb.id === 'promise_follow') {
      lines.push('YOU COMMIT TO A REAL CONVERSATION LATER. THEY RELAX.');
      shift = 5;
    } else if (verb.id === 'temp_check') {
      // Quick read on their attitude toward you
      lines.push(`THEIR POSTURE READS ${sentimentTier.toUpperCase()}.`);
      if (npc.primaryThreat >= 60) lines.push('UNDER SERIOUS PRIMARY PRESSURE — JUMPY.');
      else if (npc.primaryThreat >= 30) lines.push('PRIMARY HEAT IS IN THE BACKGROUND FOR THEM.');
      logIntel('npc_disposition',
        `${npc.name.toUpperCase()} READS ${sentimentTier.toUpperCase()}`,
        lines.join(' · '),
        { importance: 'low' });
      shift = 1;
    } else if (verb.id === 'ask_vote') {
      // Read on an active bill in the chamber
      const allBills = [gameState.playerBill, ...gameState.npcBills].filter(b =>
        b.stage !== 'dead' && b.stage !== 'law'
      );
      if (allBills.length > 0) {
        const target = pick(qiRng, allBills);
        const cosp = target.cosponsors.includes(npc.id);
        const author = target.author === npc.id;
        if (author) {
          lines.push(`#${target.number} ${target.name.toUpperCase()} — THEIR OWN BILL. HARD YES.`);
        } else if (cosp) {
          lines.push(`#${target.number} ${target.name.toUpperCase()} — ALREADY COSPONSORED. LIKELY YES.`);
        } else if (target.author === 'player') {
          lines.push(`#${target.number} ${target.name.toUpperCase()} — THEIR READ: NO PROMISES.`);
        } else {
          lines.push(`#${target.number} ${target.name.toUpperCase()} — "STILL WEIGHING IT."`);
        }
        logIntel('npc_voting_lean',
          `${npc.name.toUpperCase()} ON #${target.number} ${target.name.toUpperCase()}`,
          lines.join(' · '),
          { billIds: [target.id], importance: 'low' });
      } else {
        lines.push('NO ACTIVE BILLS MOVING THROUGH THE CHAMBER RIGHT NOW.');
      }
      shift = 2;
    } else if (verb.id === 'mention_yours') {
      // Surface their stance on YOUR bill
      const yours = gameState.playerBill;
      if (yours.cosponsors.includes(npc.id)) {
        lines.push(`ALREADY A COSPONSOR ON YOUR BILL — A NOD OF ACKNOWLEDGMENT.`);
        shift = 3;
      } else {
        const yourIssues = [...yours.proTags];
        const shared = yourIssues.find(i => npc.coreInterests.includes(i) || npc.flexibleInterests.includes(i));
        if (shared) {
          lines.push(`THEY PERK UP — ${ISSUE_LABELS[shared].toUpperCase()} IS ON THEIR INTEREST LIST.`);
          shift = 4;
        } else {
          lines.push(`THEY HEAR YOU OUT. NO COMMITMENT.`);
          shift = 2;
        }
      }
    } else if (verb.id === 'ask_member') {
      // Lingerer: dossier on another member
      const other = anotherMember();
      if (other) {
        const otherBill = other.activeBill
          ? gameState.npcBills.find(b => b.id === other.activeBill)
          : null;
        lines.push(`ON ${other.name.toUpperCase()}:`);
        if (otherBill) {
          lines.push(`- RIDING #${otherBill.number} ${otherBill.name.toUpperCase()}.`);
        }
        if (other.primaryThreat >= 50) lines.push(`- PRIMARY THREAT IS REAL.`);
        const chairOf = gameState.committees.find(c => c.chair === other.id);
        if (chairOf) lines.push(`- CHAIRS ${chairOf.name.toUpperCase()}.`);
        logIntel('npc_disposition',
          `RUMOR FROM ${npc.name.toUpperCase()} ON ${other.name.toUpperCase()}`,
          lines.join(' · '),
          { npcIds: [other.id, npc.id], importance: 'low' });
      } else {
        lines.push('THEY DEMUR — NO FRESH READS TO PASS ALONG.');
      }
      shift = 2;
    } else if (verb.id === 'ask_committee') {
      // Read on a committee the NPC sits on
      const cnames = npcCommitteeNames();
      if (cnames.length > 0) {
        const commName = cnames[0];
        const comm = gameState.committees.find(c => c.name === commName);
        lines.push(`ON ${commName.toUpperCase()}:`);
        if (comm) {
          const chair = gameState.npcs.find(n => n.id === comm.chair);
          if (chair) lines.push(`- ${chair.name.toUpperCase()} CHAIRS.`);
          const pending = [gameState.playerBill, ...gameState.npcBills].filter(b => {
            const bc = findCommitteeForBill(b, gameState);
            return bc?.id === comm.id && (b.stage === 'referral' || b.stage === 'hearing');
          });
          if (pending.length > 0) {
            lines.push(`- ${pending.length} BILL${pending.length === 1 ? '' : 'S'} AWAITING ACTION.`);
          }
        }
        logIntel('committee_read',
          `COMMITTEE READ: ${commName.toUpperCase()}`,
          lines.join(' · '),
          { importance: 'low' });
      } else {
        lines.push('THEY AREN\'T ON ANY COMMITTEE YOU CARE ABOUT RIGHT NOW.');
      }
      shift = 2;
    } else if (verb.id === 'share_gossip') {
      const hot = randomHotIssue();
      if (hot) {
        lines.push(`"${ISSUE_LABELS[hot].toUpperCase()} IS RUNNING HOT. PEOPLE ARE MOVING."`);
      } else {
        lines.push('"THE CHAMBER IS QUIET THIS WEEK. THAT NEVER LASTS."');
      }
      shift = 3;
    }

    // Commit shift + intel
    netShift += shift;
    intelLines.push(...lines);
    verbsUsed++;
    chosenVerb = verb.id;

    if (verbsUsed >= maxVerbs) {
      resolveEncounter();
    }
  }

  function logIntel(
    category: 'npc_stance' | 'npc_temperament' | 'npc_concern' | 'npc_disposition' |
              'npc_voting_lean' | 'npc_primary_status' | 'bill_support' | 'bill_status' |
              'deal' | 'committee_read',
    headline: string,
    detail: string,
    opts?: { npcIds?: string[]; billIds?: string[]; importance?: 'low' | 'medium' | 'high' }
  ) {
    addIntelEntry({
      source: 'quick_interaction',
      category,
      importance: opts?.importance ?? 'low',
      headline,
      detail,
      relatedNpcIds: opts?.npcIds ?? [npc.id],
      relatedBillIds: opts?.billIds ?? [],
      relatedIssues: [],
      concernsPlayerBill: false,
    });
  }

  function handleEngage() {
    phase = 'engaged';
  }

  function handleDecline() {
    declineTaken = true;
    if (declineRisky) {
      netShift = -4;
      resolutionBark = 'THEY NOTICE YOU SIDESTEPPED. THAT REGISTERS.';
    } else {
      resolutionBark = 'A CURT NOD — NO HARM DONE.';
    }
    resolveEncounter();
  }

  function resolveEncounter() {
    // Persist the accumulated sentiment shift to the store
    if (netShift !== 0) {
      changeSentiment(npc.id, netShift);
    }
    // Pick a closing bark if we engaged
    if (!declineTaken) {
      resolutionBark = netShift >= 4
        ? 'THEY WALK OFF VISIBLY WARMED.'
        : netShift >= 1
          ? 'A SMALL WARMING. NOTED ON BOTH SIDES.'
          : netShift <= -3
            ? 'THEY LEAVE STIFFER THAN THEY CAME.'
            : 'A POLITE EXCHANGE. NO LASTING WEIGHT.';
    }
    phase = 'resolved';
  }

  // Narrative description of the sentiment outcome — never a number.
  let outcomeNarrative = $derived(getRelationshipChangeNarrative(netShift));
</script>

<div class="qi-overlay">
  <div class="panel qi-panel">
    <div class="panel-header qi-header">
      <span class="qi-type">{typeLabel}</span>
      <span class="qi-framing">{typeFraming}</span>
    </div>
    <div class="qi-body">

      <!-- NPC Info -->
      <div class="npc-row">
        <div class="npc-info">
          <span class="npc-name">{npc.name}</span>
          <span class="npc-species">({npc.species})</span>
          <span class="npc-party party-{npc.party}">{npc.party.toUpperCase()}</span>
        </div>
        <span class="sentiment-badge {sentimentTier}">{sentimentTier.toUpperCase()}</span>
      </div>

      <!-- Bark / Intel Display -->
      <div class="bark-display">
        {#if phase === 'initial'}
          <div class="bark-text">{openingBark}</div>
        {:else if phase === 'engaged'}
          {#if intelLines.length === 0}
            <div class="bark-text">{openingBark}</div>
          {:else}
            <ul class="intel-list">
              {#each intelLines as line}
                <li class="intel-line">{line}</li>
              {/each}
            </ul>
          {/if}
        {:else}
          <div class="resolution">
            {#if intelLines.length > 0}
              <ul class="intel-list">
                {#each intelLines as line}
                  <li class="intel-line">{line}</li>
                {/each}
              </ul>
            {/if}
            <div class="resolution-bark">{resolutionBark}</div>
            <div class="resolution-outcome">OUTCOME — {outcomeNarrative}.</div>
          </div>
        {/if}
      </div>

      <!-- Actions -->
      <div class="qi-actions">
        {#if phase === 'initial'}
          <button class="btn" onclick={handleEngage}>ENGAGE</button>
          <button class="btn {declineRisky ? 'btn-danger' : ''}" onclick={handleDecline}>
            {declineLabel}
            {#if declineRisky}<span class="risk-tag">RISKY</span>{/if}
          </button>
        {:else if phase === 'engaged'}
          {#if verbsUsed < maxVerbs}
            {#each availableVerbs as verb}
              <button class="btn verb-btn" onclick={() => runVerb(verb)}>
                <span>{verb.label}</span>
                <span class="verb-tag">{verb.tag}</span>
              </button>
            {/each}
          {/if}
          {#if verbsUsed > 0 && verbsUsed < maxVerbs}
            <div class="verbs-remaining">{maxVerbs - verbsUsed} MOVE REMAINING</div>
          {/if}
        {:else}
          <button class="btn" onclick={onComplete}>DONE</button>
        {/if}
      </div>

    </div>
  </div>
</div>

<style>
  .qi-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  .qi-panel {
    width: 640px;
    min-height: 300px;
    display: flex;
    flex-direction: column;
  }
  .qi-header {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 6px 12px;
    gap: 2px;
  }
  .qi-type {
    font-size: 1.15rem;
  }
  .qi-framing {
    font-size: 0.9rem;
    color: var(--warm-amber);
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .qi-body {
    flex: 1;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* NPC Row */
  .npc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    background: var(--marble-white);
    border: 2px solid var(--black);
  }
  .npc-info {
    display: flex;
    gap: 8px;
    align-items: baseline;
  }
  .npc-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--black);
  }
  .npc-species {
    font-size: 1rem;
    color: #555;
  }
  .npc-party {
    font-size: 0.95rem;
    padding: 1px 6px;
    border: 1px solid var(--black);
  }
  .party-feralist {
    background: var(--primary-red);
    color: white;
  }
  .party-communalist {
    background: var(--ega-blue);
    color: white;
  }
  .sentiment-badge {
    font-size: 1.1rem;
    font-weight: bold;
    padding: 2px 8px;
    border: 2px solid var(--black);
    background: var(--marble);
  }

  /* Bark / Intel Display */
  .bark-display {
    padding: 10px 12px;
    background: #000;
    border: 2px solid var(--black);
    min-height: 80px;
    display: flex;
    align-items: flex-start;
  }
  .bark-text {
    font-size: 1.15rem;
    color: var(--phosphor-green);
    line-height: 1.3;
  }
  .intel-list {
    list-style: none;
    padding: 0;
    margin: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
    width: 100%;
  }
  .intel-line {
    font-size: 1.05rem;
    color: var(--phosphor-green);
    line-height: 1.3;
    padding-left: 12px;
    position: relative;
  }
  .intel-line::before {
    content: '›';
    position: absolute;
    left: 0;
    color: var(--warm-amber);
  }

  .resolution {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .resolution-bark {
    font-size: 1.1rem;
    color: var(--phosphor-green);
    line-height: 1.3;
    font-style: italic;
  }
  .resolution-outcome {
    font-size: 1.05rem;
    color: var(--warm-amber);
    letter-spacing: 0.04em;
    border-top: 1px dashed #444;
    padding-top: 6px;
  }

  /* Actions */
  .qi-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 4px;
  }
  .verb-btn {
    display: inline-flex;
    align-items: center;
    gap: 6px;
  }
  .verb-tag {
    font-size: 0.85rem;
    background: #ddd;
    color: #444;
    border: 1px solid #999;
    padding: 0 4px;
  }
  .risk-tag {
    font-size: 0.85rem;
    background: var(--primary-red);
    color: white;
    padding: 0 4px;
    margin-left: 4px;
  }
  .verbs-remaining {
    width: 100%;
    text-align: center;
    font-size: 0.95rem;
    color: var(--phosphor-dim);
    margin-top: 2px;
  }
</style>
