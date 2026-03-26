<script lang="ts">
  import type { GameState, GamePromise } from '../../core/types';

  export let gameState: GameState;
  export let onClose: () => void;

  function getNpcName(npcId: string): string {
    const npc = gameState.npcs.find(n => n.id === npcId);
    return npc ? npc.name : 'UNKNOWN';
  }

  function getStatus(promise: GamePromise): string {
    if (promise.fulfilled === null) return 'PENDING';
    return promise.fulfilled ? 'FULFILLED' : 'BROKEN';
  }

  function getStatusColor(promise: GamePromise): string {
    if (promise.fulfilled === null) return 'var(--warm-amber)';
    return promise.fulfilled ? '#006600' : 'var(--primary-red)';
  }

  $: sortedPromises = [...gameState.promises].sort((a, b) => b.day - a.day);
</script>

<div class="panel reference-screen">
  <div class="panel-header header-row">
    <span>PROMISE LEDGER</span>
    <button class="btn btn-close" on:click={onClose}>CLOSE</button>
  </div>

  {#if sortedPromises.length === 0}
    <div class="empty-state">NO PROMISES YET</div>
  {:else}
    <div class="list-header-row">
      <span class="col-day">DAY</span>
      <span class="col-npc">NPC</span>
      <span class="col-desc">DESCRIPTION</span>
      <span class="col-status">STATUS</span>
    </div>

    <div class="promise-list">
      {#each sortedPromises as promise (promise.id)}
        <div class="promise-row">
          <span class="col-day">{promise.day}</span>
          <span class="col-npc">{getNpcName(promise.npcId)}</span>
          <span class="col-desc">{promise.description}</span>
          <span class="col-status" style="color: {getStatusColor(promise)}">{getStatus(promise)}</span>
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
  .list-header-row {
    display: flex;
    padding: 4px 12px;
    background: var(--mahogany);
    color: var(--gold);
    font-size: 0.95rem;
    border-bottom: 2px solid var(--black);
  }
  .promise-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .promise-list::-webkit-scrollbar {
    display: none;
  }
  .promise-row {
    display: flex;
    padding: 4px 12px;
    font-size: 1.05rem;
    border-bottom: 1px solid #999;
    align-items: center;
  }
  .promise-row:hover {
    background: var(--marble-white);
  }
  .col-day {
    width: 60px;
    flex-shrink: 0;
    text-align: center;
  }
  .col-npc {
    width: 160px;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .col-desc {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #333;
  }
  .col-status {
    width: 120px;
    flex-shrink: 0;
    text-align: right;
    font-weight: bold;
  }
</style>
