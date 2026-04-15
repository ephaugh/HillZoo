<script lang="ts">
  import type { GameState } from '../../core/types';

  export let gameState: GameState;
  export let onClose: () => void;

  $: sortedGossip = [...gameState.gossipLog].sort((a, b) => b.day - a.day);
</script>

<div class="panel reference-screen">
  <div class="panel-header header-row">
    <span>GOSSIP LOG</span>
    <button class="btn btn-close" on:click={onClose}>CLOSE</button>
  </div>

  {#if sortedGossip.length === 0}
    <div class="empty-state">NO GOSSIP YET</div>
  {:else}
    <div class="gossip-list">
      {#each sortedGossip as entry (entry.id)}
        <div class="gossip-entry">
          <div class="gossip-header">
            <span class="gossip-day">DAY {entry.day}</span>
            <span class="gossip-source">{entry.source}</span>
          </div>
          <div class="gossip-text">{entry.text}</div>
        </div>
      {/each}
    </div>
  {/if}
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
  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: #888;
  }
  .gossip-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 8px 12px;
  }
  .gossip-list::-webkit-scrollbar {
    display: none;
  }
  .gossip-entry {
    padding: 8px 10px;
    border-bottom: 2px solid #999;
  }
  .gossip-entry:last-child {
    border-bottom: none;
  }
  .gossip-header {
    display: flex;
    justify-content: space-between;
    margin-bottom: 2px;
  }
  .gossip-day {
    font-size: 1rem;
    color: var(--warm-amber);
    font-weight: bold;
  }
  .gossip-source {
    font-size: 0.95rem;
    color: #555;
  }
  .gossip-text {
    font-size: 1.1rem;
    color: var(--black);
    line-height: 1.3;
  }
</style>
