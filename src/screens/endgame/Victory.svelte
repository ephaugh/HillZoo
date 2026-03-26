<script lang="ts">
  import type { GameState } from '../../core/types';

  let { gameState, onNewGame }: { gameState: GameState; onNewGame: () => void } = $props();

  // Calculate simplified scoring
  let daysUsed = $derived(gameState.currentDay);
  let warChestFinal = $derived(gameState.warChest);
  let cosponsorCount = $derived(gameState.playerBill.cosponsors.length);
  let amendmentCount = $derived(gameState.playerBill.amendmentHistory.length);
  let amendmentsSurvived = $derived(
    gameState.playerBill.amendmentHistory.filter(a => !a.passed).length
  );
  let totalAmendments = $derived(gameState.playerBill.amendmentHistory.length);

  // Passage type: solo if no omnibus merging happened (simplified check)
  let passageType = $derived('SOLO PASSAGE');

  // Bill integrity: percentage of original bill structure preserved
  let billIntegrity = $derived(
    totalAmendments === 0
      ? 100
      : Math.round((amendmentsSurvived / totalAmendments) * 100)
  );

  // Simplified letter grade based on multiple factors
  let letterGrade = $derived.by(() => {
    let score = 0;

    // Speed bonus (max 30 points)
    if (daysUsed <= 30) score += 30;
    else if (daysUsed <= 40) score += 20;
    else if (daysUsed <= 50) score += 10;
    else score += 5;

    // Cosponsors (max 25 points)
    score += Math.min(25, cosponsorCount * 5);

    // Bill integrity (max 25 points)
    score += Math.round(billIntegrity * 0.25);

    // War chest (max 20 points)
    if (warChestFinal >= 3000) score += 20;
    else if (warChestFinal >= 2000) score += 15;
    else if (warChestFinal >= 1000) score += 10;
    else if (warChestFinal >= 500) score += 5;

    if (score >= 90) return 'A+';
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 55) return 'C';
    if (score >= 40) return 'D';
    return 'F';
  });

  let gradeColor = $derived.by(() => {
    if (letterGrade === 'A+' || letterGrade === 'A') return 'grade-excellent';
    if (letterGrade === 'B') return 'grade-good';
    if (letterGrade === 'C') return 'grade-ok';
    return 'grade-poor';
  });
</script>

<div class="victory-screen">
  <div class="panel victory-panel">
    <div class="panel-header victory-header">YOUR BILL IS NOW LAW</div>
    <div class="victory-body">

      <!-- Bill Name -->
      <div class="bill-display">
        <div class="bill-label">ENACTED</div>
        <div class="bill-name">Z.B. {gameState.playerBill.number}, THE {gameState.playerBill.name} ACT</div>
      </div>

      <!-- Final Stats -->
      <div class="section">
        <div class="section-title">FINAL RECORD</div>
        <div class="stats-grid">
          <div class="stat-cell">
            <span class="stat-label">DAYS TAKEN</span>
            <span class="stat-val">{daysUsed} / 60</span>
          </div>
          <div class="stat-cell">
            <span class="stat-label">WAR CHEST</span>
            <span class="stat-val safe">${warChestFinal.toLocaleString()}</span>
          </div>
          <div class="stat-cell">
            <span class="stat-label">PRIMARY</span>
            <span class="stat-val">
              {#if gameState.primarySurvived}
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

      <!-- Score Section -->
      <div class="section">
        <div class="section-title">SCORE</div>
        <div class="score-grid">
          <div class="score-row">
            <span class="score-label">PASSAGE TYPE</span>
            <span class="score-val">{passageType}</span>
          </div>
          <div class="score-row">
            <span class="score-label">BILL INTEGRITY</span>
            <span class="score-val">{billIntegrity}%</span>
          </div>
          <div class="score-row">
            <span class="score-label">AMENDMENTS FACED</span>
            <span class="score-val">{totalAmendments}</span>
          </div>
        </div>
      </div>

      <!-- Letter Grade -->
      <div class="grade-section">
        <div class="grade-label">OVERALL PERFORMANCE</div>
        <div class="grade-display {gradeColor}">{letterGrade}</div>
      </div>

    </div>
    <div class="victory-footer">
      <button class="btn" onclick={onNewGame}>NEW GAME</button>
    </div>
  </div>
</div>

<style>
  .victory-screen {
    width: 100%;
    height: 100%;
    padding: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .victory-panel {
    width: 600px;
    display: flex;
    flex-direction: column;
  }
  .victory-header {
    font-size: 1.6rem;
    text-align: center;
    padding: 10px 12px;
  }
  .victory-body {
    flex: 1;
    padding: 14px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  /* Bill Display */
  .bill-display {
    text-align: center;
    padding: 12px;
    background: var(--mahogany);
    border: 3px solid var(--black);
  }
  .bill-label {
    font-size: 1rem;
    color: var(--warm-amber);
    margin-bottom: 4px;
  }
  .bill-name {
    font-size: 1.5rem;
    color: var(--gold);
    line-height: 1.2;
  }

  /* Sections */
  .section {
    border-bottom: 1px solid #aaa;
    padding-bottom: 8px;
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
  .safe { color: #006600; }

  /* Score Grid */
  .score-grid {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .score-row {
    display: flex;
    justify-content: space-between;
    padding: 4px 10px;
    background: var(--marble-white);
    border: 1px solid #aaa;
  }
  .score-label {
    font-size: 1.05rem;
    color: #555;
  }
  .score-val {
    font-size: 1.05rem;
    color: var(--black);
    font-weight: bold;
  }

  /* Grade */
  .grade-section {
    text-align: center;
    padding: 10px;
  }
  .grade-label {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 6px;
  }
  .grade-display {
    font-size: 4rem;
    font-weight: bold;
    line-height: 1;
  }
  .grade-excellent { color: var(--phosphor-green); }
  .grade-good { color: #006600; }
  .grade-ok { color: var(--warm-amber); }
  .grade-poor { color: var(--primary-red); }

  /* Footer */
  .victory-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: center;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
