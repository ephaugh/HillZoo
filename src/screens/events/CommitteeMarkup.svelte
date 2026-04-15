<script lang="ts">
  import type { GameState, Issue } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';
  import { gameStore } from '../../stores/game';
  import { findCommitteeForBill, generateAmendments, applyAmendment, type ProposedAmendment } from '../../core/committees';

  let { gameState, onComplete }: { gameState: GameState; onComplete: () => void } = $props();

  let bill = $derived(gameState.playerBill);
  let committee = $derived(findCommitteeForBill(bill, gameState));

  let amendments = $derived(
    generateAmendments(bill, committee, gameState, gameState.seed + gameState.currentDay * 1000 + 42)
  );

  // Step-through state
  let currentAmendIdx = $state(0);
  let allRevealed = $state(false);
  let noAmendments = $derived(amendments.length === 0);

  function nextAmendment() {
    if (currentAmendIdx < amendments.length - 1) {
      currentAmendIdx++;
    } else {
      allRevealed = true;
    }
  }

  function finalize() {
    gameStore.update(s => {
      if (!s) return s;
      let updatedBill = { ...s.playerBill };

      // Apply all passed amendments to the bill
      for (const a of amendments.filter(a => a.passed)) {
        updatedBill = applyAmendment(updatedBill, a);
        // Set the day on the last amendment entry
        const lastAmend = updatedBill.amendmentHistory[updatedBill.amendmentHistory.length - 1];
        if (lastAmend) lastAmend.day = s.currentDay;
      }

      // Advance to budget scoring
      updatedBill.stage = 'budget';

      return { ...s, playerBill: updatedBill };
    });

    onComplete();
  }

  // Type labels for display
  const TYPE_LABELS: Record<string, string> = {
    add_pro: 'ADD PRO-TAG',
    add_anti: 'ADD ANTI-TAG',
    remove: 'REMOVE TAG',
    flip: 'FLIP TAG',
  };

  function isHelpful(type: string): boolean {
    return type === 'add_pro' || type === 'remove';
  }
</script>

<div class="markup-screen">
  <div class="panel markup-panel">
    <div class="panel-header" style="display: flex; justify-content: space-between;">
      <span>COMMITTEE MARKUP &mdash; {committee.name.toUpperCase()}</span>
      <span>Z.B. {bill.number}</span>
    </div>
    <div class="markup-body">

      <!-- Bill Current State -->
      <div class="bill-bar">
        <span class="bill-label">CURRENT TAGS:</span>
        {#each bill.proTags as tag}
          <span class="tag tag-pro">+ {ISSUE_LABELS[tag]}</span>
        {/each}
        <span class="tag tag-anti">- {ISSUE_LABELS[bill.antiTag]}</span>
        {#if amendments.length > 0}
          <span class="amend-count">{amendments.filter(a => a.passed).length} OF {amendments.length} ADOPTED</span>
        {/if}
      </div>

      <!-- Amendments -->
      <div class="amendments-section">
        {#if noAmendments}
          <div class="no-amendments">
            <div class="section-title">NO AMENDMENTS PROPOSED</div>
            <div class="no-amend-text">
              ALL COMMITTEE MEMBERS ARE SATISFIED WITH THE BILL AS WRITTEN.
              THE BILL ADVANCES WITHOUT MODIFICATION.
            </div>
          </div>
        {:else}
          <div class="section-title">AMENDMENTS ({amendments.length} PROPOSED)</div>
          <div class="amendments-list">
            {#each amendments as amendment, idx}
              {#if idx <= currentAmendIdx}
                <div class="amendment-row" class:amendment-current={idx === currentAmendIdx && !allRevealed}>
                  <div class="amend-header">
                    <span class="amend-num">#{idx + 1}</span>
                    <span class="amend-proposer">
                      {amendment.proposer.name.toUpperCase()}
                      (SEN. {amendment.proposer.seniority},
                      {amendment.proposer.party === 'feralist' ? 'F' : 'C'})
                    </span>
                  </div>
                  <div class="amend-rationale">{amendment.rationale}</div>
                  <div class="amend-action">
                    <span class="amend-type"
                      class:type-helpful={isHelpful(amendment.type)}
                      class:type-harmful={!isHelpful(amendment.type)}
                    >{TYPE_LABELS[amendment.type]}</span>
                    <span class="amend-target">{ISSUE_LABELS[amendment.targetIssue]}</span>
                  </div>
                  <div class="amend-vote">
                    <span class="vote-tally">YES: {amendment.yesVotes} &bull; NO: {amendment.noVotes}</span>
                    <span class="vote-result" class:vote-pass={amendment.passed} class:vote-fail={!amendment.passed}>
                      {amendment.passed ? 'ADOPTED' : 'REJECTED'}
                    </span>
                  </div>
                </div>
              {/if}
            {/each}
          </div>
        {/if}
      </div>

      <!-- Intel Ledger -->
      <div class="intel-ledger">
        {#if noAmendments}
          > BILL CLEARS MARKUP UNAMENDED
        {:else}
          > MARKUP: {currentAmendIdx + 1} OF {amendments.length} CONSIDERED
          {#if allRevealed}
            &mdash; {amendments.filter(a => a.passed).length} ADOPTED, {amendments.filter(a => !a.passed).length} REJECTED
          {/if}
        {/if}
      </div>
    </div>

    <div class="markup-footer">
      {#if noAmendments}
        <button class="btn" onclick={finalize}>ADVANCE TO BUDGET SCORING</button>
      {:else if !allRevealed}
        <button class="btn" onclick={nextAmendment}>
          {#if currentAmendIdx < amendments.length - 1}
            NEXT AMENDMENT
          {:else}
            CONCLUDE MARKUP
          {/if}
        </button>
      {:else}
        <button class="btn" onclick={finalize}>ADVANCE TO BUDGET SCORING</button>
      {/if}
    </div>
  </div>
</div>

<style>
  .markup-screen {
    width: 100%;
    height: 100%;
    padding: 14px;
  }
  .markup-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .markup-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .bill-bar {
    padding: 6px 14px;
    background: var(--marble-white);
    border-bottom: 2px solid var(--black);
    display: flex;
    align-items: center;
    gap: 6px;
    flex-wrap: wrap;
  }
  .bill-label {
    font-size: 1rem;
    color: #555;
  }
  .tag {
    font-size: 0.95rem;
    padding: 1px 6px;
    border: 2px solid var(--black);
    color: white;
  }
  .tag-pro { background: #006600; }
  .tag-anti { background: var(--primary-red); }
  .amend-count {
    margin-left: auto;
    font-size: 1rem;
    color: var(--warm-amber);
  }
  .amendments-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .section-title {
    font-size: 1.05rem;
    color: var(--mahogany);
    padding: 4px 14px;
    background: var(--marble-dark);
    border-bottom: 1px solid #aaa;
    font-weight: bold;
  }
  .no-amendments {
    flex: 1;
    display: flex;
    flex-direction: column;
  }
  .no-amend-text {
    padding: 24px;
    font-size: 1.3rem;
    color: #006600;
    text-align: center;
  }
  .amendments-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 6px 14px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .amendments-list::-webkit-scrollbar { display: none; }
  .amendment-row {
    padding: 8px 10px;
    background: var(--marble-white);
    border: 2px solid #999;
  }
  .amendment-current {
    border-color: var(--gold);
    background: var(--gold-light);
  }
  .amend-header {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 2px;
  }
  .amend-num {
    font-size: 1.2rem;
    color: var(--mahogany);
    font-weight: bold;
  }
  .amend-proposer {
    font-size: 1.05rem;
    color: var(--black);
  }
  .amend-rationale {
    font-size: 1rem;
    color: #444;
    margin-bottom: 4px;
    padding-left: 28px;
    line-height: 1.2;
  }
  .amend-action {
    display: flex;
    gap: 8px;
    align-items: center;
    margin-bottom: 4px;
    padding-left: 28px;
  }
  .amend-type {
    font-size: 1rem;
    padding: 1px 8px;
    border: 2px solid var(--black);
    color: white;
    font-weight: bold;
  }
  .type-helpful { background: #006600; }
  .type-harmful { background: var(--primary-red); }
  .amend-target {
    font-size: 1.1rem;
    color: var(--black);
  }
  .amend-vote {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 28px;
  }
  .vote-tally {
    font-size: 1rem;
    color: #555;
  }
  .vote-result {
    font-size: 1.1rem;
    padding: 2px 10px;
    border: 2px solid var(--black);
    font-weight: bold;
  }
  .vote-pass {
    background: #006600;
    color: white;
  }
  .vote-fail {
    background: var(--primary-red);
    color: white;
  }
  .intel-ledger {
    background: #000;
    padding: 6px 10px;
    font-size: 1.05rem;
    border-top: 3px solid var(--black);
    color: var(--phosphor-green);
    line-height: 1.3;
    margin-top: auto;
  }
  .markup-footer {
    padding: 8px 12px;
    display: flex;
    justify-content: flex-end;
    border-top: 3px solid var(--black);
    background: var(--marble-dark);
  }
</style>
