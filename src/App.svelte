<script lang="ts">
  import { gameStore } from './stores/game';
  import { creationStep, resetCreation } from './stores/creation';
  import SpeciesSelect from './screens/creation/SpeciesSelect.svelte';
  import PartySelect from './screens/creation/PartySelect.svelte';
  import LoyalistSlider from './screens/creation/LoyalistSlider.svelte';
  import PartyBalance from './screens/creation/PartyBalance.svelte';
  import BillCraft from './screens/creation/BillCraft.svelte';
  import PrimaryDateScreen from './screens/creation/PrimaryDate.svelte';
  import DistrictSetup from './screens/creation/DistrictSetup.svelte';
  import ReviewScreen from './screens/creation/ReviewScreen.svelte';
  import BrassHeader from './components/BrassHeader.svelte';
  import AgendaSidebar from './components/AgendaSidebar.svelte';
  import RefTabs from './components/RefTabs.svelte';
  import DawnBrief from './screens/gameplay/DawnBrief.svelte';
  import SlotSelection from './screens/gameplay/SlotSelection.svelte';
  import MeetingScreen from './screens/gameplay/MeetingScreen.svelte';
  import { advanceSlot } from './stores/actions';
  import { processSlotEnd, processNewDay } from './core/turn-processor';
  import { SLOT_ORDER } from './core/calendar';
  import type { GameState, NPC, Slot, ScheduleEntry } from './core/types';

  // Lazy imports for screens built by background agents
  // These will resolve once the files exist
  let MembersList: any = $state(null);
  let CommitteesView: any = $state(null);
  let FactionsReport: any = $state(null);
  let PromiseLedger: any = $state(null);
  let GossipLog: any = $state(null);
  let CalendarView: any = $state(null);
  let BillStatus: any = $state(null);
  let WhipCount: any = $state(null);
  let CommitteeHearing: any = $state(null);
  let CommitteeMarkup: any = $state(null);
  let BudgetScore: any = $state(null);
  let FloorVote: any = $state(null);
  let CaucusMeeting: any = $state(null);
  let PrimaryElection: any = $state(null);
  let PresidentialAction: any = $state(null);
  let Victory: any = $state(null);
  let Defeat: any = $state(null);
  let DuskSummary: any = $state(null);
  let QuickInteraction: any = $state(null);

  // Load all screen components
  $effect(() => {
    import('./screens/reference/MembersList.svelte').then(m => MembersList = m.default).catch(() => {});
    import('./screens/reference/CommitteesView.svelte').then(m => CommitteesView = m.default).catch(() => {});
    import('./screens/reference/FactionsReport.svelte').then(m => FactionsReport = m.default).catch(() => {});
    import('./screens/reference/PromiseLedger.svelte').then(m => PromiseLedger = m.default).catch(() => {});
    import('./screens/reference/GossipLog.svelte').then(m => GossipLog = m.default).catch(() => {});
    import('./screens/reference/CalendarView.svelte').then(m => CalendarView = m.default).catch(() => {});
    import('./screens/reference/BillStatus.svelte').then(m => BillStatus = m.default).catch(() => {});
    import('./screens/reference/WhipCount.svelte').then(m => WhipCount = m.default).catch(() => {});
    import('./screens/events/CommitteeHearing.svelte').then(m => CommitteeHearing = m.default).catch(() => {});
    import('./screens/events/CommitteeMarkup.svelte').then(m => CommitteeMarkup = m.default).catch(() => {});
    import('./screens/events/BudgetScore.svelte').then(m => BudgetScore = m.default).catch(() => {});
    import('./screens/events/FloorVote.svelte').then(m => FloorVote = m.default).catch(() => {});
    import('./screens/events/CaucusMeeting.svelte').then(m => CaucusMeeting = m.default).catch(() => {});
    import('./screens/events/PrimaryElection.svelte').then(m => PrimaryElection = m.default).catch(() => {});
    import('./screens/events/PresidentialAction.svelte').then(m => PresidentialAction = m.default).catch(() => {});
    import('./screens/endgame/Victory.svelte').then(m => Victory = m.default).catch(() => {});
    import('./screens/endgame/Defeat.svelte').then(m => Defeat = m.default).catch(() => {});
    import('./screens/gameplay/DuskSummary.svelte').then(m => DuskSummary = m.default).catch(() => {});
    import('./screens/gameplay/QuickInteraction.svelte').then(m => QuickInteraction = m.default).catch(() => {});
  });

  let game = $state<GameState | null>(null);
  let step = $state(1);

  gameStore.subscribe(v => game = v);
  creationStep.subscribe(v => step = v);

  // ── Gameplay State ──
  type GameScreen =
    | 'dawn_brief' | 'slot_selection' | 'meeting' | 'dusk_summary'
    | 'committee_hearing' | 'committee_markup' | 'budget_score'
    | 'floor_vote' | 'caucus_meeting' | 'primary_election' | 'presidential_action'
    | 'victory' | 'defeat';

  let currentScreen: GameScreen = $state('dawn_brief');
  let meetingNpc: NPC | null = $state(null);
  let activeMeetingRequest: import('./core/types').MeetingRequest | null = $state(null);
  let activeRefTab: string | null = $state(null);
  let defeatReason: string = $state('session_expired');
  let quickNpc: NPC | null = $state(null);
  let quickType: 'early_bird' | 'ambush' | 'hallway' | 'lingerer' = $state('hallway');
  let showQuickInteraction = $state(false);

  // Track whether a meeting was just held this slot (used by quick interaction check)
  let justHeldMeeting = $state(false);

  // ── Core slot transition: runs turn processor, advances, routes ──
  function finishSlot() {
    if (!game) return;

    // 1. Capture pre-advance state for quick interaction check
    const preDay = game.currentDay;
    const preSlot = game.currentSlot;

    // 2. Check if current slot has a mandatory event (quick interactions should NOT overlap)
    const hasMandatory = game.schedule.some(
      e => e.day === preDay && e.slot === preSlot && e.mandatory
    );

    // 3. Process slot-end systems (quick interaction chance, etc.)
    //    This adds quick_interaction entries to the schedule for the CURRENT slot
    gameStore.update(s => s ? processSlotEnd(s) : s);

    // 4. Check for quick interaction BEFORE advancing slot —
    //    only if no mandatory event and no meeting was just held
    if (!hasMandatory && !justHeldMeeting && game) {
      const quickEntry = game.schedule.find(
        e => e.day === preDay && e.slot === preSlot && e.type === 'quick_interaction'
      );
      if (quickEntry && quickEntry.npcId && QuickInteraction) {
        quickNpc = game.npcs.find(n => n.id === quickEntry.npcId) ?? null;
        if (quickNpc) {
          const label = quickEntry.label.toLowerCase();
          quickType = label.includes('ambush') ? 'ambush'
            : label.includes('early') ? 'early_bird'
            : label.includes('linger') ? 'lingerer'
            : 'hallway';
          showQuickInteraction = true;
        }
      }
    }

    // 5. Reset meeting tracking flag
    justHeldMeeting = false;

    // 6. Check if we're leaving the evening slot (end of day)
    const wasEvening = preSlot === 'evening';

    // 7. Advance the slot
    advanceSlot();

    // 8. If we just ended the evening, run new-day processing
    if (wasEvening) {
      gameStore.update(s => s ? processNewDay(s) : s);
    }

    // 9. Check for mandatory events on the new slot
    if (game) {
      const mandatoryEntry = game.schedule.find(
        e => e.day === game!.currentDay && e.slot === game!.currentSlot && e.mandatory
      );
      if (mandatoryEntry) {
        routeToEvent(mandatoryEntry);
        return;
      }

      // 9b. Check for scheduled (non-mandatory) meetings on this slot
      const meetingEntry = game.schedule.find(
        e => e.day === game!.currentDay && e.slot === game!.currentSlot && e.type === 'meeting' && e.npcId
      );
      if (meetingEntry && meetingEntry.npcId) {
        startMeeting(meetingEntry.npcId);
        return;
      }
    }

    // 10. Route to next screen
    if (wasEvening && DuskSummary && game && game.currentDay > 1) {
      currentScreen = 'dusk_summary';
    } else if (game && game.currentSlot === 'morning') {
      currentScreen = 'dawn_brief';
    } else {
      currentScreen = 'slot_selection';
    }
  }

  function routeToEvent(entry: { type: string }) {
    switch (entry.type) {
      case 'caucus': currentScreen = 'caucus_meeting'; break;
      case 'primary': currentScreen = 'primary_election'; break;
      case 'committee_hearing': currentScreen = 'committee_hearing'; break;
      case 'committee_markup': currentScreen = 'committee_markup'; break;
      case 'floor_vote': currentScreen = 'floor_vote'; break;
      case 'travel':
      case 'campaign':
        // Travel and campaign slots auto-advance — player cannot act during these
        finishSlot();
        return;
      default: currentScreen = 'slot_selection';
    }
  }

  // ── Navigation helpers ──
  function proceedFromDawn() {
    // Check for mandatory event this slot
    if (game) {
      const mandatory = game.schedule.find(
        e => e.day === game!.currentDay && e.slot === game!.currentSlot && e.mandatory
      );
      if (mandatory) {
        routeToEvent(mandatory);
        return;
      }
    }
    currentScreen = 'slot_selection';
  }

  function proceedFromDusk() {
    currentScreen = 'dawn_brief';
  }

  function startMeeting(npcId: string) {
    if (!game) return;
    meetingNpc = game.npcs.find(n => n.id === npcId) ?? null;
    // Check if this is an NPC-initiated meeting
    activeMeetingRequest = game.meetingRequests.find(
      r => r.npcId === npcId && r.status === 'accepted'
        && r.scheduledDay === game!.currentDay && r.scheduledSlot === game!.currentSlot
    ) ?? null;
    if (meetingNpc) currentScreen = 'meeting';
  }

  function exitMeeting() {
    meetingNpc = null;
    activeMeetingRequest = null;
    justHeldMeeting = true;
    finishSlot();
  }

  /**
   * Compute the next N slot positions starting from a given day/slot (inclusive).
   * Returns array of { day, slot } objects.
   */
  function getConsecutiveSlots(startDay: number, startSlot: Slot, count: number): { day: number; slot: Slot }[] {
    const result: { day: number; slot: Slot }[] = [];
    let day = startDay;
    let slotIdx = SLOT_ORDER.indexOf(startSlot);
    for (let i = 0; i < count; i++) {
      result.push({ day, slot: SLOT_ORDER[slotIdx] });
      slotIdx++;
      if (slotIdx >= SLOT_ORDER.length) {
        slotIdx = 0;
        day++;
      }
    }
    return result;
  }

  /**
   * Check whether the player can campaign: needs $500 and 3 consecutive free slots.
   */
  function canCampaign(): { allowed: boolean; reason: string } {
    if (!game) return { allowed: false, reason: 'NO GAME STATE' };
    if (game.warChest < 500) return { allowed: false, reason: 'NEED $500 (HAVE $' + game.warChest + ')' };

    const slots = getConsecutiveSlots(game.currentDay, game.currentSlot, 3);
    // All 3 slots must be within the session (day <= 60) and free of mandatory events
    for (const s of slots) {
      if (s.day > 60) return { allowed: false, reason: 'NOT ENOUGH SESSION DAYS LEFT' };
      const hasMandatory = game.schedule.some(
        e => e.day === s.day && e.slot === s.slot && e.mandatory
      );
      if (hasMandatory) return { allowed: false, reason: 'MANDATORY EVENT BLOCKS 3-SLOT TRIP' };
    }

    return { allowed: true, reason: '' };
  }

  function doCampaign() {
    if (!game) return;
    const check = canCampaign();
    if (!check.allowed) return;

    const slots = getConsecutiveSlots(game.currentDay, game.currentSlot, 3);

    // Build the 3 schedule entries: TRAVEL TO DISTRICT, CAMPAIGN, TRAVEL BACK
    const campaignEntries: ScheduleEntry[] = [
      {
        day: slots[0].day,
        slot: slots[0].slot,
        type: 'travel' as const,
        label: 'TRAVEL TO DISTRICT',
        mandatory: true,
      },
      {
        day: slots[1].day,
        slot: slots[1].slot,
        type: 'campaign' as const,
        label: 'CAMPAIGN BACK HOME',
        mandatory: true,
      },
      {
        day: slots[2].day,
        slot: slots[2].slot,
        type: 'travel' as const,
        label: 'TRAVEL BACK',
        mandatory: true,
      },
    ];

    gameStore.update(s => s ? ({
      ...s,
      warChest: s.warChest - 500,
      primaryThreat: Math.max(0, s.primaryThreat - 10),
      schedule: [...s.schedule, ...campaignEntries],
    }) : s);

    // Advance through all 3 slots
    // First slot finishes now, the next 2 are mandatory schedule entries
    // that will auto-route via finishSlot's mandatory event detection
    finishSlot();
  }

  function doFundraise() {
    if (!game) return;
    gameStore.update(s => s ? ({
      ...s,
      warChest: s.warChest + 800,
      schedule: [...s.schedule, {
        day: s.currentDay,
        slot: s.currentSlot,
        type: 'fundraiser' as const,
        label: 'FUNDRAISER',
        mandatory: false,
      }],
    }) : s);
    finishSlot();
  }

  function endSlot() {
    finishSlot();
  }

  function handleEventComplete() {
    if (!game) { currentScreen = 'slot_selection'; return; }

    // Hearing → Markup chain: if player's bill just advanced to markup, go to markup screen
    if (currentScreen === 'committee_hearing' && game.playerBill.stage === 'markup') {
      currentScreen = 'committee_markup';
      return;
    }

    // Markup → Budget chain: if player's bill just advanced to budget, go to budget score
    if (currentScreen === 'committee_markup' && game.playerBill.stage === 'budget') {
      currentScreen = 'budget_score';
      return;
    }

    // Check for defeat conditions
    if (game.playerBill.stage === 'dead') {
      handleDefeat('bill_killed');
      return;
    }
    if (game.playerBill.stage === 'law') {
      handleVictory();
      return;
    }

    // Check for other mandatory events in this slot
    const currentType = currentScreen.replace('_', '');
    const nextMandatory = game.schedule.find(
      e => e.day === game!.currentDay && e.slot === game!.currentSlot && e.mandatory
        && !['caucus', 'primary', 'committee_hearing', 'committee_markup'].includes(e.type)
    );
    if (nextMandatory) {
      routeToEvent(nextMandatory);
      return;
    }

    currentScreen = 'slot_selection';
  }

  function handleVictory() {
    currentScreen = 'victory';
  }

  function handleDefeat(reason: string) {
    defeatReason = reason;
    currentScreen = 'defeat';
  }

  function startNewGame() {
    gameStore.set(null);
    resetCreation();
    currentScreen = 'dawn_brief';
    activeRefTab = null;
  }

  function handleRefTab(tab: string | null) {
    activeRefTab = tab;
  }

  function closeRefTab() {
    activeRefTab = null;
  }

  // ── Check game-over conditions ──
  $effect(() => {
    if (!game) return;
    if (game.currentDay > 60 && game.playerBill.stage !== 'law') {
      handleDefeat('session_expired');
    }
  });

  // Determine if we're in gameplay (not creation, not endgame)
  let inGameplay = $derived(
    game !== null && currentScreen !== 'victory' && currentScreen !== 'defeat'
  );
</script>

<BrassHeader gameState={game} />

<div class="stage-wrapper">
  <div class="game-stage">
    <div class="stage-background"></div>

    <!-- Reference tabs (during gameplay only) -->
    {#if inGameplay}
      <RefTabs activeTab={activeRefTab} onTabSelect={handleRefTab} />
    {/if}

    <div class="screen-content">
      {#if !game}
        <!-- ═══ CREATION FLOW ═══ -->
        {#if step === 1}
          <SpeciesSelect />
        {:else if step === 2}
          <PartySelect />
        {:else if step === 3}
          <LoyalistSlider />
        {:else if step === 4}
          <PartyBalance />
        {:else if step === 5}
          <BillCraft />
        {:else if step === 6}
          <PrimaryDateScreen />
        {:else if step === 7}
          <DistrictSetup />
        {:else if step === 8}
          <ReviewScreen />
        {/if}

      {:else if currentScreen === 'victory' && Victory}
        <Victory gameState={game} onNewGame={startNewGame} />

      {:else if currentScreen === 'defeat' && Defeat}
        <Defeat gameState={game} {defeatReason} onNewGame={startNewGame} />

      {:else}
        <!-- ═══ GAMEPLAY ═══ -->
        {#if currentScreen === 'dawn_brief'}
          <DawnBrief gameState={game} onProceed={proceedFromDawn} />
        {:else if currentScreen === 'slot_selection'}
          <SlotSelection
            gameState={game}
            onMeeting={startMeeting}
            onCampaign={doCampaign}
            onFundraise={doFundraise}
            onEndSlot={endSlot}
          />
        {:else if currentScreen === 'meeting' && meetingNpc}
          <MeetingScreen gameState={game} npc={meetingNpc} onExit={exitMeeting} meetingRequest={activeMeetingRequest} />
        {:else if currentScreen === 'dusk_summary' && DuskSummary}
          <svelte:component this={DuskSummary} gameState={game} onProceed={proceedFromDusk} />
        {:else if currentScreen === 'committee_hearing' && CommitteeHearing}
          <svelte:component this={CommitteeHearing} gameState={game} onComplete={handleEventComplete} />
        {:else if currentScreen === 'committee_markup' && CommitteeMarkup}
          <svelte:component this={CommitteeMarkup} gameState={game} onComplete={handleEventComplete} />
        {:else if currentScreen === 'budget_score' && BudgetScore}
          <svelte:component this={BudgetScore} gameState={game} onComplete={handleEventComplete} />
        {:else if currentScreen === 'floor_vote' && FloorVote}
          <svelte:component this={FloorVote} gameState={game} onComplete={handleEventComplete} />
        {:else if currentScreen === 'caucus_meeting' && CaucusMeeting}
          <svelte:component this={CaucusMeeting} gameState={game} onComplete={handleEventComplete} />
        {:else if currentScreen === 'primary_election' && PrimaryElection}
          <svelte:component this={PrimaryElection} gameState={game} onComplete={handleEventComplete} />
        {:else if currentScreen === 'presidential_action' && PresidentialAction}
          <svelte:component this={PresidentialAction} gameState={game} onComplete={handleEventComplete} />
        {/if}

        <!-- ═══ REFERENCE OVERLAY ═══ -->
        {#if activeRefTab}
          <div class="ref-overlay">
            {#if activeRefTab === 'members' && MembersList}
              <svelte:component this={MembersList} gameState={game} onClose={closeRefTab} />
            {:else if activeRefTab === 'committees' && CommitteesView}
              <svelte:component this={CommitteesView} gameState={game} onClose={closeRefTab} />
            {:else if activeRefTab === 'factions' && FactionsReport}
              <svelte:component this={FactionsReport} gameState={game} onClose={closeRefTab} />
            {:else if activeRefTab === 'promises' && PromiseLedger}
              <svelte:component this={PromiseLedger} gameState={game} onClose={closeRefTab} />
            {:else if activeRefTab === 'gossip' && GossipLog}
              <svelte:component this={GossipLog} gameState={game} onClose={closeRefTab} />
            {:else if activeRefTab === 'calendar' && CalendarView}
              <svelte:component this={CalendarView} gameState={game} onClose={closeRefTab} />
            {:else if activeRefTab === 'bills' && BillStatus}
              <svelte:component this={BillStatus} gameState={game} onClose={closeRefTab} />
            {:else if activeRefTab === 'whip' && WhipCount}
              <svelte:component this={WhipCount} gameState={game} onClose={closeRefTab} />
            {/if}
          </div>
        {/if}

        <!-- ═══ QUICK INTERACTION OVERLAY ═══ -->
        {#if showQuickInteraction && quickNpc && QuickInteraction}
          <div class="quick-overlay">
            <svelte:component
              this={QuickInteraction}
              gameState={game}
              npc={quickNpc}
              interactionType={quickType}
              onComplete={() => { showQuickInteraction = false; quickNpc = null; }}
            />
          </div>
        {/if}
      {/if}
    </div>
  </div>
  {#if inGameplay}
    <AgendaSidebar gameState={game} />
  {/if}
</div>

{#if inGameplay && currentScreen === 'slot_selection'}
  <div class="action-bar">
    <div class="action-group">
      <button class="btn" onclick={() => currentScreen = 'slot_selection'}>ACTIONS</button>
    </div>
    <button class="btn btn-danger" style="margin-left: auto;" onclick={endSlot}>
      END {game?.currentSlot.toUpperCase()} SLOT
    </button>
  </div>
{/if}

<style>
  .screen-content {
    position: absolute;
    inset: 0;
    z-index: 1;
    overflow: hidden;
  }
  .ref-overlay {
    position: absolute;
    inset: 0;
    z-index: 5;
  }
  .quick-overlay {
    position: absolute;
    inset: 0;
    z-index: 6;
    display: flex;
    align-items: center;
    justify-content: center;
    background: rgba(0, 0, 0, 0.5);
  }
</style>
