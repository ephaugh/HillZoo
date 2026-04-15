<script lang="ts">
  import type { GameState, IntelEntry, IntelCategory, IntelImportance } from '../../core/types';

  export let gameState: GameState;
  export let onClose: () => void;

  type FilterTab = 'all' | 'bill' | 'members' | 'committees' | 'deals';

  let activeFilter: FilterTab = 'all';
  let selectedId: string | null = null;

  const CATEGORY_GROUPS: Record<FilterTab, IntelCategory[] | null> = {
    all: null,
    bill: ['bill_support', 'bill_status', 'committee_read'],
    members: ['npc_stance', 'npc_temperament', 'npc_concern', 'npc_disposition', 'npc_voting_lean', 'npc_primary_status'],
    committees: ['committee_read', 'bill_status'],
    deals: ['deal'],
  };

  $: allEntries = [...gameState.intelLog].sort((a, b) => {
    // Pinned player-bill entries always on top, then newest day
    if (a.concernsPlayerBill !== b.concernsPlayerBill) return a.concernsPlayerBill ? -1 : 1;
    return b.day - a.day;
  });

  $: filteredEntries = (() => {
    const group = CATEGORY_GROUPS[activeFilter];
    if (activeFilter === 'bill') {
      return allEntries.filter(e => e.concernsPlayerBill || (group && group.includes(e.category)));
    }
    if (!group) return allEntries;
    return allEntries.filter(e => group.includes(e.category));
  })();

  $: selected = filteredEntries.find(e => e.id === selectedId) ?? filteredEntries[0] ?? null;

  function importanceLabel(imp: IntelImportance): string {
    return imp.toUpperCase();
  }

  function importanceClass(imp: IntelImportance): string {
    return `imp-${imp}`;
  }

  function categoryLabel(cat: IntelCategory): string {
    switch (cat) {
      case 'npc_stance': return 'STANCE';
      case 'npc_temperament': return 'BEHAVIOR';
      case 'npc_concern': return 'CONCERN';
      case 'npc_disposition': return 'DISPOSITION';
      case 'npc_voting_lean': return 'VOTING LEAN';
      case 'npc_primary_status': return 'PRIMARY';
      case 'bill_support': return 'BILL SUPPORT';
      case 'bill_status': return 'BILL STATUS';
      case 'deal': return 'DEAL';
      case 'committee_read': return 'COMMITTEE';
    }
  }

  function sourceLabel(src: IntelEntry['source']): string {
    switch (src) {
      case 'meeting': return 'MEETING';
      case 'gallery_hearing': return 'GALLERY';
      case 'floor_vote': return 'FLOOR VOTE';
      case 'caucus': return 'CAUCUS';
      case 'quick_interaction': return 'HALLWAY';
      case 'gossip': return 'GOSSIP';
      case 'dawn_brief': return 'DAWN BRIEF';
      case 'player_bill': return 'YOUR BILL';
    }
  }

  function npcNames(ids: string[]): string {
    return ids
      .map(id => gameState.npcs.find(n => n.id === id)?.name ?? '—')
      .filter(n => n !== '—')
      .join(', ');
  }

  function billNames(ids: string[]): string {
    const all = [gameState.playerBill, ...gameState.npcBills];
    return ids
      .map(id => {
        const b = all.find(x => x.id === id);
        return b ? `#${b.number} ${b.name}` : '—';
      })
      .filter(n => n !== '—')
      .join(', ');
  }
</script>

<div class="panel reference-screen">
  <div class="panel-header header-row">
    <span>INTEL LOG <span class="count">({allEntries.length}/100)</span></span>
    <button class="btn btn-close" on:click={onClose}>CLOSE</button>
  </div>

  <div class="filter-tabs">
    {#each [
      { id: 'all' as FilterTab, label: 'ALL' },
      { id: 'bill' as FilterTab, label: 'YOUR BILL' },
      { id: 'members' as FilterTab, label: 'MEMBERS' },
      { id: 'committees' as FilterTab, label: 'COMMITTEES' },
      { id: 'deals' as FilterTab, label: 'DEALS' },
    ] as tab}
      <button
        class="filter-tab"
        class:filter-active={activeFilter === tab.id}
        on:click={() => { activeFilter = tab.id; selectedId = null; }}
      >
        {tab.label}
      </button>
    {/each}
  </div>

  {#if filteredEntries.length === 0}
    <div class="empty-state">NO INTEL IN THIS CATEGORY YET</div>
  {:else}
    <div class="split-view">
      <!-- Left: entry list -->
      <div class="entry-list">
        {#each filteredEntries as entry (entry.id)}
          <button
            class="entry-row"
            class:entry-selected={selected && entry.id === selected.id}
            class:entry-pinned={entry.concernsPlayerBill}
            on:click={() => selectedId = entry.id}
          >
            <div class="entry-row-meta">
              <span class="entry-day">DAY {entry.day}</span>
              <span class="entry-importance {importanceClass(entry.importance)}">
                {importanceLabel(entry.importance)}
              </span>
              {#if entry.concernsPlayerBill}<span class="entry-pin">PIN</span>{/if}
            </div>
            <div class="entry-headline">{entry.headline}</div>
            <div class="entry-category">{categoryLabel(entry.category)}</div>
          </button>
        {/each}
      </div>

      <!-- Right: detail view -->
      <div class="detail-pane">
        {#if selected}
          <div class="detail-header">
            <div class="detail-title">{selected.headline}</div>
            <div class="detail-meta">
              <span class="meta-chip">DAY {selected.day}</span>
              <span class="meta-chip">{sourceLabel(selected.source)}</span>
              <span class="meta-chip">{categoryLabel(selected.category)}</span>
              <span class="meta-chip importance {importanceClass(selected.importance)}">
                {importanceLabel(selected.importance)}
              </span>
              {#if selected.concernsPlayerBill}
                <span class="meta-chip pinned">PINNED</span>
              {/if}
            </div>
          </div>

          <div class="detail-body">{selected.detail}</div>

          {#if selected.relatedNpcIds.length > 0}
            <div class="detail-section">
              <div class="section-label">MEMBERS</div>
              <div class="section-value">{npcNames(selected.relatedNpcIds)}</div>
            </div>
          {/if}
          {#if selected.relatedBillIds.length > 0}
            <div class="detail-section">
              <div class="section-label">BILLS</div>
              <div class="section-value">{billNames(selected.relatedBillIds)}</div>
            </div>
          {/if}
          {#if selected.relatedIssues.length > 0}
            <div class="detail-section">
              <div class="section-label">ISSUES</div>
              <div class="section-value">{selected.relatedIssues.join(', ')}</div>
            </div>
          {/if}
        {:else}
          <div class="detail-empty">SELECT AN ENTRY</div>
        {/if}
      </div>
    </div>
  {/if}
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
  .count {
    color: var(--warm-amber);
    font-size: 0.9rem;
  }
  .btn-close {
    padding: 2px 10px;
    font-size: 1rem;
  }

  .filter-tabs {
    display: flex;
    gap: 2px;
    padding: 4px 6px;
    background: var(--mahogany-mid);
    border-bottom: 1px solid var(--black);
  }
  .filter-tab {
    background: transparent;
    border: 1px solid #666;
    color: #ccc;
    padding: 3px 8px;
    font-size: 0.95rem;
    cursor: pointer;
    font-family: var(--pixel-font);
    text-transform: uppercase;
  }
  .filter-tab:hover {
    background: rgba(255, 255, 255, 0.1);
  }
  .filter-tab.filter-active {
    background: var(--gold);
    color: var(--black);
    border-color: var(--black);
  }

  .empty-state {
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1.4rem;
    color: #888;
  }

  .split-view {
    flex: 1;
    display: flex;
    min-height: 0;
  }

  .entry-list {
    width: 42%;
    overflow-y: auto;
    scrollbar-width: none;
    border-right: 2px solid var(--black);
    background: #f8f5ef;
  }
  .entry-list::-webkit-scrollbar { display: none; }

  .entry-row {
    display: block;
    width: 100%;
    text-align: left;
    background: transparent;
    border: none;
    border-bottom: 1px solid #bbb;
    padding: 6px 10px;
    cursor: pointer;
    font-family: var(--pixel-font);
  }
  .entry-row:hover {
    background: rgba(255, 215, 0, 0.12);
  }
  .entry-row.entry-selected {
    background: var(--gold);
  }
  .entry-row.entry-pinned {
    border-left: 3px solid var(--primary-red);
  }
  .entry-row-meta {
    display: flex;
    gap: 5px;
    align-items: center;
    margin-bottom: 2px;
  }
  .entry-day {
    font-size: 0.85rem;
    color: var(--warm-amber);
    font-weight: bold;
  }
  .entry-importance {
    font-size: 0.75rem;
    padding: 1px 4px;
    border: 1px solid #333;
  }
  .entry-importance.imp-high {
    background: var(--primary-red);
    color: white;
  }
  .entry-importance.imp-medium {
    background: var(--warm-amber);
    color: var(--black);
  }
  .entry-importance.imp-low {
    background: #ddd;
    color: #333;
  }
  .entry-pin {
    font-size: 0.75rem;
    padding: 1px 3px;
    background: var(--primary-red);
    color: white;
  }
  .entry-headline {
    font-size: 1.05rem;
    color: var(--black);
    line-height: 1.2;
  }
  .entry-category {
    font-size: 0.8rem;
    color: #666;
    margin-top: 2px;
  }

  .detail-pane {
    flex: 1;
    padding: 14px 16px;
    overflow-y: auto;
    scrollbar-width: none;
    background: #fdfbf5;
  }
  .detail-pane::-webkit-scrollbar { display: none; }

  .detail-empty {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: #888;
    font-size: 1.3rem;
  }

  .detail-header {
    border-bottom: 2px solid var(--black);
    padding-bottom: 8px;
    margin-bottom: 10px;
  }
  .detail-title {
    font-size: 1.3rem;
    color: var(--black);
    margin-bottom: 6px;
    line-height: 1.2;
  }
  .detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
  }
  .meta-chip {
    font-size: 0.85rem;
    padding: 1px 6px;
    background: #e8e4dc;
    border: 1px solid #888;
    color: #333;
  }
  .meta-chip.importance.imp-high { background: var(--primary-red); color: white; border-color: var(--black); }
  .meta-chip.importance.imp-medium { background: var(--warm-amber); color: var(--black); border-color: var(--black); }
  .meta-chip.pinned { background: var(--primary-red); color: white; border-color: var(--black); }

  .detail-body {
    font-size: 1.1rem;
    color: var(--black);
    line-height: 1.45;
    margin-bottom: 12px;
  }

  .detail-section {
    margin-bottom: 6px;
  }
  .section-label {
    font-size: 0.85rem;
    color: var(--warm-amber);
    letter-spacing: 0.05em;
  }
  .section-value {
    font-size: 1rem;
    color: #333;
  }
</style>
