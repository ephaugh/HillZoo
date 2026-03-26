/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Store Actions
   All state mutations go through here. Components never
   modify GameState directly.
   ═══════════════════════════════════════════════════════════ */

import { gameStore } from './game';
import type { GameState, Slot, ScheduleEntry, GamePromise, Issue, LeaderPressureModifier } from '../core/types';
import { advanceSlot as calAdvanceSlot } from '../core/calendar';
import { shiftSentiment } from '../core/sentiment';
import { clamp, generateId } from '../core/utils';

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
