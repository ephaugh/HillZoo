<script lang="ts">
  import { creationStore, creationStep } from '../../stores/creation';
  import { SPECIES_LIST, type Species } from '../../core/types';
  import { createRng } from '../../core/utils';

  let creation = $state($creationStore);
  creationStore.subscribe(v => creation = v);

  let selected: Species | null = $state(creation.species);

  // Generate deterministic placeholder colors per species
  const rng = createRng(42);
  const speciesColors: Record<string, string> = {};
  for (const s of SPECIES_LIST) {
    const h = Math.floor(rng() * 360);
    const sat = 30 + Math.floor(rng() * 30);
    const lit = 25 + Math.floor(rng() * 20);
    speciesColors[s] = `hsl(${h}, ${sat}%, ${lit}%)`;
  }

  function selectSpecies(species: Species) {
    selected = species;
  }

  function confirm() {
    if (!selected) return;
    creationStore.update(s => ({ ...s, species: selected }));
    creationStep.set(2);
  }
</script>

<div class="creation-screen">
  <div class="panel creation-panel">
    <div class="panel-header">STEP 1 OF 8 &mdash; CHOOSE YOUR SPECIES</div>
    <div class="panel-body">
      <div class="species-grid">
        {#each SPECIES_LIST as species}
          <button
            class="species-cell"
            class:species-selected={selected === species}
            onclick={() => selectSpecies(species)}
          >
            <div class="species-portrait" style="background-color: {speciesColors[species]}"></div>
            <div class="species-name">{species}</div>
          </button>
        {/each}
      </div>
    </div>
    <div class="creation-footer">
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
    padding: 12px;
    overflow: hidden;
  }
  .species-grid {
    display: grid;
    grid-template-columns: repeat(8, 1fr);
    gap: 8px;
  }
  .species-cell {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 6px;
    background: var(--marble);
    border: 3px solid var(--black);
    cursor: pointer;
    font-family: var(--pixel-font);
    font-size: 0.9rem;
    text-transform: uppercase;
    box-shadow: inset 2px 2px 0px var(--marble-white), inset -2px -2px 0px #707070;
  }
  .species-cell:hover {
    background: var(--gold-light);
  }
  .species-selected {
    border: 4px solid var(--gold);
    background: var(--gold-light);
    box-shadow: inset 2px 2px 0px rgba(255,255,255,0.4), inset -2px -2px 0px #8a6508;
  }
  .species-portrait {
    width: 54px;
    height: 54px;
    border: 2px solid var(--black);
    image-rendering: pixelated;
  }
  .species-name {
    font-size: 1rem;
    color: var(--black);
    text-align: center;
  }
  .creation-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
