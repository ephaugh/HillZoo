/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Role & Committee Lookups
   Helpers to identify NPC leadership roles and committee info.
   Pure TypeScript — no Svelte imports.
   ═══════════════════════════════════════════════════════════ */

import type { GameState, Committee } from './types';

export type LeadershipRole = 'speaker' | 'majority_leader' | 'minority_leader' | 'whip' | 'chair' | null;

export const ROLE_LABELS: Record<string, string> = {
  speaker: 'SPEAKER',
  majority_leader: 'MAJ. LEADER',
  minority_leader: 'MIN. LEADER',
  whip: 'WHIP',
  chair: 'CHAIR',
};

/**
 * Get the primary leadership role for an NPC.
 * Returns the highest-ranking role if they hold multiple.
 */
export function getNpcRole(npcId: string, state: GameState): LeadershipRole {
  // Speaker (highest rank)
  for (const party of state.parties) {
    if (party.speakerId === npcId) return 'speaker';
  }

  // Majority/Minority Leader
  const majorityParty = state.parties.find(p =>
    state.partyBalance === 'large_majority' || state.partyBalance === 'slim_majority'
      ? p.name === state.player.party
      : p.name !== state.player.party
  );
  const minorityParty = state.parties.find(p => p !== majorityParty);

  if (majorityParty?.majorityLeaderId === npcId) return 'majority_leader';
  if (minorityParty?.majorityLeaderId === npcId) return 'minority_leader';

  // Whip
  for (const party of state.parties) {
    if (party.whipId === npcId) return 'whip';
  }

  // Committee Chair
  for (const committee of state.committees) {
    if (committee.chair === npcId) return 'chair';
  }

  return null;
}

/**
 * Get the role label for display. Returns empty string if no role.
 */
export function getNpcRoleLabel(npcId: string, state: GameState): string {
  const role = getNpcRole(npcId, state);
  if (!role) return '';
  if (role === 'chair') {
    // Specify which committee they chair
    const chaired = state.committees.find(c => c.chair === npcId);
    if (chaired) return `${chaired.name.split(' ')[0]} CHAIR`;
    return 'CHAIR';
  }
  return ROLE_LABELS[role] ?? '';
}

/**
 * Get all roles an NPC holds (they can be whip AND chair, etc.)
 */
export function getAllNpcRoles(npcId: string, state: GameState): string[] {
  const roles: string[] = [];

  for (const party of state.parties) {
    if (party.speakerId === npcId) roles.push('SPEAKER');
    if (party.whipId === npcId) roles.push('WHIP');
    if (party.majorityLeaderId === npcId) {
      const isMajority = state.partyBalance === 'large_majority' || state.partyBalance === 'slim_majority'
        ? party.name === state.player.party
        : party.name !== state.player.party;
      roles.push(isMajority ? 'MAJ. LEADER' : 'MIN. LEADER');
    }
  }

  for (const committee of state.committees) {
    if (committee.chair === npcId) {
      roles.push(`${committee.name.split(' ')[0].toUpperCase()} CHAIR`);
    }
  }

  return roles;
}

/**
 * Get committee names for an NPC.
 */
export function getNpcCommittees(npcId: string, state: GameState): string[] {
  return state.committees
    .filter(c => c.members.includes(npcId))
    .map(c => c.name);
}

/**
 * Get abbreviated committee names for compact display.
 */
export function getNpcCommitteesShort(npcId: string, state: GameState): string[] {
  return state.committees
    .filter(c => c.members.includes(npcId))
    .map(c => c.name.split(' ')[0]);
}

/**
 * Get the player's committee names.
 */
export function getPlayerCommittees(state: GameState): Committee[] {
  return state.committees.filter(c => state.player.committees.includes(c.id));
}

/**
 * Get the player's committee names as strings.
 */
export function getPlayerCommitteeNames(state: GameState): string[] {
  return getPlayerCommittees(state).map(c => c.name);
}
