<script lang="ts">
  import type { GameState, Committee, Bill } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';
  import { getSentimentTier } from '../../core/utils';
  import { getNpcRoleLabel } from '../../core/roles';
  import { findCommitteeForBill } from '../../core/committees';

  let { gameState, onClose }: { gameState: GameState; onClose: () => void } = $props();

  let selectedCommitteeId: string | null = $state(null);

  // Default to the player's first committee
  $effect(() => {
    if (!selectedCommitteeId && gameState.player.committees.length > 0) {
      selectedCommitteeId = gameState.player.committees[0];
    }
  });

  let selectedCommittee = $derived(
    gameState.committees.find(c => c.id === selectedCommitteeId) ?? gameState.committees[0]
  );

  let isPlayerCommittee = $derived(
    gameState.player.committees.includes(selectedCommittee.id)
  );

  interface MemberDisplay {
    id: string;
    name: string;
    party: string;
    seniority: number;
    tier: string;
    isChair: boolean;
    isPlayer: boolean;
    role: string;
    hue: number;
  }

  let members = $derived((): MemberDisplay[] => {
    return selectedCommittee.members.map(mId => {
      if (mId === 'player') {
        return {
          id: 'player',
          name: `Sen. ${gameState.player.species} (YOU)`,
          party: gameState.player.party,
          seniority: 1,
          tier: '--',
          isChair: false,
          isPlayer: true,
          role: '',
          hue: gameState.player.species.length * 37 % 360,
        };
      }
      const npc = gameState.npcs.find(n => n.id === mId);
      if (!npc) return null;
      return {
        id: mId,
        name: npc.name,
        party: npc.party,
        seniority: npc.seniority,
        tier: getSentimentTier(gameState.sentiment[mId] ?? 0),
        isChair: mId === selectedCommittee.chair,
        isPlayer: false,
        role: getNpcRoleLabel(mId, gameState),
        hue: npc.name.length * 37 % 360,
      };
    }).filter((m): m is MemberDisplay => m !== null)
      .sort((a, b) => {
        if (a.isChair) return -1;
        if (b.isChair) return 1;
        if (a.isPlayer) return -1;
        if (b.isPlayer) return 1;
        return b.seniority - a.seniority;
      });
  });

  // Bills associated with this committee (pending or in process)
  let committeeBills = $derived((): Array<{ bill: Bill; authorName: string; isPlayerBill: boolean }> => {
    const allBills = [gameState.playerBill, ...gameState.npcBills];
    return allBills
      .filter(b => {
        if (b.stage === 'dead' || b.stage === 'law') return false;
        const comm = findCommitteeForBill(b, gameState);
        return comm.id === selectedCommittee.id;
      })
      .map(b => {
        const isPlayerBill = b.author === 'player';
        const author = isPlayerBill
          ? `Sen. ${gameState.player.species}`
          : (gameState.npcs.find(n => n.id === b.author)?.name ?? 'UNKNOWN');
        return { bill: b, authorName: author, isPlayerBill };
      })
      .sort((a, b) => {
        // Player bill first, then by stage progress
        if (a.isPlayerBill) return -1;
        if (b.isPlayerBill) return 1;
        return 0;
      });
  });

  let stageColor = (stage: string): string => {
    switch (stage) {
      case 'referral': case 'hearing': return '#555';
      case 'markup': case 'budget': return 'var(--warm-amber)';
      case 'queue': case 'floor': return 'var(--ega-blue)';
      case 'president': return 'var(--gold)';
      case 'law': return '#006600';
      case 'dead': return 'var(--primary-red)';
      default: return '#555';
    }
  };
</script>

<div class="panel reference-screen">
  <div class="panel-header header-row">
    <span>COMMITTEES</span>
    <button class="btn btn-close" onclick={onClose}>CLOSE</button>
  </div>

  <!-- Committee selector tabs -->
  <div class="committee-tabs">
    {#each gameState.committees as comm}
      <button
        class="comm-tab"
        class:comm-active={selectedCommitteeId === comm.id}
        class:comm-player={gameState.player.committees.includes(comm.id)}
        onclick={() => selectedCommitteeId = comm.id}
      >
        {comm.name.split(' ')[0].toUpperCase()}
        {#if gameState.player.committees.includes(comm.id)}
          <span class="you-dot"></span>
        {/if}
      </button>
    {/each}
  </div>

  <div class="committee-body">
    <!-- Left: Members -->
    <div class="members-section">
      <div class="section-header">
        {selectedCommittee.name.toUpperCase()}
        {#if isPlayerCommittee}
          <span class="your-badge">YOUR COMMITTEE</span>
        {/if}
      </div>
      <div class="col-header-row">
        <span class="col-p"></span>
        <span class="col-name">NAME</span>
        <span class="col-pty">PTY</span>
        <span class="col-sen">SEN</span>
        <span class="col-tier">ATTITUDE</span>
      </div>
      <div class="members-list">
        {#each members() as member}
          <div class="member-row" class:chair-row={member.isChair} class:player-row={member.isPlayer}>
            <span class="col-p">
              <span class="portrait-dot" style="background-color: hsl({member.hue}, 35%, 30%)"></span>
            </span>
            <span class="col-name">
              {member.name.toUpperCase()}
              {#if member.isChair}
                <span class="badge badge-chair">CHAIR</span>
              {/if}
              {#if member.isPlayer}
                <span class="badge badge-you">YOU</span>
              {/if}
            </span>
            <span class="col-pty" style="color: {member.party === gameState.player.party ? '#006600' : 'var(--primary-red)'}">
              {member.party === 'feralist' ? 'F' : 'C'}
            </span>
            <span class="col-sen">{member.seniority}</span>
            {#if member.isPlayer}
              <span class="col-tier" style="color: var(--phosphor-green);">--</span>
            {:else}
              <span class="col-tier {member.tier}">{member.tier.toUpperCase()}</span>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Right: Bills -->
    <div class="bills-section">
      <div class="section-header">BILLS IN COMMITTEE</div>
      <div class="bills-list">
        {#if committeeBills().length === 0}
          <div class="no-bills">NO BILLS CURRENTLY IN THIS COMMITTEE</div>
        {:else}
          {#each committeeBills() as entry}
            <div class="bill-row" class:bill-player={entry.isPlayerBill}>
              <div class="bill-top">
                <span class="bill-number">Z.B. {entry.bill.number}</span>
                <span class="bill-stage" style="background: {stageColor(entry.bill.stage)};">
                  {entry.bill.stage.toUpperCase()}
                </span>
              </div>
              <div class="bill-name">{entry.bill.name.toUpperCase()}</div>
              <div class="bill-author">
                {entry.isPlayerBill ? 'YOUR BILL' : entry.authorName.toUpperCase()}
              </div>
              <div class="bill-tags">
                {#each entry.bill.proTags as tag}
                  <span class="tag tag-pro">+ {ISSUE_LABELS[tag].split(' ')[0]}</span>
                {/each}
                <span class="tag tag-anti">- {ISSUE_LABELS[entry.bill.antiTag].split(' ')[0]}</span>
              </div>
            </div>
          {/each}
        {/if}
      </div>
    </div>
  </div>

  <div class="intel-ledger">
    > {selectedCommittee.name.toUpperCase()} &mdash; {members().length} MEMBERS &mdash;
    {committeeBills().length} BILL{committeeBills().length !== 1 ? 'S' : ''} PENDING
    {#if isPlayerCommittee} &mdash; YOU ARE A MEMBER{/if}
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
  .committee-tabs {
    display: flex;
    gap: 0;
    background: var(--marble-dark);
    border-bottom: 3px solid var(--black);
    overflow-x: auto;
    scrollbar-width: none;
  }
  .committee-tabs::-webkit-scrollbar { display: none; }
  .comm-tab {
    padding: 4px 10px;
    font-size: 0.95rem;
    font-family: var(--pixel-font);
    text-transform: uppercase;
    background: var(--marble-dark);
    color: var(--black);
    border: none;
    border-right: 1px solid #aaa;
    cursor: pointer;
    white-space: nowrap;
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .comm-tab:hover {
    background: var(--gold-light);
  }
  .comm-active {
    background: var(--marble);
    font-weight: bold;
    border-bottom: 3px solid var(--gold);
  }
  .comm-player {
    color: var(--mahogany);
  }
  .you-dot {
    display: inline-block;
    width: 6px;
    height: 6px;
    background: var(--phosphor-green);
    border: 1px solid var(--black);
  }
  .committee-body {
    flex: 1;
    display: flex;
    overflow: hidden;
  }
  .members-section {
    flex: 1;
    display: flex;
    flex-direction: column;
    border-right: 3px solid var(--black);
  }
  .bills-section {
    width: 340px;
    display: flex;
    flex-direction: column;
  }
  .section-header {
    font-size: 1.05rem;
    color: var(--mahogany);
    padding: 4px 10px;
    background: var(--marble-white);
    border-bottom: 2px solid #aaa;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .your-badge {
    font-size: 0.85rem;
    padding: 0 6px;
    background: var(--ega-cyan);
    color: white;
    border: 1px solid var(--black);
  }
  .col-header-row {
    display: flex;
    padding: 2px 8px;
    background: var(--mahogany);
    color: var(--gold);
    font-size: 0.9rem;
    border-bottom: 2px solid var(--black);
  }
  .members-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .members-list::-webkit-scrollbar { display: none; }
  .member-row {
    display: flex;
    align-items: center;
    padding: 3px 8px;
    border-bottom: 1px solid #aaa;
    font-size: 1rem;
  }
  .chair-row {
    background: var(--gold-light);
    border-bottom: 2px solid var(--gold);
  }
  .player-row {
    background: #1a3a3a;
    border-bottom: 2px solid var(--ega-cyan);
  }
  .player-row .col-name {
    color: var(--phosphor-green);
  }
  .col-p { width: 28px; flex-shrink: 0; }
  .col-name { flex: 1; display: flex; align-items: center; gap: 4px; }
  .col-pty { width: 30px; text-align: center; font-weight: bold; }
  .col-sen { width: 30px; text-align: center; color: #555; }
  .col-tier { width: 70px; text-align: right; font-weight: bold; }
  .portrait-dot {
    display: inline-block;
    width: 18px;
    height: 18px;
    border: 2px solid var(--black);
  }
  .badge {
    font-size: 0.8rem;
    padding: 0 4px;
    border: 1px solid var(--black);
  }
  .badge-chair {
    background: var(--mahogany);
    color: var(--gold);
  }
  .badge-you {
    background: var(--ega-cyan);
    color: white;
  }
  .bills-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
    padding: 6px;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .bills-list::-webkit-scrollbar { display: none; }
  .no-bills {
    padding: 20px;
    text-align: center;
    color: #666;
    font-size: 1.1rem;
  }
  .bill-row {
    padding: 6px 8px;
    background: var(--marble-white);
    border: 2px solid #999;
  }
  .bill-player {
    border-color: var(--ega-cyan);
    background: #e8f4f4;
  }
  .bill-top {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2px;
  }
  .bill-number {
    font-size: 1.1rem;
    color: var(--mahogany);
    font-weight: bold;
  }
  .bill-stage {
    font-size: 0.9rem;
    padding: 1px 6px;
    color: white;
    border: 1px solid var(--black);
  }
  .bill-name {
    font-size: 1rem;
    color: var(--black);
  }
  .bill-author {
    font-size: 0.9rem;
    color: #555;
    margin-top: 1px;
  }
  .bill-tags {
    display: flex;
    gap: 3px;
    margin-top: 3px;
  }
  .tag {
    font-size: 0.85rem;
    padding: 0 4px;
    border: 1px solid var(--black);
    color: white;
  }
  .tag-pro { background: #006600; }
  .tag-anti { background: var(--primary-red); }
  .intel-ledger {
    background: #000;
    padding: 6px 10px;
    font-size: 1.05rem;
    border-top: 3px solid var(--black);
    color: var(--phosphor-green);
    line-height: 1.3;
  }
</style>
