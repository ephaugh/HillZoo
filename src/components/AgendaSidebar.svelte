<script lang="ts">
  import type { GameState, ScheduleEntry } from '../core/types';
  import { SLOT_LABELS } from '../core/calendar';

  let { gameState }: { gameState: GameState } = $props();

  let todayEntries = $derived(
    gameState.schedule.filter(e => e.day === gameState.currentDay)
  );

  let tomorrowEntries = $derived(
    gameState.currentDay < 60
      ? gameState.schedule.filter(e => e.day === gameState.currentDay + 1)
      : []
  );

  function slotClass(entry: ScheduleEntry, currentSlot: string, currentDay: number): string {
    if (entry.day === currentDay && entry.slot === currentSlot) return 'slot-current';
    if (entry.mandatory) return 'slot-mandatory';
    if (entry.type === 'meeting') return 'slot-tentative';
    return 'slot-open';
  }

  function slotLabel(slot: string, entries: ScheduleEntry[]): string {
    const entry = entries.find(e => e.slot === slot);
    if (entry) return entry.label;
    return 'OPEN';
  }

  let recentGossip = $derived(gameState.gossipLog.slice(-3).reverse());
</script>

<div class="agenda-sidebar">
  <div class="agenda-day">
    <div class="day-header">TODAY &mdash; DAY {gameState.currentDay}</div>
    {#each ['morning', 'afternoon', 'evening'] as slot}
      {@const entry = todayEntries.find(e => e.slot === slot)}
      <div class="slot-row"
        class:slot-current={slot === gameState.currentSlot}
        class:slot-mandatory={entry?.mandatory}
        class:slot-tentative={entry?.type === 'meeting'}
        class:slot-past={(['morning', 'afternoon', 'evening'].indexOf(slot) < ['morning', 'afternoon', 'evening'].indexOf(gameState.currentSlot))}
      >
        <span class="slot-time">{SLOT_LABELS[slot as 'morning' | 'afternoon' | 'evening']}</span>
        <span class="slot-event">{entry?.label ?? 'OPEN'}</span>
      </div>
    {/each}
  </div>

  <div class="agenda-day">
    <div class="day-header">TOMORROW</div>
    {#each ['morning', 'afternoon', 'evening'] as slot}
      {@const entry = tomorrowEntries.find(e => e.slot === slot)}
      <div class="slot-row"
        class:slot-mandatory={entry?.mandatory}
        class:slot-tentative={entry?.type === 'meeting'}
      >
        <span class="slot-time">{SLOT_LABELS[slot as 'morning' | 'afternoon' | 'evening']}</span>
        <span class="slot-event">{entry?.label ?? 'OPEN'}</span>
      </div>
    {/each}
  </div>

  <div class="gossip-section">
    <div class="gossip-header">
      GOSSIP
      {#if gameState.gossipLog.length > 0}
        <span class="gossip-count">{gameState.gossipLog.length}</span>
      {/if}
    </div>
    {#if recentGossip.length > 0}
      {#each recentGossip as item}
        <div class="gossip-item">
          <span class="gossip-text">{item.text}</span>
          <span class="gossip-source">&mdash; {item.source}</span>
        </div>
      {/each}
    {:else}
      <div class="gossip-empty">NO GOSSIP YET</div>
    {/if}
  </div>
</div>

<style>
  .agenda-sidebar {
    width: 180px;
    background: #0a0a0a;
    border: 6px solid var(--mahogany);
    border-top: 4px solid var(--mahogany);
    border-left: 3px solid var(--mahogany);
    box-shadow: 10px 10px 0px rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
  }
  .agenda-day {
    border-bottom: 2px solid #222;
  }
  .day-header {
    background: var(--mahogany);
    color: var(--gold);
    padding: 4px 8px;
    font-size: 1.15rem;
    text-transform: uppercase;
    border-bottom: 2px solid var(--black);
  }
  .slot-row {
    display: flex;
    justify-content: space-between;
    padding: 3px 8px;
    font-size: 1.05rem;
    color: var(--marble);
    border-bottom: 1px solid #1a1a1a;
  }
  .slot-time {
    color: #555;
    font-size: 1rem;
  }
  .slot-event {
    text-align: right;
    font-size: 1rem;
  }
  .slot-current {
    color: var(--phosphor-green);
  }
  .slot-current .slot-time {
    color: var(--phosphor-green);
  }
  .slot-mandatory {
    color: var(--warm-amber);
  }
  .slot-mandatory .slot-time {
    color: var(--warm-amber);
  }
  .slot-tentative {
    color: var(--ega-cyan);
  }
  .slot-tentative .slot-time {
    color: var(--ega-cyan);
  }
  .slot-past {
    color: #444;
  }
  .slot-past .slot-time {
    color: #333;
  }
  .gossip-section {
    flex: 1;
    border-top: 2px solid var(--gold);
  }
  .gossip-header {
    background: var(--primary-red);
    color: white;
    padding: 4px 8px;
    font-size: 1.1rem;
    text-transform: uppercase;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .gossip-count {
    background: white;
    color: var(--primary-red);
    padding: 0 5px;
    font-size: 1rem;
    border: 1px solid var(--black);
  }
  .gossip-item {
    padding: 4px 8px;
    border-bottom: 1px solid #1a1a1a;
  }
  .gossip-text {
    color: var(--marble);
    font-size: 0.95rem;
    display: block;
    line-height: 1.2;
  }
  .gossip-source {
    color: #555;
    font-size: 0.9rem;
  }
  .gossip-empty {
    padding: 8px;
    color: #444;
    font-size: 0.95rem;
    text-align: center;
  }
</style>
