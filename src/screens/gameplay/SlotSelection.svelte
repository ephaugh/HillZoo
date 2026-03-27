<script lang="ts">
  import type { GameState, NPC, Slot, NpcAvailabilityWeek } from '../../core/types';
  import { SLOT_LABELS, SLOT_ORDER, isEvening, getWeek } from '../../core/calendar';
  import { getSentimentTier } from '../../core/utils';
  import { ISSUE_LABELS } from '../../core/types';
  import { bookMeeting } from '../../stores/actions';
  import { getAdvanceBookingDays, isLeadershipNpc } from '../../core/turn-processor';

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

  type SchedulerPhase = 'actions' | 'npc_list' | 'pick_slot';

  let phase: SchedulerPhase = $state('actions');
  let selectedNpcId: string | null = $state(null);
  let filterParty: 'all' | 'own' | 'opposition' = $state('all');
  let sortBy: 'name' | 'sentiment' | 'seniority' = $state('name');
  let bookingError: string | null = $state(null);
  let bookingSuccess: string | null = $state(null);

  let evening = $derived(isEvening(gameState.currentSlot));

  let selectedNpc = $derived(
    selectedNpcId ? gameState.npcs.find(n => n.id === selectedNpcId) ?? null : null
  );

  let filteredNpcs = $derived.by(() => {
    let npcs = [...gameState.npcs];
    if (filterParty === 'own') npcs = npcs.filter(n => n.party === gameState.player.party);
    else if (filterParty === 'opposition') npcs = npcs.filter(n => n.party !== gameState.player.party);

    if (sortBy === 'name') npcs.sort((a, b) => a.name.localeCompare(b.name));
    else if (sortBy === 'sentiment') npcs.sort((a, b) => (gameState.sentiment[b.id] ?? 0) - (gameState.sentiment[a.id] ?? 0));
    else if (sortBy === 'seniority') npcs.sort((a, b) => b.seniority - a.seniority);

    return npcs;
  });

  // Check if there's already a meeting booked this slot
  let hasCurrentMeeting = $derived(
    gameState.schedule.some(
      e => e.day === gameState.currentDay && e.slot === gameState.currentSlot && e.type === 'meeting'
    )
  );

  /**
   * Check whether the player can campaign: needs $500 and 3 consecutive free slots.
   */
  let campaignCheck = $derived.by(() => {
    if (gameState.warChest < 500) {
      return { allowed: false, reason: 'NEED $500 (HAVE $' + gameState.warChest + ')' };
    }
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

  // Get available slots for the selected NPC
  let npcAvailableSlots = $derived.by(() => {
    if (!selectedNpc) return [];
    const advanceDays = getAdvanceBookingDays(selectedNpc, gameState);
    const earliestDay = gameState.currentDay + advanceDays;
    const availability = gameState.npcAvailability.find(a => a.npcId === selectedNpc!.id);

    const result: { day: number; slot: Slot; available: boolean }[] = [];
    const slots: Slot[] = ['morning', 'afternoon', 'evening'];

    // Show slots for the next 5 days
    for (let d = earliestDay; d <= Math.min(earliestDay + 4, 60); d++) {
      for (const slot of slots) {
        const occupied = gameState.schedule.some(e => e.day === d && e.slot === slot);
        const npcAvail = availability
          ? availability.slots.some(s => s.day === d && s.slot === slot)
          : true; // if no availability data, assume available

        result.push({
          day: d,
          slot,
          available: !occupied && npcAvail,
        });
      }
    }
    return result;
  });

  function selectNpc(npcId: string) {
    selectedNpcId = npcId;
    bookingError = null;
    bookingSuccess = null;
    phase = 'pick_slot';
  }

  function handleBookSlot(day: number, slot: Slot) {
    if (!selectedNpcId) return;
    const result = bookMeeting(selectedNpcId, day, slot);
    if (result.success) {
      const npc = gameState.npcs.find(n => n.id === selectedNpcId);
      bookingSuccess = `MEETING WITH ${npc?.name.toUpperCase() ?? 'NPC'} BOOKED FOR DAY ${day} ${SLOT_LABELS[slot]}`;
      bookingError = null;
      // Return to actions after brief display
      setTimeout(() => {
        phase = 'actions';
        bookingSuccess = null;
        selectedNpcId = null;
      }, 1500);
    } else {
      bookingError = result.error ?? 'BOOKING FAILED';
    }
  }
</script>

<div class="slot-selection">
  {#if phase === 'actions'}
    <div class="panel action-panel">
      <div class="panel-header">
        {SLOT_LABELS[gameState.currentSlot]} &mdash; DAY {gameState.currentDay}
      </div>
      <div class="action-body">
        <div class="action-prompt">CHOOSE YOUR ACTION</div>

        {#if bookingSuccess}
          <div class="booking-confirm">{bookingSuccess}</div>
        {/if}

        <div class="action-grid">
          <button class="btn action-choice" onclick={() => { phase = 'npc_list'; bookingError = null; }}>
            SCHEDULE MEETING
            <span class="action-cost">ADVANCE BOOKING</span>
          </button>
          {#if campaignCheck.allowed}
            <button class="btn action-choice" onclick={onCampaign}>
              CAMPAIGN BACK HOME
              <span class="action-cost">$500 &mdash; 3 SLOTS</span>
            </button>
          {:else}
            <button class="btn btn-disabled action-choice" disabled title={campaignCheck.reason}>
              CAMPAIGN BACK HOME
              <span class="action-cost">{campaignCheck.reason}</span>
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

        <div class="end-slot-row">
          <button class="btn" onclick={onEndSlot}>END SLOT</button>
        </div>
      </div>
    </div>

  {:else if phase === 'npc_list'}
    <!-- Meeting Scheduler: NPC list -->
    <div class="panel scheduler-panel">
      <div class="panel-header" style="display: flex; justify-content: space-between;">
        <span>SELECT A MEMBER TO SCHEDULE</span>
        <button class="btn" style="padding: 2px 8px; font-size: 1rem;" onclick={() => phase = 'actions'}>
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
        {#each filteredNpcs as npc}
          {@const sent = gameState.sentiment[npc.id] ?? 0}
          {@const tier = getSentimentTier(sent)}
          {@const isLeader = isLeadershipNpc(npc, gameState)}
          <button class="npc-row" onclick={() => selectNpc(npc.id)}>
            <div class="npc-portrait-sm" style="background-color: hsl({npc.name.length * 37 % 360}, 35%, 30%)"></div>
            <span class="npc-name-col">{npc.name}</span>
            <span class="npc-party-col" class:party-own={npc.party === gameState.player.party}>
              {npc.party === 'feralist' ? 'F' : 'C'}
            </span>
            <span class="npc-sen-col">SEN {npc.seniority}</span>
            <span class="npc-tier-col {tier}">{tier.toUpperCase()}</span>
            {#if isLeader}
              <span class="leader-badge">LEADER</span>
            {/if}
            <span class="npc-interests-col">
              {npc.coreInterests.map(i => ISSUE_LABELS[i].split(' ')[0]).join(', ')}
            </span>
          </button>
        {/each}
      </div>
    </div>

  {:else if phase === 'pick_slot' && selectedNpc}
    <!-- Slot picker for selected NPC -->
    <div class="panel scheduler-panel">
      <div class="panel-header" style="display: flex; justify-content: space-between;">
        <span>BOOK MEETING: {selectedNpc.name.toUpperCase()}</span>
        <button class="btn" style="padding: 2px 8px; font-size: 1rem;" onclick={() => { phase = 'npc_list'; selectedNpcId = null; }}>
          BACK
        </button>
      </div>
      <div class="slot-picker-body">
        <div class="booking-info">
          <span class="booking-label">ADVANCE REQUIRED: {getAdvanceBookingDays(selectedNpc, gameState)} DAY{getAdvanceBookingDays(selectedNpc, gameState) > 1 ? 'S' : ''}</span>
          {#if isLeadershipNpc(selectedNpc, gameState)}
            <span class="leader-note">(LEADERSHIP SCHEDULE)</span>
          {/if}
        </div>

        {#if bookingError}
          <div class="booking-error">{bookingError}</div>
        {/if}

        <div class="slot-grid">
          <div class="slot-grid-header">
            <span class="sg-day-header"></span>
            {#each ['MORNING', 'AFTERNOON', 'EVENING'] as label}
              <span class="sg-slot-header">{label}</span>
            {/each}
          </div>
          {#each Array.from(new Set(npcAvailableSlots.map(s => s.day))) as day}
            <div class="slot-grid-row">
              <span class="sg-day-label">DAY {day}</span>
              {#each ['morning', 'afternoon', 'evening'] as slot}
                {@const slotData = npcAvailableSlots.find(s => s.day === day && s.slot === slot)}
                {#if slotData?.available}
                  <button class="btn sg-slot-btn sg-available" onclick={() => handleBookSlot(day, slot as Slot)}>
                    OPEN
                  </button>
                {:else}
                  <span class="sg-slot-btn sg-unavailable">
                    {gameState.schedule.some(e => e.day === day && e.slot === slot) ? 'BOOKED' : 'BUSY'}
                  </span>
                {/if}
              {/each}
            </div>
          {/each}
        </div>

        {#if bookingSuccess}
          <div class="booking-confirm">{bookingSuccess}</div>
        {/if}
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
  .end-slot-row {
    margin-top: 10px;
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
  .leader-badge {
    font-size: 0.85rem;
    padding: 1px 6px;
    background: var(--gold);
    color: var(--black);
    border: 1px solid var(--black);
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

  /* Slot Picker */
  .slot-picker-body {
    flex: 1;
    padding: 12px 14px;
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
  .booking-info {
    display: flex;
    gap: 10px;
    align-items: center;
  }
  .booking-label {
    font-size: 1.1rem;
    color: var(--mahogany);
  }
  .leader-note {
    font-size: 0.95rem;
    color: var(--gold);
  }
  .booking-error {
    padding: 4px 10px;
    font-size: 1.05rem;
    color: var(--primary-red);
    border-left: 4px solid var(--primary-red);
    background: var(--marble-white);
  }
  .booking-confirm {
    padding: 4px 10px;
    font-size: 1.05rem;
    color: var(--phosphor-green);
    border-left: 4px solid var(--phosphor-green);
    background: var(--marble-white);
  }
  .slot-grid {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .slot-grid-header, .slot-grid-row {
    display: grid;
    grid-template-columns: 80px 1fr 1fr 1fr;
    gap: 4px;
  }
  .sg-day-header, .sg-slot-header {
    font-size: 0.95rem;
    color: #555;
    text-align: center;
    padding: 4px 0;
  }
  .sg-day-label {
    font-size: 1rem;
    font-weight: bold;
    padding: 6px 4px;
    color: var(--black);
  }
  .sg-slot-btn {
    padding: 6px 4px;
    text-align: center;
    font-size: 1rem;
    border: 2px solid var(--black);
  }
  .sg-available {
    background: var(--marble-white);
    cursor: pointer;
  }
  .sg-available:hover {
    background: var(--gold-light);
  }
  .sg-unavailable {
    background: var(--marble-dark);
    color: #888;
  }
</style>
