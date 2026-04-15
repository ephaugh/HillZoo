/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Core Type System
   All game types. Components import from here.
   ═══════════════════════════════════════════════════════════ */

// ── Issues ──
export const COMMITTEE_ISSUES = [
  'agriculture_foraging',
  'habitat_burrows',
  'migration_transit',
  'predation_defense',
  'freshwater_marine',
  'environment_conservation',
  'rules_procedures',
  'budget',
] as const;

export const CROSS_CUTTING_ISSUES = [
  'bananas',
  'nocturnal_affairs',
  'interspecies_relations',
  'trade_commerce',
  'public_wellness',
  'youth_offspring',
] as const;

export const ALL_ISSUES = [...COMMITTEE_ISSUES, ...CROSS_CUTTING_ISSUES] as const;

export type Issue = (typeof ALL_ISSUES)[number];
export type CommitteeIssue = (typeof COMMITTEE_ISSUES)[number];
export type CrossCuttingIssue = (typeof CROSS_CUTTING_ISSUES)[number];

export const ISSUE_LABELS: Record<Issue, string> = {
  agriculture_foraging: 'Agriculture & Foraging',
  habitat_burrows: 'Habitat & Burrows',
  migration_transit: 'Migration & Transit',
  predation_defense: 'Predation & Defense',
  freshwater_marine: 'Freshwater & Marine',
  environment_conservation: 'Environment & Conservation',
  rules_procedures: 'Rules & Procedures',
  budget: 'Budget',
  bananas: 'Bananas',
  nocturnal_affairs: 'Nocturnal Affairs',
  interspecies_relations: 'Interspecies Relations',
  trade_commerce: 'Trade & Commerce',
  public_wellness: 'Public Wellness',
  youth_offspring: 'Youth & Offspring',
};

// Secondary referral mapping for cross-cutting issues
export const CROSS_CUTTING_REFERRAL: Record<CrossCuttingIssue, CommitteeIssue> = {
  bananas: 'agriculture_foraging',
  nocturnal_affairs: 'habitat_burrows',
  interspecies_relations: 'predation_defense',
  trade_commerce: 'budget',
  public_wellness: 'environment_conservation',
  youth_offspring: 'habitat_burrows',
};

// ── Enums & Literal Unions ──
export type Temperature = 'hot' | 'lukewarm' | 'cold';
export type Slot = 'morning' | 'afternoon' | 'evening';
export type SentimentTier = 'hostile' | 'cold' | 'neutral' | 'warm' | 'allied';
export type PartyStandingTier = 'insider' | 'good_standing' | 'thin_ice' | 'outcast';
export type BillStage = 'referral' | 'hearing' | 'markup' | 'budget' | 'queue' | 'floor' | 'president' | 'law' | 'dead';
export type PartyName = 'feralist' | 'communalist';
export type IssueStance = 'positive' | 'neutral' | 'negative';
export type BillTagType = 'pro' | 'anti';

// INTERNAL ONLY — never exposed to player-facing UI
export type Temperament = 'ideologue' | 'follower' | 'dealmaker' | 'opportunist';

export type PartyBalanceSetting = 'large_majority' | 'slim_majority' | 'slim_minority' | 'large_minority';

export type PrimaryDate = 'early' | 'late';

export type BurdenRating = 'lean' | 'routine' | 'heavy' | 'bloated';

export type PresidentialSignal = 'will_sign' | 'likely_sign' | 'unknown' | 'may_veto' | 'will_veto';

export type ReportCardGrade = 'a_plus' | 'a' | 'b' | 'c' | 'd' | 'f';

// ── Species ──
export const SPECIES_LIST = [
  'Fox', 'Owl', 'Bear', 'Rabbit', 'Deer', 'Eagle', 'Wolf', 'Turtle',
  'Raccoon', 'Hawk', 'Beaver', 'Otter', 'Crow', 'Badger', 'Moose',
  'Lynx', 'Salmon', 'Heron', 'Rattlesnake', 'Coyote', 'Porcupine',
  'Frog', 'Skunk', 'Armadillo',
] as const;

export type Species = (typeof SPECIES_LIST)[number];

// ── NPC ──
export interface NPC {
  id: string;
  name: string;
  species: Species;
  party: PartyName;
  seniority: number; // 1–5
  district: District;
  coreInterests: [Issue, Issue];
  flexibleInterests: Issue[];
  temperament: Temperament;
  issueStances: Record<Issue, IssueStance>;
  committeeMemberships: string[]; // committee IDs
  hasActiveBill: boolean;
  activeBill: string | null; // bill ID
  primaryDate: PrimaryDate;
  primaryThreat: number;
  primarySurvived: boolean;
  isLameDuck: boolean;
  sentimentBaseline: number; // starting sentiment (decay target)
}

// ── District ──
export interface District {
  strongInterests: [Issue, Issue];
  hostility: Issue;
}

// ── Bill ──
export interface BillTag {
  issue: Issue;
  type: BillTagType;
}

export interface Bill {
  id: string;
  number: number; // 1–99
  name: string; // max 30 chars
  proTags: [Issue, Issue];
  antiTag: Issue;
  author: string; // NPC id or 'player'
  stage: BillStage;
  cosponsors: string[]; // NPC IDs
  amendmentHistory: Amendment[];
  momentum: number; // 0–100 for NPC bills
  burdenRating: BurdenRating | null;
  burdenScore: number | null;
}

export interface Amendment {
  id: string;
  proposer: string; // NPC id
  type: 'add_pro' | 'add_anti' | 'remove' | 'flip';
  targetIssue: Issue;
  newIssue?: Issue; // for flip
  passed: boolean;
  day: number;
}

// ── Faction ──
export interface Faction {
  id: string;
  name: string;
  majorPro: Issue;
  majorAnti: Issue;
  minorPro: Issue;
  minorAnti: Issue;
  treasury: number;
  isBananaLobby: boolean;
  hiddenTriggerIssues: Issue[];
}

// ── Committee ──
export interface Committee {
  id: string;
  name: string;
  issue: CommitteeIssue;
  members: string[]; // NPC IDs
  chair: string; // NPC ID
  hearingSlots: number;
}

// ── Party ──
export interface Party {
  name: PartyName;
  agenda: Partial<Record<Issue, 'pro' | 'anti'>>;
  memberIds: string[];
  whipId: string;
  majorityLeaderId: string;
  speakerId: string | null; // majority party only
}

// ── Player ──
export interface PlayerState {
  species: Species;
  party: PartyName;
  sliderPosition: number; // 0–100, 0=full loyalist, 100=full pragmatist
  bill: Bill;
  district: District;
  committees: string[]; // committee IDs
}

// ── President ──
export interface PresidentState {
  party: PartyName;
  stances: Record<Issue, number>; // -2 to +2
  publicStances: Issue[]; // which stances are public
  approvalRating: number; // 0–100, starts 50
}

// ── Report Card ──
export interface ReportCard {
  entityId: string; // faction/party/president id
  entityType: 'faction' | 'party' | 'president';
  entityName: string;
  correctVotes: number;
  totalVotes: number; // includes phantom votes
  phantomCorrect: number;
  phantomTotal: number;
  grade: ReportCardGrade;
  percentage: number;
  isPublished: boolean; // true when 3+ real votes tracked
}

// ── Schedule ──
export interface ScheduleEntry {
  day: number;
  slot: Slot;
  type: 'open' | 'meeting' | 'committee_hearing' | 'committee_markup' |
        'floor_vote' | 'caucus' | 'primary' | 'presidential' | 'campaign' |
        'fundraiser' | 'quick_interaction' | 'travel';
  label: string;
  npcId?: string;
  billId?: string;
  mandatory: boolean;
}

export interface MandatoryEvent {
  day: number;
  slot: Slot;
  type: string;
  label: string;
  billId?: string;
}

// ── Gossip ──
export interface GossipEntry {
  id: string;
  day: number;
  text: string;
  source: string;
  quality: 'minimal' | 'basic' | 'standard' | 'good' | 'excellent';
  relatedNpcIds: string[];
  relatedBillIds: string[];
}

// ── Promise ──
export interface GamePromise {
  id: string;
  day: number;
  npcId: string;
  description: string;
  type: 'vote_yes' | 'vote_no' | 'cosponsor' | 'campaign' | 'amendment' | 'other';
  billId?: string;
  fulfilled: boolean | null; // null = pending
  dueBy?: number; // day
}

// ── Vote Record ──
export interface VoteRecord {
  day: number;
  billId: string;
  billName: string;
  votes: Record<string, 'yes' | 'no' | 'abstain'>; // npcId/player → vote
  passed: boolean;
  type: 'committee' | 'floor' | 'amendment' | 'override';
}

// ── Headline ──
export interface Headline {
  id: string;
  day: number;
  text: string;
  type: 'bombshell' | 'minor';
  temperatureShifts: { issue: Issue; direction: 'up' | 'down' }[];
  rippleEffects: string[];
}

// ── Known Information ──
export interface KnownInformation {
  revealedNpcInterests: Record<string, Issue[]>; // npcId → discovered interests
  revealedPresidentialStances: Issue[];
  gossipHintedStances: Issue[];
  knownDeals: string[]; // deal IDs
  meetingCount: Record<string, number>; // npcId → times met
}

// ── Intel Log ──
// Persistent player-facing record of information gathered during the session.
// Max 100 entries; oldest entries purge by importance tier (LOW → MEDIUM → HIGH).
// Player's own bill intel NEVER purges.
export type IntelImportance = 'low' | 'medium' | 'high';

export type IntelSource =
  | 'meeting'           // gathered in a direct meeting
  | 'gallery_hearing'   // observed from committee gallery
  | 'floor_vote'        // observed during floor vote
  | 'caucus'            // caucus meeting
  | 'quick_interaction' // hallway/ambush/early-bird/lingerer
  | 'gossip'            // passed through gossip log
  | 'dawn_brief'        // shown in daily brief
  | 'player_bill';      // concerning the player's own bill (never purged)

export type IntelCategory =
  | 'npc_stance'        // an NPC's position on a policy / bill
  | 'npc_temperament'   // behavioral read (never labels temperament directly)
  | 'npc_concern'       // what an NPC cares about right now
  | 'npc_disposition'   // how an NPC feels about the player
  | 'npc_voting_lean'   // how an NPC is likely to vote
  | 'npc_primary_status'// stress from primary threat
  | 'bill_support'      // cosponsor / whip read on a bill
  | 'bill_status'       // committee / floor status
  | 'deal'              // NPC-to-NPC deal observed
  | 'committee_read';   // committee disposition on a bill

export interface IntelEntry {
  id: string;
  day: number;
  source: IntelSource;
  category: IntelCategory;
  importance: IntelImportance;
  headline: string;            // short summary shown in Intel Log list view (<= 80 chars)
  detail: string;              // full description for detail view
  relatedNpcIds: string[];     // NPCs this intel concerns
  relatedBillIds: string[];    // bills this intel concerns
  relatedIssues: Issue[];      // policy areas this intel concerns
  concernsPlayerBill: boolean; // if true, intel is pinned and never purges
}

// ── Leader Pressure Modifier ──
export interface LeaderPressureModifier {
  id: string;
  targetNpcId: string;
  billId: string;
  direction: 'yes' | 'no';
  pressureValue: number; // typically +8
  sourceLeaderId: string;
  day: number;
}

// ── Meeting Request (NPC-initiated) ──
export type MeetingRequestStatus = 'pending' | 'accepted' | 'declined' | 'ignored' | 'expired' | 'completed';

export type MeetingRequestPriority = 'urgent' | 'important' | 'casual';

export type MeetingRequestReason =
  | 'cosponsor_ask'    // NPC wants player to cosponsor their bill
  | 'vote_ask'         // NPC wants a vote commitment
  | 'deal_offer'       // NPC offering a trade
  | 'intel_share'      // NPC wants to share gossip/info
  | 'complaint'        // NPC unhappy about something
  | 'favor_request';   // NPC wants a favor (fundraiser, campaign help, etc.)

export interface MeetingRequest {
  id: string;
  npcId: string;
  reason: MeetingRequestReason;
  priority: MeetingRequestPriority;
  barkText: string;           // short line shown in Dawn Brief
  dayRequested: number;       // day the request was made
  expirationDay: number;      // request expires after this day (dayRequested + 3)
  status: MeetingRequestStatus;
  scheduledDay?: number;      // day meeting is booked for (if accepted)
  scheduledSlot?: Slot;
  sentimentApplied: boolean;  // whether accept/decline/ignore sentiment was already applied
}

// ── NPC Availability ──
export interface NpcAvailabilityWeek {
  npcId: string;
  weekNumber: number;         // 1-based week (days 1-5 = week 1, etc.)
  slots: { day: number; slot: Slot }[];  // available slots this week (4-6 for regular, 2-3 for leadership)
}

// ── NPC-to-NPC Deal ──
export interface NpcDeal {
  id: string;
  npc1: string;
  npc2: string;
  description: string;
  lockedVote: { billId: string; vote: 'yes' | 'no' } | null;
  day: number;
  discovered: boolean;
}

// ── The Full Game State ──
export interface GameState {
  // Meta
  version: string;
  seed: number;
  createdAt: string;

  // Player
  player: PlayerState;
  warChest: number;
  primaryThreat: number;
  primaryDate: PrimaryDate;
  primarySurvived: boolean;
  isLameDuck: boolean;
  partyStanding: PartyStandingTier;

  // Calendar
  currentDay: number; // 1–60
  currentSlot: Slot;
  schedule: ScheduleEntry[];
  mandatoryEvents: MandatoryEvent[];

  // Congress
  npcs: NPC[];
  factions: Faction[];
  committees: Committee[];
  parties: [Party, Party]; // [feralist, communalist]

  // Bills
  playerBill: Bill;
  npcBills: Bill[];

  // Relationships
  sentiment: Record<string, number>; // npcId → sentiment score (-100 to +100)
  npcSentiment: Record<string, Record<string, number>>; // npcId → npcId → score
  promises: GamePromise[];

  // Report Cards
  reportCards: ReportCard[];

  // Issues & Headlines
  issueTemperatures: Record<Issue, Temperature>;
  permanentHotIssue: Issue;
  headlineHistory: Headline[];
  nextBombshellDay: number;

  // President
  president: PresidentState;

  // Information
  gossipLog: GossipEntry[];
  knownInfo: KnownInformation;
  intelLog: IntelEntry[];

  // NPC deals
  npcDeals: NpcDeal[];

  // NPC-initiated meeting requests
  meetingRequests: MeetingRequest[];

  // NPC weekly availability (regenerated each week)
  npcAvailability: NpcAvailabilityWeek[];

  // Scoring
  voteHistory: VoteRecord[];

  // Leader pressure modifiers (from LEAN ON A MEMBER verb)
  leaderPressureModifiers: LeaderPressureModifier[];

  // Party balance setting (for reference)
  partyBalance: PartyBalanceSetting;
}

// ── Creation State (accumulated during creation flow, not persisted) ──
export interface CreationState {
  species: Species | null;
  party: PartyName | null;
  sliderPosition: number;
  partyBalance: PartyBalanceSetting;
  billProTags: [Issue | null, Issue | null];
  billAntiTag: Issue | null;
  billNumber: number | null;
  billName: string;
  primaryDate: PrimaryDate | null;
  district: District | null;
  rerollUsed: boolean;
  // Generated during creation
  feralistAgenda: Partial<Record<Issue, 'pro' | 'anti'>>;
  communalistAgenda: Partial<Record<Issue, 'pro' | 'anti'>>;
  seed: number;
}
