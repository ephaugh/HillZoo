<script lang="ts">
  import type { GameState, NPC, PartyName } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';
  import { getSentimentTier } from '../../core/utils';
  import { getNpcRoleLabel, getNpcCommitteesShort } from '../../core/roles';

  export let gameState: GameState;
  export let onClose: () => void;

  type FilterMode = 'all' | 'party' | 'opposition';
  type SortMode = 'name' | 'attitude' | 'seniority';

  let filter: FilterMode = 'all';
  let sortBy: SortMode = 'name';
  let selectedId: string | null = null;

  function getTier(npc: NPC): string {
    const score = gameState.sentiment[npc.id] ?? 0;
    return getSentimentTier(score);
  }

  function getTierOrder(tier: string): number {
    const order: Record<string, number> = { allied: 0, warm: 1, neutral: 2, cold: 3, hostile: 4 };
    return order[tier] ?? 2;
  }

  function getPartyLabel(party: PartyName): string {
    return party === 'feralist' ? 'F' : 'C';
  }

  function getPartyColor(npc: NPC): string {
    return npc.party === gameState.player.party ? '#006600' : '#aa0000';
  }

  function getIssueShort(issue: string): string {
    const label = ISSUE_LABELS[issue as keyof typeof ISSUE_LABELS] ?? issue;
    return label.split(' ')[0].split('&')[0].trim();
  }

  $: filteredNpcs = gameState.npcs.filter((npc) => {
    if (filter === 'all') return true;
    if (filter === 'party') return npc.party === gameState.player.party;
    return npc.party !== gameState.player.party;
  });

  $: sortedNpcs = [...filteredNpcs].sort((a, b) => {
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    if (sortBy === 'seniority') return b.seniority - a.seniority;
    return getTierOrder(getTier(a)) - getTierOrder(getTier(b));
  });
</script>

<div class="panel reference-screen">
  <div class="panel-header header-row">
    <span>MEMBERS LIST</span>
    <button class="btn btn-close" on:click={onClose}>CLOSE</button>
  </div>

  <div class="toolbar">
    <div class="filter-group">
      <span class="toolbar-label">FILTER:</span>
      <button class="btn btn-sm" class:btn-active={filter === 'all'} on:click={() => filter = 'all'}>ALL</button>
      <button class="btn btn-sm" class:btn-active={filter === 'party'} on:click={() => filter = 'party'}>YOUR PARTY</button>
      <button class="btn btn-sm" class:btn-active={filter === 'opposition'} on:click={() => filter = 'opposition'}>OPPOSITION</button>
    </div>
    <div class="filter-group">
      <span class="toolbar-label">SORT:</span>
      <button class="btn btn-sm" class:btn-active={sortBy === 'name'} on:click={() => sortBy = 'name'}>NAME</button>
      <button class="btn btn-sm" class:btn-active={sortBy === 'attitude'} on:click={() => sortBy = 'attitude'}>ATTITUDE</button>
      <button class="btn btn-sm" class:btn-active={sortBy === 'seniority'} on:click={() => sortBy = 'seniority'}>SENIORITY</button>
    </div>
  </div>

  <div class="list-header-row">
    <span class="col-portrait"></span>
    <span class="col-name">NAME</span>
    <span class="col-party">PTY</span>
    <span class="col-seniority">SEN</span>
    <span class="col-attitude">ATTITUDE</span>
    <span class="col-role">ROLE</span>
    <span class="col-committees">COMMITTEES</span>
  </div>

  <div class="member-list">
    {#each sortedNpcs as npc (npc.id)}
      {@const tier = getTier(npc)}
      <div
        class="member-row"
        class:selected={selectedId === npc.id}
        on:click={() => selectedId = selectedId === npc.id ? null : npc.id}
        on:keydown={(e) => { if (e.key === 'Enter') selectedId = selectedId === npc.id ? null : npc.id; }}
        role="button"
        tabindex="0"
      >
        <span class="col-portrait">
          <span class="portrait-square" style="background-color: {getPartyColor(npc)}"></span>
        </span>
        <span class="col-name">{npc.name}</span>
        <span class="col-party" style="color: {getPartyColor(npc)}">{getPartyLabel(npc.party)}</span>
        <span class="col-seniority">{npc.seniority}</span>
        <span class="col-attitude {tier}">{tier.toUpperCase()}</span>
        <span class="col-role">
          {#if getNpcRoleLabel(npc.id, gameState)}<span class="role-tag">{getNpcRoleLabel(npc.id, gameState)}</span>{/if}
        </span>
        <span class="col-committees">
          {getNpcCommitteesShort(npc.id, gameState).join(', ')}
        </span>
      </div>
    {/each}
  </div>

  <div class="intel-ledger">
    <span class="dim">SHOWING {sortedNpcs.length} OF {gameState.npcs.length} MEMBERS</span>
  </div>
</div>

<style>
  .reference-screen {
    width: 980px;
    height: 560px;
    display: flex;
    flex-direction: column;
    position: relative;
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
  .toolbar {
    display: flex;
    gap: 16px;
    padding: 6px 12px;
    background: var(--marble-dark);
    border-bottom: 3px solid var(--black);
  }
  .filter-group {
    display: flex;
    align-items: center;
    gap: 4px;
  }
  .toolbar-label {
    font-size: 1rem;
    color: var(--black);
    margin-right: 4px;
  }
  .btn-sm {
    padding: 2px 8px;
    font-size: 0.95rem;
  }
  .list-header-row {
    display: flex;
    padding: 4px 12px;
    background: var(--mahogany);
    color: var(--gold);
    font-size: 0.95rem;
    border-bottom: 2px solid var(--black);
  }
  .member-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .member-list::-webkit-scrollbar {
    display: none;
  }
  .member-row {
    display: flex;
    padding: 3px 12px;
    font-size: 1.05rem;
    border-bottom: 1px solid #999;
    cursor: pointer;
    align-items: center;
  }
  .member-row:hover {
    background: var(--marble-white);
  }
  .member-row.selected {
    background: var(--gold-light);
    border-bottom-color: var(--gold);
  }
  .portrait-square {
    display: inline-block;
    width: 24px;
    height: 24px;
    border: 2px solid var(--black);
    image-rendering: pixelated;
  }
  .col-portrait {
    width: 36px;
    flex-shrink: 0;
  }
  .col-name {
    width: 160px;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .col-party {
    width: 50px;
    flex-shrink: 0;
    text-align: center;
    font-weight: bold;
  }
  .col-seniority {
    width: 50px;
    flex-shrink: 0;
    text-align: center;
  }
  .col-attitude {
    width: 80px;
    flex-shrink: 0;
    font-weight: bold;
  }
  .col-role {
    width: 120px;
    flex-shrink: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .col-committees {
    flex: 1;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: #555;
  }
  .role-tag {
    color: var(--gold);
    background: var(--mahogany);
    padding: 0 4px;
    border: 1px solid var(--black);
    font-size: 0.9rem;
  }
</style>
