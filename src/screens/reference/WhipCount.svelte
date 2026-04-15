<script lang="ts">
  import type { GameState, NPC } from '../../core/types';
  import { getSentimentTier } from '../../core/utils';

  export let gameState: GameState;
  export let onClose: () => void;

  function getNpcName(npcId: string): string {
    const npc = gameState.npcs.find(n => n.id === npcId);
    return npc ? npc.name : 'UNKNOWN';
  }

  function getPartyLabel(npc: NPC): string {
    return npc.party === 'feralist' ? 'F' : 'C';
  }

  $: categorized = (() => {
    const yes: NPC[] = [];
    const undecided: NPC[] = [];
    const no: NPC[] = [];

    for (const npc of gameState.npcs) {
      const score = gameState.sentiment[npc.id] ?? 0;
      const tier = getSentimentTier(score);
      if (tier === 'warm' || tier === 'allied') {
        yes.push(npc);
      } else if (tier === 'neutral') {
        undecided.push(npc);
      } else {
        no.push(npc);
      }
    }

    return { yes, undecided, no };
  })();
</script>

<div class="panel reference-screen">
  <div class="panel-header header-row">
    <span>WHIP COUNT</span>
    <button class="btn btn-close" on:click={onClose}>CLOSE</button>
  </div>

  <div class="threshold-bar">
    <span>26 VOTES NEEDED TO PASS</span>
    <span>(PLUS YOUR VOTE = {categorized.yes.length + 1} LIKELY YES)</span>
  </div>

  <div class="columns">
    <!-- YES Column -->
    <div class="vote-column yes-col">
      <div class="column-header yes-header">YES ({categorized.yes.length})</div>
      <div class="column-list">
        {#each categorized.yes as npc (npc.id)}
          {@const tier = getSentimentTier(gameState.sentiment[npc.id] ?? 0)}
          <div class="npc-entry">
            <span class="npc-name">{npc.name}</span>
            <span class="npc-party">({getPartyLabel(npc)})</span>
            <span class="npc-tier {tier}">{tier.toUpperCase()}</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- UNDECIDED Column -->
    <div class="vote-column undecided-col">
      <div class="column-header undecided-header">UNDECIDED ({categorized.undecided.length})</div>
      <div class="column-list">
        {#each categorized.undecided as npc (npc.id)}
          <div class="npc-entry">
            <span class="npc-name">{npc.name}</span>
            <span class="npc-party">({getPartyLabel(npc)})</span>
            <span class="npc-tier neutral">NEUTRAL</span>
          </div>
        {/each}
      </div>
    </div>

    <!-- NO Column -->
    <div class="vote-column no-col">
      <div class="column-header no-header">NO ({categorized.no.length})</div>
      <div class="column-list">
        {#each categorized.no as npc (npc.id)}
          {@const tier = getSentimentTier(gameState.sentiment[npc.id] ?? 0)}
          <div class="npc-entry">
            <span class="npc-name">{npc.name}</span>
            <span class="npc-party">({getPartyLabel(npc)})</span>
            <span class="npc-tier {tier}">{tier.toUpperCase()}</span>
          </div>
        {/each}
      </div>
    </div>
  </div>

  <div class="intel-ledger">
    <span>YES: {categorized.yes.length}</span>
    <span class="dim"> / </span>
    <span style="color: var(--warm-amber)">UNDECIDED: {categorized.undecided.length}</span>
    <span class="dim"> / </span>
    <span style="color: var(--primary-red)">NO: {categorized.no.length}</span>
    <span class="dim"> &mdash; 26 VOTES NEEDED TO PASS</span>
  </div>
</div>

<style>
  .reference-screen {
    width: 980px;
    height: 560px;
    display: flex;
    flex-direction: column;
  }
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btn-close {
    padding: 2px 10px;
    font-size: 1rem;
  }
  .threshold-bar {
    display: flex;
    justify-content: space-between;
    padding: 4px 12px;
    background: var(--marble-dark);
    border-bottom: 3px solid var(--black);
    font-size: 1rem;
    color: var(--black);
    font-weight: bold;
  }
  .columns {
    flex: 1;
    display: flex;
    min-height: 0;
  }
  .vote-column {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 3px solid var(--black);
    min-height: 0;
  }
  .vote-column:last-child {
    border-right: none;
  }
  .column-header {
    padding: 4px 8px;
    font-size: 1.1rem;
    font-weight: bold;
    text-align: center;
    border-bottom: 2px solid var(--black);
  }
  .yes-header {
    background: #003300;
    color: var(--phosphor-green);
  }
  .undecided-header {
    background: #332200;
    color: var(--warm-amber);
  }
  .no-header {
    background: #330000;
    color: #ff4444;
  }
  .column-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 2px 0;
  }
  .column-list::-webkit-scrollbar {
    display: none;
  }
  .npc-entry {
    display: flex;
    align-items: center;
    padding: 2px 8px;
    font-size: 0.95rem;
    border-bottom: 1px solid #aaa;
    gap: 4px;
  }
  .npc-entry:hover {
    background: var(--marble-white);
  }
  .npc-name {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .npc-party {
    color: #666;
    flex-shrink: 0;
    font-size: 0.9rem;
  }
  .npc-tier {
    flex-shrink: 0;
    font-size: 0.85rem;
    font-weight: bold;
    width: 60px;
    text-align: right;
  }
</style>
