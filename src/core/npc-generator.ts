/* ═══════════════════════════════════════════════════════════
   HILL ZOO — World Generation Engine
   Creates 49 NPCs, factions, committees, president, etc.
   Pure TypeScript — no Svelte imports.
   ═══════════════════════════════════════════════════════════ */

import type {
  GameState, NPC, Bill, Faction, Committee, Party, PlayerState,
  PresidentState, ReportCard, District, CreationState, Issue,
  PartyName, Temperament, IssueStance, Temperature, PartyBalanceSetting,
  CommitteeIssue, Slot, ScheduleEntry, MandatoryEvent, GossipEntry,
  GamePromise, Headline, VoteRecord, KnownInformation, NpcDeal, BillTag,
} from './types';
import {
  ALL_ISSUES, COMMITTEE_ISSUES, CROSS_CUTTING_ISSUES, SPECIES_LIST,
  ISSUE_LABELS, CROSS_CUTTING_REFERRAL,
} from './types';
import {
  createRng, shuffle, pick, pickN, clamp, generateId,
  weightedRandom, randomInt, getSentimentTier,
} from './utils';

// ── Name generation ──
const FIRST_NAMES = [
  'Aldric', 'Bramwell', 'Cedric', 'Dorothea', 'Edmund', 'Felicity',
  'Gideon', 'Harriet', 'Irving', 'Josephine', 'Kendrick', 'Lavinia',
  'Mortimer', 'Neville', 'Ophelia', 'Percival', 'Quintus', 'Rosalind',
  'Silas', 'Theodora', 'Ulric', 'Vivienne', 'Winslow', 'Ximena',
  'York', 'Zelda', 'Alistair', 'Beatrice', 'Cornelius', 'Desmond',
  'Eleanora', 'Fletcher', 'Gertrude', 'Horace', 'Isolde', 'Jarvis',
  'Katarina', 'Leopold', 'Meredith', 'Norbert', 'Octavia', 'Preston',
  'Ramona', 'Sterling', 'Tabitha', 'Vernon', 'Wilhelmina', 'Augustus',
  'Bartholomew', 'Clementine',
];

const LAST_NAMES = [
  'Ashford', 'Blackwood', 'Crawford', 'Dunmore', 'Everett', 'Foxworth',
  'Grayson', 'Holloway', 'Ironside', 'Jasper', 'Kirkland', 'Lancaster',
  'Montague', 'Northcott', 'Osgood', 'Pemberton', 'Quincy', 'Ravenscroft',
  'Stonebridge', 'Thornton', 'Underwood', 'Vickers', 'Whitfield', 'Yardley',
  'Ashworth', 'Barrington', 'Coldwell', 'Devereaux', 'Eastwick', 'Fairbanks',
  'Gatewood', 'Hartwell', 'Ingram', 'Jennings', 'Kemp', 'Lockwood',
  'Moorehouse', 'Newberry', 'Oakridge', 'Prescott', 'Redmond', 'Shelby',
  'Tidewater', 'Upton', 'Vanhorn', 'Wellspring', 'Yarmouth', 'Aldridge',
  'Bingham', 'Carstairs',
];

// ── Party balance seat splits ──
const PARTY_SPLITS: Record<PartyBalanceSetting, { majority: number; minority: number }> = {
  large_majority: { majority: 30, minority: 20 },
  slim_majority: { majority: 27, minority: 23 },
  slim_minority: { majority: 27, minority: 23 },
  large_minority: { majority: 30, minority: 20 },
};

// ── Slider positions (0=full loyalist, 100=full pragmatist) ──
function getSliderTier(pos: number): 'full_loyalist' | 'loyalist_leaning' | 'middle' | 'pragmatist_leaning' | 'full_pragmatist' {
  if (pos <= 10) return 'full_loyalist';
  if (pos <= 30) return 'loyalist_leaning';
  if (pos <= 70) return 'middle';
  if (pos <= 90) return 'pragmatist_leaning';
  return 'full_pragmatist';
}

const STARTING_SENTIMENT = {
  full_loyalist: { ownParty: 25, opposition: -25 },
  loyalist_leaning: { ownParty: 20, opposition: -18 },
  middle: { ownParty: 12, opposition: -10 },
  pragmatist_leaning: { ownParty: 7, opposition: -5 },
  full_pragmatist: { ownParty: 3, opposition: -3 },
};

const STARTING_WAR_CHEST = {
  full_loyalist: { majority: 3500, minority: 3000 },
  loyalist_leaning: { majority: 3000, minority: 2500 },
  middle: { majority: 2500, minority: 2000 },
  pragmatist_leaning: { majority: 2000, minority: 1500 },
  full_pragmatist: { majority: 1500, minority: 1000 },
};

const STARTING_PRIMARY = {
  full_loyalist: 15,
  loyalist_leaning: 20,
  middle: 30,
  pragmatist_leaning: 35,
  full_pragmatist: 40,
};

// ── Faction definitions ──
const FACTION_DEFS: Array<{
  name: string;
  majorPro: Issue;
  majorAnti: Issue;
}> = [
  { name: 'Timber Union', majorPro: 'habitat_burrows', majorAnti: 'environment_conservation' },
  { name: 'Grazing Council', majorPro: 'agriculture_foraging', majorAnti: 'predation_defense' },
  { name: 'Migratory Compact', majorPro: 'migration_transit', majorAnti: 'habitat_burrows' },
  { name: 'Claw & Fang Caucus', majorPro: 'predation_defense', majorAnti: 'agriculture_foraging' },
  { name: 'Watershed Alliance', majorPro: 'freshwater_marine', majorAnti: 'migration_transit' },
];

// ── Committee definitions ──
const COMMITTEE_DEFS: Array<{ name: string; issue: CommitteeIssue }> = [
  { name: 'Agriculture & Foraging', issue: 'agriculture_foraging' },
  { name: 'Habitat & Burrows', issue: 'habitat_burrows' },
  { name: 'Migration & Transit', issue: 'migration_transit' },
  { name: 'Predation & Defense', issue: 'predation_defense' },
  { name: 'Freshwater & Marine Affairs', issue: 'freshwater_marine' },
  { name: 'Environment & Conservation', issue: 'environment_conservation' },
  { name: 'Rules & Procedures', issue: 'rules_procedures' },
  { name: 'Budget', issue: 'budget' },
];

// ── Natural enemies ──
const NATURAL_ENEMIES: Partial<Record<Issue, Issue>> = {
  habitat_burrows: 'migration_transit',
  migration_transit: 'habitat_burrows',
  agriculture_foraging: 'predation_defense',
  predation_defense: 'agriculture_foraging',
  freshwater_marine: 'environment_conservation',
  environment_conservation: 'freshwater_marine',
};

// ── Bill name fragments ──
const BILL_PREFIXES = [
  'Comprehensive', 'Emergency', 'Bipartisan', 'Regional', 'National',
  'Protective', 'Modernization', 'Reform', 'Restoration', 'Sustainable',
  'Fair', 'Universal', 'Enhanced', 'Strategic', 'Community',
];
const BILL_SUFFIXES = [
  'Act', 'Initiative', 'Compact', 'Resolution', 'Provision',
  'Mandate', 'Framework', 'Program', 'Standards', 'Protocol',
];

function generateBillName(rng: () => number, proTags: [Issue, Issue]): string {
  const prefix = pick(rng, BILL_PREFIXES);
  const suffix = pick(rng, BILL_SUFFIXES);
  const issueWord = ISSUE_LABELS[proTags[0]].split(' ')[0];
  const name = `${prefix} ${issueWord} ${suffix}`;
  return name.length > 30 ? name.slice(0, 30) : name;
}

// ══════════════════════════════════════════════════════════════
// MAIN GENERATION FUNCTION
// ══════════════════════════════════════════════════════════════

export function generateWorld(creation: CreationState): GameState {
  const rng = createRng(creation.seed);
  const species = creation.species!;
  const playerParty = creation.party!;
  const sliderTier = getSliderTier(creation.sliderPosition);

  // Determine majority/minority parties
  const isPlayerMajority = creation.partyBalance === 'large_majority' || creation.partyBalance === 'slim_majority';
  const split = PARTY_SPLITS[creation.partyBalance];
  const playerPartySize = isPlayerMajority ? split.majority : split.minority;
  const oppositionPartySize = isPlayerMajority ? split.minority : split.majority;
  const opposingParty: PartyName = playerParty === 'feralist' ? 'communalist' : 'feralist';

  // Player counts as 1 of their party, so NPCs in player's party = playerPartySize - 1
  const playerPartyNpcCount = playerPartySize - 1;
  const oppositionNpcCount = oppositionPartySize;

  // ── Generate Factions ──
  const factions = generateFactions(rng);

  // ── Generate NPCs ──
  const npcs = generateNpcs(
    rng, playerParty, opposingParty, playerPartyNpcCount, oppositionNpcCount,
    species, creation, factions
  );

  // ── Generate Committees ──
  const { committees, playerCommittees } = generateCommittees(
    rng, npcs, playerParty, isPlayerMajority, sliderTier
  );

  // ── Assign NPC committee memberships ──
  for (const committee of committees) {
    for (const memberId of committee.members) {
      const npc = npcs.find(n => n.id === memberId);
      if (npc && !npc.committeeMemberships.includes(committee.id)) {
        npc.committeeMemberships.push(committee.id);
      }
    }
  }

  // ── Generate Parties ──
  const parties = generateParties(
    rng, npcs, playerParty, opposingParty, isPlayerMajority, creation
  );

  // ── Player Bill ──
  const playerBill: Bill = {
    id: generateId('bill'),
    number: creation.billNumber!,
    name: creation.billName,
    proTags: creation.billProTags as [Issue, Issue],
    antiTag: creation.billAntiTag!,
    author: 'player',
    stage: 'referral',
    cosponsors: [],
    amendmentHistory: [],
    momentum: 0,
    burdenRating: null,
    burdenScore: null,
  };

  // ── Player District ──
  const playerDistrict = creation.district!;

  // ── Player State ──
  const player: PlayerState = {
    species,
    party: playerParty,
    sliderPosition: creation.sliderPosition,
    bill: playerBill,
    district: playerDistrict,
    committees: playerCommittees,
  };

  // ── Generate NPC Bills ──
  const npcBills = generateNpcBills(rng, npcs, playerBill, creation, factions);

  // ── Mark NPCs with active bills ──
  for (const bill of npcBills) {
    const npc = npcs.find(n => n.id === bill.author);
    if (npc) {
      npc.hasActiveBill = true;
      npc.activeBill = bill.id;
    }
  }

  // ── Generate Issue Temperatures ──
  const { temperatures, permanentHot } = generateIssueTemperatures(rng, creation, factions);

  // ── Generate President ──
  const president = generatePresident(rng, isPlayerMajority ? playerParty : opposingParty);

  // ── Calculate Starting Sentiments ──
  const sentiment = calculateStartingSentiment(
    npcs, playerParty, sliderTier, playerBill
  );

  // Store baselines on NPCs
  for (const npc of npcs) {
    npc.sentimentBaseline = sentiment[npc.id] ?? 0;
  }

  // ── Generate Report Cards (cold start with phantom votes) ──
  const reportCards = generateReportCards(factions, parties, playerBill);

  // ── War chest & primary ──
  const majorityKey = isPlayerMajority ? 'majority' : 'minority';
  const warChest = STARTING_WAR_CHEST[sliderTier][majorityKey];
  const primaryThreat = STARTING_PRIMARY[sliderTier];

  // ── Bombshell schedule ──
  const nextBombshellDay = randomInt(rng, 6, 10);

  // ── Assemble GameState ──
  const gameState: GameState = {
    version: '0.1.0',
    seed: creation.seed,
    createdAt: new Date().toISOString(),

    player,
    warChest,
    primaryThreat,
    primaryDate: creation.primaryDate!,
    primarySurvived: false,
    isLameDuck: false,
    partyStanding: sliderTier === 'full_loyalist' || sliderTier === 'loyalist_leaning' ? 'good_standing' : 'good_standing',

    currentDay: 1,
    currentSlot: 'morning',
    schedule: [],
    mandatoryEvents: [],

    npcs,
    factions,
    committees,
    parties: parties as [Party, Party],

    playerBill,
    npcBills,

    sentiment,
    npcSentiment: {},
    promises: [],

    reportCards,

    issueTemperatures: temperatures as Record<Issue, Temperature>,
    permanentHotIssue: permanentHot,
    headlineHistory: [],
    nextBombshellDay,

    president,

    gossipLog: [],
    knownInfo: {
      revealedNpcInterests: {},
      revealedPresidentialStances: [...president.publicStances],
      gossipHintedStances: [],
      knownDeals: [],
      meetingCount: {},
    },

    npcDeals: [],
    leaderPressureModifiers: [],
    voteHistory: [],
    partyBalance: creation.partyBalance,
  };

  return gameState;
}

// ══════════════════════════════════════════════════════════════
// SUB-GENERATORS
// ══════════════════════════════════════════════════════════════

function generateFactions(rng: () => number): Faction[] {
  const crossCutting = shuffle(rng, [...CROSS_CUTTING_ISSUES]);
  let ccIdx = 0;

  const factions: Faction[] = FACTION_DEFS.map(def => {
    // Pick minor pro/anti from cross-cutting issues, avoiding overlap with major
    let minorPro = crossCutting[ccIdx++ % crossCutting.length];
    while (minorPro === def.majorPro || minorPro === def.majorAnti) {
      minorPro = crossCutting[ccIdx++ % crossCutting.length];
    }
    let minorAnti = crossCutting[ccIdx++ % crossCutting.length];
    while (minorAnti === def.majorPro || minorAnti === def.majorAnti || minorAnti === minorPro) {
      minorAnti = crossCutting[ccIdx++ % crossCutting.length];
    }

    return {
      id: generateId('fac'),
      name: def.name,
      majorPro: def.majorPro,
      majorAnti: def.majorAnti,
      minorPro,
      minorAnti,
      treasury: randomInt(rng, 3000, 6000),
      isBananaLobby: false,
      hiddenTriggerIssues: [],
    };
  });

  // Add Banana Lobby
  const allTreasuries = factions.reduce((sum, f) => sum + f.treasury, 0);
  const bananaHiddenTriggers = pickN(rng,
    ALL_ISSUES.filter(i => i !== 'bananas' && i !== 'trade_commerce'),
    randomInt(rng, 1, 2)
  );

  factions.push({
    id: generateId('fac'),
    name: 'Banana Lobby',
    majorPro: 'bananas',
    majorAnti: 'trade_commerce',
    minorPro: pick(rng, CROSS_CUTTING_ISSUES.filter(i => i !== 'bananas' && i !== 'trade_commerce')),
    minorAnti: pick(rng, COMMITTEE_ISSUES.filter(i => i !== 'budget' && i !== 'rules_procedures') as readonly Issue[]),
    treasury: allTreasuries,
    isBananaLobby: true,
    hiddenTriggerIssues: bananaHiddenTriggers,
  });

  return factions;
}

function generateNpcs(
  rng: () => number,
  playerParty: PartyName,
  opposingParty: PartyName,
  playerPartyCount: number,
  oppositionCount: number,
  playerSpecies: string,
  creation: CreationState,
  factions: Faction[],
): NPC[] {
  const npcs: NPC[] = [];

  // Species pool (exclude player's species)
  const speciesPool = shuffle(rng, SPECIES_LIST.filter(s => s !== playerSpecies));
  let speciesIdx = 0;

  // Name pools
  const firstNames = shuffle(rng, FIRST_NAMES);
  const lastNames = shuffle(rng, LAST_NAMES);
  let nameIdx = 0;

  // Seniority weights: ~30% sen1, ~25% sen2, ~20% sen3, ~15% sen4, ~10% sen5
  const seniorityItems = [1, 2, 3, 4, 5];
  const seniorityWeights = [30, 25, 20, 15, 10];

  // Temperament: roughly even, slight party skew
  const temperaments: Temperament[] = ['ideologue', 'follower', 'dealmaker', 'opportunist'];

  // Get party agenda for NPC interest weighting
  const getPartyAgenda = (party: PartyName): Partial<Record<Issue, 'pro' | 'anti'>> => {
    return party === 'feralist' ? creation.feralistAgenda : creation.communalistAgenda;
  };

  function createNpc(party: PartyName, index: number): NPC {
    // Species — cycle through, allowing repeats after first pass
    const npcSpecies = speciesPool[speciesIdx % speciesPool.length] as typeof SPECIES_LIST[number];
    speciesIdx++;

    // Name
    const firstName = firstNames[nameIdx % firstNames.length];
    const lastName = lastNames[nameIdx % lastNames.length];
    nameIdx++;
    const name = `${firstName} ${lastName}`;

    // Seniority
    const seniority = weightedRandom(rng, seniorityItems, seniorityWeights);

    // Temperament — slight skew by party
    let tempWeights: number[];
    if (party === playerParty) {
      // Majority: Followers slightly more common
      tempWeights = [24, 28, 24, 24];
    } else {
      // Minority: Opportunists slightly more common
      tempWeights = [24, 24, 24, 28];
    }
    const temperament = weightedRandom(rng, temperaments, tempWeights);

    // Core interests (2) — weighted toward party agenda
    const agenda = getPartyAgenda(party);
    const issueWeights = ALL_ISSUES.map(issue => {
      let w = 10;
      if (agenda[issue] === 'pro') w += 20;
      if (agenda[issue] === 'anti') w += 10;
      // Rules & Budget less likely as core
      if (issue === 'rules_procedures' || issue === 'budget') w = 2;
      return w;
    });

    const allIssuesCopy = [...ALL_ISSUES];
    const core1 = weightedRandom(rng, allIssuesCopy, issueWeights);
    const core1Idx = allIssuesCopy.indexOf(core1);
    const remainingIssues = allIssuesCopy.filter((_, i) => i !== core1Idx);
    const remainingWeights = issueWeights.filter((_, i) => i !== core1Idx);
    const core2 = weightedRandom(rng, remainingIssues, remainingWeights);
    const coreInterests: [Issue, Issue] = [core1, core2];

    // Flexible interests (1-2)
    const nonCore = ALL_ISSUES.filter(i => i !== core1 && i !== core2);
    const flexCount = randomInt(rng, 1, 2);
    const flexibleInterests = pickN(rng, nonCore, flexCount);

    // District
    const distInterests = pickN(rng,
      ALL_ISSUES.filter(i => i !== 'rules_procedures' && i !== 'budget'),
      2
    ) as [Issue, Issue];
    const distHostility = pick(rng,
      ALL_ISSUES.filter(i => !distInterests.includes(i) && i !== 'rules_procedures' && i !== 'budget')
    );
    const district: District = {
      strongInterests: distInterests,
      hostility: distHostility,
    };

    // Issue stances
    const issueStances = {} as Record<Issue, IssueStance>;
    for (const issue of ALL_ISSUES) {
      if (coreInterests.includes(issue)) {
        issueStances[issue] = 'positive';
      } else if (flexibleInterests.includes(issue)) {
        issueStances[issue] = 'positive';
      } else if (NATURAL_ENEMIES[coreInterests[0]] === issue || NATURAL_ENEMIES[coreInterests[1]] === issue) {
        issueStances[issue] = 'negative';
      } else if (district.hostility === issue) {
        issueStances[issue] = 'negative';
      } else {
        // Neutral, but temperament can break ties
        if (temperament === 'follower' && agenda[issue]) {
          issueStances[issue] = agenda[issue] === 'pro' ? 'positive' : 'negative';
        } else {
          issueStances[issue] = 'neutral';
        }
      }
    }

    // Primary date — roughly half early, half late
    const primaryDate = rng() > 0.5 ? 'early' as const : 'late' as const;

    return {
      id: generateId('npc'),
      name,
      species: npcSpecies,
      party,
      seniority,
      district,
      coreInterests,
      flexibleInterests,
      temperament,
      issueStances,
      committeeMemberships: [],
      hasActiveBill: false,
      activeBill: null,
      primaryDate,
      primaryThreat: randomInt(rng, 10, 30),
      primarySurvived: false,
      isLameDuck: false,
      sentimentBaseline: 0,
    };
  }

  // Generate player-party NPCs
  for (let i = 0; i < playerPartyCount; i++) {
    npcs.push(createNpc(playerParty, i));
  }

  // Generate opposition NPCs
  for (let i = 0; i < oppositionCount; i++) {
    npcs.push(createNpc(opposingParty, i));
  }

  return npcs;
}

function generateCommittees(
  rng: () => number,
  npcs: NPC[],
  playerParty: PartyName,
  isPlayerMajority: boolean,
  sliderTier: string,
): { committees: Committee[]; playerCommittees: string[] } {
  const committees: Committee[] = [];
  const npcAssignments: Record<string, number> = {}; // npcId -> count of assignments
  for (const npc of npcs) npcAssignments[npc.id] = 0;

  // Sort NPCs by seniority (descending) for chair assignment
  const majorityNpcs = npcs.filter(n => {
    if (isPlayerMajority) return n.party === playerParty;
    return n.party !== playerParty;
  }).sort((a, b) => b.seniority - a.seniority);

  const minorityNpcs = npcs.filter(n => {
    if (isPlayerMajority) return n.party !== playerParty;
    return n.party === playerParty;
  }).sort((a, b) => b.seniority - a.seniority);

  for (const def of COMMITTEE_DEFS) {
    const committeeId = generateId('com');

    // Assign 4 majority + 3 minority = 7 members (including chair)
    // Prefer NPCs with interest alignment and fewer existing assignments
    const scoreMember = (npc: NPC) => {
      let score = 0;
      if (npc.coreInterests.includes(def.issue as Issue)) score += 10;
      if (npc.flexibleInterests.includes(def.issue as Issue)) score += 5;
      score -= (npcAssignments[npc.id] ?? 0) * 20; // penalize over-assignment
      score += rng() * 3; // small random factor
      return score;
    };

    const availableMajority = majorityNpcs
      .filter(n => (npcAssignments[n.id] ?? 0) < 2)
      .sort((a, b) => scoreMember(b) - scoreMember(a));

    const availableMinority = minorityNpcs
      .filter(n => (npcAssignments[n.id] ?? 0) < 2)
      .sort((a, b) => scoreMember(b) - scoreMember(a));

    const members: string[] = [];

    // Chair = highest seniority majority member available for this committee
    const chair = availableMajority[0];
    if (chair) {
      members.push(chair.id);
      npcAssignments[chair.id]++;
    }

    // 3 more majority members
    for (let i = 1; i < availableMajority.length && members.length < 4; i++) {
      members.push(availableMajority[i].id);
      npcAssignments[availableMajority[i].id]++;
    }

    // 3 minority members
    for (let i = 0; i < availableMinority.length && members.length < 7; i++) {
      members.push(availableMinority[i].id);
      npcAssignments[availableMinority[i].id]++;
    }

    committees.push({
      id: committeeId,
      name: def.name,
      issue: def.issue,
      members,
      chair: chair?.id ?? members[0],
      hearingSlots: 1,
    });
  }

  // Player committee assignments (1-2 based on slider)
  // Loyalist: top picks (first 2 committees by preference)
  // Pragmatist: 3rd-4th choice
  const playerCommittees: string[] = [];
  const committeePreference = shuffle(rng, committees);

  if (sliderTier === 'full_loyalist' || sliderTier === 'loyalist_leaning') {
    // Top 2 picks
    playerCommittees.push(committeePreference[0].id);
    if (rng() > 0.3) playerCommittees.push(committeePreference[1].id);
  } else if (sliderTier === 'middle') {
    // 2nd-3rd picks
    playerCommittees.push(committeePreference[1].id);
    if (rng() > 0.4) playerCommittees.push(committeePreference[2].id);
  } else {
    // 3rd-4th picks
    playerCommittees.push(committeePreference[2].id);
    if (rng() > 0.5) playerCommittees.push(committeePreference[3].id);
  }

  // Add the player to their assigned committees
  for (const commId of playerCommittees) {
    const comm = committees.find(c => c.id === commId);
    if (comm) {
      comm.members.push('player');
    }
  }

  return { committees, playerCommittees };
}

function generateParties(
  rng: () => number,
  npcs: NPC[],
  playerParty: PartyName,
  opposingParty: PartyName,
  isPlayerMajority: boolean,
  creation: CreationState,
): Party[] {
  const feralistNpcs = npcs.filter(n => n.party === 'feralist');
  const communalistNpcs = npcs.filter(n => n.party === 'communalist');

  function makeParty(partyName: PartyName, members: NPC[], isMajority: boolean): Party {
    const sorted = [...members].sort((a, b) => b.seniority - a.seniority);

    // Whip — high seniority, ideally a Follower
    const whipCandidates = sorted.filter(n => n.seniority >= 3);
    const whip = whipCandidates.length > 0 ? whipCandidates[Math.min(1, whipCandidates.length - 1)] : sorted[0];

    // Majority Leader
    const leader = sorted.find(n => n.id !== whip.id) ?? sorted[0];

    // Speaker (majority only)
    const speaker = isMajority ? (sorted.find(n => n.id !== whip.id && n.id !== leader.id) ?? sorted[0]) : null;

    return {
      name: partyName,
      agenda: partyName === 'feralist' ? creation.feralistAgenda : creation.communalistAgenda,
      memberIds: members.map(n => n.id),
      whipId: whip.id,
      majorityLeaderId: leader.id,
      speakerId: speaker?.id ?? null,
    };
  }

  const majorityParty = isPlayerMajority ? playerParty : opposingParty;

  const feralistParty = makeParty('feralist', feralistNpcs, majorityParty === 'feralist');
  const communalistParty = makeParty('communalist', communalistNpcs, majorityParty === 'communalist');

  return [feralistParty, communalistParty];
}

function generateNpcBills(
  rng: () => number,
  npcs: NPC[],
  playerBill: Bill,
  creation: CreationState,
  factions: Faction[],
): Bill[] {
  const bills: Bill[] = [];
  const usedNumbers = new Set([playerBill.number]);

  // Pick ~15 NPCs to have active bills
  // Skew toward higher seniority
  const candidates = [...npcs].sort((a, b) => {
    const senScore = (b.seniority * 10 + rng() * 5) - (a.seniority * 10 + rng() * 5);
    return senScore;
  });

  const activeLegislators = candidates.slice(0, 15);

  // At least 3 conflict with player, at least 2 are allies
  let conflictCount = 0;
  let allyCount = 0;

  for (const npc of activeLegislators) {
    // Generate bill tags
    let proTags: [Issue, Issue];
    let antiTag: Issue;

    if (conflictCount < 3) {
      // Create conflicting bill: anti-tag targets player's pro-tag, or pro-tag matches player's anti-tag
      const playerProTarget = pick(rng, playerBill.proTags);
      antiTag = playerProTarget;
      proTags = pickN(rng,
        ALL_ISSUES.filter(i => i !== antiTag && i !== 'rules_procedures' && i !== 'budget'),
        2
      ) as [Issue, Issue];
      conflictCount++;
    } else if (allyCount < 2) {
      // Create allied bill: shares a pro-tag with player
      const sharedPro = pick(rng, playerBill.proTags);
      const otherPro = pick(rng,
        ALL_ISSUES.filter(i => i !== sharedPro && i !== playerBill.antiTag && i !== 'rules_procedures' && i !== 'budget')
      );
      proTags = [sharedPro, otherPro];
      antiTag = pick(rng,
        ALL_ISSUES.filter(i => !proTags.includes(i) && !playerBill.proTags.includes(i))
      );
      allyCount++;
    } else {
      // Independent bill based on NPC's interests
      proTags = [npc.coreInterests[0], npc.coreInterests[1]];
      const naturalEnemy = NATURAL_ENEMIES[npc.coreInterests[0]];
      antiTag = naturalEnemy ?? pick(rng,
        ALL_ISSUES.filter(i => !proTags.includes(i) && i !== 'rules_procedures' && i !== 'budget')
      );
    }

    // Bill number
    let billNum: number;
    do {
      billNum = randomInt(rng, 1, 99);
    } while (usedNumbers.has(billNum));
    usedNumbers.add(billNum);

    bills.push({
      id: generateId('bill'),
      number: billNum,
      name: generateBillName(rng, proTags),
      proTags,
      antiTag,
      author: npc.id,
      stage: 'referral',
      cosponsors: [],
      amendmentHistory: [],
      momentum: randomInt(rng, 10, 30),
      burdenRating: null,
      burdenScore: null,
    });
  }

  return bills;
}

function generateIssueTemperatures(
  rng: () => number,
  creation: CreationState,
  factions: Faction[],
): { temperatures: Record<string, Temperature>; permanentHot: Issue } {
  const temps: Record<string, Temperature> = {};

  // Rules & Procedures and Budget locked at lukewarm
  temps['rules_procedures'] = 'lukewarm';
  temps['budget'] = 'lukewarm';

  // Bananas starts lukewarm
  temps['bananas'] = 'lukewarm';

  // Pick permanent Hot issue (committee-mapped, both parties have opposing stances)
  const hotCandidates = COMMITTEE_ISSUES.filter(i => {
    if (i === 'rules_procedures' || i === 'budget') return false;
    const fAgenda = creation.feralistAgenda[i];
    const cAgenda = creation.communalistAgenda[i];
    // Both parties should have a stance (ideally opposing)
    return (fAgenda && cAgenda) || fAgenda || cAgenda;
  });

  const permanentHot = hotCandidates.length > 0
    ? pick(rng, hotCandidates)
    : pick(rng, COMMITTEE_ISSUES.filter(i => i !== 'rules_procedures' && i !== 'budget'));
  temps[permanentHot] = 'hot';

  // 1-2 additional starting Hot issues
  const hotCount = randomInt(rng, 1, 2);
  const remainingIssues = ALL_ISSUES.filter(i => !temps[i]);
  const additionalHot = pickN(rng, remainingIssues, hotCount);
  for (const issue of additionalHot) {
    temps[issue] = 'hot';
  }

  // Distribute remaining: ~4-5 lukewarm, ~4-5 cold
  const unassigned = ALL_ISSUES.filter(i => !temps[i]);
  const shuffledUnassigned = shuffle(rng, unassigned);
  const lukewarmCount = randomInt(rng, 4, 5);

  for (let i = 0; i < shuffledUnassigned.length; i++) {
    temps[shuffledUnassigned[i]] = i < lukewarmCount ? 'lukewarm' : 'cold';
  }

  return { temperatures: temps as Record<Issue, Temperature>, permanentHot };
}

function generatePresident(rng: () => number, presidentParty: PartyName): PresidentState {
  const stances = {} as Record<Issue, number>;
  for (const issue of ALL_ISSUES) {
    stances[issue] = randomInt(rng, -2, 2);
  }

  // 3-4 stances public at game start
  const publicCount = randomInt(rng, 3, 4);
  const publicStances = pickN(rng, [...ALL_ISSUES], publicCount);

  return {
    party: presidentParty,
    stances,
    publicStances,
    approvalRating: 50,
  };
}

function calculateStartingSentiment(
  npcs: NPC[],
  playerParty: PartyName,
  sliderTier: string,
  playerBill: Bill,
): Record<string, number> {
  const sentiment: Record<string, number> = {};
  const sentimentBase = STARTING_SENTIMENT[sliderTier as keyof typeof STARTING_SENTIMENT];

  for (const npc of npcs) {
    const sameParty = npc.party === playerParty;
    let score = sameParty ? sentimentBase.ownParty : sentimentBase.opposition;

    // +10 per shared core interest with player's bill pro-tags
    for (const proTag of playerBill.proTags) {
      if (npc.coreInterests.includes(proTag)) {
        score += 10;
      }
    }

    // -10 per core interest conflicting with player's bill anti-tag
    if (npc.coreInterests.includes(playerBill.antiTag)) {
      score -= 10;
    }

    // Seniority penalty
    if (npc.seniority === 2) score -= 1;
    else if (npc.seniority === 3) score -= 3;
    else if (npc.seniority === 4) score -= 5;
    else if (npc.seniority === 5) score -= 7;

    sentiment[npc.id] = clamp(score, -100, 100);
  }

  return sentiment;
}

function generateReportCards(
  factions: Faction[],
  parties: Party[],
  playerBill: Bill,
): ReportCard[] {
  const cards: ReportCard[] = [];

  // Faction report cards
  for (const faction of factions) {
    // Determine phantom vote alignment
    // Check if player's bill aligns or conflicts with this faction
    let phantomCorrect = 1; // default neutral prior: 1/2
    const billProMatches = playerBill.proTags.some(t =>
      t === faction.majorPro || t === faction.minorPro
    );
    const billAntiMatches = playerBill.antiTag === faction.majorAnti;
    const billConflicts = playerBill.proTags.some(t =>
      t === faction.majorAnti || t === faction.minorAnti
    ) || playerBill.antiTag === faction.majorPro;

    if (billProMatches || billAntiMatches) {
      phantomCorrect = 2; // aligned: 2/2
    } else if (billConflicts) {
      phantomCorrect = 0; // conflicting: 0/2
    }

    cards.push({
      entityId: faction.id,
      entityType: 'faction',
      entityName: faction.name,
      correctVotes: phantomCorrect,
      totalVotes: 2,
      phantomCorrect,
      phantomTotal: 2,
      grade: getGradeFromPercentage(phantomCorrect / 2 * 100),
      percentage: (phantomCorrect / 2) * 100,
      isPublished: false, // need 3+ real votes
    });
  }

  // Party report cards
  for (const party of parties) {
    cards.push({
      entityId: party.name,
      entityType: 'party',
      entityName: party.name === 'feralist' ? 'Feralist Party' : 'Communalist Party',
      correctVotes: 1,
      totalVotes: 2,
      phantomCorrect: 1,
      phantomTotal: 2,
      grade: 'c',
      percentage: 50,
      isPublished: false,
    });
  }

  // President report card
  cards.push({
    entityId: 'president',
    entityType: 'president',
    entityName: 'President Gold',
    correctVotes: 1,
    totalVotes: 2,
    phantomCorrect: 1,
    phantomTotal: 2,
    grade: 'c',
    percentage: 50,
    isPublished: false,
  });

  return cards;
}

function getGradeFromPercentage(pct: number): import('./types').ReportCardGrade {
  if (pct >= 95) return 'a_plus';
  if (pct >= 85) return 'a';
  if (pct >= 75) return 'b';
  if (pct >= 65) return 'c';
  if (pct >= 50) return 'd';
  return 'f';
}

// ── District generation for the player ──
export function generatePlayerDistrict(
  rng: () => number,
  playerBillProTags: [Issue, Issue],
): District {
  // District shares 1 pro-tag with the player's bill
  const sharedTag = pick(rng, playerBillProTags);
  const otherInterest = pick(rng,
    ALL_ISSUES.filter(i =>
      i !== sharedTag && i !== 'rules_procedures' && i !== 'budget'
    )
  );
  const hostility = pick(rng,
    ALL_ISSUES.filter(i =>
      i !== sharedTag && i !== otherInterest && i !== 'rules_procedures' && i !== 'budget'
    )
  );

  return {
    strongInterests: [sharedTag, otherInterest],
    hostility,
  };
}
