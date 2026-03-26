<script lang="ts">
  import { getWeek, getDayOfWeek } from '../../core/calendar';
  import type { GameState, ScheduleEntry } from '../../core/types';

  let { gameState, onProceed }: { gameState: GameState; onProceed: () => void } = $props();

  let day = $derived(gameState.currentDay);
  let week = $derived(getWeek(day));
  let dayOfWeek = $derived(getDayOfWeek(day));

  // Today's completed schedule entries
  let todayEntries = $derived(
    gameState.schedule.filter(e => e.day === day && e.type !== 'open')
  );

  // Tomorrow's schedule (if not past day 60)
  let tomorrowDay = $derived(day + 1);
  let tomorrowEntries = $derived(
    tomorrowDay <= 60
      ? gameState.schedule.filter(e => e.day === tomorrowDay)
      : []
  );

  // Latest headline from today, if any
  let todayHeadline = $derived(
    gameState.headlineHistory.find(h => h.day === day)
  );

  // Check for end-of-week report card publish (every 5 days)
  let isWeekEnd = $derived(day % 5 === 0);

  // Count of NPC bills that advanced today (simplified — check bills not in 'dead' or 'law')
  let activeNpcBills = $derived(
    gameState.npcBills.filter(b => b.stage !== 'dead' && b.stage !== 'law').length
  );
</script>

<div class="dusk-summary">
  <div class="panel dusk-panel">
    <div class="panel-header">DUSK SUMMARY &mdash; DAY {day}</div>
    <div class="dusk-body">

      <!-- Section: Today's Actions -->
      <div class="section">
        <div class="section-title">TODAY'S ACTIONS</div>
        {#if todayEntries.length > 0}
          <div class="action-list">
            {#each todayEntries as entry}
              <div class="action-item">
                <span class="action-slot">{entry.slot.toUpperCase()}</span>
                <span class="action-label">{entry.label}</span>
              </div>
            {/each}
          </div>
        {:else}
          <div class="empty-note">NO ACTIONS RECORDED TODAY.</div>
        {/if}
      </div>

      <!-- Section: Overnight Changes -->
      <div class="section">
        <div class="section-title">OVERNIGHT CHANGES</div>
        <div class="changes-list">
          <div class="change-item">
            <span class="change-icon dim">&gt;</span>
            <span>SENTIMENT DECAY APPLIED. RELATIONSHIPS DRIFT TOWARD BASELINE.</span>
          </div>
          {#if activeNpcBills > 0}
            <div class="change-item">
              <span class="change-icon dim">&gt;</span>
              <span>{activeNpcBills} NPC BILL{activeNpcBills > 1 ? 'S' : ''} ACTIVE IN THE LEGISLATURE.</span>
            </div>
          {/if}
          {#if todayHeadline}
            <div class="change-item headline-item">
              <span class="change-icon">&gt;</span>
              <span class="headline-text">HEADLINE: {todayHeadline.text}</span>
            </div>
          {/if}
          {#if isWeekEnd}
            <div class="change-item">
              <span class="change-icon amber">&gt;</span>
              <span class="amber">WEEKLY REPORT CARDS UPDATED.</span>
            </div>
          {/if}
        </div>
      </div>

      <!-- Section: Tomorrow Preview -->
      <div class="section">
        <div class="section-title">TOMORROW PREVIEW</div>
        {#if tomorrowDay > 60}
          <div class="empty-note">THE SESSION ENDS TONIGHT.</div>
        {:else}
          <div class="tomorrow-label">DAY {tomorrowDay} &bull; WEEK {getWeek(tomorrowDay)}</div>
          <div class="slot-list">
            {#each ['morning', 'afternoon', 'evening'] as slot}
              {@const entry = tomorrowEntries.find(e => e.slot === slot)}
              <div class="slot-item"
                class:slot-mandatory={entry?.mandatory}
                class:slot-open={!entry || entry.type === 'open'}
              >
                <span class="slot-name">{slot.toUpperCase()}</span>
                <span class="slot-content">{entry?.label ?? 'OPEN'}</span>
              </div>
            {/each}
          </div>
        {/if}
      </div>

    </div>
    <div class="dusk-footer">
      <button class="btn" onclick={onProceed}>
        {#if tomorrowDay > 60}
          END SESSION
        {:else}
          PROCEED TO DAY {tomorrowDay}
        {/if}
      </button>
    </div>
  </div>
</div>

<style>
  .dusk-summary {
    width: 100%;
    height: 100%;
    padding: 14px;
  }
  .dusk-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .dusk-body {
    flex: 1;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .section {
    border-bottom: 1px solid #aaa;
    padding-bottom: 8px;
  }
  .section:last-child {
    border-bottom: none;
  }
  .section-title {
    font-size: 1.15rem;
    color: var(--mahogany);
    font-weight: bold;
    margin-bottom: 4px;
  }

  /* Action list */
  .action-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .action-item {
    display: flex;
    gap: 10px;
    padding: 3px 10px;
    background: var(--marble-white);
    border: 1px solid #aaa;
  }
  .action-slot {
    font-size: 1rem;
    color: #555;
    min-width: 100px;
  }
  .action-label {
    font-size: 1.05rem;
    color: var(--black);
  }

  /* Changes list */
  .changes-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .change-item {
    display: flex;
    gap: 6px;
    padding: 3px 10px;
    font-size: 1.05rem;
    color: var(--black);
  }
  .change-icon {
    color: var(--phosphor-green);
    flex-shrink: 0;
  }
  .dim { color: var(--phosphor-dim); }
  .amber { color: var(--warm-amber); }
  .headline-item {
    background: var(--marble-white);
    border-left: 4px solid var(--warm-amber);
    padding: 4px 10px;
  }
  .headline-text {
    color: var(--warm-amber);
    font-weight: bold;
  }

  /* Empty note */
  .empty-note {
    font-size: 1.05rem;
    color: #555;
    padding: 4px 10px;
  }

  /* Tomorrow preview */
  .tomorrow-label {
    font-size: 1.05rem;
    color: #555;
    margin-bottom: 4px;
  }
  .slot-list {
    display: flex;
    gap: 10px;
  }
  .slot-item {
    flex: 1;
    padding: 6px 10px;
    background: var(--marble-white);
    border: 2px solid var(--black);
    text-align: center;
  }
  .slot-name {
    display: block;
    font-size: 1rem;
    color: #555;
  }
  .slot-content {
    display: block;
    font-size: 1.1rem;
    color: var(--black);
  }
  .slot-mandatory {
    border-color: var(--warm-amber);
  }
  .slot-mandatory .slot-content {
    color: var(--warm-amber);
  }
  .slot-open .slot-content {
    color: var(--phosphor-dim);
  }

  /* Footer */
  .dusk-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
