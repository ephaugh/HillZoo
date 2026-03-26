<script lang="ts">
  import { creationStore, creationStep } from '../../stores/creation';
  import {
    COMMITTEE_ISSUES, CROSS_CUTTING_ISSUES, ALL_ISSUES,
    ISSUE_LABELS, type Issue,
  } from '../../core/types';

  let creation = $state($creationStore);
  creationStore.subscribe(v => creation = v);

  let proTags: [Issue | null, Issue | null] = $state([...creation.billProTags] as [Issue | null, Issue | null]);
  let antiTag: Issue | null = $state(creation.billAntiTag);
  let billNumber: number | null = $state(creation.billNumber);
  let billName: string = $state(creation.billName);

  // Faction definitions for alignment display
  const FACTIONS = [
    { name: 'TIMBER UNION', majorPro: 'habitat_burrows' as Issue, majorAnti: 'environment_conservation' as Issue },
    { name: 'GRAZING COUNCIL', majorPro: 'agriculture_foraging' as Issue, majorAnti: 'predation_defense' as Issue },
    { name: 'MIGRATORY COMPACT', majorPro: 'migration_transit' as Issue, majorAnti: 'habitat_burrows' as Issue },
    { name: 'CLAW & FANG', majorPro: 'predation_defense' as Issue, majorAnti: 'agriculture_foraging' as Issue },
    { name: 'WATERSHED ALLIANCE', majorPro: 'freshwater_marine' as Issue, majorAnti: 'migration_transit' as Issue },
    { name: 'BANANA LOBBY', majorPro: 'bananas' as Issue, majorAnti: 'trade_commerce' as Issue },
  ];

  function getTagState(issue: Issue): 'pro' | 'anti' | null {
    if (proTags.includes(issue)) return 'pro';
    if (antiTag === issue) return 'anti';
    return null;
  }

  function toggleIssue(issue: Issue) {
    const current = getTagState(issue);
    if (current === 'pro') {
      // Remove from pro
      if (proTags[0] === issue) proTags = [proTags[1], null];
      else if (proTags[1] === issue) proTags = [proTags[0], null];
    } else if (current === 'anti') {
      // Remove anti
      antiTag = null;
    } else {
      // Add: try pro first, then anti
      if (!proTags[0]) {
        proTags = [issue, proTags[1]];
      } else if (!proTags[1]) {
        proTags = [proTags[0], issue];
      } else if (!antiTag) {
        antiTag = issue;
      }
      // All slots full, ignore
    }
  }

  // Cycle through: unselected -> pro -> anti -> unselected
  function cycleIssue(issue: Issue) {
    const current = getTagState(issue);
    if (current === null) {
      // Try to assign as pro
      if (!proTags[0]) proTags = [issue, proTags[1]];
      else if (!proTags[1]) proTags = [proTags[0], issue];
      else if (!antiTag) antiTag = issue;
    } else if (current === 'pro') {
      // Remove from pro, try to assign as anti
      if (proTags[0] === issue) proTags = [proTags[1], null];
      else proTags = [proTags[0], null];
      if (!antiTag) antiTag = issue;
    } else {
      // Remove anti
      antiTag = null;
    }
  }

  function getFactionOpinion(fac: typeof FACTIONS[0]): string {
    const allProTags = proTags.filter(t => t !== null) as Issue[];
    let pos = false;
    let neg = false;

    for (const t of allProTags) {
      if (t === fac.majorPro) pos = true;
      if (t === fac.majorAnti) neg = true;
    }
    if (antiTag) {
      if (antiTag === fac.majorAnti) pos = true;
      if (antiTag === fac.majorPro) neg = true;
    }

    if (pos && neg) return neg ? 'NEGATIVE' : 'POSITIVE'; // major anti wins on tie
    if (pos) return 'POSITIVE';
    if (neg) return 'NEGATIVE';
    return 'NEUTRAL';
  }

  let canConfirm = $derived(
    proTags[0] !== null && proTags[1] !== null && antiTag !== null &&
    billNumber !== null && billNumber >= 1 && billNumber <= 99 &&
    billName.trim().length > 0
  );

  function confirm() {
    if (!canConfirm) return;
    creationStore.update(s => ({
      ...s,
      billProTags: proTags as [Issue, Issue],
      billAntiTag: antiTag,
      billNumber,
      billName: billName.trim().slice(0, 30),
    }));
    creationStep.set(6);
  }

  function back() {
    creationStep.set(4);
  }

  function handleNumberInput(e: Event) {
    const target = e.target as HTMLInputElement;
    const val = parseInt(target.value);
    if (isNaN(val)) billNumber = null;
    else billNumber = Math.max(1, Math.min(99, val));
  }
</script>

<div class="creation-screen">
  <div class="panel creation-panel">
    <div class="panel-header">STEP 5 OF 8 &mdash; CRAFT YOUR BILL</div>
    <div class="panel-body">
      <div class="bill-layout">
        <div class="tags-section">
          <div class="section-label">COMMITTEE ISSUES</div>
          <div class="tag-grid">
            {#each COMMITTEE_ISSUES as issue}
              <button
                class="issue-tag"
                class:tag-pro={getTagState(issue) === 'pro'}
                class:tag-anti={getTagState(issue) === 'anti'}
                onclick={() => cycleIssue(issue)}
              >
                {#if getTagState(issue) === 'pro'}+{:else if getTagState(issue) === 'anti'}-{/if}
                {ISSUE_LABELS[issue]}
              </button>
            {/each}
          </div>
          <div class="section-label" style="margin-top: 10px;">CROSS-CUTTING ISSUES</div>
          <div class="tag-grid">
            {#each CROSS_CUTTING_ISSUES as issue}
              <button
                class="issue-tag"
                class:tag-pro={getTagState(issue) === 'pro'}
                class:tag-anti={getTagState(issue) === 'anti'}
                onclick={() => cycleIssue(issue)}
              >
                {#if getTagState(issue) === 'pro'}+{:else if getTagState(issue) === 'anti'}-{/if}
                {ISSUE_LABELS[issue]}
              </button>
            {/each}
          </div>

          <div class="selection-status">
            PRO: {proTags.filter(t => t).length}/2 &nbsp;&nbsp; ANTI: {antiTag ? 1 : 0}/1
          </div>

          <div class="bill-naming">
            <div class="name-row">
              <label class="name-label">BILL #:</label>
              <input
                class="name-input number-input"
                type="number"
                min="1"
                max="99"
                value={billNumber ?? ''}
                oninput={handleNumberInput}
              />
            </div>
            <div class="name-row">
              <label class="name-label">NAME:</label>
              <input
                class="name-input text-input"
                type="text"
                maxlength="30"
                placeholder="MAX 30 CHARACTERS"
                value={billName}
                oninput={(e) => billName = (e.target as HTMLInputElement).value}
              />
            </div>
            {#if billNumber && billName.trim()}
              <div class="bill-preview">Z.B. {billNumber}, THE {billName.trim().toUpperCase()} ACT</div>
            {/if}
          </div>
        </div>

        <div class="alignment-section panel">
          <div class="panel-header" style="font-size: 1.1rem;">ALIGNMENT</div>
          <div class="alignment-body">
            {#each FACTIONS as fac}
              {@const opinion = getFactionOpinion(fac)}
              <div class="alignment-row">
                <span class="fac-name">{fac.name}</span>
                <span class="fac-opinion"
                  class:opinion-positive={opinion === 'POSITIVE'}
                  class:opinion-negative={opinion === 'NEGATIVE'}
                  class:opinion-neutral={opinion === 'NEUTRAL'}
                >{opinion}</span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    </div>
    <div class="creation-footer">
      <button class="btn" onclick={back}>BACK</button>
      <div style="flex: 1;"></div>
      <button class="btn" class:btn-disabled={!canConfirm} onclick={confirm} disabled={!canConfirm}>
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
    padding: 10px;
    overflow: hidden;
  }
  .bill-layout {
    display: flex;
    gap: 10px;
    height: 100%;
  }
  .tags-section {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .section-label {
    font-size: 1.1rem;
    color: var(--mahogany);
    margin-bottom: 4px;
    font-weight: bold;
  }
  .tag-grid {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .issue-tag {
    padding: 4px 10px;
    font-size: 1.05rem;
    font-family: var(--pixel-font);
    text-transform: uppercase;
    border: 2px solid var(--black);
    background: var(--marble);
    cursor: pointer;
    box-shadow: inset 1px 1px 0px var(--marble-white), inset -1px -1px 0px #707070;
  }
  .issue-tag:hover {
    background: var(--gold-light);
  }
  .tag-pro {
    background: #006600;
    color: white;
    box-shadow: none;
  }
  .tag-anti {
    background: var(--primary-red);
    color: white;
    box-shadow: none;
  }
  .selection-status {
    margin-top: 8px;
    font-size: 1.1rem;
    color: var(--mahogany);
  }
  .bill-naming {
    margin-top: 10px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .name-row {
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .name-label {
    font-size: 1.1rem;
    color: #555;
    width: 70px;
  }
  .name-input {
    font-family: var(--pixel-font);
    font-size: 1.2rem;
    text-transform: uppercase;
    border: 3px solid var(--black);
    background: var(--marble);
    padding: 4px 8px;
    box-shadow: inset 2px 2px 0px #707070, inset -2px -2px 0px var(--marble-white);
  }
  .number-input {
    width: 70px;
  }
  .text-input {
    flex: 1;
  }
  .bill-preview {
    font-size: 1.3rem;
    color: var(--gold);
    background: var(--mahogany);
    padding: 6px 12px;
    border: 2px solid var(--black);
    text-align: center;
    margin-top: 4px;
  }
  .alignment-section {
    width: 240px;
    display: flex;
    flex-direction: column;
  }
  .alignment-body {
    padding: 8px;
    flex: 1;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .alignment-row {
    display: flex;
    justify-content: space-between;
    font-size: 1.1rem;
    border-bottom: 1px solid #aaa;
    padding-bottom: 4px;
  }
  .fac-name {
    color: #444;
  }
  .opinion-positive {
    color: #006600;
    font-weight: bold;
  }
  .opinion-negative {
    color: var(--primary-red);
    font-weight: bold;
  }
  .opinion-neutral {
    color: #888;
  }
  .creation-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
