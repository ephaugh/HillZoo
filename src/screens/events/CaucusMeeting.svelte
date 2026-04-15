<script lang="ts">
  import type { GameState } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';
  import { getSentimentTier } from '../../core/utils';

  export let gameState: GameState;
  export let onComplete: () => void;

  $: playerParty = gameState.parties.find(p => p.name === gameState.player.party) ?? gameState.parties[0];
  $: whipNpc = gameState.npcs.find(n => n.id === playerParty.whipId);
  $: whipSentiment = whipNpc ? getSentimentTier(gameState.sentiment[whipNpc.id] ?? 0) : 'neutral';

  // Party grade from report cards
  $: partyCard = gameState.reportCards.find(rc => rc.entityType === 'party' && rc.entityName.toLowerCase() === gameState.player.party);
  $: partyGrade = partyCard?.isPublished ? partyCard.grade.replace('_', '+').toUpperCase() : 'NOT YET PUBLISHED';

  // Hot issues the whip cares about
  $: hotIssues = Object.entries(gameState.issueTemperatures)
    .filter(([_, temp]) => temp === 'hot')
    .map(([issue]) => issue);

  // Party agenda stances on hot issues
  $: whipStances = hotIssues.map(issue => ({
    issue,
    label: ISSUE_LABELS[issue as keyof typeof ISSUE_LABELS] ?? issue,
    stance: playerParty.agenda[issue as keyof typeof playerParty.agenda] ?? 'NONE',
  }));

  let choiceMade = false;
  let choice: 'comply' | 'defy' | null = null;

  function makeChoice(c: 'comply' | 'defy') {
    choice = c;
    choiceMade = true;
    // Effects would be applied via store actions in the real game
    // Comply: +3 sentiment with Whip
    // Defy: -15 sentiment with Whip
  }
</script>

<div class="caucus-screen">
  <div class="stage-background"></div>
  <div class="caucus-content">
    <div class="panel main-panel">
      <div class="panel-header">
        {gameState.player.party === 'feralist' ? 'Feralist' : 'Communalist'} Caucus Meeting
      </div>
      <div class="panel-body">
        <div class="whip-section">
          <div class="whip-portrait">
            <div class="portrait-frame">
              <div class="portrait-placeholder">{whipNpc?.species?.charAt(0) ?? '?'}</div>
            </div>
            <div class="whip-name">{whipNpc?.name ?? 'UNKNOWN'}</div>
            <div class="whip-title">Party Whip</div>
            <div class="whip-sentiment {whipSentiment}">{whipSentiment.toUpperCase()}</div>
          </div>

          <div class="whip-message">
            <div class="message-box">
              The Whip addresses the caucus on current priorities and expects members to hold the party line.
            </div>
          </div>
        </div>

        <div class="divider"></div>

        <div class="stances-section">
          <div class="section-label">Party Line on Hot Issues</div>
          {#if whipStances.length > 0}
            <div class="stances-list">
              {#each whipStances as stance}
                <div class="stance-row">
                  <span class="stance-issue">{stance.label}</span>
                  <span class="stance-value"
                    class:stance-pro={stance.stance === 'pro'}
                    class:stance-anti={stance.stance === 'anti'}
                  >
                    {stance.stance === 'pro' ? 'SUPPORT' : stance.stance === 'anti' ? 'OPPOSE' : 'NO POSITION'}
                  </span>
                </div>
              {/each}
            </div>
          {:else}
            <div class="no-stances">No hot issues at this time.</div>
          {/if}
        </div>

        <div class="standing-section">
          <span class="standing-label">Party Grade:</span>
          <span class="standing-value">{partyGrade}</span>
          <span class="standing-sep">|</span>
          <span class="standing-label">Standing:</span>
          <span class="standing-value">{gameState.partyStanding.replace('_', ' ').toUpperCase()}</span>
        </div>

        <div class="divider"></div>

        {#if !choiceMade}
          <div class="choice-section">
            <div class="choice-prompt">Will you follow the party line?</div>
            <div class="choice-buttons">
              <button class="btn choice-comply" on:click={() => makeChoice('comply')}>
                Comply
              </button>
              <button class="btn btn-danger choice-defy" on:click={() => makeChoice('defy')}>
                Defy
              </button>
            </div>
            <div class="choice-hints">
              <div class="hint comply-hint">Comply: +3 Whip Sentiment, Maintain Grade</div>
              <div class="hint defy-hint">Defy: -15 Whip Sentiment, Grade Pressure</div>
            </div>
          </div>
        {:else}
          <div class="choice-result">
            {#if choice === 'comply'}
              <div class="result-text comply-result">
                You pledge to follow the party line. The Whip nods approvingly.
              </div>
              <div class="result-effect">Whip Sentiment: +3</div>
            {:else}
              <div class="result-text defy-result">
                You indicate you will vote your conscience. The Whip's expression hardens.
              </div>
              <div class="result-effect danger">Whip Sentiment: -15</div>
            {/if}
          </div>
        {/if}
      </div>
      <div class="intel-ledger">
        <span class="dim">///</span> Caucus meeting — Day {gameState.currentDay}
        {#if choiceMade}
          — You chose to {choice === 'comply' ? 'COMPLY' : 'DEFY'}
        {/if}
      </div>
    </div>

    {#if choiceMade}
      <div class="action-row">
        <button class="btn" on:click={onComplete}>Proceed</button>
      </div>
    {/if}
  </div>
</div>

<style>
  .caucus-screen {
    width: 980px;
    height: 560px;
    position: relative;
    overflow: hidden;
  }
  .caucus-content {
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
    width: 700px;
  }
  .panel-body {
    padding: 12px 16px;
  }

  .whip-section {
    display: flex;
    gap: 16px;
    align-items: flex-start;
  }
  .whip-portrait {
    text-align: center;
    min-width: 100px;
  }
  .portrait-frame {
    width: 64px;
    height: 64px;
    border: 3px solid var(--gold);
    background: #222;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 4px;
  }
  .portrait-placeholder {
    font-size: 2rem;
    color: var(--gold);
  }
  .whip-name {
    font-size: 1.1rem;
    color: var(--black);
  }
  .whip-title {
    font-size: 0.9rem;
    color: var(--mahogany);
  }
  .whip-sentiment {
    font-size: 0.95rem;
    margin-top: 2px;
  }

  .whip-message {
    flex: 1;
  }
  .message-box {
    background: var(--marble-white);
    border: 2px solid #999;
    padding: 10px 12px;
    font-size: 1.05rem;
    color: #333;
  }

  .divider {
    height: 3px;
    background: var(--black);
    margin: 8px 0;
  }

  .section-label {
    font-size: 1.1rem;
    color: var(--mahogany);
    margin-bottom: 6px;
  }
  .stances-list {
    display: flex;
    flex-direction: column;
    gap: 3px;
  }
  .stance-row {
    display: flex;
    justify-content: space-between;
    padding: 3px 8px;
    background: var(--marble-white);
    border: 1px solid #999;
    font-size: 1rem;
  }
  .stance-issue {
    color: #333;
  }
  .stance-pro {
    color: #006600;
  }
  .stance-anti {
    color: var(--primary-red);
  }
  .no-stances {
    font-size: 1rem;
    color: #666;
  }

  .standing-section {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-top: 8px;
    font-size: 1rem;
  }
  .standing-label {
    color: #555;
  }
  .standing-value {
    color: var(--black);
  }
  .standing-sep {
    color: #999;
  }

  .choice-section {
    text-align: center;
  }
  .choice-prompt {
    font-size: 1.3rem;
    color: var(--black);
    margin-bottom: 10px;
  }
  .choice-buttons {
    display: flex;
    gap: 16px;
    justify-content: center;
    margin-bottom: 8px;
  }
  .choice-comply {
    background: #006600;
    color: #fff;
    font-size: 1.3rem;
    padding: 8px 24px;
    box-shadow: inset 2px 2px 0px #009900, inset -2px -2px 0px #003300;
  }
  .choice-comply:hover {
    background: #008800;
  }
  .choice-defy {
    font-size: 1.3rem;
    padding: 8px 24px;
  }
  .choice-hints {
    display: flex;
    gap: 24px;
    justify-content: center;
  }
  .hint {
    font-size: 0.9rem;
    color: #666;
  }
  .comply-hint {
    color: #006600;
  }
  .defy-hint {
    color: var(--primary-red);
  }

  .choice-result {
    text-align: center;
    padding: 8px;
  }
  .result-text {
    font-size: 1.15rem;
    margin-bottom: 6px;
  }
  .comply-result {
    color: #006600;
  }
  .defy-result {
    color: var(--primary-red);
  }
  .result-effect {
    font-size: 1.1rem;
    color: var(--phosphor-green);
  }
  .result-effect.danger {
    color: var(--primary-red);
  }

  .action-row {
    display: flex;
    gap: 8px;
    justify-content: center;
  }
</style>
