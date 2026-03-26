<script lang="ts">
  import type { GameState } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';
  import { createRng, getSentimentTier } from '../../core/utils';

  export let gameState: GameState;
  export let onComplete: () => void;
  export let billId: string | undefined = undefined;

  $: bill = billId
    ? ([gameState.playerBill, ...gameState.npcBills].find(b => b.id === billId) ?? gameState.playerBill)
    : gameState.playerBill;

  // Calculate aggregate presidential stance from PUBLIC stances only
  $: aggregateStance = (() => {
    const prez = gameState.president;
    let score = 0;
    let count = 0;

    // Check bill's pro tags against public stances
    for (const tag of bill.proTags) {
      if (prez.publicStances.includes(tag)) {
        score += prez.stances[tag] ?? 0;
        count++;
      }
    }
    // Check anti tag
    if (prez.publicStances.includes(bill.antiTag)) {
      score -= prez.stances[bill.antiTag] ?? 0;
      count++;
    }

    if (count === 0) return 0;
    return score / count;
  })();

  $: stanceLabel = (() => {
    if (aggregateStance > 1) return 'WILL SIGN';
    if (aggregateStance > 0.3) return 'LIKELY SIGN';
    if (aggregateStance > -0.3) return 'UNKNOWN';
    if (aggregateStance > -1) return 'MAY VETO';
    return 'WILL VETO';
  })();

  // Determine outcome using seeded RNG
  $: outcome = (() => {
    const rng = createRng(gameState.seed + gameState.currentDay * 999 + bill.number);
    const roll = rng();

    if (aggregateStance > 0.5) {
      return 'signed' as const;
    } else if (aggregateStance < -0.5) {
      // High chance of veto
      return roll > 0.2 ? 'vetoed' as const : 'pocket' as const;
    } else {
      // Middle ground
      if (roll > 0.6) return 'signed' as const;
      if (roll > 0.3) return 'pocket' as const;
      return 'vetoed' as const;
    }
  })();

  $: outcomeLabel = (() => {
    switch (outcome) {
      case 'signed': return 'SIGNED INTO LAW';
      case 'vetoed': return 'VETOED';
      case 'pocket': return 'POCKET SIGNATURE';
    }
  })();

  // Public stances for display
  $: publicStanceDisplay = gameState.president.publicStances.map(issue => ({
    issue,
    label: ISSUE_LABELS[issue] ?? issue,
    value: gameState.president.stances[issue] ?? 0,
  }));

  // Veto override
  let overrideAttempted = false;
  let overrideResult: boolean | null = null;

  function attemptOverride() {
    // Count votes for override (need 34 of 50)
    const rng = createRng(gameState.seed + gameState.currentDay * 333);
    let yesVotes = 1; // player votes yes for override

    for (const npc of gameState.npcs) {
      const sentScore = gameState.sentiment[npc.id] ?? 0;
      const tier = getSentimentTier(sentScore);
      if (tier === 'allied' || tier === 'warm') {
        yesVotes++;
      } else if (tier === 'neutral') {
        if (rng() > 0.6) yesVotes++;
      }
    }

    overrideAttempted = true;
    overrideResult = yesVotes >= 34;
  }

  let showOverrideOption = false;
  $: showOverrideOption = outcome === 'vetoed' && !overrideAttempted;
</script>

<div class="pres-screen">
  <div class="stage-background"></div>
  <div class="pres-content">
    <div class="panel main-panel">
      <div class="panel-header">
        Presidential Action — HB-{bill.number}: {bill.name}
      </div>
      <div class="panel-body">
        <div class="president-section">
          <div class="pres-portrait">
            <div class="portrait-frame">
              <div class="portrait-placeholder">P</div>
            </div>
            <div class="pres-label">The President</div>
            <div class="pres-party">
              {gameState.president.party === 'feralist' ? 'Feralist' : 'Communalist'}
            </div>
            <div class="pres-approval">Approval: {gameState.president.approvalRating}%</div>
          </div>

          <div class="stance-section">
            <div class="section-label">Known Stances</div>
            {#if publicStanceDisplay.length > 0}
              <div class="stances-list">
                {#each publicStanceDisplay as stance}
                  <div class="stance-row">
                    <span class="stance-issue">{stance.label}</span>
                    <span class="stance-value"
                      class:positive={stance.value > 0}
                      class:negative={stance.value < 0}
                    >
                      {stance.value > 0 ? '+' : ''}{stance.value}
                    </span>
                  </div>
                {/each}
              </div>
            {:else}
              <div class="no-stances">No public stances revealed.</div>
            {/if}
            <div class="aggregate-row">
              <span class="aggregate-label">Aggregate Signal:</span>
              <span class="aggregate-value">{stanceLabel}</span>
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="outcome-section">
          <div class="outcome-banner"
            class:outcome-signed={outcome === 'signed' || outcome === 'pocket'}
            class:outcome-vetoed={outcome === 'vetoed'}
          >
            {outcomeLabel}
          </div>

          {#if outcome === 'signed'}
            <div class="outcome-desc signed-desc">
              The President signs HB-{bill.number} into law. Your legislative achievement is secured.
            </div>
          {:else if outcome === 'pocket'}
            <div class="outcome-desc pocket-desc">
              The President allows HB-{bill.number} to become law without a signature — a pocket signature. The bill is law, but without presidential endorsement.
            </div>
          {:else if outcome === 'vetoed' && !overrideAttempted}
            <div class="outcome-desc vetoed-desc">
              The President vetoes HB-{bill.number}. You may attempt a veto override, which requires 34 votes (two-thirds majority).
            </div>
          {:else if outcome === 'vetoed' && overrideAttempted}
            <div class="override-result">
              {#if overrideResult}
                <div class="override-banner override-success">
                  Override Successful
                </div>
                <div class="outcome-desc signed-desc">
                  Congress overrides the presidential veto. HB-{bill.number} becomes law.
                </div>
              {:else}
                <div class="override-banner override-failed">
                  Override Failed
                </div>
                <div class="outcome-desc vetoed-desc">
                  The override attempt falls short. HB-{bill.number} is dead.
                </div>
              {/if}
            </div>
          {/if}
        </div>
      </div>
      <div class="intel-ledger">
        <span class="dim">///</span> Presidential action on HB-{bill.number} — {outcomeLabel}
        <span class="dim">— Day {gameState.currentDay}</span>
      </div>
    </div>

    <div class="action-row">
      {#if showOverrideOption}
        <button class="btn" on:click={attemptOverride}>Attempt Override (34 Votes Needed)</button>
        <button class="btn btn-danger" on:click={onComplete}>Accept Veto</button>
      {:else}
        <button class="btn" on:click={onComplete}>Proceed</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .pres-screen {
    width: 980px;
    height: 560px;
    position: relative;
    overflow: hidden;
  }
  .pres-content {
    position: relative;
    z-index: 1;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 16px;
    gap: 10px;
  }
  .main-panel {
    width: 720px;
  }
  .panel-body {
    padding: 12px 16px;
  }

  .president-section {
    display: flex;
    gap: 20px;
    align-items: flex-start;
  }
  .pres-portrait {
    text-align: center;
    min-width: 110px;
  }
  .portrait-frame {
    width: 72px;
    height: 72px;
    border: 3px solid var(--gold);
    background: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 4px;
  }
  .portrait-placeholder {
    font-size: 2.5rem;
    color: var(--gold);
  }
  .pres-label {
    font-size: 1.1rem;
    color: var(--black);
  }
  .pres-party {
    font-size: 0.95rem;
    color: #555;
  }
  .pres-approval {
    font-size: 0.95rem;
    color: var(--warm-amber);
    margin-top: 2px;
  }

  .stance-section {
    flex: 1;
  }
  .section-label {
    font-size: 1.1rem;
    color: var(--mahogany);
    margin-bottom: 6px;
  }
  .stances-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
    margin-bottom: 8px;
  }
  .stance-row {
    display: flex;
    justify-content: space-between;
    padding: 2px 8px;
    background: var(--marble-white);
    border: 1px solid #999;
    font-size: 1rem;
  }
  .stance-issue {
    color: #333;
  }
  .stance-value {
    color: #444;
  }
  .positive {
    color: #006600;
  }
  .negative {
    color: var(--primary-red);
  }
  .no-stances {
    font-size: 1rem;
    color: #666;
    margin-bottom: 8px;
  }
  .aggregate-row {
    display: flex;
    gap: 8px;
    font-size: 1.05rem;
    margin-top: 4px;
  }
  .aggregate-label {
    color: #555;
  }
  .aggregate-value {
    color: var(--mahogany);
  }

  .divider {
    height: 3px;
    background: var(--black);
    margin: 10px 0;
  }

  .outcome-section {
    text-align: center;
  }
  .outcome-banner {
    font-size: 2rem;
    padding: 8px 20px;
    border: 3px solid var(--black);
    display: inline-block;
    margin-bottom: 10px;
  }
  .outcome-signed {
    background: #006600;
    color: #fff;
  }
  .outcome-vetoed {
    background: var(--primary-red);
    color: #fff;
  }
  .outcome-desc {
    font-size: 1.05rem;
    max-width: 500px;
    margin: 0 auto;
    line-height: 1.3;
  }
  .signed-desc {
    color: #333;
  }
  .pocket-desc {
    color: var(--warm-amber);
  }
  .vetoed-desc {
    color: var(--primary-red);
  }

  .override-result {
    text-align: center;
  }
  .override-banner {
    font-size: 1.6rem;
    padding: 6px 16px;
    border: 3px solid var(--black);
    display: inline-block;
    margin-bottom: 8px;
  }
  .override-success {
    background: #006600;
    color: #fff;
  }
  .override-failed {
    background: var(--primary-red);
    color: #fff;
  }

  .action-row {
    display: flex;
    gap: 10px;
    justify-content: center;
  }
</style>
