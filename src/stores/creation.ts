/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Creation Store
   Manages the 7-step creation flow state.
   ═══════════════════════════════════════════════════════════ */

import { writable, derived } from 'svelte/store';
import type { CreationState, Issue, PartyName } from '../core/types';
import { createRng, pick, pickN, shuffle } from '../core/utils';
import { ALL_ISSUES, COMMITTEE_ISSUES, CROSS_CUTTING_ISSUES } from '../core/types';

function generateAgendas(seed: number): {
  feralist: Partial<Record<Issue, 'pro' | 'anti'>>;
  communalist: Partial<Record<Issue, 'pro' | 'anti'>>;
} {
  const rng = createRng(seed);

  // Each party gets 2-3 strong positions. Parties never share a positive stance.
  // The most they agree on is being neutral. Bananas is never negative for either
  // party — at most one party has it as a positive.
  const nonBanana = ALL_ISSUES.filter(i =>
    i !== 'rules_procedures' && i !== 'budget' && i !== 'bananas'
  );
  const issues = shuffle(rng, nonBanana);

  const feralist: Partial<Record<Issue, 'pro' | 'anti'>> = {};
  const communalist: Partial<Record<Issue, 'pro' | 'anti'>> = {};

  // Core disagreement 1: Feralist pro, Communalist anti
  feralist[issues[0]] = 'pro';
  communalist[issues[0]] = 'anti';

  // Core disagreement 2: Communalist pro, Feralist anti
  communalist[issues[1]] = 'pro';
  feralist[issues[1]] = 'anti';

  // Each party gets one more unique pro (the other party stays neutral on it)
  feralist[issues[2]] = 'pro';
  communalist[issues[3]] = 'pro';

  // Maybe one more position each (50% chance), on distinct issues
  if (rng() > 0.5) {
    const stance = rng() > 0.5 ? 'pro' as const : 'anti' as const;
    // Don't give a stance on something the other party already has a stance on
    if (!communalist[issues[4]]) {
      feralist[issues[4]] = stance;
    }
  }
  if (rng() > 0.5) {
    const stance = rng() > 0.5 ? 'pro' as const : 'anti' as const;
    if (!feralist[issues[5]]) {
      communalist[issues[5]] = stance;
    }
  }

  // Bananas: at most one party gets it as a positive (30% chance each, exclusive)
  if (rng() < 0.3) {
    feralist['bananas'] = 'pro';
  } else if (rng() < 0.3) {
    communalist['bananas'] = 'pro';
  }

  return { feralist, communalist };
}

function createInitialCreationState(): CreationState {
  const seed = Math.floor(Math.random() * 2147483647);
  const agendas = generateAgendas(seed);

  return {
    species: null,
    party: null,
    sliderPosition: 50,
    partyBalance: 'slim_majority',
    billProTags: [null, null],
    billAntiTag: null,
    billNumber: null,
    billName: '',
    primaryDate: null,
    district: null,
    rerollUsed: false,
    feralistAgenda: agendas.feralist,
    communalistAgenda: agendas.communalist,
    seed,
  };
}

export const creationStore = writable<CreationState>(createInitialCreationState());

export const creationStep = writable<number>(1); // 1–7

export function resetCreation() {
  creationStore.set(createInitialCreationState());
  creationStep.set(1);
}
