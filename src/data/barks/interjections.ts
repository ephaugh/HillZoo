export interface InterjectionBark {
  trigger: string;
  temperament: 'ideologue' | 'follower' | 'dealmaker' | 'opportunist' | 'any';
  text: string;
}

export const INTERJECTION_BARKS: InterjectionBark[] = [
  // --- Broken Promise Detected --- //
  {
    trigger: 'broken_promise',
    temperament: 'any',
    text: "You looked me in the eye and promised me your support. Then you turned around and stabbed me in the back.",
  },
  {
    trigger: 'broken_promise',
    temperament: 'any',
    text: "I trusted you. That was stupid of me, and I won't make that mistake twice.",
  },
  {
    trigger: 'broken_promise',
    temperament: 'any',
    text: "You gave me your word. Word doesn't mean much in this town anymore, apparently.",
  },
  {
    trigger: 'broken_promise',
    temperament: 'any',
    text: "I held up my end. You didn't. And now we both know exactly what you're worth.",
  },

  // --- NPC Just Lost Their Primary --- //
  {
    trigger: 'npc_lost_primary',
    temperament: 'any',
    text: "I'm done playing defense. Nothing left to lose means I can finally say what I actually think.",
  },
  {
    trigger: 'npc_lost_primary',
    temperament: 'any',
    text: "Well, that's it. The voters have spoken, and honestly? I'm relieved. No more pretending.",
  },
  {
    trigger: 'npc_lost_primary',
    temperament: 'any',
    text: "My career just ended in a primary fight. So let's talk like adults for once — no leverage, no calculation.",
  },
  {
    trigger: 'npc_lost_primary',
    temperament: 'any',
    text: "I lost. Which means for the first time in my career, I can be completely honest.",
  },

  // --- NPC's Bill Just Died --- //
  {
    trigger: 'npc_bill_died',
    temperament: 'any',
    text: "My bill died in committee. I'm not interested in pleasantries right now.",
  },
  {
    trigger: 'npc_bill_died',
    temperament: 'any',
    text: "Six months of work. Gone. Don't expect me to be cheerful about it.",
  },
  {
    trigger: 'npc_bill_died',
    temperament: 'any',
    text: "That bill was supposed to matter. Now it's a footnote. Forgive me if I'm not in the mood to help you.",
  },

  // --- Banana Lobby Active and Relevant --- //
  {
    trigger: 'banana_lobby_active',
    temperament: 'any',
    text: "I need to be careful what I say right now. You should too — we're not alone in this conversation.",
  },
  {
    trigger: 'banana_lobby_active',
    temperament: 'any',
    text: "There are people watching this conversation who have more power than both of us combined. Keep that in mind.",
  },
  {
    trigger: 'banana_lobby_active',
    temperament: 'any',
    text: "There are interests in this building that don't need elections to end careers. Tread carefully.",
  },

  // --- Sentiment Just Crossed Tier Boundary Downward --- //
  {
    trigger: 'sentiment_tier_dropped',
    temperament: 'any',
    text: "We used to get along. I'm not sure that's true anymore.",
  },
  {
    trigger: 'sentiment_tier_dropped',
    temperament: 'any',
    text: "Something shifted between us. I haven't decided what that means yet.",
  },
  {
    trigger: 'sentiment_tier_dropped',
    temperament: 'any',
    text: "I wanted to trust you. That window is closing fast.",
  },

  // --- First Meeting Ever --- //
  {
    trigger: 'first_meeting',
    temperament: 'any',
    text: "I don't think we've spoken before. Show me what you're about and we'll go from there.",
  },
  {
    trigger: 'first_meeting',
    temperament: 'any',
    text: "Fresh face. I'll reserve judgment until I see how you handle yourself.",
  },
  {
    trigger: 'first_meeting',
    temperament: 'any',
    text: "We haven't crossed paths yet. I'm watching, but I haven't formed an opinion — that's up to you.",
  },

  // --- NPC's Primary Is Within 3 Days --- //
  {
    trigger: 'npc_primary_imminent',
    temperament: 'any',
    text: "I've got hours to save my seat. Everything else is secondary right now.",
  },
  {
    trigger: 'npc_primary_imminent',
    temperament: 'any',
    text: "My primary is imminent. You're going to have to be quick and very convincing.",
  },
  {
    trigger: 'npc_primary_imminent',
    temperament: 'any',
    text: "I don't have time for long conversations. My primary is breathing down my neck.",
  },

  // --- Player's Bill Just Scored Bloated by Budget Committee --- //
  {
    trigger: 'bill_scored_bloated',
    temperament: 'any',
    text: "Your bill is fiscally toxic. Even I can't defend that math.",
  },
  {
    trigger: 'bill_scored_bloated',
    temperament: 'any',
    text: "The Budget Committee just handed you a disaster. That price tag is indefensible.",
  },
  {
    trigger: 'bill_scored_bloated',
    temperament: 'any',
    text: "That burden score just made your bill radioactive. Good luck finding votes for that price tag.",
  },

  // --- Player Is a Lame Duck --- //
  // Unlike other interjections, this is filtered by temperament
  {
    trigger: 'player_lame_duck',
    temperament: 'ideologue',
    text: "Perhaps the voters were wrong about you. Maybe your convictions are still right. I hope we can work together.",
  },
  {
    trigger: 'player_lame_duck',
    temperament: 'follower',
    text: "I'm sorry about your primary. But leadership's already looking ahead. I have to be careful.",
  },
  {
    trigger: 'player_lame_duck',
    temperament: 'dealmaker',
    text: "You won't be here next session. That changes what you're worth to me.",
  },
  {
    trigger: 'player_lame_duck',
    temperament: 'opportunist',
    text: "No district, no primary, no strings. That makes you very interesting to me.",
  },
];
