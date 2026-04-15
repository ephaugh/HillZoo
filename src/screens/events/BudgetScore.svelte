<script lang="ts">
  import type { GameState, BurdenRating, Issue } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';
  import { getSentimentTier } from '../../core/utils';
  import { findCommitteeForBill } from '../../core/committees';
  import { gameStore } from '../../stores/game';

  let { gameState, onComplete }: { gameState: GameState; onComplete: () => void } = $props();

  let bill = $derived(gameState.playerBill);

  // GDD burden weights by issue
  const BURDEN_WEIGHTS: Partial<Record<Issue, number>> = {
    habitat_burrows: 3,
    agriculture_foraging: 3,
    freshwater_marine: 3,
    public_wellness: 3,
    migration_transit: 2,
    predation_defense: 2,
    environment_conservation: 2,
    youth_offspring: 2,
    trade_commerce: 2,
    bananas: 2,
    nocturnal_affairs: 1,
    interspecies_relations: 1,
    rules_procedures: 0,
    budget: 0,
  };

  // Base burden = sum of pro-tag weights + 1 per anti-tag (flat)
  let baseBurden = $derived(
    bill.proTags.reduce((sum, tag) => sum + (BURDEN_WEIGHTS[tag] ?? 1), 0) + 1
  );

  // Chair adjustment: floor(-Chair's NW / 15), range -4 to +4
  let budgetCommittee = $derived(gameState.committees.find(c => c.issue === 'budget'));
  let chairSentiment = $derived(budgetCommittee ? (gameState.sentiment[budgetCommittee.chair] ?? 0) : 0);
  let chairAdjustment = $derived(
    Math.max(-4, Math.min(4, Math.floor(-chairSentiment / 15)))
  );

  let finalScore = $derived(Math.max(0, baseBurden + chairAdjustment));

  let rating = $derived((): BurdenRating => {
    if (finalScore <= 3) return 'lean';
    if (finalScore <= 7) return 'routine';
    if (finalScore <= 11) return 'heavy';
    return 'bloated';
  });

  let ratingColor = $derived(() => {
    switch (rating()) {
      case 'lean': return '#006600';
      case 'routine': return '#444';
      case 'heavy': return 'var(--warm-amber)';
      case 'bloated': return 'var(--primary-red)';
    }
  });

  let queueEffect = $derived(() => {
    switch (rating()) {
      case 'lean': return '+8 SPEAKER QUEUE PRIORITY';
      case 'routine': return 'NO QUEUE EFFECT';
      case 'heavy': return '-10 SPEAKER QUEUE PRIORITY';
      case 'bloated': return '-20 SPEAKER QUEUE PRIORITY';
    }
  });

  let chairNpc = $derived(budgetCommittee ? gameState.npcs.find(n => n.id === budgetCommittee.chair) : null);
  let chairTier = $derived(getSentimentTier(chairSentiment));

  function proceed() {
    // Apply burden rating and advance bill to queue
    gameStore.update(s => {
      if (!s) return s;
      return {
        ...s,
        playerBill: {
          ...s.playerBill,
          burdenRating: rating(),
          burdenScore: finalScore,
          stage: 'queue',
        },
      };
    });
    onComplete();
  }
</script>

<div class="budget-screen">
  <div class="panel budget-panel">
    <div class="panel-header" style="display: flex; justify-content: space-between;">
      <span>BUDGET SCORE REVEAL</span>
      <span>DAY {gameState.currentDay}</span>
    </div>
    <div class="budget-body">

      <div class="bill-bar">
        Z.B. {bill.number}, THE {bill.name.toUpperCase()} ACT
      </div>

      <div class="score-layout">
        <!-- Left: Breakdown -->
        <div class="breakdown-section">
          <div class="section-title">BURDEN CALCULATION</div>
          <div class="score-rows">
            {#each bill.proTags as tag}
              <div class="score-row">
                <span class="score-label">+ {ISSUE_LABELS[tag]}</span>
                <span class="score-value">{BURDEN_WEIGHTS[tag] ?? 1}</span>
              </div>
            {/each}
            <div class="score-row">
              <span class="score-label">- {ISSUE_LABELS[bill.antiTag]} (ANTI)</span>
              <span class="score-value">1</span>
            </div>
            <div class="score-divider"></div>
            <div class="score-row">
              <span class="score-label">BASE BURDEN</span>
              <span class="score-value">{baseBurden}</span>
            </div>
            <div class="score-row">
              <span class="score-label">
                BUDGET CHAIR ADJUSTMENT
                {#if chairNpc}
                  ({chairNpc.name.toUpperCase()}, <span class="{chairTier}">{chairTier.toUpperCase()}</span>)
                {/if}
              </span>
              <span class="score-value" class:positive={chairAdjustment < 0} class:negative={chairAdjustment > 0}>
                {chairAdjustment > 0 ? '+' : ''}{chairAdjustment}
              </span>
            </div>
            <div class="score-divider"></div>
            <div class="score-row score-final">
              <span class="score-label">FINAL SCORE</span>
              <span class="score-value">{finalScore}</span>
            </div>
          </div>
        </div>

        <!-- Right: Rating -->
        <div class="rating-section">
          <div class="section-title">BURDEN RATING</div>
          <div class="rating-display">
            <div class="rating-badge" style="background: {ratingColor()};">
              {rating().toUpperCase()}
            </div>
            <div class="rating-scale">
              <div class="scale-item" class:scale-active={rating() === 'lean'}>LEAN (0-3)</div>
              <div class="scale-item" class:scale-active={rating() === 'routine'}>ROUTINE (4-7)</div>
              <div class="scale-item" class:scale-active={rating() === 'heavy'}>HEAVY (8-11)</div>
              <div class="scale-item" class:scale-active={rating() === 'bloated'}>BLOATED (12+)</div>
            </div>
          </div>
          <div class="queue-effect">
            <span class="effect-label">SPEAKER QUEUE:</span>
            <span class="effect-value">{queueEffect()}</span>
          </div>
        </div>
      </div>

      <div class="intel-ledger">
        > BUDGET COMMITTEE SCORES Z.B. {bill.number} AT {finalScore} ({rating().toUpperCase()})
        &mdash; BILL ENTERS SPEAKER'S QUEUE
      </div>
    </div>

    <div class="budget-footer">
      <button class="btn" onclick={proceed}>ENTER SPEAKER'S QUEUE</button>
    </div>
  </div>
</div>

<style>
  .budget-screen {
    width: 100%;
    height: 100%;
    padding: 14px;
  }
  .budget-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .budget-body {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .bill-bar {
    padding: 8px 14px;
    background: var(--mahogany);
    color: var(--gold);
    font-size: 1.3rem;
    font-weight: bold;
    border-bottom: 2px solid var(--black);
    text-align: center;
  }
  .score-layout {
    flex: 1;
    display: flex;
    gap: 0;
  }
  .breakdown-section {
    flex: 1;
    border-right: 3px solid var(--black);
    display: flex;
    flex-direction: column;
  }
  .rating-section {
    width: 300px;
    display: flex;
    flex-direction: column;
  }
  .section-title {
    font-size: 1.05rem;
    color: var(--mahogany);
    padding: 4px 14px;
    background: var(--marble-dark);
    border-bottom: 1px solid #aaa;
    font-weight: bold;
  }
  .score-rows {
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  .score-row {
    display: flex;
    justify-content: space-between;
    font-size: 1.1rem;
    padding: 2px 0;
  }
  .score-final {
    font-size: 1.3rem;
    font-weight: bold;
  }
  .score-label { color: #444; }
  .score-value { color: var(--black); font-weight: bold; }
  .positive { color: #006600; }
  .negative { color: var(--primary-red); }
  .score-divider {
    height: 2px;
    background: #888;
    margin: 4px 0;
  }
  .rating-display {
    padding: 20px 14px;
    text-align: center;
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
  }
  .rating-badge {
    font-size: 2.2rem;
    color: white;
    padding: 8px 30px;
    border: 3px solid var(--black);
    display: inline-block;
  }
  .rating-scale {
    display: flex;
    flex-direction: column;
    gap: 2px;
    width: 100%;
  }
  .scale-item {
    font-size: 1rem;
    padding: 2px 10px;
    color: #666;
    border: 1px solid transparent;
  }
  .scale-active {
    color: var(--black);
    font-weight: bold;
    border: 2px solid var(--black);
    background: var(--marble-white);
  }
  .queue-effect {
    padding: 10px 14px;
    border-top: 2px solid #aaa;
    text-align: center;
  }
  .effect-label {
    font-size: 1rem;
    color: #555;
  }
  .effect-value {
    font-size: 1.1rem;
    color: var(--mahogany);
    font-weight: bold;
    display: block;
    margin-top: 2px;
  }
  .intel-ledger {
    background: #000;
    padding: 6px 10px;
    font-size: 1.05rem;
    border-top: 3px solid var(--black);
    color: var(--phosphor-green);
    line-height: 1.3;
    margin-top: auto;
  }
  .budget-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
