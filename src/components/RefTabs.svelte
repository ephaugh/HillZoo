<script lang="ts">
  let { activeTab, onTabSelect }: {
    activeTab: string | null;
    onTabSelect: (tab: string | null) => void;
  } = $props();

  const TABS = [
    { id: 'members', label: 'MEMBERS' },
    { id: 'committees', label: 'COMMITTEES' },
    { id: 'factions', label: 'FACTIONS' },
    { id: 'promises', label: 'PROMISES' },
    { id: 'gossip', label: 'GOSSIP' },
    { id: 'intel', label: 'INTEL' },
    { id: 'calendar', label: 'CALENDAR' },
    { id: 'bills', label: 'BILLS' },
    { id: 'whip', label: 'WHIP' },
  ];

  function toggle(tabId: string) {
    if (activeTab === tabId) {
      onTabSelect(null);
    } else {
      onTabSelect(tabId);
    }
  }
</script>

<div class="ref-tabs">
  {#each TABS as tab}
    <button
      class="ref-tab"
      class:ref-tab-active={activeTab === tab.id}
      onclick={() => toggle(tab.id)}
    >
      {tab.label}
    </button>
  {/each}
</div>

<style>
  .ref-tabs {
    position: absolute;
    top: 10px;
    right: 14px;
    z-index: 10;
    display: flex;
    gap: 3px;
  }
  .ref-tab {
    background: var(--mahogany-mid);
    border: 2px solid var(--black);
    padding: 3px 8px;
    font-size: 0.95rem;
    color: var(--gold);
    cursor: pointer;
    text-transform: uppercase;
    font-family: var(--pixel-font);
    box-shadow: inset 1px 1px 0px rgba(255, 255, 255, 0.08);
  }
  .ref-tab:hover {
    background: var(--gold);
    color: var(--black);
  }
  .ref-tab-active {
    background: var(--gold);
    color: var(--black);
  }
</style>
