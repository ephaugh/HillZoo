<script lang="ts">
  import { gameStore } from '../../stores/game';
  import { getWeek, getDayOfWeek, getPhaseLabel, daysUntilPrimary } from '../../core/calendar';
  import { SLOT_LABELS } from '../../core/calendar';
  import type { GameState, ScheduleEntry } from '../../core/types';
  import { getPlayerCommitteeNames } from '../../core/roles';

  let { gameState, onProceed }: { gameState: GameState; onProceed: () => void } = $props();

  let week = $derived(getWeek(gameState.currentDay));
  let dayOfWeek = $derived(getDayOfWeek(gameState.currentDay));
  let phase = $derived(getPhaseLabel(gameState.currentDay));
  let primaryCountdown = $derived(daysUntilPrimary(gameState));

  let todayEntries = $derived(
    gameState.schedule.filter(e => e.day === gameState.currentDay)
  );

  // Promises due within 3 days
  let urgentPromises = $derived(
    gameState.promises.filter(p =>
      p.fulfilled === null && p.dueBy && p.dueBy - gameState.currentDay <= 3
    )
  );

  let playerCommittees = $derived(getPlayerCommitteeNames(gameState));
</script>

<div class="dawn-brief">
  <div class="panel brief-panel">
    <div class="panel-header">DAWN BRIEF &mdash; DAY {gameState.currentDay}</div>
    <div class="brief-body">

      <!-- Section A: Today's Calendar -->
      <div class="section">
        <div class="section-title">TODAY'S CALENDAR</div>
        <div class="calendar-row">
          <span class="cal-meta">WEEK {week} &bull; DAY {dayOfWeek} &bull; {phase}</span>
        </div>
        <div class="slot-list">
          {#each ['morning', 'afternoon', 'evening'] as slot}
            {@const entry = todayEntries.find(e => e.slot === slot)}
            <div class="slot-item"
              class:slot-mandatory={entry?.mandatory}
              class:slot-open={!entry}
            >
              <span class="slot-name">{SLOT_LABELS[slot as 'morning' | 'afternoon' | 'evening']}</span>
              <span class="slot-content">{entry?.label ?? 'OPEN'}</span>
            </div>
          {/each}
        </div>
      </div>

      <!-- Section B: Dashboard Snapshot -->
      <div class="section">
        <div class="section-title">DASHBOARD</div>
        <div class="dashboard-grid">
          <div class="dash-item">
            <span class="dash-label">WAR CHEST</span>
            <span class="dash-value safe">${gameState.warChest.toLocaleString()}</span>
          </div>
          <div class="dash-item">
            <span class="dash-label">PRIMARY THREAT</span>
            <span class="dash-value" class:danger={gameState.primaryThreat > 50}>
              {gameState.primaryThreat} / 70
            </span>
          </div>
          <div class="dash-item">
            <span class="dash-label">PRIMARY IN</span>
            <span class="dash-value danger">
              {#if gameState.primarySurvived}
                SURVIVED
              {:else}
                T-{primaryCountdown} DAYS
              {/if}
            </span>
          </div>
          <div class="dash-item">
            <span class="dash-label">BILL STATUS</span>
            <span class="dash-value">{gameState.playerBill.stage.toUpperCase()}</span>
          </div>
        </div>
        <div class="committee-bar">
          <span class="committee-label">YOUR COMMITTEES:</span>
          {#each playerCommittees as name}
            <span class="committee-tag">{name}</span>
          {/each}
        </div>
      </div>

      <!-- Section C: Notices -->
      <div class="section">
        <div class="section-title">NOTICES</div>
        <div class="notices">
          {#if gameState.currentDay === 1}
            <div class="notice">THE SESSION HAS BEGUN. YOU HAVE 60 DAYS TO PASS YOUR BILL.</div>
          {/if}
          {#if !gameState.primarySurvived && primaryCountdown <= 5 && primaryCountdown > 0}
            <div class="notice notice-danger">PRIMARY ELECTION IN {primaryCountdown} DAYS. THREAT: {gameState.primaryThreat}/70.</div>
          {/if}
          {#if urgentPromises.length > 0}
            <div class="notice notice-warn">
              {urgentPromises.length} PROMISE{urgentPromises.length > 1 ? 'S' : ''} DUE SOON.
            </div>
          {/if}
          {#if gameState.currentDay === 1}
            <div class="notice">YOUR BILL (Z.B. {gameState.playerBill.number}) HAS BEEN REFERRED TO COMMITTEE.</div>
          {/if}
        </div>
      </div>

    </div>
    <div class="brief-footer">
      <button class="btn" onclick={onProceed}>PROCEED</button>
    </div>
  </div>
</div>

<style>
  .dawn-brief {
    width: 100%;
    height: 100%;
    padding: 14px;
  }
  .brief-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .brief-body {
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
  .cal-meta {
    font-size: 1.1rem;
    color: #555;
  }
  .slot-list {
    display: flex;
    gap: 10px;
    margin-top: 4px;
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
  .dashboard-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 6px;
  }
  .dash-item {
    padding: 6px 10px;
    background: var(--marble-white);
    border: 2px solid var(--black);
    text-align: center;
  }
  .dash-label {
    display: block;
    font-size: 0.95rem;
    color: #555;
  }
  .dash-value {
    display: block;
    font-size: 1.3rem;
    font-weight: bold;
  }
  .safe { color: #006600; }
  .danger { color: var(--primary-red); }
  .committee-bar {
    display: flex;
    align-items: center;
    gap: 6px;
    margin-top: 4px;
  }
  .committee-label {
    font-size: 1rem;
    color: #555;
  }
  .committee-tag {
    font-size: 1rem;
    padding: 2px 8px;
    background: var(--mahogany);
    color: var(--gold);
    border: 2px solid var(--black);
  }
  .notices {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .notice {
    padding: 4px 10px;
    font-size: 1.1rem;
    color: var(--black);
    border-left: 4px solid var(--gold);
    background: var(--marble-white);
  }
  .notice-danger {
    border-left-color: var(--primary-red);
    color: var(--primary-red);
  }
  .notice-warn {
    border-left-color: var(--warm-amber);
    color: var(--warm-amber);
  }
  .brief-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
