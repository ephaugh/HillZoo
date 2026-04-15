/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Derived Stores
   Computed views of the game state for components.
   ═══════════════════════════════════════════════════════════ */

import { derived } from 'svelte/store';
import { gameStore } from './game';
import type { NPC, Committee, Faction, Bill } from '../core/types';
import { getSentimentTier } from '../core/utils';
import { getWeek, getDayOfWeek, getPhase, getPhaseLabel, daysUntilPrimary } from '../core/calendar';

// Current day info
export const dayInfo = derived(gameStore, $g => {
  if (!$g) return null;
  return {
    day: $g.currentDay,
    slot: $g.currentSlot,
    week: getWeek($g.currentDay),
    dayOfWeek: getDayOfWeek($g.currentDay),
    phase: getPhase($g.currentDay),
    phaseLabel: getPhaseLabel($g.currentDay),
    daysUntilPrimary: daysUntilPrimary($g),
  };
});

// NPCs sorted by name
export const npcsByName = derived(gameStore, $g => {
  if (!$g) return [];
  return [...$g.npcs].sort((a, b) => a.name.localeCompare(b.name));
});

// NPCs on the player's committees
export const committeeNpcs = derived(gameStore, $g => {
  if (!$g) return [];
  const playerCommIds = $g.player.committees;
  const memberIds = new Set<string>();
  for (const comm of $g.committees) {
    if (playerCommIds.includes(comm.id)) {
      for (const id of comm.members) memberIds.add(id);
    }
  }
  return $g.npcs.filter(n => memberIds.has(n.id));
});

// NPCs with their sentiment tier
export const npcsWithSentiment = derived(gameStore, $g => {
  if (!$g) return [];
  return $g.npcs.map(npc => ({
    ...npc,
    sentiment: $g.sentiment[npc.id] ?? 0,
    sentimentTier: getSentimentTier($g.sentiment[npc.id] ?? 0),
  }));
});

// Player's party members
export const partyMembers = derived(gameStore, $g => {
  if (!$g) return [];
  return $g.npcs.filter(n => n.party === $g.player.party);
});

// Opposition members
export const oppositionMembers = derived(gameStore, $g => {
  if (!$g) return [];
  return $g.npcs.filter(n => n.party !== $g.player.party);
});

// Active NPC bills (not dead or law)
export const activeNpcBills = derived(gameStore, $g => {
  if (!$g) return [];
  return $g.npcBills.filter(b => b.stage !== 'dead' && b.stage !== 'law');
});

// Player's committees with full info
export const playerCommittees = derived(gameStore, $g => {
  if (!$g) return [];
  return $g.committees.filter(c => $g.player.committees.includes(c.id));
});

// Today's schedule
export const todaySchedule = derived(gameStore, $g => {
  if (!$g) return [];
  return $g.schedule.filter(e => e.day === $g.currentDay);
});

// Tomorrow's schedule
export const tomorrowSchedule = derived(gameStore, $g => {
  if (!$g) return [];
  return $g.schedule.filter(e => e.day === $g.currentDay + 1);
});

// Pending promises (due soon)
export const urgentPromises = derived(gameStore, $g => {
  if (!$g) return [];
  return $g.promises.filter(p =>
    p.fulfilled === null && p.dueBy && p.dueBy - $g.currentDay <= 3
  );
});

// Intel log (newest-first)
export const intelLogSorted = derived(gameStore, $g => {
  if (!$g) return [];
  return [...$g.intelLog].sort((a, b) => b.day - a.day);
});

/**
 * Return a derived store of intel entries relevant to a specific NPC.
 * Use for the meeting prep sidebar.
 */
export function intelForNpc(npcId: string) {
  return derived(gameStore, $g => {
    if (!$g) return [];
    return $g.intelLog
      .filter(e => e.relatedNpcIds.includes(npcId))
      .sort((a, b) => b.day - a.day);
  });
}
