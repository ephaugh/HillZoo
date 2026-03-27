<script lang="ts">
  import type { GameState, NPC, Issue, MeetingRequest } from '../../core/types';
  import { ISSUE_LABELS } from '../../core/types';
  import { getSentimentTier } from '../../core/utils';
  import { getNpcRole, getNpcRoleLabel, getNpcCommitteesShort } from '../../core/roles';
  import { createRng } from '../../core/utils';
  import { calculateNetWillingness, evaluateTrade, type WillingnessBreakdown, type TradeOption } from '../../core/decision-engine';
  import { selectBark, TIER_LABELS, loadBarks, type BarkResult } from '../../core/bark-engine';
  import { findCommitteeForBill } from '../../core/committees';
  import {
    changeSentiment, recordMeeting, addCosponsor, addPromise,
    applyLeaderPressure, scheduleHearing, scheduleFloorVote, offerBudgetHelp,
    completeMeetingRequest, hostColleagueFundraiser,
  } from '../../stores/actions';
  import { generateId } from '../../core/utils';

  let { gameState, npc, onExit, meetingRequest = null }: {
    gameState: GameState;
    npc: NPC;
    onExit: () => void;
    meetingRequest?: MeetingRequest | null;
  } = $props();

  // Track whether NPC has made their ask (for NPC-initiated meetings)
  let npcAskCompleted = $state(false);

  // Meeting phases: read → ask → offer
  type MeetingPhase = 'read' | 'ask' | 'offer';
  let phase: MeetingPhase = $state('read');

  // Bark/response state
  let currentBark: BarkResult | null = $state(null);
  let currentBreakdown: WillingnessBreakdown | null = $state(null);
  let tradeOptions: TradeOption[] = $state([]);
  let selectedVerb: string | null = $state(null);

  // Sentiment display
  let sentimentScore = $derived(gameState.sentiment[npc.id] ?? 0);
  let sentimentTier = $derived(getSentimentTier(sentimentScore));
  let meetingCount = $derived(gameState.knownInfo.meetingCount[npc.id] ?? 0);

  // NPC info visibility (progressive reveal)
  let showInterests = $derived(meetingCount >= 1);

  // Role and committee lookups
  let roleLabel = $derived(getNpcRoleLabel(npc.id, gameState));
  let committeeNames = $derived(getNpcCommitteesShort(npc.id, gameState));

  // RNG for this meeting
  let meetingRng = createRng(gameState.seed + gameState.currentDay * 100 + npc.id.charCodeAt(npc.id.length - 1));

  // Record this meeting and mark request as completed if NPC-initiated
  $effect(() => {
    recordMeeting(npc.id);
    loadBarks();
    if (meetingRequest) {
      completeMeetingRequest(meetingRequest.id);
    }
  });

  // NPC-initiated meeting: start with NPC's ask
  let npcAskBark: string | null = $state(null);
  let npcAskOptions: { id: string; label: string; tag: string }[] = $state([]);

  $effect(() => {
    if (meetingRequest && !npcAskCompleted) {
      const result = generateNpcAsk(meetingRequest);
      npcAskBark = result.bark;
      npcAskOptions = result.options;
    }
  });

  function generateNpcAsk(req: MeetingRequest): { bark: string; options: { id: string; label: string; tag: string }[] } {
    const name = npc.name.toUpperCase();
    switch (req.reason) {
      case 'cosponsor_ask':
        return {
          bark: `${name}: "I NEED YOUR NAME ON MY BILL. WILL YOU COSPONSOR?"`,
          options: [
            { id: 'accept_cosponsor', label: 'AGREE TO COSPONSOR', tag: '+SENTIMENT' },
            { id: 'consider', label: 'I WILL CONSIDER IT', tag: 'NEUTRAL' },
            { id: 'refuse', label: 'DECLINE', tag: '-SENTIMENT' },
          ],
        };
      case 'vote_ask':
        return {
          bark: `${name}: "I NEED TO KNOW WHERE YOU STAND ON THE UPCOMING VOTE."`,
          options: [
            { id: 'pledge_vote', label: 'PLEDGE YOUR VOTE', tag: 'PROMISE' },
            { id: 'consider', label: 'I NEED MORE TIME', tag: 'NEUTRAL' },
            { id: 'refuse', label: 'I CAN\'T COMMIT', tag: '-SENTIMENT' },
          ],
        };
      case 'deal_offer':
        return {
          bark: `${name}: "I HAVE A PROPOSITION THAT COULD BENEFIT US BOTH."`,
          options: [
            { id: 'hear_deal', label: 'LET ME HEAR IT', tag: 'TRADE' },
            { id: 'refuse', label: 'NOT INTERESTED', tag: '-SENTIMENT' },
          ],
        };
      case 'intel_share':
        return {
          bark: `${name}: "I HAVE INFORMATION YOU MIGHT FIND USEFUL."`,
          options: [
            { id: 'accept_intel', label: 'GO ON', tag: 'INTEL' },
            { id: 'refuse', label: 'I AM BUSY', tag: '-SENTIMENT' },
          ],
        };
      case 'complaint':
        return {
          bark: `${name}: "WE NEED TO TALK. I'M NOT HAPPY WITH HOW THINGS ARE GOING."`,
          options: [
            { id: 'listen', label: 'I AM LISTENING', tag: 'DIPLOMACY' },
            { id: 'dismiss', label: 'I HAVE PRIORITIES', tag: '-SENTIMENT' },
          ],
        };
      case 'favor_request':
        return {
          bark: `${name}: "I COULD USE A FAVOR. WOULD YOU HEAR ME OUT?"`,
          options: [
            { id: 'hear_favor', label: 'WHAT DO YOU NEED?', tag: 'FAVOR' },
            { id: 'refuse', label: 'I CANNOT HELP RIGHT NOW', tag: '-SENTIMENT' },
          ],
        };
    }
  }

  function handleNpcAskResponse(optionId: string) {
    npcAskCompleted = true;
    npcAskBark = null;
    npcAskOptions = [];

    switch (optionId) {
      case 'accept_cosponsor':
        if (npc.activeBill) addCosponsor(npc.activeBill, 'player');
        changeSentiment(npc.id, 12);
        currentBark = { text: "EXCELLENT. WITH YOUR NAME ON IT, WE HAVE REAL MOMENTUM.", interjection: null, tier: 1, tierLabel: "GRATEFUL.", dominantDriver: 'sentiment' };
        phase = 'ask';
        break;
      case 'pledge_vote':
        addPromise({ id: generateId('prm'), day: gameState.currentDay, npcId: npc.id, description: `VOTE YES ON ${npc.name.toUpperCase()}'S BILL`, type: 'vote_yes', billId: npc.activeBill ?? undefined, fulfilled: null });
        changeSentiment(npc.id, 10);
        currentBark = { text: "YOUR WORD MEANS SOMETHING. I WILL REMEMBER THIS.", interjection: null, tier: 1, tierLabel: "GRATEFUL.", dominantDriver: 'sentiment' };
        phase = 'ask';
        break;
      case 'hear_deal':
        // Prepare trade options
        if (npc.activeBill) {
          const npcBill = gameState.npcBills.find(b => b.id === npc.activeBill);
          if (npcBill) {
            const breakdown = calculateNetWillingness(npc, gameState.playerBill, gameState, false);
            tradeOptions = evaluateTrade(npc, breakdown, gameState);
          }
        }
        currentBark = { text: "HERE IS WHAT I PROPOSE: YOU HELP ME, AND I HELP YOU.", interjection: null, tier: 4, tierLabel: "NEGOTIATING.", dominantDriver: 'sentiment' };
        phase = 'ask';
        break;
      case 'accept_intel':
        changeSentiment(npc.id, 3);
        currentBark = { text: getDiscussionResponse(), interjection: null, tier: 3, tierLabel: "INTEL.", dominantDriver: 'sentiment' };
        phase = 'ask';
        break;
      case 'listen':
        changeSentiment(npc.id, 5);
        currentBark = { text: "I APPRECIATE YOU HEARING ME OUT. PERHAPS WE CAN FIND COMMON GROUND.", interjection: null, tier: 3, tierLabel: "NOTED.", dominantDriver: 'sentiment' };
        phase = 'ask';
        break;
      case 'hear_favor':
        changeSentiment(npc.id, 3);
        currentBark = { text: "I NEED SOMEONE TO VOUCH FOR ME WITH THE COMMITTEE. CAN YOU DO THAT?", interjection: null, tier: 3, tierLabel: "FAVOR.", dominantDriver: 'sentiment' };
        phase = 'ask';
        break;
      case 'consider':
        // Neutral response — no sentiment change
        currentBark = { text: "FAIR ENOUGH. THE OFFER STANDS.", interjection: null, tier: 4, tierLabel: "NOTED.", dominantDriver: 'sentiment' };
        phase = 'ask';
        break;
      case 'refuse':
      case 'dismiss':
        changeSentiment(npc.id, -5);
        currentBark = { text: "I SEE. WELL. I WILL REMEMBER THIS.", interjection: null, tier: 5, tierLabel: "DISAPPOINTED.", dominantDriver: 'sentiment' };
        phase = 'ask';
        break;
    }
  }

  // ── NPC role detection ──
  let npcRole = $derived(getNpcRole(npc.id, gameState));
  let isWhipOrLeader = $derived(npcRole === 'whip' || npcRole === 'majority_leader' || npcRole === 'minority_leader');
  let isChair = $derived(npcRole === 'chair');
  let isSpeaker = $derived(npcRole === 'speaker');
  let playerOnBudget = $derived(gameState.committees.some(c => c.issue === 'budget' && gameState.player.committees.includes(c.id)));

  // Bills pending in this NPC's committee (if they're a chair)
  let pendingBillsInCommittee = $derived((): typeof gameState.npcBills => {
    if (!isChair) return [];
    const chairedComm = gameState.committees.find(c => c.chair === npc.id);
    if (!chairedComm) return [];
    return [...(gameState.playerBill.stage === 'referral' ? [gameState.playerBill] : []),
      ...gameState.npcBills.filter(b => b.stage === 'referral')
    ].filter(b => {
      const comm = findCommitteeForBill(b, gameState);
      return comm.id === chairedComm.id;
    });
  });

  // Bills in the queue (for Speaker)
  let queuedBills = $derived(
    [gameState.playerBill, ...gameState.npcBills].filter(b => b.stage === 'queue')
  );

  // Sub-menu state for multi-step verbs
  let subMenu: 'none' | 'lean_target' | 'hearing_bill' | 'floor_bill' = $state('none');

  // ── Verb menu (dynamic based on NPC role) ──
  interface Verb { id: string; label: string; tag: string; available: boolean }
  let verbs = $derived((): Verb[] => {
    const v: Verb[] = [
      { id: 'ask_vote', label: 'ASK FOR VOTE', tag: 'YOUR BILL', available: true },
      { id: 'ask_cosponsor', label: 'ASK TO COSPONSOR', tag: 'YOUR BILL', available: true },
      { id: 'discuss', label: 'DISCUSS', tag: 'INFORMATION', available: true },
      { id: 'offer_cosponsor', label: 'OFFER COSPONSOR', tag: 'THEIR BILL', available: npc.hasActiveBill },
      { id: 'offer_vote', label: 'OFFER VOTE', tag: 'THEIR BILL', available: npc.hasActiveBill },
      { id: 'quick_question', label: 'QUICK QUESTION', tag: 'INTEL', available: true },
      { id: 'campaign_offer', label: 'OFFER TO CAMPAIGN', tag: 'FAVOR', available: true },
      { id: 'fundraise_offer', label: 'HOST FUNDRAISER', tag: '$1,200', available: gameState.warChest >= 1200 },
    ];

    // Leadership-specific verbs
    if (isWhipOrLeader) {
      v.push({ id: 'lean_on', label: 'LEAN ON A MEMBER', tag: 'PRESSURE', available: sentimentTier !== 'hostile' && sentimentTier !== 'cold' });
    }
    if (isChair) {
      v.push({ id: 'request_hearing', label: 'REQUEST HEARING', tag: 'COMMITTEE', available: pendingBillsInCommittee().length > 0 });
    }
    if (isSpeaker) {
      v.push({ id: 'request_floor', label: 'REQUEST FLOOR VOTE', tag: 'SPEAKER', available: queuedBills.length > 0 });
    }
    // Budget committee special
    if (playerOnBudget && npc.hasActiveBill) {
      v.push({ id: 'budget_help', label: 'OFFER BUDGET HELP', tag: 'BUDGET', available: true });
    }

    return v;
  });

  function executeVerb(verbId: string) {
    selectedVerb = verbId;

    const isCosponsor = verbId === 'ask_cosponsor';
    const breakdown = calculateNetWillingness(npc, gameState.playerBill, gameState, isCosponsor);
    currentBreakdown = breakdown;

    if (verbId === 'ask_vote' || verbId === 'ask_cosponsor') {
      // Core ask — run decision engine and bark selection
      const bark = selectBark(meetingRng, npc, breakdown, gameState);
      currentBark = bark;
      phase = 'ask';

      // Apply sentiment consequences based on response tier
      if (bark.tier === 1 || bark.tier === 2) {
        // Positive response — small sentiment boost from successful interaction
        changeSentiment(npc.id, 3);
      } else if (bark.tier === 5) {
        // "I can't" — mild negative for pushing
        changeSentiment(npc.id, -3);
      } else if (bark.tier === 6) {
        // "No" — clear negative
        changeSentiment(npc.id, -5);
      } else if (bark.tier === 7) {
        // "Absolutely not" — harsh consequences
        changeSentiment(npc.id, -10);
      }

      // Tier 1-2: add as cosponsor if asking for cosponsorship
      if ((bark.tier === 1 || bark.tier === 2) && isCosponsor) {
        addCosponsor(gameState.playerBill.id, npc.id);
      }

      // If tier 4 ("What's in it for me?"), prepare trade options
      if (bark.tier === 4) {
        tradeOptions = evaluateTrade(npc, breakdown, gameState);
      }
    } else if (verbId === 'discuss') {
      currentBark = {
        text: getDiscussionResponse(),
        interjection: null,
        tier: 4,
        tierLabel: '',
        dominantDriver: 'sentiment',
      };
      phase = 'ask';
    } else if (verbId === 'offer_cosponsor' || verbId === 'offer_vote') {
      // Player offering to help NPC — weighted by committee membership and bill stage
      const isCosponsorOffer = verbId === 'offer_cosponsor';
      const cosponsorBonus = isCosponsorOffer ? 4 : 0;

      // Find the NPC's active bill and its committee
      const npcBill = npc.activeBill
        ? gameState.npcBills.find(b => b.id === npc.activeBill)
        : undefined;

      let sentimentShift = 8 + cosponsorBonus; // default: floor vote only
      let barkText = "I APPRECIATE THAT. CONSIDER IT NOTED.";

      if (npcBill) {
        const billCommittee = findCommitteeForBill(npcBill, gameState);
        const playerOnCommittee = billCommittee.members.includes('player');

        if (playerOnCommittee && npcBill.stage === 'referral') {
          sentimentShift = 20 + cosponsorBonus;
          barkText = "YOU CAN HELP ME IN COMMITTEE? THAT CHANGES EVERYTHING.";
        } else if (playerOnCommittee && (npcBill.stage === 'hearing' || npcBill.stage === 'markup')) {
          sentimentShift = 15 + cosponsorBonus;
          barkText = "COMMITTEE SUPPORT IS WORTH ITS WEIGHT IN GOLD.";
        }
        // else: default +8 (+ cosponsor bonus) for non-committee / later stages
      }

      changeSentiment(npc.id, sentimentShift);
      currentBark = {
        text: barkText,
        interjection: null,
        tier: 2,
        tierLabel: "NOTED.",
        dominantDriver: 'sentiment',
      };
      phase = 'ask';
    } else if (verbId === 'quick_question') {
      currentBark = {
        text: getQuickQuestionResponse(),
        interjection: null,
        tier: 3,
        tierLabel: '',
        dominantDriver: 'sentiment',
      };
      phase = 'ask';
    } else if (verbId === 'campaign_offer') {
      changeSentiment(npc.id, 15);
      currentBark = {
        text: "YOU'D DO THAT? THAT MEANS A GREAT DEAL. I WON'T FORGET IT.",
        interjection: null,
        tier: 1,
        tierLabel: "GRATEFUL.",
        dominantDriver: 'sentiment',
      };
      // This creates a promise
      addPromise({
        id: generateId('prm'),
        day: gameState.currentDay,
        npcId: npc.id,
        description: `CAMPAIGN IN ${npc.name.toUpperCase()}'S DISTRICT`,
        type: 'campaign',
        fulfilled: null,
      });
      phase = 'ask';
    } else if (verbId === 'fundraise_offer') {
      // Host a fundraiser for colleague — costs $1,200 from war chest
      const result = hostColleagueFundraiser(npc.id);
      if (result.success) {
        // hostColleagueFundraiser already applies sentiment +8 and deducts $1,200
        // Add additional sentiment for the meeting context
        changeSentiment(npc.id, 10);
        currentBark = {
          text: "A FUNDRAISER? NOW WE'RE TALKING. YOU HAVE MY ATTENTION.",
          interjection: null,
          tier: 1,
          tierLabel: "INTERESTED.",
          dominantDriver: 'sentiment',
        };
      } else {
        currentBark = {
          text: result.error ?? "INSUFFICIENT FUNDS.",
          interjection: null,
          tier: 5,
          tierLabel: "CANNOT AFFORD.",
          dominantDriver: 'sentiment',
        };
      }
      phase = 'ask';
    } else if (verbId === 'lean_on') {
      // Show sub-menu to pick target
      subMenu = 'lean_target';
      phase = 'ask';
    } else if (verbId === 'request_hearing') {
      if (pendingBillsInCommittee().length === 1) {
        doRequestHearing(pendingBillsInCommittee()[0].id);
      } else {
        subMenu = 'hearing_bill';
        phase = 'ask';
      }
    } else if (verbId === 'request_floor') {
      if (queuedBills.length === 1) {
        doRequestFloorVote(queuedBills[0].id);
      } else {
        subMenu = 'floor_bill';
        phase = 'ask';
      }
    } else if (verbId === 'budget_help') {
      if (npc.activeBill) {
        offerBudgetHelp(npc.id, npc.activeBill);
        changeSentiment(npc.id, 15);
        const budgetBarks: Record<string, string[]> = {
          ideologue: [
            "THE BUDGET COMMITTEE? FISCAL RESPONSIBILITY MATTERS. YOU HAVE MY FULL ATTENTION.",
            "IF YOU CAN HELP WITH THE NUMBERS, THAT CHANGES EVERYTHING. LET'S TALK.",
          ],
          follower: [
            "THE BUDGET COMMITTEE? THE INSTITUTION VALUES FISCAL DISCIPLINE. YOU HAVE MY ATTENTION.",
            "THAT'S A SIGNIFICANT OFFER. LEADERSHIP NOTICES MEMBERS WHO HELP WITH THE BUDGET PROCESS.",
          ],
          dealmaker: [
            "THE BUDGET COMMITTEE? NOW THAT'S A CONVERSATION WORTH HAVING. NAME YOUR TERMS.",
            "HELP WITH THE BUDGET SCORE? THIS IS EXACTLY THE KIND OF DEAL I LIKE.",
          ],
          opportunist: [
            "THE BUDGET COMMITTEE? A CLEAN SCORE CHANGES THE ODDS. YOU HAVE MY FULL ATTENTION.",
            "THAT COULD BE THE DIFFERENCE BETWEEN PASSAGE AND FAILURE. I'M LISTENING.",
          ],
        };
        const pool = budgetBarks[npc.temperament] ?? budgetBarks.follower;
        currentBark = {
          text: pool[Math.floor(meetingRng() * pool.length)],
          interjection: null,
          tier: 1,
          tierLabel: "VERY INTERESTED.",
          dominantDriver: 'sentiment',
        };
        phase = 'ask';
      }
    }
  }

  // ── Leadership verb handlers ──

  function doLeanOn(targetNpcId: string) {
    subMenu = 'none';
    const targetNpc = gameState.npcs.find(n => n.id === targetNpcId);
    if (!targetNpc) return;

    const targetName = targetNpc.name.toUpperCase();

    // Check willingness: depends on leader sentiment toward player
    if (sentimentTier === 'hostile' || sentimentTier === 'cold') {
      changeSentiment(npc.id, -3);
      // Temperament-varied refusal barks (never reveal temperament label)
      const refusalBarks: Record<string, string[]> = {
        ideologue: [
          "I REFUSE TO SPEND MY CREDIBILITY ON YOUR AGENDA. EARN YOUR OWN VOTES.",
          "THAT IS NOT A PRINCIPLED USE OF MY AUTHORITY. THE ANSWER IS NO.",
        ],
        follower: [
          "I'M NOT DOING YOUR DIRTY WORK. LEADERSHIP HAS PRIORITIES.",
          "THE CAUCUS HAS MORE PRESSING CONCERNS THAN YOUR REQUESTS.",
        ],
        dealmaker: [
          "YOU HAVEN'T EARNED THAT KIND OF FAVOR. COME BACK WITH SOMETHING TO OFFER.",
          "THAT'S A BIG ASK FOR SOMEONE WHO'S GIVEN ME NOTHING. NO.",
        ],
        opportunist: [
          "I DON'T SEE THE UPSIDE FOR ME. WHY WOULD I STICK MY NECK OUT?",
          "THE RISK ISN'T WORTH IT. NOT FOR YOU. NOT RIGHT NOW.",
        ],
      };
      const pool = refusalBarks[npc.temperament] ?? refusalBarks.follower;
      currentBark = {
        text: pool[Math.floor(meetingRng() * pool.length)],
        interjection: null,
        tier: 6,
        tierLabel: "REFUSED.",
        dominantDriver: 'sentiment',
      };
    } else {
      applyLeaderPressure(npc.id, targetNpcId, gameState.playerBill.id, 'yes');
      changeSentiment(npc.id, -5);
      // Temperament-varied success barks
      const successBarks: Record<string, string[]> = {
        ideologue: [
          `THE PRINCIPLE IS CLEAR. I'LL MAKE SURE ${targetName} UNDERSTANDS WHAT'S AT STAKE.`,
          `I'LL SPEAK TO ${targetName} ABOUT THE RIGHT THING TO DO HERE.`,
        ],
        follower: [
          `THE CAUCUS POSITION IS CLEAR. I'LL CONVEY THE EXPECTATION TO ${targetName}.`,
          `${targetName} WILL HEAR FROM LEADERSHIP. WE EXPECT COMPLIANCE.`,
        ],
        dealmaker: [
          `${targetName}, HMM? I'LL HAVE A CONVERSATION. EVERYONE HAS SOMETHING THEY NEED.`,
          `I'LL REACH OUT TO ${targetName}. THERE'S ALWAYS AN ARRANGEMENT TO BE MADE.`,
        ],
        opportunist: [
          `THE MOMENTUM IS THERE. I'LL MAKE SURE ${targetName} SEES WHICH WAY THE WIND BLOWS.`,
          `${targetName} SHOULD KNOW THE SMART MOVE. I'LL SEE THE MESSAGE IS RECEIVED.`,
        ],
      };
      const pool = successBarks[npc.temperament] ?? successBarks.follower;
      currentBark = {
        text: pool[Math.floor(meetingRng() * pool.length)],
        interjection: null,
        tier: 3,
        tierLabel: "AGREED.",
        dominantDriver: 'party',
      };
    }
  }

  function doRequestHearing(billId: string) {
    subMenu = 'none';
    const chairedComm = gameState.committees.find(c => c.chair === npc.id);
    if (!chairedComm) return;

    const targetBill = [gameState.playerBill, ...gameState.npcBills].find(b => b.id === billId);
    if (!targetBill) return;

    const billName = targetBill.name.toUpperCase();

    // Chair's willingness based on NW toward the bill
    const breakdown = calculateNetWillingness(npc, targetBill, gameState, false);
    currentBreakdown = breakdown;

    if (breakdown.tier <= 5) {
      // Chair is at least somewhat willing -- success
      scheduleHearing(billId, chairedComm.id);
      changeSentiment(npc.id, -3);

      const acceptBarks: Record<string, string[]> = {
        ideologue: [
          `THE ISSUES IN ${billName} DESERVE A HEARING. I'LL PUT IT ON THE CALENDAR.`,
          `THE COMMITTEE SHOULD EXAMINE THIS. I'LL SCHEDULE THE HEARING.`,
        ],
        follower: [
          `I SEE NO REASON TO DELAY. THE COMMITTEE WILL HEAR ${billName}.`,
          `THE COMMITTEE WILL HEAR ${billName}. I'LL ARRANGE IT THROUGH PROPER CHANNELS.`,
        ],
        dealmaker: [
          `${billName} GETS A HEARING. I TRUST YOU'LL REMEMBER THIS.`,
          `I'LL MOVE YOUR BILL FORWARD. FAVORS HAVE A WAY OF COMING BACK AROUND.`,
        ],
        opportunist: [
          `THERE'S ENOUGH INTEREST TO JUSTIFY A HEARING. I'LL SCHEDULE ${billName}.`,
          `THE TIMING IS RIGHT. I'LL PUT ${billName} ON THE DOCKET.`,
        ],
      };
      const pool = acceptBarks[npc.temperament] ?? acceptBarks.follower;
      currentBark = {
        text: pool[Math.floor(meetingRng() * pool.length)],
        interjection: null,
        tier: 2,
        tierLabel: "SCHEDULED.",
        dominantDriver: breakdown.dominantDriver,
      };
    } else {
      // Chair refuses
      changeSentiment(npc.id, -3);

      const refuseBarks: Record<string, string[]> = {
        ideologue: [
          "THIS BILL DOESN'T MEET THE STANDARD FOR A HEARING. MY COMMITTEE HAS BETTER WORK TO DO.",
          "I HAVE DEEP RESERVATIONS ABOUT THIS LEGISLATION. THE COMMITTEE'S TIME IS NOT YOURS.",
        ],
        follower: [
          "THE COMMITTEE SCHEDULE IS FULL. THERE'S NO ROOM FOR THIS RIGHT NOW.",
          "LEADERSHIP HAS OTHER PRIORITIES FOR THE COMMITTEE. I CAN'T ACCOMMODATE THIS.",
        ],
        dealmaker: [
          "WHAT EXACTLY WOULD I GAIN FROM GIVING YOU FLOOR TIME? NOTHING. SO NO.",
          "MY COMMITTEE, MY SCHEDULE. YOU HAVEN'T GIVEN ME A REASON TO HELP.",
        ],
        opportunist: [
          "THE VOTES AREN'T THERE. WHY WASTE A HEARING SLOT ON A BILL GOING NOWHERE?",
          "I DON'T SEE THE SUPPORT FOR THIS. COME BACK WHEN THE NUMBERS MAKE SENSE.",
        ],
      };
      const pool = refuseBarks[npc.temperament] ?? refuseBarks.follower;
      currentBark = {
        text: pool[Math.floor(meetingRng() * pool.length)],
        interjection: null,
        tier: 6,
        tierLabel: "DENIED.",
        dominantDriver: breakdown.dominantDriver,
      };
    }
  }

  function doRequestFloorVote(billId: string) {
    subMenu = 'none';
    const targetBill = [gameState.playerBill, ...gameState.npcBills].find(b => b.id === billId);
    if (!targetBill) return;

    const billName = targetBill.name.toUpperCase();

    if (sentimentTier === 'hostile' || sentimentTier === 'cold') {
      changeSentiment(npc.id, -5);
      currentBark = {
        text: "THE FLOOR CALENDAR IS MY DOMAIN. AND YOUR BILL ISN'T ON IT.",
        interjection: null,
        tier: 6,
        tierLabel: "DENIED.",
        dominantDriver: 'party',
      };
    } else {
      scheduleFloorVote(billId);
      changeSentiment(npc.id, -10);

      const acceptBarks: Record<string, string[]> = {
        ideologue: [
          `THE CHAMBER SHOULD DECIDE ON ${billName}. I'LL SCHEDULE THE VOTE.`,
          `EVERY MEMBER DESERVES A VOTE ON ${billName}. I'LL MAKE IT HAPPEN.`,
        ],
        follower: [
          `I'LL MOVE ${billName} TO THE FLOOR. THE INSTITUTION WORKS BEST WHEN WE VOTE.`,
          `THE PROPER PROCESS IS A FLOOR VOTE. ${billName} GOES ON THE CALENDAR.`,
        ],
        dealmaker: [
          `${billName} GOES TO THE FLOOR. YOU OWE ME FOR THIS, AND I ALWAYS COLLECT.`,
          `I'LL SCHEDULE THE VOTE. BUT THIS IS AN EXPENSIVE FAVOR. DON'T FORGET IT.`,
        ],
        opportunist: [
          `THE MOMENT IS NOW OR NEVER FOR ${billName}. I'LL GIVE IT A FLOOR SLOT.`,
          `IF YOU WANT THIS VOTE, YOU'LL HAVE IT. THE CLOCK IS TICKING.`,
        ],
      };
      const pool = acceptBarks[npc.temperament] ?? acceptBarks.follower;
      currentBark = {
        text: pool[Math.floor(meetingRng() * pool.length)],
        interjection: null,
        tier: 2,
        tierLabel: "FLOOR VOTE SCHEDULED.",
        dominantDriver: 'party',
      };
    }
  }

  function acceptTrade(option: TradeOption) {
    // Player accepts trade — NPC agrees to support
    changeSentiment(npc.id, 5);
    if (option.type === 'vote_npc_bill' || option.type === 'cosponsor_npc_bill') {
      addPromise({
        id: generateId('prm'),
        day: gameState.currentDay,
        npcId: npc.id,
        description: option.label,
        type: option.type === 'vote_npc_bill' ? 'vote_yes' : 'cosponsor',
        billId: npc.activeBill ?? undefined,
        fulfilled: null,
      });
    }
    currentBark = {
      text: "THEN WE HAVE A DEAL. I'LL SUPPORT YOUR BILL.",
      interjection: null,
      tier: 2,
      tierLabel: "DEAL.",
      dominantDriver: 'sentiment',
    };
    tradeOptions = [];
    phase = 'ask';
  }

  function resetToVerbs() {
    phase = 'read';
    currentBark = null;
    currentBreakdown = null;
    tradeOptions = [];
    selectedVerb = null;
    subMenu = 'none';
  }

  // ── Intel ledger messages ──
  let intelMessages = $derived((): string[] => {
    const msgs: string[] = [];
    if (npc.party === gameState.player.party) {
      msgs.push('> SAME PARTY');
    } else {
      msgs.push('> OPPOSITION PARTY');
    }
    msgs.push(`> SENIORITY: ${npc.seniority}`);

    // Behavioral hints (NOT temperament labels!)
    if (npc.temperament === 'ideologue') msgs.push('> DRIVEN BY POLICY CONVICTION');
    else if (npc.temperament === 'follower') msgs.push('> CLOSELY TRACKS LEADERSHIP SIGNALS');
    else if (npc.temperament === 'dealmaker') msgs.push('> RESPONDS TO RECIPROCAL FAVORS');
    else if (npc.temperament === 'opportunist') msgs.push('> TRACKS BILL MOMENTUM CLOSELY');

    if (currentBreakdown) {
      msgs.push(`> DOMINANT FACTOR: ${currentBreakdown.dominantDriver.toUpperCase().replace('_', ' ')}`);
    }

    // Role-specific intel
    if (isWhipOrLeader) msgs.push('> CAN PRESSURE OTHER MEMBERS');
    if (isChair) msgs.push('> CONTROLS COMMITTEE SCHEDULE');
    if (isSpeaker) msgs.push('> CONTROLS FLOOR SCHEDULE');
    if (playerOnBudget && npc.hasActiveBill) msgs.push('> YOU CAN OFFER BUDGET ASSISTANCE');

    return msgs;
  });

  function getDiscussionResponse(): string {
    const responses = [
      "WORD AROUND THE CHAMBER IS THERE'S MOVEMENT ON SEVERAL BILLS THIS WEEK.",
      "I'VE BEEN HEARING INTERESTING THINGS ABOUT THE COMMITTEE SCHEDULES.",
      "THERE ARE SOME DEALS BEING MADE BEHIND CLOSED DOORS. THAT'S ALL I'LL SAY.",
      "THE TEMPERATURE ON CERTAIN ISSUES IS SHIFTING. PAY ATTENTION TO THE FLOOR.",
      "SOME COLLEAGUES ARE MORE VULNERABLE THAN THEY LET ON. WATCH THE PRIMARY NUMBERS.",
    ];
    return responses[Math.floor(meetingRng() * responses.length)];
  }

  function getQuickQuestionResponse(): string {
    const responses = [
      "YOU WANT MY READ ON THINGS? THE SESSION IS MOVING FASTER THAN MOST REALIZE.",
      "I'LL SHARE WHAT I CAN. BUT INFORMATION IS A CURRENCY HERE. REMEMBER THAT.",
      "ASK AWAY. BUT I EXPECT THE SAME COURTESY WHEN I NEED ANSWERS.",
      "BRIEFLY, THEN. WHAT DO YOU NEED TO KNOW?",
    ];
    return responses[Math.floor(meetingRng() * responses.length)];
  }
</script>

<div class="meeting-screen">
  <div class="stage-background"></div>

  <!-- Phase Indicator -->
  <div class="phase-indicator">
    <span class="phase-pip" class:phase-active={phase === 'read'}>READ</span>
    <span class="phase-pip" class:phase-active={phase === 'ask'}>ASK</span>
    <span class="phase-pip" class:phase-active={phase === 'offer'}>OFFER</span>
  </div>

  <!-- Character Overlay (left side) -->
  <div class="character-overlay">
    <div class="portrait-frame">
      <div class="pixel-portrait" style="background-color: hsl({npc.name.length * 37 % 360}, 35%, 30%)">
        <span class="portrait-species">{npc.species}</span>
      </div>
    </div>
    <div class="npc-nameplate">
      <div class="npc-title">{npc.name}</div>
      <div class="npc-subtitle">
        {npc.party === 'feralist' ? 'FERALIST' : 'COMMUNALIST'} &bull; SEN. {npc.seniority}
      </div>
    </div>
  </div>

  <!-- Interaction Pane (right side) -->
  <div class="interaction-pane">
    <!-- Dossier Panel -->
    <div class="panel dossier-panel">
      <div class="dossier-header panel-header" style="display: flex; justify-content: space-between;">
        <span>DOSSIER</span>
        <span class="attitude-badge {sentimentTier}">{sentimentTier.toUpperCase()}</span>
      </div>
      <div class="dossier-grid">
        <div class="dossier-cell">
          <span class="dossier-key">PARTY</span>
          <span class="dossier-val">{npc.party === 'feralist' ? 'FERALIST' : 'COMMUNALIST'}</span>
        </div>
        <div class="dossier-cell">
          <span class="dossier-key">SENIORITY</span>
          <span class="dossier-val">{npc.seniority}{#if roleLabel} &bull; <span class="role-badge">{roleLabel}</span>{/if}</span>
        </div>
        {#if showInterests}
          <div class="dossier-cell">
            <span class="dossier-key">INTERESTS</span>
            <span class="dossier-val">{npc.coreInterests.map(i => ISSUE_LABELS[i].split(' & ')[0]).join(', ')}</span>
          </div>
        {:else}
          <div class="dossier-cell">
            <span class="dossier-key">INTERESTS</span>
            <span class="dossier-val" style="color: #888;">UNKNOWN</span>
          </div>
        {/if}
        <div class="dossier-cell">
          <span class="dossier-key">ACTIVE BILL</span>
          <span class="dossier-val">{#if npc.hasActiveBill}YES{:else}NO{/if}</span>
        </div>
        <div class="dossier-cell">
          <span class="dossier-key">MEETINGS</span>
          <span class="dossier-val">{meetingCount}</span>
        </div>
        <div class="dossier-cell">
          <span class="dossier-key">COMMITTEES</span>
          <span class="dossier-val">{committeeNames.length > 0 ? committeeNames.join(', ') : 'NONE'}</span>
        </div>
        <div class="dossier-cell">
          <span class="dossier-key">DISTRICT</span>
          <span class="dossier-val">{npc.district.strongInterests.map(i => ISSUE_LABELS[i].split(' ')[0]).join(', ')}</span>
        </div>
      </div>
    </div>

    <!-- Dialogue Panel -->
    <div class="panel dialogue-panel">
      <div class="dialogue-header panel-header">
        {#if currentBark}
          {currentBark.tierLabel || 'RESPONSE'}
        {:else}
          MEETING WITH {npc.name.toUpperCase()}
        {/if}
      </div>
      <div class="dialogue-body">
        {#if meetingRequest && !npcAskCompleted && npcAskBark}
          <!-- NPC-Initiated Ask -->
          <div class="verb-menu">
            <div class="npc-ask-bark">{npcAskBark}</div>
            {#each npcAskOptions as opt}
              <button class="verb-opt" onclick={() => handleNpcAskResponse(opt.id)}>
                {opt.label}
                <span class="verb-tag">{opt.tag}</span>
              </button>
            {/each}
          </div>
        {:else if phase === 'read' || (phase === 'ask' && !currentBark && subMenu === 'none')}
          <!-- Verb Menu -->
          <div class="verb-menu">
            <div class="verb-label">CHOOSE AN ACTION:</div>
            {#each verbs() as verb}
              {#if verb.available}
                <button class="verb-opt" onclick={() => executeVerb(verb.id)}>
                  {verb.label}
                  <span class="verb-tag">{verb.tag}</span>
                </button>
              {/if}
            {/each}
            <button class="verb-opt verb-exit" onclick={onExit}>
              END MEETING
            </button>
          </div>
        {:else if subMenu === 'lean_target'}
          <!-- Sub-menu: pick NPC to lean on -->
          <div class="verb-menu">
            <div class="verb-label">PRESSURE WHICH MEMBER?</div>
            <div class="sub-menu-list">
              {#each gameState.npcs.filter(n => n.id !== npc.id).sort((a, b) => a.name.localeCompare(b.name)).slice(0, 15) as target}
                <button class="verb-opt" onclick={() => doLeanOn(target.id)}>
                  {target.name.toUpperCase()}
                  <span class="verb-tag">{target.party === 'feralist' ? 'F' : 'C'} &bull; {getSentimentTier(gameState.sentiment[target.id] ?? 0).toUpperCase()}</span>
                </button>
              {/each}
            </div>
            <button class="verb-opt verb-exit" onclick={() => { subMenu = 'none'; resetToVerbs(); }}>CANCEL</button>
          </div>
        {:else if subMenu === 'hearing_bill'}
          <!-- Sub-menu: pick bill for hearing -->
          <div class="verb-menu">
            <div class="verb-label">WHICH BILL SHOULD GET A HEARING?</div>
            {#each pendingBillsInCommittee() as bill}
              <button class="verb-opt" onclick={() => doRequestHearing(bill.id)}>
                #{bill.number}: {bill.name.toUpperCase()}
                <span class="verb-tag">{bill.author === 'player' ? 'YOUR BILL' : 'NPC BILL'}</span>
              </button>
            {/each}
            <button class="verb-opt verb-exit" onclick={() => { subMenu = 'none'; resetToVerbs(); }}>CANCEL</button>
          </div>
        {:else if subMenu === 'floor_bill'}
          <!-- Sub-menu: pick bill for floor vote -->
          <div class="verb-menu">
            <div class="verb-label">WHICH BILL SHOULD GO TO THE FLOOR?</div>
            {#each queuedBills as bill}
              <button class="verb-opt" onclick={() => doRequestFloorVote(bill.id)}>
                #{bill.number}: {bill.name.toUpperCase()}
                <span class="verb-tag">{bill.author === 'player' ? 'YOUR BILL' : 'NPC BILL'}</span>
              </button>
            {/each}
            <button class="verb-opt verb-exit" onclick={() => { subMenu = 'none'; resetToVerbs(); }}>CANCEL</button>
          </div>
        {:else if phase === 'ask' && currentBark}
          <!-- NPC Response -->
          <div class="npc-response">
            {#if currentBark.interjection}
              <div class="interjection">"{currentBark.interjection}"</div>
            {/if}
            <div class="bark-text">"{currentBark.text}"</div>
          </div>

          {#if tradeOptions.length > 0}
            <!-- Trade Options (Tier 4 response) -->
            <div class="trade-section">
              <div class="trade-label">COUNTER-OFFERS:</div>
              {#each tradeOptions as option}
                <button class="verb-opt" onclick={() => acceptTrade(option)}>
                  {option.label}
                  <span class="verb-tag">{option.description}</span>
                </button>
              {/each}
            </div>
          {/if}

          <div class="response-actions">
            <button class="btn" onclick={resetToVerbs}>ANOTHER ACTION</button>
            <button class="btn" onclick={onExit}>END MEETING</button>
          </div>
        {/if}
      </div>
      <!-- Intel Ledger -->
      <div class="intel-ledger">
        {#each intelMessages() as msg}
          <div>{msg}</div>
        {/each}
      </div>
    </div>
  </div>
</div>

<style>
  .meeting-screen {
    width: 100%;
    height: 100%;
    position: relative;
  }
  .stage-background {
    position: absolute;
    width: 100%;
    height: 100%;
    background-color: var(--mahogany);
    background-image: radial-gradient(var(--mahogany-light) 1.5px, transparent 0);
    background-size: 4px 4px;
    z-index: 0;
  }
  .phase-indicator {
    position: absolute;
    top: 10px;
    left: 14px;
    z-index: 2;
    display: flex;
    gap: 6px;
  }
  .phase-pip {
    padding: 2px 10px;
    font-size: 1.1rem;
    color: var(--marble-dark);
    background: var(--mahogany-mid);
    border: 2px solid var(--black);
    text-transform: uppercase;
    font-family: var(--pixel-font);
  }
  .phase-active {
    color: var(--gold);
    background: var(--mahogany);
    border-color: var(--gold);
  }
  .character-overlay {
    position: absolute;
    top: 50px;
    left: 10px;
    width: 250px;
    z-index: 2;
  }
  .portrait-frame {
    padding: 12px;
    background: var(--gold);
    border: 4px solid var(--black);
    box-shadow:
      6px 6px 0px rgba(0, 0, 0, 0.5),
      inset 3px 3px 0px var(--gold-light),
      inset -3px -3px 0px #8a6508;
  }
  .pixel-portrait {
    width: 100%;
    aspect-ratio: 9 / 10;
    border: 3px solid var(--black);
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: inset 4px 4px 0px rgba(0, 0, 0, 0.6);
  }
  .portrait-species {
    font-size: 2rem;
    color: var(--marble);
    text-transform: uppercase;
  }
  .npc-nameplate {
    background: var(--mahogany);
    border: 3px solid var(--black);
    margin-top: 6px;
    padding: 5px 8px;
    text-align: center;
    color: var(--gold);
    font-size: 1.2rem;
    text-transform: uppercase;
    box-shadow: 4px 4px 0px rgba(0, 0, 0, 0.4);
  }
  .npc-title {
    font-size: 1.2rem;
  }
  .npc-subtitle {
    color: var(--marble);
    font-size: 1rem;
  }
  .interaction-pane {
    position: absolute;
    top: 40px;
    right: 14px;
    width: 660px;
    bottom: 14px;
    z-index: 2;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .dossier-panel {
    flex-shrink: 0;
  }
  .dossier-header {
    font-size: 1.3rem;
  }
  .attitude-badge {
    font-size: 1.1rem;
    padding: 0 6px;
    border: 1px solid currentColor;
  }
  .dossier-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  .dossier-cell {
    padding: 3px 10px;
    border-bottom: 1px solid #aaa;
    border-right: 1px solid #aaa;
    display: flex;
    justify-content: space-between;
    font-size: 1.05rem;
  }
  .dossier-cell:nth-child(even) {
    border-right: none;
  }
  .dossier-key {
    color: #555;
  }
  .dossier-val {
    color: var(--black);
    font-weight: bold;
  }
  .role-badge {
    color: var(--gold);
    background: var(--mahogany);
    padding: 0 4px;
    border: 1px solid var(--black);
    font-size: 0.95rem;
  }
  .dialogue-panel {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
  }
  .dialogue-header {
    font-size: 1.2rem;
  }
  .dialogue-body {
    flex: 1;
    padding: 10px 14px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .dialogue-body::-webkit-scrollbar { display: none; }
  .verb-menu {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }
  .verb-label {
    font-size: 1.05rem;
    color: #555;
    margin-bottom: 4px;
  }
  .npc-ask-bark {
    font-size: 1.15rem;
    color: var(--phosphor-green);
    margin-bottom: 6px;
    line-height: 1.3;
  }
  .verb-opt {
    font-size: 1.3rem;
    color: var(--ega-blue);
    cursor: pointer;
    padding: 2px 6px;
    border: 2px solid transparent;
    text-transform: uppercase;
    display: flex;
    align-items: center;
    gap: 6px;
    line-height: 1.2;
    background: none;
    font-family: var(--pixel-font);
    text-align: left;
  }
  .verb-opt:hover {
    background: var(--ega-blue);
    color: white;
    border: 2px solid var(--black);
    box-shadow: inset 2px 2px 0px rgba(255, 255, 255, 0.3);
  }
  .sub-menu-list {
    max-height: 200px;
    overflow-y: auto;
    scrollbar-width: none;
  }
  .sub-menu-list::-webkit-scrollbar { display: none; }
  .verb-exit {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid #aaa;
    color: var(--primary-red);
  }
  .verb-exit:hover {
    background: var(--primary-red);
    color: white;
  }
  .verb-tag {
    font-size: 1rem;
    background: #ddd;
    border: 1px solid #999;
    padding: 0 4px;
    color: #444;
    flex-shrink: 0;
  }
  .npc-response {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  .interjection {
    font-size: 1.3rem;
    color: var(--warm-amber);
    font-style: italic;
    line-height: 1.2;
  }
  .bark-text {
    font-size: 1.6rem;
    color: var(--black);
    line-height: 1.1;
  }
  .trade-section {
    margin-top: 8px;
    border-top: 2px solid #aaa;
    padding-top: 6px;
  }
  .trade-label {
    font-size: 1.05rem;
    color: #555;
    margin-bottom: 4px;
  }
  .response-actions {
    margin-top: auto;
    display: flex;
    gap: 8px;
    justify-content: flex-end;
    padding-top: 8px;
    border-top: 1px solid #aaa;
  }
  .intel-ledger {
    background: #000;
    padding: 8px 10px;
    font-size: 1.1rem;
    border-top: 3px solid var(--black);
    color: var(--phosphor-green);
    line-height: 1.3;
    margin-top: auto;
  }
</style>
