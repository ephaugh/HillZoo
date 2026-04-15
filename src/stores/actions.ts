/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Store Actions
   All state mutations go through here. Components never
   modify GameState directly.
   ═══════════════════════════════════════════════════════════ */

import { gameStore } from './game';
import type { GameState, Slot, ScheduleEntry, GamePromise, Issue, LeaderPressureModifier, MeetingRequest, Bill, Committee, IntelEntry, IntelImportance } from '../core/types';
import { advanceSlot as calAdvanceSlot } from '../core/calendar';
import { shiftSentiment } from '../core/sentiment';
import { clamp, generateId } from '../core/utils';
import { isLeadershipNpc, getAdvanceBookingDays } from '../core/turn-processor';
import { findCommitteeForBill } from '../core/committees';

function update(fn: (state: GameState) => GameState) {
  gameStore.update(s => s ? fn(s) : s);
}

// ── Slot Management ──

export function advanceSlot() {
  update(s => calAdvanceSlot(s));
}

// ── Sentiment ──

export function changeSentiment(npcId: string, shift: number) {
  update(s => ({
    ...s,
    sentiment: shiftSentiment(s, npcId, shift),
  }));
}

// ── War Chest ──

export function spendMoney(amount: number) {
  update(s => ({
    ...s,
    warChest: Math.max(0, s.warChest - amount),
  }));
}

export function earnMoney(amount: number) {
  update(s => ({
    ...s,
    warChest: s.warChest + amount,
  }));
}

// ── Primary Threat ──

export function adjustPrimaryThreat(delta: number) {
  update(s => ({
    ...s,
    primaryThreat: clamp(s.primaryThreat + delta, 0, 100),
  }));
}

// ── Schedule ──

export function addScheduleEntry(entry: ScheduleEntry) {
  update(s => ({
    ...s,
    schedule: [...s.schedule, entry],
  }));
}

export function removeScheduleEntry(day: number, slot: Slot) {
  update(s => ({
    ...s,
    schedule: s.schedule.filter(e => !(e.day === day && e.slot === slot)),
  }));
}

// ── Promises ──

export function addPromise(promise: GamePromise) {
  update(s => ({
    ...s,
    promises: [...s.promises, promise],
  }));
}

export function fulfillPromise(promiseId: string) {
  update(s => ({
    ...s,
    promises: s.promises.map(p => p.id === promiseId ? { ...p, fulfilled: true } : p),
  }));
}

export function breakPromise(promiseId: string) {
  update(s => ({
    ...s,
    promises: s.promises.map(p => p.id === promiseId ? { ...p, fulfilled: false } : p),
  }));
}

// ── Intel Log ──

const INTEL_LOG_MAX = 100;

/**
 * Purge the oldest lowest-importance entry when the log exceeds MAX.
 * Purge order: oldest LOW → oldest MEDIUM → oldest HIGH (pinned never purge).
 */
function purgeOldestIntelIfNeeded(log: IntelEntry[]): IntelEntry[] {
  if (log.length <= INTEL_LOG_MAX) return log;

  const tierPriority: IntelImportance[] = ['low', 'medium', 'high'];
  for (const tier of tierPriority) {
    // Find the oldest (lowest day, earliest in array) entry of this tier
    // that isn't pinned to the player's bill.
    let victimIdx = -1;
    let victimDay = Infinity;
    for (let i = 0; i < log.length; i++) {
      const e = log[i];
      if (e.concernsPlayerBill) continue;
      if (e.importance !== tier) continue;
      if (e.day < victimDay) {
        victimDay = e.day;
        victimIdx = i;
      }
    }
    if (victimIdx >= 0) {
      return [...log.slice(0, victimIdx), ...log.slice(victimIdx + 1)];
    }
  }
  // Nothing purgeable (everything pinned) — leave as-is even if over limit
  return log;
}

/**
 * Add an entry to the persistent Intel Log.
 * Dedupe: if an identical (category + headline + relatedNpcIds[0]) entry
 * was added today, don't duplicate.
 */
export function addIntelEntry(partial: Omit<IntelEntry, 'id' | 'day'>) {
  update(s => {
    // Dedupe by (category + headline + day)
    const today = s.currentDay;
    const duplicate = s.intelLog.some(e =>
      e.day === today &&
      e.category === partial.category &&
      e.headline === partial.headline
    );
    if (duplicate) return s;

    const entry: IntelEntry = {
      id: generateId('intel'),
      day: today,
      ...partial,
    };
    let nextLog = [entry, ...s.intelLog];
    nextLog = purgeOldestIntelIfNeeded(nextLog);
    return { ...s, intelLog: nextLog };
  });
}

// ── Known Information ──

/**
 * Reveal an NPC's interest to the player. Idempotent.
 */
export function revealNpcInterest(npcId: string, issue: Issue) {
  update(s => {
    const current = s.knownInfo.revealedNpcInterests[npcId] ?? [];
    if (current.includes(issue)) return s;
    return {
      ...s,
      knownInfo: {
        ...s.knownInfo,
        revealedNpcInterests: {
          ...s.knownInfo.revealedNpcInterests,
          [npcId]: [...current, issue],
        },
      },
    };
  });
}

// ── Meeting tracking ──

export function recordMeeting(npcId: string) {
  update(s => ({
    ...s,
    knownInfo: {
      ...s.knownInfo,
      meetingCount: {
        ...s.knownInfo.meetingCount,
        [npcId]: (s.knownInfo.meetingCount[npcId] ?? 0) + 1,
      },
    },
  }));
}

// ── Cosponsorship ──

export function addCosponsor(billId: string, npcId: string) {
  update(s => {
    if (billId === s.playerBill.id) {
      return {
        ...s,
        playerBill: {
          ...s.playerBill,
          cosponsors: [...s.playerBill.cosponsors, npcId],
        },
      };
    }
    return {
      ...s,
      npcBills: s.npcBills.map(b =>
        b.id === billId ? { ...b, cosponsors: [...b.cosponsors, npcId] } : b
      ),
    };
  });
}

// ── Legislative Influence Actions ──

/**
 * Apply leader pressure: a Whip or Majority Leader pressures
 * a target NPC to vote a certain way on a bill.
 * Adds a +8 party pressure modifier on the target.
 */
export function applyLeaderPressure(
  sourceLeaderId: string,
  targetNpcId: string,
  billId: string,
  direction: 'yes' | 'no',
) {
  update(s => {
    const modifier: LeaderPressureModifier = {
      id: generateId('lpm'),
      targetNpcId,
      billId,
      direction,
      pressureValue: 8,
      sourceLeaderId,
      day: s.currentDay,
    };
    return {
      ...s,
      leaderPressureModifiers: [...(s.leaderPressureModifiers ?? []), modifier],
    };
  });
}

/**
 * Schedule a committee hearing for a bill.
 * Advances the bill from 'referral' to 'hearing' stage.
 */
export function scheduleHearing(billId: string, committeeId: string) {
  update(s => {
    // Check player bill
    if (s.playerBill.id === billId) {
      return {
        ...s,
        playerBill: { ...s.playerBill, stage: 'hearing' as const },
      };
    }
    // Check NPC bills
    return {
      ...s,
      npcBills: s.npcBills.map(b =>
        b.id === billId ? { ...b, stage: 'hearing' as const } : b
      ),
    };
  });
}

/**
 * Schedule a floor vote for a bill.
 * Moves the bill from 'queue' to 'floor' stage and adds a floor_vote event
 * within 2 days on the schedule.
 */
export function scheduleFloorVote(billId: string) {
  update(s => {
    // Find the bill
    const isPlayerBill = s.playerBill.id === billId;
    const bill = isPlayerBill ? s.playerBill : s.npcBills.find(b => b.id === billId);
    if (!bill) return s;

    const billName = bill.name;

    // Find an open slot within 2 days
    const targetDay = Math.min(s.currentDay + 2, 60);
    const slots: Slot[] = ['morning', 'afternoon', 'evening'];
    let scheduledDay = s.currentDay + 1;
    let scheduledSlot: Slot = 'morning';
    let found = false;

    for (let d = s.currentDay + 1; d <= targetDay; d++) {
      for (const sl of slots) {
        const occupied = s.schedule.some(e => e.day === d && e.slot === sl);
        if (!occupied) {
          scheduledDay = d;
          scheduledSlot = sl;
          found = true;
          break;
        }
      }
      if (found) break;
    }

    // If no open slot found, force it on the target day morning
    if (!found) {
      scheduledDay = targetDay;
      scheduledSlot = 'morning';
    }

    const floorVoteEntry: ScheduleEntry = {
      day: scheduledDay,
      slot: scheduledSlot,
      type: 'floor_vote',
      label: `FLOOR VOTE: ${billName.toUpperCase()}`,
      billId,
      mandatory: true,
    };

    // Update bill stage
    let updatedState = { ...s };
    if (isPlayerBill) {
      updatedState = {
        ...updatedState,
        playerBill: { ...s.playerBill, stage: 'floor' as const },
      };
    } else {
      updatedState = {
        ...updatedState,
        npcBills: s.npcBills.map(b =>
          b.id === billId ? { ...b, stage: 'floor' as const } : b
        ),
      };
    }

    return {
      ...updatedState,
      schedule: [...updatedState.schedule, floorVoteEntry],
      mandatoryEvents: [...updatedState.mandatoryEvents, {
        day: scheduledDay,
        slot: scheduledSlot,
        type: 'floor_vote',
        label: floorVoteEntry.label,
        billId,
      }],
    };
  });
}

/**
 * Offer budget help to an NPC — creates a promise to assist
 * with their bill's budget scoring.
 */
export function offerBudgetHelp(npcId: string, billId: string) {
  update(s => ({
    ...s,
    promises: [...s.promises, {
      id: generateId('prm'),
      day: s.currentDay,
      npcId,
      description: `ASSIST WITH BUDGET SCORING`,
      type: 'other' as const,
      billId,
      fulfilled: null,
    }],
  }));
}

// ── Meeting Request Responses ──

/**
 * Accept an NPC meeting request: +3 sentiment, schedule for a future slot.
 */
export function acceptMeetingRequest(requestId: string, day: number, slot: Slot) {
  update(s => {
    const req = s.meetingRequests.find(r => r.id === requestId);
    if (!req || req.status !== 'pending') return s;

    // +3 sentiment for accepting
    const newSentiment = shiftSentiment(s, req.npcId, 3);

    // Add schedule entry for the meeting
    const entry: ScheduleEntry = {
      day,
      slot,
      type: 'meeting',
      label: `MEETING: ${s.npcs.find(n => n.id === req.npcId)?.name.toUpperCase() ?? 'NPC'}`,
      npcId: req.npcId,
      mandatory: false,
    };

    return {
      ...s,
      sentiment: newSentiment,
      meetingRequests: s.meetingRequests.map(r =>
        r.id === requestId
          ? { ...r, status: 'accepted' as const, scheduledDay: day, scheduledSlot: slot, sentimentApplied: true }
          : r
      ),
      schedule: [...s.schedule, entry],
    };
  });
}

/**
 * Decline an NPC meeting request: 0 sentiment, NPC won't ask for 10+ days.
 */
export function declineMeetingRequest(requestId: string) {
  update(s => ({
    ...s,
    meetingRequests: s.meetingRequests.map(r =>
      r.id === requestId
        ? { ...r, status: 'declined' as const, sentimentApplied: true }
        : r
    ),
  }));
}

/**
 * Cancel a previously accepted meeting: -5 sentiment.
 */
export function cancelAcceptedMeeting(requestId: string) {
  update(s => {
    const req = s.meetingRequests.find(r => r.id === requestId);
    if (!req || req.status !== 'accepted') return s;

    // -5 sentiment for accepting then canceling
    const newSentiment = shiftSentiment(s, req.npcId, -5);

    // Remove the schedule entry
    const schedule = s.schedule.filter(
      e => !(e.day === req.scheduledDay && e.slot === req.scheduledSlot && e.npcId === req.npcId && e.type === 'meeting')
    );

    return {
      ...s,
      sentiment: newSentiment,
      meetingRequests: s.meetingRequests.map(r =>
        r.id === requestId ? { ...r, status: 'declined' as const } : r
      ),
      schedule,
    };
  });
}

/**
 * Book a player-initiated meeting with an NPC for a future day/slot.
 * Enforces advance booking: 1 day for regular, 2 for leadership.
 */
export function bookMeeting(npcId: string, day: number, slot: Slot): { success: boolean; error?: string } {
  let result = { success: false, error: '' };

  gameStore.update(s => {
    if (!s) { result = { success: false, error: 'No game state' }; return s; }

    const npc = s.npcs.find(n => n.id === npcId);
    if (!npc) { result = { success: false, error: 'NPC not found' }; return s; }

    // Check advance booking requirement
    const advanceDays = getAdvanceBookingDays(npc, s);
    if (day < s.currentDay + advanceDays) {
      result = { success: false, error: `${npc.name.toUpperCase()} REQUIRES ${advanceDays}-DAY ADVANCE BOOKING` };
      return s;
    }

    // Check NPC availability
    const availability = s.npcAvailability.find(a => a.npcId === npcId);
    if (availability) {
      const isAvailable = availability.slots.some(sl => sl.day === day && sl.slot === slot);
      if (!isAvailable) {
        result = { success: false, error: `${npc.name.toUpperCase()} IS NOT AVAILABLE AT THAT TIME` };
        return s;
      }
    }

    // Check slot not already booked — but a non-member committee hearing
    // does NOT consume the slot (player observes from the gallery), so a
    // meeting may be booked on top of it.
    const occupiedEntries = s.schedule.filter(e => e.day === day && e.slot === slot);
    const blockingEntry = occupiedEntries.find(e => {
      if (e.type !== 'committee_hearing' || !e.billId) return true; // any non-hearing entry blocks
      const bill = [s.playerBill, ...s.npcBills].find(b => b.id === e.billId);
      if (!bill) return true;
      const committee = findCommitteeForBill(bill, s);
      // Gallery hearings (player NOT on committee) do not block
      return committee?.members.includes('player') ?? true;
    });
    if (blockingEntry) {
      result = { success: false, error: 'THAT SLOT IS ALREADY BOOKED' };
      return s;
    }

    // Book it
    const entry: ScheduleEntry = {
      day,
      slot,
      type: 'meeting',
      label: `MEETING: ${npc.name.toUpperCase()}`,
      npcId,
      mandatory: false,
    };

    result = { success: true };
    return {
      ...s,
      schedule: [...s.schedule, entry],
    };
  });

  return result;
}

/**
 * Mark an NPC-initiated meeting request as completed (after the meeting happens).
 */
export function completeMeetingRequest(requestId: string) {
  update(s => ({
    ...s,
    meetingRequests: s.meetingRequests.map(r =>
      r.id === requestId ? { ...r, status: 'completed' as const } : r
    ),
  }));
}

/**
 * Host a fundraiser for a colleague. Costs $1,200 from war chest,
 * earns sentiment with the target NPC.
 */
export function hostColleagueFundraiser(npcId: string): { success: boolean; error?: string } {
  let result = { success: false, error: '' };

  gameStore.update(s => {
    if (!s) { result = { success: false, error: 'No game state' }; return s; }

    if (s.warChest < 1200) {
      result = { success: false, error: 'INSUFFICIENT FUNDS (NEED $1,200)' };
      return s;
    }

    const npc = s.npcs.find(n => n.id === npcId);
    if (!npc) { result = { success: false, error: 'NPC not found' }; return s; }

    result = { success: true };
    return {
      ...s,
      warChest: s.warChest - 1200,
      sentiment: shiftSentiment(s, npcId, 8),
    };
  });

  return result;
}
