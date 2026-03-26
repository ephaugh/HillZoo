<script lang="ts">
  import type { GameState, Bill, Committee, NPC } from '../../core/types';
  import { ISSUE_LABELS, COMMITTEE_ISSUES, CROSS_CUTTING_REFERRAL, type CrossCuttingIssue } from '../../core/types';
  import { getSentimentTier } from '../../core/utils';
  import { getNpcRoleLabel } from '../../core/roles';
  import { gameStore } from '../../stores/game';
  import { recordVoteForReportCards, updateReportCards } from '../../core/turn-processor';

  let { gameState, onComplete }: { gameState: GameState; onComplete: () => void } = $props();

  // Find the bill being heard from today's schedule
  let hearingEntry = $derived(
    gameState.schedule.find(
      e => e.day === gameState.currentDay && e.slot === gameState.currentSlot && e.type === 'committee_hearing'
    )
  );

  let bill = $derived((): Bill => {
    if (hearingEntry?.billId) {
      const found = [gameState.playerBill, ...gameState.npcBills].find(b => b.id === hearingEntry!.billId);
      if (found) return found;
    }
    return gameState.playerBill;
  });

  // Find the committee via proper referral mapping
  let committee = $derived((): Committee => {
    const b = bill();
    for (const tag of b.proTags) {
      if ((COMMITTEE_ISSUES as readonly string[]).includes(tag)) {
        const c = gameState.committees.find(c => c.issue === tag);
        if (c) return c;
      }
      if (tag in CROSS_CUTTING_REFERRAL) {
        const referred = CROSS_CUTTING_REFERRAL[tag as CrossCuttingIssue];
        const c = gameState.committees.find(c => c.issue === referred);
        if (c) return c;
      }
    }
    return gameState.committees[0];
  });

  let chairNpc = $derived(gameState.npcs.find(n => n.id === committee().chair));

  let isPlayerBill = $derived(bill().author === 'player');
  let playerOnCommittee = $derived(committee().members.includes('player'));

  interface CommitteeMember {
    id: string;
    name: string;
    species: string;
    party: string;
    tier: string;
    isChair: boolean;
    isPlayer: boolean;
    role: string;
    portraitHue: number;
  }

  let committeeMembers = $derived((): CommitteeMember[] => {
    return committee().members.map(mId => {
      if (mId === 'player') {
        return {
          id: 'player',
          name: `${gameState.player.species} (YOU)`,
          species: gameState.player.species,
          party: gameState.player.party,
          tier: '--',
          isChair: false,
          isPlayer: true,
          role: '',
          portraitHue: gameState.player.species.length * 37 % 360,
        };
      }
      const npc = gameState.npcs.find(n => n.id === mId);
      if (!npc) return null;
      const sentScore = gameState.sentiment[mId] ?? 0;
      const tier = getSentimentTier(sentScore);
      const role = getNpcRoleLabel(npc.id, gameState);
      return {
        id: mId,
        name: npc.name,
        species: npc.species,
        party: npc.party,
        tier,
        isChair: mId === committee().chair,
        isPlayer: false,
        role,
        portraitHue: npc.name.length * 37 % 360,
      };
    }).filter((m): m is CommitteeMember => m !== null);
  });

  let npcMembers = $derived(committeeMembers().filter(m => !m.isPlayer));

  // Count likely yes/no based on NPC sentiment tiers (player not counted here)
  let likelyYes = $derived(npcMembers.filter(m => m.tier === 'warm' || m.tier === 'allied').length);
  let likelyNo = $derived(npcMembers.filter(m => m.tier === 'cold' || m.tier === 'hostile').length);
  let undecided = $derived(npcMembers.length - likelyYes - likelyNo);
  let totalMembers = $derived(committeeMembers().length);
  let majority = $derived(Math.ceil(totalMembers / 2));

  // Hearing phases
  type Phase = 'testimony' | 'player_vote' | 'deliberation' | 'result';
  let phase: Phase = $state('testimony');

  // Player's vote choice
  let playerVote: 'yes' | 'no' | 'abstain' | null = $state(null);

  // Result
  let hearingPassed = $state(false);
  let finalYes = $state(0);
  let finalNo = $state(0);

  function proceedToPlayerVote() {
    // If player is on the committee, let them vote. Otherwise skip to deliberation.
    if (playerOnCommittee) {
      phase = 'player_vote';
    } else {
      resolveVote();
    }
  }

  function castPlayerVote(vote: 'yes' | 'no' | 'abstain') {
    playerVote = vote;
    resolveVote();
  }

  function resolveVote() {
    let yesVotes = 0;
    let noVotes = 0;

    // Player's vote
    if (playerVote === 'yes') yesVotes++;
    else if (playerVote === 'no') noVotes++;
    // abstain = neither

    // NPC votes
    for (const member of npcMembers) {
      if (member.tier === 'warm' || member.tier === 'allied') yesVotes++;
      else if (member.tier === 'cold' || member.tier === 'hostile') noVotes++;
      else if (member.tier === 'neutral') {
        if (member.isChair) yesVotes++; // Chair lean
        else if (Math.random() > 0.5) yesVotes++;
        else noVotes++;
      }
    }

    finalYes = yesVotes;
    finalNo = noVotes;
    hearingPassed = yesVotes >= majority;

    // Record vote for report cards (player voted yes if they voted yes)
    const votedYes = playerVote === 'yes';
    gameStore.update(s => {
      if (!s) return s;
      let updated = recordVoteForReportCards(s, bill(), votedYes);
      return updateReportCards(updated);
    });

    // Update game state: advance bill stage
    if (hearingPassed) {
      gameStore.update(s => {
        if (!s) return s;
        const b = bill();
        if (b.author === 'player') {
          return { ...s, playerBill: { ...s.playerBill, stage: 'markup' } };
        } else {
          return {
            ...s,
            npcBills: s.npcBills.map(nb => nb.id === b.id ? { ...nb, stage: 'markup' } : nb),
          };
        }
      });
    } else {
      // Bill dies in committee
      gameStore.update(s => {
        if (!s) return s;
        const b = bill();
        if (b.author === 'player') {
          return { ...s, playerBill: { ...s.playerBill, stage: 'dead' } };
        } else {
          return {
            ...s,
            npcBills: s.npcBills.map(nb => nb.id === b.id ? { ...nb, stage: 'dead' } : nb),
          };
        }
      });
    }

    phase = 'result';
  }
</script>

<div class="hearing-screen">
  <div class="panel hearing-panel">
    <div class="panel-header" style="display: flex; justify-content: space-between;">
      <span>COMMITTEE HEARING &mdash; {committee().name.toUpperCase()}</span>
      <span>DAY {gameState.currentDay}</span>
    </div>
    <div class="hearing-body">

      <!-- Bill Info Bar -->
      <div class="bill-bar">
        <div class="bill-name">
          {#if isPlayerBill}YOUR BILL: {:else}{gameState.npcs.find(n => n.id === bill().author)?.name.toUpperCase()}'S BILL: {/if}
          Z.B. {bill().number}, THE {bill().name.toUpperCase()} ACT
        </div>
        <div class="bill-tags">
          {#each bill().proTags as tag}
            <span class="tag tag-pro">+ {ISSUE_LABELS[tag]}</span>
          {/each}
          <span class="tag tag-anti">- {ISSUE_LABELS[bill().antiTag]}</span>
        </div>
      </div>

      <div class="hearing-columns">
        <!-- Left: Committee Members -->
        <div class="members-column">
          <div class="col-title">COMMITTEE ({committeeMembers().length} MEMBERS)</div>
          <div class="members-list">
            {#each committeeMembers() as member}
              <div class="member-row" class:chair-row={member.isChair} class:player-row={member.isPlayer}>
                <div class="member-portrait" style="background-color: hsl({member.portraitHue}, 35%, 30%)"></div>
                <div class="member-info">
                  <span class="member-name">
                    {member.name}
                  </span>
                  {#if member.isPlayer}
                    <span class="badge badge-player">YOU</span>
                  {/if}
                  {#if member.isChair}
                    <span class="badge badge-chair">CHAIR</span>
                  {/if}
                  {#if member.role && !member.isChair}
                    <span class="badge badge-role">{member.role}</span>
                  {/if}
                </div>
                <span class="member-party">{member.party === 'feralist' ? 'F' : 'C'}</span>
                {#if member.isPlayer}
                  <span class="member-tier" style="color: var(--phosphor-green);">--</span>
                {:else}
                  <span class="member-tier {member.tier}">{member.tier.toUpperCase()}</span>
                {/if}
              </div>
            {/each}
          </div>
        </div>

        <!-- Right: Hearing Content -->
        <div class="content-column">
          {#if phase === 'testimony'}
            <div class="phase-section">
              <div class="col-title">TESTIMONY</div>
              <div class="testimony-text">
                <p>THE COMMITTEE HEARS TESTIMONY ON THE MERITS OF THE BILL.</p>
                <p style="margin-top: 8px;">WITNESSES PRESENT EVIDENCE ON {ISSUE_LABELS[bill().proTags[0]].toUpperCase()}
                  AND {ISSUE_LABELS[bill().proTags[1]].toUpperCase()}.</p>
                <p style="margin-top: 8px;">OPPONENTS RAISE CONCERNS ABOUT THE BILL'S IMPACT ON
                  {ISSUE_LABELS[bill().antiTag].toUpperCase()}.</p>
                {#if chairNpc}
                  <p style="margin-top: 12px; color: var(--gold);">
                    CHAIR {chairNpc.name.toUpperCase()} PRESIDES.
                  </p>
                {/if}
              </div>
              <div class="vote-preview">
                <div class="col-title" style="margin-top: 12px;">PRELIMINARY READ</div>
                <div class="tally-row">
                  <span class="tally-yes">LIKELY YES: {likelyYes}</span>
                  <span class="tally-und">UNDECIDED: {undecided}</span>
                  <span class="tally-no">LIKELY NO: {likelyNo}</span>
                </div>
                <div class="tally-note">{majority} VOTES NEEDED TO ADVANCE</div>
              </div>
            </div>
          {:else if phase === 'player_vote'}
            <div class="phase-section">
              <div class="col-title">YOUR VOTE</div>
              <div class="testimony-text">
                <p>THE CHAIR CALLS FOR A COMMITTEE VOTE ON Z.B. {bill().number}.</p>
                <p style="margin-top: 8px;">AS A MEMBER OF THIS COMMITTEE, YOU MUST CAST YOUR VOTE.</p>
              </div>
              <div class="player-vote-buttons">
                <button class="btn vote-btn vote-yes" onclick={() => castPlayerVote('yes')}>VOTE YES</button>
                <button class="btn vote-btn vote-no" onclick={() => castPlayerVote('no')}>VOTE NO</button>
                <button class="btn vote-btn vote-abstain" onclick={() => castPlayerVote('abstain')}>ABSTAIN</button>
              </div>
            </div>
          {:else if phase === 'result'}
            <div class="phase-section">
              <div class="col-title">COMMITTEE VOTE</div>
              <div class="vote-tally-result">
                <span class="tally-yes">YES: {finalYes}</span>
                <span class="tally-no">NO: {finalNo}</span>
                {#if playerVote}
                  <span class="tally-player">(YOU VOTED {playerVote.toUpperCase()})</span>
                {/if}
              </div>
              <div class="result-banner" class:result-pass={hearingPassed} class:result-fail={!hearingPassed}>
                {#if hearingPassed}
                  BILL ADVANCES ({finalYes}-{finalNo})
                {:else}
                  BILL DEFEATED ({finalYes}-{finalNo})
                {/if}
              </div>
              <div class="result-text">
                {#if hearingPassed}
                  <p>THE COMMITTEE VOTES TO ADVANCE Z.B. {bill().number} TO MARKUP.</p>
                  <p style="margin-top: 6px;">COMMITTEE MEMBERS WILL NOW PROPOSE AMENDMENTS.</p>
                {:else}
                  <p>THE COMMITTEE VOTES AGAINST ADVANCING Z.B. {bill().number}.</p>
                  <p style="margin-top: 6px; color: var(--primary-red);">THE BILL IS DEAD.</p>
                {/if}
              </div>
            </div>
          {/if}
        </div>
      </div>

      <!-- Intel Ledger -->
      <div class="intel-ledger">
        > HEARING: {committee().name.toUpperCase()} &mdash; Z.B. {bill().number}
        {#if phase === 'result'}
          &mdash; {hearingPassed ? 'ADVANCED TO MARKUP' : 'DEFEATED'}
        {/if}
      </div>
    </div>

    <div class="hearing-footer">
      {#if phase === 'testimony'}
        <button class="btn" onclick={proceedToPlayerVote}>CALL THE VOTE</button>
      {:else if phase === 'result'}
        <button class="btn" onclick={onComplete}>
          {#if hearingPassed}PROCEED TO MARKUP{:else}CONTINUE{/if}
        </button>
      {/if}
    </div>
  </div>
</div>

<style>
  .hearing-screen {
    width: 100%;
    height: 100%;
    padding: 14px;
  }
  .hearing-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .hearing-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .bill-bar {
    padding: 8px 14px;
    background: var(--marble-white);
    border-bottom: 2px solid var(--black);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .bill-name {
    font-size: 1.2rem;
    color: var(--mahogany);
    font-weight: bold;
  }
  .bill-tags {
    display: flex;
    gap: 4px;
  }
  .tag {
    font-size: 0.95rem;
    padding: 1px 6px;
    border: 2px solid var(--black);
    color: white;
  }
  .tag-pro { background: #006600; }
  .tag-anti { background: var(--primary-red); }
  .hearing-columns {
    flex: 1;
    display: flex;
    gap: 0;
    overflow: hidden;
  }
  .members-column {
    width: 320px;
    border-right: 3px solid var(--black);
    display: flex;
    flex-direction: column;
  }
  .content-column {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .col-title {
    font-size: 1.05rem;
    color: var(--mahogany);
    padding: 4px 10px;
    background: var(--marble-dark);
    border-bottom: 1px solid #aaa;
    font-weight: bold;
  }
  .members-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .members-list::-webkit-scrollbar { display: none; }
  .member-row {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 4px 8px;
    border-bottom: 1px solid #aaa;
    font-size: 1rem;
  }
  .chair-row {
    background: var(--gold-light);
    border-bottom: 2px solid var(--gold);
  }
  .member-portrait {
    width: 20px;
    height: 20px;
    border: 2px solid var(--black);
    flex-shrink: 0;
  }
  .member-info {
    flex: 1;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .member-name {
    font-size: 1rem;
  }
  .badge {
    font-size: 0.85rem;
    padding: 0 4px;
    border: 1px solid var(--black);
  }
  .badge-player {
    background: var(--ega-cyan);
    color: white;
  }
  .badge-chair {
    background: var(--mahogany);
    color: var(--gold);
  }
  .badge-role {
    background: var(--marble-dark);
    color: var(--black);
  }
  .player-row {
    background: #1a3a3a;
    border-bottom: 2px solid var(--ega-cyan);
  }
  .player-row .member-name {
    color: var(--phosphor-green);
  }
  .member-party {
    width: 20px;
    text-align: center;
    color: #555;
    font-size: 0.95rem;
  }
  .member-tier {
    width: 65px;
    text-align: right;
    font-size: 0.95rem;
    font-weight: bold;
  }
  .phase-section {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .testimony-text {
    padding: 12px 14px;
    font-size: 1.15rem;
    color: var(--black);
    line-height: 1.3;
  }
  .vote-preview {
    padding: 0 14px;
  }
  .tally-row {
    display: flex;
    gap: 12px;
    padding: 6px 0;
    font-size: 1.15rem;
  }
  .tally-yes { color: #006600; font-weight: bold; }
  .tally-und { color: var(--warm-amber); font-weight: bold; }
  .tally-no { color: var(--primary-red); font-weight: bold; }
  .tally-note {
    font-size: 1rem;
    color: #555;
  }
  .player-vote-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
    padding: 20px 14px;
  }
  .vote-btn {
    padding: 12px 24px;
    font-size: 1.4rem;
  }
  .vote-yes:hover { background: #006600; color: white; }
  .vote-no:hover { background: var(--primary-red); color: white; }
  .vote-abstain:hover { background: #555; color: white; }
  .vote-tally-result {
    display: flex;
    gap: 16px;
    justify-content: center;
    padding: 10px 14px;
    font-size: 1.3rem;
  }
  .tally-player {
    color: var(--ega-cyan);
    font-size: 1.1rem;
  }
  .result-banner {
    margin: 8px 14px 8px;
    padding: 10px;
    text-align: center;
    font-size: 1.8rem;
    font-weight: bold;
    border: 3px solid var(--black);
  }
  .result-pass {
    background: #006600;
    color: white;
  }
  .result-fail {
    background: var(--primary-red);
    color: white;
  }
  .result-text {
    padding: 8px 14px;
    font-size: 1.15rem;
    line-height: 1.3;
  }
  .intel-ledger {
    background: #000;
    padding: 6px 10px;
    font-size: 1.05rem;
    border-top: 3px solid var(--black);
    color: var(--phosphor-green);
    line-height: 1.3;
    margin-top: auto;
  }
  .hearing-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
