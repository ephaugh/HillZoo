<script lang="ts">
  import { creationStore, creationStep, resetCreation } from '../../stores/creation';
  import { gameStore } from '../../stores/game';
  import { ISSUE_LABELS, type Issue, type PartyBalanceSetting } from '../../core/types';
  import { generateWorld } from '../../core/npc-generator';

  let creation = $state($creationStore);
  creationStore.subscribe(v => creation = v);

  const partyLabel = $derived(creation.party === 'feralist' ? 'FERALIST' : 'COMMUNALIST');

  const sliderTierLabel = $derived(
    creation.sliderPosition <= 10 ? 'FULL LOYALIST' :
    creation.sliderPosition <= 30 ? 'LOYALIST-LEANING' :
    creation.sliderPosition <= 70 ? 'MIDDLE' :
    creation.sliderPosition <= 90 ? 'PRAGMATIST-LEANING' :
    'FULL PRAGMATIST'
  );

  const BALANCE_LABELS: Record<PartyBalanceSetting, { label: string; split: string }> = {
    large_majority: { label: 'LARGE MAJORITY', split: '30-20' },
    slim_majority: { label: 'SLIM MAJORITY', split: '27-23' },
    slim_minority: { label: 'SLIM MINORITY', split: '23-27' },
    large_minority: { label: 'LARGE MINORITY', split: '20-30' },
  };

  const balanceInfo = $derived(BALANCE_LABELS[creation.partyBalance]);
  const isPlayerMajority = $derived(creation.partyBalance === 'large_majority' || creation.partyBalance === 'slim_majority');

  const WAR_CHEST_MAP: Record<string, { majority: number; minority: number }> = {
    full_loyalist: { majority: 3500, minority: 3000 },
    loyalist_leaning: { majority: 3000, minority: 2500 },
    middle: { majority: 2500, minority: 2000 },
    pragmatist_leaning: { majority: 2000, minority: 1500 },
    full_pragmatist: { majority: 1500, minority: 1000 },
  };
  const PRIMARY_MAP: Record<string, number> = {
    full_loyalist: 15, loyalist_leaning: 20, middle: 30, pragmatist_leaning: 35, full_pragmatist: 40,
  };

  const sliderKey = $derived(
    creation.sliderPosition <= 10 ? 'full_loyalist' :
    creation.sliderPosition <= 30 ? 'loyalist_leaning' :
    creation.sliderPosition <= 70 ? 'middle' :
    creation.sliderPosition <= 90 ? 'pragmatist_leaning' :
    'full_pragmatist'
  );

  const warChest = $derived(WAR_CHEST_MAP[sliderKey][isPlayerMajority ? 'majority' : 'minority']);
  const primaryMeter = $derived(PRIMARY_MAP[sliderKey]);

  function agendaEntries(agenda: Partial<Record<Issue, 'pro' | 'anti'>>): Array<{ issue: Issue; stance: 'pro' | 'anti' }> {
    return Object.entries(agenda)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => ({ issue: k as Issue, stance: v! }));
  }

  function beginGame() {
    const gameState = generateWorld(creation);
    gameStore.set(gameState);
  }

  function startOver() {
    resetCreation();
  }

  function back() {
    creationStep.set(7);
  }
</script>

<div class="creation-screen">
  <div class="panel creation-panel">
    <div class="panel-header">REVIEW YOUR CHOICES</div>
    <div class="panel-body">

      <!-- Row 1: identity -->
      <div class="row row-3">
        <div class="cell">
          <span class="label">SPECIES</span>
          <span class="val">{creation.species ?? '--'}</span>
        </div>
        <div class="cell">
          <span class="label">PARTY</span>
          <span class="val">{partyLabel}</span>
        </div>
        <div class="cell">
          <span class="label">ALIGNMENT</span>
          <span class="val">{sliderTierLabel}</span>
        </div>
      </div>

      <!-- Row 2: numbers -->
      <div class="row row-3">
        <div class="cell">
          <span class="label">BALANCE</span>
          <span class="val">{balanceInfo.label} {balanceInfo.split}</span>
          <span class="sub">{isPlayerMajority ? 'MAJORITY' : 'MINORITY'}</span>
        </div>
        <div class="cell">
          <span class="label">WAR CHEST</span>
          <span class="val safe">${warChest.toLocaleString()}</span>
        </div>
        <div class="cell">
          <span class="label">PRIMARY</span>
          <span class="val" class:danger={primaryMeter > 30}>{primaryMeter} / 70</span>
          <span class="sub">{creation.primaryDate === 'early' ? 'EARLY (DAY 20)' : 'LATE (DAY 45)'}</span>
        </div>
      </div>

      <!-- Row 3: bill -->
      <div class="row row-full">
        <div class="cell">
          <span class="label">YOUR BILL</span>
          <span class="bill-name">Z.B. {creation.billNumber}, THE {creation.billName.toUpperCase()} ACT</span>
          <span class="tags">
            {#each creation.billProTags as tag}
              {#if tag}
                <span class="tag tag-pro">+ {ISSUE_LABELS[tag]}</span>
              {/if}
            {/each}
            {#if creation.billAntiTag}
              <span class="tag tag-anti">- {ISSUE_LABELS[creation.billAntiTag]}</span>
            {/if}
          </span>
        </div>
      </div>

      <!-- Row 4: district -->
      <div class="row row-full">
        <div class="cell">
          <span class="label">DISTRICT</span>
          {#if creation.district}
            <span class="tags">
              {#each creation.district.strongInterests as interest}
                <span class="tag tag-interest">{ISSUE_LABELS[interest]}</span>
              {/each}
              <span class="tag tag-hostile">HOSTILE: {ISSUE_LABELS[creation.district.hostility]}</span>
            </span>
          {/if}
        </div>
      </div>

      <!-- Row 5: party agenda -->
      <div class="row row-full">
        <div class="cell">
          <span class="label">{partyLabel} AGENDA</span>
          <span class="tags">
            {#each agendaEntries(creation.party === 'feralist' ? creation.feralistAgenda : creation.communalistAgenda) as entry}
              <span class="tag" class:tag-pro={entry.stance === 'pro'} class:tag-anti={entry.stance === 'anti'}>
                {entry.stance === 'pro' ? '+' : '-'} {ISSUE_LABELS[entry.issue]}
              </span>
            {/each}
          </span>
        </div>
      </div>

    </div>
    <div class="creation-footer">
      <button class="btn btn-danger" onclick={startOver}>START OVER</button>
      <button class="btn" onclick={back}>BACK</button>
      <div style="flex: 1;"></div>
      <button class="btn btn-active" onclick={beginGame}>BEGIN GAME</button>
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
    padding: 6px 10px;
    display: flex;
    flex-direction: column;
    gap: 0;
  }
  .row {
    display: flex;
    border-bottom: 1px solid #aaa;
  }
  .row-3 .cell {
    flex: 1;
  }
  .row-3 .cell + .cell {
    border-left: 1px solid #aaa;
  }
  .row-full .cell {
    flex: 1;
  }
  .cell {
    padding: 6px 10px;
    display: flex;
    flex-direction: column;
    gap: 1px;
  }
  .label {
    font-size: 0.95rem;
    color: #555;
  }
  .val {
    font-size: 1.2rem;
    color: var(--black);
    font-weight: bold;
  }
  .sub {
    font-size: 0.95rem;
    color: #666;
  }
  .bill-name {
    font-size: 1.15rem;
    color: var(--gold);
    background: var(--mahogany);
    padding: 2px 8px;
    border: 2px solid var(--black);
    display: inline-block;
    align-self: flex-start;
  }
  .tags {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 2px;
  }
  .tag {
    font-size: 0.95rem;
    padding: 1px 6px;
    border: 2px solid var(--black);
    background: var(--marble-white);
  }
  .tag-pro {
    background: #006600;
    color: white;
  }
  .tag-anti {
    background: var(--primary-red);
    color: white;
  }
  .tag-interest {
    background: var(--ega-cyan);
    color: white;
  }
  .tag-hostile {
    background: #ffcccc;
    color: var(--primary-red);
    border-color: var(--primary-red);
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
    gap: 8px;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
