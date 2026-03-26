/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Bark Selection Engine
   5-step pipeline: NW → tier → interjection → driver → temperament → variant
   Pure TypeScript — no Svelte imports.
   ═══════════════════════════════════════════════════════════ */

import type { NPC, GameState, Temperament } from './types';
import type { WillingnessBreakdown, ResponseTier, DominantDriver } from './decision-engine';
import { pick } from './utils';

// Import bark data (will be populated when bark files are ready)
// For now, use a fallback system
let CORE_BARKS: Array<{
  tier: number;
  driver: string;
  temperament: string;
  text: string;
}> = [];

let INTERJECTION_BARKS: Array<{
  trigger: string;
  temperament: string;
  text: string;
}> = [];

let DISCUSSION_BARKS: Array<{
  category: string;
  temperament: string;
  text: string;
}> = [];

// Dynamic import loader — call once at startup
let barksLoaded = false;

export async function loadBarks(): Promise<void> {
  if (barksLoaded) return;
  try {
    const coreModule = await import('../data/barks/core');
    CORE_BARKS = coreModule.CORE_BARKS;
  } catch {
    // Barks not yet converted — use fallback
  }
  try {
    const intModule = await import('../data/barks/interjections');
    INTERJECTION_BARKS = intModule.INTERJECTION_BARKS;
  } catch {}
  try {
    const discModule = await import('../data/barks/discussion');
    DISCUSSION_BARKS = discModule.DISCUSSION_BARKS;
  } catch {}
  barksLoaded = true;
}

// ── Tier labels for display ──
export const TIER_LABELS: Record<ResponseTier, string> = {
  1: 'DONE.',
  2: "I'M WITH YOU ON THIS.",
  3: "I'M LEANING YOUR WAY, BUT...",
  4: "WHAT'S IN IT FOR ME?",
  5: "I CAN'T.",
  6: 'NO.',
  7: 'ABSOLUTELY NOT, AND...',
};

// ── Fallback barks when corpus isn't loaded ──
const FALLBACK_BARKS: Record<ResponseTier, Record<DominantDriver, Record<Temperament, string[]>>> = {
  1: {
    interest: {
      ideologue: ["This is the right thing to do. You have my full support.", "Finally, someone with the conviction to push this forward."],
      follower: ["Leadership has made it clear — we're behind this.", "The party's been waiting for exactly this kind of bill."],
      dealmaker: ["You've earned this. Consider it done.", "We have a good thing going. I'm in."],
      opportunist: ["Everyone's lining up behind this. Smart move — count me in.", "The momentum here is undeniable. I'm on board."],
    },
    sentiment: {
      ideologue: ["I trust your judgment on this. You've proven your principles.", "A colleague of conviction. Done."],
      follower: ["You've shown you understand how things work here. Yes.", "I've seen your loyalty. You have mine."],
      dealmaker: ["You've been good to me. This one's on the house.", "Consider this a return on your investment in our relationship."],
      opportunist: ["You're someone worth being seen with. Done.", "Smart legislators back smart legislators. I'm in."],
    },
    party: {
      ideologue: ["The party's right on this one. Done.", "When principle and party align, the answer is easy."],
      follower: ["The Whip made the call. I'm there.", "This is what leadership wants. No question."],
      dealmaker: ["Being a team player has its rewards. Done.", "The party asks, I deliver. That's how this works."],
      opportunist: ["When the whole caucus moves, you move with them.", "Party unity on this one — easy yes."],
    },
    district: {
      ideologue: ["My constituents deserve this. Full support.", "This is what the people back home need."],
      follower: ["The district's watching, and leadership agrees. Done.", "My voters and my party want the same thing here."],
      dealmaker: ["This plays well back home and here. Win-win.", "Good for the district, good for us. Done."],
      opportunist: ["My district loves this, and primary season approaches. Absolutely.", "The voters want it, and so the answer is yes."],
    },
    faction: {
      ideologue: ["The coalition stands together on this. Full support.", "When all the right voices agree, you listen."],
      follower: ["Our allies are united behind this. I'll follow suit.", "The groups I trust are all saying yes."],
      dealmaker: ["Keeping our allies happy keeps the machine running. Done.", "The coalition wants it. That's good enough for me."],
      opportunist: ["Broad support from the outside? That's a green light.", "When the interest groups line up, you ride the wave."],
    },
    momentum: {
      ideologue: ["The cause is just.", "Principle demands it."],
      follower: ["Leadership says go.", "The party wills it."],
      dealmaker: ["A sound investment.", "Worth the deposit."],
      opportunist: ["The train is leaving the station and everyone's aboard.", "The smart money is all on this. Count me in."],
    },
  },
  2: {
    interest: {
      ideologue: ["I believe in what you're trying to do here. You have my vote.", "This aligns with what I've been fighting for. I'm in."],
      follower: ["The policy makes sense, and leadership hasn't objected. I'll support it.", "This fits the party platform. I can work with this."],
      dealmaker: ["The substance is solid. I'll back you — and remember this later.", "Good policy makes good politics. You've got my support."],
      opportunist: ["The issue is trending your way. I'll get on board.", "This has traction in the right circles. Count me in."],
    },
    sentiment: {
      ideologue: ["I respect your commitment. You've earned my support on this.", "We don't always agree, but you've shown integrity. I'm in."],
      follower: ["You've been reliable. I can back you on this.", "We have a good working relationship. I'll support it."],
      dealmaker: ["You've been square with me. I can be square with you here.", "Our account's in good shape. I'll make this work."],
      opportunist: ["You're building something real here. I want to be part of it.", "Being associated with you on this? That works for me."],
    },
    party: {
      ideologue: ["The party's position is sound on this. I'll stand with you.", "When the cause is just and the party agrees, it's easy."],
      follower: ["The Whip is on board, so I'm on board.", "Leadership supports this. That's enough for me."],
      dealmaker: ["Party unity has value. I'll invest in it.", "Keeping the caucus together is worth the cost here."],
      opportunist: ["The party's moving this direction anyway. Might as well lead.", "Smart play — the caucus is behind this."],
    },
    district: {
      ideologue: ["My district would want me to do the right thing here.", "This serves the people I represent. I'm in."],
      follower: ["The folks back home align with party on this. I'll support it.", "No pushback from the district. I can vote yes."],
      dealmaker: ["Plays well at home. That's worth my vote.", "A yes vote here is an investment in my reelection."],
      opportunist: ["My constituents are paying attention to this one. I'll be on the right side.", "Primary is coming and this is a popular position. Yes."],
    },
    faction: {
      ideologue: ["Our allies in the advocacy world agree. Good enough for me.", "The coalition sees the merit here."],
      follower: ["Our external partners support this. I'll go along.", "The groups we work with want this. I'm in."],
      dealmaker: ["Happy allies mean stable coalitions. Worth my vote.", "Supporting this keeps important relationships intact."],
      opportunist: ["Strong outside support means lower risk. I'll back it.", "When the advocacy groups line up, it's usually safe to follow."],
    },
    momentum: {
      ideologue: ["The cause has weight.", "Principle endures."],
      follower: ["The party aligns.", "We follow."],
      dealmaker: ["A reasonable investment.", "The terms work."],
      opportunist: ["The cosponsor list is impressive. I'll add my name.", "This bill has legs. I want to be on the right side of this."],
    },
  },
  3: {
    interest: {
      ideologue: ["I see the merit, but the principle needs to be sharper.", "You're close, but the substance isn't quite there for me yet."],
      follower: ["The policy direction is right, but I need to check with leadership.", "I like where this is going. Let me see what the party thinks."],
      dealmaker: ["The bones are good. Let's talk about what makes it better.", "I could see supporting this — with the right adjustments."],
      opportunist: ["Interesting bill. Needs a few more names on it before I commit.", "I'm watching this one. Not ready to jump yet."],
    },
    sentiment: {
      ideologue: ["I respect you, but respect alone doesn't change policy.", "You're good people. I just need more on the substance."],
      follower: ["We get along well. Let me see if I can make this work.", "I want to help you, but I need cover from above."],
      dealmaker: ["We've built something here. Let's not waste it on a bad deal.", "I like you. Help me help you — what else is on the table?"],
      opportunist: ["You're someone I want to stay close to. Let me think about this.", "I value our association. But I need to see where this goes first."],
    },
    party: {
      ideologue: ["The party's leaning this way, but I need to see principle, not just politics.", "Party loyalty has limits. Show me the substance."],
      follower: ["The Whip hasn't weighed in hard yet. I'm waiting.", "If leadership gives the green light, I'm there. Not before."],
      dealmaker: ["I'll consider party unity — if it comes with something for me.", "The party line is one factor. What's the other?"],
      opportunist: ["The caucus is split. I need to see which way it breaks.", "Too early to call this a party position. I'm waiting."],
    },
    district: {
      ideologue: ["My constituents have concerns. I need to honor those.", "The district sees both sides here. I need more."],
      follower: ["Folks back home are on the fence. I need guidance.", "My district could go either way on this."],
      dealmaker: ["Tricky at home. Make it worth my while.", "My district's mixed. I need something to sweeten the deal."],
      opportunist: ["My polling is ambiguous on this. Not ready to commit.", "Need to see how this plays in the district before I move."],
    },
    faction: {
      ideologue: ["Some allies support this, others don't. I need clarity.", "The coalition isn't unified here."],
      follower: ["Waiting to see where our partners land on this.", "The advocacy groups are still sorting themselves out."],
      dealmaker: ["Mixed signals from our allies. That means there's a deal to be made.", "Some interests are for it, some against. Let's negotiate."],
      opportunist: ["The outside groups are divided. That's a yellow light for me.", "When the coalition fractures, I wait."],
    },
    momentum: {
      ideologue: ["Principles aren't polls.", "The cause must be clear."],
      follower: ["Leadership hasn't signaled.", "I'm awaiting direction."],
      dealmaker: ["Show me the terms.", "There's a deal here somewhere."],
      opportunist: ["It's building, but not there yet. A few more cosponsors and we'll talk.", "The trajectory is promising but I don't bet on promises."],
    },
  },
  4: {
    interest: {
      ideologue: ["The substance doesn't move me. What else have you got?", "I don't see the principle here. Convince me otherwise."],
      follower: ["This doesn't fit our platform. Unless something changes...", "I'd need cover from leadership to touch this."],
      dealmaker: ["Interesting. But what are you offering in return?", "Nothing's free in this building. What's your proposal?"],
      opportunist: ["I don't see the upside yet. What's in it for me?", "The numbers don't work. What else you got?"],
    },
    sentiment: {
      ideologue: ["We're not close enough for me to take a risk on this.", "I don't owe you anything. Make your case on merit."],
      follower: ["We don't have that kind of relationship yet.", "I'd need to trust you more before I go out on a limb."],
      dealmaker: ["Our account is thin. You need to make a deposit first.", "We need to build more before I can spend on this."],
      opportunist: ["Backing you here doesn't help me. Change my mind.", "I need a reason to be associated with this."],
    },
    party: {
      ideologue: ["The party line isn't enough. I need principle.", "Don't cite party to me. Show me why it's right."],
      follower: ["Leadership hasn't pushed this. I can't move without them.", "No signal from the Whip. My hands are tied."],
      dealmaker: ["Party loyalty is worth something, but not everything. Sweeten the deal.", "The party wants a lot from me. What do I get back?"],
      opportunist: ["The party's divided on this. I'm not picking sides for free.", "When the caucus can't agree, I need a better reason."],
    },
    district: {
      ideologue: ["My district doesn't care about this. Why should I?", "This doesn't serve the people I represent."],
      follower: ["No mandate from home on this. I need more.", "My constituents aren't asking for this."],
      dealmaker: ["Doesn't play in my district. Unless you can help with that.", "I need something that works back home."],
      opportunist: ["My voters are indifferent. That means I need another angle.", "No electoral upside. What else is on the table?"],
    },
    faction: {
      ideologue: ["Our allies are silent on this. That tells me something.", "No coalition support means no principle. Pass."],
      follower: ["Without our partners behind it, I can't justify this.", "I follow the coalition. The coalition isn't here."],
      dealmaker: ["The interest groups aren't interested. That's a problem — and an opportunity.", "If you can bring the allies around, we'll talk."],
      opportunist: ["No outside support means no cover. Not interested yet.", "When the advocacy world speaks up, I'll listen."],
    },
    momentum: {
      ideologue: ["Principles don't negotiate.", "The substance must speak."],
      follower: ["I need direction.", "Awaiting the signal."],
      dealmaker: ["Name your price.", "Everything has a cost."],
      opportunist: ["Too few cosponsors. Too little buzz. What's the play?", "This bill is going nowhere and we both know it. What are you really offering?"],
    },
  },
  5: {
    interest: {
      ideologue: ["This goes against what I believe in. I can't support it.", "My principles won't allow it. The policy is wrong."],
      follower: ["The party position is clear, and it's not with you.", "Leadership has concerns. I have to defer."],
      dealmaker: ["The math doesn't work. I'd be losing too much.", "You're asking me to spend capital I don't have."],
      opportunist: ["This bill is struggling. I can't be attached to a loser.", "The political winds are blowing against this."],
    },
    sentiment: {
      ideologue: ["We don't have the kind of trust this would require.", "I'm not convinced you'll be there when I need you."],
      follower: ["Our relationship isn't there yet. Sorry.", "I can't stick my neck out for someone I barely know."],
      dealmaker: ["You haven't put enough in the bank to ask for this.", "Come back when we've built something worth spending."],
      opportunist: ["Being seen with you on this doesn't help me.", "I need allies who can deliver. Not yet convinced."],
    },
    party: {
      ideologue: ["This breaks with everything the party stands for.", "I can't go against the party when they're right."],
      follower: ["The Whip said no. That's the end of the conversation.", "Leadership is opposed. I won't cross them."],
      dealmaker: ["Crossing the party costs more than you're offering.", "The party price is too high to pay here."],
      opportunist: ["The party's against this and I'm not picking that fight.", "Going against the caucus now would be political suicide."],
    },
    district: {
      ideologue: ["My district deserves better than this.", "I answer to my constituents, and they oppose this."],
      follower: ["The folks back home are against it. I can't move.", "My district won't forgive a yes vote on this."],
      dealmaker: ["A yes vote costs me at home. The price just went up.", "My district's opposition makes this very expensive."],
      opportunist: ["With my primary coming, I can't touch this.", "Electoral math says no. Simple as that."],
    },
    faction: {
      ideologue: ["Our coalition stands firmly against this. So do I.", "The voices I trust are all saying no."],
      follower: ["Our partners have come out against this. I follow.", "The coalition has spoken. I'm with them."],
      dealmaker: ["Opposing our allies costs me relationships. Not worth it.", "I can't alienate the people who fund my campaigns."],
      opportunist: ["The outside groups are opposed. That makes this radioactive.", "No institutional support means no political cover."],
    },
    momentum: {
      ideologue: ["Wrong is wrong regardless.", "No amount of support changes bad policy."],
      follower: ["The leadership has spoken.", "I follow the party."],
      dealmaker: ["Bad investment.", "The returns aren't there."],
      opportunist: ["This is a sinking ship. I'm not going down with it.", "Dead on arrival. Smart money is staying away."],
    },
  },
  6: {
    interest: {
      ideologue: ["This is fundamentally wrong. No.", "Everything about this bill offends my principles."],
      follower: ["The party has made it clear. The answer is no.", "Leadership is firmly opposed. Don't ask again."],
      dealmaker: ["There is no deal that makes this work. No.", "You'd need to offer me the moon, and even then."],
      opportunist: ["This is toxic. No one with sense is touching this.", "Politically radioactive. My answer is no."],
    },
    sentiment: {
      ideologue: ["I don't trust you, and I don't trust this bill.", "You've given me no reason to even consider this."],
      follower: ["After how things have gone between us? No.", "Our relationship doesn't warrant this kind of ask."],
      dealmaker: ["You've taken from this relationship and given nothing back. No.", "Our account is deep in the red. Don't come to me with asks."],
      opportunist: ["Associating with you is a liability. No.", "Your reputation precedes you, and it says stay away."],
    },
    party: {
      ideologue: ["This betrays the party's core principles. Absolutely not.", "The party exists for a reason. This undermines it."],
      follower: ["The Whip would have my head. Not happening.", "Leadership would never forgive a yes vote. No."],
      dealmaker: ["Party discipline is non-negotiable on this one.", "Crossing the party here would cost me everything."],
      opportunist: ["The party is unified against this. You're on your own.", "Going against a unified caucus? Not a chance."],
    },
    district: {
      ideologue: ["My constituents elected me to stop exactly this.", "This is everything my district opposes."],
      follower: ["My district made their position clear. No.", "The people back home would never forgive this."],
      dealmaker: ["A yes vote ends my career. Not for sale.", "No amount of favors is worth losing my seat."],
      opportunist: ["With my primary? Are you serious? No.", "This is electoral poison. Get it away from me."],
    },
    faction: {
      ideologue: ["Every principled voice opposes this. So do I.", "The coalition stands firm. No."],
      follower: ["Our allies have drawn a line. I won't cross it.", "The organizations I answer to say no."],
      dealmaker: ["My allies would cut me off. No deal is worth that.", "The institutional price is too high."],
      opportunist: ["Wall-to-wall opposition from the outside. Hard no.", "When every interest group says no, you listen."],
    },
    momentum: {
      ideologue: ["Wrong from root to branch.", "My conscience is clear."],
      follower: ["The answer from above is final.", "No means no."],
      dealmaker: ["Not at any price.", "Some deals can't be made."],
      opportunist: ["This bill is dead and you're the only one who doesn't see it.", "Zero momentum. Zero support. Zero chance."],
    },
  },
  7: {
    interest: {
      ideologue: ["This is an abomination. I'll see it destroyed.", "I will fight this with everything I have."],
      follower: ["Leadership wants this killed, and so do I.", "The party will crush this, and I'll help them do it."],
      dealmaker: ["You've wasted my time. There will be a cost.", "This ask was an insult. Remember that."],
      opportunist: ["This is career poison. Coming to me with this was a mistake.", "I'll be remembered for stopping this disaster."],
    },
    sentiment: {
      ideologue: ["Don't ever bring this to me again.", "You've shown your true colors."],
      follower: ["After this, I'll be talking to leadership about you.", "Consider our working relationship over."],
      dealmaker: ["You've burned a bridge today. A permanent one.", "Whatever we had, you just spent it. And then some."],
      opportunist: ["I'll make sure everyone knows you're desperate enough to ask me this.", "Associating with you on anything just became a liability."],
    },
    party: {
      ideologue: ["You're a disgrace to the party, and this bill proves it.", "The party will remember this betrayal."],
      follower: ["Leadership will hear about this. All of it.", "The Whip is going to have questions for you."],
      dealmaker: ["You've made an enemy of the entire caucus today.", "The party's patience has limits. You just found them."],
      opportunist: ["The caucus will eat you alive for this. I almost pity you.", "You just handed your opponents everything they need."],
    },
    district: {
      ideologue: ["My constituents will see you stopped. Count on it.", "I represent people who will fight this tooth and nail."],
      follower: ["My district will campaign against you personally.", "The people back home will hear about this."],
      dealmaker: ["You've made an enemy of my entire district. Good luck with that.", "The political cost of crossing my voters? You'll find out."],
      opportunist: ["You just became my opponent's best campaign ad.", "My primary opponent thanks you for this gift."],
    },
    faction: {
      ideologue: ["The coalition will mobilize against you.", "Every principled organization in this body will oppose you now."],
      follower: ["Our allies will make sure this never sees daylight.", "The institutional machinery is about to turn against you."],
      dealmaker: ["You've united every interest group against you. Congratulations.", "The coalition will remember this. They always do."],
      opportunist: ["You just made every lobby in town your enemy.", "The advocacy world will bury this — and you with it."],
    },
    momentum: {
      ideologue: ["This ends here.", "Justice demands opposition."],
      follower: ["The party will crush this.", "Leadership has spoken."],
      dealmaker: ["There will be consequences.", "Debts are owed now."],
      opportunist: ["You're finished and this proves it.", "Dead in the water. And I'll make sure of it."],
    },
  },
};

// ══════════════════════════════════════════════════════════════
// MAIN BARK SELECTION PIPELINE (5 steps)
// ══════════════════════════════════════════════════════════════

export interface BarkResult {
  text: string;
  interjection: string | null;
  tier: ResponseTier;
  tierLabel: string;
  dominantDriver: DominantDriver;
}

export function selectBark(
  rng: () => number,
  npc: NPC,
  breakdown: WillingnessBreakdown,
  state: GameState,
): BarkResult {
  const tier = breakdown.tier;
  const driver = breakdown.dominantDriver;
  const temperament = npc.temperament;

  // Step 1: Response tier (already calculated in breakdown)

  // Step 2: Check interjection triggers
  const interjection = selectInterjection(rng, npc, state);

  // Step 3-5: Select bark by tier → driver → temperament → random variant
  let text: string;

  // Try loaded corpus first
  if (CORE_BARKS.length > 0) {
    const candidates = CORE_BARKS.filter(b =>
      b.tier === tier && b.driver === driver && b.temperament === temperament
    );
    if (candidates.length > 0) {
      text = pick(rng, candidates).text;
    } else {
      // Fallback to any bark of same tier and temperament
      const fallbackCandidates = CORE_BARKS.filter(b =>
        b.tier === tier && b.temperament === temperament
      );
      text = fallbackCandidates.length > 0
        ? pick(rng, fallbackCandidates).text
        : getFallbackBark(rng, tier, driver, temperament);
    }
  } else {
    // Use inline fallbacks
    text = getFallbackBark(rng, tier, driver, temperament);
  }

  return {
    text,
    interjection,
    tier,
    tierLabel: TIER_LABELS[tier],
    dominantDriver: driver,
  };
}

function getFallbackBark(
  rng: () => number,
  tier: ResponseTier,
  driver: DominantDriver,
  temperament: Temperament,
): string {
  const tierBarks = FALLBACK_BARKS[tier];
  const driverBarks = tierBarks[driver];
  const variants = driverBarks[temperament];
  return pick(rng, variants);
}

function selectInterjection(
  rng: () => number,
  npc: NPC,
  state: GameState,
): string | null {
  // Check various trigger conditions
  const triggers: Array<{ condition: boolean; trigger: string }> = [
    {
      condition: state.promises.some(p => p.npcId === npc.id && p.fulfilled === false),
      trigger: 'broken_promise',
    },
    {
      condition: npc.isLameDuck,
      trigger: 'npc_lame_duck',
    },
    {
      condition: npc.hasActiveBill && state.npcBills.some(b => b.author === npc.id && b.stage === 'dead'),
      trigger: 'bill_died',
    },
    {
      condition: state.isLameDuck,
      trigger: 'player_lame_duck',
    },
    {
      condition: (state.knownInfo.meetingCount[npc.id] ?? 0) === 0,
      trigger: 'first_meeting',
    },
  ];

  const activeTriggers = triggers.filter(t => t.condition);
  if (activeTriggers.length === 0) return null;

  // Pick one triggered interjection
  const selected = pick(rng, activeTriggers);

  // Try loaded interjections first
  if (INTERJECTION_BARKS.length > 0) {
    const candidates = INTERJECTION_BARKS.filter(b =>
      b.trigger === selected.trigger &&
      (b.temperament === npc.temperament || b.temperament === 'any')
    );
    if (candidates.length > 0) return pick(rng, candidates).text;
  }

  // Fallback interjections
  const fallbacks: Record<string, string[]> = {
    broken_promise: [
      "Before we begin — you broke your word to me. I haven't forgotten.",
      "I remember your promises. Apparently, you don't.",
    ],
    npc_lame_duck: [
      "You're talking to a lame duck. I've got nothing left to lose.",
      "My primary is over and so is my career. So let's be honest.",
    ],
    bill_died: [
      "My bill just died. I hope you're not here to ask for favors.",
      "You caught me at a bad time. My legislation just went down.",
    ],
    player_lame_duck: [
      "A lame duck, asking for help. Bold.",
      "Your career's over, and you're still making asks. Respect.",
    ],
    first_meeting: [
      "So the freshman finally comes calling.",
      "I wondered when you'd get around to me.",
    ],
  };

  const options = fallbacks[selected.trigger] ?? ["Hmm."];
  return pick(rng, options);
}

/**
 * Select a discussion bark for the ASK > DISCUSS verb.
 */
export function selectDiscussionBark(
  rng: () => number,
  npc: NPC,
  category: string,
): string {
  if (DISCUSSION_BARKS.length > 0) {
    const candidates = DISCUSSION_BARKS.filter(b =>
      b.category === category &&
      (b.temperament === npc.temperament || b.temperament === 'any')
    );
    if (candidates.length > 0) return pick(rng, candidates).text;
  }

  // Fallback
  const fallbacks: Record<string, string[]> = {
    information_share: [
      "Here's what I've been hearing in the halls...",
      "I might know something useful. Depends on what it's worth.",
    ],
    opinion_probe: [
      "You want to know what I think? Are you sure?",
      "My opinion isn't free, but since you asked...",
    ],
  };
  return pick(rng, fallbacks[category] ?? ["Interesting question."]);
}
