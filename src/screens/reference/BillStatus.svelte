<script lang="ts">
  import type { GameState, Bill, BillStage } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';

  export let gameState: GameState;
  export let onClose: () => void;

  function getIssueName(issue: string): string {
    return ISSUE_LABELS[issue as keyof typeof ISSUE_LABELS] ?? issue;
  }

  function getStageColor(stage: BillStage): string {
    if (stage === 'referral' || stage === 'hearing') return '#444';
    if (stage === 'markup' || stage === 'budget') return 'var(--warm-amber)';
    if (stage === 'queue' || stage === 'floor' || stage === 'president') return 'var(--ega-blue)';
    if (stage === 'law') return '#006600';
    if (stage === 'dead') return 'var(--primary-red)';
    return '#444';
  }

  function getStageTextColor(stage: BillStage): string {
    if (stage === 'referral' || stage === 'hearing') return 'var(--marble-white)';
    return '#fff';
  }

  function getAuthorName(authorId: string): string {
    if (authorId === 'player') return 'YOU';
    const npc = gameState.npcs.find(n => n.id === authorId);
    return npc ? npc.name : 'UNKNOWN';
  }

  function getBurdenLabel(bill: Bill): string {
    if (!bill.burdenRating) return '---';
    return bill.burdenRating.toUpperCase();
  }

  $: playerBill = gameState.playerBill;
  $: npcBills = gameState.npcBills;
</script>

<div class="panel reference-screen">
  <div class="panel-header header-row">
    <span>BILL STATUS</span>
    <button class="btn btn-close" on:click={onClose}>CLOSE</button>
  </div>

  <div class="bill-body">
    <!-- Player's Bill -->
    <div class="player-bill-section">
      <div class="section-header">YOUR BILL</div>
      <div class="player-bill-card">
        <div class="bill-title-row">
          <span class="bill-number">AB-{playerBill.number}</span>
          <span class="bill-name">{playerBill.name}</span>
          <span class="stage-badge" style="background: {getStageColor(playerBill.stage)}; color: {getStageTextColor(playerBill.stage)}">{playerBill.stage.toUpperCase()}</span>
        </div>
        <div class="bill-details-row">
          <div class="tags-row">
            {#each playerBill.proTags as tag}
              <span class="tag tag-pro">+{getIssueName(tag)}</span>
            {/each}
            <span class="tag tag-anti">-{getIssueName(playerBill.antiTag)}</span>
          </div>
          <div class="bill-stats">
            <span class="stat-item">COSPONSORS: {playerBill.cosponsors.length}</span>
            <span class="stat-item">BURDEN: {getBurdenLabel(playerBill)}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- NPC Bills -->
    <div class="npc-bills-section">
      <div class="section-header">CONGRESS BILLS ({npcBills.length})</div>
      <div class="npc-bill-list-header">
        <span class="col-billnum">BILL</span>
        <span class="col-billname">NAME</span>
        <span class="col-author">AUTHOR</span>
        <span class="col-tags">TAGS</span>
        <span class="col-stage">STAGE</span>
      </div>
      <div class="npc-bill-list">
        {#each npcBills as bill (bill.id)}
          <div class="npc-bill-row">
            <span class="col-billnum">AB-{bill.number}</span>
            <span class="col-billname">{bill.name}</span>
            <span class="col-author">{getAuthorName(bill.author)}</span>
            <span class="col-tags">
              {#each bill.proTags as tag}
                <span class="mini-tag pro">+{getIssueName(tag).split(' ')[0]}</span>
              {/each}
              <span class="mini-tag anti">-{getIssueName(bill.antiTag).split(' ')[0]}</span>
            </span>
            <span class="col-stage">
              <span class="stage-badge-sm" style="background: {getStageColor(bill.stage)}; color: {getStageTextColor(bill.stage)}">{bill.stage.toUpperCase()}</span>
            </span>
          </div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .reference-screen {
    width: 980px;
    height: 560px;
    display: flex;
    flex-direction: column;
  }
  .header-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .btn-close {
    padding: 2px 10px;
    font-size: 1rem;
  }
  .bill-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
  }
  .section-header {
    background: var(--mahogany);
    color: var(--gold);
    padding: 3px 12px;
    font-size: 1rem;
    border-bottom: 2px solid var(--black);
  }
  .player-bill-card {
    padding: 8px 12px;
    border-bottom: 3px solid var(--black);
  }
  .bill-title-row {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
  }
  .bill-number {
    font-size: 1.2rem;
    color: var(--ega-blue);
    font-weight: bold;
  }
  .bill-name {
    font-size: 1.2rem;
    flex: 1;
  }
  .stage-badge {
    padding: 2px 10px;
    font-size: 1rem;
    border: 2px solid var(--black);
    font-weight: bold;
  }
  .stage-badge-sm {
    padding: 1px 6px;
    font-size: 0.85rem;
    border: 2px solid var(--black);
  }
  .bill-details-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .tags-row {
    display: flex;
    gap: 6px;
  }
  .tag {
    padding: 1px 8px;
    font-size: 0.9rem;
    border: 2px solid var(--black);
  }
  .tag-pro {
    background: #006600;
    color: #fff;
  }
  .tag-anti {
    background: var(--primary-red);
    color: #fff;
  }
  .bill-stats {
    display: flex;
    gap: 16px;
    font-size: 1rem;
    color: #444;
  }
  .npc-bills-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .npc-bill-list-header {
    display: flex;
    padding: 3px 12px;
    background: var(--marble-dark);
    font-size: 0.9rem;
    color: #333;
    border-bottom: 2px solid var(--black);
  }
  .npc-bill-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .npc-bill-list::-webkit-scrollbar {
    display: none;
  }
  .npc-bill-row {
    display: flex;
    padding: 3px 12px;
    font-size: 1rem;
    border-bottom: 1px solid #999;
    align-items: center;
  }
  .npc-bill-row:hover {
    background: var(--marble-white);
  }
  .col-billnum {
    width: 80px;
    flex-shrink: 0;
    font-weight: bold;
  }
  .col-billname {
    width: 200px;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .col-author {
    width: 150px;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #555;
  }
  .col-tags {
    flex: 1;
    display: flex;
    gap: 4px;
    overflow: hidden;
  }
  .col-stage {
    width: 100px;
    flex-shrink: 0;
    text-align: right;
  }
  .mini-tag {
    padding: 0px 4px;
    font-size: 0.8rem;
    border: 1px solid var(--black);
  }
  .mini-tag.pro {
    background: #006600;
    color: #fff;
  }
  .mini-tag.anti {
    background: var(--primary-red);
    color: #fff;
  }
</style>
