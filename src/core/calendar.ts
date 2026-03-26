/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Calendar System
   Day/slot management, mandatory events, pacing arc.
   Pure TypeScript — no Svelte imports.
   ═══════════════════════════════════════════════════════════ */

import type { GameState, Slot, ScheduleEntry } from './types';

export const SLOT_ORDER: Slot[] = ['morning', 'afternoon', 'evening'];

export const SLOT_LABELS: Record<Slot, string> = {
  morning: 'MORNING',
  afternoon: 'AFTERNOON',
  evening: 'EVENING',
};

/**
 * Advance to the next slot. Returns updated state.
 */
export function advanceSlot(state: GameState): GameState {
  const currentIdx = SLOT_ORDER.indexOf(state.currentSlot);
  let nextDay = state.currentDay;
  let nextSlot: Slot;

  if (currentIdx < 2) {
    nextSlot = SLOT_ORDER[currentIdx + 1];
  } else {
    // End of day — advance to next day
    nextDay = state.currentDay + 1;
    nextSlot = 'morning';
  }

  return {
    ...state,
    currentDay: nextDay,
    currentSlot: nextSlot,
  };
}

/**
 * Get the current schedule entry for a given day/slot.
 */
export function getScheduleEntry(state: GameState, day: number, slot: Slot): ScheduleEntry | undefined {
  return state.schedule.find(e => e.day === day && e.slot === slot);
}

/**
 * Get the week number (1–12) for a given day.
 */
export function getWeek(day: number): number {
  return Math.ceil(day / 5);
}

/**
 * Get the day-of-week position (1–5) for a given day.
 */
export function getDayOfWeek(day: number): number {
  return ((day - 1) % 5) + 1;
}

/**
 * Get the game phase based on the current day.
 */
export function getPhase(day: number): 'opening' | 'ramp_up' | 'peak' | 'crunch' {
  if (day <= 15) return 'opening';
  if (day <= 30) return 'ramp_up';
  if (day <= 45) return 'peak';
  return 'crunch';
}

/**
 * Get the phase label for display.
 */
export function getPhaseLabel(day: number): string {
  switch (getPhase(day)) {
    case 'opening': return 'OPENING';
    case 'ramp_up': return 'RAMP-UP';
    case 'peak': return 'PEAK';
    case 'crunch': return 'CRUNCH';
  }
}

/**
 * Check if a slot is the evening slot.
 */
export function isEvening(slot: Slot): boolean {
  return slot === 'evening';
}

/**
 * Check if we're on the last day.
 */
export function isSessionOver(day: number): boolean {
  return day > 60;
}

/**
 * Get tomorrow's schedule entries.
 */
export function getTomorrowEntries(state: GameState): ScheduleEntry[] {
  const tomorrow = state.currentDay + 1;
  if (tomorrow > 60) return [];
  return state.schedule.filter(e => e.day === tomorrow);
}

/**
 * Get today's schedule entries.
 */
export function getTodayEntries(state: GameState): ScheduleEntry[] {
  return state.schedule.filter(e => e.day === state.currentDay);
}

/**
 * Get the committee that meets on a given day/slot (based on the weekly schedule).
 * Day 1: Mor=Agriculture, Aft=Predation
 * Day 2: Mor=Migration, Aft=Freshwater
 * Day 3: Mor=Habitat, Aft=Environment
 * Day 4: Mor=Budget, Aft=Rules
 * Day 5: Open / Open
 */
export function getCommitteeForSlot(dayOfWeek: number, slot: Slot): string | null {
  if (slot === 'evening') return null;
  const schedule: Record<number, Record<string, string>> = {
    1: { morning: 'agriculture_foraging', afternoon: 'predation_defense' },
    2: { morning: 'migration_transit', afternoon: 'freshwater_marine' },
    3: { morning: 'habitat_burrows', afternoon: 'environment_conservation' },
    4: { morning: 'budget', afternoon: 'rules_procedures' },
    5: {},
  };
  return schedule[dayOfWeek]?.[slot] ?? null;
}

/**
 * Calculate days until the player's primary.
 */
export function daysUntilPrimary(state: GameState): number {
  const primaryDay = state.primaryDate === 'early' ? 20 : 45;
  return primaryDay - state.currentDay;
}
