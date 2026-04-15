export interface CoreBark {
  tier: 1 | 2 | 3 | 4 | 5 | 6 | 7;
  driver: 'interest' | 'sentiment' | 'party' | 'district' | 'faction' | 'momentum';
  temperament: 'ideologue' | 'follower' | 'dealmaker' | 'opportunist';
  text: string;
}

export const CORE_BARKS: CoreBark[] = [
  // =====================================================================
  // TIER 1: "Done" — Net Willingness +60 or higher
  // =====================================================================

  // Done — Interest Alignment — Ideologue
  { tier: 1, driver: 'interest', temperament: 'ideologue', text: "This is the right thing to do. You have my word." },
  { tier: 1, driver: 'interest', temperament: 'ideologue', text: "I've believed in this since before you got here." },
  { tier: 1, driver: 'interest', temperament: 'ideologue', text: "This bill speaks to what matters. Count me in." },
  { tier: 1, driver: 'interest', temperament: 'ideologue', text: "Finally, someone with the conviction to push this forward." },

  // Done — Interest Alignment — Follower
  { tier: 1, driver: 'interest', temperament: 'follower', text: "Leadership is behind this, so I'm behind this." },
  { tier: 1, driver: 'interest', temperament: 'follower', text: "The Whip already told me to expect this ask." },
  { tier: 1, driver: 'interest', temperament: 'follower', text: "The party's been waiting for a bill like this. You have my vote." },
  { tier: 1, driver: 'interest', temperament: 'follower', text: "This is exactly what we've been saying we'd support." },

  // Done — Interest Alignment — Dealmaker
  { tier: 1, driver: 'interest', temperament: 'dealmaker', text: "Good policy and an easy yes? That's a freebie — and I'll remember you owe me one." },
  { tier: 1, driver: 'interest', temperament: 'dealmaker', text: "Getting in early on a bill like this is smart business. Count me in." },
  { tier: 1, driver: 'interest', temperament: 'dealmaker', text: "This sells itself, which means my yes costs you nothing. I'll collect later." },
  { tier: 1, driver: 'interest', temperament: 'dealmaker', text: "A bill this solid makes supporting you cheap. I like cheap favors." },

  // Done — Interest Alignment — Opportunist
  { tier: 1, driver: 'interest', temperament: 'opportunist', text: "The framework's solid. I want my name on it." },
  { tier: 1, driver: 'interest', temperament: 'opportunist', text: "This checks out on every level. Smart play." },
  { tier: 1, driver: 'interest', temperament: 'opportunist', text: "The logic here is airtight. I'm aboard." },
  { tier: 1, driver: 'interest', temperament: 'opportunist', text: "You've thought this through. Let's go." },

  // Done — Sentiment — Ideologue
  { tier: 1, driver: 'sentiment', temperament: 'ideologue', text: "I trust you. And I trust your judgment on this." },
  { tier: 1, driver: 'sentiment', temperament: 'ideologue', text: "You've earned the benefit of the doubt. I'm with you." },
  { tier: 1, driver: 'sentiment', temperament: 'ideologue', text: "We've worked together long enough. I know where you stand." },
  { tier: 1, driver: 'sentiment', temperament: 'ideologue', text: "Your word means something. That's enough for me." },

  // Done — Sentiment — Follower
  { tier: 1, driver: 'sentiment', temperament: 'follower', text: "You've proven yourself. The caucus knows you're reliable." },
  { tier: 1, driver: 'sentiment', temperament: 'follower', text: "Leadership trusts you, so I trust you." },
  { tier: 1, driver: 'sentiment', temperament: 'follower', text: "Your track record speaks for itself. The party backs this." },
  { tier: 1, driver: 'sentiment', temperament: 'follower', text: "You haven't steered us wrong. I'm following your lead." },

  // Done — Sentiment — Dealmaker
  { tier: 1, driver: 'sentiment', temperament: 'dealmaker', text: "You helped me last week. I don't forget that." },
  { tier: 1, driver: 'sentiment', temperament: 'dealmaker', text: "Consider this a deposit. I'll come collecting." },
  { tier: 1, driver: 'sentiment', temperament: 'dealmaker', text: "We've built something here. I'm happy to keep investing." },
  { tier: 1, driver: 'sentiment', temperament: 'dealmaker', text: "After everything we've been through? This one's easy." },

  // Done — Sentiment — Opportunist
  { tier: 1, driver: 'sentiment', temperament: 'opportunist', text: "You're the name people are whispering right now. I want in on that." },
  { tier: 1, driver: 'sentiment', temperament: 'opportunist', text: "Everyone's noticing you. I'd rather be with you than against you." },
  { tier: 1, driver: 'sentiment', temperament: 'opportunist', text: "You're the player in the room right now. Good instinct to stay close." },
  { tier: 1, driver: 'sentiment', temperament: 'opportunist', text: "You're moving upward. I want to be on that flight." },

  // Done — Party Pressure — Ideologue
  { tier: 1, driver: 'party', temperament: 'ideologue', text: "The party line is right on this one. My principles align." },
  { tier: 1, driver: 'party', temperament: 'ideologue', text: "Leadership got this one correct. I'm satisfied." },
  { tier: 1, driver: 'party', temperament: 'ideologue', text: "This matches what we actually stand for. I'm comfortable voting yes." },
  { tier: 1, driver: 'party', temperament: 'ideologue', text: "The moral case is there. The party's backing the right thing." },

  // Done — Party Pressure — Follower
  { tier: 1, driver: 'party', temperament: 'follower', text: "Leadership wants this done. End of conversation." },
  { tier: 1, driver: 'party', temperament: 'follower', text: "The Whip's instruction is clear. I'm voting accordingly." },
  { tier: 1, driver: 'party', temperament: 'follower', text: "The caucus has decided. We move as one." },
  { tier: 1, driver: 'party', temperament: 'follower', text: "This is the party's priority. I'm on board." },

  // Done — Party Pressure — Dealmaker
  { tier: 1, driver: 'party', temperament: 'dealmaker', text: "The leadership asked nicely. I owe them one anyway." },
  { tier: 1, driver: 'party', temperament: 'dealmaker', text: "Leadership's backing you, and that matters to me." },
  { tier: 1, driver: 'party', temperament: 'dealmaker', text: "The Whip and I have an understanding. This is easy." },
  { tier: 1, driver: 'party', temperament: 'dealmaker', text: "Leadership opened a door for me before. This is how I repay it." },

  // Done — Party Pressure — Opportunist
  { tier: 1, driver: 'party', temperament: 'opportunist', text: "Leadership's all-in. Smart money follows the house." },
  { tier: 1, driver: 'party', temperament: 'opportunist', text: "The party's moving this direction. I'm not getting left behind." },
  { tier: 1, driver: 'party', temperament: 'opportunist', text: "The Whip's committed. That's a tell the smart players watch for." },
  { tier: 1, driver: 'party', temperament: 'opportunist', text: "Leadership sees a win here. So do I." },

  // Done — District Pressure — Ideologue
  { tier: 1, driver: 'district', temperament: 'ideologue', text: "My people care about this. So do I. Let's vote." },
  { tier: 1, driver: 'district', temperament: 'ideologue', text: "This is what my constituents elected me to do." },
  { tier: 1, driver: 'district', temperament: 'ideologue', text: "Back home, this matters. It matters to me too." },
  { tier: 1, driver: 'district', temperament: 'ideologue', text: "My district's been asking for this. Finally delivering." },

  // Done — District Pressure — Follower
  { tier: 1, driver: 'district', temperament: 'follower', text: "The district's behind this. Leadership's behind this. Two reasons to vote yes." },
  { tier: 1, driver: 'district', temperament: 'follower', text: "My people sent a message. Leadership listened. I'm voting with both." },
  { tier: 1, driver: 'district', temperament: 'follower', text: "Back home, they're expecting this. The party's ready. I'm voting yes." },
  { tier: 1, driver: 'district', temperament: 'follower', text: "The district and the leadership want the same thing. Easy choice." },

  // Done — District Pressure — Dealmaker
  { tier: 1, driver: 'district', temperament: 'dealmaker', text: "My district gave me this seat. This vote is what I owe them." },
  { tier: 1, driver: 'district', temperament: 'dealmaker', text: "The district's been good to me. I deliver for them." },
  { tier: 1, driver: 'district', temperament: 'dealmaker', text: "The voters put me here, and they expect delivery. This is me delivering." },
  { tier: 1, driver: 'district', temperament: 'dealmaker', text: "Back home, they've got skin in the game. I'm protecting their investment." },

  // Done — District Pressure — Opportunist
  { tier: 1, driver: 'district', temperament: 'opportunist', text: "The district's got momentum on this. I'm surfing that." },
  { tier: 1, driver: 'district', temperament: 'opportunist', text: "This plays well at home. Smart politics on your part." },
  { tier: 1, driver: 'district', temperament: 'opportunist', text: "My people are paying attention to this one. I want the credit." },
  { tier: 1, driver: 'district', temperament: 'opportunist', text: "The district's energy is here. I know a smart read when I see one." },

  // Done — Faction Pressure — Ideologue
  { tier: 1, driver: 'faction', temperament: 'ideologue', text: "The outside groups are right on this one. My principles agree." },
  { tier: 1, driver: 'faction', temperament: 'ideologue', text: "The pressure's coming from the right direction. I'd support this anyway." },
  { tier: 1, driver: 'faction', temperament: 'ideologue', text: "Even the usual critics are on board. The cause is sound." },
  { tier: 1, driver: 'faction', temperament: 'ideologue', text: "The groups backing this aren't wrong. Neither am I." },

  // Done — Faction Pressure — Follower
  { tier: 1, driver: 'faction', temperament: 'follower', text: "The influential players are settled. I'm following their lead." },
  { tier: 1, driver: 'faction', temperament: 'follower', text: "The outside groups have signaled. Leadership's read it correctly." },
  { tier: 1, driver: 'faction', temperament: 'follower', text: "The pressure's aligned with what leadership wants. Clear direction." },
  { tier: 1, driver: 'faction', temperament: 'follower', text: "The groups and the party agree. I vote with the consensus." },

  // Done — Faction Pressure — Dealmaker
  { tier: 1, driver: 'faction', temperament: 'dealmaker', text: "The groups pushing this have done me favors. I return them." },
  { tier: 1, driver: 'faction', temperament: 'dealmaker', text: "The backers of this are people I work with. Happy to oblige." },
  { tier: 1, driver: 'faction', temperament: 'dealmaker', text: "The outside pressure's from players I respect. I'm in." },
  { tier: 1, driver: 'faction', temperament: 'dealmaker', text: "The factions on this side have been good to me. I'm good to them." },

  // Done — Faction Pressure — Opportunist
  { tier: 1, driver: 'faction', temperament: 'opportunist', text: "The groups that matter are all-in on this. Smart betting." },
  { tier: 1, driver: 'faction', temperament: 'opportunist', text: "The outside pressure's pointing one direction. That's usually where the momentum is." },
  { tier: 1, driver: 'faction', temperament: 'opportunist', text: "The powerful players have chosen sides. I'm choosing theirs." },
  { tier: 1, driver: 'faction', temperament: 'opportunist', text: "The factions have already decided. I'm reading the room correctly." },

  // Done — Momentum — Opportunist
  { tier: 1, driver: 'momentum', temperament: 'opportunist', text: "Everyone's talking about this bill. I want in." },
  { tier: 1, driver: 'momentum', temperament: 'opportunist', text: "Smart timing on your part. This issue is hot right now." },
  { tier: 1, driver: 'momentum', temperament: 'opportunist', text: "The cosponsors are lining up. I'm not missing this train." },
  { tier: 1, driver: 'momentum', temperament: 'opportunist', text: "I can read a room. This is happening, and I want to be on the right side." },

  // =====================================================================
  // TIER 2: "I'm with you on this" — Net Willingness +40 to +59
  // =====================================================================

  // I'm with you — Interest Alignment — Ideologue
  { tier: 2, driver: 'interest', temperament: 'ideologue', text: "The principles are sound, even if I'm taking heat for it." },
  { tier: 2, driver: 'interest', temperament: 'ideologue', text: "I believe in this, but don't expect me to carry water you don't need carried." },
  { tier: 2, driver: 'interest', temperament: 'ideologue', text: "The right answer here costs me. You should know that." },
  { tier: 2, driver: 'interest', temperament: 'ideologue', text: "I'm supporting this because it's right, but people are going to notice." },

  // I'm with you — Interest Alignment — Follower
  { tier: 2, driver: 'interest', temperament: 'follower', text: "Leadership wants this, but there are whispers I'm hearing. I'm still with you." },
  { tier: 2, driver: 'interest', temperament: 'follower', text: "The caucus is moving this way, though some are hesitant. Count me in." },
  { tier: 2, driver: 'interest', temperament: 'follower', text: "The party line is here, but it's not bulletproof yet. I'm aboard." },
  { tier: 2, driver: 'interest', temperament: 'follower', text: "Leadership's on this, but I'm aware it's not unanimous. I'll vote yes." },

  // I'm with you — Interest Alignment — Dealmaker
  { tier: 2, driver: 'interest', temperament: 'dealmaker', text: "The deal's good enough to take the heat, but barely. Remember what this cost me." },
  { tier: 2, driver: 'interest', temperament: 'dealmaker', text: "Your case is strong, though it costs me in other quarters. We're even after this." },
  { tier: 2, driver: 'interest', temperament: 'dealmaker', text: "I see the substance here, but I'm burning some goodwill to say yes." },
  { tier: 2, driver: 'interest', temperament: 'dealmaker', text: "This makes sense, but I'm spending credibility I might need elsewhere." },

  // I'm with you — Interest Alignment — Opportunist
  { tier: 2, driver: 'interest', temperament: 'opportunist', text: "The framework's right, but you're not the obvious winner yet. I'm betting on you anyway." },
  { tier: 2, driver: 'interest', temperament: 'opportunist', text: "The logic's there, though the momentum's not fully with you. I'm in early." },
  { tier: 2, driver: 'interest', temperament: 'opportunist', text: "The substance checks out, but I'm taking a risk reading the room this way." },
  { tier: 2, driver: 'interest', temperament: 'opportunist', text: "You've got the right idea, but the smart money isn't fully committed. I'm with you." },

  // I'm with you — Sentiment — Ideologue
  { tier: 2, driver: 'sentiment', temperament: 'ideologue', text: "I trust you enough to take this hit. Don't waste it." },
  { tier: 2, driver: 'sentiment', temperament: 'ideologue', text: "You've earned the benefit of the doubt, even if my people won't like it." },
  { tier: 2, driver: 'sentiment', temperament: 'ideologue', text: "Our history matters, but it won't protect us if this goes sideways." },
  { tier: 2, driver: 'sentiment', temperament: 'ideologue', text: "I believe in you, but I'm aware that belief has limits and costs." },

  // I'm with you — Sentiment — Follower
  { tier: 2, driver: 'sentiment', temperament: 'follower', text: "You've earned credibility with leadership, and I'm extending it. But leadership's watching." },
  { tier: 2, driver: 'sentiment', temperament: 'follower', text: "I trust what you've built with the caucus, though they're nervous. I'm supporting you." },
  { tier: 2, driver: 'sentiment', temperament: 'follower', text: "You've proven yourself, but this is where some of the party gets off. I'm staying." },
  { tier: 2, driver: 'sentiment', temperament: 'follower', text: "Leadership backs you, but I'm aware this backing isn't infinite. I'm with you." },

  // I'm with you — Sentiment — Dealmaker
  { tier: 2, driver: 'sentiment', temperament: 'dealmaker', text: "You've helped me, so I'm helping you. But we're running up the tab." },
  { tier: 2, driver: 'sentiment', temperament: 'dealmaker', text: "I'm investing here, but understand I'm spending credit on you. Don't squander it." },
  { tier: 2, driver: 'sentiment', temperament: 'dealmaker', text: "After what we've done for each other, I'll take this one. But you owe me." },
  { tier: 2, driver: 'sentiment', temperament: 'dealmaker', text: "We've built something, but every favor has a limit. I'm testing mine right now." },

  // I'm with you — Sentiment — Opportunist
  { tier: 2, driver: 'sentiment', temperament: 'opportunist', text: "Your trajectory's good, but it's fragile. I'm supporting you because you're rising, not because you've arrived." },
  { tier: 2, driver: 'sentiment', temperament: 'opportunist', text: "I see where you're headed, though I'm aware it's not guaranteed. I'm with you." },
  { tier: 2, driver: 'sentiment', temperament: 'opportunist', text: "Your trajectory's good, but it's not locked in. I'm betting on you early." },
  { tier: 2, driver: 'sentiment', temperament: 'opportunist', text: "You're on the way up, but you're not there yet. I'm with you, but we both know the risk." },

  // I'm with you — Party Pressure — Ideologue
  { tier: 2, driver: 'party', temperament: 'ideologue', text: "Leadership wants this, but it conflicts with what I believe. I'm saying yes anyway, and that matters." },
  { tier: 2, driver: 'party', temperament: 'ideologue', text: "The party line is here, but it's not my line. I'm following, and that's a concession." },
  { tier: 2, driver: 'party', temperament: 'ideologue', text: "Leadership's decided, and I'm respecting that even though the case isn't ironclad to me." },
  { tier: 2, driver: 'party', temperament: 'ideologue', text: "The party's committed, so I am. But you're spending my moral capital, not just my vote." },

  // I'm with you — Party Pressure — Follower
  { tier: 2, driver: 'party', temperament: 'follower', text: "Leadership wants it, but I can feel the resistance in the caucus. I'm staying loyal." },
  { tier: 2, driver: 'party', temperament: 'follower', text: "The Whip's instruction is clear, though there's pushback below. The party's not unified." },
  { tier: 2, driver: 'party', temperament: 'follower', text: "Leadership's pushed this down, and I'm respecting it, though we both know some won't." },
  { tier: 2, driver: 'party', temperament: 'follower', text: "The party's decided, but I'm aware I'm taking heat from my own side for this." },

  // I'm with you — Party Pressure — Dealmaker
  { tier: 2, driver: 'party', temperament: 'dealmaker', text: "Leadership wants this, and I owe leadership, so I'm in. But this favor gets repaid." },
  { tier: 2, driver: 'party', temperament: 'dealmaker', text: "The Whip's asked, and I deliver for the Whip. Just know you're using up that relationship." },
  { tier: 2, driver: 'party', temperament: 'dealmaker', text: "I'm backing leadership on this, though they're spending capital with me to make it happen." },
  { tier: 2, driver: 'party', temperament: 'dealmaker', text: "The party line is yours, and I'm voting it, but there's a cost to me with my own people." },

  // I'm with you — Party Pressure — Opportunist
  { tier: 2, driver: 'party', temperament: 'opportunist', text: "Leadership's moving forward, but you haven't fully won the room yet. I'm betting on the house." },
  { tier: 2, driver: 'party', temperament: 'opportunist', text: "The party's lined up, though there are cracks forming. Smart to lock me in now." },
  { tier: 2, driver: 'party', temperament: 'opportunist', text: "Leadership's committed, and that's usually a winning bet. I'm with it." },
  { tier: 2, driver: 'party', temperament: 'opportunist', text: "The house is moving, but momentum can shift. I'm with the leadership bet, but it's not free." },

  // I'm with you — District Pressure — Ideologue
  { tier: 2, driver: 'district', temperament: 'ideologue', text: "My people care about this, but some voices I respect back home don't. I'm choosing the cause." },
  { tier: 2, driver: 'district', temperament: 'ideologue', text: "The district wants it, though I'm hearing doubts from voices that matter. I'm supporting anyway." },
  { tier: 2, driver: 'district', temperament: 'ideologue', text: "My constituents are pushing this, but I'm aware it'll cost me with others back home." },
  { tier: 2, driver: 'district', temperament: 'ideologue', text: "The district's behind it, but it's not unanimous, and I'm taking heat for the split." },

  // I'm with you — District Pressure — Follower
  { tier: 2, driver: 'district', temperament: 'follower', text: "The district wants it, and leadership's behind it, but there's real resistance in the caucus." },
  { tier: 2, driver: 'district', temperament: 'follower', text: "Back home they're asking, and the party's answering, but some in my delegation won't budge." },
  { tier: 2, driver: 'district', temperament: 'follower', text: "My people are pushing it, leadership agrees, but there's tension in the caucus." },
  { tier: 2, driver: 'district', temperament: 'follower', text: "The district and the leadership want it, though not everyone between them is convinced." },

  // I'm with you — District Pressure — Dealmaker
  { tier: 2, driver: 'district', temperament: 'dealmaker', text: "My district's been good to me, so I'm good to them. But I'm spending capital elsewhere." },
  { tier: 2, driver: 'district', temperament: 'dealmaker', text: "My district invested in me and I pay dividends. Just understand this one's expensive." },
  { tier: 2, driver: 'district', temperament: 'dealmaker', text: "My constituents are asking, and I don't ignore them. But I'm burning chips to make this work." },
  { tier: 2, driver: 'district', temperament: 'dealmaker', text: "I owe the district, and I pay my debts. But this particular debt's getting expensive." },

  // I'm with you — District Pressure — Opportunist
  { tier: 2, driver: 'district', temperament: 'opportunist', text: "The district's polling favors this, though it could turn. I'm hedging on it holding." },
  { tier: 2, driver: 'district', temperament: 'opportunist', text: "The momentum at home supports this, but it's not deep. I'm with you because you're reading the room right." },
  { tier: 2, driver: 'district', temperament: 'opportunist', text: "The district's pushing, but I'm taking a calculated risk here. The wave could change." },
  { tier: 2, driver: 'district', temperament: 'opportunist', text: "My people are moving this direction, though I'm aware how quickly political winds turn." },

  // I'm with you — Faction Pressure — Ideologue
  { tier: 2, driver: 'faction', temperament: 'ideologue', text: "The outside groups want it, and their case is sound, but I'm not comfortable being seen as their tool." },
  { tier: 2, driver: 'faction', temperament: 'ideologue', text: "The factions pushing this have a point, though supporting them visibly costs me credibility." },
  { tier: 2, driver: 'faction', temperament: 'ideologue', text: "The pressure from outside groups makes sense, but I'm aware of how this looks." },
  { tier: 2, driver: 'faction', temperament: 'ideologue', text: "The groups backing this are right, but I'm spending goodwill with people who'd rather I stay independent." },

  // I'm with you — Faction Pressure — Follower
  { tier: 2, driver: 'faction', temperament: 'follower', text: "The outside groups have leadership's ear, so I'm with leadership. But the caucus is nervous." },
  { tier: 2, driver: 'faction', temperament: 'follower', text: "The factions pushing this align with what the Whip wants, though some see it as problematic." },
  { tier: 2, driver: 'faction', temperament: 'follower', text: "Leadership's listening to these groups, so I am too. But I'm taking heat from the rank and file." },
  { tier: 2, driver: 'faction', temperament: 'follower', text: "The influential players are settled, and leadership respects that. I'm respecting it too." },

  // I'm with you — Faction Pressure — Dealmaker
  { tier: 2, driver: 'faction', temperament: 'dealmaker', text: "The groups pushing this have done favors, and I return them. But I'm visible as their ally now." },
  { tier: 2, driver: 'faction', temperament: 'dealmaker', text: "The backers of this are people I work with, so I'm in. But I'm burning capital with their critics." },
  { tier: 2, driver: 'faction', temperament: 'dealmaker', text: "The outside pressure's from players I respect, so I respect it. But I'm taking visibility costs." },
  { tier: 2, driver: 'faction', temperament: 'dealmaker', text: "The factions backing you have been good to me. But this makes it obvious." },

  // I'm with you — Faction Pressure — Opportunist
  { tier: 2, driver: 'faction', temperament: 'opportunist', text: "The groups that matter are pushing this way, though the momentum's not fully locked. I'm with them early." },
  { tier: 2, driver: 'faction', temperament: 'opportunist', text: "The outside pressure's pointing one direction, but I'm aware it could shift. I'm betting on it." },
  { tier: 2, driver: 'faction', temperament: 'opportunist', text: "The powerful players are moving this way, though I'm taking a chance reading it right." },
  { tier: 2, driver: 'faction', temperament: 'opportunist', text: "The factions have started choosing sides. I'm with the winning direction, but it's not inevitable yet." },

  // I'm with you — Momentum — Opportunist
  { tier: 2, driver: 'momentum', temperament: 'opportunist', text: "The bill's gaining traction, though it's not a lock yet. I'm backing you because you're winning." },
  { tier: 2, driver: 'momentum', temperament: 'opportunist', text: "The cosponsors are building, though you don't have the whole room. I'm betting on momentum." },
  { tier: 2, driver: 'momentum', temperament: 'opportunist', text: "Things are moving your direction, but I'm taking a calculated risk by joining now." },
  { tier: 2, driver: 'momentum', temperament: 'opportunist', text: "The trajectory's good, though outcomes aren't locked. I'm with you because you're moving." },

  // =====================================================================
  // TIER 3: "I'm leaning your way, but..." — Net Willingness +20 to +39
  // =====================================================================

  // Leaning your way — Interest Alignment — Ideologue
  { tier: 3, driver: 'interest', temperament: 'ideologue', text: "The bones are right, but you're hedging on something that matters. Show me you mean it." },
  { tier: 3, driver: 'interest', temperament: 'ideologue', text: "I believe in where this goes, I just need to see you believe it too." },
  { tier: 3, driver: 'interest', temperament: 'ideologue', text: "You're almost there — but almost doesn't cut it for something like this." },
  { tier: 3, driver: 'interest', temperament: 'ideologue', text: "The core is solid, but those exceptions you tucked in? That's what's giving me pause." },

  // Leaning your way — Interest Alignment — Follower
  { tier: 3, driver: 'interest', temperament: 'follower', text: "Leadership seems aligned, and the framework makes sense. I just need cover that this is the real direction." },
  { tier: 3, driver: 'interest', temperament: 'follower', text: "The substance checks out, but I need to know the party's serious before I move." },
  { tier: 3, driver: 'interest', temperament: 'follower', text: "The policy reads right, but I won't stick my neck out unless this has real backing upstairs." },
  { tier: 3, driver: 'interest', temperament: 'follower', text: "I like what I'm reading, but I need leadership to show this is priority, not just talk." },

  // Leaning your way — Interest Alignment — Dealmaker
  { tier: 3, driver: 'interest', temperament: 'dealmaker', text: "The terms are closer than they've been. One or two more adjustments and we shake hands." },
  { tier: 3, driver: 'interest', temperament: 'dealmaker', text: "You've given ground in the right places. Show me you'll do the same on this last piece." },
  { tier: 3, driver: 'interest', temperament: 'dealmaker', text: "We're almost there — but I need one more concession I can bank before I move." },
  { tier: 3, driver: 'interest', temperament: 'dealmaker', text: "The basic deal is getting there. Prove you'll stick to your word on what matters most to me." },

  // Leaning your way — Interest Alignment — Opportunist
  { tier: 3, driver: 'interest', temperament: 'opportunist', text: "This is picking up steam — but not fast enough yet. Get a few more votes and we talk differently." },
  { tier: 3, driver: 'interest', temperament: 'opportunist', text: "The momentum's there if you can close the gap. Push harder and I'll reconsider." },
  { tier: 3, driver: 'interest', temperament: 'opportunist', text: "I see where this is headed, but not until it's actually heading there." },
  { tier: 3, driver: 'interest', temperament: 'opportunist', text: "Right idea, wrong timing. Come back when you've got more than just me considering it." },

  // Leaning your way — Sentiment — Ideologue
  { tier: 3, driver: 'sentiment', temperament: 'ideologue', text: "History says I should trust you on this. But recent history makes me want one more signal." },
  { tier: 3, driver: 'sentiment', temperament: 'ideologue', text: "I remember when you stood for something. Do it one more time and I'll remember why." },
  { tier: 3, driver: 'sentiment', temperament: 'ideologue', text: "You've been straight with me before. Be straight with me now about what you're really doing." },
  { tier: 3, driver: 'sentiment', temperament: 'ideologue', text: "I want to believe that person I knew is still in there. Give me a reason." },

  // Leaning your way — Sentiment — Follower
  { tier: 3, driver: 'sentiment', temperament: 'follower', text: "You've always had the party's back. That matters, but the party needs to show it has yours." },
  { tier: 3, driver: 'sentiment', temperament: 'follower', text: "I know you're loyal — that's why I need to see the loyalty is mutual before I move." },
  { tier: 3, driver: 'sentiment', temperament: 'follower', text: "You've earned credit with how you've handled things. But I need the organization to back that play." },
  { tier: 3, driver: 'sentiment', temperament: 'follower', text: "Trust is there, but it has to flow both ways. Make sure leadership understands what you're asking." },

  // Leaning your way — Sentiment — Dealmaker
  { tier: 3, driver: 'sentiment', temperament: 'dealmaker', text: "You've come through before, so I'm leaning in. But I need one small favor to call us even." },
  { tier: 3, driver: 'sentiment', temperament: 'dealmaker', text: "History says you're good for your word. One more gesture and we're square." },
  { tier: 3, driver: 'sentiment', temperament: 'dealmaker', text: "I've done right by you. This is almost there, but I need to know you remember that." },
  { tier: 3, driver: 'sentiment', temperament: 'dealmaker', text: "You've been solid. One more thing and we start fresh on whatever's next." },

  // Leaning your way — Sentiment — Opportunist
  { tier: 3, driver: 'sentiment', temperament: 'opportunist', text: "You're the smart play right now, but only if others start agreeing. Get three more cosponsors and I fold." },
  { tier: 3, driver: 'sentiment', temperament: 'opportunist', text: "You're building something here — but I'm not betting until it actually builds." },
  { tier: 3, driver: 'sentiment', temperament: 'opportunist', text: "You've gotten lucky in the past. Show me the luck's still running." },
  { tier: 3, driver: 'sentiment', temperament: 'opportunist', text: "I like where your head's at, but the wind needs to shift more before I move." },

  // Leaning your way — Party Pressure — Ideologue
  { tier: 3, driver: 'party', temperament: 'ideologue', text: "Leadership's not against it, and that's all I needed. But I need them to say so clearly." },
  { tier: 3, driver: 'party', temperament: 'ideologue', text: "The party's moving the right direction, but they haven't gone far enough to earn my vote yet." },
  { tier: 3, driver: 'party', temperament: 'ideologue', text: "I believe in the party's instincts, but this instinct needs to be sharper." },
  { tier: 3, driver: 'party', temperament: 'ideologue', text: "Leadership's heart is in the right place. I just need to see it's not going to flinch." },

  // Leaning your way — Party Pressure — Follower
  { tier: 3, driver: 'party', temperament: 'follower', text: "If the Whip says this is the move, I'm there. But I need to hear it directly." },
  { tier: 3, driver: 'party', temperament: 'follower', text: "Leadership seems onboard, but I need the official word before I commit." },
  { tier: 3, driver: 'party', temperament: 'follower', text: "The party's going this way — I just need that confirmed before I walk that line." },
  { tier: 3, driver: 'party', temperament: 'follower', text: "I'm ready to fall in line, but the line needs to be clearer first." },

  // Leaning your way — Party Pressure — Dealmaker
  { tier: 3, driver: 'party', temperament: 'dealmaker', text: "Leadership's putting weight behind this, and I appreciate that. One small carve-out and I'm with you." },
  { tier: 3, driver: 'party', temperament: 'dealmaker', text: "The party's all-in, which is good for me. But there's a small ask I need in return." },
  { tier: 3, driver: 'party', temperament: 'dealmaker', text: "You're getting party support — that's huge. Just get me something back for moving with it." },
  { tier: 3, driver: 'party', temperament: 'dealmaker', text: "Leadership's here. Now, what's my piece of this for being the loyal vote?" },

  // Leaning your way — Party Pressure — Opportunist
  { tier: 3, driver: 'party', temperament: 'opportunist', text: "The party's momentum is building. Get it a bit stronger and I'll ride it." },
  { tier: 3, driver: 'party', temperament: 'opportunist', text: "Leadership's on this, but not loud enough yet. When the pressure gets real, I'll join." },
  { tier: 3, driver: 'party', temperament: 'opportunist', text: "The direction's clear, but it needs to look more inevitable before I commit." },
  { tier: 3, driver: 'party', temperament: 'opportunist', text: "The party's moving this way — but consensus isn't there yet. Waiting to see if it holds." },

  // Leaning your way — District Pressure — Ideologue
  { tier: 3, driver: 'district', temperament: 'ideologue', text: "My people are split, but I think the principle is right. One more conversation and they'll see it." },
  { tier: 3, driver: 'district', temperament: 'ideologue', text: "There's pushback at home, but the principle is right. I just need the cover to explain it." },
  { tier: 3, driver: 'district', temperament: 'ideologue', text: "The district's nervous, and I respect that. But this helps them even if they don't see it yet." },
  { tier: 3, driver: 'district', temperament: 'ideologue', text: "My constituents have doubts, but I'm not here to do what's easy. One stronger message and they'll come around." },

  // Leaning your way — District Pressure — Follower
  { tier: 3, driver: 'district', temperament: 'follower', text: "The district's not hostile, just cautious. Give me some language I can take home." },
  { tier: 3, driver: 'district', temperament: 'follower', text: "There's concern back home, but nothing I can't manage if there's backing to show for it." },
  { tier: 3, driver: 'district', temperament: 'follower', text: "My people aren't fired up about this, but they're not demanding I block it either." },
  { tier: 3, driver: 'district', temperament: 'follower', text: "The district's tolerating this. Just give me something I can point to that benefits them." },

  // Leaning your way — District Pressure — Dealmaker
  { tier: 3, driver: 'district', temperament: 'dealmaker', text: "My district's watching, and they want to know I got something for them. Give me that and we're done." },
  { tier: 3, driver: 'district', temperament: 'dealmaker', text: "The folks back home will follow me if I can show them this pays back. What do I tell them?" },
  { tier: 3, driver: 'district', temperament: 'dealmaker', text: "People are skeptical, but they'll trust my judgment if I can point to what's in it for them." },
  { tier: 3, driver: 'district', temperament: 'dealmaker', text: "The district's on the fence. Slip something local in here and they move, and I move with them." },

  // Leaning your way — District Pressure — Opportunist
  { tier: 3, driver: 'district', temperament: 'opportunist', text: "Polling's trending this way, but it's not there yet. A few more points and I'm with you." },
  { tier: 3, driver: 'district', temperament: 'opportunist', text: "The district's warming up. A bit more momentum and they'll stop caring." },
  { tier: 3, driver: 'district', temperament: 'opportunist', text: "Back home is leaning with you — but barely. Build that up and I follow." },
  { tier: 3, driver: 'district', temperament: 'opportunist', text: "The voters are close. Make it look inevitable and they'll back you, and so will I." },

  // Leaning your way — Faction Pressure — Ideologue
  { tier: 3, driver: 'faction', temperament: 'ideologue', text: "The outside groups are making noise, but they're wrong about the principle. One more voice of conviction and I'll drown them out." },
  { tier: 3, driver: 'faction', temperament: 'ideologue', text: "There are interests aligned against this, but they're not the interests I care about. Show me this is the right call." },
  { tier: 3, driver: 'faction', temperament: 'ideologue', text: "External pressure doesn't move me on the merits. But I need to see the merits are there first." },
  { tier: 3, driver: 'faction', temperament: 'ideologue', text: "Some groups don't want this. I need to be sure they're wrong before I say so publicly." },

  // Leaning your way — Faction Pressure — Follower
  { tier: 3, driver: 'faction', temperament: 'follower', text: "Outside groups are coming in hot, but if the party holds, I hold. Just need leadership to stiffen up." },
  { tier: 3, driver: 'faction', temperament: 'follower', text: "Faction pressure's real, but I follow the party line. Let the party take the lead." },
  { tier: 3, driver: 'faction', temperament: 'follower', text: "There's heat from outside, but we weather that together as a party. Just need leadership to say so." },
  { tier: 3, driver: 'faction', temperament: 'follower', text: "Interest groups are working me, but I'll take the incoming if the party's got my back." },

  // Leaning your way — Faction Pressure — Dealmaker
  { tier: 3, driver: 'faction', temperament: 'dealmaker', text: "The faction's making threats, which means I need insurance. Help me with that and I'll weather it." },
  { tier: 3, driver: 'faction', temperament: 'dealmaker', text: "There are outside interests lined up against this. Cover my exposure and I'll move forward." },
  { tier: 3, driver: 'faction', temperament: 'dealmaker', text: "Factions are going to come after me if I vote this way. What's my protection?" },
  { tier: 3, driver: 'faction', temperament: 'dealmaker', text: "Groups are going to spend money to replace me if I do this. What do I get to offset that?" },

  // Leaning your way — Faction Pressure — Opportunist
  { tier: 3, driver: 'faction', temperament: 'opportunist', text: "Factions are scrambling, which means the ground's shifting. Once the dust settles, I'll move." },
  { tier: 3, driver: 'faction', temperament: 'opportunist', text: "Outside groups are divided on this, which is interesting. When they stop being divided, I'll have my answer." },
  { tier: 3, driver: 'faction', temperament: 'opportunist', text: "Faction pressure's not consolidated yet. That's actually good for you." },
  { tier: 3, driver: 'faction', temperament: 'opportunist', text: "The heat's building, but it's not deterministic yet. See how this plays out and I'll decide." },

  // Leaning your way — Momentum — Opportunist
  { tier: 3, driver: 'momentum', temperament: 'opportunist', text: "You're building something, but it's not there yet. Get two more cosponsors and I stop hedging." },
  { tier: 3, driver: 'momentum', temperament: 'opportunist', text: "The trajectory's promising. One more good week and this looks like a winner." },
  { tier: 3, driver: 'momentum', temperament: 'opportunist', text: "I see momentum forming, but it could stall. Show me it won't." },
  { tier: 3, driver: 'momentum', temperament: 'opportunist', text: "The early signs are good. Prove the trend holds and I'm yours." },

  // =====================================================================
  // TIER 4: "What's in it for me?" — Net Willingness -19 to +19
  // =====================================================================

  // What's in it for me? — Interest Alignment — Ideologue
  { tier: 4, driver: 'interest', temperament: 'ideologue', text: "The principle is sound, but it doesn't go far enough. What else are you willing to commit to?" },
  { tier: 4, driver: 'interest', temperament: 'ideologue', text: "I could support this if I believed you actually meant it." },
  { tier: 4, driver: 'interest', temperament: 'ideologue', text: "This is close to what I'd want, but you're missing something important." },
  { tier: 4, driver: 'interest', temperament: 'ideologue', text: "I need to see more conviction before I put my name on this." },

  // What's in it for me? — Interest Alignment — Follower
  { tier: 4, driver: 'interest', temperament: 'follower', text: "The leadership's stance matters, but I need clarity on where they actually stand." },
  { tier: 4, driver: 'interest', temperament: 'follower', text: "The policy's fine, but I need to know it has real institutional backing." },
  { tier: 4, driver: 'interest', temperament: 'follower', text: "The substance is one thing — the party's real commitment is another. Which is it?" },
  { tier: 4, driver: 'interest', temperament: 'follower', text: "I'll follow on this, but only if it's actually a party priority." },

  // What's in it for me? — Interest Alignment — Dealmaker
  { tier: 4, driver: 'interest', temperament: 'dealmaker', text: "I'm giving up more than I'm getting here. Fix that balance and you have a deal." },
  { tier: 4, driver: 'interest', temperament: 'dealmaker', text: "Get me the language that protects my real interests and we have a deal." },
  { tier: 4, driver: 'interest', temperament: 'dealmaker', text: "You've got the outline right. Now let's negotiate the parts that matter to me." },
  { tier: 4, driver: 'interest', temperament: 'dealmaker', text: "I see what you're trying to do. Now show me you're willing to do something for what I'm trying to do." },

  // What's in it for me? — Interest Alignment — Opportunist
  { tier: 4, driver: 'interest', temperament: 'opportunist', text: "This could work if the numbers break right — but they're not there yet, so why move?" },
  { tier: 4, driver: 'interest', temperament: 'opportunist', text: "I'll consider it if it starts looking like the obvious move. Right now it's not." },
  { tier: 4, driver: 'interest', temperament: 'opportunist', text: "The policy's one option among several. Show me it's the only option left." },
  { tier: 4, driver: 'interest', temperament: 'opportunist', text: "I'm open, but there's no urgency. What's the timeline that makes this matter?" },

  // What's in it for me? — Sentiment — Ideologue
  { tier: 4, driver: 'sentiment', temperament: 'ideologue', text: "I want to believe in you again, but you have to earn that back first." },
  { tier: 4, driver: 'sentiment', temperament: 'ideologue', text: "You've disappointed before. One clear signal you've changed and I'll reconsider." },
  { tier: 4, driver: 'sentiment', temperament: 'ideologue', text: "Trust is complicated for us now. Make a gesture that costs you something." },
  { tier: 4, driver: 'sentiment', temperament: 'ideologue', text: "History matters, but recent history matters more. Show me you're not the same person." },

  // What's in it for me? — Sentiment — Follower
  { tier: 4, driver: 'sentiment', temperament: 'follower', text: "I respect your track record, but this needs the leadership's full weight behind it." },
  { tier: 4, driver: 'sentiment', temperament: 'follower', text: "You're credible with me, but not enough to go against the party line. Where do they stand?" },
  { tier: 4, driver: 'sentiment', temperament: 'follower', text: "I trust you, but I follow the organization. If they're not with you, neither am I." },
  { tier: 4, driver: 'sentiment', temperament: 'follower', text: "Your reputation is solid, but it can't outweigh party concerns. Get them on board." },

  // What's in it for me? — Sentiment — Dealmaker
  { tier: 4, driver: 'sentiment', temperament: 'dealmaker', text: "We've had a good relationship — now it's time to cash in with something real." },
  { tier: 4, driver: 'sentiment', temperament: 'dealmaker', text: "History says you owe me. This would be a good time to make good." },
  { tier: 4, driver: 'sentiment', temperament: 'dealmaker', text: "I've been there for you. Now I need you there for me. What's it going to be?" },
  { tier: 4, driver: 'sentiment', temperament: 'dealmaker', text: "We've built trust. Prove it's real by doing something tangible." },

  // What's in it for me? — Sentiment — Opportunist
  { tier: 4, driver: 'sentiment', temperament: 'opportunist', text: "You've been useful before — but you're not useful right now. Make yourself useful." },
  { tier: 4, driver: 'sentiment', temperament: 'opportunist', text: "I remember when working with you was the smart play. Make it the smart play again." },
  { tier: 4, driver: 'sentiment', temperament: 'opportunist', text: "You're not the obvious ally in this moment. Change the moment." },
  { tier: 4, driver: 'sentiment', temperament: 'opportunist', text: "We've worked together, but timing's everything. Show me the timing's right." },

  // What's in it for me? — Party Pressure — Ideologue
  { tier: 4, driver: 'party', temperament: 'ideologue', text: "My conscience aligns with where the party's headed — but I need to see the party actually commit." },
  { tier: 4, driver: 'party', temperament: 'ideologue', text: "I believe this is the right direction. I need the party to confirm they're walking it with me." },
  { tier: 4, driver: 'party', temperament: 'ideologue', text: "I need the party to show its true colors before I align mine." },
  { tier: 4, driver: 'party', temperament: 'ideologue', text: "I know where I stand. I need to verify the party stands there too before I act as part of it." },

  // What's in it for me? — Party Pressure — Follower
  { tier: 4, driver: 'party', temperament: 'follower', text: "The Whip hasn't cracked yet, so I'm not sure how serious this is. What's the actual word?" },
  { tier: 4, driver: 'party', temperament: 'follower', text: "I'll go where the party goes, but I need to hear that directly from leadership." },
  { tier: 4, driver: 'party', temperament: 'follower', text: "The party line on this is what I need. What's the official word?" },
  { tier: 4, driver: 'party', temperament: 'follower', text: "I move when the organization moves. Has it moved on this?" },

  // What's in it for me? — Party Pressure — Dealmaker
  { tier: 4, driver: 'party', temperament: 'dealmaker', text: "Leadership's pushing this, so I need something in exchange for being the loyal soldier." },
  { tier: 4, driver: 'party', temperament: 'dealmaker', text: "I'll take the party heat if there's something in it for me. What's the deal?" },
  { tier: 4, driver: 'party', temperament: 'dealmaker', text: "The party's asking for loyalty here. Loyalty costs. What's the price you're willing to pay?" },
  { tier: 4, driver: 'party', temperament: 'dealmaker', text: "I'm the vote you need, which means I'm the one taking the risk. What does that buy me?" },

  // What's in it for me? — Party Pressure — Opportunist
  { tier: 4, driver: 'party', temperament: 'opportunist', text: "The party's still figuring this out. I'm waiting to see which way the wind shifts." },
  { tier: 4, driver: 'party', temperament: 'opportunist', text: "Leadership's divided, so there's no clear momentum. Show me there is." },
  { tier: 4, driver: 'party', temperament: 'opportunist', text: "The party's not locked in, so neither am I. What's the actual odds this holds?" },
  { tier: 4, driver: 'party', temperament: 'opportunist', text: "There's no organizational consensus yet. Show me the odds improve." },

  // What's in it for me? — District Pressure — Ideologue
  { tier: 4, driver: 'district', temperament: 'ideologue', text: "My district sends me here to do what's right, not what's convenient. Convince me this is right." },
  { tier: 4, driver: 'district', temperament: 'ideologue', text: "The voters don't send mixed signals. Does this serve the principles they elected me on?" },
  { tier: 4, driver: 'district', temperament: 'ideologue', text: "I answer to my people's conscience. Prove this serves that." },
  { tier: 4, driver: 'district', temperament: 'ideologue', text: "The district matters, but my judgment about what serves them matters too. Make the case." },

  // What's in it for me? — District Pressure — Follower
  { tier: 4, driver: 'district', temperament: 'follower', text: "My constituents need to feel they got something, or they'll primary me. What do they get?" },
  { tier: 4, driver: 'district', temperament: 'follower', text: "The district's my first loyalty. Show me something they benefit from." },
  { tier: 4, driver: 'district', temperament: 'follower', text: "People back home are watching. What's the story I tell them?" },
  { tier: 4, driver: 'district', temperament: 'follower', text: "I need a local win to justify this vote. What's the local win?" },

  // What's in it for me? — District Pressure — Dealmaker
  { tier: 4, driver: 'district', temperament: 'dealmaker', text: "My district's going to take heat, so I need something to offset that. What's the benefit?" },
  { tier: 4, driver: 'district', temperament: 'dealmaker', text: "This costs me with my voters unless I can show them a return. What's my return?" },
  { tier: 4, driver: 'district', temperament: 'dealmaker', text: "The district's skeptical, and rightfully so. Buy them off with something concrete." },
  { tier: 4, driver: 'district', temperament: 'dealmaker', text: "My people need to see value here. What value are you putting on the table?" },

  // What's in it for me? — District Pressure — Opportunist
  { tier: 4, driver: 'district', temperament: 'opportunist', text: "Polling shows my district's not ready for this. Get the polling to move and I'll move with it." },
  { tier: 4, driver: 'district', temperament: 'opportunist', text: "The voters aren't pushing me this way. What's the momentum you're seeing?" },
  { tier: 4, driver: 'district', temperament: 'opportunist', text: "Back home is neutral at best. Show me they're warming up." },
  { tier: 4, driver: 'district', temperament: 'opportunist', text: "The district's not demanding this. What changes the urgency?" },

  // What's in it for me? — Faction Pressure — Ideologue
  { tier: 4, driver: 'faction', temperament: 'ideologue', text: "Outside groups are making this a test. I need to be sure the principle is worth it." },
  { tier: 4, driver: 'faction', temperament: 'ideologue', text: "Factions care about this, which means it's real. Convince me it's the right kind of real." },
  { tier: 4, driver: 'faction', temperament: 'ideologue', text: "Interest groups are taking sides. But does it matter in the way I think?" },
  { tier: 4, driver: 'faction', temperament: 'ideologue', text: "The outside pressure is coming. Make sure those stakes are the right stakes." },

  // What's in it for me? — Faction Pressure — Follower
  { tier: 4, driver: 'faction', temperament: 'follower', text: "Factions are mobilizing. I need assurance from leadership. Do I have it?" },
  { tier: 4, driver: 'faction', temperament: 'follower', text: "Outside groups are going to come after me if I move. Will the party back me?" },
  { tier: 4, driver: 'faction', temperament: 'follower', text: "Faction pressure's building. I need the organization to be clear they're backing me." },
  { tier: 4, driver: 'faction', temperament: 'follower', text: "Interest groups are going to spend against this. I need the party to spend for me." },

  // What's in it for me? — Faction Pressure — Dealmaker
  { tier: 4, driver: 'faction', temperament: 'dealmaker', text: "Groups are going to come at me for this. What compensates for the exposure?" },
  { tier: 4, driver: 'faction', temperament: 'dealmaker', text: "Factions are mobilizing, which is expensive for me. What am I getting paid for that risk?" },
  { tier: 4, driver: 'faction', temperament: 'dealmaker', text: "The outside pressure's going to be real. The compensation has to be real too." },
  { tier: 4, driver: 'faction', temperament: 'dealmaker', text: "Interest groups are going to target me. What does concrete help look like?" },

  // What's in it for me? — Faction Pressure — Opportunist
  { tier: 4, driver: 'faction', temperament: 'opportunist', text: "Factions are still unaligned. Show me there will be a consequence one way or the other." },
  { tier: 4, driver: 'faction', temperament: 'opportunist', text: "Interest groups are divided, so this isn't a determined fight. When it is, I'll know what to do." },
  { tier: 4, driver: 'faction', temperament: 'opportunist', text: "Faction pressure's not consolidated enough to force my hand. When it is, we'll talk." },
  { tier: 4, driver: 'faction', temperament: 'opportunist', text: "Outside groups aren't unified against this yet. Make the risk practical and I'll recalculate." },

  // What's in it for me? — Momentum — Opportunist
  { tier: 4, driver: 'momentum', temperament: 'opportunist', text: "The bill's not dead, but it's not alive either. Show me signs of life." },
  { tier: 4, driver: 'momentum', temperament: 'opportunist', text: "Cosponsor count is flat. Get it moving and we'll talk." },
  { tier: 4, driver: 'momentum', temperament: 'opportunist', text: "I don't bet on stalled horses. Show me this one's about to run." },
  { tier: 4, driver: 'momentum', temperament: 'opportunist', text: "The numbers are stuck. Unstick them and I'll revisit." },

  // =====================================================================
  // TIER 5: "I can't" — Net Willingness -20 to -39
  // =====================================================================

  // I can't — Interest Alignment — Ideologue
  { tier: 5, driver: 'interest', temperament: 'ideologue', text: "If this bill were different, I'd be different. But it's not." },
  { tier: 5, driver: 'interest', temperament: 'ideologue', text: "My principles aren't for sale, but I'm listening if you can explain the logic." },
  { tier: 5, driver: 'interest', temperament: 'ideologue', text: "As written, this fails my test. Change what it actually does and I'll look again." },
  { tier: 5, driver: 'interest', temperament: 'ideologue', text: "I don't move on faith. Give me something to believe in here." },

  // I can't — Interest Alignment — Follower
  { tier: 5, driver: 'interest', temperament: 'follower', text: "I can't square this with what the party says it stands for." },
  { tier: 5, driver: 'interest', temperament: 'follower', text: "I need to understand how this fits the platform before I can commit." },
  { tier: 5, driver: 'interest', temperament: 'follower', text: "I can't move until I know where the party stands on this. That's what guides my vote." },
  { tier: 5, driver: 'interest', temperament: 'follower', text: "The party line on this isn't clear enough for me to move." },

  // I can't — Interest Alignment — Dealmaker
  { tier: 5, driver: 'interest', temperament: 'dealmaker', text: "There's nothing on this table I want. Put something there." },
  { tier: 5, driver: 'interest', temperament: 'dealmaker', text: "I'm not moving without understanding what I get out of this." },
  { tier: 5, driver: 'interest', temperament: 'dealmaker', text: "Put a favor on the table — a real one — and maybe we have a conversation." },
  { tier: 5, driver: 'interest', temperament: 'dealmaker', text: "I can't commit to something that doesn't pay off down the line." },

  // I can't — Interest Alignment — Opportunist
  { tier: 5, driver: 'interest', temperament: 'opportunist', text: "The math doesn't work right now. Ask me when it does." },
  { tier: 5, driver: 'interest', temperament: 'opportunist', text: "I can't read the room yet. Come back when there's more momentum." },
  { tier: 5, driver: 'interest', temperament: 'opportunist', text: "The calculus isn't there. Maybe after the dynamics shift." },
  { tier: 5, driver: 'interest', temperament: 'opportunist', text: "Right now this is a losing bet. Check back when the odds improve." },

  // I can't — Sentiment — Ideologue
  { tier: 5, driver: 'sentiment', temperament: 'ideologue', text: "I remember what you did. Show me you've changed — not with words, but with votes." },
  { tier: 5, driver: 'sentiment', temperament: 'ideologue', text: "Our history matters, and right now it's not working in your favor." },
  { tier: 5, driver: 'sentiment', temperament: 'ideologue', text: "I can't forget the last time. Prove this is different." },
  { tier: 5, driver: 'sentiment', temperament: 'ideologue', text: "I want to believe you've changed. Give me reason to." },

  // I can't — Sentiment — Follower
  { tier: 5, driver: 'sentiment', temperament: 'follower', text: "I can't move without seeing the leadership commit first. Where's the party on this?" },
  { tier: 5, driver: 'sentiment', temperament: 'follower', text: "I need to know the top is behind you before I can be." },
  { tier: 5, driver: 'sentiment', temperament: 'follower', text: "I can't follow you into this alone. I need to see the party move with you." },
  { tier: 5, driver: 'sentiment', temperament: 'follower', text: "Leadership has to signal first. Then I'll consider it." },

  // I can't — Sentiment — Dealmaker
  { tier: 5, driver: 'sentiment', temperament: 'dealmaker', text: "We don't have enough history for me to take this risk." },
  { tier: 5, driver: 'sentiment', temperament: 'dealmaker', text: "I can't spend political capital I haven't accumulated with you." },
  { tier: 5, driver: 'sentiment', temperament: 'dealmaker', text: "Work with me on smaller things first. Then we talk about the big ask." },
  { tier: 5, driver: 'sentiment', temperament: 'dealmaker', text: "I can't cash in a favor I haven't earned yet. Give me time." },

  // I can't — Sentiment — Opportunist
  { tier: 5, driver: 'sentiment', temperament: 'opportunist', text: "I can't align with you until you prove you're a winner. Show me cosponsors." },
  { tier: 5, driver: 'sentiment', temperament: 'opportunist', text: "You need better cosponsors before I climb on board." },
  { tier: 5, driver: 'sentiment', temperament: 'opportunist', text: "I can't hitch my wagon to this yet. Get more votes first." },
  { tier: 5, driver: 'sentiment', temperament: 'opportunist', text: "Find three strong names first, then come back." },

  // I can't — Party Pressure — Ideologue
  { tier: 5, driver: 'party', temperament: 'ideologue', text: "The party's principles aren't aligned with this, and I can't break ranks on something that matters." },
  { tier: 5, driver: 'party', temperament: 'ideologue', text: "The party hasn't reached the right position yet. I can't get ahead of them, even if I want to." },
  { tier: 5, driver: 'party', temperament: 'ideologue', text: "I won't be the one who splits the party on this." },
  { tier: 5, driver: 'party', temperament: 'ideologue', text: "The party's conscience is clear on this. Mine has to be too." },

  // I can't — Party Pressure — Follower
  { tier: 5, driver: 'party', temperament: 'follower', text: "The party hasn't sanctioned this. My hands are tied." },
  { tier: 5, driver: 'party', temperament: 'follower', text: "I haven't heard from leadership on this one. I can't get ahead of them." },
  { tier: 5, driver: 'party', temperament: 'follower', text: "The Whip hasn't weighed in. Until she does, I'm staying put." },
  { tier: 5, driver: 'party', temperament: 'follower', text: "I follow the party line. This isn't it." },

  // I can't — Party Pressure — Dealmaker
  { tier: 5, driver: 'party', temperament: 'dealmaker', text: "The party owes me favors I'm not ready to spend. I can't burn that capital here." },
  { tier: 5, driver: 'party', temperament: 'dealmaker', text: "I need to hear directly from the top before I can negotiate on this." },
  { tier: 5, driver: 'party', temperament: 'dealmaker', text: "Leadership hasn't asked for my vote yet. When they do, I'll know what it costs." },
  { tier: 5, driver: 'party', temperament: 'dealmaker', text: "The party's credit with me is valuable. I'm not spending it on this." },

  // I can't — Party Pressure — Opportunist
  { tier: 5, driver: 'party', temperament: 'opportunist', text: "The party's still deciding where it stands. I can't move until the odds are clearer." },
  { tier: 5, driver: 'party', temperament: 'opportunist', text: "I don't see enough party members committing for me to risk it." },
  { tier: 5, driver: 'party', temperament: 'opportunist', text: "Too many party members are fence-sitting. Come back when you've got more locked in." },
  { tier: 5, driver: 'party', temperament: 'opportunist', text: "The party's still testing the waters. I'm waiting to see who commits first." },

  // I can't — District Pressure — Ideologue
  { tier: 5, driver: 'district', temperament: 'ideologue', text: "My constituents have principles too, and this isn't aligned. I can't vote against my people." },
  { tier: 5, driver: 'district', temperament: 'ideologue', text: "I can't represent them if I ignore what they believe in." },
  { tier: 5, driver: 'district', temperament: 'ideologue', text: "I would have to answer to the people who elected me. I can't do it." },
  { tier: 5, driver: 'district', temperament: 'ideologue', text: "My district sent me here to fight for something. This isn't it." },

  // I can't — District Pressure — Follower
  { tier: 5, driver: 'district', temperament: 'follower', text: "The people back home aren't behind this yet. I have to follow their lead." },
  { tier: 5, driver: 'district', temperament: 'follower', text: "I can't get this past my constituents without more support from the ground." },
  { tier: 5, driver: 'district', temperament: 'follower', text: "My district hasn't bought in. Until they do, I can't move." },
  { tier: 5, driver: 'district', temperament: 'follower', text: "My district's leadership won't let me move on this. I can't ignore them." },

  // I can't — District Pressure — Dealmaker
  { tier: 5, driver: 'district', temperament: 'dealmaker', text: "My district expects something in return for my votes. I don't see a payoff here." },
  { tier: 5, driver: 'district', temperament: 'dealmaker', text: "I can't spend political capital with my voters unless they see what they get." },
  { tier: 5, driver: 'district', temperament: 'dealmaker', text: "I owe my district real results. This doesn't deliver." },
  { tier: 5, driver: 'district', temperament: 'dealmaker', text: "My voters keep score. I can't cash in a vote I can't explain to them." },

  // I can't — District Pressure — Opportunist
  { tier: 5, driver: 'district', temperament: 'opportunist', text: "My district is watching me too closely right now. Maybe after the primary." },
  { tier: 5, driver: 'district', temperament: 'opportunist', text: "The polls back home don't support this. I can't take the risk." },
  { tier: 5, driver: 'district', temperament: 'opportunist', text: "Ask me again after I survive reelection. Right now, it's not happening." },
  { tier: 5, driver: 'district', temperament: 'opportunist', text: "My constituents would eat me alive. Not worth it." },

  // I can't — Faction Pressure — Ideologue
  { tier: 5, driver: 'faction', temperament: 'ideologue', text: "The groups that hold me accountable would see this as a betrayal. Change their minds, or change the bill." },
  { tier: 5, driver: 'faction', temperament: 'ideologue', text: "I have values they respect. I can't abandon them just to help you." },
  { tier: 5, driver: 'faction', temperament: 'ideologue', text: "My integrity is worth more than one vote. I can't compromise it." },
  { tier: 5, driver: 'faction', temperament: 'ideologue', text: "The groups that support me would lose faith. I can't risk that." },

  // I can't — Faction Pressure — Follower
  { tier: 5, driver: 'faction', temperament: 'follower', text: "The factions I answer to aren't on board yet. I need their blessing first." },
  { tier: 5, driver: 'faction', temperament: 'follower', text: "I can't move without knowing the organized groups support this." },
  { tier: 5, driver: 'faction', temperament: 'follower', text: "The power structure behind me needs to align before I do." },
  { tier: 5, driver: 'faction', temperament: 'follower', text: "My backers haven't signaled yes. So I can't either." },

  // I can't — Faction Pressure — Dealmaker
  { tier: 5, driver: 'faction', temperament: 'dealmaker', text: "The people funding me have a say in this. They're not convinced yet." },
  { tier: 5, driver: 'faction', temperament: 'dealmaker', text: "I can't burn the groups that built me up. Not without knowing what I get." },
  { tier: 5, driver: 'faction', temperament: 'dealmaker', text: "My financial backers have a veto. Right now they're not using it, but they will." },
  { tier: 5, driver: 'faction', temperament: 'dealmaker', text: "The factions I work with haven't approved this. I can't cross them." },

  // I can't — Faction Pressure — Opportunist
  { tier: 5, driver: 'faction', temperament: 'opportunist', text: "The organized groups haven't weighed in. Too much uncertainty." },
  { tier: 5, driver: 'faction', temperament: 'opportunist', text: "I can't move until the external pressure favors this more than it opposes it." },
  { tier: 5, driver: 'faction', temperament: 'opportunist', text: "The faction dynamics are too unclear right now. Ask again when they solidify." },
  { tier: 5, driver: 'faction', temperament: 'opportunist', text: "Too many moving pieces with the groups involved. I'm staying put." },

  // I can't — Momentum — Opportunist
  { tier: 5, driver: 'momentum', temperament: 'opportunist', text: "The bill's stalled. Come back when it's got real velocity." },
  { tier: 5, driver: 'momentum', temperament: 'opportunist', text: "Nobody's moving on this yet. I'm waiting for the herd." },
  { tier: 5, driver: 'momentum', temperament: 'opportunist', text: "I don't see this gaining traction. Call me when it does." },
  { tier: 5, driver: 'momentum', temperament: 'opportunist', text: "The odds aren't there. Not yet." },

  // =====================================================================
  // TIER 6: "No" — Net Willingness -40 to -59
  // =====================================================================

  // No — Interest Alignment — Ideologue
  { tier: 6, driver: 'interest', temperament: 'ideologue', text: "This goes against everything I believe in. The answer is no." },
  { tier: 6, driver: 'interest', temperament: 'ideologue', text: "I won't support something this fundamentally wrong, no matter the pressure." },
  { tier: 6, driver: 'interest', temperament: 'ideologue', text: "You're asking me to betray my principles. That's not negotiable." },
  { tier: 6, driver: 'interest', temperament: 'ideologue', text: "This contradicts what I stand for. No." },

  // No — Interest Alignment — Follower
  { tier: 6, driver: 'interest', temperament: 'follower', text: "The party's position is no. So mine is no." },
  { tier: 6, driver: 'interest', temperament: 'follower', text: "I follow the party line, and the party says no on this." },
  { tier: 6, driver: 'interest', temperament: 'follower', text: "Party leadership is against this. I'm against it." },
  { tier: 6, driver: 'interest', temperament: 'follower', text: "The official position is no. That's my position too." },

  // No — Interest Alignment — Dealmaker
  { tier: 6, driver: 'interest', temperament: 'dealmaker', text: "This deal doesn't benefit me or my interests. The answer is no." },
  { tier: 6, driver: 'interest', temperament: 'dealmaker', text: "This is so far from my interests that no deal structure saves it. No." },
  { tier: 6, driver: 'interest', temperament: 'dealmaker', text: "There's nothing you could put on the table that outweighs what this costs me. No." },
  { tier: 6, driver: 'interest', temperament: 'dealmaker', text: "What I'd give versus what I'd get — the ledger doesn't balance. No." },

  // No — Interest Alignment — Opportunist
  { tier: 6, driver: 'interest', temperament: 'opportunist', text: "The fundamentals are terrible. No." },
  { tier: 6, driver: 'interest', temperament: 'opportunist', text: "This is a losing proposition every way I look at it." },
  { tier: 6, driver: 'interest', temperament: 'opportunist', text: "The odds are against this ever passing. I'm out." },
  { tier: 6, driver: 'interest', temperament: 'opportunist', text: "The risk-reward is inverted. No." },

  // No — Sentiment — Ideologue
  { tier: 6, driver: 'sentiment', temperament: 'ideologue', text: "After what happened between us, I can't trust your judgment. No." },
  { tier: 6, driver: 'sentiment', temperament: 'ideologue', text: "You've shown me who you are. I believe you. And the answer is no." },
  { tier: 6, driver: 'sentiment', temperament: 'ideologue', text: "I remember what you did. This is still no." },
  { tier: 6, driver: 'sentiment', temperament: 'ideologue', text: "Your track record speaks for itself. No." },

  // No — Sentiment — Follower
  { tier: 6, driver: 'sentiment', temperament: 'follower', text: "You don't have the party's backing on this. I'm not moving." },
  { tier: 6, driver: 'sentiment', temperament: 'follower', text: "Leadership isn't behind you. I can't be either." },
  { tier: 6, driver: 'sentiment', temperament: 'follower', text: "The top doesn't trust you on this. Neither do I." },
  { tier: 6, driver: 'sentiment', temperament: 'follower', text: "The party has made its choice about you. Mine is no." },

  // No — Sentiment — Dealmaker
  { tier: 6, driver: 'sentiment', temperament: 'dealmaker', text: "You've burned me before. I don't have the stomach for it again." },
  { tier: 6, driver: 'sentiment', temperament: 'dealmaker', text: "Our relationship is spent. I'm not extending more credit." },
  { tier: 6, driver: 'sentiment', temperament: 'dealmaker', text: "You've taken too many favors and delivered nothing. No." },
  { tier: 6, driver: 'sentiment', temperament: 'dealmaker', text: "I don't do business with people who don't keep their word." },

  // No — Sentiment — Opportunist
  { tier: 6, driver: 'sentiment', temperament: 'opportunist', text: "You're a sinking ship. I'm not going down with you." },
  { tier: 6, driver: 'sentiment', temperament: 'opportunist', text: "You've got no traction and no allies worth having. No." },
  { tier: 6, driver: 'sentiment', temperament: 'opportunist', text: "You're radioactive right now. No." },
  { tier: 6, driver: 'sentiment', temperament: 'opportunist', text: "Backing you is the wrong bet. I don't follow losers." },

  // No — Party Pressure — Ideologue
  { tier: 6, driver: 'party', temperament: 'ideologue', text: "The party has taken a stand on principle here. I stand with them. No." },
  { tier: 6, driver: 'party', temperament: 'ideologue', text: "I believe in the party's position. I'm not breaking ranks." },
  { tier: 6, driver: 'party', temperament: 'ideologue', text: "This is a core party value. I won't betray it." },
  { tier: 6, driver: 'party', temperament: 'ideologue', text: "The party is right on this. I'm voting no." },

  // No — Party Pressure — Follower
  { tier: 6, driver: 'party', temperament: 'follower', text: "The Whip says no. I say no." },
  { tier: 6, driver: 'party', temperament: 'follower', text: "Leadership has drawn the line. So have I." },
  { tier: 6, driver: 'party', temperament: 'follower', text: "The party position is locked. So is mine." },
  { tier: 6, driver: 'party', temperament: 'follower', text: "The party leadership told me to vote no. I'm voting no." },

  // No — Party Pressure — Dealmaker
  { tier: 6, driver: 'party', temperament: 'dealmaker', text: "Leadership has made it clear there's a cost to breaking ranks. I'm not paying it." },
  { tier: 6, driver: 'party', temperament: 'dealmaker', text: "The party's got enough leverage over me that I can't afford to move. No." },
  { tier: 6, driver: 'party', temperament: 'dealmaker', text: "I need the party more than I need this vote. So no." },
  { tier: 6, driver: 'party', temperament: 'dealmaker', text: "The party owns me on this issue. The answer is no." },

  // No — Party Pressure — Opportunist
  { tier: 6, driver: 'party', temperament: 'opportunist', text: "The party's unified against this. I'm not walking into that alone." },
  { tier: 6, driver: 'party', temperament: 'opportunist', text: "Too many party members are committed to no. I can't beat that." },
  { tier: 6, driver: 'party', temperament: 'opportunist', text: "The party machine is locked in. I'm not fighting it." },
  { tier: 6, driver: 'party', temperament: 'opportunist', text: "The internal politics are settled. No." },

  // No — District Pressure — Ideologue
  { tier: 6, driver: 'district', temperament: 'ideologue', text: "My constituents are clear: this violates what they elected me to protect. No." },
  { tier: 6, driver: 'district', temperament: 'ideologue', text: "I represent my district's values. This isn't one of them." },
  { tier: 6, driver: 'district', temperament: 'ideologue', text: "My people sent me here to fight against exactly this. No." },
  { tier: 6, driver: 'district', temperament: 'ideologue', text: "My district's position is fixed. Mine is too." },

  // No — District Pressure — Follower
  { tier: 6, driver: 'district', temperament: 'follower', text: "My district leadership has made it clear. They say no, I say no." },
  { tier: 6, driver: 'district', temperament: 'follower', text: "The ground back home is unified against this." },
  { tier: 6, driver: 'district', temperament: 'follower', text: "My constituents have already spoken. I follow them." },
  { tier: 6, driver: 'district', temperament: 'follower', text: "The district consensus is no. I'm no." },

  // No — District Pressure — Dealmaker
  { tier: 6, driver: 'district', temperament: 'dealmaker', text: "My voters would punish me for this. The political cost is too high." },
  { tier: 6, driver: 'district', temperament: 'dealmaker', text: "I can't survive a primary if I vote this way. No." },
  { tier: 6, driver: 'district', temperament: 'dealmaker', text: "My district will primary me if I move. So I'm not moving." },
  { tier: 6, driver: 'district', temperament: 'dealmaker', text: "The electoral math doesn't work. No." },

  // No — District Pressure — Opportunist
  { tier: 6, driver: 'district', temperament: 'opportunist', text: "My approval ratings can't take another hit. This would sink me." },
  { tier: 6, driver: 'district', temperament: 'opportunist', text: "My district's ready to turn on me. I can't give them a reason." },
  { tier: 6, driver: 'district', temperament: 'opportunist', text: "I'm one vote away from a primary challenge. Not this one." },
  { tier: 6, driver: 'district', temperament: 'opportunist', text: "The political winds at home are against me. I can't move." },

  // No — Faction Pressure — Ideologue
  { tier: 6, driver: 'faction', temperament: 'ideologue', text: "The groups I respect would see this as a moral failure. I won't do it." },
  { tier: 6, driver: 'faction', temperament: 'ideologue', text: "The factions that align with my values are unanimous on this. No." },
  { tier: 6, driver: 'faction', temperament: 'ideologue', text: "The organizations I admire would lose faith. I won't betray them." },
  { tier: 6, driver: 'faction', temperament: 'ideologue', text: "My principles and the factions that support them say no." },

  // No — Faction Pressure — Follower
  { tier: 6, driver: 'faction', temperament: 'follower', text: "The organized interests behind me are locked in on no." },
  { tier: 6, driver: 'faction', temperament: 'follower', text: "The faction leadership has made it clear. No." },
  { tier: 6, driver: 'faction', temperament: 'follower', text: "The power structure I'm part of won't allow this." },
  { tier: 6, driver: 'faction', temperament: 'follower', text: "The factions have decided. I go where they go." },

  // No — Faction Pressure — Dealmaker
  { tier: 6, driver: 'faction', temperament: 'dealmaker', text: "The people I answer to aren't going to like this. There's no deal that fixes that." },
  { tier: 6, driver: 'faction', temperament: 'dealmaker', text: "I've got relationships to protect. This vote would cost me more than you're offering." },
  { tier: 6, driver: 'faction', temperament: 'dealmaker', text: "You're asking me to burn bridges I've spent years building. The answer is no." },
  { tier: 6, driver: 'faction', temperament: 'dealmaker', text: "I know who funds my campaign. Do you?" },

  // No — Faction Pressure — Opportunist
  { tier: 6, driver: 'faction', temperament: 'opportunist', text: "The organized groups are moving against this. I'm not swimming upstream." },
  { tier: 6, driver: 'faction', temperament: 'opportunist', text: "Too many powerful factions are lined up against this. No." },
  { tier: 6, driver: 'faction', temperament: 'opportunist', text: "The external pressure is too unified. I can't move." },
  { tier: 6, driver: 'faction', temperament: 'opportunist', text: "The faction dynamics have settled. No." },

  // No — Momentum — Opportunist
  { tier: 6, driver: 'momentum', temperament: 'opportunist', text: "This is dead in the water. I don't throw good votes after bad." },
  { tier: 6, driver: 'momentum', temperament: 'opportunist', text: "There's no momentum here. Never will be." },
  { tier: 6, driver: 'momentum', temperament: 'opportunist', text: "This bill's going nowhere. I'm not wasting political capital." },
  { tier: 6, driver: 'momentum', temperament: 'opportunist', text: "Nobody's moving on this. The answer is no." },

  // =====================================================================
  // TIER 7: "Absolutely not, and..." — Net Willingness -60 or lower
  // =====================================================================

  // Absolutely not — Interest Alignment — Ideologue
  { tier: 7, driver: 'interest', temperament: 'ideologue', text: "This is an affront to everything I stand for." },
  { tier: 7, driver: 'interest', temperament: 'ideologue', text: "I will not only vote against this — I will make sure others do too." },
  { tier: 7, driver: 'interest', temperament: 'ideologue', text: "You brought this to me? Do you know what I believe?" },
  { tier: 7, driver: 'interest', temperament: 'ideologue', text: "This isn't politics. This is a matter of principle, and you're on the wrong side." },

  // Absolutely not — Interest Alignment — Follower
  { tier: 7, driver: 'interest', temperament: 'follower', text: "The party would never ask for this, and I'm making sure leadership knows you did." },
  { tier: 7, driver: 'interest', temperament: 'follower', text: "This goes so far against party principle that I'm reporting this conversation." },
  { tier: 7, driver: 'interest', temperament: 'follower', text: "You're asking me to betray the party foundation. Leadership needs to know." },
  { tier: 7, driver: 'interest', temperament: 'follower', text: "I'm not just saying no — I'm documenting that you asked." },

  // Absolutely not — Interest Alignment — Dealmaker
  { tier: 7, driver: 'interest', temperament: 'dealmaker', text: "You just destroyed every deal we'll ever make, and I'm telling people why." },
  { tier: 7, driver: 'interest', temperament: 'dealmaker', text: "You've proven you don't understand how this works. That changes everything between us." },
  { tier: 7, driver: 'interest', temperament: 'dealmaker', text: "Your credit with me just went to zero. Permanently." },
  { tier: 7, driver: 'interest', temperament: 'dealmaker', text: "You've shown your hand as someone without a real argument. People will notice." },

  // Absolutely not — Interest Alignment — Opportunist
  { tier: 7, driver: 'interest', temperament: 'opportunist', text: "This has zero chance and asking me tells everyone how desperate you are." },
  { tier: 7, driver: 'interest', temperament: 'opportunist', text: "You're backing a loser, and I'm making sure people know I rejected it early." },
  { tier: 7, driver: 'interest', temperament: 'opportunist', text: "This is going to crash hard. I'm making sure I'm on the record as no." },
  { tier: 7, driver: 'interest', temperament: 'opportunist', text: "The fundamentals are so bad that saying yes would destroy my judgment." },

  // Absolutely not — Sentiment — Ideologue
  { tier: 7, driver: 'sentiment', temperament: 'ideologue', text: "Your betrayal taught me who you are. Asking again just proves it." },
  { tier: 7, driver: 'sentiment', temperament: 'ideologue', text: "I trusted you once and that was a mistake. I'm making sure no one else makes it." },
  { tier: 7, driver: 'sentiment', temperament: 'ideologue', text: "Your history is disqualifying. I'm going to make sure it follows you." },
  { tier: 7, driver: 'sentiment', temperament: 'ideologue', text: "You've shown me character isn't negotiable with you. Others should know that." },

  // Absolutely not — Sentiment — Follower
  { tier: 7, driver: 'sentiment', temperament: 'follower', text: "Leadership has already lost faith in you. Asking me just confirms it for everyone." },
  { tier: 7, driver: 'sentiment', temperament: 'follower', text: "The party chose not to trust you on this. I'm reinforcing that publicly." },
  { tier: 7, driver: 'sentiment', temperament: 'follower', text: "Your relationship with the top is finished. I'm not helping you pretend otherwise." },
  { tier: 7, driver: 'sentiment', temperament: 'follower', text: "The party's judgment about you is sound. I'm making sure that sticks." },

  // Absolutely not — Sentiment — Dealmaker
  { tier: 7, driver: 'sentiment', temperament: 'dealmaker', text: "You're trying to cash a check that doesn't exist. I'm broadcasting how empty your account is." },
  { tier: 7, driver: 'sentiment', temperament: 'dealmaker', text: "Our relationship is so depleted that asking proves you don't understand the game." },
  { tier: 7, driver: 'sentiment', temperament: 'dealmaker', text: "You burned every bridge with me. Now I'm burning the ones you have with others." },
  { tier: 7, driver: 'sentiment', temperament: 'dealmaker', text: "You've proven you can't be counted on. I'm making sure everyone knows it." },

  // Absolutely not — Sentiment — Opportunist
  { tier: 7, driver: 'sentiment', temperament: 'opportunist', text: "You're backing a dead horse, and following you would destroy my standing. I'm actively distancing." },
  { tier: 7, driver: 'sentiment', temperament: 'opportunist', text: "You've got no winners behind you. Asking proves your judgment is worthless." },
  { tier: 7, driver: 'sentiment', temperament: 'opportunist', text: "Your window closed and you're trying to rebuild off me. Not happening." },
  { tier: 7, driver: 'sentiment', temperament: 'opportunist', text: "You're radioactive. I'm going to make sure everyone sees I rejected you." },

  // Absolutely not — Party Pressure — Ideologue
  { tier: 7, driver: 'party', temperament: 'ideologue', text: "This betrays everything the party stands for. I'm going to be the one reminding people why." },
  { tier: 7, driver: 'party', temperament: 'ideologue', text: "The party drew a line on principle. I'm going to be its voice on why this matters." },
  { tier: 7, driver: 'party', temperament: 'ideologue', text: "This violates party values so fundamentally that voting yes would end my standing." },
  { tier: 7, driver: 'party', temperament: 'ideologue', text: "I'm going to make the party's case so loudly that everyone remembers you opposed it." },

  // Absolutely not — Party Pressure — Follower
  { tier: 7, driver: 'party', temperament: 'follower', text: "Leadership made the call and I'm not just following it — I'm making sure you understand the consequences." },
  { tier: 7, driver: 'party', temperament: 'follower', text: "The Whip drew the line and I'm going to make sure you know that was final." },
  { tier: 7, driver: 'party', temperament: 'follower', text: "The party chose to make this a test of loyalty. Failing it means everyone knows you're an outsider." },
  { tier: 7, driver: 'party', temperament: 'follower', text: "Leadership's position is locked. I'm the one who explains why you should have listened." },

  // Absolutely not — Party Pressure — Dealmaker
  { tier: 7, driver: 'party', temperament: 'dealmaker', text: "The party and I are aligned on this, and you just crossed both of us." },
  { tier: 7, driver: 'party', temperament: 'dealmaker', text: "Leadership made it clear. Asking me just proved you're a threat. I'm treating you like one." },
  { tier: 7, driver: 'party', temperament: 'dealmaker', text: "The party and I want the same thing here. You just made an enemy of both." },
  { tier: 7, driver: 'party', temperament: 'dealmaker', text: "I'm locked in by party pressure. Asking just proved you don't understand the game." },

  // Absolutely not — Party Pressure — Opportunist
  { tier: 7, driver: 'party', temperament: 'opportunist', text: "The party's unified and killing this. You're betting against a steamroller." },
  { tier: 7, driver: 'party', temperament: 'opportunist', text: "The internal politics are settled and you're on the wrong side. Everyone will see." },
  { tier: 7, driver: 'party', temperament: 'opportunist', text: "The party machine is running you over and I'm not getting run over with you." },
  { tier: 7, driver: 'party', temperament: 'opportunist', text: "Leadership's decided and you're finished. I'm making sure the rest of the party knows." },

  // Absolutely not — District Pressure — Ideologue
  { tier: 7, driver: 'district', temperament: 'ideologue', text: "My constituents sent me here to fight exactly this. And I'll use your ask to prove it." },
  { tier: 7, driver: 'district', temperament: 'ideologue', text: "This violates my district's core values. I'm making sure they know you tried." },
  { tier: 7, driver: 'district', temperament: 'ideologue', text: "My people are watching and your ask gave me the perfect reason to show I'm defending them." },
  { tier: 7, driver: 'district', temperament: 'ideologue', text: "The district's position is sacred. Asking me to break it shows you don't understand what I represent." },

  // Absolutely not — District Pressure — Follower
  { tier: 7, driver: 'district', temperament: 'follower', text: "My district leadership made this clear. I'm not just respecting that — there will be consequences." },
  { tier: 7, driver: 'district', temperament: 'follower', text: "The ground back home is unanimous. You're picking a fight with voters who outnumber you." },
  { tier: 7, driver: 'district', temperament: 'follower', text: "My constituents have spoken. Your ask is going to be part of why they know they're heard." },
  { tier: 7, driver: 'district', temperament: 'follower', text: "The district said no. I'm making sure everyone knows you tried anyway." },

  // Absolutely not — District Pressure — Dealmaker
  { tier: 7, driver: 'district', temperament: 'dealmaker', text: "My voters would destroy me for this. I'm making sure they know you asked." },
  { tier: 7, driver: 'district', temperament: 'dealmaker', text: "The primary is already a threat and your ask just gave my opponent a perfect issue." },
  { tier: 7, driver: 'district', temperament: 'dealmaker', text: "My electoral survival is on the line. I'm making sure the district knows who tried." },
  { tier: 7, driver: 'district', temperament: 'dealmaker', text: "You're asking me to lose my seat. The district's going to know exactly who pushed for that." },

  // Absolutely not — District Pressure — Opportunist
  { tier: 7, driver: 'district', temperament: 'opportunist', text: "My approval is already shaky and taking this vote would end me. I'm making sure the district knows who tried." },
  { tier: 7, driver: 'district', temperament: 'opportunist', text: "The electoral winds are against me and your ask would be suicide. I'm staying alive." },
  { tier: 7, driver: 'district', temperament: 'opportunist', text: "My seat's barely safe and you're asking me to step in front of a bus." },
  { tier: 7, driver: 'district', temperament: 'opportunist', text: "I'm one election away from disaster and you're trying to push me toward it." },

  // Absolutely not — Faction Pressure — Ideologue
  { tier: 7, driver: 'faction', temperament: 'ideologue', text: "The groups I admire are against this. Your ask proves you don't understand what integrity means." },
  { tier: 7, driver: 'faction', temperament: 'ideologue', text: "The factions aligned with my values would see this as corruption. I'm not letting them down." },
  { tier: 7, driver: 'faction', temperament: 'ideologue', text: "You're asking me to betray the organizations I respect. They're going to know you tried." },
  { tier: 7, driver: 'faction', temperament: 'ideologue', text: "The principled factions are against this, and so am I. You just made an enemy." },

  // Absolutely not — Faction Pressure — Follower
  { tier: 7, driver: 'faction', temperament: 'follower', text: "The factions behind me have drawn a line. I'm not just respecting it — there will be a cost." },
  { tier: 7, driver: 'faction', temperament: 'follower', text: "The organized interests supporting me are locked in. You're picking a fight with all of them." },
  { tier: 7, driver: 'faction', temperament: 'follower', text: "The power structure I'm part of made this a test. You're failing it publicly." },
  { tier: 7, driver: 'faction', temperament: 'follower', text: "Leadership at the faction level has decided. Your ask proved you're an outsider to their world." },

  // Absolutely not — Faction Pressure — Dealmaker
  { tier: 7, driver: 'faction', temperament: 'dealmaker', text: "My backers made it clear. Asking me proves you don't understand how this game works." },
  { tier: 7, driver: 'faction', temperament: 'dealmaker', text: "The people funding me have absolute control on this. You just made an enemy of everyone who pays." },
  { tier: 7, driver: 'faction', temperament: 'dealmaker', text: "You're asking me to cross my financial backers. They're going to know exactly who tried." },
  { tier: 7, driver: 'faction', temperament: 'dealmaker', text: "The factions have me locked in. Your ask proved you're a threat to their interests." },

  // Absolutely not — Faction Pressure — Opportunist
  { tier: 7, driver: 'faction', temperament: 'opportunist', text: "The organized groups are running this into the ground. You're asking me to die with the ship." },
  { tier: 7, driver: 'faction', temperament: 'opportunist', text: "The faction dynamics have settled against you. Your ask just makes you look desperate." },
  { tier: 7, driver: 'faction', temperament: 'opportunist', text: "Too many powerful groups are against this. I'm making sure the winning side knows I never wavered." },
  { tier: 7, driver: 'faction', temperament: 'opportunist', text: "The external pressure is overwhelming. You're on the losing side and everyone can see it." },

  // Absolutely not — Momentum — Opportunist
  { tier: 7, driver: 'momentum', temperament: 'opportunist', text: "This is dead and buried and you're still asking? Everyone will see you can't read the room." },
  { tier: 7, driver: 'momentum', temperament: 'opportunist', text: "No momentum, no cosponsors, no hope. I'm staying clear and making sure people know." },
  { tier: 7, driver: 'momentum', temperament: 'opportunist', text: "This bill has no future. Asking me proves you're betting on the impossible." },
  { tier: 7, driver: 'momentum', temperament: 'opportunist', text: "You're backing a ghost. I'm not haunting myself for you." },
];
