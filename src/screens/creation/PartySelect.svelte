<script lang="ts">
  import { creationStore, creationStep } from '../../stores/creation';
  import { ISSUE_LABELS, type PartyName, type Issue } from '../../core/types';

  let creation = $state($creationStore);
  creationStore.subscribe(v => creation = v);

  let selected: PartyName | null = $state(creation.party);

  function agendaEntries(agenda: Partial<Record<Issue, 'pro' | 'anti'>>): Array<{ issue: Issue; stance: 'pro' | 'anti' }> {
    return Object.entries(agenda)
      .filter(([_, v]) => v !== undefined)
      .map(([k, v]) => ({ issue: k as Issue, stance: v! }));
  }

  function confirm() {
    if (!selected) return;
    creationStore.update(s => ({ ...s, party: selected }));
    creationStep.set(3);
  }

  function back() {
    creationStep.set(1);
  }
</script>

<div class="creation-screen">
  <div class="panel creation-panel">
    <div class="panel-header">STEP 2 OF 8 &mdash; CHOOSE YOUR PARTY</div>
    <div class="panel-body">
      <div class="party-columns">
        <button
          class="party-column"
          class:party-selected={selected === 'feralist'}
          class:party-dimmed={selected === 'communalist'}
          onclick={() => selected = 'feralist'}
        >
          <div class="party-name">FERALIST</div>
          <div class="party-desc">TRADITION, STABILITY, AND THE NATURAL ORDER</div>
          <div class="party-agenda-label">SESSION AGENDA:</div>
          {#each agendaEntries(creation.feralistAgenda) as entry}
            <div class="agenda-tag" class:tag-pro={entry.stance === 'pro'} class:tag-anti={entry.stance === 'anti'}>
              {entry.stance === 'pro' ? '+' : '-'} {ISSUE_LABELS[entry.issue]}
            </div>
          {/each}
        </button>

        <div class="party-divider"></div>

        <button
          class="party-column"
          class:party-selected={selected === 'communalist'}
          class:party-dimmed={selected === 'feralist'}
          onclick={() => selected = 'communalist'}
        >
          <div class="party-name">COMMUNALIST</div>
          <div class="party-desc">PROGRESS, COOPERATION, AND SHARED RESOURCES</div>
          <div class="party-agenda-label">SESSION AGENDA:</div>
          {#each agendaEntries(creation.communalistAgenda) as entry}
            <div class="agenda-tag" class:tag-pro={entry.stance === 'pro'} class:tag-anti={entry.stance === 'anti'}>
              {entry.stance === 'pro' ? '+' : '-'} {ISSUE_LABELS[entry.issue]}
            </div>
          {/each}
        </button>
      </div>
    </div>
    <div class="creation-footer">
      <button class="btn" onclick={back}>BACK</button>
      <div style="flex: 1;"></div>
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
    padding: 16px;
    display: flex;
    align-items: stretch;
  }
  .party-columns {
    display: flex;
    gap: 0;
    width: 100%;
  }
  .party-column {
    flex: 1;
    padding: 20px;
    background: var(--marble);
    border: 3px solid var(--black);
    cursor: pointer;
    text-align: center;
    font-family: var(--pixel-font);
    text-transform: uppercase;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 8px;
    box-shadow: inset 2px 2px 0px var(--marble-white), inset -2px -2px 0px #707070;
  }
  .party-column:hover {
    background: var(--gold-light);
  }
  .party-selected {
    border: 4px solid var(--gold);
    background: var(--gold-light);
    box-shadow: inset 2px 2px 0px rgba(255,255,255,0.4), inset -2px -2px 0px #8a6508;
  }
  .party-dimmed {
    opacity: 0.6;
  }
  .party-divider {
    width: 6px;
    background: var(--mahogany);
  }
  .party-name {
    font-size: 2rem;
    color: var(--mahogany);
    font-weight: bold;
  }
  .party-desc {
    font-size: 1.1rem;
    color: #555;
    margin-bottom: 8px;
  }
  .party-agenda-label {
    font-size: 1.1rem;
    color: var(--mahogany);
    margin-top: 12px;
    border-top: 2px solid var(--black);
    padding-top: 8px;
    width: 100%;
  }
  .agenda-tag {
    font-size: 1.2rem;
    padding: 3px 10px;
    border: 2px solid var(--black);
    margin: 2px;
  }
  .tag-pro {
    background: #006600;
    color: white;
  }
  .tag-anti {
    background: var(--primary-red);
    color: white;
  }
  .creation-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
