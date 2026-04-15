/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Turn Processor
   Runs at slot and day transitions to drive all background
   game systems. Pure TypeScript — no Svelte imports.
   ═══════════════════════════════════════════════════════════ */

import type {
  GameState, NPC, Bill, Issue, Temperature, GossipEntry,
  Headline, ScheduleEntry, Slot, ReportCard, ReportCardGrade,
  MandatoryEvent, NpcDeal, MeetingRequest, MeetingRequestReason,
  MeetingRequestPriority, NpcAvailabilityWeek,
} from './types';
import { ALL_ISSUES, ISSUE_LABELS, COMMITTEE_ISSUES, CROSS_CUTTING_REFERRAL, type CommitteeIssue, type CrossCuttingIssue } from './types';
import { createRng, pick, pickN, clamp, generateId, randomInt, getSentimentTier, shuffle, weightedRandom } from './utils';
import { decaySentiment } from './sentiment';
import { getWeek, getDayOfWeek, getPhase, getCommitteeForSlot } from './calendar';

// ══════════════════════════════════════════════════════════════
// MAIN ENTRY POINTS
// ══════════════════════════════════════════════════════════════

/**
 * Process everything that happens when a slot ends.
 * Called BEFORE the slot advances.
 */
export function processSlotEnd(state: GameState): GameState {
  let s = { ...state };
  const rng = createRng(s.seed + s.currentDay * 1000 + slotIndex(s.currentSlot) * 100);

  // Track that this slot was used (for campaign-per-week tracking)
  // Quick interaction chance (~30% on non-morning slots after day 3)
  if (s.currentDay > 3 && s.currentSlot !== 'morning' && rng() < 0.3) {
    s = maybeGenerateQuickInteraction(s, rng);
  }

  return s;
}

/**
 * Process everything that happens at the start of a new day.
 * Called when transitioning from evening to the next day's morning.
 */
export function processNewDay(state: GameState): GameState {
  let s = { ...state };
  const day = s.currentDay;
  const rng = createRng(s.seed + day * 7777);

  // ── Daily processing ──
  s = processPlayerBill(s, rng);
  s = processGossip(s, rng);
  s = processNpcMeetingRequests(s, rng);
  s = scheduleUpcomingEvents(s, rng);
  s = checkPromises(s);

  // ── Weekly processing (every 5 days, on day 1 of each week) ──
  if (getDayOfWeek(day) === 1 && day > 1) {
    s = processWeeklyTick(s, rng);
  }

  // ── Generate initial availability on day 1 ──
  if (day === 1 && s.npcAvailability.length === 0) {
    s = generateNpcAvailability(s, rng);
  }

  // ── Headline check ──
  s = processHeadlines(s, rng);

  // ── NPC bill advancement (every 5 days) ──
  if (day % 5 === 0 && day > 1) {
    s = processNpcBillAdvancement(s, rng);
  }

  // ── Presidential approval drift ──
  if (day % 10 === 0) {
    s = processPresidentialDrift(s);
  }

  return s;
}

// ══════════════════════════════════════════════════════════════
// WEEKLY TICK (sentiment decay, report cards, whip, payouts)
// ══════════════════════════════════════════════════════════════

function processWeeklyTick(state: GameState, rng: () => number): GameState {
  let s = { ...state };

  // Sentiment decay toward baseline
  s = {
    ...s,
    sentiment: decaySentiment(s.sentiment, s.npcs, s.player.party),
  };

  // Whip sentiment drift toward grade target
  s = processWhipDrift(s);

  // Update report card grades before processing consequences
  s = updateReportCards(s);

  // Report card payouts and attacks
  s = processReportCardConsequences(s);

  // Check for zero-campaign week
  s = checkCampaignNeglect(s, rng);

  // NPC-to-NPC deal generation
  s = generateNpcDeals(s, rng);

  // Regenerate NPC availability for the new week
  s = generateNpcAvailability(s, rng);

  return s;
}

// ══════════════════════════════════════════════════════════════
// WHIP SENTIMENT DRIFT
// ══════════════════════════════════════════════════════════════

function processWhipDrift(state: GameState): GameState {
  const playerPartyObj = state.parties.find(p => p.name === state.player.party);
  if (!playerPartyObj) return state;

  const whipId = playerPartyObj.whipId;
  const partyCard = state.reportCards.find(
    rc => rc.entityType === 'party' && rc.entityId === state.player.party
  );
  if (!partyCard) return state;

  // Grade-determined target
  const gradeTargets: Record<ReportCardGrade, number> = {
    a_plus: 50, a: 30, b: 10, c: -20, d: -40, f: -60,
  };
  const target = gradeTargets[partyCard.grade];
  const current = state.sentiment[whipId] ?? 0;

  // Drift 5 points per week toward target
  let newSentiment = current;
  if (current < target) {
    newSentiment = Math.min(target, current + 5);
  } else if (current > target) {
    newSentiment = Math.max(target, current - 5);
  }

  return {
    ...state,
    sentiment: { ...state.sentiment, [whipId]: newSentiment },
  };
}

// ══════════════════════════════════════════════════════════════
// REPORT CARD UPDATE (recalculate grades from vote tallies)
// ══════════════════════════════════════════════════════════════

export function updateReportCards(state: GameState): GameState {
  const updatedCards = state.reportCards.map(card => {
    const pct = card.totalVotes > 0 ? (card.correctVotes / card.totalVotes) * 100 : 0;
    const realVotes = card.totalVotes - card.phantomTotal;
    const isPublished = realVotes >= 3;
    return {
      ...card,
      percentage: pct,
      grade: getGradeFromPercentage(pct),
      isPublished,
    };
  });
  return { ...state, reportCards: updatedCards };
}

function getGradeFromPercentage(pct: number): ReportCardGrade {
  if (pct >= 95) return 'a_plus';
  if (pct >= 85) return 'a';
  if (pct >= 75) return 'b';
  if (pct >= 65) return 'c';
  if (pct >= 50) return 'd';
  return 'f';
}

// ══════════════════════════════════════════════════════════════
// REPORT CARD VOTE RECORDING
// ══════════════════════════════════════════════════════════════

/**
 * Record a player vote on a bill for all report cards.
 * Called when a floor vote or committee vote happens.
 * playerVotedYes = did the player vote in favor of the bill?
 */
export function recordVoteForReportCards(
  state: GameState,
  bill: Bill,
  playerVotedYes: boolean,
): GameState {
  const updatedCards = state.reportCards.map(card => {
    let isCorrect = false;

    if (card.entityType === 'faction') {
      const faction = state.factions.find(f => f.id === card.entityId);
      if (!faction) return card;

      // Does the bill align with this faction's priorities?
      const billAligns = bill.proTags.some(t =>
        t === faction.majorPro || t === faction.minorPro
      ) || bill.antiTag === faction.majorAnti;

      const billConflicts = bill.proTags.some(t =>
        t === faction.majorAnti || t === faction.minorAnti
      ) || bill.antiTag === faction.majorPro;

      // Faction wants yes if bill aligns, no if bill conflicts
      if (billAligns) {
        isCorrect = playerVotedYes;
      } else if (billConflicts) {
        isCorrect = !playerVotedYes;
      } else {
        // Neutral bill — no opinion, skip this faction
        return card;
      }
    } else if (card.entityType === 'party') {
      const party = state.parties.find(p => p.name === card.entityId);
      if (!party) return card;

      // Does the bill align with the party agenda?
      const partyPro = bill.proTags.some(t => party.agenda[t] === 'pro');
      const partyAnti = bill.proTags.some(t => party.agenda[t] === 'anti');

      if (partyPro) {
        isCorrect = playerVotedYes;
      } else if (partyAnti) {
        isCorrect = !playerVotedYes;
      } else {
        // No party position on this bill
        return card;
      }
    } else if (card.entityType === 'president') {
      // Check president's stance on the bill's issues
      let stanceSum = 0;
      for (const tag of bill.proTags) {
        stanceSum += state.president.stances[tag] ?? 0;
      }
      if (stanceSum > 0) {
        isCorrect = playerVotedYes;
      } else if (stanceSum < 0) {
        isCorrect = !playerVotedYes;
      } else {
        // President is neutral
        return card;
      }
    }

    return {
      ...card,
      correctVotes: card.correctVotes + (isCorrect ? 1 : 0),
      totalVotes: card.totalVotes + 1,
    };
  });

  return { ...state, reportCards: updatedCards };
}

// ══════════════════════════════════════════════════════════════
// REPORT CARD CONSEQUENCES (weekly payouts & primary attacks)
// ══════════════════════════════════════════════════════════════

function processReportCardConsequences(state: GameState): GameState {
  let warChestDelta = 0;
  let primaryDelta = 0;

  for (const card of state.reportCards) {
    if (!card.isPublished) continue;

    if (card.entityType === 'faction') {
      const faction = state.factions.find(f => f.id === card.entityId);
      const isBanana = faction?.isBananaLobby ?? false;

      // Payouts (positive grades)
      if (isBanana) {
        if (card.grade === 'a_plus') warChestDelta += 650;
        else if (card.grade === 'a') warChestDelta += 400;
      } else {
        if (card.grade === 'a_plus') warChestDelta += 250;
        else if (card.grade === 'a') warChestDelta += 150;
      }

      // Attacks (negative grades -> primary threat)
      if (isBanana) {
        if (card.grade === 'c') primaryDelta += 5;
        else if (card.grade === 'd') primaryDelta += 8;
        else if (card.grade === 'f') primaryDelta += 12;
      } else {
        if (card.grade === 'c') primaryDelta += 2;
        else if (card.grade === 'd') primaryDelta += 4;
        else if (card.grade === 'f') primaryDelta += 6;
      }
    } else if (card.entityType === 'party' && card.entityId === state.player.party) {
      // Own party payouts
      if (card.grade === 'a_plus') warChestDelta += 500;
      else if (card.grade === 'a') warChestDelta += 300;

      // Own party attacks
      if (card.grade === 'c') primaryDelta += 4;
      else if (card.grade === 'd') primaryDelta += 7;
      else if (card.grade === 'f') primaryDelta += 10;
    } else if (card.entityType === 'president') {
      if (card.grade === 'a_plus') warChestDelta += 500;
      else if (card.grade === 'a') warChestDelta += 300;
    }
  }

  return {
    ...state,
    warChest: state.warChest + warChestDelta,
    primaryThreat: clamp(state.primaryThreat + primaryDelta, 0, 100),
  };
}

// ══════════════════════════════════════════════════════════════
// CAMPAIGN NEGLECT CHECK
// ══════════════════════════════════════════════════════════════

function checkCampaignNeglect(state: GameState, rng: () => number): GameState {
  // Check if player campaigned this past week
  const week = getWeek(state.currentDay);
  const weekStart = (week - 1) * 5 + 1;
  const weekEnd = week * 5;

  const campaignedThisWeek = state.schedule.some(
    e => e.day >= weekStart && e.day <= weekEnd && e.type === 'campaign'
  );

  if (!campaignedThisWeek && !state.primarySurvived) {
    // +3 for one week, +5 for two consecutive
    const prevWeekStart = weekStart - 5;
    const campaignedLastWeek = state.schedule.some(
      e => e.day >= prevWeekStart && e.day < weekStart && e.type === 'campaign'
    );

    const penalty = campaignedLastWeek ? 3 : 5;
    return {
      ...state,
      primaryThreat: clamp(state.primaryThreat + penalty, 0, 100),
    };
  }

  return state;
}

// ══════════════════════════════════════════════════════════════
// NPC-TO-NPC DEAL GENERATION (weekly)
// ══════════════════════════════════════════════════════════════

/**
 * Generate NPC-to-NPC deals. Frequency depends on session phase:
 * Opening (1-3): 1-2, Ramp-Up (4-6): 2-3, Peak (7-9): 3-4, Crunch (10-12): 2-3
 * Each deal locks one vote on a specific bill.
 * Deals are hidden by default, discoverable through gossip.
 */
function generateNpcDeals(state: GameState, rng: () => number): GameState {
  const phase = getPhase(state.currentDay);

  // Deals per week based on phase
  const dealCounts: Record<string, [number, number]> = {
    opening: [1, 2],
    ramp_up: [2, 3],
    peak: [3, 4],
    crunch: [2, 3],
  };
  const [min, max] = dealCounts[phase] ?? [1, 2];
  const count = randomInt(rng, min, max);

  const activeBills = state.npcBills.filter(b =>
    b.stage !== 'dead' && b.stage !== 'law'
  );
  if (activeBills.length === 0) return state;

  const newDeals: NpcDeal[] = [];

  for (let i = 0; i < count; i++) {
    // Pick a bill
    const bill = pick(rng, activeBills);
    const author = state.npcs.find(n => n.id === bill.author);
    if (!author) continue;

    // Pick a partner NPC — prefer same party, not already in a deal for this bill
    const existingDealNpcs = new Set(
      state.npcDeals
        .filter(d => d.lockedVote?.billId === bill.id)
        .flatMap(d => [d.npc1, d.npc2])
    );
    const candidates = state.npcs.filter(n =>
      n.id !== author.id &&
      !existingDealNpcs.has(n.id) &&
      // Dealmakers are 2x more likely to be in deals
      (n.temperament === 'dealmaker' ? true : rng() > 0.4)
    );
    if (candidates.length === 0) continue;

    const partner = pick(rng, candidates);

    // Determine vote direction — partner votes yes on author's bill
    const deal: NpcDeal = {
      id: generateId('deal'),
      npc1: author.id,
      npc2: partner.id,
      description: `${author.name.toUpperCase()} AND ${partner.name.toUpperCase()} AGREED ON ${bill.name.toUpperCase()}`,
      lockedVote: { billId: bill.id, vote: 'yes' },
      day: state.currentDay,
      discovered: false,
    };

    newDeals.push(deal);

    // Also adjust NPC-to-NPC sentiment (+5 between deal partners)
    // This is tracked in npcSentiment but we don't need to implement
    // that full system right now — the deal lock is the important part
  }

  if (newDeals.length === 0) return state;

  return {
    ...state,
    npcDeals: [...state.npcDeals, ...newDeals],
  };
}

// ══════════════════════════════════════════════════════════════
// GOSSIP GENERATION (daily, 1-2 items)
// ══════════════════════════════════════════════════════════════

function processGossip(state: GameState, rng: () => number): GameState {
  // Quality based on average sentiment
  const avgSentiment = state.npcs.reduce((sum, n) => sum + (state.sentiment[n.id] ?? 0), 0) / state.npcs.length;
  const quality =
    avgSentiment < -10 ? 'minimal' as const :
    avgSentiment < 6 ? 'basic' as const :
    avgSentiment < 16 ? 'standard' as const :
    avgSentiment < 26 ? 'good' as const :
    'excellent' as const;

  // Generate 1-2 gossip items
  const count = randomInt(rng, 1, 2);
  const newGossip: GossipEntry[] = [];

  for (let i = 0; i < count; i++) {
    const gossip = generateGossipItem(state, rng, quality);
    if (gossip) newGossip.push(gossip);
  }

  if (newGossip.length === 0) return state;

  // Rolling 15-item log
  const updatedLog = [...newGossip, ...state.gossipLog].slice(0, 15);

  return { ...state, gossipLog: updatedLog };
}

function generateGossipItem(
  state: GameState,
  rng: () => number,
  quality: GossipEntry['quality'],
): GossipEntry | null {
  const templates = getGossipTemplates(state, rng, quality);
  if (templates.length === 0) return null;

  const template = pick(rng, templates);
  return {
    id: generateId('gos'),
    day: state.currentDay,
    text: template.text,
    source: template.source,
    quality,
    relatedNpcIds: template.npcIds,
    relatedBillIds: template.billIds,
  };
}

interface GossipTemplate {
  text: string;
  source: string;
  npcIds: string[];
  billIds: string[];
}

function getGossipTemplates(state: GameState, rng: () => number, quality: GossipEntry['quality']): GossipTemplate[] {
  const templates: GossipTemplate[] = [];
  const npcs = state.npcs;

  // NPC bill movement
  const activeBills = state.npcBills.filter(b => b.stage !== 'dead' && b.stage !== 'law');
  if (activeBills.length > 0) {
    const bill = pick(rng, activeBills);
    const author = npcs.find(n => n.id === bill.author);
    if (author) {
      templates.push({
        text: `${author.name.toUpperCase()}'S BILL IS ${bill.momentum > 40 ? 'GAINING TRACTION' : 'STRUGGLING FOR SUPPORT'}.`,
        source: 'HALLWAY CHATTER',
        npcIds: [author.id],
        billIds: [bill.id],
      });
    }
  }

  // NPC-to-NPC deal hint
  if (state.npcDeals.length > 0) {
    const deal = pick(rng, state.npcDeals);
    if (!deal.discovered) {
      const npc1 = npcs.find(n => n.id === deal.npc1);
      const npc2 = npcs.find(n => n.id === deal.npc2);
      if (npc1 && npc2) {
        templates.push({
          text: `${npc1.name.toUpperCase()} AND ${npc2.name.toUpperCase()} HAVE BEEN MEETING PRIVATELY.`,
          source: 'AIDE OVERHEARD',
          npcIds: [npc1.id, npc2.id],
          billIds: [],
        });
      }
    }
  }

  // Sentiment-based gossip
  const warmNpcs = npcs.filter(n => getSentimentTier(state.sentiment[n.id] ?? 0) === 'warm');
  const coldNpcs = npcs.filter(n => getSentimentTier(state.sentiment[n.id] ?? 0) === 'cold');

  if (warmNpcs.length > 0) {
    const npc = pick(rng, warmNpcs);
    templates.push({
      text: `${npc.name.toUpperCase()} HAS BEEN SPEAKING FAVORABLY ABOUT YOUR WORK.`,
      source: 'COMMITTEE STAFFER',
      npcIds: [npc.id],
      billIds: [],
    });
  }

  if (coldNpcs.length > 0 && quality !== 'minimal') {
    const npc = pick(rng, coldNpcs);
    templates.push({
      text: `${npc.name.toUpperCase()} IS NOT HAPPY WITH THE DIRECTION OF YOUR LEGISLATION.`,
      source: 'PRESS GALLERY',
      npcIds: [npc.id],
      billIds: [],
    });
  }

  // Committee activity
  if (quality === 'good' || quality === 'excellent') {
    const committee = pick(rng, state.committees);
    const chair = npcs.find(n => n.id === committee.chair);
    if (chair) {
      templates.push({
        text: `THE ${committee.name.toUpperCase()} COMMITTEE IS ${rng() > 0.5 ? 'BUSY THIS WEEK' : 'EXPECTED TO SCHEDULE HEARINGS SOON'}.`,
        source: 'COMMITTEE CLERK',
        npcIds: [chair.id],
        billIds: [],
      });
    }
  }

  // Presidential hint (good/excellent quality only)
  if ((quality === 'good' || quality === 'excellent') && state.president.publicStances.length < ALL_ISSUES.length) {
    const hidden = ALL_ISSUES.filter(i => !state.president.publicStances.includes(i));
    if (hidden.length > 0) {
      const issue = pick(rng, hidden);
      const stance = state.president.stances[issue];
      const hint = stance > 0 ? 'SYMPATHETIC TO' : stance < 0 ? 'SKEPTICAL OF' : 'UNDECIDED ON';
      templates.push({
        text: `THE PRESIDENT MAY BE ${hint} ${ISSUE_LABELS[issue].toUpperCase()} LEGISLATION.`,
        source: 'WHITE HOUSE LIAISON',
        npcIds: [],
        billIds: [],
      });
    }
  }

  // Primary threat gossip
  if (quality !== 'minimal') {
    const threatenedNpcs = npcs.filter(n => n.primaryThreat > 40 && !n.primarySurvived && !n.isLameDuck);
    if (threatenedNpcs.length > 0) {
      const npc = pick(rng, threatenedNpcs);
      templates.push({
        text: `${npc.name.toUpperCase()} IS FACING A SERIOUS PRIMARY CHALLENGE.`,
        source: 'CAMPAIGN TRACKER',
        npcIds: [npc.id],
        billIds: [],
      });
    }
  }

  return templates;
}

// ══════════════════════════════════════════════════════════════
// HEADLINE GENERATION
// ══════════════════════════════════════════════════════════════

function processHeadlines(state: GameState, rng: () => number): GameState {
  let s = { ...state };

  // Bombshell check
  if (s.currentDay >= s.nextBombshellDay) {
    s = generateBombshell(s, rng);
    // Schedule next bombshell ~12 days later
    s = { ...s, nextBombshellDay: s.currentDay + randomInt(rng, 10, 14) };
  }

  // Minor headline chance (30% per day between bombshells)
  if (rng() < 0.3 && s.currentDay > 2) {
    s = generateMinorHeadline(s, rng);
  }

  return s;
}

function generateBombshell(state: GameState, rng: () => number): GameState {
  // Pick an issue to heat up and one to cool down
  const fluctuating = ALL_ISSUES.filter(i =>
    i !== 'rules_procedures' && i !== 'budget' &&
    i !== state.permanentHotIssue
  );

  const coolable = fluctuating.filter(i => state.issueTemperatures[i] !== 'cold');
  const heatable = fluctuating.filter(i => state.issueTemperatures[i] !== 'hot');

  const heatIssue = heatable.length > 0 ? pick(rng, heatable) : null;
  const coolIssue = coolable.length > 0 ? pick(rng, coolable.filter(i => i !== heatIssue)) : null;

  const shifts: { issue: Issue; direction: 'up' | 'down' }[] = [];
  const newTemps = { ...state.issueTemperatures };

  if (heatIssue) {
    shifts.push({ issue: heatIssue, direction: 'up' });
    const current = newTemps[heatIssue];
    if (current === 'cold') newTemps[heatIssue] = 'lukewarm';
    else if (current === 'lukewarm') newTemps[heatIssue] = 'hot';
  }
  if (coolIssue) {
    shifts.push({ issue: coolIssue, direction: 'down' });
    const current = newTemps[coolIssue];
    if (current === 'hot') newTemps[coolIssue] = 'lukewarm';
    else if (current === 'lukewarm') newTemps[coolIssue] = 'cold';
  }

  const bombshellTexts = [
    `BREAKING: MAJOR DEVELOPMENTS IN ${heatIssue ? ISSUE_LABELS[heatIssue].toUpperCase() : 'POLICY'} SHAKE THE CHAMBER.`,
    `SCANDAL ERUPTS OVER ${heatIssue ? ISSUE_LABELS[heatIssue].toUpperCase() : 'LEGISLATION'} AS PUBLIC OUTRAGE GROWS.`,
    `CRISIS IN ${heatIssue ? ISSUE_LABELS[heatIssue].toUpperCase() : 'THE CAPITAL'} FORCES LAWMAKERS TO RESPOND.`,
    `BOMBSHELL REPORT REVEALS NEW STAKES IN ${heatIssue ? ISSUE_LABELS[heatIssue].toUpperCase() : 'ONGOING DEBATE'}.`,
  ];

  const headline: Headline = {
    id: generateId('hdl'),
    day: state.currentDay,
    text: pick(rng, bombshellTexts),
    type: 'bombshell',
    temperatureShifts: shifts,
    rippleEffects: [],
  };

  return {
    ...state,
    issueTemperatures: newTemps,
    headlineHistory: [...state.headlineHistory, headline],
  };
}

function generateMinorHeadline(state: GameState, rng: () => number): GameState {
  const npc = pick(rng, state.npcs);
  const minorTexts = [
    `${npc.name.toUpperCase()} GIVES SPEECH ON ${ISSUE_LABELS[npc.coreInterests[0]].toUpperCase()}.`,
    `COMMITTEE HEARING DRAWS ATTENTION TO ${ISSUE_LABELS[pick(rng, ALL_ISSUES)].toUpperCase()}.`,
    `POLL SHOWS SHIFTING PUBLIC OPINION ON KEY LEGISLATION.`,
    `LOBBYISTS INCREASE SPENDING AHEAD OF CRITICAL VOTES.`,
    `PARTY LEADERSHIP MEETS BEHIND CLOSED DOORS.`,
  ];

  const headline: Headline = {
    id: generateId('hdl'),
    day: state.currentDay,
    text: pick(rng, minorTexts),
    type: 'minor',
    temperatureShifts: [],
    rippleEffects: [],
  };

  return {
    ...state,
    headlineHistory: [...state.headlineHistory, headline],
  };
}

// ══════════════════════════════════════════════════════════════
// PLAYER BILL ADVANCEMENT (daily check)
// ══════════════════════════════════════════════════════════════

function processPlayerBill(state: GameState, rng: () => number): GameState {
  const bill = state.playerBill;

  // Auto-advance referral → hearing after day 2 (bills get referred immediately,
  // then need a hearing scheduled by committee chair)
  if (bill.stage === 'referral' && state.currentDay >= 3) {
    return {
      ...state,
      playerBill: { ...bill, stage: 'hearing' },
    };
  }

  return state;
}

// ══════════════════════════════════════════════════════════════
// NPC BILL ADVANCEMENT (every 5 days)
// ══════════════════════════════════════════════════════════════

function processNpcBillAdvancement(state: GameState, rng: () => number): GameState {
  const updatedBills = state.npcBills.map(bill => {
    if (bill.stage === 'dead' || bill.stage === 'law') return bill;

    const author = state.npcs.find(n => n.id === bill.author);
    if (!author) return bill;

    // Author abandoned bill if primary threat > 70
    if (author.primaryThreat > 70) return { ...bill, stage: 'dead' as const };

    // Calculate momentum
    let momentum = bill.momentum;

    // Seniority bonus
    momentum += author.seniority * 8;

    // Party agenda alignment
    const authorParty = state.parties.find(p => p.name === author.party);
    if (authorParty) {
      const agendaAligned = bill.proTags.some(t => authorParty.agenda[t] === 'pro');
      const agendaConflict = bill.proTags.some(t => authorParty.agenda[t] === 'anti');
      if (agendaAligned) momentum += 10;
      if (agendaConflict) momentum -= 5;
    }

    // Cosponsor count
    momentum += Math.min(20, bill.cosponsors.length * 2);

    // Issue temperature
    for (const tag of bill.proTags) {
      const temp = state.issueTemperatures[tag];
      if (temp === 'hot') momentum += 10;
      else if (temp === 'cold') momentum -= 8;
    }

    // Random variance
    momentum += randomInt(rng, -10, 10);
    momentum = clamp(momentum, 0, 100);

    // Advancement thresholds
    let newStage = bill.stage;
    if (bill.stage === 'referral' && momentum >= 40) newStage = 'hearing';
    else if (bill.stage === 'hearing' && momentum >= 50) newStage = 'markup';
    else if (bill.stage === 'markup' && momentum >= 45) newStage = 'budget';
    else if (bill.stage === 'budget' && momentum >= 45) newStage = 'queue';
    else if (bill.stage === 'queue' && momentum >= 55) newStage = 'floor';

    // Attrition: bills with low momentum may die
    if (momentum < 15 && rng() < 0.3) newStage = 'dead';

    // Accumulate cosponsors
    let newCosponsors = [...bill.cosponsors];
    if (momentum > 30) {
      const rate = author.temperament === 'dealmaker' ? 1.5 : author.temperament === 'ideologue' ? 0.5 : 1;
      if (rng() < rate * 0.3) {
        const potential = state.npcs.filter(n =>
          n.id !== author.id && !newCosponsors.includes(n.id) && n.party === author.party
        );
        if (potential.length > 0) {
          newCosponsors.push(pick(rng, potential).id);
        }
      }
    }

    return { ...bill, momentum, stage: newStage, cosponsors: newCosponsors };
  });

  return { ...state, npcBills: updatedBills };
}

// ══════════════════════════════════════════════════════════════
// PRESIDENTIAL APPROVAL DRIFT
// ══════════════════════════════════════════════════════════════

function processPresidentialDrift(state: GameState): GameState {
  let approval = state.president.approvalRating;
  // Default drift toward 45 (-1 per 2 weeks = every 10 days)
  if (approval > 45) {
    approval -= 1;
  }
  return {
    ...state,
    president: { ...state.president, approvalRating: clamp(approval, 25, 75) },
  };
}

// ══════════════════════════════════════════════════════════════
// NPC MEETING REQUESTS (2-3 per week)
// ══════════════════════════════════════════════════════════════

/** Check if an NPC holds a leadership role (whip, majority leader, speaker, committee chair) */
export function isLeadershipNpc(npc: NPC, state: GameState): boolean {
  const isPartyLeader = state.parties.some(
    p => p.whipId === npc.id || p.majorityLeaderId === npc.id || p.speakerId === npc.id
  );
  const isChair = state.committees.some(c => c.chair === npc.id);
  return isPartyLeader || isChair;
}

/** Get the advance booking days required for an NPC (1 regular, 2 leadership) */
export function getAdvanceBookingDays(npc: NPC, state: GameState): number {
  return isLeadershipNpc(npc, state) ? 2 : 1;
}

function processNpcMeetingRequests(state: GameState, rng: () => number): GameState {
  const day = state.currentDay;

  // Expire old requests
  let requests = state.meetingRequests.map(r => {
    if (r.status === 'pending' && day > r.expirationDay) {
      return { ...r, status: 'expired' as const, sentimentApplied: true };
    }
    return r;
  });

  // Apply sentiment for newly expired requests: -1 for ignored/expired
  const newlyExpired = requests.filter(
    r => r.status === 'expired' && !state.meetingRequests.find(orig => orig.id === r.id && orig.status === 'expired')
  );
  let sentiment = { ...state.sentiment };
  for (const req of newlyExpired) {
    sentiment[req.npcId] = clamp((sentiment[req.npcId] ?? 0) - 1, -100, 100);
  }

  // Target: ~2-3 requests per 5-day week = ~40-60% daily chance
  // But cap active pending requests at 3
  const activePending = requests.filter(r => r.status === 'pending').length;
  if (activePending >= 3 || rng() > 0.5) {
    return { ...state, meetingRequests: requests, sentiment };
  }

  // NPCs who have recently requested (within last 10 days) are excluded
  const recentRequestorIds = new Set(
    requests.filter(r => day - r.dayRequested < 10).map(r => r.npcId)
  );

  // Build candidate pool with priority weights
  const candidates: { npc: NPC; weight: number; reason: MeetingRequestReason; priority: MeetingRequestPriority }[] = [];

  for (const npc of state.npcs) {
    if (recentRequestorIds.has(npc.id)) continue;

    const sent = sentiment[npc.id] ?? 0;

    // NPCs with active bills wanting cosponsor support — high priority
    if (npc.hasActiveBill) {
      candidates.push({
        npc, weight: 3, reason: 'cosponsor_ask',
        priority: sent < -20 ? 'urgent' : 'important',
      });
    }

    // NPCs with strong negative sentiment — complaint
    if (sent <= -30) {
      candidates.push({ npc, weight: 2, reason: 'complaint', priority: 'urgent' });
    }

    // Dealmaker NPCs looking to trade
    if (npc.temperament === 'dealmaker' && sent > -10) {
      candidates.push({ npc, weight: 2, reason: 'deal_offer', priority: 'important' });
    }

    // Same-party NPCs who have intel
    if (npc.party === state.player.party && sent > 0) {
      candidates.push({ npc, weight: 1, reason: 'intel_share', priority: 'casual' });
    }

    // General favor requests from warm/allied NPCs
    if (sent >= 30) {
      candidates.push({ npc, weight: 1, reason: 'favor_request', priority: 'casual' });
    }
  }

  if (candidates.length === 0) {
    return { ...state, meetingRequests: requests, sentiment };
  }

  // Weighted selection
  const weights = candidates.map(c => c.weight);
  const selected = weightedRandom(rng, candidates, weights);

  // Generate bark text for the request
  const barkText = generateRequestBark(selected.npc, selected.reason, rng);

  const newRequest: MeetingRequest = {
    id: generateId('mreq'),
    npcId: selected.npc.id,
    reason: selected.reason,
    priority: selected.priority,
    barkText,
    dayRequested: day,
    expirationDay: day + 3,
    status: 'pending',
    sentimentApplied: false,
  };

  requests = [...requests, newRequest];

  return { ...state, meetingRequests: requests, sentiment };
}

function generateRequestBark(npc: NPC, reason: MeetingRequestReason, _rng: () => number): string {
  const name = npc.name.toUpperCase();
  switch (reason) {
    case 'cosponsor_ask':
      return `${name} WANTS TO DISCUSS THEIR BILL WITH YOU.`;
    case 'vote_ask':
      return `${name} IS SEEKING YOUR VOTE ON AN UPCOMING MEASURE.`;
    case 'deal_offer':
      return `${name} SAYS THEY HAVE A PROPOSITION FOR YOU.`;
    case 'intel_share':
      return `${name} WANTS TO SHARE SOME INFORMATION.`;
    case 'complaint':
      return `${name} HAS CONCERNS THEY WANT TO RAISE WITH YOU.`;
    case 'favor_request':
      return `${name} IS ASKING FOR A MOMENT OF YOUR TIME.`;
  }
}

// ══════════════════════════════════════════════════════════════
// NPC WEEKLY AVAILABILITY
// ══════════════════════════════════════════════════════════════

function generateNpcAvailability(state: GameState, rng: () => number): GameState {
  const week = getWeek(state.currentDay);
  const weekStart = (week - 1) * 5 + 1;
  const slots: Slot[] = ['morning', 'afternoon', 'evening'];

  const availability: NpcAvailabilityWeek[] = state.npcs.map(npc => {
    const isLeader = isLeadershipNpc(npc, state);
    const slotCount = isLeader
      ? 2 + Math.floor(rng() * 2)  // 2-3 for leadership
      : 4 + Math.floor(rng() * 3); // 4-6 for regular

    // Generate all possible slots for this week
    const possibleSlots: { day: number; slot: Slot }[] = [];
    for (let d = weekStart; d < weekStart + 5 && d <= 60; d++) {
      for (const slot of slots) {
        // Skip slots already booked as mandatory events
        const isMandatory = state.schedule.some(
          e => e.day === d && e.slot === slot && e.mandatory
        );
        if (!isMandatory) {
          possibleSlots.push({ day: d, slot });
        }
      }
    }

    // Pick random subset of available slots
    const shuffled = shuffle(rng, possibleSlots);
    const selected = shuffled.slice(0, Math.min(slotCount, shuffled.length));

    return {
      npcId: npc.id,
      weekNumber: week,
      slots: selected,
    };
  });

  return { ...state, npcAvailability: availability };
}

// ══════════════════════════════════════════════════════════════
// SCHEDULE UPCOMING EVENTS
// ══════════════════════════════════════════════════════════════

function scheduleUpcomingEvents(state: GameState, rng: () => number): GameState {
  let s = { ...state };
  const day = s.currentDay;

  // Caucus meeting: Day 3 of each week, Evening slot
  if (getDayOfWeek(day) === 3) {
    const exists = s.schedule.some(e => e.day === day && e.slot === 'evening' && e.type === 'caucus');
    if (!exists) {
      s = {
        ...s,
        schedule: [...s.schedule, {
          day,
          slot: 'evening' as Slot,
          type: 'caucus',
          label: 'CAUCUS MEETING',
          mandatory: true,
        }],
      };
    }
  }

  // Primary election check
  const primaryDay = s.primaryDate === 'early' ? 20 : 45;
  if (day === primaryDay && !s.primarySurvived && !s.isLameDuck) {
    const exists = s.schedule.some(e => e.day === day && e.type === 'primary');
    if (!exists) {
      s = {
        ...s,
        schedule: [...s.schedule, {
          day,
          slot: 'morning' as Slot,
          type: 'primary',
          label: 'PRIMARY ELECTION',
          mandatory: true,
        }],
      };
    }
  }

  // Committee hearings: schedule 2 days ahead for bills in hearing stage
  const allBills = [s.playerBill, ...s.npcBills];
  const hearingBills = allBills.filter(b => b.stage === 'hearing');
  for (const bill of hearingBills) {
    const targetDay = day + 2;
    if (targetDay > 60) continue;

    // Find the right committee using proper referral mapping
    const committee = findCommitteeForBill(bill, s);
    if (!committee) continue;

    // Check if already scheduled (for this bill, any day)
    const alreadyScheduled = s.schedule.some(e =>
      e.type === 'committee_hearing' && e.billId === bill.id
    );
    if (alreadyScheduled) continue;

    // Find the best slot: match the committee's regular day/time if possible
    const dow = getDayOfWeek(targetDay);
    const morningIssue = getCommitteeForSlot(dow, 'morning');
    const afternoonIssue = getCommitteeForSlot(dow, 'afternoon');
    let slot: Slot;
    if (morningIssue === committee.issue) {
      slot = 'morning';
    } else if (afternoonIssue === committee.issue) {
      slot = 'afternoon';
    } else {
      // Overflow: use morning if open, else afternoon
      const morningTaken = s.schedule.some(e => e.day === targetDay && e.slot === 'morning' && e.mandatory);
      slot = morningTaken ? 'afternoon' : 'morning';
    }

    // Don't double-book mandatory slots
    const slotTaken = s.schedule.some(e => e.day === targetDay && e.slot === slot && e.mandatory);
    if (slotTaken) {
      // Try the other official slot
      const altSlot: Slot = slot === 'morning' ? 'afternoon' : 'morning';
      const altTaken = s.schedule.some(e => e.day === targetDay && e.slot === altSlot && e.mandatory);
      if (altTaken) continue; // both slots full, try next day cycle
      slot = altSlot;
    }

    const isPlayerBill = bill.author === 'player';
    s = {
      ...s,
      schedule: [...s.schedule, {
        day: targetDay,
        slot,
        type: 'committee_hearing',
        label: `${committee.name.split(' ')[0].toUpperCase()} HEARING${isPlayerBill ? ' (YOUR BILL)' : ''}`,
        billId: bill.id,
        mandatory: true,
      }],
    };
  }

  return s;
}

// ══════════════════════════════════════════════════════════════
// PROMISE CHECKING
// ══════════════════════════════════════════════════════════════

function checkPromises(state: GameState): GameState {
  const updatedPromises = state.promises.map(p => {
    if (p.fulfilled !== null) return p; // already resolved
    if (!p.dueBy) return p; // no deadline

    // If past due and not fulfilled, mark as broken
    if (state.currentDay > p.dueBy) {
      return { ...p, fulfilled: false };
    }
    return p;
  });

  // Apply broken promise sentiment penalties
  let sentiment = { ...state.sentiment };
  for (const p of updatedPromises) {
    const original = state.promises.find(op => op.id === p.id);
    if (original && original.fulfilled === null && p.fulfilled === false) {
      // Just broke this promise — apply -30 sentiment (GDD spec: -25 to -35)
      const current = sentiment[p.npcId] ?? 0;
      sentiment[p.npcId] = clamp(current - 30, -100, 100);
    }
  }

  return { ...state, promises: updatedPromises, sentiment };
}

// ══════════════════════════════════════════════════════════════
// QUICK INTERACTION TRIGGER
// ══════════════════════════════════════════════════════════════

function maybeGenerateQuickInteraction(state: GameState, rng: () => number): GameState {
  // Quick interactions are surfaced as schedule hints — the actual triggering
  // happens in the UI layer. We just flag that one is available.
  // For now, store as a schedule entry that App.svelte can detect.
  const types = ['early_bird', 'ambush', 'hallway', 'lingerer'] as const;
  const type = pick(rng, types);

  // Pick a relevant NPC
  let candidates: NPC[];
  if (type === 'early_bird') {
    // Active legislators, chairs
    candidates = state.npcs.filter(n => n.hasActiveBill || state.committees.some(c => c.chair === n.id));
  } else if (type === 'ambush') {
    // NPCs with urgent business
    candidates = state.npcs.filter(n => n.hasActiveBill);
  } else if (type === 'hallway') {
    // Warm/Allied NPCs
    candidates = state.npcs.filter(n => {
      const tier = getSentimentTier(state.sentiment[n.id] ?? 0);
      return tier === 'warm' || tier === 'allied';
    });
  } else {
    // Lingerers: NPCs under pressure
    candidates = state.npcs.filter(n => n.primaryThreat > 30 || n.hasActiveBill);
  }

  if (candidates.length === 0) candidates = state.npcs;
  const npc = pick(rng, candidates);

  // Store as a special schedule entry for the current slot.
  // interactionType is carried explicitly on the entry so downstream UI
  // code doesn't have to string-match the label.
  return {
    ...state,
    schedule: [...state.schedule, {
      day: state.currentDay,
      slot: state.currentSlot,
      type: 'quick_interaction',
      label: `${type.toUpperCase().replace('_', ' ')}: ${npc.name.toUpperCase()}`,
      npcId: npc.id,
      mandatory: false,
      quickInteractionType: type,
    }],
  };
}

// ── Helpers ──

function slotIndex(slot: Slot): number {
  return slot === 'morning' ? 0 : slot === 'afternoon' ? 1 : 2;
}

/**
 * Find the primary committee for a bill based on its first pro-tag.
 * Handles cross-cutting issues by mapping through CROSS_CUTTING_REFERRAL.
 */
function findCommitteeForBill(bill: Bill, state: GameState): typeof state.committees[0] | undefined {
  for (const tag of bill.proTags) {
    // Direct committee match
    if ((COMMITTEE_ISSUES as readonly string[]).includes(tag)) {
      const committee = state.committees.find(c => c.issue === tag);
      if (committee) return committee;
    }
    // Cross-cutting referral
    if (tag in CROSS_CUTTING_REFERRAL) {
      const referredIssue = CROSS_CUTTING_REFERRAL[tag as CrossCuttingIssue];
      const committee = state.committees.find(c => c.issue === referredIssue);
      if (committee) return committee;
    }
  }
  // Fallback: use anti-tag referral
  if ((COMMITTEE_ISSUES as readonly string[]).includes(bill.antiTag)) {
    return state.committees.find(c => c.issue === bill.antiTag);
  }
  if (bill.antiTag in CROSS_CUTTING_REFERRAL) {
    const referredIssue = CROSS_CUTTING_REFERRAL[bill.antiTag as CrossCuttingIssue];
    return state.committees.find(c => c.issue === referredIssue);
  }
  return state.committees[0]; // last resort
}
