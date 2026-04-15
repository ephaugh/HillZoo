# Hill Zoo Quick Interaction Barks — Authoring Skill

## What You're Building

Four new bark pools for the Hill Zoo quick interaction system — short, ambient conversations that happen between full meetings. These barks are shorter and more casual than the core response barks. Read `hill_zoo_game_design_doc_v3.md` for full game context, paying attention to System 5 (NPC Decision Engine) and System 6 (The Bark System) for temperament voices.

**Critical:** Read the existing bark files in this folder (barks_core.md, barks_interjections.md, barks_discussion.md, barks_armtwist.md) to calibrate tone and voice consistency. The new barks must feel like they come from the same game.

## Tone Rules

Quick interaction barks are **shorter and more casual** than core barks. These are hallway conversations, not formal meetings. One sentence max for most pools. The tone is hurried, informal, and politically loaded — politicians talking fast between obligations.

All standard rules from the core bark SKILL apply: 
- Surface read + subtext read on every line
- Temperament voices must be distinct and consistent with core barks
- No references to specific bills, members, species, or policy areas
- Sharp, politically cynical, slightly dark-humored
- These are politicians who happen to be animals, not cartoon characters

## Output Files

Produce all four pools in a single file: `barks_quick_interactions.md`

---

## Pool 1: Ambush Opening Asks (39 barks)

An NPC intercepts the player in the hallway with an urgent request. The player didn't choose this — the NPC set the agenda. Each bark must communicate three things in one sentence: **what they want, that it's urgent, and a temperament signal.**

### Structure

Organized by **ask type × temperament.** 

**Ask Type 1: Vote on their bill (floor vote imminent)**
4 temperaments × 3 variants = 12 barks

The NPC needs the player's vote on an upcoming floor vote. Most common ambush type.

| Temperament | Voice Direction |
|---|---|
| Ideologue | Frames the vote as a moral obligation. "This matters. Be on the right side." |
| Follower | Frames as institutional duty. References leadership or party expectations. |
| Dealmaker | Frames as a transaction. References future reciprocity, keeping score. |
| Opportunist | Frames as a smart bet. References momentum, vote count, which way things are going. |

**Ask Type 2: Cosponsorship on their bill**
4 temperaments × 3 variants = 12 barks

Higher stakes than a vote — cosponsorship is public. The NPC needs the player's name attached.

Same temperament voice rules as vote asks, but the tone is more serious — they're asking for a public commitment, not a quiet vote.

**Ask Type 3: Whip instruction delivery**
3 variants (universal — the Whip has a single voice, not filtered by temperament)

The Whip delivers voting instructions outside of caucus. Direct, authoritative, no negotiation. These should sound like orders, not requests.

**Ask Type 4: General help request**
4 temperaments × 3 variants = 12 barks

The NPC needs a favor — pressure a committee chair, make an introduction, use your influence. Urgent but less specific than a vote ask.

### Examples (write to this standard)

**Vote ask — Ideologue:** "This bill matters. Your vote matters. Tomorrow."
**Vote ask — Follower:** "Leadership needs us on this one. Tomorrow's vote. Are you in?"
**Vote ask — Dealmaker:** "I need your vote tomorrow. I'll remember who showed up."
**Vote ask — Opportunist:** "The vote's tomorrow and the numbers are tight. Be on the right side."

**Cosponsor ask — Ideologue:** "I need your name on something that matters. Not a quiet yes — a public stand."
**Cosponsor ask — Dealmaker:** "Put your name on my bill. I keep a list of who backed me when it counted."

**Whip instruction:** "The Whip wants a YES on Bill 9. Floor vote Day 16. That's the word."

**Help request — Follower:** "I need someone leadership trusts to lean on the chair. Can you do that for me?"
**Help request — Dealmaker:** "I need a favor. A real one. And I'll owe you."

### Quality Checks

- [ ] One sentence max. These are hallway intercepts, not speeches.
- [ ] The ask is immediately clear — the player knows what the NPC wants within 5 words.
- [ ] Urgency is conveyed through pacing and word choice, not exclamation marks.
- [ ] Temperament voice is distinct. Could you identify the temperament from the bark alone?
- [ ] No specific bill names, member names, or policy areas.

### Format

```
## Ambush Opening Asks

### Vote Ask — Ideologue
1. "[bark]"
2. "[bark]"
3. "[bark]"

### Vote Ask — Follower
1. "[bark]"
...

### Cosponsor Ask — Ideologue
...

### Whip Instruction
1. "[bark]"
2. "[bark]"
3. "[bark]"

### Help Request — Ideologue
...
```

---

## Pool 2: Quick Question Vote Reads (36 barks)

The player asks "how will you vote on this bill?" in a hallway. The NPC gives a brief, casual read. **No mechanical readout.** The player must read the bark to determine the answer. This is pure bark-reading skill.

### Structure

Organized by **response tier × temperament.** Net Willingness is mapped to three simplified tiers:

| Net Willingness | Tier | Signal |
|---|---|---|
| +20 or higher | Supportive | Leaning yes |
| -19 to +19 | Noncommittal | Undecided |
| -20 or lower | Resistant | Leaning no |

3 tiers × 4 temperaments × 3 variants = **36 barks.**

### Voice Rules by Tier

**Supportive:** The NPC is likely voting yes, but the temperament colors HOW confident that signal is:
- Ideologue supportive = principled commitment, reliable
- Follower supportive = institutional backing, reliable IF leadership holds
- Dealmaker supportive = no objection, reliable IF no better offer appears
- Opportunist supportive = currently favorable, UNRELIABLE if momentum shifts

**Noncommittal:** The NPC hasn't decided. The temperament reveals WHAT would tip them:
- Ideologue noncommittal = still evaluating the bill's merits
- Follower noncommittal = waiting for leadership's signal
- Dealmaker noncommittal = waiting for an offer
- Opportunist noncommittal = waiting to see which way things break

**Resistant:** The NPC is likely voting no. The temperament reveals WHY, which hints at what might change their mind:
- Ideologue resistant = policy content is wrong (amend the bill)
- Follower resistant = party is against it (get Whip backing)
- Dealmaker resistant = nobody's made it worth their while (make a deal)
- Opportunist resistant = bill is losing (build momentum)

### Examples (write to this standard)

**Supportive — Ideologue:** "It's the right call. I'm there."
**Supportive — Follower:** "Leadership's behind it. So am I."
**Supportive — Dealmaker:** "I've got no reason to block this. You're good."
**Supportive — Opportunist:** "This one's trending well. Count me in for now."

**Noncommittal — Ideologue:** "I'm still weighing whether this meets my standard."
**Noncommittal — Follower:** "Waiting on the official word. Can't say yet."
**Noncommittal — Dealmaker:** "Depends on what else is on the table that day."
**Noncommittal — Opportunist:** "Too early to call. Check back when the picture clears."

**Resistant — Ideologue:** "I have serious problems with this. Don't count on me."
**Resistant — Follower:** "The party's not there. Neither am I."
**Resistant — Dealmaker:** "Nobody's made it worth my while. So no."
**Resistant — Opportunist:** "This doesn't have the votes. I'm not going down with it."

### Quality Checks

- [ ] One sentence max. Shorter than core barks.
- [ ] The vote signal (yes/maybe/no) is clear on the surface read.
- [ ] The temperament voice is clear on the subtext read.
- [ ] Noncommittal barks hint at what would change the NPC's mind (this is the strategic intelligence).
- [ ] Supportive barks for Opportunist and Dealmaker include subtle caveats signaling the vote isn't fully locked ("for now," "no reason to block," "depends"). Supportive barks for Ideologue and Follower are more reliable.
- [ ] No specific bill names, member names, or policy areas.

### Format

```
## Quick Question Vote Reads

### Supportive — Ideologue
1. "[bark]"
2. "[bark]"
3. "[bark]"

### Supportive — Follower
...
```

---

## Pool 3: "I Heard Something" Reactions (18 barks)

The player shares intelligence with an NPC during a Hallway Encounter. The NPC reacts. These are **emotional reactions, not political calculations** — not filtered by temperament. Filtered by reaction type:

### Structure

| Reaction | Trigger | Variants |
|---|---|---|
| **Grateful** | NPC is Warm/Allied, intel is true and relevant to their interests | 5 |
| **Appreciative** | NPC is Neutral, intel is true | 4 |
| **Dismissive** | NPC is Cold, OR intel is irrelevant/already known | 4 |
| **Alarmed** | Intel reveals a direct threat to this NPC (faction attack, amendment plan, primary threat) — any sentiment tier | 5 |

**Total: 18 barks.**

### Voice Direction

**Grateful:** Genuine warmth. The player did them a real favor. These should feel like a relationship deepening.
- "I owe you for that. Seriously."
- "That's exactly what I needed to hear. You just saved me a bad week."

**Appreciative:** Polite acknowledgment. The NPC is glad but not effusive. Professional gratitude.
- "Good to know. I'll keep my eyes open."
- "Noted. I appreciate the heads-up."

**Dismissive:** The NPC doesn't trust the player or doesn't care about the intel. Curt, possibly condescending.
- "Old news. But thanks for trying."
- "I've heard rumors before. I'll believe it when I see it."

**Alarmed:** Genuine fear or urgency. The intel hit a nerve. The NPC's composure cracks for a moment. These are the most dramatic barks in this pool — the player should feel the impact of delivering a real warning.
- "Wait — say that again. Who told you this?"
- "That changes everything. I need to make some calls."

### Quality Checks

- [ ] 1–2 sentences max.
- [ ] Grateful and Alarmed reactions should make the player feel their relationship investment and intelligence-gathering paid off.
- [ ] Dismissive reactions should make the player feel the cost of bad relationships — they tried to build goodwill and got nothing.
- [ ] Alarmed reactions should feel urgent and slightly vulnerable — the NPC momentarily drops their political mask.
- [ ] No temperament filtering. Any NPC can give any of these reactions regardless of type.
- [ ] No specific references to what the intel was about.

### Format

```
## "I Heard Something" Reactions

### Grateful (Warm/Allied, useful intel)
1. "[bark]"
2. "[bark]"
...

### Appreciative (Neutral, useful intel)
...
```

---

## Pool 4: "How Are You Holding Up?" Responses (20 barks)

Lingerer-only. Late-night personal check-in. **Not driven by the Decision Engine.** Driven purely by the NPC's sentiment toward the player and their current stress level. This is the one moment where NPC personality takes a back seat to emotional state.

### Structure

| Sentiment | Stress Level | Tone | Variants |
|---|---|---|---|
| **Warm/Allied** | Low | Friendly, candid, maybe joking. A colleague unwinding. | 4 |
| **Warm/Allied** | High (primary close, bill in danger) | Vulnerable, honest, grateful for the check-in. The political mask drops. | 4 |
| **Neutral** | Low | Polite but brief. Deflects personal questions. | 3 |
| **Neutral** | High | Guarded. Admits pressure but doesn't open up. | 3 |
| **Cold/Hostile** | Any | Brushes you off or turns hostile. Why are you even asking? | 3 |
| **Lame duck** | Any | Dark humor, nihilistic freedom, surprising honesty. They've lost and they're weirdly fine. | 3 |

**Total: 20 barks.** Not filtered by temperament.

### Voice Direction

**Warm + Low stress:** Relaxed. The building is empty, the day is done, and they're talking to someone they like. Light humor. Collegial warmth. The player should feel like they have a real friend in this building.
- "Honestly? Not bad. Could be worse. Could be the fox."
- "Surviving. Same as everyone. But tonight I'm actually going home on time."

**Warm + High stress:** This is the emotional core of the pool. The NPC is scared, exhausted, or grieving a legislative setback. They're talking to the one person they trust enough to be honest with. These barks should make the player feel something.
- "Between us? I'm scared. My primary numbers are terrible and I'm running out of time."
- "I appreciate you asking. Nobody else has. It's been a rough week."
- "I don't know if I'm going to make it through this session. But I'm glad you're here."

**Neutral + Low stress:** Professional distance. Not unfriendly, just not intimate.
- "Fine. Busy. You know how it is."
- "Can't complain. Well, I can, but you don't want to hear it."

**Neutral + High stress:** The cracks show, but they don't let you in.
- "I'll manage. Always do."
- "Tough week. But that's the job."

**Cold/Hostile:** Why are you talking to me? Suspicion or rejection.
- "I don't need your sympathy."
- "We're not friends. Don't pretend we are."
- "Save the concern for someone who buys it."

**Lame duck:** The most distinctive tone. They've lost their primary and they're still walking the halls. Dark humor, bitter freedom, or genuine philosophical acceptance.
- "I lost my primary and I'm still here. How do you think I'm holding up? ...Actually, pretty great."
- "Never better. Turns out losing sets you free."
- "I'm a ghost haunting my own office. It's oddly peaceful."

### Quality Checks

- [ ] 1–2 sentences max.
- [ ] Warm + High stress barks should humanize the NPC. The player should feel empathy, not just strategic opportunity.
- [ ] Cold barks should sting. The player tried to have a human moment and got rejected.
- [ ] Lame duck barks should be the most memorable lines in this pool — dark, funny, and a little sad.
- [ ] No temperament filtering. A stressed Ideologue and a stressed Dealmaker both sound like worried politicians at 11pm.
- [ ] No references to specific bills, primaries, or situations. The game engine contextualizes the stress — the bark just conveys the emotional register.

### Format

```
## "How Are You Holding Up?" Responses

### Warm/Allied — Low Stress
1. "[bark]"
2. "[bark]"
3. "[bark]"
4. "[bark]"

### Warm/Allied — High Stress
...
```

---

## Final Output

One file containing all four pools:

- [ ] `barks_quick_interactions.md`
  - Ambush Opening Asks: 39 barks
  - Quick Question Vote Reads: 36 barks
  - "I Heard Something" Reactions: 18 barks
  - "How Are You Holding Up?" Responses: 20 barks
  - **Total: 113 barks**

## Process

Work through the pools in order (1 through 4). Draft each pool completely, then review every bark against the quality checks for that pool before moving to the next. After all four are drafted, do a final pass comparing tone against the existing core barks — these should feel like the same game, just more casual and compressed.
