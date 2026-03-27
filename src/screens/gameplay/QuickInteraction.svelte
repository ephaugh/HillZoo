<script lang="ts">
  import type { GameState, NPC } from '../../core/types';
  import { getSentimentTier, createRng } from '../../core/utils';
  import { selectQuickBark, loadQuickBarks } from '../../core/bark-engine';

  let { gameState, npc, interactionType, onComplete }: {
    gameState: GameState;
    npc: NPC;
    interactionType: 'early_bird' | 'ambush' | 'hallway' | 'lingerer';
    onComplete: () => void;
  } = $props();

  // Seeded RNG for deterministic quick interactions
  const qiRng = createRng(gameState.seed + gameState.currentDay * 300 + npc.id.charCodeAt(0));

  // Load quick bark corpus
  $effect(() => { loadQuickBarks(); });

  let phase: 'initial' | 'engaged' | 'resolved' = $state('initial');
  let chosenVerb: string | null = $state(null);
  let sentimentChange: number = $state(0);

  let sentimentScore = $derived(gameState.sentiment[npc.id] ?? 0);
  let sentimentTier = $derived(getSentimentTier(sentimentScore));

  // Map interaction types for bark lookup
  const BARK_TYPE_MAP: Record<string, string> = {
    early_bird: 'ambush', // early_bird uses ambush bark pool with different framing
    ambush: 'ambush',
    hallway: 'vote_read',
    lingerer: 'holding_up',
  };

  let typeLabel = $derived.by(() => {
    switch (interactionType) {
      case 'early_bird': return 'EARLY BIRD';
      case 'ambush': return 'AMBUSH';
      case 'hallway': return 'HALLWAY ENCOUNTER';
      case 'lingerer': return 'LINGERER';
    }
  });

  // Opening bark — try authored corpus first, fall back to hardcoded
  let openingBark = $derived.by(() => {
    const barkType = BARK_TYPE_MAP[interactionType];
    const category = interactionType === 'ambush' ? 'vote_ask' : 'opening';
    const authored = selectQuickBark(qiRng, npc, barkType, category);
    if (authored) return `"${authored.toUpperCase()}"`;

    // Fallback
    switch (interactionType) {
      case 'early_bird':
        return `"AH, YOU'RE HERE EARLY TOO. I HAD A FEELING WE MIGHT CROSS PATHS."`;
      case 'ambush':
        return `"I'VE BEEN LOOKING FOR YOU. WE NEED TO TALK."`;
      case 'hallway':
        return `"WELL, FANCY RUNNING INTO YOU IN THE CORRIDOR."`;
      case 'lingerer':
        return `"MIND IF I BEND YOUR EAR FOR A MOMENT? I'M IN NO RUSH."`;
    }
  });

  // Decline label and penalty
  let declineLabel = $derived.by(() => {
    switch (interactionType) {
      case 'early_bird': return 'SKIP';
      case 'ambush': return 'DIVERT';
      case 'hallway': return 'PASS';
      case 'lingerer': return 'LEAVE';
    }
  });

  let declinePenalty = $derived(interactionType === 'ambush' ? -3 : 0);

  // Available verbs when engaged
  let availableVerbs = $derived.by(() => {
    const base = ['DISCUSS', 'OFFER', 'QUICK QUESTION'];
    return base;
  });

  // Lingerer gets two choices
  let isLingerer = $derived(interactionType === 'lingerer');
  let verbsUsed = $state(0);
  let maxVerbs = $derived(isLingerer ? 2 : 1);

  function handleEngage() {
    phase = 'engaged';
    sentimentChange = Math.floor(3 + qiRng() * 3); // +3 to +5
  }

  function handleDecline() {
    if (declinePenalty !== 0) {
      sentimentChange = declinePenalty;
    }
    phase = 'resolved';
  }

  function handleVerb(verb: string) {
    chosenVerb = verb;
    verbsUsed++;
    if (verbsUsed >= maxVerbs) {
      phase = 'resolved';
    }
  }

  // Response bark after engaging — try authored corpus, fall back to hardcoded
  let responseBark = $derived.by(() => {
    if (!chosenVerb) return '';
    const barkType = BARK_TYPE_MAP[interactionType];
    const categoryMap: Record<string, string> = {
      'DISCUSS': 'intel_reaction',
      'OFFER': 'cosponsor_ask',
      'QUICK QUESTION': 'vote_read',
    };
    const category = categoryMap[chosenVerb] ?? 'intel_reaction';
    const authored = selectQuickBark(qiRng, npc, barkType, category);
    if (authored) return `"${authored.toUpperCase()}"`;

    // Fallback
    switch (chosenVerb) {
      case 'DISCUSS':
        return `"INTERESTING PERSPECTIVE. I'LL KEEP THAT IN MIND."`;
      case 'OFFER':
        return `"I APPRECIATE YOU BRINGING THAT TO ME DIRECTLY."`;
      case 'QUICK QUESTION':
        return `"THAT'S A FAIR QUESTION. LET ME THINK ON IT."`;
      default:
        return `"NOTED."`;
    }
  });
</script>

<div class="qi-overlay">
  <div class="panel qi-panel">
    <div class="panel-header qi-header">
      <span class="qi-type">{typeLabel}</span>
    </div>
    <div class="qi-body">

      <!-- NPC Info -->
      <div class="npc-row">
        <div class="npc-info">
          <span class="npc-name">{npc.name}</span>
          <span class="npc-species">({npc.species})</span>
          <span class="npc-party party-{npc.party}">{npc.party.toUpperCase()}</span>
        </div>
        <span class="sentiment-badge {sentimentTier}">{sentimentTier.toUpperCase()}</span>
      </div>

      <!-- Bark Display -->
      <div class="bark-display">
        {#if phase === 'initial'}
          <div class="bark-text">{openingBark}</div>
        {:else if phase === 'engaged'}
          {#if chosenVerb}
            <div class="bark-text">{responseBark}</div>
          {:else}
            <div class="bark-text">{openingBark}</div>
          {/if}
        {:else}
          {#if sentimentChange > 0}
            <div class="bark-text result-positive">SENTIMENT +{sentimentChange}</div>
          {:else if sentimentChange < 0}
            <div class="bark-text result-negative">SENTIMENT {sentimentChange}</div>
          {:else}
            <div class="bark-text result-neutral">NO LASTING IMPRESSION.</div>
          {/if}
        {/if}
      </div>

      <!-- Actions -->
      <div class="qi-actions">
        {#if phase === 'initial'}
          <button class="btn" onclick={handleEngage}>ENGAGE</button>
          <button class="btn {declinePenalty < 0 ? 'btn-danger' : ''}" onclick={handleDecline}>
            {declineLabel}
            {#if declinePenalty < 0}
              ({declinePenalty})
            {/if}
          </button>
        {:else if phase === 'engaged'}
          {#if verbsUsed < maxVerbs}
            {#each availableVerbs as verb}
              <button class="btn" onclick={() => handleVerb(verb)}>{verb}</button>
            {/each}
          {/if}
          {#if verbsUsed > 0 && verbsUsed < maxVerbs}
            <div class="verbs-remaining">{maxVerbs - verbsUsed} ACTION{maxVerbs - verbsUsed > 1 ? 'S' : ''} REMAINING</div>
          {/if}
        {:else}
          <button class="btn" onclick={onComplete}>DONE</button>
        {/if}
      </div>

    </div>
  </div>
</div>

<style>
  .qi-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
    z-index: 100;
  }
  .qi-panel {
    width: 600px;
    min-height: 260px;
    display: flex;
    flex-direction: column;
  }
  .qi-header {
    display: flex;
    justify-content: center;
    padding: 6px 12px;
  }
  .qi-type {
    font-size: 1.15rem;
  }
  .qi-body {
    flex: 1;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  /* NPC Row */
  .npc-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 6px 10px;
    background: var(--marble-white);
    border: 2px solid var(--black);
  }
  .npc-info {
    display: flex;
    gap: 8px;
    align-items: baseline;
  }
  .npc-name {
    font-size: 1.2rem;
    font-weight: bold;
    color: var(--black);
  }
  .npc-species {
    font-size: 1rem;
    color: #555;
  }
  .npc-party {
    font-size: 0.95rem;
    padding: 1px 6px;
    border: 1px solid var(--black);
  }
  .party-feralist {
    background: var(--primary-red);
    color: white;
  }
  .party-communalist {
    background: var(--ega-blue);
    color: white;
  }
  .sentiment-badge {
    font-size: 1.1rem;
    font-weight: bold;
    padding: 2px 8px;
    border: 2px solid var(--black);
    background: var(--marble);
  }

  /* Bark Display */
  .bark-display {
    padding: 10px 12px;
    background: #000;
    border: 2px solid var(--black);
    min-height: 60px;
    display: flex;
    align-items: center;
  }
  .bark-text {
    font-size: 1.15rem;
    color: var(--phosphor-green);
    line-height: 1.3;
  }
  .result-positive {
    color: var(--phosphor-green);
    font-weight: bold;
    font-size: 1.3rem;
  }
  .result-negative {
    color: var(--primary-red);
    font-weight: bold;
    font-size: 1.3rem;
  }
  .result-neutral {
    color: var(--phosphor-dim);
    font-size: 1.15rem;
  }

  /* Actions */
  .qi-actions {
    display: flex;
    gap: 8px;
    justify-content: center;
    flex-wrap: wrap;
    padding-top: 4px;
  }
  .verbs-remaining {
    width: 100%;
    text-align: center;
    font-size: 0.95rem;
    color: var(--phosphor-dim);
    margin-top: 2px;
  }
</style>
