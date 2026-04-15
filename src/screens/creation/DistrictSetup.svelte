<script lang="ts">
  import { creationStore, creationStep } from '../../stores/creation';
  import { ISSUE_LABELS, type Issue, type District } from '../../core/types';
  import { createRng } from '../../core/utils';
  import { generatePlayerDistrict } from '../../core/npc-generator';

  let creation = $state($creationStore);
  creationStore.subscribe(v => creation = v);

  // Generate initial district
  let rngCounter = $state(0);

  function makeDistrict(): District {
    const proTags = creation.billProTags.filter(t => t !== null) as [Issue, Issue];
    if (proTags.length < 2) {
      return { strongInterests: ['agriculture_foraging', 'habitat_burrows'], hostility: 'predation_defense' };
    }
    const rng = createRng(creation.seed + 9999 + rngCounter);
    return generatePlayerDistrict(rng, proTags);
  }

  let district: District = $state(makeDistrict());
  let rerollUsed = $state(creation.rerollUsed);

  function reroll() {
    if (rerollUsed) return;
    rngCounter++;
    district = makeDistrict();
    rerollUsed = true;
  }

  // Check alignment with player's bill
  function getAlignment(issue: Issue): 'aligned' | 'conflicting' | 'none' {
    const proTags = creation.billProTags.filter(t => t !== null);
    if (proTags.includes(issue)) return 'aligned';
    if (creation.billAntiTag === issue) return 'conflicting';
    return 'none';
  }

  function confirm() {
    creationStore.update(s => ({ ...s, district, rerollUsed }));
    creationStep.set(8);
  }

  function back() {
    creationStep.set(6);
  }
</script>

<div class="creation-screen">
  <div class="panel creation-panel">
    <div class="panel-header">STEP 7 OF 8 &mdash; YOUR DISTRICT</div>
    <div class="panel-body">
      <div class="district-layout">
        <div class="district-card panel">
          <div class="panel-header" style="font-size: 1.1rem;">DISTRICT PROFILE</div>
          <div class="district-body">
            <div class="district-section">
              <div class="district-label">STRONG INTERESTS:</div>
              {#each district.strongInterests as interest}
                {@const align = getAlignment(interest)}
                <div class="district-tag"
                  class:tag-aligned={align === 'aligned'}
                  class:tag-conflict={align === 'conflicting'}
                >
                  {ISSUE_LABELS[interest]}
                  {#if align === 'aligned'}
                    <span class="align-badge positive">ALIGNED</span>
                  {:else if align === 'conflicting'}
                    <span class="align-badge negative">CONFLICT</span>
                  {/if}
                </div>
              {/each}
            </div>
            <div class="district-section">
              <div class="district-label hostility-label">HOSTILITY:</div>
              <div class="district-tag tag-hostile">
                {ISSUE_LABELS[district.hostility]}
                {#if getAlignment(district.hostility) === 'aligned'}
                  <span class="align-badge negative">YOUR PRO-TAG!</span>
                {:else if getAlignment(district.hostility) === 'conflicting'}
                  <span class="align-badge positive">MATCHES ANTI</span>
                {/if}
              </div>
            </div>
          </div>
        </div>

        <div class="district-info panel">
          <div class="panel-header" style="font-size: 1.1rem;">BILL ALIGNMENT</div>
          <div class="info-body">
            <p>YOUR DISTRICT SHARES AT LEAST ONE INTEREST WITH YOUR BILL.</p>
            <p style="margin-top: 8px;">VOTES AGAINST YOUR DISTRICT'S INTERESTS INCREASE YOUR PRIMARY THREAT METER.</p>
            <p style="margin-top: 8px;">VOTES WITH YOUR DISTRICT'S INTERESTS DECREASE IT.</p>
            <p style="margin-top: 16px; color: var(--primary-red);">HOSTILITY: BILLS TOUCHING THIS ISSUE WILL ANGER YOUR CONSTITUENTS.</p>
          </div>
        </div>
      </div>

      <div class="district-actions">
        <button
          class="btn"
          class:btn-disabled={rerollUsed}
          onclick={reroll}
          disabled={rerollUsed}
        >
          {rerollUsed ? 'REROLL USED' : 'REROLL'}
        </button>
      </div>
    </div>
    <div class="creation-footer">
      <button class="btn" onclick={back}>BACK</button>
      <div style="flex: 1;"></div>
      <button class="btn" onclick={confirm}>CONFIRM</button>
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
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 14px;
  }
  .district-layout {
    display: flex;
    gap: 14px;
    flex: 1;
  }
  .district-card {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .district-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .district-section {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .district-label {
    font-size: 1.2rem;
    color: var(--mahogany);
    font-weight: bold;
  }
  .hostility-label {
    color: var(--primary-red);
  }
  .district-tag {
    font-size: 1.3rem;
    padding: 6px 14px;
    border: 2px solid var(--black);
    background: var(--marble-white);
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tag-aligned {
    border-color: #006600;
  }
  .tag-conflict {
    border-color: var(--primary-red);
  }
  .tag-hostile {
    background: #ffcccc;
    border-color: var(--primary-red);
    color: var(--primary-red);
  }
  .align-badge {
    font-size: 1rem;
    padding: 2px 8px;
    border: 1px solid var(--black);
  }
  .align-badge.positive {
    background: #006600;
    color: white;
  }
  .align-badge.negative {
    background: var(--primary-red);
    color: white;
  }
  .district-info {
    width: 320px;
    display: flex;
    flex-direction: column;
  }
  .info-body {
    padding: 16px;
    font-size: 1.15rem;
    color: #444;
    line-height: 1.3;
  }
  .district-actions {
    display: flex;
    justify-content: center;
  }
  .creation-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
