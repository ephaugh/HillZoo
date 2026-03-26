<script lang="ts">
  import type { GameState } from '../../core/types';

  export let gameState: GameState;
  export let onComplete: () => void;

  const DEFEAT_THRESHOLD = 70;

  $: threatValue = gameState.primaryThreat;
  $: threatPercent = Math.min((threatValue / DEFEAT_THRESHOLD) * 100, 100);
  $: defeated = threatValue >= DEFEAT_THRESHOLD;
  $: survived = !defeated;

  $: barColor = (() => {
    if (threatPercent >= 85) return 'var(--primary-red)';
    if (threatPercent >= 60) return 'var(--warm-amber)';
    return 'var(--phosphor-green)';
  })();

  $: resultLabel = defeated ? 'DEFEATED' : 'SURVIVED';

  function handleProceed() {
    // In the real game, these mutations would go through store actions
    // if (survived) gameState.primarySurvived = true;
    // if (defeated) gameState.isLameDuck = true;
    onComplete();
  }
</script>

<div class="primary-screen">
  <div class="stage-background"></div>
  <div class="primary-content">
    <div class="panel main-panel">
      <div class="panel-header">
        Primary Election
      </div>
      <div class="panel-body">
        <div class="election-title">
          {gameState.primaryDate === 'early' ? 'Early' : 'Late'} Primary — Day {gameState.currentDay}
        </div>

        <div class="threat-section">
          <div class="threat-label">Primary Threat Meter</div>
          <div class="threat-display">
            <div class="threat-value" class:danger={defeated}>{threatValue}</div>
            <div class="threat-separator">/</div>
            <div class="threat-threshold">{DEFEAT_THRESHOLD}</div>
          </div>

          <div class="threat-bar-container">
            <div class="threat-bar-track">
              <div class="threat-bar-fill" style="width: {threatPercent}%; background: {barColor};"></div>
              <div class="defeat-line"></div>
            </div>
            <div class="bar-labels">
              <span class="bar-label-safe">Safe</span>
              <span class="bar-label-danger">Defeat</span>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="result-section">
          <div class="result-banner" class:result-survived={survived} class:result-defeated={defeated}>
            {resultLabel}
          </div>

          {#if survived}
            <div class="result-description survived-desc">
              You have survived your primary challenge. Your seat is secure for now. You may continue your legislative agenda with renewed confidence.
            </div>
          {:else}
            <div class="result-description defeated-desc">
              You have lost your primary. You are now a lame duck legislator. Your remaining time in congress carries reduced influence, but you may still attempt to pass your bill.
            </div>
          {/if}
        </div>
      </div>
      <div class="intel-ledger">
        <span class="dim">///</span> Primary election results —
        {#if survived}
          <span>Threat level contained at {threatValue}/{DEFEAT_THRESHOLD}</span>
        {:else}
          <span>Threat exceeded threshold — lame duck status activated</span>
        {/if}
      </div>
    </div>

    <div class="action-row">
      <button class="btn" on:click={handleProceed}>Proceed</button>
    </div>
  </div>
</div>

<style>
  .primary-screen {
    width: 980px;
    height: 560px;
    position: relative;
    overflow: hidden;
  }
  .primary-content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 20px;
    gap: 12px;
  }
  .main-panel {
    width: 600px;
  }
  .panel-body {
    padding: 16px 20px;
  }

  .election-title {
    font-size: 1.2rem;
    color: #444;
    text-align: center;
    margin-bottom: 12px;
  }

  .threat-section {
    text-align: center;
  }
  .threat-label {
    font-size: 1.1rem;
    color: var(--mahogany);
    margin-bottom: 8px;
  }
  .threat-display {
    display: flex;
    justify-content: center;
    align-items: baseline;
    gap: 4px;
    margin-bottom: 12px;
  }
  .threat-value {
    font-size: 3rem;
    color: var(--black);
    line-height: 1;
  }
  .threat-value.danger {
    color: var(--primary-red);
  }
  .threat-separator {
    font-size: 2rem;
    color: #666;
  }
  .threat-threshold {
    font-size: 2rem;
    color: var(--primary-red);
  }

  .threat-bar-container {
    width: 100%;
    max-width: 400px;
    margin: 0 auto;
  }
  .threat-bar-track {
    width: 100%;
    height: 24px;
    background: #333;
    border: 3px solid var(--black);
    position: relative;
  }
  .threat-bar-fill {
    height: 100%;
  }
  .defeat-line {
    position: absolute;
    top: -4px;
    bottom: -4px;
    right: 0;
    width: 3px;
    background: var(--primary-red);
  }
  .bar-labels {
    display: flex;
    justify-content: space-between;
    font-size: 0.9rem;
    color: #666;
    margin-top: 2px;
  }
  .bar-label-safe {
    color: #006600;
  }
  .bar-label-danger {
    color: var(--primary-red);
  }

  .divider {
    height: 3px;
    background: var(--black);
    margin: 14px 0;
  }

  .result-section {
    text-align: center;
  }
  .result-banner {
    font-size: 2.5rem;
    padding: 8px 20px;
    border: 3px solid var(--black);
    display: inline-block;
    margin-bottom: 12px;
  }
  .result-survived {
    background: #006600;
    color: #fff;
  }
  .result-defeated {
    background: var(--primary-red);
    color: #fff;
  }
  .result-description {
    font-size: 1.05rem;
    max-width: 450px;
    margin: 0 auto;
    line-height: 1.3;
  }
  .survived-desc {
    color: #333;
  }
  .defeated-desc {
    color: var(--primary-red);
  }

  .action-row {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
</style>
