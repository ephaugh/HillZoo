/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Decision Engine
   The ONE function that drives all NPC responses.
   Net Willingness calculation, response thresholds, trade eval.
   Pure TypeScript — no Svelte imports.
   ═══════════════════════════════════════════════════════════ */

import type {
  NPC, Bill, GameState, Temperament, Issue,
  ReportCardGrade, PartyStandingTier,
} from './types';
import { clamp } from './utils';

// ── Temperament Multipliers (applied to components 1–4 BEFORE summing) ──
const TEMPERAMENT_MULTIPLIERS: Record<Temperament, {
  interest: number;
  sentiment: number;
  party: number;
  district: number;
}> = {
  ideologue:    { interest: 1.5, sentiment: 0.5, party: 0.5, district: 0.8 },
  follower:     { interest: 0.7, sentiment: 0.8, party: 2.0, district: 1.2 },
  dealmaker:    { interest: 0.8, sentiment: 1.5, party: 0.7, district: 1.0 },
  opportunist:  { interest: 0.6, sentiment: 0.8, party: 0.8, district: 1.5 },
};

// ── Response Tier Thresholds ──
export type ResponseTier = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export function getResponseTier(nw: number): ResponseTier {
  if (nw >= 60) return 1;  // "Done"
  if (nw >= 40) return 2;  // "I'm with you on this"
  if (nw >= 20) return 3;  // "I'm leaning your way, but..."
  if (nw >= -19) return 4; // "What's in it for me?"
  if (nw >= -39) return 5; // "I can't"
  if (nw >= -59) return 6; // "No"
  return 7;                 // "Absolutely not, and..."
}

// ── Natural Enemies ──
const NATURAL_ENEMIES: Partial<Record<Issue, Issue>> = {
  habitat_burrows: 'migration_transit',
  migration_transit: 'habitat_burrows',
  agriculture_foraging: 'predation_defense',
  predation_defense: 'agriculture_foraging',
  freshwater_marine: 'environment_conservation',
  environment_conservation: 'freshwater_marine',
};

// ── Component Breakdown (for dominant driver identification) ──
export interface WillingnessBreakdown {
  interest: number;
  sentiment: number;
  party: number;
  district: number;
  faction: number;
  presidential: number;
  situational: number;
  momentum: number; // opportunist only
  total: number;
  dominantDriver: DominantDriver;
  tier: ResponseTier;
}

export type DominantDriver = 'interest' | 'sentiment' | 'party' | 'district' | 'faction' | 'momentum';

// ══════════════════════════════════════════════════════════════
// MAIN FUNCTION: calculateNetWillingness
// ══════════════════════════════════════════════════════════════

export function calculateNetWillingness(
  npc: NPC,
  bill: Bill,
  state: GameState,
  isCosponsorAsk: boolean = false,
): WillingnessBreakdown {
  const mult = TEMPERAMENT_MULTIPLIERS[npc.temperament];
  const npcSentiment = state.sentiment[npc.id] ?? 0;
  const sameParty = npc.party === state.player.party;

  // ── Component 1: Interest Alignment ──
  let interestRaw = 0;
  for (const proTag of bill.proTags) {
    if (npc.coreInterests.includes(proTag)) interestRaw += 15;
    else if (npc.flexibleInterests.includes(proTag)) interestRaw += 8;
    if (NATURAL_ENEMIES[npc.coreInterests[0]] === proTag) interestRaw -= 12;
    if (NATURAL_ENEMIES[npc.coreInterests[1]] === proTag) interestRaw -= 12;
  }
  if (npc.coreInterests.includes(bill.antiTag)) interestRaw -= 20;
  else if (npc.flexibleInterests.includes(bill.antiTag)) interestRaw -= 10;
  const interest = interestRaw * mult.interest;

  // ── Component 2: Sentiment Modifier ──
  const sentimentRaw = npcSentiment * 0.4;
  const sentiment = sentimentRaw * mult.sentiment;

  // ── Component 3: Party Pressure ──
  let partyRaw = 0;

  // Whip instruction
  const playerPartyObj = state.parties.find(p => p.name === state.player.party);
  const opposingPartyObj = state.parties.find(p => p.name !== state.player.party);
  // For now, simplified: whip supports player's bill if sentiment is positive
  const whipNpc = state.npcs.find(n => n.id === playerPartyObj?.whipId);
  const whipSentiment = whipNpc ? (state.sentiment[whipNpc.id] ?? 0) : 0;
  const whipSupports = whipSentiment > 0;

  if (sameParty) {
    if (whipSupports) partyRaw += 12;
    else if (whipSentiment < -10) partyRaw -= 15;
  } else {
    // Opposing whip may counter
    if (whipSupports) partyRaw -= 0; // opposing party doesn't get player whip bonus
    const oppWhip = state.npcs.find(n => n.id === opposingPartyObj?.whipId);
    const oppWhipSent = oppWhip ? (state.sentiment[oppWhip.id] ?? 0) : 0;
    if (oppWhipSent < 0) partyRaw -= 10;
  }

  // Player party standing effect (same-party only)
  if (sameParty) {
    const standingBonus: Record<PartyStandingTier, number> = {
      insider: 5, good_standing: 0, thin_ice: -3, outcast: -8,
    };
    partyRaw += standingBonus[state.partyStanding];
  }

  // Leader pressure modifiers (from LEAN ON A MEMBER verb)
  if (state.leaderPressureModifiers) {
    for (const mod of state.leaderPressureModifiers) {
      if (mod.targetNpcId === npc.id && mod.billId === bill.id) {
        partyRaw += mod.direction === 'yes' ? mod.pressureValue : -mod.pressureValue;
      }
    }
  }

  const party = partyRaw * mult.party;

  // ── Component 4: District Pressure ──
  let districtRaw = 0;
  for (const proTag of bill.proTags) {
    if (npc.district.strongInterests.includes(proTag)) districtRaw += 8;
    if (npc.district.hostility === proTag) districtRaw -= 12;
  }
  if (npc.district.strongInterests.includes(bill.antiTag)) districtRaw -= 15;
  if (npc.district.hostility === bill.antiTag) districtRaw += 5;

  // Primary proximity multiplier
  const primaryDay = npc.primaryDate === 'early' ? 20 : 45;
  const daysUntilPrimary = primaryDay - state.currentDay;
  let proximityMult = 1.0;
  if (npc.isLameDuck) proximityMult = 0.0;
  else if (npc.primarySurvived) proximityMult = 0.3;
  else if (daysUntilPrimary <= 2) proximityMult = 3.0;
  else if (daysUntilPrimary <= 7) proximityMult = 2.0;
  else if (daysUntilPrimary <= 14) proximityMult = 1.5;

  districtRaw = districtRaw * proximityMult;
  const district = districtRaw * mult.district;

  // ── Component 5: Faction Pressure (NO multiplier) ──
  let faction = 0;
  const gradeValue: Record<ReportCardGrade, number> = {
    a_plus: 4, a: 4, b: 1, c: -2, d: -4, f: -6,
  };
  const bananaGradeValue: Record<ReportCardGrade, number> = {
    a_plus: 8, a: 8, b: 2, c: -4, d: -8, f: -12,
  };

  for (const card of state.reportCards) {
    if (card.entityType !== 'faction') continue;
    const fac = state.factions.find(f => f.id === card.entityId);
    if (!fac) continue;

    // Check if NPC is aligned with this faction (shares a core interest with faction's major pro)
    const npcAligned = npc.coreInterests.includes(fac.majorPro) ||
                       npc.coreInterests.includes(fac.minorPro);
    if (!npcAligned && !fac.isBananaLobby) continue;

    if (fac.isBananaLobby) {
      // Banana Lobby applies to ALL NPCs at doubled values
      faction += bananaGradeValue[card.grade];
    } else if (npcAligned) {
      faction += gradeValue[card.grade];
    }
  }

  // ── Component 6: Presidential Stance (NO multiplier) ──
  let presidential = 0;
  // Calculate aggregate presidential stance from PUBLIC info only
  let aggStance = 0;
  let hasAnyPublicStance = false;
  for (const proTag of bill.proTags) {
    if (state.knownInfo.revealedPresidentialStances.includes(proTag)) {
      aggStance += state.president.stances[proTag];
      hasAnyPublicStance = true;
    }
  }
  if (state.knownInfo.revealedPresidentialStances.includes(bill.antiTag)) {
    aggStance -= state.president.stances[bill.antiTag]; // inverted for anti-tag
    hasAnyPublicStance = true;
  }

  if (hasAnyPublicStance) {
    if (aggStance >= 4) presidential = 5;        // "will sign"
    else if (aggStance >= 1) presidential = 2;   // "likely to sign"
    else if (aggStance === 0) presidential = 0;  // "unknown"
    else if (aggStance >= -3) presidential = -5;  // "may veto"
    else presidential = -12;                      // "will veto"
  }

  // ── Component 7: Situational Modifiers (NO multiplier) ──
  let situational = 0;

  // Player cosponsored NPC's bill
  if (npc.hasActiveBill && npc.activeBill) {
    const npcBill = state.npcBills.find(b => b.id === npc.activeBill);
    if (npcBill && npcBill.cosponsors.includes('player')) {
      situational += 10;
    }
  }

  // Broken promises
  for (const promise of state.promises) {
    if (promise.npcId === npc.id && promise.fulfilled === false) {
      situational -= 20;
    }
  }

  // Shared committee
  const sharedCommittee = state.committees.some(c =>
    c.members.includes(npc.id) && state.player.committees.includes(c.id)
  );
  if (sharedCommittee) situational += 3;

  // Cosponsorship ask penalty
  if (isCosponsorAsk) situational -= 10;

  // Issue temperature effects
  for (const proTag of bill.proTags) {
    const temp = state.issueTemperatures[proTag];
    if (temp === 'hot') situational += 10;
    else if (temp === 'cold') situational -= 5;
  }
  const antiTemp = state.issueTemperatures[bill.antiTag];
  if (antiTemp === 'hot') situational += 5;
  else if (antiTemp === 'cold') situational -= 3;

  // Budget score
  if (bill.burdenRating === 'lean') situational += 3;
  else if (bill.burdenRating === 'heavy') situational -= 3;
  else if (bill.burdenRating === 'bloated') situational -= 8;

  // ── Opportunist Momentum Bonus ──
  let momentum = 0;
  if (npc.temperament === 'opportunist') {
    const cosponsorCount = bill.cosponsors.length;
    if (cosponsorCount > 10) momentum = 25;
    else if (cosponsorCount > 5) momentum = 15;
    else if (cosponsorCount < 3) momentum = -10;
  }

  // ── Lame Duck modifiers (when PLAYER is lame duck) ──
  let lameDuckAdj = 0;
  if (state.isLameDuck) {
    switch (npc.temperament) {
      case 'dealmaker': lameDuckAdj = -20; break;
      case 'opportunist': lameDuckAdj = 15; break;
      // ideologue/follower modify sentiment multiplier, handled above conceptually
      // but for simplicity we apply flat adjustments here
    }
  }

  // ── Sum ──
  const total = interest + sentiment + party + district +
                faction + presidential + situational + momentum + lameDuckAdj;

  // ── Identify dominant driver ──
  // Components 1-4 after multiplier, plus momentum for opportunist
  const driverValues: Array<{ driver: DominantDriver; value: number }> = [
    { driver: 'interest', value: Math.abs(interest) },
    { driver: 'sentiment', value: Math.abs(sentiment) },
    { driver: 'party', value: Math.abs(party) },
    { driver: 'district', value: Math.abs(district) },
    { driver: 'faction', value: Math.abs(faction) },
  ];
  if (npc.temperament === 'opportunist') {
    driverValues.push({ driver: 'momentum', value: Math.abs(momentum) });
  }
  driverValues.sort((a, b) => b.value - a.value);
  const dominantDriver = driverValues[0].driver;

  return {
    interest,
    sentiment,
    party,
    district,
    faction,
    presidential,
    situational,
    momentum,
    total: Math.round(total),
    dominantDriver,
    tier: getResponseTier(Math.round(total)),
  };
}

// ══════════════════════════════════════════════════════════════
// TRADE EVALUATION
// ══════════════════════════════════════════════════════════════

export interface TradeOption {
  type: 'vote_npc_bill' | 'cosponsor_npc_bill' | 'campaign' | 'accept_amendment' | 'vote_unrelated' | 'pressure_member' | 'fundraiser';
  label: string;
  value: number;
  description: string;
}

export function evaluateTrade(
  npc: NPC,
  breakdown: WillingnessBreakdown,
  state: GameState,
): TradeOption[] {
  const askCost = Math.max(0, -breakdown.total + 10);

  const options: TradeOption[] = [];

  // Vote yes on NPC's own bill
  if (npc.hasActiveBill) {
    options.push({
      type: 'vote_npc_bill',
      label: 'VOTE YES ON THEIR BILL',
      value: 20,
      description: `COMMIT TO VOTING YES ON THEIR LEGISLATION`,
    });
  }

  // Cosponsor NPC's bill
  if (npc.hasActiveBill) {
    options.push({
      type: 'cosponsor_npc_bill',
      label: 'COSPONSOR THEIR BILL',
      value: 25,
      description: `PUT YOUR NAME ON THEIR LEGISLATION`,
    });
  }

  // Campaign in NPC's district
  options.push({
    type: 'campaign',
    label: 'CAMPAIGN IN THEIR DISTRICT',
    value: 30,
    description: `SPEND A SLOT CAMPAIGNING FOR THEM BACK HOME`,
  });

  // Accept an amendment
  options.push({
    type: 'accept_amendment',
    label: 'ACCEPT AN AMENDMENT',
    value: 20,
    description: `LET THEM MODIFY YOUR BILL`,
  });

  // Vote on unrelated legislation
  options.push({
    type: 'vote_unrelated',
    label: 'VOTE ON UNRELATED BILL',
    value: 15,
    description: `COMMIT YOUR VOTE ON ANOTHER MATTER`,
  });

  // Pressure another member
  options.push({
    type: 'pressure_member',
    label: 'PRESSURE A COLLEAGUE',
    value: 20,
    description: `USE YOUR INFLUENCE ON SOMEONE THEY NEED`,
  });

  // Financial support
  if (state.warChest >= 1200) {
    options.push({
      type: 'fundraiser',
      label: 'HOST FUNDRAISER ($1,200)',
      value: 18,
      description: `SPEND $1,200 TO HOST A FUNDRAISER FOR THEM`,
    });
  }

  // Sort by value descending, mark which ones meet the ask cost
  return options.sort((a, b) => b.value - a.value);
}
