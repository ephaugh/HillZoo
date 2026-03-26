<script lang="ts">
  import { creationStore, creationStep } from '../../stores/creation';
  import type { PrimaryDate } from '../../core/types';

  let creation = $state($creationStore);
  creationStore.subscribe(v => creation = v);

  let selected: PrimaryDate | null = $state(creation.primaryDate);

  function confirm() {
    if (!selected) return;
    creationStore.update(s => ({ ...s, primaryDate: selected }));
    creationStep.set(7);
  }

  function back() {
    creationStep.set(5);
  }
</script>

<div class="creation-screen">
  <div class="panel creation-panel">
    <div class="panel-header">STEP 6 OF 8 &mdash; PRIMARY DATE</div>
    <div class="panel-body">
      <div class="primary-options">
        <button
          class="primary-card"
          class:card-selected={selected === 'early'}
          onclick={() => selected = 'early'}
        >
          <div class="card-title">EARLY PRIMARY</div>
          <div class="card-day">DAY 20</div>
          <div class="card-timeline">
            <div class="timeline-bar">
              <div class="timeline-marker" style="left: 33%"></div>
              <div class="timeline-label" style="left: 33%">D20</div>
            </div>
          </div>
          <div class="card-desc">
            LESS TIME TO PREPARE, BUT SURVIVING EARLY FREES YOU FROM PRIMARY PRESSURE
            FOR THE REMAINING 40 DAYS. HIGH RISK, HIGH REWARD.
          </div>
          <div class="card-risk">
            RISK: IF YOUR METER IS HIGH ON DAY 20, YOU LOSE IMMEDIATELY.
            NO SECOND CHANCE.
          </div>
        </button>

        <button
          class="primary-card"
          class:card-selected={selected === 'late'}
          onclick={() => selected = 'late'}
        >
          <div class="card-title">LATE PRIMARY</div>
          <div class="card-day">DAY 45</div>
          <div class="card-timeline">
            <div class="timeline-bar">
              <div class="timeline-marker" style="left: 75%"></div>
              <div class="timeline-label" style="left: 75%">D45</div>
            </div>
          </div>
          <div class="card-desc">
            MORE TIME TO CAMPAIGN AND MANAGE YOUR METER, BUT THE THREAT HANGS
            OVER YOU LONGER. THE PRIMARY LOOMS DURING THE PEAK LEGISLATIVE PERIOD.
          </div>
          <div class="card-risk">
            RISK: PRIMARY PRESSURE COMPOUNDS WITH LEGISLATIVE CRUNCH.
            JUGGLING BOTH IS BRUTAL.
          </div>
        </button>
      </div>
    </div>
    <div class="creation-footer">
      <button class="btn" onclick={back}>BACK</button>
      <div style="flex: 1;"></div>
      <button class="btn" class:btn-disabled={!selected} onclick={confirm} disabled={!selected}>
        CONFIRM
      </button>
    </div>
  </div>
</div>

<style>
  .creation-screen {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 14px;
  }
  .creation-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .panel-body {
    flex: 1;
    padding: 20px;
    display: flex;
    align-items: stretch;
  }
  .primary-options {
    display: flex;
    gap: 16px;
    width: 100%;
  }
  .primary-card {
    flex: 1;
    padding: 24px;
    background: var(--marble);
    border: 3px solid var(--black);
    cursor: pointer;
    font-family: var(--pixel-font);
    text-transform: uppercase;
    text-align: center;
    display: flex;
    flex-direction: column;
    gap: 12px;
    align-items: center;
    box-shadow: inset 2px 2px 0px var(--marble-white), inset -2px -2px 0px #707070;
  }
  .primary-card:hover {
    background: var(--gold-light);
  }
  .card-selected {
    border: 4px solid var(--gold);
    background: var(--gold-light);
    box-shadow: inset 2px 2px 0px rgba(255,255,255,0.4), inset -2px -2px 0px #8a6508;
  }
  .card-title {
    font-size: 1.8rem;
    color: var(--mahogany);
    font-weight: bold;
  }
  .card-day {
    font-size: 2.2rem;
    color: var(--gold);
    background: var(--mahogany);
    padding: 4px 20px;
    border: 2px solid var(--black);
  }
  .card-timeline {
    width: 100%;
    padding: 10px 0;
  }
  .timeline-bar {
    position: relative;
    width: 100%;
    height: 8px;
    background: var(--mahogany);
    border: 2px solid var(--black);
  }
  .timeline-marker {
    position: absolute;
    top: -8px;
    width: 4px;
    height: 24px;
    background: var(--primary-red);
    transform: translateX(-50%);
  }
  .timeline-label {
    position: absolute;
    top: 18px;
    font-size: 1rem;
    color: var(--primary-red);
    transform: translateX(-50%);
  }
  .card-desc {
    font-size: 1.1rem;
    color: #444;
    line-height: 1.3;
    text-align: left;
  }
  .card-risk {
    font-size: 1rem;
    color: var(--primary-red);
    border-top: 2px solid var(--black);
    padding-top: 8px;
    text-align: left;
    line-height: 1.3;
  }
  .creation-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
