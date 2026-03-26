<script lang="ts">
  import type { GameState, NPC, Slot } from '../../core/types';
  import { SLOT_LABELS, SLOT_ORDER, isEvening } from '../../core/calendar';
  import { getSentimentTier } from '../../core/utils';
  import { ISSUE_LABELS } from '../../core/types';

  let {
    gameState,
    onMeeting,
    onCampaign,
    onFundraise,
    onEndSlot,
  }: {
    gameState: GameState;
    onMeeting: (npcId: string) => void;
    onCampaign: () => void;
    onFundraise: () => void;
    onEndSlot: () => void;
  } = $props();

  let showScheduler = $state(false);
  let selectedNpc: string | null = $state(null);
  let filterParty: 'all' | 'own' | 'opposition' = $state('all');
  let sortBy: 'name' | 'sentiment' | 'seniority' = $state('name');

  let evening = $derived(isEvening(gameState.currentSlot));

  let filteredNpcs = $derived(() => {
    let npcs = [...gameState.npcs];
    if (filterParty === 'own') npcs = npcs.filter(n => n.party === gameState.player.party);
    else if (filterParty === 'opposition') npcs = npcs.filter(n => n.party !== gameState.player.party);

    if (sortBy === 'name') npcs.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'sentiment') npcs.sort((a, b) => (gameState.sentiment[b.id] ?? 0) - (gameState.sentiment[a.id] ?? 0));
    else if (sortBy === 'seniority') npcs.sort((a, b) => b.seniority - a.seniority);

    return npcs;
  });

  /**
   * Check whether the player can campaign: needs $500 and 3 consecutive free slots.
   */
  let campaignCheck = $derived(() => {
    if (gameState.warChest < 500) {
      return { allowed: false, reason: 'NEED $500 (HAVE $' + gameState.warChest + ')' };
    }
    // Compute next 3 consecutive slots starting from current
    const slots: { day: number; slot: Slot }[] = [];
    let day = gameState.currentDay;
    let slotIdx = SLOT_ORDER.indexOf(gameState.currentSlot);
    for (let i = 0; i < 3; i++) {
      slots.push({ day, slot: SLOT_ORDER[slotIdx] });
      slotIdx++;
      if (slotIdx >= SLOT_ORDER.length) {
        slotIdx = 0;
        day++;
      }
    }
    for (const s of slots) {
      if (s.day > 60) return { allowed: false, reason: 'NOT ENOUGH SESSION DAYS LEFT' };
      const hasMandatory = gameState.schedule.some(
        (e: { day: number; slot: Slot; mandatory: boolean }) => e.day === s.day && e.slot === s.slot && e.mandatory
      );
      if (hasMandatory) return { allowed: false, reason: 'MANDATORY EVENT BLOCKS 3-SLOT TRIP' };
    }
    return { allowed: true, reason: '' };
  });

  function startMeeting(npcId: string) {
    onMeeting(npcId);
  }
</script>

<div class="slot-selection">
  {#if !showScheduler}
    <div class="panel action-panel">
      <div class="panel-header">
        {SLOT_LABELS[gameState.currentSlot]} &mdash; DAY {gameState.currentDay}
      </div>
      <div class="action-body">
        <div class="action-prompt">CHOOSE YOUR ACTION</div>
        <div class="action-grid">
          <button class="btn action-choice" onclick={() => showScheduler = true}>
            SCHEDULE MEETING
          </button>
          {#if campaignCheck().allowed}
            <button class="btn action-choice" onclick={onCampaign}>
              CAMPAIGN BACK HOME
              <span class="action-cost">$500 &mdash; 3 SLOTS</span>
            </button>
          {:else}
            <button class="btn btn-disabled action-choice" disabled title={campaignCheck().reason}>
              CAMPAIGN BACK HOME
              <span class="action-cost">{campaignCheck().reason}</span>
            </button>
          {/if}
          {#if evening}
            <button class="btn action-choice" onclick={onFundraise}>
              FUNDRAISE
            </button>
          {:else}
            <button class="btn btn-disabled action-choice" disabled>
              FUNDRAISE (EVENING ONLY)
            </button>
          {/if}
        </div>
      </div>
    </div>
  {:else}
    <!-- Meeting Scheduler: NPC list -->
    <div class="panel scheduler-panel">
      <div class="panel-header" style="display: flex; justify-content: space-between;">
        <span>SELECT A MEMBER TO MEET</span>
        <button class="btn" style="padding: 2px 8px; font-size: 1rem;" onclick={() => showScheduler = false}>
          BACK
        </button>
      </div>
      <div class="filter-bar">
        <button class="btn filter-btn" class:btn-active={filterParty === 'all'} onclick={() => filterParty = 'all'}>ALL</button>
        <button class="btn filter-btn" class:btn-active={filterParty === 'own'} onclick={() => filterParty = 'own'}>YOUR PARTY</button>
        <button class="btn filter-btn" class:btn-active={filterParty === 'opposition'} onclick={() => filterParty = 'opposition'}>OPPOSITION</button>
        <div style="flex: 1;"></div>
        <button class="btn filter-btn" class:btn-active={sortBy === 'name'} onclick={() => sortBy = 'name'}>NAME</button>
        <button class="btn filter-btn" class:btn-active={sortBy === 'sentiment'} onclick={() => sortBy = 'sentiment'}>ATTITUDE</button>
        <button class="btn filter-btn" class:btn-active={sortBy === 'seniority'} onclick={() => sortBy = 'seniority'}>SENIORITY</button>
      </div>
      <div class="npc-list">
        {#each filteredNpcs() as npc}
          {@const sent = gameState.sentiment[npc.id] ?? 0}
          {@const tier = getSentimentTier(sent)}
          <button class="npc-row" onclick={() => startMeeting(npc.id)}>
            <div class="npc-portrait-sm" style="background-color: hsl({npc.name.length * 37 % 360}, 35%, 30%)"></div>
            <span class="npc-name-col">{npc.name}</span>
            <span class="npc-party-col" class:party-own={npc.party === gameState.player.party}>
              {npc.party === 'feralist' ? 'F' : 'C'}
            </span>
            <span class="npc-sen-col">SEN {npc.seniority}</span>
            <span class="npc-tier-col {tier}">{tier.toUpperCase()}</span>
            <span class="npc-interests-col">
              {npc.coreInterests.map(i => ISSUE_LABELS[i].split(' ')[0]).join(', ')}
            </span>
          </button>
        {/each}
      </div>
    </div>
  {/if}
</div>

<style>
  .slot-selection {
    width: 100%;
    height: 100%;
    padding: 14px;
  }
  .action-panel, .scheduler-panel {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }
  .action-body {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    padding: 20px;
  }
  .action-prompt {
    font-size: 1.4rem;
    color: var(--mahogany);
  }
  .action-grid {
    display: flex;
    gap: 12px;
  }
  .action-choice {
    padding: 16px 24px;
    font-size: 1.3rem;
  }
  .filter-bar {
    display: flex;
    gap: 4px;
    padding: 4px 8px;
    background: var(--marble-dark);
    border-bottom: 2px solid var(--black);
  }
  .filter-btn {
    padding: 2px 8px;
    font-size: 0.95rem;
  }
  .npc-list {
    flex: 1;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .npc-list::-webkit-scrollbar { display: none; }
  .npc-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 4px 10px;
    border-bottom: 1px solid #aaa;
    background: var(--marble);
    cursor: pointer;
    font-family: var(--pixel-font);
    font-size: 1.05rem;
    text-transform: uppercase;
    text-align: left;
    width: 100%;
    border-left: none;
    border-right: none;
    border-top: none;
  }
  .npc-row:hover {
    background: var(--gold-light);
  }
  .npc-portrait-sm {
    width: 24px;
    height: 24px;
    border: 2px solid var(--black);
    flex-shrink: 0;
  }
  .npc-name-col {
    width: 180px;
    font-weight: bold;
  }
  .npc-party-col {
    width: 30px;
    text-align: center;
    color: #555;
  }
  .party-own {
    color: #006600;
  }
  .npc-sen-col {
    width: 50px;
    color: #555;
  }
  .npc-tier-col {
    width: 80px;
    text-align: center;
    font-weight: bold;
  }
  .npc-interests-col {
    flex: 1;
    color: #666;
    font-size: 0.95rem;
  }
  .action-cost {
    display: block;
    font-size: 0.85rem;
    color: var(--amber, #c8a200);
    margin-top: 4px;
  }
  .btn-disabled .action-cost {
    color: var(--red, #cc3333);
  }
</style>
