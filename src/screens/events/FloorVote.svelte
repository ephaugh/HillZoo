<script lang="ts">
  import type { GameState, NPC, Bill } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';
  import { createRng, pick, getSentimentTier } from '../../core/utils';
  import { calculateNetWillingness, resolveNpcVote, type NpcVoteResult } from '../../core/decision-engine';
  import { selectArmtwistBark, loadArmtwistBarks } from '../../core/bark-engine';
  import { recordVoteForReportCards, updateReportCards } from '../../core/turn-processor';
  import { gameStore } from '../../stores/game';
  import { shiftSentiment } from '../../core/sentiment';
  import { clamp } from '../../core/utils';

  let { gameState, onComplete, billId }: {
    gameState: GameState;
    onComplete: () => void;
    billId?: string;
  } = $props();

  $effect(() => { loadArmtwistBarks(); });

  let bill = $derived(
    billId
      ? ([gameState.playerBill, ...gameState.npcBills].find(b => b.id === billId) ?? gameState.playerBill)
      : gameState.playerBill
  );
  let isPlayerBill = $derived(bill.id === gameState.playerBill.id);

  // ── Phases: player_vote → armtwist → reveal ──
  type VotePhase = 'player_vote' | 'armtwist' | 'reveal';
  let phase: VotePhase = $state('player_vote');

  type VoteChoice = 'yes' | 'no' | 'abstain';
  let playerChoice: VoteChoice | null = $state(null);

  // NPC vote results (resolved after arm-twist)
  let npcVotes: NpcVoteResult[] = $state([]);
  let armtwistTarget: NPC | null = $state(null);
  let armtwistBark: string = $state('');
  let armtwistUsed = $state(false);
  let armtwistOfferMade: string | null = $state(null);

  // RNG
  const rng = createRng(gameState.seed + gameState.currentDay * 777 + (bill.number ?? 0));

  // Pre-calculate all NPC votes (before arm-twist)
  let preVotes: NpcVoteResult[] = $state([]);
  $effect(() => {
    const voteRng = createRng(gameState.seed + gameState.currentDay * 888);
    preVotes = gameState.npcs.map(npc => resolveNpcVote(npc, bill, gameState, voteRng));
  });

  // Find the best arm-twist target: a swing voter (NW between -20 and +20)
  let swingVoters = $derived(
    preVotes
      .filter(v => v.reason !== 'deal_locked' && v.reason !== 'promise_held' && Math.abs(v.nw) <= 20)
      .sort((a, b) => Math.abs(a.nw) - Math.abs(b.nw))
  );

  // Arm-twist offers available
  interface ArmtwistOffer {
    id: string;
    label: string;
    nwBoost: number;
    cost?: number;
  }

  function getArmtwistOffers(target: NPC): ArmtwistOffer[] {
    const offers: ArmtwistOffer[] = [
      { id: 'campaign', label: 'PROMISE TO CAMPAIGN IN THEIR DISTRICT', nwBoost: 15 },
      { id: 'vote_bill', label: 'PROMISE YOUR VOTE ON THEIR BILL', nwBoost: 12 },
      { id: 'party_line', label: 'REMIND THEM OF THE PARTY LINE', nwBoost: 8 },
      { id: 'nothing', label: 'SAY NOTHING — LET THEM VOTE THEIR CONSCIENCE', nwBoost: 0 },
    ];
    if (gameState.warChest >= 1200) {
      offers.splice(3, 0, {
        id: 'warchest', label: 'PROMISE WAR CHEST SUPPORT ($1,200)', nwBoost: 10, cost: 1200,
      });
    }
    return offers;
  }

  let armtwistOffers = $derived(armtwistTarget ? getArmtwistOffers(armtwistTarget) : []);

  function castPlayerVote(choice: VoteChoice) {
    playerChoice = choice;

    // Check if arm-twisting is available (player's bill, swing voters exist, not used)
    if (isPlayerBill && swingVoters.length > 0 && !armtwistUsed) {
      // Pick the closest-to-threshold swing voter
      const targetVote = swingVoters[0];
      armtwistTarget = gameState.npcs.find(n => n.id === targetVote.npcId) ?? null;
      if (armtwistTarget) {
        const breakdown = calculateNetWillingness(armtwistTarget, bill, gameState);
        armtwistBark = selectArmtwistBark(rng, armtwistTarget, breakdown.dominantDriver);
        phase = 'armtwist';
        return;
      }
    }

    // No arm-twist available — go straight to reveal
    finalizeVotes();
  }

  function makeArmtwistOffer(offer: ArmtwistOffer) {
    armtwistUsed = true;
    armtwistOfferMade = offer.id;

    if (offer.id !== 'nothing' && armtwistTarget) {
      // The offer modifies the target's vote resolution
      // Apply cost if any
      if (offer.cost) {
        gameStore.update(s => s ? { ...s, warChest: Math.max(0, s.warChest - offer.cost!) } : s);
      }

      // Log promise (binding, even if it fails)
      if (offer.id !== 'party_line') {
        const descMap: Record<string, string> = {
          campaign: `CAMPAIGN IN ${armtwistTarget.name.toUpperCase()}'S DISTRICT`,
          vote_bill: `VOTE YES ON ${armtwistTarget.name.toUpperCase()}'S BILL`,
          warchest: `PROVIDE WAR CHEST SUPPORT TO ${armtwistTarget.name.toUpperCase()}`,
        };
        gameStore.update(s => {
          if (!s) return s;
          return {
            ...s,
            promises: [...s.promises, {
              id: `prm_at_${Date.now()}`,
              day: s.currentDay,
              npcId: armtwistTarget!.id,
              description: descMap[offer.id] ?? 'ARM-TWIST PROMISE',
              type: 'other' as const,
              fulfilled: null,
            }],
          };
        });
      }

      // Re-resolve the target's vote with the NW boost
      const targetIdx = preVotes.findIndex(v => v.npcId === armtwistTarget!.id);
      if (targetIdx >= 0) {
        const oldVote = preVotes[targetIdx];
        const adjustedNw = oldVote.nw + offer.nwBoost;
        preVotes[targetIdx] = {
          ...oldVote,
          vote: adjustedNw >= 0 ? 'yes' : 'no',
          reason: adjustedNw >= 0 ? 'nw_positive' : 'nw_negative',
          nw: adjustedNw,
        };
      }
    }

    finalizeVotes();
  }

  function finalizeVotes() {
    npcVotes = [...preVotes];

    // Apply betrayal penalties for broken promises
    gameStore.update(s => {
      if (!s) return s;
      let sentiment = { ...s.sentiment };
      for (const vote of npcVotes) {
        if (vote.reason === 'promise_broke') {
          // GDD: -25 to -35 sentiment for betrayal
          const current = sentiment[vote.npcId] ?? 0;
          sentiment[vote.npcId] = clamp(current - 30, -100, 100);
        }
      }
      return { ...s, sentiment };
    });

    // Record for report cards
    if (playerChoice) {
      gameStore.update(s => {
        if (!s) return s;
        let updated = recordVoteForReportCards(s, bill, playerChoice === 'yes');
        return updateReportCards(updated);
      });
    }

    phase = 'reveal';
  }

  // ── Vote tallies ──
  let yesCount = $derived(
    npcVotes.filter(v => v.vote === 'yes').length + (playerChoice === 'yes' ? 1 : 0)
  );
  let noCount = $derived(
    npcVotes.filter(v => v.vote === 'no').length + (playerChoice === 'no' ? 1 : 0)
  );
  let abstainCount = $derived(playerChoice === 'abstain' ? 1 : 0);
  let threshold = 26;
  let passed = $derived(yesCount >= threshold);

  // Build member display list for hemicycle
  interface MemberDisplay { id: string; name: string; party: string; vote: string; isPlayer: boolean }
  let memberDisplay = $derived((): MemberDisplay[] => {
    const player: MemberDisplay = {
      id: 'player',
      name: 'YOU',
      party: gameState.player.party === 'feralist' ? 'F' : 'C',
      vote: playerChoice ?? 'pending',
      isPlayer: true,
    };
    const npcs: MemberDisplay[] = npcVotes.map(v => {
      const npc = gameState.npcs.find(n => n.id === v.npcId);
      return {
        id: v.npcId,
        name: npc?.name ?? 'UNKNOWN',
        party: npc?.party === 'feralist' ? 'F' : 'C',
        vote: v.vote,
        isPlayer: false,
      };
    });
    return [player, ...npcs];
  });

  function getSquareColor(vote: string): string {
    if (vote === 'yes') return '#006600';
    if (vote === 'no') return 'var(--primary-red)';
    if (vote === 'abstain') return 'var(--warm-amber)';
    return '#555';
  }

  // Count broken promises for display
  let brokenPromiseCount = $derived(npcVotes.filter(v => v.reason === 'promise_broke').length);
</script>

<div class="vote-screen">
  <div class="stage-background"></div>
  <div class="vote-content">
    <div class="panel main-panel">
      <div class="panel-header">
        FLOOR VOTE — Z.B. {bill.number}: THE {bill.name.toUpperCase()} ACT
      </div>
      <div class="panel-body">

        {#if phase === 'player_vote'}
          <div class="vote-prompt">
            <div class="prompt-text">THE SPEAKER CALLS THE VOTE. HOW DO YOU VOTE?</div>
            <div class="bill-tags">
              {#each bill.proTags as tag}
                <span class="tag tag-pro">+ {ISSUE_LABELS[tag]}</span>
              {/each}
              <span class="tag tag-anti">- {ISSUE_LABELS[bill.antiTag]}</span>
            </div>
            <div class="vote-buttons">
              <button class="btn vote-yes" onclick={() => castPlayerVote('yes')}>YEA</button>
              <button class="btn vote-no" onclick={() => castPlayerVote('no')}>NAY</button>
              <button class="btn vote-abstain" onclick={() => castPlayerVote('abstain')}>ABSTAIN</button>
            </div>
          </div>

        {:else if phase === 'armtwist'}
          <div class="armtwist-section">
            <div class="armtwist-header">ARM-TWIST OPPORTUNITY</div>
            {#if armtwistTarget}
              <div class="armtwist-npc">
                <span class="npc-name">{armtwistTarget.name.toUpperCase()}</span>
                <span class="npc-party party-{armtwistTarget.party}">{armtwistTarget.party.toUpperCase()}</span>
                <span class="sentiment-badge {getSentimentTier(gameState.sentiment[armtwistTarget.id] ?? 0)}">
                  {getSentimentTier(gameState.sentiment[armtwistTarget.id] ?? 0).toUpperCase()}
                </span>
              </div>
              <div class="bark-display">
                <div class="bark-text">"{armtwistBark.toUpperCase()}"</div>
              </div>
              <div class="armtwist-note">ONE ATTEMPT. THE PROMISE IS BINDING REGARDLESS OF OUTCOME. NO FEEDBACK UNTIL THE VOTE IS CAST.</div>
              <div class="armtwist-offers">
                {#each armtwistOffers as offer}
                  <button class="btn armtwist-btn" onclick={() => makeArmtwistOffer(offer)}>
                    {offer.label}
                  </button>
                {/each}
              </div>
            {/if}
          </div>

        {:else}
          <div class="vote-results">
            <!-- Hemicycle grid -->
            <div class="hemicycle">
              {#each memberDisplay() as member}
                <div
                  class="vote-square"
                  class:player-square={member.isPlayer}
                  style="background: {getSquareColor(member.vote)};"
                  title="{member.name} [{member.party}] — {member.vote.toUpperCase()}"
                ></div>
              {/each}
            </div>

            <!-- Tally -->
            <div class="tally-section">
              <div class="tally-row">
                <span class="tally-label yes-label">YEA</span>
                <div class="tally-bar-track">
                  <div class="tally-bar-fill yes-fill" style="width: {(yesCount / 50) * 100}%;"></div>
                  <div class="threshold-line" style="left: {(threshold / 50) * 100}%;"></div>
                </div>
                <span class="tally-count yes-count">{yesCount}</span>
              </div>
              <div class="tally-row">
                <span class="tally-label no-label">NAY</span>
                <div class="tally-bar-track">
                  <div class="tally-bar-fill no-fill" style="width: {(noCount / 50) * 100}%;"></div>
                </div>
                <span class="tally-count no-count">{noCount}</span>
              </div>
              {#if abstainCount > 0}
                <div class="tally-row">
                  <span class="tally-label">ABS</span>
                  <div class="tally-bar-track">
                    <div class="tally-bar-fill abstain-fill" style="width: {(abstainCount / 50) * 100}%;"></div>
                  </div>
                  <span class="tally-count">{abstainCount}</span>
                </div>
              {/if}
              <div class="threshold-note">THRESHOLD: {threshold} VOTES TO PASS</div>
            </div>

            <!-- Result banner -->
            <div class="result-display" class:result-passed={passed} class:result-failed={!passed}>
              {passed ? 'PASSED' : 'FAILED'}
            </div>

            <!-- Broken promise warning -->
            {#if brokenPromiseCount > 0}
              <div class="broken-promise-warning">
                {brokenPromiseCount} MEMBER{brokenPromiseCount > 1 ? 'S' : ''} BROKE THEIR PROMISE TO VOTE YES.
              </div>
            {/if}

            <!-- NPC vote list -->
            <div class="vote-list">
              {#each memberDisplay() as member}
                <div class="vote-list-entry">
                  <span class="voter-name" class:voter-player={member.isPlayer}>
                    {member.name}
                  </span>
                  <span class="voter-party">[{member.party}]</span>
                  <span class="voter-vote"
                    class:vote-y={member.vote === 'yes'}
                    class:vote-n={member.vote === 'no'}
                    class:vote-a={member.vote === 'abstain'}
                  >
                    {member.vote.toUpperCase()}
                  </span>
                </div>
              {/each}
            </div>
          </div>
        {/if}

      </div>
      <div class="intel-ledger">
        <span class="dim">///</span> FLOOR VOTE ON Z.B. {bill.number}
        {#if phase === 'reveal'}
          — {yesCount} YEA / {noCount} NAY
          {#if abstainCount > 0}/ {abstainCount} ABSTAIN{/if}
        {/if}
        <span class="dim">— DAY {gameState.currentDay}</span>
      </div>
    </div>

    {#if phase === 'reveal'}
      <div class="action-row">
        <button class="btn" onclick={onComplete}>PROCEED</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .vote-screen {
    width: 100%;
    height: 100%;
    position: relative;
    overflow: hidden;
  }
  .vote-content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 12px;
    gap: 10px;
  }
  .main-panel {
    width: 900px;
    max-height: 500px;
    display: flex;
    flex-direction: column;
  }
  .panel-body {
    flex: 1;
    padding: 10px 14px;
    overflow: hidden;
  }

  /* Vote prompt */
  .vote-prompt {
    text-align: center;
    padding: 30px 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 14px;
  }
  .prompt-text {
    font-size: 1.4rem;
    color: var(--black);
  }
  .bill-tags {
    display: flex;
    gap: 6px;
    flex-wrap: wrap;
    justify-content: center;
  }
  .tag {
    font-size: 0.95rem;
    padding: 1px 6px;
    border: 2px solid var(--black);
  }
  .tag-pro {
    background: #006600;
    color: white;
  }
  .tag-anti {
    background: var(--primary-red);
    color: white;
  }
  .vote-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    margin-top: 8px;
  }
  .vote-yes {
    background: #006600;
    color: #fff;
    font-size: 1.5rem;
    padding: 10px 30px;
    box-shadow: inset 2px 2px 0px #009900, inset -2px -2px 0px #003300;
  }
  .vote-yes:hover { background: #008800; }
  .vote-no {
    background: var(--primary-red);
    color: #fff;
    font-size: 1.5rem;
    padding: 10px 30px;
    box-shadow: inset 2px 2px 0px #cc4444, inset -2px -2px 0px #660000;
  }
  .vote-no:hover { background: #cc0000; }
  .vote-abstain {
    background: #666;
    color: #fff;
    font-size: 1.5rem;
    padding: 10px 30px;
    box-shadow: inset 2px 2px 0px #888, inset -2px -2px 0px #444;
  }
  .vote-abstain:hover { background: #888; }

  /* Arm-twist section */
  .armtwist-section {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 10px;
  }
  .armtwist-header {
    font-size: 1.3rem;
    color: var(--warm-amber);
    text-align: center;
    border-bottom: 2px solid var(--warm-amber);
    padding-bottom: 4px;
  }
  .armtwist-npc {
    display: flex;
    gap: 10px;
    align-items: center;
    justify-content: center;
  }
  .npc-name {
    font-size: 1.2rem;
    font-weight: bold;
  }
  .npc-party {
    font-size: 0.95rem;
    padding: 1px 6px;
    border: 1px solid var(--black);
  }
  .party-feralist { background: var(--primary-red); color: white; }
  .party-communalist { background: var(--ega-blue); color: white; }
  .sentiment-badge {
    font-size: 1rem;
    padding: 2px 8px;
    border: 2px solid var(--black);
    background: var(--marble);
  }
  .bark-display {
    padding: 10px 12px;
    background: #000;
    border: 2px solid var(--black);
    min-height: 50px;
    display: flex;
    align-items: center;
  }
  .bark-text {
    font-size: 1.1rem;
    color: var(--phosphor-green);
    line-height: 1.3;
  }
  .armtwist-note {
    font-size: 0.9rem;
    color: var(--warm-amber);
    text-align: center;
  }
  .armtwist-offers {
    display: flex;
    flex-direction: column;
    gap: 6px;
    max-width: 500px;
    margin: 0 auto;
  }
  .armtwist-btn {
    text-align: left;
    font-size: 1rem;
    padding: 6px 12px;
  }

  /* Results area */
  .vote-results {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto auto;
    gap: 10px;
  }

  /* Hemicycle grid */
  .hemicycle {
    display: flex;
    flex-wrap: wrap;
    gap: 3px;
    padding: 6px;
    background: #1a1a1a;
    border: 2px solid var(--black);
    align-content: flex-start;
    max-width: 280px;
  }
  .vote-square {
    width: 20px;
    height: 20px;
    border: 1px solid #000;
  }
  .player-square {
    border: 2px solid var(--gold);
  }

  /* Tally */
  .tally-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
    justify-content: center;
  }
  .tally-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .tally-label {
    width: 40px;
    font-size: 1.1rem;
    text-align: right;
  }
  .yes-label { color: #006600; }
  .no-label { color: var(--primary-red); }
  .tally-bar-track {
    flex: 1;
    height: 16px;
    background: #333;
    border: 2px solid var(--black);
    position: relative;
  }
  .tally-bar-fill { height: 100%; }
  .yes-fill { background: #006600; }
  .no-fill { background: var(--primary-red); }
  .abstain-fill { background: var(--warm-amber); }
  .threshold-line {
    position: absolute;
    top: -2px;
    bottom: -2px;
    width: 2px;
    background: var(--gold);
  }
  .tally-count {
    width: 30px;
    font-size: 1.3rem;
    text-align: left;
  }
  .yes-count { color: #006600; }
  .no-count { color: var(--primary-red); }
  .threshold-note {
    font-size: 0.95rem;
    color: #666;
    text-align: center;
    margin-top: 2px;
  }

  /* Result banner */
  .result-display {
    grid-column: 1 / -1;
    text-align: center;
    font-size: 2.5rem;
    padding: 8px;
    border: 3px solid var(--black);
  }
  .result-passed { background: #006600; color: #fff; }
  .result-failed { background: var(--primary-red); color: #fff; }

  /* Broken promise warning */
  .broken-promise-warning {
    grid-column: 1 / -1;
    text-align: center;
    font-size: 1rem;
    color: var(--primary-red);
    padding: 4px 8px;
    border: 2px solid var(--primary-red);
    background: #ffcccc;
  }

  /* Vote list */
  .vote-list {
    grid-column: 1 / -1;
    display: flex;
    flex-wrap: wrap;
    gap: 2px 10px;
    max-height: 120px;
    overflow-y: auto;
    font-size: 0.9rem;
    padding: 4px;
    background: var(--marble-white);
    border: 1px solid #999;
  }
  .vote-list-entry {
    display: flex;
    gap: 4px;
    width: 200px;
  }
  .voter-name { flex: 1; color: #333; }
  .voter-player { color: var(--ega-blue); }
  .voter-party { color: #666; }
  .voter-vote { width: 55px; text-align: right; }
  .vote-y { color: #006600; }
  .vote-n { color: var(--primary-red); }
  .vote-a { color: var(--warm-amber); }

  .action-row {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
  .intel-ledger {
    padding: 4px 10px;
    background: #111;
    color: var(--phosphor-green);
    font-size: 0.95rem;
    border-top: 2px solid var(--black);
  }
  .dim { color: var(--phosphor-dim); }
</style>
