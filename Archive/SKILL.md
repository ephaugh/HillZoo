# Hill Zoo Bark Corpus — Authoring Skill

## What You're Building

You are writing the complete dialogue corpus for Hill Zoo, a political strategy game set in a fictional animal congress. All NPC dialogue is delivered through **barks** — short, authored lines of 1–2 sentences. There is no dynamically generated dialogue. Every line an NPC says in the game comes from this corpus.

Before writing anything, read `hill_zoo_game_design_doc_v3.md` in this folder. Pay close attention to System 5 (NPC Decision Engine), System 6 (The Bark System), and the Temperament Types in System 3 (Member Profiles). The bark corpus is mechanically driven — every bark is selected by an engine based on specific game-state calculations. You need to understand that engine to write barks that encode the right strategic information.

## The Core Rule

Every bark functions on two layers:

- **Surface read:** Attitude, personality, whether they're saying yes or no. Any player can understand this.
- **Subtext read:** What this tells a skilled player about the NPC's temperament, their dominant pressure point, and what strategic move to make next. A veteran player reads the bark and knows exactly what lever to pull without checking the mechanical readout.

If a bark only works on the surface layer, it's not good enough. Rewrite it until the subtext encodes actionable intelligence.

## Corpus Structure

The corpus has four sections. Produce them as separate files.

### File 1: `barks_core.md` — Core Response Barks

The core corpus. Organized by:

```
7 response tiers × 6 dominant drivers × 4 temperaments × 4 variants each
= 672 barks
```

**The 7 response tiers** (determined by Net Willingness thresholds):

| Tier | Label | Net Willingness | Meaning |
|---|---|---|---|
| 1 | "Done." | +60 or higher | Immediate agreement, no conditions |
| 2 | "I'm with you on this." | +40 to +59 | Agreement, but signaling it costs them |
| 3 | "I'm leaning your way, but..." | +20 to +39 | Persuadable, not there yet |
| 4 | "What's in it for me?" | -19 to +19 | Open to a deal, won't do it for free |
| 5 | "I can't." | -20 to -39 | Unwilling now, door open |
| 6 | "No." | -40 to -59 | Flat refusal |
| 7 | "Absolutely not, and..." | -60 or lower | Hostile refusal with consequences |

**The 6 dominant drivers** (the decision engine component with the largest absolute value after temperament multipliers):

| Driver | Bark Theme |
|---|---|
| Interest Alignment | Policy language — talks about the bill's content, principles, what they believe |
| Sentiment | Relationship language — talks about trust, history, what you've done for/to them |
| Party Pressure | Institutional language — talks about leadership, the Whip, party loyalty, cover |
| District Pressure | Electoral language — talks about constituents, back home, primary, voters |
| Faction Pressure | External pressure language — talks about groups, lobbyists, can't be seen supporting |
| Momentum | Momentum language — talks about odds, cosponsors, bill trajectory. **Opportunist temperament only.** For the other 3 temperaments, leave this driver's cells empty and mark them `[N/A — Opportunist only]`. |

**The 4 temperaments** (each has a distinct verbal signature that must be consistent across ALL their barks):

| Temperament | Voice Rules |
|---|---|
| **Ideologue** | Speaks in moral terms. References principles, beliefs, what's right. Never mentions deals, favors, or political convenience. Uses words like "believe," "principle," "right," "wrong," "conviction." When saying yes, it's because the cause is just. When saying no, the cause is wrong. They don't negotiate — they judge. |
| **Follower** | References authority constantly. Mentions leadership, the party, the Whip, "what we've been told," institutional hierarchy. Rarely uses "I" for political decisions — says "we" or "the party" or "leadership." When saying yes, someone above them approved it. When saying no, someone above them hasn't. Defers upward. |
| **Dealmaker** | Transactional language. References relationships, favors, history, reciprocity, debts, deposits. When saying yes, they're investing. When saying no, the price isn't right. Talks about what you've done for them and what they might do for you. Keeps score openly. |
| **Opportunist** | References momentum, odds, timing, political winds, cosponsors, public attention. When saying yes, your bill is winning. When saying no, your bill is losing. No principles, no loyalty — just bets. Talks about which way things are headed, not which way things should go. |

**Format for each bark entry:**

```
### [Tier] — [Dominant Driver] — [Temperament]

1. "[Bark text.]"
2. "[Bark text.]"
3. "[Bark text.]"
4. "[Bark text.]"
```

**Example entries to calibrate quality and tone:**

```
### Done — Interest Alignment — Ideologue

1. "This is the right thing to do. You have my word."
2. "I've believed in this since before you got here."
3. "This bill speaks to what matters. Count me in."
4. "Finally, someone with the conviction to push this forward."

### Done — Interest Alignment — Follower

1. "Leadership is behind this, so I'm behind this."
2. "The Whip already told me to expect this ask."
3. "The party's been waiting for a bill like this. You have my vote."
4. "This is exactly what we've been saying we'd support."

### Done — Sentiment — Dealmaker

1. "You helped me last week. I don't forget that."
2. "Consider this a deposit. I'll come collecting."
3. "We've built something here. I'm happy to keep investing."
4. "After everything we've been through? This one's easy."

### Done — Momentum — Opportunist

1. "Everyone's talking about this bill. I want in."
2. "Smart timing on your part. This issue is hot right now."
3. "The cosponsors are lining up. I'm not missing this train."
4. "I can read a room. This is happening, and I want to be on the right side."

### I can't — Party Pressure — Follower

1. "The party hasn't sanctioned this. My hands are tied."
2. "I haven't heard from leadership on this one. I can't get ahead of them."
3. "The Whip hasn't weighed in. Until she does, I'm staying put."
4. "I follow the party line. This isn't it."

### I can't — District Pressure — Opportunist

1. "My district is watching me too closely right now. Maybe after the primary."
2. "The polls back home don't support this. I can't take the risk."
3. "Ask me again after I survive reelection. Right now, it's not happening."
4. "My constituents would eat me alive. Not worth it."

### What's in it for me? — Interest Alignment — Ideologue

1. "The principle is sound, but it doesn't go far enough. What else are you willing to commit to?"
2. "I could support this if I believed you actually meant it."
3. "This is close to what I'd want, but you're missing something important."
4. "I need to see more conviction before I put my name on this."

### No — Faction Pressure — Dealmaker

1. "The people I answer to aren't going to like this. There's no deal that fixes that."
2. "I've got relationships to protect. This vote would cost me more than you're offering."
3. "You're asking me to burn bridges I've spent years building. The answer is no."
4. "I know who funds my campaign. Do you?"

### Absolutely not — Interest Alignment — Ideologue

1. "This is an affront to everything I stand for."
2. "I will not only vote against this — I will make sure others do too."
3. "You brought this to me? Do you know what I believe?"
4. "This isn't politics. This is a matter of principle, and you're on the wrong side."
```

**Mandatory quality checks for every bark:**

- [ ] Is it 1–2 sentences maximum? (Hard limit. No exceptions.)
- [ ] Does the surface read clearly communicate the response tier? (A player who doesn't understand temperaments can still tell if it's a yes, no, or maybe.)
- [ ] Does the subtext encode which dominant driver caused the response? (A skilled player can identify the pressure point from the bark alone.)
- [ ] Is the temperament voice consistent? (An Ideologue never sounds transactional. A Follower never sounds principled. A Dealmaker never sounds institutional. An Opportunist never sounds convicted.)
- [ ] Does it avoid referencing specific bills, members, species, or policy areas? (Barks must work regardless of which bill is being discussed. "Your bill hurts my district" — good. "Your Freshwater bill hurts the farming community" — bad, too specific.)
- [ ] Could this bark appear 3–4 times across a playthrough without feeling repetitive? (If it's too memorable or distinctive, it'll grate on repeat. Aim for naturalistic, not quotable.)
- [ ] Is the tone consistent with Hill Zoo? (Sharp, slightly dark-humored, politically cynical. Not whimsical, not preachy, not overly formal. These are politicians who happen to be animals, not cartoon characters.)

**Cells to skip:**

The Momentum dominant driver only applies to the Opportunist temperament. For the other 3 temperaments (Ideologue, Follower, Dealmaker), write `[N/A — Opportunist only]` in those cells. This reduces the actual bark count from 672 to **588 core barks**.

### File 2: `barks_interjections.md` — Contextual Interjections

25–30 interjections triggered by boolean game-state flags. These fire BEFORE the normal bark and signal critical state changes. They are not filtered by temperament or dominant driver — they're universal.

**Triggers and guidelines:**

| Trigger | Guidance | Count |
|---|---|---|
| **Broken promise detected** | The NPC knows you broke a promise. Angry, specific, accusatory. References the betrayal without naming the specific bill. "You gave me your word. That word is worthless now." | 4 variants |
| **NPC just lost their primary** | Lame duck. Nothing to lose. Tone shifts to reckless honesty, dark humor, or bitter freedom. "I'm a dead member walking. So let's skip the politics." | 4 variants |
| **NPC's bill just died** | Wounded, possibly hostile, possibly a free agent. Not generous. "My bill died yesterday. I'm not feeling charitable." | 3 variants |
| **Banana Lobby active and relevant** | Fear. Caution. The NPC is being watched. "Be very careful what you ask me next." | 3 variants |
| **Sentiment just crossed a tier boundary downward** | The relationship has deteriorated. Sadness, disappointment, or cold withdrawal. "Something's changed between us. I'm not sure what." | 3 variants |
| **First meeting ever** | Evaluation mode. The NPC doesn't know you. Guarded, assessing. "I don't know you yet. Let's fix that — carefully." | 3 variants |
| **NPC's primary is within 3 days** | Electoral panic. Distracted, self-interested, short-fused. "I've got three days until my voters decide my future. Make it quick." | 3 variants |
| **Player's bill just scored Bloated by Budget Committee** | The NPC knows your bill is fiscally toxic. References the score. "I saw what Budget did to your bill. That's going to be a problem." | 3 variants |

**Format:**

```
### [Trigger Name]

1. "[Interjection text.]"
2. "[Interjection text.]"
3. "[Interjection text.]"
```

### File 3: `barks_discussion.md` — Discussion and Information Barks

40–50 barks for the "I want to discuss..." verb. These fire when the player is gathering information, not making asks. No political cost. Quality varies by sentiment tier and NPC knowledge.

Organize by **sentiment tier × information quality:**

| Sentiment | Information Quality | Tone |
|---|---|---|
| Allied / Warm | High — shares real intelligence, names, specifics | Generous, conspiratorial, helpful |
| Neutral | Medium — gives surface-level takes, hedges | Polite but guarded, noncommittal |
| Cold / Hostile | Low — deflects, gives nothing useful, possibly misleads | Dismissive, curt, or deliberately vague |

Write 5 variants per sentiment group (Warm+Allied, Neutral, Cold+Hostile) for each of 3 discussion topics:

- Discussing a policy area (15 barks)
- Discussing a specific bill (15 barks)
- Discussing another member (15 barks)

Total: ~45 discussion barks.

**Format:**

```
### Discussing a Policy Area — Warm/Allied

1. "[Bark.]"
2. "[Bark.]"
...
```

**Rules for discussion barks:**
- Never name specific policies, bills, or members (the game engine fills in context).
- Warm/Allied barks should make the player feel rewarded for investing in the relationship — they're getting real, useful intelligence.
- Cold/Hostile barks should make the player feel the cost of a bad relationship — the meeting was a waste of a slot.
- Neutral barks should feel like talking to a coworker who doesn't dislike you but also isn't going to stick their neck out.

### File 4: `barks_armtwist.md` — Arm-Twist Barks

During the floor vote, the player can target one undecided member for an arm-twist. The NPC delivers a single bark before the player chooses an offer. This bark is the player's ONLY hint about what offer might work. It is selected by dominant driver (same as core barks) but there is no response tier — all arm-twist NPCs are in the "undecided" zone.

Write 3 variants per dominant driver × temperament:

```
6 drivers × 4 temperaments × 3 variants = 72 barks
(minus 3 drivers × 3 non-Opportunist temperaments for Momentum = 63 actual barks)
```

**The arm-twist bark must subtly reveal what the NPC needs.** A player who understands temperament signatures should be able to pick the right offer from the bark alone.

**Examples:**

```
### Arm-Twist — District Pressure — Follower

1. "My constituents are watching this vote closely."
2. "I promised my district I'd protect their interests. Convince me this does."
3. "Back home, this vote is all anyone's talking about."

### Arm-Twist — Sentiment — Dealmaker

1. "What have you done for me lately?"
2. "I keep a ledger. Where do we stand?"
3. "This would be easier if we had more history together."

### Arm-Twist — Momentum — Opportunist

1. "Is this bill actually going to pass? Because I'm not wasting my vote."
2. "How many others have committed? I need to know the odds."
3. "Tell me this isn't a sinking ship."
```

**Rules for arm-twist barks:**
- The player sees NO mechanical readout during arm-twists. The bark is all they get.
- The bark must encode enough information for a skilled player to choose correctly, but never be so obvious that it eliminates the gamble.
- Tone should reflect the pressure of the moment — rushed, tense, high-stakes.

## Output Checklist

When complete, the folder should contain:

- [ ] `barks_core.md` — 588 core barks (7 tiers × 6 drivers × 4 temperaments × 4 variants, minus Momentum for non-Opportunists)
- [ ] `barks_interjections.md` — 26–30 contextual interjections across 8 triggers
- [ ] `barks_discussion.md` — ~45 discussion barks (3 sentiment groups × 3 topics × 5 variants)
- [ ] `barks_armtwist.md` — ~63 arm-twist barks (6 drivers × 4 temperaments × 3 variants, minus Momentum for non-Opportunists)

**Total corpus: ~720–730 authored lines.**

## Process

Work through the files in order. For each file:
1. Draft the complete set.
2. Review every bark against the quality checks listed above.
3. Flag any barks where the temperament voice bleeds (an Ideologue sounding transactional, a Follower sounding principled).
4. Flag any barks that reference specific content (bill names, policy areas, species).
5. Revise flagged barks.
6. Save the file.

Do NOT attempt to write the entire corpus in a single pass. Work in batches: one response tier at a time for core barks, one trigger at a time for interjections. Quality matters more than speed.
