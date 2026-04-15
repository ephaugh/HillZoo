<script lang="ts">
  import { creationStore, creationStep } from '../../stores/creation';

  let creation = $state($creationStore);
  creationStore.subscribe(v => creation = v);

  let sliderValue = $state(creation.sliderPosition);

  // Derived display values
  let tier = $derived(
    sliderValue <= 10 ? 'full_loyalist' :
    sliderValue <= 30 ? 'loyalist_leaning' :
    sliderValue <= 70 ? 'middle' :
    sliderValue <= 90 ? 'pragmatist_leaning' :
    'full_pragmatist'
  );

  let committeeText = $derived(
    tier === 'full_loyalist' ? 'TOP PICKS' :
    tier === 'loyalist_leaning' ? 'GOOD CHOICES' :
    tier === 'middle' ? 'AVERAGE' :
    tier === 'pragmatist_leaning' ? '3RD-4TH CHOICE' :
    'LOWEST PRIORITY'
  );

  let relationshipText = $derived(
    tier === 'full_loyalist' ? 'WARM WITH PARTY (+25), COLD WITH OPPOSITION (-25)' :
    tier === 'loyalist_leaning' ? 'WARM WITH PARTY (+20), COOL WITH OPPOSITION (-18)' :
    tier === 'middle' ? 'NEUTRAL WITH PARTY (+12), COOL WITH OPPOSITION (-10)' :
    tier === 'pragmatist_leaning' ? 'LUKEWARM WITH PARTY (+7), NEUTRAL WITH OPPOSITION (-5)' :
    'NEUTRAL WITH EVERYONE (+3 / -3)'
  );

  let primaryText = $derived(
    tier === 'full_loyalist' ? 'SAFE BUT FRAGILE' :
    tier === 'loyalist_leaning' ? 'LOW RISK' :
    tier === 'middle' ? 'MODERATE RISK' :
    tier === 'pragmatist_leaning' ? 'CONSTANT LOW THREAT' :
    'HIGH STARTING THREAT'
  );

  const WAR_CHEST_MAP = {
    full_loyalist: { majority: 3500, minority: 3000 },
    loyalist_leaning: { majority: 3000, minority: 2500 },
    middle: { majority: 2500, minority: 2000 },
    pragmatist_leaning: { majority: 2000, minority: 1500 },
    full_pragmatist: { majority: 1500, minority: 1000 },
  };

  const PRIMARY_MAP = {
    full_loyalist: 15,
    loyalist_leaning: 20,
    middle: 30,
    pragmatist_leaning: 35,
    full_pragmatist: 40,
  };

  // Assume majority for now (determined in next step; show majority as default)
  let warChest = $derived(WAR_CHEST_MAP[tier].majority);
  let primaryMeter = $derived(PRIMARY_MAP[tier]);

  // Custom slider drag
  let trackRef: HTMLDivElement | null = $state(null);
  let dragging = $state(false);

  function updateSliderFromEvent(e: MouseEvent) {
    if (!trackRef) return;
    const rect = trackRef.getBoundingClientRect();
    const x = Math.max(0, Math.min(e.clientX - rect.left, rect.width));
    sliderValue = Math.round((x / rect.width) * 100);
  }

  function onMouseDown(e: MouseEvent) {
    dragging = true;
    updateSliderFromEvent(e);
    const onMove = (ev: MouseEvent) => { if (dragging) updateSliderFromEvent(ev); };
    const onUp = () => { dragging = false; window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  }

  function confirm() {
    creationStore.update(s => ({ ...s, sliderPosition: sliderValue }));
    creationStep.set(4);
  }

  function back() {
    creationStep.set(2);
  }
</script>

<div class="creation-screen">
  <div class="panel creation-panel">
    <div class="panel-header">STEP 3 OF 8 &mdash; LOYALIST-PRAGMATIST SLIDER</div>
    <div class="panel-body">
      <div class="slider-section">
        <div class="slider-labels">
          <span class="label-left">LOYALIST</span>
          <span class="label-right">PRAGMATIST</span>
        </div>
        <!-- svelte-ignore a11y_no_static_element_interactions -->
        <div class="slider-track" bind:this={trackRef} onmousedown={onMouseDown}>
          <div class="slider-fill" style="width: {sliderValue}%"></div>
          <div class="slider-thumb" style="left: {sliderValue}%"></div>
          <div class="tick" style="left: 25%"></div>
          <div class="tick" style="left: 50%"></div>
          <div class="tick" style="left: 75%"></div>
        </div>
      </div>

      <div class="effects-panel panel">
        <div class="panel-header" style="font-size: 1.1rem;">CONSEQUENCES</div>
        <div class="effects-grid">
          <div class="effect-row">
            <span class="effect-label">COMMITTEE PRIORITY:</span>
            <span class="effect-value">{committeeText}</span>
          </div>
          <div class="effect-row">
            <span class="effect-label">STARTING RELATIONSHIPS:</span>
            <span class="effect-value">{relationshipText}</span>
          </div>
          <div class="effect-row">
            <span class="effect-label">PRIMARY RISK:</span>
            <span class="effect-value">{primaryText}</span>
          </div>
          <div class="effect-row">
            <span class="effect-label">STARTING WAR CHEST:</span>
            <span class="effect-value safe">${warChest.toLocaleString()}</span>
          </div>
          <div class="effect-row">
            <span class="effect-label">STARTING PRIMARY METER:</span>
            <span class="effect-value" class:danger={primaryMeter > 30}>{primaryMeter} / 70</span>
          </div>
        </div>
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
    padding: 20px 30px;
    display: flex;
    flex-direction: column;
    gap: 20px;
  }
  .slider-section {
    padding: 20px 0;
  }
  .slider-labels {
    display: flex;
    justify-content: space-between;
    font-size: 1.3rem;
    color: var(--mahogany);
    margin-bottom: 12px;
    font-weight: bold;
  }
  .label-left, .label-right {
    font-size: 1.4rem;
  }
  .slider-track {
    position: relative;
    width: 100%;
    height: 24px;
    background: var(--mahogany);
    border: 3px solid var(--black);
    cursor: pointer;
    box-shadow: inset 2px 2px 0px rgba(0,0,0,0.5);
  }
  .slider-fill {
    position: absolute;
    top: 0;
    left: 0;
    height: 100%;
    background: var(--gold);
  }
  .slider-thumb {
    position: absolute;
    top: -6px;
    width: 16px;
    height: 34px;
    background: var(--gold-light);
    border: 3px solid var(--black);
    transform: translateX(-50%);
    cursor: grab;
    box-shadow: inset 2px 2px 0px #fff3c4, inset -2px -2px 0px #8a6508;
  }
  .tick {
    position: absolute;
    top: 0;
    width: 2px;
    height: 100%;
    background: var(--black);
    opacity: 0.4;
  }
  .effects-panel {
    flex: 1;
  }
  .effects-grid {
    padding: 12px 16px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .effect-row {
    display: flex;
    justify-content: space-between;
    font-size: 1.2rem;
    border-bottom: 1px solid #aaa;
    padding-bottom: 6px;
  }
  .effect-label {
    color: #555;
  }
  .effect-value {
    color: var(--black);
    font-weight: bold;
  }
  .safe {
    color: #006600;
  }
  .danger {
    color: var(--primary-red);
  }
  .creation-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
