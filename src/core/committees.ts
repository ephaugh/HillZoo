/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Committee Logic
   Amendment generation, committee vote resolution.
   Pure TypeScript — no Svelte imports.
   ═══════════════════════════════════════════════════════════ */

import type {
  GameState, NPC, Bill, Committee, Amendment, Issue, Temperament,
} from './types';
import {
  ALL_ISSUES, COMMITTEE_ISSUES, CROSS_CUTTING_REFERRAL,
  ISSUE_LABELS, type CommitteeIssue, type CrossCuttingIssue,
} from './types';
import { calculateNetWillingness } from './decision-engine';
import { getSentimentTier, pick, createRng, generateId } from './utils';

// ── Natural enemies for amendment targeting ──
const NATURAL_ENEMIES: Partial<Record<Issue, Issue>> = {
  habitat_burrows: 'migration_transit',
  migration_transit: 'habitat_burrows',
  agriculture_foraging: 'predation_defense',
  predation_defense: 'agriculture_foraging',
  freshwater_marine: 'environment_conservation',
  environment_conservation: 'freshwater_marine',
};

export interface ProposedAmendment {
  id: string;
  proposer: NPC;
  type: Amendment['type'];
  targetIssue: Issue;
  newIssue?: Issue; // for flip
  rationale: string; // player-facing explanation
  passed: boolean;
  yesVotes: number;
  noVotes: number;
}

/**
 * Find the committee for a bill via referral mapping.
 */
export function findCommitteeForBill(bill: Bill, state: GameState): Committee {
  for (const tag of bill.proTags) {
    if ((COMMITTEE_ISSUES as readonly string[]).includes(tag)) {
      const c = state.committees.find(c => c.issue === tag);
      if (c) return c;
    }
    if (tag in CROSS_CUTTING_REFERRAL) {
      const referred = CROSS_CUTTING_REFERRAL[tag as CrossCuttingIssue];
      const c = state.committees.find(c => c.issue === referred);
      if (c) return c;
    }
  }
  return state.committees[0];
}

/**
 * Generate amendments for a committee markup session.
 * Follows GDD rules for NPC amendment behavior.
 */
export function generateAmendments(
  bill: Bill,
  committee: Committee,
  state: GameState,
  seed: number,
): ProposedAmendment[] {
  const rng = createRng(seed);
  const results: ProposedAmendment[] = [];

  // Get committee members sorted by seniority (highest first)
  const members = committee.members
    .map(id => state.npcs.find(n => n.id === id))
    .filter((n): n is NPC => n != null)
    .sort((a, b) => b.seniority - a.seniority);

  // Current bill tags for reference
  const currentProTags = [...bill.proTags];
  const currentAntiTag = bill.antiTag;
  const allCurrentTags = [...currentProTags, currentAntiTag];

  for (const npc of members) {
    // Calculate this NPC's Net Willingness toward the bill
    const breakdown = calculateNetWillingness(npc, bill, state, false);
    const nw = breakdown.total;
    const sent = state.sentiment[npc.id] ?? 0;
    const tier = getSentimentTier(sent);

    // GDD rule: NW > +40 → propose nothing (happy with the bill)
    if (nw > 40) continue;

    // GDD rule: NW -39 to +39 → propose amendment addressing dominant negative driver
    // NW < -39 → hostile amendment
    const isHostile = nw < -39;
    const amendment = craftAmendment(npc, bill, breakdown, tier, isHostile, allCurrentTags, rng);
    if (!amendment) continue;

    // Committee votes on this amendment
    const { yesVotes, noVotes } = resolveCommitteeVote(
      amendment, npc, bill, committee, state, rng
    );
    const passed = yesVotes > noVotes;

    results.push({
      ...amendment,
      passed,
      yesVotes,
      noVotes,
    });
  }

  return results;
}

function craftAmendment(
  npc: NPC,
  bill: Bill,
  breakdown: ReturnType<typeof calculateNetWillingness>,
  sentimentTier: string,
  isHostile: boolean,
  currentTags: Issue[],
  rng: () => number,
): Omit<ProposedAmendment, 'passed' | 'yesVotes' | 'noVotes'> | null {
  const driver = breakdown.dominantDriver;
  const temperament = npc.temperament;

  // ── Hostile amendments (NW < -39) ──
  if (isHostile) {
    return craftHostileAmendment(npc, bill, temperament, currentTags, rng);
  }

  // ── Disposition-based amendments (NW -39 to +40) ──
  if (sentimentTier === 'warm' || sentimentTier === 'allied') {
    // Good-faith: add something complementary to the bill
    return craftGoodFaithAmendment(npc, bill, currentTags, rng);
  }

  if (sentimentTier === 'neutral') {
    // Pragmatic: add their own interest to the bill
    return craftPragmaticAmendment(npc, bill, currentTags, rng);
  }

  // Cold: depends on temperament
  if (sentimentTier === 'cold') {
    if (temperament === 'dealmaker') {
      // Strategic self-serving: add their interest as leverage
      return craftPragmaticAmendment(npc, bill, currentTags, rng);
    }
    if (temperament === 'ideologue') {
      // Principled opposition: poison pill
      return craftHostileAmendment(npc, bill, temperament, currentTags, rng);
    }
    // Followers/Opportunists when cold: mild opposition
    return craftMildOppositionAmendment(npc, bill, currentTags, rng);
  }

  return null;
}

function craftGoodFaithAmendment(
  npc: NPC,
  bill: Bill,
  currentTags: Issue[],
  rng: () => number,
): Omit<ProposedAmendment, 'passed' | 'yesVotes' | 'noVotes'> {
  // Add a pro-tag that aligns with the bill's direction
  // Pick from NPC's interests that aren't already on the bill
  const candidates = npc.coreInterests.filter(i => !currentTags.includes(i));
  if (candidates.length > 0) {
    const issue = pick(rng, candidates);
    return {
      id: generateId('amd'),
      proposer: npc,
      type: 'add_pro',
      targetIssue: issue,
      rationale: `PROPOSES STRENGTHENING THE BILL WITH ${ISSUE_LABELS[issue].toUpperCase()} PROVISIONS.`,
    };
  }

  // If their interests are already on the bill, propose removing the anti-tag
  // (making the bill less controversial)
  return {
    id: generateId('amd'),
    proposer: npc,
    type: 'remove',
    targetIssue: bill.antiTag,
    rationale: `MOVES TO SOFTEN THE BILL'S STANCE AGAINST ${ISSUE_LABELS[bill.antiTag].toUpperCase()}.`,
  };
}

function craftPragmaticAmendment(
  npc: NPC,
  bill: Bill,
  currentTags: Issue[],
  rng: () => number,
): Omit<ProposedAmendment, 'passed' | 'yesVotes' | 'noVotes'> {
  // Add their core interest as a pro-tag (quid pro quo)
  const interest = pick(rng, npc.coreInterests);
  if (!currentTags.includes(interest)) {
    return {
      id: generateId('amd'),
      proposer: npc,
      type: 'add_pro',
      targetIssue: interest,
      rationale: `INSISTS ON ADDING ${ISSUE_LABELS[interest].toUpperCase()} LANGUAGE TO SECURE SUPPORT.`,
    };
  }

  // Their interest is already there — add an anti-tag against something they oppose
  const enemy = NATURAL_ENEMIES[interest];
  if (enemy && !currentTags.includes(enemy)) {
    return {
      id: generateId('amd'),
      proposer: npc,
      type: 'add_anti',
      targetIssue: enemy,
      rationale: `DEMANDS RESTRICTIONS ON ${ISSUE_LABELS[enemy].toUpperCase()} AS CONDITION OF SUPPORT.`,
    };
  }

  // Fallback: add district interest
  const distInterest = pick(rng, npc.district.strongInterests);
  return {
    id: generateId('amd'),
    proposer: npc,
    type: 'add_pro',
    targetIssue: distInterest,
    rationale: `ADDS ${ISSUE_LABELS[distInterest].toUpperCase()} PROVISIONS FOR THEIR DISTRICT.`,
  };
}

function craftMildOppositionAmendment(
  npc: NPC,
  bill: Bill,
  currentTags: Issue[],
  rng: () => number,
): Omit<ProposedAmendment, 'passed' | 'yesVotes' | 'noVotes'> {
  // Add an anti-tag targeting something the NPC dislikes about the bill
  const disliked = bill.proTags.find(t =>
    npc.issueStances[t] === 'negative' || npc.district.hostility === t
  );
  if (disliked) {
    return {
      id: generateId('amd'),
      proposer: npc,
      type: 'flip',
      targetIssue: disliked,
      rationale: `CHALLENGES THE BILL'S ${ISSUE_LABELS[disliked].toUpperCase()} PROVISIONS, SEEKING TO FLIP SUPPORT TO OPPOSITION.`,
    };
  }

  // Generic: add an anti-tag
  const hostile = npc.district.hostility;
  if (!currentTags.includes(hostile)) {
    return {
      id: generateId('amd'),
      proposer: npc,
      type: 'add_anti',
      targetIssue: hostile,
      rationale: `PUSHES FOR RESTRICTIONS ON ${ISSUE_LABELS[hostile].toUpperCase()}.`,
    };
  }

  return {
    id: generateId('amd'),
    proposer: npc,
    type: 'add_anti',
    targetIssue: pick(rng, npc.coreInterests),
    rationale: `ATTACHES COMPLICATING LANGUAGE.`,
  };
}

function craftHostileAmendment(
  npc: NPC,
  bill: Bill,
  temperament: Temperament,
  currentTags: Issue[],
  rng: () => number,
): Omit<ProposedAmendment, 'passed' | 'yesVotes' | 'noVotes'> {
  // Poison pill: flip a pro-tag to anti, or add a toxic anti-tag
  if (rng() > 0.4) {
    // Flip one of the bill's pro-tags
    const target = pick(rng, bill.proTags);
    return {
      id: generateId('amd'),
      proposer: npc,
      type: 'flip',
      targetIssue: target,
      rationale: `MOVES TO REVERSE THE BILL'S POSITION ON ${ISSUE_LABELS[target].toUpperCase()}. ${temperament === 'ideologue' ? 'CITES PRINCIPLED OBJECTIONS.' : 'A CALCULATED ATTACK.'}`,
    };
  }

  // Add a toxic anti-tag that would alienate supporters
  const toxicIssue = pick(rng, bill.proTags);
  const enemy = NATURAL_ENEMIES[toxicIssue];
  if (enemy && !currentTags.includes(enemy)) {
    return {
      id: generateId('amd'),
      proposer: npc,
      type: 'add_anti',
      targetIssue: enemy,
      rationale: `ATTACHES A POISON PILL TARGETING ${ISSUE_LABELS[enemy].toUpperCase()} TO SINK THE BILL.`,
    };
  }

  return {
    id: generateId('amd'),
    proposer: npc,
    type: 'add_anti',
    targetIssue: pick(rng, npc.coreInterests),
    rationale: `ADDS HOSTILE LANGUAGE DESIGNED TO MAKE THE BILL UNPASSABLE.`,
  };
}

/**
 * Resolve committee vote on an amendment.
 * Each member votes based on their own relationship with the bill and the amendment's effect.
 */
function resolveCommitteeVote(
  amendment: Omit<ProposedAmendment, 'passed' | 'yesVotes' | 'noVotes'>,
  proposer: NPC,
  bill: Bill,
  committee: Committee,
  state: GameState,
  rng: () => number,
): { yesVotes: number; noVotes: number } {
  let yesVotes = 0;
  let noVotes = 0;

  const isHelpful = amendment.type === 'add_pro' || amendment.type === 'remove';
  const isHarmful = amendment.type === 'add_anti' || amendment.type === 'flip';

  for (const memberId of committee.members) {
    const memberNpc = state.npcs.find(n => n.id === memberId);
    if (!memberNpc) continue;

    const memberSent = state.sentiment[memberId] ?? 0;
    const memberTier = getSentimentTier(memberSent);

    // Does this member support the bill author?
    const supportsBill = memberTier === 'warm' || memberTier === 'allied';
    const opposesBill = memberTier === 'cold' || memberTier === 'hostile';

    // Does this amendment help or hurt the bill?
    if (isHelpful) {
      // Helpful amendment: supporters vote yes, opponents vote no
      if (supportsBill) yesVotes++;
      else if (opposesBill) noVotes++;
      else {
        // Neutral: does this amendment add something they care about?
        if (memberNpc.coreInterests.includes(amendment.targetIssue)) yesVotes++;
        else rng() > 0.5 ? yesVotes++ : noVotes++;
      }
    } else {
      // Harmful amendment: opponents vote yes (to hurt the bill), supporters vote no
      if (opposesBill) yesVotes++;
      else if (supportsBill) noVotes++;
      else {
        // Neutral: does this amendment target something they care about?
        if (memberNpc.coreInterests.includes(amendment.targetIssue)) {
          // This targets their interest — vote based on whether it hurts them
          if (amendment.type === 'flip') noVotes++; // flipping their interest = bad
          else rng() > 0.5 ? yesVotes++ : noVotes++;
        } else {
          rng() > 0.5 ? yesVotes++ : noVotes++;
        }
      }
    }
  }

  return { yesVotes, noVotes };
}

/**
 * Apply a passed amendment to a bill, mutating its tags.
 * Returns the updated bill.
 */
export function applyAmendment(bill: Bill, amendment: ProposedAmendment): Bill {
  let updatedBill = { ...bill };
  const proTags = [...updatedBill.proTags] as [Issue, Issue];

  switch (amendment.type) {
    case 'add_pro':
      // Bill tags can grow beyond 3 per GDD — no upper limit
      // For the 2-slot proTags tuple, we just record it; extended tags go in amendment history
      break;

    case 'add_anti':
      // Replace the anti-tag (bill only has one anti-tag slot)
      updatedBill = { ...updatedBill, antiTag: amendment.targetIssue };
      break;

    case 'remove':
      // If removing a pro-tag, shift the remaining one
      if (proTags[0] === amendment.targetIssue) {
        proTags[0] = proTags[1];
        // Keep the second slot — bill still needs 2 pro-tags structurally
      } else if (proTags[1] === amendment.targetIssue) {
        // Just leave it; the tag is "weakened" but structurally present
      }
      // If removing the anti-tag, replace with a neutral issue
      if (updatedBill.antiTag === amendment.targetIssue) {
        updatedBill = { ...updatedBill, antiTag: 'rules_procedures' }; // safe neutral
      }
      updatedBill = { ...updatedBill, proTags };
      break;

    case 'flip':
      // Flip a pro-tag to anti: the pro-tag becomes the new anti, old anti becomes pro
      if (proTags[0] === amendment.targetIssue) {
        const oldAnti = updatedBill.antiTag;
        updatedBill = { ...updatedBill, antiTag: amendment.targetIssue, proTags: [oldAnti, proTags[1]] };
      } else if (proTags[1] === amendment.targetIssue) {
        const oldAnti = updatedBill.antiTag;
        updatedBill = { ...updatedBill, antiTag: amendment.targetIssue, proTags: [proTags[0], oldAnti] };
      }
      break;
  }

  // Record in amendment history
  updatedBill.amendmentHistory = [...updatedBill.amendmentHistory, {
    id: amendment.id,
    proposer: amendment.proposer.id,
    type: amendment.type,
    targetIssue: amendment.targetIssue,
    newIssue: amendment.newIssue,
    passed: true,
    day: 0, // will be set by caller
  }];

  return updatedBill;
}
