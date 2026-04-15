export type ArmtwistDriver =
  | 'interest_alignment'
  | 'sentiment'
  | 'party_pressure'
  | 'district_pressure'
  | 'faction_pressure'
  | 'momentum';

export interface ArmtwistBark {
  driver: ArmtwistDriver;
  temperament: 'ideologue' | 'follower' | 'dealmaker' | 'opportunist';
  text: string;
}

export const ARMTWIST_BARKS: ArmtwistBark[] = [
  // --- Interest Alignment --- //

  // Ideologue
  {
    driver: 'interest_alignment',
    temperament: 'ideologue',
    text: "This has to be right. Not convenient — right.",
  },
  {
    driver: 'interest_alignment',
    temperament: 'ideologue',
    text: "I need to know what this actually stands for. What's the principle?",
  },
  {
    driver: 'interest_alignment',
    temperament: 'ideologue',
    text: "I didn't come here to compromise on the fundamentals.",
  },

  // Follower
  {
    driver: 'interest_alignment',
    temperament: 'follower',
    text: "Does this bill match what our party has always stood for?",
  },
  {
    driver: 'interest_alignment',
    temperament: 'follower',
    text: "I need to know the policy here is consistent with our platform.",
  },
  {
    driver: 'interest_alignment',
    temperament: 'follower',
    text: "Is this what we've been fighting for? Because if it is, I'm there.",
  },

  // Dealmaker
  {
    driver: 'interest_alignment',
    temperament: 'dealmaker',
    text: "The substance is close to something I can sell. What tips it over?",
  },
  {
    driver: 'interest_alignment',
    temperament: 'dealmaker',
    text: "This policy has value if the terms are right. Are they?",
  },
  {
    driver: 'interest_alignment',
    temperament: 'dealmaker',
    text: "I see a deal in the merits here, but the margins are thin.",
  },

  // Opportunist
  {
    driver: 'interest_alignment',
    temperament: 'opportunist',
    text: "Is this the winner? Because I don't bet on losers.",
  },
  {
    driver: 'interest_alignment',
    temperament: 'opportunist',
    text: "Who else is signing on? I want momentum, not principle.",
  },
  {
    driver: 'interest_alignment',
    temperament: 'opportunist',
    text: "This better move the needle or I'm sitting it out.",
  },

  // --- Sentiment --- //

  // Ideologue
  {
    driver: 'sentiment',
    temperament: 'ideologue',
    text: "I trust you because you've earned it. Don't waste that now.",
  },
  {
    driver: 'sentiment',
    temperament: 'ideologue',
    text: "Our history matters. But it doesn't override what's right.",
  },
  {
    driver: 'sentiment',
    temperament: 'ideologue',
    text: "You've never lied to me before. Don't start.",
  },

  // Follower
  {
    driver: 'sentiment',
    temperament: 'follower',
    text: "You've been reliable to this caucus. That counts for something right now.",
  },
  {
    driver: 'sentiment',
    temperament: 'follower',
    text: "We've come a long way together. Don't let me down.",
  },
  {
    driver: 'sentiment',
    temperament: 'follower',
    text: "I follow people I trust. Are you trustworthy here?",
  },

  // Dealmaker
  {
    driver: 'sentiment',
    temperament: 'dealmaker',
    text: "What have you done for me lately?",
  },
  {
    driver: 'sentiment',
    temperament: 'dealmaker',
    text: "I keep a ledger. Where do we stand?",
  },
  {
    driver: 'sentiment',
    temperament: 'dealmaker',
    text: "This would be easier if we had more history together.",
  },

  // Opportunist
  {
    driver: 'sentiment',
    temperament: 'opportunist',
    text: "Your stock is rising around here. I pay attention to things like that.",
  },
  {
    driver: 'sentiment',
    temperament: 'opportunist',
    text: "You've been making the right moves lately. Backing you might be the smart play.",
  },
  {
    driver: 'sentiment',
    temperament: 'opportunist',
    text: "People are starting to follow your lead. That tells me something about who you are.",
  },

  // --- Party Pressure --- //

  // Ideologue
  {
    driver: 'party_pressure',
    temperament: 'ideologue',
    text: "The party doesn't own my conscience. What does this vote ask of my principles?",
  },
  {
    driver: 'party_pressure',
    temperament: 'ideologue',
    text: "Loyalty is earned, not inherited. Why should I follow on this?",
  },
  {
    driver: 'party_pressure',
    temperament: 'ideologue',
    text: "Leadership doesn't get a vote in my soul.",
  },

  // Follower
  {
    driver: 'party_pressure',
    temperament: 'follower',
    text: "What's the Whip saying? That's my answer.",
  },
  {
    driver: 'party_pressure',
    temperament: 'follower',
    text: "Is this the line? Because if it is, I'm with you.",
  },
  {
    driver: 'party_pressure',
    temperament: 'follower',
    text: "Leadership wouldn't ask if it wasn't important. Right?",
  },

  // Dealmaker
  {
    driver: 'party_pressure',
    temperament: 'dealmaker',
    text: "If I do this, the leadership owes me. Make sure they know it.",
  },
  {
    driver: 'party_pressure',
    temperament: 'dealmaker',
    text: "The party's asking. What's my price?",
  },
  {
    driver: 'party_pressure',
    temperament: 'dealmaker',
    text: "I'm loyal when loyalty pays. What does this get me?",
  },

  // Opportunist
  {
    driver: 'party_pressure',
    temperament: 'opportunist',
    text: "Is the party winning this? Because I don't bet against the house.",
  },
  {
    driver: 'party_pressure',
    temperament: 'opportunist',
    text: "Who's already committed? I need to see the caucus lining up.",
  },
  {
    driver: 'party_pressure',
    temperament: 'opportunist',
    text: "The Whip's pushing this. That usually means it's going somewhere.",
  },

  // --- District Pressure --- //

  // Ideologue
  {
    driver: 'district_pressure',
    temperament: 'ideologue',
    text: "My constituents sent me here to do right. How does this serve that?",
  },
  {
    driver: 'district_pressure',
    temperament: 'ideologue',
    text: "Back home, they expect me to have a spine. This better align with it.",
  },
  {
    driver: 'district_pressure',
    temperament: 'ideologue',
    text: "I represent principles first, people second. But my people have principles too.",
  },

  // Follower
  {
    driver: 'district_pressure',
    temperament: 'follower',
    text: "My constituents are watching this vote closely.",
  },
  {
    driver: 'district_pressure',
    temperament: 'follower',
    text: "I promised my district I'd protect their interests. Convince me this does.",
  },
  {
    driver: 'district_pressure',
    temperament: 'follower',
    text: "Back home, this vote is all anyone's talking about.",
  },

  // Dealmaker
  {
    driver: 'district_pressure',
    temperament: 'dealmaker',
    text: "My district comes first. What does this vote earn me back home?",
  },
  {
    driver: 'district_pressure',
    temperament: 'dealmaker',
    text: "I owe my people results. This better help me deliver.",
  },
  {
    driver: 'district_pressure',
    temperament: 'dealmaker',
    text: "What's the benefit for my constituents? That's the deal.",
  },

  // Opportunist
  {
    driver: 'district_pressure',
    temperament: 'opportunist',
    text: "My district loves a winner. Is this going to look smart back home?",
  },
  {
    driver: 'district_pressure',
    temperament: 'opportunist',
    text: "The momentum on this — will it play well when I go home?",
  },
  {
    driver: 'district_pressure',
    temperament: 'opportunist',
    text: "My reelection depends on being on the right side. Which side is it?",
  },

  // --- Faction Pressure --- //

  // Ideologue
  {
    driver: 'faction_pressure',
    temperament: 'ideologue',
    text: "I don't take orders from outside groups. But I listen to who's right.",
  },
  {
    driver: 'faction_pressure',
    temperament: 'ideologue',
    text: "Lobbyists don't scare me. Truth does. Is this true?",
  },
  {
    driver: 'faction_pressure',
    temperament: 'ideologue',
    text: "External pressure is noise. Principle is signal. Which is this?",
  },

  // Follower
  {
    driver: 'faction_pressure',
    temperament: 'follower',
    text: "The groups that matter to us — are they in or out on this?",
  },
  {
    driver: 'faction_pressure',
    temperament: 'follower',
    text: "The organized groups behind our party — are they with us on this?",
  },
  {
    driver: 'faction_pressure',
    temperament: 'follower',
    text: "Are we together on this, or am I walking alone into faction fire?",
  },

  // Dealmaker
  {
    driver: 'faction_pressure',
    temperament: 'dealmaker',
    text: "Who's asking me to do this? And what do they owe me?",
  },
  {
    driver: 'faction_pressure',
    temperament: 'dealmaker',
    text: "I'll move for the right people at the right price.",
  },
  {
    driver: 'faction_pressure',
    temperament: 'dealmaker',
    text: "Factions come and go. But debts last forever.",
  },

  // Opportunist
  {
    driver: 'faction_pressure',
    temperament: 'opportunist',
    text: "Who's winning this fight? I'm betting on them.",
  },
  {
    driver: 'faction_pressure',
    temperament: 'opportunist',
    text: "The pressure's coming from somewhere — which side has the upper hand?",
  },
  {
    driver: 'faction_pressure',
    temperament: 'opportunist',
    text: "Which faction's on the rise? That's where I go.",
  },

  // --- Momentum (Opportunist only) --- //
  {
    driver: 'momentum',
    temperament: 'opportunist',
    text: "Is this bill actually going to pass? Because I'm not wasting my vote.",
  },
  {
    driver: 'momentum',
    temperament: 'opportunist',
    text: "How many others have committed? I need to know the odds.",
  },
  {
    driver: 'momentum',
    temperament: 'opportunist',
    text: "Tell me this isn't a sinking ship.",
  },
];
