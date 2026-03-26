<script lang="ts">
  import type { GameState } from '../../core/types';
  import { createRng, getSentimentTier } from '../../core/utils';
  import { recordVoteForReportCards, updateReportCards } from '../../core/turn-processor';
  import { gameStore } from '../../stores/game';

  export let gameState: GameState;
  export let onComplete: () => void;
  export let billId: string | undefined = undefined;

  $: bill = billId
    ? ([gameState.playerBill, ...gameState.npcBills].find(b => b.id === billId) ?? gameState.playerBill)
    : gameState.playerBill;

  type VoteChoice = 'yes' | 'no' | 'abstain';
  type MemberVote = {
    id: string;
    name: string;
    species: string;
    party: string;
    vote: VoteChoice | 'pending';
    isPlayer: boolean;
  };

  let playerVoted = false;
  let playerChoice: VoteChoice | null = null;
  let votesRevealed = false;
  let members: MemberVote[] = [];

  // Initialize member list
  $: {
    const npcMembers: MemberVote[] = gameState.npcs.map(npc => ({
      id: npc.id,
      name: npc.name,
      species: npc.species,
      party: npc.party === 'feralist' ? 'F' : 'C',
      vote: 'pending' as const,
      isPlayer: false,
    }));
    const playerMember: MemberVote = {
      id: 'player',
      name: 'YOU',
      species: gameState.player.species,
      party: gameState.player.party === 'feralist' ? 'F' : 'C',
      vote: 'pending' as const,
      isPlayer: true,
    };
    members = [playerMember, ...npcMembers];
  }

  function castPlayerVote(choice: VoteChoice) {
    playerChoice = choice;
    playerVoted = true;

    // Update player vote in members
    members = members.map(m =>
      m.isPlayer ? { ...m, vote: choice } : m
    );

    // Resolve all NPC votes
    const rng = createRng(gameState.seed + gameState.currentDay * 777);
    members = members.map(m => {
      if (m.isPlayer) return m;
      const sentScore = gameState.sentiment[m.id] ?? 0;
      const tier = getSentimentTier(sentScore);
      let vote: VoteChoice;
      if (tier === 'allied' || tier === 'warm') {
        vote = 'yes';
      } else if (tier === 'hostile' || tier === 'cold') {
        vote = 'no';
      } else {
        // Neutral: 50/50
        vote = rng() > 0.5 ? 'yes' : 'no';
      }
      return { ...m, vote };
    });
    votesRevealed = true;

    // Record for report cards
    gameStore.update(s => {
      if (!s) return s;
      let updated = recordVoteForReportCards(s, bill, choice === 'yes');
      return updateReportCards(updated);
    });
  }

  $: yesCount = members.filter(m => m.vote === 'yes').length;
  $: noCount = members.filter(m => m.vote === 'no').length;
  $: abstainCount = members.filter(m => m.vote === 'abstain').length;
  $: threshold = 26;
  $: passed = yesCount >= threshold;

  function getSquareColor(vote: string): string {
    if (vote === 'yes') return '#006600';
    if (vote === 'no') return 'var(--primary-red)';
    if (vote === 'abstain') return 'var(--warm-amber)';
    return '#555';
  }
</script>

<div class="vote-screen">
  <div class="stage-background"></div>
  <div class="vote-content">
    <div class="panel main-panel">
      <div class="panel-header">
        Floor Vote — HB-{bill.number}: {bill.name}
      </div>
      <div class="panel-body">
        {#if !playerVoted}
          <div class="vote-prompt">
            <div class="prompt-text">The Speaker calls the vote. How do you vote?</div>
            <div class="vote-buttons">
              <button class="btn vote-yes" on:click={() => castPlayerVote('yes')}>Yes</button>
              <button class="btn vote-no" on:click={() => castPlayerVote('no')}>No</button>
              <button class="btn vote-abstain" on:click={() => castPlayerVote('abstain')}>Abstain</button>
            </div>
          </div>
        {:else}
          <div class="vote-results">
            <!-- Hemicycle grid -->
            <div class="hemicycle">
              {#each members as member}
                <div
                  class="vote-square"
                  class:player-square={member.isPlayer}
                  style="background: {getSquareColor(member.vote)};"
                  title="{member.name} ({member.species}) [{member.party}] — {typeof member.vote === 'string' ? member.vote.toUpperCase() : 'PENDING'}"
                ></div>
              {/each}
            </div>

            <!-- Tally -->
            <div class="tally-section">
              <div class="tally-row">
                <span class="tally-label yes-label">Yes</span>
                <div class="tally-bar-track">
                  <div class="tally-bar-fill yes-fill" style="width: {(yesCount / 50) * 100}%;"></div>
                  <div class="threshold-line" style="left: {(threshold / 50) * 100}%;"></div>
                </div>
                <span class="tally-count yes-count">{yesCount}</span>
              </div>
              <div class="tally-row">
                <span class="tally-label no-label">No</span>
                <div class="tally-bar-track">
                  <div class="tally-bar-fill no-fill" style="width: {(noCount / 50) * 100}%;"></div>
                </div>
                <span class="tally-count no-count">{noCount}</span>
              </div>
              {#if abstainCount > 0}
                <div class="tally-row">
                  <span class="tally-label">Abs</span>
                  <div class="tally-bar-track">
                    <div class="tally-bar-fill abstain-fill" style="width: {(abstainCount / 50) * 100}%;"></div>
                  </div>
                  <span class="tally-count">{abstainCount}</span>
                </div>
              {/if}
              <div class="threshold-note">Threshold: {threshold} votes to pass</div>
            </div>

            <!-- Result -->
            {#if votesRevealed}
              <div class="result-display" class:result-passed={passed} class:result-failed={!passed}>
                {passed ? 'PASSED' : 'FAILED'}
              </div>
            {/if}

            <!-- NPC vote list -->
            <div class="vote-list">
              {#each members as member}
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
                    {typeof member.vote === 'string' ? member.vote.toUpperCase() : 'PENDING'}
                  </span>
                </div>
              {/each}
            </div>
          </div>
        {/if}
      </div>
      <div class="intel-ledger">
        <span class="dim">///</span> Floor vote on HB-{bill.number}
        {#if votesRevealed}
          — {yesCount} YEA / {noCount} NAY
          {#if abstainCount > 0}/ {abstainCount} ABSTAIN{/if}
        {/if}
        <span class="dim">— Day {gameState.currentDay}</span>
      </div>
    </div>

    {#if votesRevealed}
      <div class="action-row">
        <button class="btn" on:click={onComplete}>Proceed</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .vote-screen {
    width: 980px;
    height: 560px;
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
  }
  .panel-body {
    padding: 10px 14px;
  }

  /* Vote prompt */
  .vote-prompt {
    text-align: center;
    padding: 40px 20px;
  }
  .prompt-text {
    font-size: 1.4rem;
    color: var(--black);
    margin-bottom: 20px;
  }
  .vote-buttons {
    display: flex;
    gap: 12px;
    justify-content: center;
  }
  .vote-yes {
    background: #006600;
    color: #fff;
    font-size: 1.5rem;
    padding: 10px 30px;
    box-shadow: inset 2px 2px 0px #009900, inset -2px -2px 0px #003300;
  }
  .vote-yes:hover {
    background: #008800;
  }
  .vote-no {
    background: var(--primary-red);
    color: #fff;
    font-size: 1.5rem;
    padding: 10px 30px;
    box-shadow: inset 2px 2px 0px #cc4444, inset -2px -2px 0px #660000;
  }
  .vote-no:hover {
    background: #cc0000;
  }
  .vote-abstain {
    background: #666;
    color: #fff;
    font-size: 1.5rem;
    padding: 10px 30px;
    box-shadow: inset 2px 2px 0px #888, inset -2px -2px 0px #444;
  }
  .vote-abstain:hover {
    background: #888;
  }

  /* Results area */
  .vote-results {
    display: grid;
    grid-template-columns: 1fr 1fr;
    grid-template-rows: auto auto;
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
  .yes-label {
    color: #006600;
  }
  .no-label {
    color: var(--primary-red);
  }
  .tally-bar-track {
    flex: 1;
    height: 16px;
    background: #333;
    border: 2px solid var(--black);
    position: relative;
  }
  .tally-bar-fill {
    height: 100%;
  }
  .yes-fill {
    background: #006600;
  }
  .no-fill {
    background: var(--primary-red);
  }
  .abstain-fill {
    background: var(--warm-amber);
  }
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
  .yes-count {
    color: #006600;
  }
  .no-count {
    color: var(--primary-red);
  }
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
  .result-passed {
    background: #006600;
    color: #fff;
  }
  .result-failed {
    background: var(--primary-red);
    color: #fff;
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
    background: #f0f0f0;
    border: 1px solid #999;
  }
  .vote-list-entry {
    display: flex;
    gap: 4px;
    width: 200px;
  }
  .voter-name {
    flex: 1;
    color: #333;
  }
  .voter-player {
    color: var(--ega-blue);
  }
  .voter-party {
    color: #666;
  }
  .voter-vote {
    width: 55px;
    text-align: right;
  }
  .vote-y {
    color: #006600;
  }
  .vote-n {
    color: var(--primary-red);
  }
  .vote-a {
    color: var(--warm-amber);
  }

  .action-row {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
</style>
