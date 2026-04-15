<script lang="ts">
  import type { GameState } from '../../core/types';

  let { gameState, defeatReason, onNewGame }: {
    gameState: GameState;
    defeatReason: string;
    onNewGame: () => void;
  } = $props();

  let headerText = $derived.by(() => {
    if (defeatReason === 'primary_lost') return 'DEFEATED IN PRIMARY';
    return 'SESSION OVER';
  });

  let reasonMessage = $derived.by(() => {
    switch (defeatReason) {
      case 'primary_lost':
        return 'YOU LOST YOUR PRIMARY ELECTION. YOUR POLITICAL CAREER IS OVER BEFORE YOUR BILL COULD REACH THE FLOOR.';
      case 'session_expired':
        return 'THE 60-DAY SESSION HAS ENDED. YOUR BILL DIED WITHOUT REACHING A FINAL VOTE. THE NEXT SESSION BELONGS TO SOMEONE ELSE.';
      case 'bill_killed':
        return 'YOUR BILL WAS KILLED IN COMMITTEE. WITHOUT ENOUGH SUPPORT, IT NEVER HAD A CHANCE.';
      case 'vetoed':
        return 'THE PRESIDENT VETOED YOUR BILL. YOU COULD NOT MUSTER THE VOTES TO OVERRIDE.';
      default:
        return 'YOUR LEGISLATIVE EFFORT HAS FAILED.';
    }
  });

  let billStageLabel = $derived(gameState.playerBill.stage.toUpperCase());
  let daysUsed = $derived(gameState.currentDay);
  let warChestFinal = $derived(gameState.warChest);
  let cosponsorCount = $derived(gameState.playerBill.cosponsors.length);
</script>

<div class="defeat-screen">
  <div class="panel defeat-panel">
    <div class="panel-header defeat-header">{headerText}</div>
    <div class="defeat-body">

      <!-- Defeat Reason -->
      <div class="reason-display">
        <div class="reason-text">{reasonMessage}</div>
      </div>

      <!-- Bill Status at Death -->
      <div class="section">
        <div class="section-title">BILL STATUS</div>
        <div class="bill-info">
          <div class="bill-name">Z.B. {gameState.playerBill.number}, THE {gameState.playerBill.name} ACT</div>
          <div class="bill-stage">
            STAGE AT END: <span class="stage-value">{billStageLabel}</span>
          </div>
        </div>
      </div>

      <!-- Final Stats -->
      <div class="section">
        <div class="section-title">FINAL RECORD</div>
        <div class="stats-grid">
          <div class="stat-cell">
            <span class="stat-label">DAYS SERVED</span>
            <span class="stat-val">{daysUsed} / 60</span>
          </div>
          <div class="stat-cell">
            <span class="stat-label">WAR CHEST</span>
            <span class="stat-val">${warChestFinal.toLocaleString()}</span>
          </div>
          <div class="stat-cell">
            <span class="stat-label">PRIMARY</span>
            <span class="stat-val">
              {#if defeatReason === 'primary_lost'}
                <span class="lost">LOST</span>
              {:else if gameState.primarySurvived}
                SURVIVED
              {:else if gameState.isLameDuck}
                LAME DUCK
              {:else}
                PENDING
              {/if}
            </span>
          </div>
          <div class="stat-cell">
            <span class="stat-label">COSPONSORS</span>
            <span class="stat-val">{cosponsorCount}</span>
          </div>
        </div>
      </div>

      <!-- Defeat-specific details -->
      {#if defeatReason === 'primary_lost'}
        <div class="section">
          <div class="section-title">PRIMARY RESULT</div>
          <div class="detail-row">
            <span>THREAT LEVEL AT ELECTION:</span>
            <span class="detail-val danger">{gameState.primaryThreat} / 70</span>
          </div>
        </div>
      {/if}

      {#if defeatReason === 'vetoed'}
        <div class="section">
          <div class="section-title">PRESIDENTIAL ACTION</div>
          <div class="detail-row">
            <span>THE PRESIDENT HAS VETOED Z.B. {gameState.playerBill.number}.</span>
          </div>
          <div class="detail-row">
            <span>OVERRIDE ATTEMPT:</span>
            <span class="detail-val danger">FAILED</span>
          </div>
        </div>
      {/if}

    </div>
    <div class="defeat-footer">
      <button class="btn" onclick={onNewGame}>NEW GAME</button>
    </div>
  </div>
</div>

<style>
  .defeat-screen {
    width: 100%;
    height: 100%;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .defeat-panel {
    width: 600px;
    display: flex;
    flex-direction: column;
  }
  .defeat-header {
    font-size: 1.6rem;
    text-align: center;
    padding: 10px 12px;
    background: var(--primary-red);
    color: var(--marble-white);
  }
  .defeat-body {
    flex: 1;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Reason Display */
  .reason-display {
    padding: 12px;
    background: var(--marble-white);
    border: 2px solid var(--black);
    border-left: 6px solid var(--primary-red);
  }
  .reason-text {
    font-size: 1.15rem;
    color: var(--black);
    line-height: 1.3;
  }

  /* Bill Info */
  .bill-info {
    padding: 8px 10px;
    background: var(--marble-white);
    border: 2px solid var(--black);
  }
  .bill-name {
    font-size: 1.2rem;
    color: var(--black);
    font-weight: bold;
    margin-bottom: 4px;
  }
  .bill-stage {
    font-size: 1.05rem;
    color: #555;
  }
  .stage-value {
    color: var(--primary-red);
    font-weight: bold;
  }

  /* Sections */
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
    margin-bottom: 6px;
  }

  /* Stats Grid */
  .stats-grid {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 6px;
  }
  .stat-cell {
    padding: 6px 8px;
    background: var(--marble-white);
    border: 2px solid var(--black);
    text-align: center;
  }
  .stat-label {
    display: block;
    font-size: 0.9rem;
    color: #555;
  }
  .stat-val {
    display: block;
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--black);
  }
  .lost { color: var(--primary-red); }

  /* Detail Rows */
  .detail-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 10px;
    background: var(--marble-white);
    border: 1px solid #aaa;
    font-size: 1.05rem;
  }
  .detail-val {
    font-weight: bold;
  }
  .danger { color: var(--primary-red); }

  /* Footer */
  .defeat-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: center;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
