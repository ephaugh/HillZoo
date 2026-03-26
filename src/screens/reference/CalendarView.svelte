<script lang="ts">
  import type { GameState, ScheduleEntry, Slot, Bill } from '../../core/types';

  export let gameState: GameState;
  export let onClose: () => void;

  const SLOTS: Slot[] = ['morning', 'afternoon', 'evening'];
  const SLOT_LABELS: Record<Slot, string> = { morning: 'MOR', afternoon: 'AFT', evening: 'EVE' };

  function getWeekStart(day: number): number {
    // Weeks are 5 days: 1-5, 6-10, 11-15, etc.
    return Math.floor((day - 1) / 5) * 5 + 1;
  }

  function getScheduleEntry(day: number, slot: Slot): ScheduleEntry | undefined {
    return gameState.schedule.find(e => e.day === day && e.slot === slot);
  }

  function getCellColor(day: number, slot: Slot): string {
    if (day === gameState.currentDay && slot === gameState.currentSlot) {
      return 'var(--phosphor-green)';
    }
    const entry = getScheduleEntry(day, slot);
    if (!entry || entry.type === 'open') return '#555';
    if (entry.mandatory) return 'var(--warm-amber)';
    if (entry.type === 'meeting' || entry.type === 'quick_interaction') return 'var(--ega-cyan)';
    return '#777';
  }

  function getCellTextColor(day: number, slot: Slot): string {
    if (day === gameState.currentDay && slot === gameState.currentSlot) return '#000';
    const entry = getScheduleEntry(day, slot);
    if (!entry || entry.type === 'open') return '#999';
    if (entry.mandatory) return '#000';
    return '#000';
  }

  function getCellLabel(day: number, slot: Slot): string {
    const entry = getScheduleEntry(day, slot);
    if (!entry || entry.type === 'open') return 'OPEN';
    return entry.label || entry.type.toUpperCase().replace(/_/g, ' ');
  }

  $: currentWeekStart = getWeekStart(gameState.currentDay);
  $: nextWeekStart = currentWeekStart + 5;

  $: currentWeekDays = Array.from({ length: 5 }, (_, i) => currentWeekStart + i).filter(d => d <= 60);
  $: nextWeekDays = Array.from({ length: 5 }, (_, i) => nextWeekStart + i).filter(d => d <= 60);

  $: speakerQueue = gameState.npcBills.filter(b => b.stage === 'queue');
</script>

<div class="panel reference-screen">
  <div class="panel-header header-row">
    <span>CALENDAR VIEW</span>
    <button class="btn btn-close" on:click={onClose}>CLOSE</button>
  </div>

  <div class="calendar-body">
    <div class="week-section">
      <div class="week-label">THIS WEEK (DAYS {currentWeekStart}-{currentWeekStart + 4})</div>
      <div class="week-grid" style="grid-template-columns: 50px repeat({currentWeekDays.length}, 1fr)">
        <div class="grid-corner"></div>
        {#each currentWeekDays as day}
          <div class="day-header" class:today={day === gameState.currentDay}>DAY {day}</div>
        {/each}
        {#each SLOTS as slot}
          <div class="slot-label">{SLOT_LABELS[slot]}</div>
          {#each currentWeekDays as day}
            <div
              class="calendar-cell"
              style="background: {getCellColor(day, slot)}; color: {getCellTextColor(day, slot)}"
            >
              {getCellLabel(day, slot)}
            </div>
          {/each}
        {/each}
      </div>
    </div>

    {#if nextWeekDays.length > 0}
      <div class="week-section">
        <div class="week-label">NEXT WEEK (DAYS {nextWeekStart}-{nextWeekStart + 4})</div>
        <div class="week-grid" style="grid-template-columns: 50px repeat({nextWeekDays.length}, 1fr)">
          <div class="grid-corner"></div>
          {#each nextWeekDays as day}
            <div class="day-header">{day}</div>
          {/each}
          {#each SLOTS as slot}
            <div class="slot-label">{SLOT_LABELS[slot]}</div>
            {#each nextWeekDays as day}
              <div
                class="calendar-cell"
                style="background: {getCellColor(day, slot)}; color: {getCellTextColor(day, slot)}"
              >
                {getCellLabel(day, slot)}
              </div>
            {/each}
          {/each}
        </div>
      </div>
    {/if}

    <div class="queue-section">
      <div class="queue-header">SPEAKER'S QUEUE</div>
      {#if speakerQueue.length === 0}
        <div class="queue-empty">NO BILLS IN QUEUE</div>
      {:else}
        {#each speakerQueue as bill, i (bill.id)}
          <div class="queue-item">
            <span class="queue-pos">#{i + 1}</span>
            <span class="queue-bill">AB-{bill.number}: {bill.name}</span>
            <span class="queue-author">{bill.author === 'player' ? 'YOU' : gameState.npcs.find(n => n.id === bill.author)?.name ?? 'UNKNOWN'}</span>
          </div>
        {/each}
      {/if}
    </div>
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
  .calendar-body {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 8px 12px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .calendar-body::-webkit-scrollbar {
    display: none;
  }
  .week-section {
    flex-shrink: 0;
  }
  .week-label {
    font-size: 1rem;
    color: var(--gold);
    background: var(--mahogany);
    padding: 2px 8px;
    border: 2px solid var(--black);
    margin-bottom: 2px;
  }
  .week-grid {
    display: grid;
    gap: 2px;
    border: 2px solid var(--black);
    background: var(--black);
  }
  .grid-corner {
    background: var(--marble-dark);
  }
  .day-header {
    background: var(--mahogany);
    color: var(--gold);
    text-align: center;
    padding: 2px 4px;
    font-size: 0.9rem;
  }
  .day-header.today {
    background: var(--gold);
    color: var(--black);
  }
  .slot-label {
    background: var(--marble-dark);
    color: var(--black);
    text-align: center;
    padding: 4px 2px;
    font-size: 0.9rem;
  }
  .calendar-cell {
    padding: 4px 4px;
    font-size: 0.8rem;
    text-align: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    min-height: 28px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .queue-section {
    flex-shrink: 0;
    border: 2px solid var(--black);
  }
  .queue-header {
    background: var(--mahogany);
    color: var(--gold);
    padding: 4px 8px;
    font-size: 1rem;
    border-bottom: 2px solid var(--black);
  }
  .queue-empty {
    padding: 8px 12px;
    color: #888;
    font-size: 1rem;
    background: var(--marble);
  }
  .queue-item {
    display: flex;
    gap: 10px;
    padding: 3px 8px;
    font-size: 1rem;
    border-bottom: 1px solid #999;
    background: var(--marble);
  }
  .queue-pos {
    width: 30px;
    flex-shrink: 0;
    color: var(--warm-amber);
    font-weight: bold;
  }
  .queue-bill {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .queue-author {
    width: 140px;
    flex-shrink: 0;
    text-align: right;
    color: #555;
  }
</style>
