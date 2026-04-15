<script lang="ts">
  import { creationStore, creationStep } from '../../stores/creation';
  import type { PartyBalanceSetting } from '../../core/types';

  let creation = $state($creationStore);
  creationStore.subscribe(v => creation = v);

  let selected: PartyBalanceSetting = $state(creation.partyBalance);

  const partyName = $derived(creation.party === 'feralist' ? 'FERALIST' : 'COMMUNALIST');

  interface BalanceOption {
    id: PartyBalanceSetting;
    label: string;
    split: string;
    presidentParty: string;
    difficulty: string;
    difficultyColor: string;
    description: string;
    playerIsMajority: boolean;
  }

  let options: BalanceOption[] = $derived([
    {
      id: 'large_majority',
      label: 'LARGE MAJORITY',
      split: '30 - 20',
      presidentParty: partyName,
      difficulty: 'STANDARD',
      difficultyColor: '#006600',
      description: 'COMFORTABLE MARGIN. FOCUS ON POLICY, NOT VOTE-COUNTING.',
      playerIsMajority: true,
    },
    {
      id: 'slim_majority',
      label: 'SLIM MAJORITY',
      split: '27 - 23',
      presidentParty: partyName,
      difficulty: 'CHALLENGING',
      difficultyColor: 'var(--warm-amber)',
      description: 'EVERY VOTE MATTERS. ONE DEFECTION CAN SINK YOU. RECOMMENDED.',
      playerIsMajority: true,
    },
    {
      id: 'slim_minority',
      label: 'SLIM MINORITY',
      split: '23 - 27',
      presidentParty: creation.party === 'feralist' ? 'COMMUNALIST' : 'FERALIST',
      difficulty: 'HARD',
      difficultyColor: 'var(--primary-red)',
      description: 'YOU NEED CROSS-AISLE SUPPORT TO PASS ANYTHING.',
      playerIsMajority: false,
    },
    {
      id: 'large_minority',
      label: 'LARGE MINORITY',
      split: '20 - 30',
      presidentParty: creation.party === 'feralist' ? 'COMMUNALIST' : 'FERALIST',
      difficulty: 'BRUTAL',
      difficultyColor: 'var(--primary-red)',
      description: 'DEEP IN THE WILDERNESS. OMNIBUS OR BUST.',
      playerIsMajority: false,
    },
  ]);

  function confirm() {
    creationStore.update(s => ({ ...s, partyBalance: selected }));
    creationStep.set(5);
  }

  function back() {
    creationStep.set(3);
  }
</script>

<div class="creation-screen">
  <div class="panel creation-panel">
    <div class="panel-header">STEP 4 OF 8 &mdash; PARTY BALANCE</div>
    <div class="panel-body">
      <div class="balance-options">
        {#each options as opt}
          <button
            class="balance-row"
            class:balance-selected={selected === opt.id}
            onclick={() => selected = opt.id}
          >
            <div class="balance-name">{opt.label}</div>
            <div class="balance-split">{opt.split}</div>
            <div class="balance-president">PRESIDENT: {opt.presidentParty}</div>
            <div class="balance-difficulty" style="color: {opt.difficultyColor}">{opt.difficulty}</div>
            <div class="balance-desc">{opt.description}</div>
          </button>
        {/each}
      </div>

      <div class="balance-summary">
        YOUR PARTY ({partyName}) IS THE
        <span class:majority={options.find(o => o.id === selected)?.playerIsMajority}
              class:minority={!options.find(o => o.id === selected)?.playerIsMajority}>
          {options.find(o => o.id === selected)?.playerIsMajority ? 'MAJORITY' : 'MINORITY'}
        </span>
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
    gap: 12px;
  }
  .balance-options {
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1;
  }
  .balance-row {
    display: grid;
    grid-template-columns: 200px 80px 180px 100px 1fr;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    background: var(--marble);
    border: 3px solid var(--black);
    cursor: pointer;
    font-family: var(--pixel-font);
    font-size: 1.15rem;
    text-transform: uppercase;
    text-align: left;
    box-shadow: inset 2px 2px 0px var(--marble-white), inset -2px -2px 0px #707070;
  }
  .balance-row:hover {
    background: var(--gold-light);
  }
  .balance-selected {
    border: 4px solid var(--gold);
    background: var(--gold-light);
    box-shadow: inset 2px 2px 0px rgba(255,255,255,0.4), inset -2px -2px 0px #8a6508;
  }
  .balance-name {
    font-size: 1.3rem;
    font-weight: bold;
    color: var(--mahogany);
  }
  .balance-split {
    font-size: 1.4rem;
    text-align: center;
  }
  .balance-president {
    font-size: 1rem;
    color: #555;
  }
  .balance-difficulty {
    font-weight: bold;
    font-size: 1.2rem;
    text-align: center;
  }
  .balance-desc {
    font-size: 1rem;
    color: #444;
  }
  .balance-summary {
    font-size: 1.4rem;
    text-align: center;
    padding: 10px;
    color: var(--mahogany);
  }
  .majority {
    color: #006600;
    font-weight: bold;
  }
  .minority {
    color: var(--primary-red);
    font-weight: bold;
  }
  .creation-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
