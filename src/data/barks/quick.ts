export interface QuickBark {
  type: 'ambush' | 'vote_read' | 'intel_reaction' | 'holding_up';
  category: string;
  temperament: 'ideologue' | 'follower' | 'dealmaker' | 'opportunist' | 'any';
  text: string;
}

export const QUICK_BARKS: QuickBark[] = [
  // ============================================================ //
  // AMBUSH OPENING ASKS (39 barks)
  // NPC intercepts the player with an urgent request.
  // ============================================================ //

  // --- Vote Ask --- //
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'ideologue',
    text: "This is the line — your vote determines which side you're actually on.",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'ideologue',
    text: "Tomorrow we find out who believes what they claim to believe.",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'ideologue',
    text: "Floor vote tomorrow — this one separates the serious from the comfortable.",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'follower',
    text: "Leadership's calling in markers tomorrow — you with us or not?",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'follower',
    text: "The Whip's expecting our votes tomorrow — I'm assuming you got the message?",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'follower',
    text: "Tomorrow's the tell — party's unified on this and we move as one.",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'dealmaker',
    text: "Tomorrow I get my vote and you get to cash in whatever you need later.",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'dealmaker',
    text: "I need your vote tomorrow — don't worry, I keep meticulous records.",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'dealmaker',
    text: "One vote tomorrow, and I'm very good at returning favors.",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'opportunist',
    text: "We're voting tomorrow and this one's close — be on the winning side.",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'opportunist',
    text: "Tomorrow's vote is shaping up to be tight — you want to ride the wave or drown in it?",
  },
  {
    type: 'ambush',
    category: 'vote_ask',
    temperament: 'opportunist',
    text: "The numbers say tomorrow's ours if we hold — don't be the one who breaks.",
  },

  // --- Cosponsor Ask --- //
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'ideologue',
    text: "This needs your name on it — not anonymously, publicly — do you believe it or not?",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'ideologue',
    text: "I need a public partner, not a secret supporter — are you actually in?",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'ideologue',
    text: "Put your name on something that matters and means something — that's what I'm asking.",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'follower',
    text: "Leadership wants visible backing — your name on this shows we're serious.",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'follower',
    text: "I'm asking you to be out front with us — leadership needs to see commitment.",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'follower',
    text: "My bill needs your name — party unity, visible unity.",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'dealmaker',
    text: "I need you attached to this publicly — you'll be remembered as the one who showed up.",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'dealmaker',
    text: "Your name on my cosponsor list is a favor I will never forget.",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'dealmaker',
    text: "Cosponsorship — public, permanent, and I keep a long memory of who did.",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'opportunist',
    text: "This is shaping up to be the bill everyone wants credit for — get in now.",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'opportunist',
    text: "The traction's building on this — first movers get the credit.",
  },
  {
    type: 'ambush',
    category: 'cosponsor_ask',
    temperament: 'opportunist',
    text: "This one's going somewhere — put your name on it before it becomes obvious.",
  },

  // --- Whip Instruction --- //
  {
    type: 'ambush',
    category: 'whip_instruction',
    temperament: 'any',
    text: "You're on this vote — leadership expects your yes, don't disappoint.",
  },
  {
    type: 'ambush',
    category: 'whip_instruction',
    temperament: 'any',
    text: "This is a whip count — we need you locked, are we locked?",
  },
  {
    type: 'ambush',
    category: 'whip_instruction',
    temperament: 'any',
    text: "Leadership directed me to your office — your vote is expected tomorrow, confirmed?",
  },

  // --- Help Request --- //
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'ideologue',
    text: "I need you to talk to the chair about this — only someone they respect could move them.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'ideologue',
    text: "I need you to lean on the chair — you're one of the few they actually listen to.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'ideologue',
    text: "Can you get a meeting with the chair and explain why this matters?",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'follower',
    text: "I need you to use your leadership relationships — get the chair to move on this.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'follower',
    text: "Can you reach out to leadership about this? You have credibility I don't.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'follower',
    text: "I need a word in the right ears — you know who those are.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'dealmaker',
    text: "I need a favor — real pressure on the chair — and I'll remember who came through.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'dealmaker',
    text: "Get the chair to budge on this for me — I'll owe you one, and I always pay.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'dealmaker',
    text: "I need you to squeeze the chair — call it a favor and we'll settle up later.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'opportunist',
    text: "If you could move the chair on this, the whole dynamic shifts — you'd be the catalyst.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'opportunist',
    text: "The chair's the bottleneck — get them moving and this rolls.",
  },
  {
    type: 'ambush',
    category: 'help_request',
    temperament: 'opportunist',
    text: "Get the chair to say yes and suddenly everyone else moves — big moment if you're the one.",
  },

  // ============================================================ //
  // QUICK QUESTION VOTE READS (36 barks)
  // Player asks "how will you vote?" in a hallway.
  // ============================================================ //

  // --- Supportive --- //
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'ideologue',
    text: "This passes the test — you'll have my vote.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'ideologue',
    text: "I've looked at this carefully — the answer is yes.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'ideologue',
    text: "This is the right position and I'm holding it.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'follower',
    text: "Leadership's got this — I'm locked in behind them.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'follower',
    text: "The party's solid on this — count me.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'follower',
    text: "I checked with leadership — you've got me.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'dealmaker',
    text: "I don't see a downside for me here — you're solid.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'dealmaker',
    text: "No one's offered me anything better, so your vote has my vote.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'dealmaker',
    text: "Works for me — no complications, no debts, no problems.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'opportunist',
    text: "This is heading in the right direction — I'm on it for now.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'opportunist',
    text: "The wind's in your favor — I'll ride it.",
  },
  {
    type: 'vote_read',
    category: 'supportive',
    temperament: 'opportunist',
    text: "Numbers look good — as of today, yes.",
  },

  // --- Noncommittal --- //
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'ideologue',
    text: "I'm still deciding if this is what it claims to be.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'ideologue',
    text: "Depends on whether you can convince me the principle holds.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'ideologue',
    text: "I need to understand the actual argument — the merits still matter to me.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'follower',
    text: "I haven't gotten clarity from leadership yet — once I do, I'm there.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'follower',
    text: "Waiting on the party line — can't move until I know what we're doing.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'follower',
    text: "The signal hasn't come down — I'll vote with the caucus once it does.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'dealmaker',
    text: "Nothing on the table yet that moves me either way.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'dealmaker',
    text: "What else are you offering? Context changes things.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'dealmaker',
    text: "I'm not opposed — just depends what you're willing to put up.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'opportunist',
    text: "Still too close to call — check in when things tighten.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'opportunist',
    text: "Could go either way right now — I'm watching the margins.",
  },
  {
    type: 'vote_read',
    category: 'noncommittal',
    temperament: 'opportunist',
    text: "Not enough signal yet — too early for me to pick a side.",
  },

  // --- Resistant --- //
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'ideologue',
    text: "I have fundamental problems with what this actually does — don't count on me.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'ideologue',
    text: "The principle's flawed — that's not negotiable for me.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'ideologue',
    text: "This isn't what you're selling it as, and I won't vote for the real thing.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'follower',
    text: "Leadership's against this — so am I.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'follower',
    text: "The party decided, and that decision didn't go your way.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'follower',
    text: "I checked with the Whip — we're sitting this one out.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'dealmaker',
    text: "Not unless something changes — and by something, I mean an offer.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'dealmaker',
    text: "You'd have to sweeten this considerably for me to move.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'dealmaker',
    text: "I'm a no unless there's a reason to be anything else.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'opportunist',
    text: "This is losing traction — I'm not riding a losing bill.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'opportunist',
    text: "The numbers aren't there and they're getting worse — I'm out.",
  },
  {
    type: 'vote_read',
    category: 'resistant',
    temperament: 'opportunist',
    text: "You're fighting uphill on this one — I back winners.",
  },

  // ============================================================ //
  // "I HEARD SOMETHING" REACTIONS (18 barks)
  // NPC reacts to player sharing intelligence. Not filtered by temperament.
  // ============================================================ //

  // --- Grateful (Warm/Allied, useful intel) --- //
  {
    type: 'intel_reaction',
    category: 'grateful',
    temperament: 'any',
    text: "That's the kind of intel that actually changes the board — I owe you one, a real one.",
  },
  {
    type: 'intel_reaction',
    category: 'grateful',
    temperament: 'any',
    text: "You just saved me from walking into a knife — I won't forget this.",
  },
  {
    type: 'intel_reaction',
    category: 'grateful',
    temperament: 'any',
    text: "This is exactly the piece I was missing — you're better than than I thought.",
  },
  {
    type: 'intel_reaction',
    category: 'grateful',
    temperament: 'any',
    text: "I needed to hear that more than you know — seriously, thank you.",
  },
  {
    type: 'intel_reaction',
    category: 'grateful',
    temperament: 'any',
    text: "You went out of your way for this — that matters to me, it actually matters.",
  },

  // --- Appreciative (Neutral, useful intel) --- //
  {
    type: 'intel_reaction',
    category: 'appreciative',
    temperament: 'any',
    text: "Good intel — I'll tuck that away and see where it lands.",
  },
  {
    type: 'intel_reaction',
    category: 'appreciative',
    temperament: 'any',
    text: "That's the kind of detail that separates the amateurs from the planners.",
  },
  {
    type: 'intel_reaction',
    category: 'appreciative',
    temperament: 'any',
    text: "Thanks for the heads-up — forewarned is forearmed.",
  },
  {
    type: 'intel_reaction',
    category: 'appreciative',
    temperament: 'any',
    text: "Appreciate you bringing that to me directly — it stays between us.",
  },

  // --- Dismissive (Cold, or irrelevant intel) --- //
  {
    type: 'intel_reaction',
    category: 'dismissive',
    temperament: 'any',
    text: "Old news travels fast, doesn't it?",
  },
  {
    type: 'intel_reaction',
    category: 'dismissive',
    temperament: 'any',
    text: "I appreciate the effort, but I've been hearing whispers about that for weeks.",
  },
  {
    type: 'intel_reaction',
    category: 'dismissive',
    temperament: 'any',
    text: "Is that supposed to surprise me? People talk — usually they're wrong.",
  },
  {
    type: 'intel_reaction',
    category: 'dismissive',
    temperament: 'any',
    text: "Thanks for the thought, but I've heard worse rumors from better sources.",
  },

  // --- Alarmed (threat to this NPC, any sentiment) --- //
  {
    type: 'intel_reaction',
    category: 'alarmed',
    temperament: 'any',
    text: "Wait — who exactly told you this? And how sure are we that they're not bluffing?",
  },
  {
    type: 'intel_reaction',
    category: 'alarmed',
    temperament: 'any',
    text: "That changes everything — if that's real, I need to move now.",
  },
  {
    type: 'intel_reaction',
    category: 'alarmed',
    temperament: 'any',
    text: "You're not joking, are you? Because if you're joking, that's not funny.",
  },
  {
    type: 'intel_reaction',
    category: 'alarmed',
    temperament: 'any',
    text: "That's not just a rumor, is it? You wouldn't bring me this if it wasn't solid.",
  },
  {
    type: 'intel_reaction',
    category: 'alarmed',
    temperament: 'any',
    text: "How long have you known this? And who else is talking?",
  },

  // ============================================================ //
  // "HOW ARE YOU HOLDING UP?" RESPONSES (20 barks)
  // Late-night check-ins. Not filtered by temperament.
  // ============================================================ //

  // --- Warm/Allied — Low Stress --- //
  {
    type: 'holding_up',
    category: 'warm_low_stress',
    temperament: 'any',
    text: "Keeping my head above water and plotting my next move — could be worse.",
  },
  {
    type: 'holding_up',
    category: 'warm_low_stress',
    temperament: 'any',
    text: "Not complaining — the game's still fun when you're not losing yet.",
  },
  {
    type: 'holding_up',
    category: 'warm_low_stress',
    temperament: 'any',
    text: "Living the dream, more or less — or a reasonable facsimile of it.",
  },
  {
    type: 'holding_up',
    category: 'warm_low_stress',
    temperament: 'any',
    text: "Better than I deserve to be, truth be told.",
  },

  // --- Warm/Allied — High Stress --- //
  {
    type: 'holding_up',
    category: 'warm_high_stress',
    temperament: 'any',
    text: "Between us? I'm running on fumes and spite right now — not sure how much longer that lasts.",
  },
  {
    type: 'holding_up',
    category: 'warm_high_stress',
    temperament: 'any',
    text: "I don't think I'm going to make it through this one the same way I came in — but I'm glad it's you asking.",
  },
  {
    type: 'holding_up',
    category: 'warm_high_stress',
    temperament: 'any',
    text: "I'm terrified — everything I built is collapsing and I keep pretending it's fine. You're the first person to actually ask.",
  },
  {
    type: 'holding_up',
    category: 'warm_high_stress',
    temperament: 'any',
    text: "I'm still standing, but just barely — some days I don't know if that's enough anymore.",
  },

  // --- Neutral — Low Stress --- //
  {
    type: 'holding_up',
    category: 'neutral_low_stress',
    temperament: 'any',
    text: "Can't complain — well, I can, but it would take all night and you'd hate me for it.",
  },
  {
    type: 'holding_up',
    category: 'neutral_low_stress',
    temperament: 'any',
    text: "Surviving — which in this town passes for thriving.",
  },
  {
    type: 'holding_up',
    category: 'neutral_low_stress',
    temperament: 'any',
    text: "Same as always — too busy to fall apart, too tired to celebrate.",
  },

  // --- Neutral — High Stress --- //
  {
    type: 'holding_up',
    category: 'neutral_high_stress',
    temperament: 'any',
    text: "I'll manage — always do, might take a few years off my life, but I'll manage.",
  },
  {
    type: 'holding_up',
    category: 'neutral_high_stress',
    temperament: 'any',
    text: "It's been a week — but that's what the job is, stringing together difficult weeks.",
  },
  {
    type: 'holding_up',
    category: 'neutral_high_stress',
    temperament: 'any',
    text: "Keeping it together — that's the professional answer. Want the real one?",
  },

  // --- Cold/Hostile — Any Stress --- //
  {
    type: 'holding_up',
    category: 'cold_any_stress',
    temperament: 'any',
    text: "I don't need you checking in on me — we're not that kind of relationship.",
  },
  {
    type: 'holding_up',
    category: 'cold_any_stress',
    temperament: 'any',
    text: "I'm fine — and I don't appreciate the implications of that question.",
  },
  {
    type: 'holding_up',
    category: 'cold_any_stress',
    temperament: 'any',
    text: "I didn't realize we were close enough for this conversation — we're not.",
  },

  // --- Lame Duck — Any Stress --- //
  {
    type: 'holding_up',
    category: 'lame_duck',
    temperament: 'any',
    text: "Lost my election and they still haven't thrown me out — turns out being expendable is actually liberating.",
  },
  {
    type: 'holding_up',
    category: 'lame_duck',
    temperament: 'any',
    text: "I'm a dead member walking and it's the most honest I've felt in years — so, surprisingly well.",
  },
  {
    type: 'holding_up',
    category: 'lame_duck',
    temperament: 'any',
    text: "My career imploded and I'm still here drinking their coffee — there's a dark comedy to it, once you stop caring.",
  },
];
