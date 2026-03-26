# Hill Zoo — Game Design Document (v4)

## Overview

Hill Zoo is a political strategy simulator set in a fictional 50-member unicameral animal congress. The player is a freshman member of congress whose objective is to pass a single piece of legislation within a 60-day congressional session. The game draws heavily from the mechanics and culture of the United States Congress, using an animal-themed setting to make dense political systems approachable and memorable.

The aesthetic is inspired by Civilization I — pixel art, information-dense UI, and detailed static pixel portraits for every member of congress.

**Win condition:** The player's bill passes committee, survives a floor vote, and is signed into law by President Gold (a goldfish in a simple tank).

**Lose conditions:** The player's bill dies at any stage of the legislative process with no time to recover, or the player loses a primary election.

---

## Game Creation

When starting a new game, the player makes a series of interconnected choices that function as both character creation and difficulty selection.

### Step 1 — Choose Your Species

Cosmetic only. The player picks from 20–30 animals with pixel portraits. No mechanical impact, but this is the player's identity for the entire game. Other members reference it. It should feel significant.

### Step 2 — Choose Your Party

**Feralist** or **Communalist.** Before choosing, the game reveals both parties' randomized policy agendas for this session. Each party has 2–3 strong positions (pro or anti various policy areas) and is neutral on the rest. The player can see both agendas before committing.

Party agendas are randomized each game. The two parties may share one area of agreement, be ambivalent on similar things, and be completely at odds on others.

### Step 3 — Set the Loyalist–Pragmatist Slider

A continuous slider between two extremes that cascades across every system in the game.

**Loyalist-leaning effects:**
- Receives top committee assignment choices
- Starts with warm relationships across own party
- Starts with actively negative sentiment from the opposing party
- Safer in primaries initially, but deviation from party line is punished harshly — the fall is harder from a higher pedestal
- More attractive to ideologically aligned special interests (reliable vote), but those groups punish defection hard
- Less tolerance from the Whip for defection — a Loyalist breaking ranks is treated as a serious breach

**Pragmatist-leaning effects:**
- Receives lower-priority committee assignments (3rd or 4th choice)
- Starts near-neutral with everyone — nobody loves you, nobody hates you
- Faces a constant low-grade primary threat, but individual deviations don't spike danger as dramatically
- Can court either side's interest groups more freely
- Gets slightly more tolerance from the Whip for defection — it's expected
- Much easier time building cross-aisle support

**Middle positions** create an interesting mix: own party's base is lukewarm (they don't quite trust you), but you're not toxic across the aisle either. Nobody's first call, nobody's enemy.

### Step 4 — Choose Party Balance

Determines the composition of congress and functions as the primary difficulty selector. Each option is labeled with a clear difficulty indicator.

| Setting | Split | President's Party | Difficulty | Character |
|---|---|---|---|---|
| **Large Majority** | 30–20 | Player's party | Standard | Fewer external enemies, more internal politics. Intra-party divisions are the main obstacle. |
| **Slim Majority** | 27–23 | Player's party | Challenging | Most strategically interesting. Every vote is tight. Can't afford to lose more than 1 member. Individual holdouts have enormous leverage. |
| **Split Evenly** | 25–25 | Coin flip | Expert | Chaotic. Committee assignments negotiated, leadership contested. A Pragmatist's dream, a Loyalist's nightmare. |
| **Slim Minority** | 23–27 | Opposing party | Hard | Don't control any committees. Need cross-aisle votes for everything. Pragmatist slider almost mandatory, but a disciplined Loyalist minority bloc is a viable harder path. |
| **Large Minority** | 20–30 | Opposing party | Brutal | Nothing is structurally in your favor. Need 6+ opposing party defectors. Challenge-run territory. |

**Design philosophy on trapping players:** No combination should be literally unwinnable. Even Large Minority + Full Loyalist should have a theoretical path — it's just extremely narrow. Show difficulty clearly, lean into it rather than guard against it.

**First-time players** default to Slim Majority, Loyalist-leaning, Early primary as the "standard" experience.

### Step 5 — Craft Your Bill

Choose **two pro-tags** and **one anti-tag** from the 14 policy issues. The game displays which factions, party positions, and issue temperatures align or conflict with the player's choices so they can make an informed bet. See the Issues System for the full list of 14 issues — 8 committee-mapped issues and 6 cross-cutting issues including Bananas.

**Burden Weight preview:** The game also displays the estimated Budget Burden of each tag combination (see Budget Scoring, System 24). Two Heavy pro-tags start at Base Burden 7; two Light pro-tags start at 3. This gives the player advance visibility into how the Budget Committee will evaluate their bill.

**Name your bill.** All legislation in Hill Zoo follows the format **Z.B. [Number], the [Name] Act** (Z.B. for "Zoo Bill"). The player chooses a bill number between 1–99 and writes a name up to 30 characters. Example: *Z.B. 47, the Clean Rivers Act.* The number and name have no mechanical effect but are referenced throughout the game — in the Speaker's queue, on floor vote screens, in gossip, and in the final score screen. Choosing a memorable name matters because this is how every NPC and system refers to the player's legislation. A bill called "Z.B. 12, the Safe Burrows Act" feels different to play than "Z.B. 99, the Fang Control Act" even if the tags are identical.

**NPC bill names** are generated automatically from a tag-based naming pool. Each of the 14 issues has 4–6 associated name fragments that combine into plausible legislation titles:

| Issue | Example Fragments |
|---|---|
| Agriculture & Foraging | "Grazing Lands," "Harvest Protection," "Forage Access," "Feed Security" |
| Predation & Defense | "Self-Defense," "Fang Control," "Predator Accountability," "Security Enhancement" |
| Freshwater & Marine | "Clean Rivers," "Waterway Preservation," "Marine Habitat," "Freshwater Access" |
| Migration & Transit | "Free Passage," "Migration Corridor," "Border Access," "Seasonal Transit" |
| Habitat & Burrows | "Safe Burrows," "Nesting Rights," "Infrastructure Development," "Territory Reform" |
| Environment & Conservation | "Conservation," "Endangered Species," "Pollution Control," "Biodiversity" |
| Bananas | "Banana Trade," "Banana Labor," "Plantation Reform," "Banana Tariff" |
| Nocturnal Affairs | "Night Rights," "Curfew Reform," "Nocturnal Access," "Lighting Standards" |
| Interspecies Relations | "Coexistence," "Species Integration," "Mixed Community," "Interspecies Harmony" |
| Trade & Commerce | "Free Trade," "Market Reform," "Commerce Regulation," "Economic Development" |
| Public Wellness | "Disease Prevention," "Health Standards," "Parasite Control," "Epidemic Preparedness" |
| Youth & Offspring | "Hatchling Nutrition," "Juvenile Protection," "Nesting Security," "Offspring Rights" |

The generator picks one fragment from the bill's first pro-tag and combines it with a structure word: *"the [Fragment] [Act/Reform/Protection/Standards] Act."* NPC bill numbers are assigned sequentially starting from the numbers the player didn't choose. Example NPC bills: *Z.B. 3, the Grazing Lands Protection Act* or *Z.B. 24, the Night Rights Reform Act.*

### Step 6 — Choose Primary Date

**Early** (day 20) or **Late** (day 45). See Primary Threat system for full details.

### Step 7 — Set Your District

The game generates a district that is **partially** aligned with the player's bill — sharing one pro-tag — but has its own independent interests that may pull the player in uncomfortable directions. The player sees the district profile and can reroll once but cannot custom-build a perfectly aligned district.

The district has:
- Two strong interest preferences
- One policy area it's hostile toward
- A tolerance profile shaped by the Loyalist-Pragmatist slider (Loyalist districts expect party-line voting; Pragmatist districts expect results)

After all selections, the game generates the full congress — all 49 other members, the six factions, committee assignments, leadership roles, and the President's hidden preferences — and drops the player into Day 1.

---

## System 1: The Action Economy

The spine of the game. Everything flows through time slots.

### Structure

- The game runs on a **5-day week** with **12 weeks** in the 60-day session
- Each day has **3 slots: Morning, Afternoon, Evening**
- A full congressional session is **60 days** = **180 total actions**
- This is the player's entire budget. Every choice forecloses something else.

### Action Categories

**Mandatory actions** — Forced onto the calendar, cannot be avoided without consequences:
- Committee hearings for committees the player sits on
- Scheduled floor votes
- Party caucus meetings (Day 3 Evening, every week)
- Mandatory actions eat roughly one-third of total slots over the session

**Scheduled actions** — Booked in advance, adjustable up to the day-of:
- One-on-one meetings with other members
- Meetings with the White House liaison / Chief of Staff
- Meetings with special interests
- Fundraisers

**Flexible actions** — Can be done in any open slot without pre-booking:
- Whipping votes (surveying where members stand)
- Campaigning back home
- Reviewing the legislative calendar

### Scheduling Mechanics

**Tentative vs. confirmed commitments.** Booking a future meeting goes on as "tentative." Canceling before day-of incurs a minor relationship hit. Day-of cancellation incurs a bigger hit. No-showing incurs a significant hit. Schedule management is itself a skill.

**Forced events create dilemmas.** A mandatory floor vote announced for tomorrow afternoon collides with a crucial one-on-one. Cancel the meeting (relationship hit + lost opportunity) or skip the vote (broken promise to whoever you pledged support, noted by leadership)?

**Overbooking as a risky strategy.** Players can tentatively book two things in the same slot, knowing they'll cancel one. Mirrors real congressional scheduling. Risk: misjudging which event matters more.

**Evening slots are different.** Morning and Afternoon are for official business. Evening is for relationship-building — dinners, receptions, fundraisers, informal drinks. More effective at building sentiment but can't be used for official actions like voting. Campaigning back home mostly consumes an evening or a full day for a serious district trip.

**A "good" turn** accomplishes two things advancing different goals. **A great turn** is when a single meeting serves double duty.

---

## System 2: The War Chest (Money)

The game's second core resource alongside time. Money is a **spendable resource with multiple uses** that forces tradeoffs — it is not simply a campaign defense buffer.

### The Two-Resource Philosophy

Hill Zoo has exactly two tangible, spendable resources: **time** (180 slots across 60 days) and **money** (the war chest). Everything else in the game — sentiment, primary threat, party standing, faction alignment — is a **condition** that the player monitors and influences through spending time and money, but does not spend directly. This keeps the decision space clean: every choice boils down to "is this worth my time, my money, or both?"

### Starting War Chest

The player's starting funds are influenced by game creation choices:
- **Loyalists** start with more money (the party apparatus funds reliable members)
- **Pragmatists** start with less (they're on their own financially)
- **Majority party members** start with slightly more (the majority party has better fundraising infrastructure)
- **Minority party members** start with slightly less

### Earning Money

- **Fundraisers** — A scheduled action that costs one time slot (typically an evening). Generates a moderate amount of money. The core tradeoff: every slot spent fundraising is a slot not spent advancing your bill or building relationships.
- **Report card payouts** — When the player maintains an A or higher grade with a faction or party on their weekly report card, that organization contributes money to the player's war chest. See the Report Card System for exact amounts.
- **Party committee distributions** — If your party report card grade is A or higher, the party directs additional funds your way. Another reward for institutional loyalty.

### Spending Money

Money can be deployed in several distinct ways, each serving a unique strategic function:

**Campaign spending** — Amplifies the effectiveness of campaign time slots. Campaigning back home with a full war chest lowers the primary meter more than campaigning broke. Money doesn't *replace* campaigning (you still spend the time slot) but makes the time more impactful. This is the straightforward defensive use.

**Host a fundraiser for another member** — The unique power of money in the relationship game. Costs the player money but earns significant sentiment with the recipient (+15 to +20), comparable to cosponsoring their bill. This is something no other mechanic provides — a direct conversion of a fungible resource into relationship capital, without needing a meeting slot or a negotiation. It's a gift, not a trade. Especially powerful before a colleague's primary date.

**Contribute to the party committee** — Improves party report card grade. This is a financial shortcut to institutional support. Insiders get better treatment from leadership, more favorable committee consideration, and more Whip tolerance.

**Fund an ad campaign on a policy issue** — An expensive, risky play. The player spends money to nudge public attention toward a specific policy area (a player-initiated version of the Headlines system). This might help your bill by making the public care about your issue, creating pressure on committee chairs to schedule hearings or on members to support relevant legislation. It might also backfire by drawing unwanted scrutiny or activating opposing factions. Use with caution.

### Scarcity Design

Money must be scarce enough to force meaningful choices. The player should be able to afford two or three of the spending actions comfortably across a full game, but not all of them. A player who spends heavily on colleague fundraisers will have a thin war chest for their own primary. A player who hoards money for campaign defense won't have the funds to buy influence. The sweet spot: the player always wishes they had a little more money than they do.

### The War Chest as Visible Metric

The war chest is displayed as a visible number on the player's dashboard at all times. Unlike sentiment (which is hidden), money is concrete and quantifiable — the player always knows exactly how much they have and can plan accordingly. Watching the number drop after hosting a fundraiser for a colleague should feel like a real sacrifice.

---

## System 3: Member Profiles

Each of the 49 other members has a fixed profile generated at game start.

### Profile Components

- **Species** — Cosmetic but memorable. The player will remember that the alligator blocked their bill.
- **District type** — Determines primary electorate priorities. Each NPC district has two strong interest preferences and one hostility.
- **Party** — Feralist or Communalist
- **Seniority** — 1–5 scale. Higher seniority = more influence, better committees.
- **Two core interests** — Policy areas they care most about. They'll almost always vote with these.
- **Flexible interests** — Policy areas where they can be persuaded
- **Temperament** — Hidden trait governing behavior under pressure (see NPC Decision Engine)
- **Issue stances** — Positive, Neutral, or Negative on each of the 14 issues, derived from core interests, flexible interests, district hostilities, and temperament. Visible on NPC profile screens. With 14 issues generating stances, each NPC has a unique political fingerprint — two NPCs who are both Feralist Agriculture hawks might disagree completely on Nocturnal Affairs and Interspecies Relations.

### Temperament Types

The player never sees the temperament label but can infer it from dialogue patterns and behavior over multiple interactions. Each temperament applies mechanical multipliers to the decision engine AND has a distinct verbal signature in the bark system.

| Temperament | Decision Engine Effect | Verbal Signature |
|---|---|---|
| **Ideologue** | Interest Alignment ×1.5, Sentiment ×0.5, Party Pressure ×0.5, District Pressure ×0.8 | Talks about principles, beliefs, what's right. Frames decisions in moral terms. Never references deals or political convenience. |
| **Follower** | Interest Alignment ×0.7, Sentiment ×0.8, Party Pressure ×2.0, District Pressure ×1.2 | References leadership, the party, the Whip. Frames decisions as obligations. Defers upward constantly. Uses "we" and "the party" instead of "I." |
| **Dealmaker** | Interest Alignment ×0.8, Sentiment ×1.5, Party Pressure ×0.7, District Pressure ×1.0 | Talks about relationships, favors, history, reciprocity. Frames decisions as transactions. References what you've done for them. |
| **Opportunist** | Interest Alignment ×0.6, Sentiment ×0.8, Party Pressure ×0.8, District Pressure ×1.5, plus unique Momentum Bonus | Talks about momentum, odds, timing, which way the wind blows. References cosponsor counts and public attention. |

### NPC Bills

Roughly 15 of the 49 other members are actively trying to pass their own legislation (same pro/pro/anti tag structure, with auto-generated names from the tag-based naming pool). The remaining 34 are rank-and-file with interests and agendas but no active legislative push. See NPC Autonomous Behavior for full details on how NPC bills advance.

---

## System 4: Sentiment

The single most important hidden number in the game. Determines whether NPCs will take meetings, vote for the player's bill, cosponsor, share intelligence, or actively work against the player.

### Scale and Tiers

Runs from **-100 to +100.** The player never sees exact numbers — only attitude tiers:

| Tier | Range | Meaning |
|---|---|---|
| **Hostile** | -100 to -60 | Actively works against you. Won't deal. |
| **Cold** | -59 to -20 | Resistant. Demands lopsided deals. |
| **Neutral** | -19 to +20 | Persuadable. Needs clearly favorable deals. |
| **Warm** | +21 to +60 | Cooperative. Gives you a generous margin on trades. |
| **Allied** | +61 to +100 | Deeply committed. Takes slightly unfavorable deals on trust. |

### Starting Sentiment

Determined by three factors at game start:

- **Party alignment:** Same-party bonus / cross-party penalty, scaled by Loyalist-Pragmatist slider. Full Loyalist: ~+25 own party, ~-25 opposition. Full Pragmatist: ~+5 own party, ~-5 opposition.
- **Interest overlap:** +10 per shared core interest with the player's bill tags; -10 per conflicting core interest.
- **Seniority gap:** Slight penalty — senior members start mildly cold toward freshmen.

Most NPCs start **Neutral.** A few same-party allies may start Warm. A few cross-party ideological opponents may start Cold. Nobody starts Allied or Hostile — those must be earned.

### Sentiment Changes

**Small shifts (±3 to ±8 points) — routine political behavior:**
- Voting with someone's interests on any bill: +3 to +5
- Voting against their interests: -3 to -5
- Attending same committee hearings and participating: +1 to +2 per event
- Proactively offering support without asking for anything: +5 to +8
- Canceling a meeting: -3 to -5 (scales with lateness)

**Medium shifts (±10 to ±20 points) — meaningful political actions:**
- Voting the way you explicitly promised: +10 to +15
- Cosponsoring their bill: +10 to +15
- Successfully completing a favor they asked for: +12 to +18
- Voting against their bill when you're Neutral or better: -10 to -15
- Refusing a direct request in a meeting: -5 to -10

**Large shifts (±20 to ±40 points) — pivotal moments:**
- Breaking an explicit promise: -25 to -35 (most destructive action in the game)
- Attaching a hostile amendment to their bill: -20 to -30
- Going out of your way to save their endangered bill: +20 to +30
- Campaigning for them in their district before a primary: +25 to +35
- Warning them about a real, verified threat: +15 to +25

### The Asymmetry Principle

Negative shifts are roughly **twice as impactful** as positive shifts of the same category. Building from Neutral to Warm might take 5–8 positive interactions over many days. Destroying it can happen in one betrayal.

### Extreme Resilience

Sentiment degrades slower at the extremes. A Hostile member won't get much more hostile from one more negative interaction. An Allied member has resilience — one bad vote won't instantly destroy the relationship. The **middle of the spectrum (Neutral) is the most volatile.** First impressions matter.

### Sentiment Decay

Sentiment slowly **drifts toward a baseline** over time without interaction. Baseline is determined by starting factors (party, interest overlap, seniority).

- Decay rate: ~1–2 points per week of no interaction
- Same-party members decay slower
- Cross-party members decay faster
- Allied members decay slowest (deep trust is durable)
- Warm members decay fastest (shallow affinity fades without reinforcement)

### Whip Sentiment Anchoring

The party Whip's sentiment toward the player is **anchored to the player's party report card grade.** Each week, the Whip's sentiment drifts 5 points toward a target:

| Party Grade | Whip Sentiment Target |
|---|---|
| A+ | +50 (firmly Warm) |
| A | +30 (Warm) |
| B | +10 (Neutral, positive end) |
| C | -20 (Cold) |
| D | -40 (Cold, approaching Hostile) |
| F | -60 (Hostile) |

Meetings and favors still shift Whip sentiment normally, but those shifts fight against grade-driven gravity. The Whip respects loyalty, not friendship.

### NPC-to-NPC Sentiment

Exists but is simpler — tracks party affiliation, committee overlap, and past voting alignment. Matters when asking Member A to pressure Member B — it only works if A has leverage over B. Discoverable through meetings and observation.

---

## System 5: The NPC Decision Engine

The mechanical core of every NPC interaction. Every time the player asks an NPC for something, the engine runs a single calculation. The output maps to one of seven response types. One function, every interaction.

### The Core Function: Net Willingness

```
Net Willingness = Interest Alignment (× temperament multiplier)
               + Sentiment Modifier (× temperament multiplier)
               + Party Pressure (× temperament multiplier)
               + District Pressure (× temperament multiplier)
               + Faction Pressure
               + Presidential Stance Effects
               + Situational Modifiers
```

### Response Thresholds

| Net Willingness | Response |
|---|---|
| +60 or higher | "Done." — Immediate agreement, no conditions |
| +40 to +59 | "I'm with you on this." — Agreement, but they're signaling it costs them |
| +20 to +39 | "I'm leaning your way, but..." — Persuadable, not there yet |
| -19 to +19 | "What's in it for me?" — Open to a deal, won't do it for free |
| -20 to -39 | "I can't." — Unwilling now, door open |
| -40 to -59 | "No." — Flat refusal |
| -60 or lower | "Absolutely not, and..." — Hostile refusal + consequence |

### Component 1: Interest Alignment

For vote/cosponsorship asks on a specific bill, check each of the bill's tags against the NPC's interests. Bills start with 3 tags but can gain more through amendments — there is no upper limit on tags.

| Relationship | Points |
|---|---|
| Bill's pro-tag matches NPC's core interest | +15 |
| Bill's pro-tag matches NPC's flexible interest | +8 |
| Bill's anti-tag targets NPC's core interest | -20 |
| Bill's anti-tag targets NPC's flexible interest | -10 |
| Bill's pro-tag targets NPC's core interest's natural enemy | -12 |
| No relationship | +0 |

Sum across all tags. **Range scales with tag count** — a 3-tag bill ranges roughly -52 to +38, but a 6-tag bill that's been amended can range much wider. More tags means more factions and NPCs have opinions, making the bill a political lightning rod. This is the natural cost of amendment bloat. For non-bill asks (help pressuring a chair, introductions, etc.), Interest Alignment is 0.

### Component 2: Sentiment Modifier

```
Sentiment Modifier = Sentiment Score × 0.4
```

**Range: -40 to +40.** Sentiment alone can't force a "Done" or an "Absolutely not" — you always need at least one other factor working with or against you.

### Component 3: Party Pressure

**Whip instruction:**

| Whip Position | Same-Party NPC | Cross-Party NPC |
|---|---|---|
| Whip says YES (matches player's ask) | +12 | 0 (opposing Whip may counter: -10) |
| Whip says NO (opposes player's ask) | -15 | 0 |
| No Whip position | 0 | 0 |

**Player's party standing effect** (same-party NPCs only):

| Player's Party Grade | Modifier |
|---|---|
| A+ (Insider) | +5 |
| A or B (Good Standing) | +0 |
| C (On Thin Ice) | -3 |
| D or F (Outcast) | -8 |

**Presidential stance effect on Party Pressure:**

```
Party Pressure bonus = Presidential Stance × 3 (same-party NPC as President)
Party Pressure bonus = Presidential Stance × -2 (opposing-party NPC)
```

Presidential Stance is the aggregate score across the bill's tags from the President's known policy positions. See Presidential Stance System for full calculation.

**Range: -23 to +17** (before presidential effects).

### Component 4: District Pressure

**Bill alignment with NPC's district:**

| Relationship | Points |
|---|---|
| Bill's pro-tag matches district preference | +8 |
| Bill's anti-tag matches district hostility | +5 |
| Bill's pro-tag matches district hostility | -12 |
| Bill's anti-tag targets district preference | -15 |
| No relationship | 0 |

**Primary proximity multiplier:**

| Days Until NPC's Primary | Multiplier |
|---|---|
| 15+ days | ×1.0 |
| 8–14 days | ×1.5 |
| 3–7 days | ×2.0 |
| 1–2 days | ×3.0 |
| Already survived primary | ×0.3 |
| Lost primary (lame duck) | ×0.0 |

**Presidential stance effect on District Pressure:**

```
District Pressure bonus = Presidential Stance × (Presidential Approval Rating / 25)
```

At 50% approval, this gives ×2. At 75%, ×3. At 25%, ×1. A popular president's endorsement gives political cover; an unpopular president's endorsement is toxic.

**Range: roughly -45 to +39** (at maximum proximity). More typically -15 to +13 in mid-game. Lame ducks have District Pressure of 0 on every ask.

### Component 5: Faction Pressure

Derived from the player's **report card grades** with factions the NPC cares about:

```
Faction Pressure = Σ (for each faction the NPC is aligned with):
    A+ or A: +4
    B: +1
    C: -2
    D: -4
    F: -6
```

**Banana Lobby modifier:** Applied to ALL NPCs regardless of faction alignment, at doubled values:

| Banana Lobby Grade | Modifier (all NPCs) |
|---|---|
| A+ or A | +8 |
| B | +2 |
| C | -4 |
| D | -8 |
| F | -12 |

A player with an F from the Banana Lobby has -12 Faction Pressure applied to every single NPC interaction in the game. That's the silent chill effect, quantified.

### Component 6: Presidential Stance Effects

The President's aggregate stance on a bill creates a **veto threat signal** applied as a Situational Modifier:

| Presidential Aggregate Stance | Signal | Modifier |
|---|---|---|
| +4 to +6 | "Will sign" | +5 |
| +1 to +3 | "Likely to sign" | +2 |
| 0 | "Unknown" | 0 |
| -1 to -3 | "May veto" | -5 |
| -4 to -6 | "Will veto" | -12 |

Only applies when the aggregate stance is calculable from **public information.** Hidden presidential stances contribute +0. Gossip-hinted stances apply at half strength.

### Component 7: Situational Modifiers

| Situation | Modifier | Notes |
|---|---|---|
| Player cosponsored NPC's bill | +10 | Direct reciprocity signal |
| Player voted against NPC's bill (ever) | -8 | Persistent grudge |
| Player broke a promise to this NPC | -20 | Persists 15 days, decays to -10 permanently |
| NPC has existing deal conflicting with ask | -25 | Committed elsewhere |
| Headline event aligns with the bill | +8 | Public attention creates cover |
| Headline event opposes the bill | -8 | Public attention creates risk |
| Ask is for cosponsorship (vs. vote) | -10 | Cosponsorship is public, higher bar |
| NPC and player share a committee | +3 | Proximity breeds familiarity |
| NPC's bill was killed by player's enemy | +5 | Enemy of my enemy |
| Bill has Lean Burden Rating | +3 | Fiscal responsibility is popular |
| Bill has Heavy Burden Rating | -5 | Budget-conscious NPCs hesitate |
| Bill has Bloated Burden Rating | -8 | Fiscal poison, applied to all NPCs |

### Temperament Multipliers

Applied to Components 1–4 BEFORE summing:

**Ideologue:** Interest ×1.5, Sentiment ×0.5, Party ×0.5, District ×0.8

**Follower:** Interest ×0.7, Sentiment ×0.8, Party ×2.0, District ×1.2

**Dealmaker:** Interest ×0.8, Sentiment ×1.5, Party ×0.7, District ×1.0

**Opportunist:** Interest ×0.6, Sentiment ×0.8, Party ×0.8, District ×1.5, plus Momentum Bonus: +15 if bill has >5 cosponsors, +25 if >10, -10 if <3.

### Vote Decision Function

Floor votes and committee votes use the same engine. Every voting member runs the Net Willingness calculation. If Net Willingness > 0, they vote yes. If ≤ 0, they vote no.

**Promise Override:** If the member explicitly promised a specific vote, the promise overrides the calculation unless Net Willingness is below -40. Promises hold through mild turbulence but break under severe pressure. Breaking triggers betrayal penalties (-25 to -35 sentiment).

### Trade Evaluation Function

When the response is "What's in it for me?" the NPC generates a counter-ask:

**Step 1 — Calculate Ask Cost:**
```
Ask Cost = max(0, -Net Willingness + 10)
```

**Step 2 — Select counter-ask** from priority-ordered list of current NPC needs:

| Counter-Ask | Value to NPC | When Available |
|---|---|---|
| Vote yes on NPC's own bill | 15–25 | NPC has an active bill |
| Cosponsor NPC's bill | 20–30 | NPC needs public support |
| Campaign in NPC's district | 25–35 | NPC's primary meter above 40 |
| Accept an amendment to player's bill | 15–25 | NPC has unrepresented policy interest |
| Vote on unrelated legislation | 10–20 | Pending floor vote NPC cares about |
| Pressure another member | 15–25 | NPC building a coalition |
| Financial support (fundraiser) | 15–20 | NPC's war chest is low |

NPC picks the highest-priority item with value ≥ Ask Cost. If no single item meets the threshold, NPC picks their top priority regardless — creating "uncomfortable deals" where the NPC asks for something disproportionately valuable.

**Step 3 — If the player accepts,** both commitments are logged in the Promise Ledger. The counter-ask's value is added as a Situational Modifier, pushing the NPC above the agreement threshold.

---

## System 6: The Bark System

All NPC dialogue is delivered through **barks** — short, authored lines of one to two sentences that encode strategic intelligence for attentive players. No dynamically generated dialogue. All emotion and attitude is conveyed through text, never through portrait expressions (portraits are static).

### Two-Layer Design

Every bark functions on two layers:

- **Surface read:** Attitude, personality, whether they're saying yes or no
- **Subtext read:** What this tells you about their temperament, their pressure points, and what move to make next

Players who just read the surface get a functional game. Players who learn to read the subtext get a massive strategic advantage.

### Bark Selection Engine

**Step 1:** Calculate Net Willingness → map to response tier (7 tiers).

**Step 2:** Check for **contextual interjection triggers** (boolean game-state flags). If triggered, prepend the interjection before the bark. Interjections do not override the response tier — they add flavor and urgent signals.

**Step 3:** Identify the **dominant driver** — the component with the largest absolute value after temperament multipliers. This determines which bark sub-pool to draw from:

| Dominant Driver | Bark Sub-Pool Theme |
|---|---|
| Interest Alignment | Policy language — talks about the bill's content, principles, beliefs |
| Sentiment | Relationship language — talks about trust, history, what you've done |
| Party Pressure | Institutional language — talks about leadership, the Whip, party loyalty |
| District Pressure | Electoral language — talks about constituents, back home, primary, voters |
| Faction Pressure | External pressure language — talks about groups, lobbyists, being seen |
| Momentum (Opportunist only) | Momentum language — talks about odds, cosponsors, bill trajectory |

**Step 4:** Filter by temperament within the sub-pool. Same dominant driver, different voice.

**Step 5:** Select randomly from remaining candidates (3–5 per combination) to prevent repetition.

### Bark Corpus Size

```
7 response tiers × 6 dominant driver sub-pools × 4 temperaments × 3–5 variants
= ~500–700 core barks
+ 25–30 contextual interjections
+ 40–50 discussion/information barks
+ 20–28 budget scoring barks (see Budget Scoring Barks below)
= ~590–810 total authored lines
```

Each bark is one to two sentences. Barks are specific to the *reason* for the response, not the *content* of the ask. An Ideologue's sentiment-driven "Done" bark works regardless of which bill is discussed.

### Contextual Interjections

Rare, triggered by specific boolean game-state conditions. Fire before the bark and signal critical state changes:

- **Broken promise detected:** *"You told me you'd vote my way on Bill 6. You didn't."* (Replaces normal Phase 2 — NPC won't engage until addressed)
- **NPC just lost their primary:** *"I've got nothing left to lose. So let's talk openly for once."* (Lame duck status)
- **NPC's bill just died:** *"My bill died in committee yesterday. I'm not in a generous mood."* (Wounded, possibly hostile, but now a free agent)
- **Banana Lobby active and relevant:** *"I'm going to be careful about what I say next. And you should be careful about what you ask."* (Chill effect made audible)
- **Sentiment just crossed tier boundary downward:** *"We used to be friendly. I'm not sure what happened."* (Accumulated slights crossed a threshold)
- **First meeting ever:** *"I don't know you yet. What are you about?"* (Limited information flow, evaluation mode)

### Budget Scoring Barks

When the Budget Chair announces a Burden Rating, they deliver a bark selected by the standard engine. The dominant driver is almost always Interest Alignment or Faction Pressure (Budget scoring is a policy evaluation). ~20–28 authored lines: 7 response tiers × 4 temperaments, with 1 variant each.

**Examples by Chair disposition:**

Favorable (positive Net Willingness): *"The numbers work. I've seen worse."* — Surface: approval. Subtext: the Chair helped you, and "I've seen worse" signals they could have been harsher. Implicit leverage.

Neutral (near-zero Net Willingness): *"It costs what it costs. I just count the acorns."* — Surface: impartiality. Subtext: no bias either direction. Straight math. Boring — which is the best outcome you can hope for from a Budget Chair.

Unfavorable (negative Net Willingness): *"The costs are what they are. I didn't make the math."* — Surface: neutral. Subtext: "I didn't make the math" is a tell. The Chair *did* make the math, and they're distancing themselves from a politically motivated inflation. An attentive player reads this as "the score is biased — consider a challenge."

Hostile (strongly negative Net Willingness): *"I'd recommend my colleagues read the full assessment before scheduling floor time."* — Surface: bureaucratic caution. Subtext: the Chair is actively lobbying against the bill's floor chances, using the score as a weapon. Declaration of war disguised as fiscal responsibility.

### The Learning Progression

- **Days 1–5:** Player treats barks as yes/no signals. Relies on mechanical readout.
- **Days 6–15:** Player notices patterns. "Every time this member says no, she mentions the Whip."
- **Days 16–35:** Player has internalized temperament signatures. Walks into meetings and reads the bark directly. Mechanical readout becomes confirmation.
- **Days 36–60:** Player reads barks like poker tells. Acts on subtext three moves ahead of surface meaning.

---

## System 7: Member Interactions

### Meeting Structure

Every one-on-one meeting follows a three-phase flow.

**Phase 1 — The Read.** Before the player speaks, the game shows a status readout: attitude tier, known interests, committee seats, report card grades (publicly visible), outstanding business (promises made/owed). First-time meetings show minimal information. Repeated interaction reveals more.

**Phase 2 — The Ask.** The player constructs a request using a verb-object menu system. The NPC Decision Engine runs and produces a response tier. The Bark Selection Engine selects and displays the appropriate bark. A mechanical readout below the bark shows why the NPC responded this way and (for refusals) what might change their mind.

**Phase 3 — The Offer.** If the response is "What's in it for me?", the Trade Evaluation Function generates a counter-ask. The player sees both sides of the deal and decides.

### Verbs and Branches

**"I need your vote..."**
→ Select a specific bill → Choose direction: vote yes, vote no, or abstain

**"I need your cosponsorship on..."**
→ Select a bill. Higher stakes than a vote — cosponsorship is public.

**"I need help with..."**
→ Submenu:
- **"Getting a hearing scheduled"** — Pressure a committee chair
- **"A meeting with [NPC]"** — Introduction/vouch
- **"The Rules Committee"** — Lobby for favorable terms
- **"The President"** — Use their White House access
- **"The Budget score"** — Lobby the Budget Chair or recruit a Budget Committee member for a challenge

**"I want to discuss..."**
→ Select: a policy area, a specific bill, a faction, or another member. Information-gathering. Costs nothing politically.

**"I want to offer..."**
→ Your vote, cosponsorship, help pressuring a colleague, primary campaign support. Proactive goodwill-building.

**"I want to warn you about..."**
→ Can be genuine intelligence or a bluff. True warnings that prove accurate: big sentiment boost. Discovered lies: devastating hit.

**"I want to propose combining our bills."**
→ Only available when targeting an NPC with an active bill. Proposes merging the player's bill provisions into the NPC's bill as an omnibus package. Major ask — the NPC evaluates risk, tag conflicts, budget impact, and what they'd demand in return (typically tag removal and cosponsorship concessions). See Omnibus Bills for full mechanics.

### The Promise Ledger

All promises made in meetings are tracked in a ledger — promises made to others and promises others have made to the player. When a promise comes due and is broken, betrayal is flagged and sentiment penalties apply automatically. NPCs reference broken promises via contextual interjections.

### Quick Interactions

- **Committee whispers:** During mandatory committee hearings, adjacent members can offer one-line exchanges. Limited scope, free in terms of time.
- **Markup sidebars:** During committee markup sessions, compressed negotiations with other committee members.

### NPC-Initiated Meeting Requests

~Twice per week, an NPC sends a meeting request. These skew heavily toward active NPC legislators asking for support on their bills. Taking meetings builds relationships. Ignoring requests is a missed opportunity.

---

## System 8: Bill Lifecycle

### Bill Tag Structure

Bills start with 3 tags at creation (2 pro, 1 anti). **Amendments can add, remove, or flip tags with no upper limit.** A bill that's been through brutal markup might emerge with 5 or 6 tags. Each added tag risks alienating someone who was previously a yes vote — the system self-regulates because more tags mean more faction opinions and more potential enemies alongside new friends. Additionally, each added pro-tag increases the bill's Burden Score (see Budget Scoring, System 24), creating a fiscal cost for amendment bloat.

### Stage 1 — Referral

The bill is assigned to one or two committees based on its policy tags. **Committee-mapped issues** (the 8 that correspond to committees) determine primary referral. **Cross-cutting issues** (Bananas, Nocturnal Affairs, Interspecies Relations, Trade & Commerce, Public Wellness, Youth & Offspring) don't have home committees — they determine secondary referral:

| Cross-Cutting Issue | Secondary Referral Committee |
|---|---|
| Bananas | Agriculture & Foraging |
| Nocturnal Affairs | Habitat & Burrows |
| Interspecies Relations | Predation & Defense |
| Trade & Commerce | Budget |
| Public Wellness | Environment & Conservation |
| Youth & Offspring | Habitat & Burrows |

A bill with two cross-cutting tags and one committee-mapped tag is referred primarily to the committee-mapped tag's committee. Being assigned to a committee the player sits on is a major advantage.

### Stage 2 — Getting a Hearing

The **committee chair** decides whether to schedule a hearing. A friendly chair schedules quickly. A hostile chair buries it. The player's bill competes with NPC bills for limited committee hearing slots (2 per week per committee).

**Player levers:**
- Build sentiment with the chair
- Get party leadership to pressure the chair
- Get other committee members to pressure the chair
- **Discharge petition** (last resort) — requires 26 signatures. Forces the bill to the floor, bypassing committee entirely. Makes the chair a permanent enemy.

### Stage 3 — Committee Markup

When a bill advances to markup, every committee member (typically 6–7, including the player if they sit on that committee) gets the opportunity to propose **one amendment each,** in seniority order.

**Amendment types:**

| Type | Effect |
|---|---|
| **Add a pro-tag** | New policy area added as positive position |
| **Add an anti-tag** | New policy area added as negative position |
| **Remove a tag** | Existing tag stripped from the bill |
| **Flip a tag** | Pro becomes anti or anti becomes pro |

Each amendment is voted on by the committee using the standard Vote Decision Function — each member calculates Net Willingness on the bill *as it would be with the amendment* versus *as it currently is.* If the amended version has higher Net Willingness, they vote yes on the amendment.

**NPC Amendment Behavior:**

NPCs don't propose randomly. The decision engine determines what they propose:

If Net Willingness on the current bill is above +40, the NPC proposes nothing (they're happy). Between -39 and +39, they propose an amendment addressing their dominant negative driver:

| Dominant Negative Driver | Amendment Logic |
|---|---|
| Interest Alignment | Remove/flip the offending tag, or add a pro-tag matching their core interest |
| District Pressure | Add a pro-tag matching district preference, or remove the tag their district hates |
| Faction Pressure | Remove the tag the aligned faction dislikes, or add one they want |
| Party Pressure | Add a tag matching party agenda, or remove the conflicting tag |

**Good-faith vs. Poison Pill:**

NPC sentiment toward the bill's author and their temperament determine intent:

| Condition | Behavior |
|---|---|
| Warm or Allied toward author | Good-faith amendment addressing their concern |
| Neutral | Pragmatic amendment without regard for overall bill health |
| Cold + Dealmaker | Strategic amendment serving their own agenda |
| Cold/Hostile + Ideologue | Poison pill — adds a tag toxic to the bill's existing coalition |
| Hostile (any temperament) | Poison pill or hostile flip gutting the bill's identity |

**Poison pill logic:** The engine finds the amendment that would cause the maximum Net Willingness drop across the bill's current supporters — the tag that flips the most yes votes to no. NPCs only propose poison pills if sentiment is Cold or Hostile, the poison value is at least 4 flipped votes, and their temperament permits it (Followers almost never propose poison pills; Opportunists only do it if the bill is already struggling).

**Budget poison pills:** A hostile NPC can also propose a Heavy pro-tag amendment designed to inflate the bill's Burden Score without obviously looking like sabotage. "I just wanted to add Youth protections. Who could vote against hatchlings?" Meanwhile the Budget score jumps by 2 and the bill slides toward Bloated.

**Poison pill warning signs** are discoverable through gossip (*"The cobra has been asking committee members about Predation policy"*), meetings with allies (*"Watch out for the cobra at markup"*), and committee whispers during the markup itself.

**The player's amendment options:** During markup of any bill in a committee the player sits on, the player gets their one proposal like everyone else — sweeteners, poison pills, strategic injections, or passing their turn.

**Amendment cascade effects:** When tags change, several systems recalculate: faction opinions, report card tracking, NPC Net Willingness, presidential stance, issue temperature modifiers, estimated Burden Score, and potentially committee referral. Adding a tag in a new policy area can trigger **secondary committee referral** — the Speaker can send the bill to an additional committee, effectively resetting progress. Committee chairs sometimes propose amendments specifically to trigger this.

### Stage 4 — Committee Vote + Budget Scoring

Simple majority of the committee. If it fails, the bill is dead. If it passes, the bill's **Burden Rating** is calculated and published simultaneously (see Budget Scoring, System 24). The Burden Rating uses the bill's post-markup tags and includes the Budget Chair's political adjustment. The player sees the committee passage on the Dusk Summary and the Burden Rating on the next Dawn Brief.

**No additional calendar delay.** The score is calculated instantly when a bill passes committee. If the player wants to challenge the score, the challenge is heard at the next Day 4 Morning Budget Committee meeting — this is the only scenario where Budget scoring introduces a delay, and it's the player's choice to initiate it.

**Exception:** If the bill was referred to Budget as its *primary* committee (because it carries a Budget tag), the scoring happens during the Budget Committee's hearing phase, before markup. The bill goes through full committee stages at Budget. This means Budget-tagged bills get scored earlier but face the full gauntlet of Budget Committee amendments.

### Stage 5 — Rules Committee

The Rules chair sets the terms for floor debate:
- **Open rule:** Any member can propose up to 3 floor amendments. Risky — poison pills incoming.
- **Closed rule:** No amendments, straight up-or-down vote. Safer, harder to get. The Rules Chair grants closed rules as a favor.
- **Modified rule:** The Rules Chair pre-approves a specific list of 1–3 amendments. The player can lobby to include or exclude specific amendments.

**Burden Rating affects Rules behavior:** The Rules Chair factors the bill's Burden Rating into rule-setting:

| Burden Rating | Rules Chair Disposition |
|---|---|
| Lean | More likely to grant Closed Rule (clean vote, no amendments) |
| Routine | Standard consideration |
| Heavy | Likely to impose Modified Rule with a mandatory pay-for amendment slot |
| Bloated | Will not grant Closed Rule under any circumstances. Demands Open Rule unless the player negotiates a Modified Rule with at least one pay-for. |

### Stage 6 — Floor Debate and Vote

Under Open or Modified rules, approved amendments are proposed, debated briefly (one bark from the proposer, one from the bill's author), and voted on by the full 50-member body before the final passage vote. All 50 members vote on passage. **26 votes needed to pass.** See Floor Vote Presentation for full details.

### Stage 7 — Presidential Action

**Sign:** The player wins.
**Veto:** Override attempt (34 votes) or amend and resubmit (brutal time crunch).
**Pocket signature:** The President does nothing and the bill becomes law automatically. More likely when the bill touches Cold issues — the President doesn't care enough to spend political capital on a veto.

**Burden Rating affects presidential behavior:** Heavy bills receive -1 to Presidential Aggregate Stance. Bloated bills receive -2. Lean bills receive +1. A bill the President mildly supports (+2 aggregate) becomes a coin flip (+0) if it's Bloated.

**Failure at any stage is potentially game-ending.** The player can draft a new bill, but the clock is against them.

### Omnibus Bills

An alternative victory path: instead of shepherding your own bill through the full pipeline, negotiate to **attach your bill's core provisions to a high-momentum NPC bill.**

**Step 1 — Identify a Vehicle.** Find an NPC bill further along the pipeline with compatible tags and a friendly author.

**Step 2 — The Proposal.** Meet with the NPC author and use the verb **"I want to propose combining our bills."** This is a major ask (Ask Cost typically 30–40).

**Step 3 — The Negotiation.** The NPC almost always demands:
- **Tag removal:** "Drop your anti-Predation tag. I'm not carrying that fight." The player must strip 1–2 tags.
- **Cosponsorship, not co-authorship:** The player is listed as cosponsor. This is the NPC's bill.
- **Vote commitment:** Blanket yes vote on everything else the NPC brings to the floor.
- **Campaign support:** Time slot costs.

**NPC willingness to merge** is affected by: tag alignment (+10 per aligned, -15 per conflicting), new faction allies (+8) or enemies (-10) the player's tags bring, sentiment, NPC bill momentum (struggling bills are more receptive), **budget risk estimate** (see below), and temperament (Ideologues almost never accept at -25; Dealmakers evaluate transactionally; Followers need leadership approval; Opportunists check if the merge improves momentum).

**Budget risk estimate:** When the player proposes a merge, the NPC estimates the combined bill's Base Burden. If the estimated burden is **2 or more points higher** than the vehicle bill's current Burden Score, the NPC applies a **-10 modifier** to the merge evaluation. An NPC who spent political capital earning a Lean rating won't casually let the player trash it. The player may need to strip expensive tags before merging or compensate the NPC for the fiscal risk.

**Step 4 — The Merge.** Bills combine. The NPC's bill gains the player's remaining tags. It stays at the NPC's current pipeline stage. Momentum recalculates. Player is listed as cosponsor. NPC retains authorship and strategic control.

**Step 5 — Budget Re-Scoring.** The combined bill is **re-scored at the next Day 4 Morning Budget Committee meeting.** The new score uses the combined bill's full tag set with a fresh Chair Adjustment calculated from the Chair's Net Willingness on the merged bill. The **original Chair** who scored the vehicle bill handles the re-score (maintaining continuity — the player can predict the Chair's behavior). If the re-score pushes the rating to a worse tier, all downstream consequences apply immediately: queue penalty, Decision Engine modifier, Rules Chair disposition. If the re-score improves the rating (rare), the bill benefits from the better rating.

**Step 6 — Loss of Control.** The player is no longer driving. The NPC makes decisions about amendments, markup strategy, and floor timing. If the NPC accepts a poison pill that guts the player's provisions — too bad. Control was traded for momentum.

**Omnibus risk:** If the NPC's bill fails after the merge, the player's provisions die with it.

**Omnibus victory scoring:**

| Condition | Score Modifier |
|---|---|
| Base omnibus victory | 60% of normal passage score |
| Each player tag that survived | +10% (up to 30%) |
| Player's anti-tag survived | +15% |
| Zero post-merge amendments | +10% |
| Typical omnibus score | ~70–80% of normal |

**Strategic timing:** Omnibus proposals are most valuable Days 25–45, when the player can honestly assess their solo bill's trajectory. Savvy players cultivate omnibus partners early while still pushing their own bill — insurance that rewards long-term planning.

---

## System 9: Committees

### The Eight Standing Committees

| Committee | Jurisdiction | Notes |
|---|---|---|
| **Agriculture & Foraging** | Food supply, bananas, nuts, grazing land, farming | Broad constituency. High demand. |
| **Habitat & Burrows** | Housing, nesting, territory, infrastructure, dams | Overlaps with Environment on land use. |
| **Migration & Transit** | Migratory patterns, flight lanes, ocean currents, borders | High-profile, contentious. |
| **Predation & Defense** | Predator-prey relations, self-defense, claws/fangs regulation | The "hawkish" committee. |
| **Freshwater & Marine Affairs** | Water rights, ocean policy, river access, fishing, wetlands | Overlaps with Habitat on waterway infrastructure. |
| **Environment & Conservation** | Pollution, climate, endangered status, deforestation | Often at odds with Agriculture. |
| **Rules & Procedures** | Controls which bills reach the floor and under what conditions | Chair is one of the most powerful figures in the game. |
| **Budget** | Scores bills for fiscal burden — every bill has a resource implication. Processes challenges and pay-for recommendations. | Chair controls the Burden Rating. Can tank a bill by declaring it too expensive. See Budget Scoring (System 24). |

### Weekly Committee Schedule

| Day | Morning | Afternoon |
|---|---|---|
| **Day 1** | Agriculture & Foraging | Predation & Defense |
| **Day 2** | Migration & Transit | Freshwater & Marine Affairs |
| **Day 3** | Habitat & Burrows | Environment & Conservation |
| **Day 4** | Budget | Rules & Procedures |
| **Day 5** | *Open — no standing committees* | *Open — no standing committees* |

Each committee has one standing meeting slot per week. Day 5 is deliberately kept open — the premium scheduling day for one-on-ones, whip counts, and White House visits.

**Budget Committee Day 4 Morning uses:** Budget challenges, pay-for recommendation votes, and NPC bill scoring are all processed during this standing slot. If no Budget business is pending, the slot opens for regular committee hearings of Budget-referred bills.

**Overflow hearings:** When a committee has more than one bill needing a hearing in the same week, the chair schedules overflow hearings in open Morning/Afternoon slots on Days 1–4. Announced 2–3 days in advance. Mandatory for committee members.

### Assignment

- Each member sits on **two committees**
- ~6–7 members per committee
- Committee chairs assigned by majority party leadership
- Player's assignments influenced by Loyalist-Pragmatist slider
- Transfer requests possible mid-session — costs political capital

### Chair Power

Committee chairs can **schedule or refuse to schedule hearings** on any bill in their jurisdiction. This is one of the most important powers in the game. The Budget Chair has the additional power of adjusting Burden Scores through the Chair Adjustment formula — a political lever disguised as fiscal analysis.

---

## System 10: Calendar Pacing

### The 5-Day Week

60 days = 12 five-day weeks. No named days — just Day 1 through Day 5, repeating. Each day has 3 slots (Morning, Afternoon, Evening). 10 official-business slots per week, 5 evening slots.

### Fixed Weekly Events

- **Caucus Meeting:** Day 3, Evening. Mandatory for all party members. The Whip delivers voting instructions, leadership signals priorities, and 2 gossip items are guaranteed. Competes with relationship-building Evening slots.
- **Floor votes:** Announced 2 days in advance. Always scheduled in Afternoon slots on Day 1, 2, or 4. Never Day 3 or Day 5.

### The Mandatory Schedule Arc

| Session Phase | Weeks | Mandatory/Week | Free Official Slots/Week | Character |
|---|---|---|---|---|
| **Opening (Days 1–15)** | 1–3 | 3–4 | 6–7 of 10 | Sandbox. Open calendar. Relationship-building time. |
| **Ramp-Up (Days 16–30)** | 4–6 | 5–7 | 3–5 of 10 | Overflow hearings appear. Floor votes begin. Early primary hits Day 20. |
| **Peak (Days 31–45)** | 7–9 | 7–9 | 1–3 of 10 | Maximum throughput. Player's calendar shredded by mandatory events. Late primary hits Day 45. |
| **Crunch (Days 46–60)** | 10–12 | 8–10 | 0–2 of 10 | The sprint. Special sessions possible. Every slot contested. |

### Floor Vote Frequency

| Phase | Floor Votes/Week | Total |
|---|---|---|
| Opening | 0–1 | 0–3 |
| Ramp-Up | 1–2 | 3–6 |
| Peak | 2 (hard cap) | 6 |
| Crunch | 2 + special sessions | 6–8 |
| **Session total** | | **~18–23** |

### The Speaker's Queue

A visible prioritized list of bills waiting for floor time. The player can see their bill's position but not exact priority scores. Influencing the queue: meet with the Speaker, work through the Majority Leader, apply faction pressure, tie the bill to a Headlines event.

**Burden Rating affects queue priority:**

| Burden Rating | Queue Priority Modifier |
|---|---|
| Lean | +8 (leadership likes cheap wins) |
| Routine | 0 |
| Heavy | -10 (leadership hesitates on expensive bills) |
| Bloated | -20 (back of the line unless the player forces the issue) |

A Bloated bill doesn't just face harder vote math — it *waits longer to get a vote at all.* The clock is the ultimate enemy, and the Budget Committee just ate days off the calendar.

### Key Pacing Numbers

| Metric | Value |
|---|---|
| Days in session | 60 |
| Total slots | 180 |
| Official slots (M+A) | 120 |
| Evening slots | 60 |
| Standing committee meetings/week (player) | 2 |
| Overflow hearings/week (avg) | 0 early → 4 late |
| Floor votes/week (avg) | 0–1 early → 2 late |
| Caucus meetings/week | 1 |
| Total floor votes per session | 18–23 |
| Total NPC bills dying per session | ~9–11 of 15 |
| NPC bills killed by Budget scoring | ~2–3 of 15 |
| Target committee clearance for player's bill | By Day 30–35 |

---

## System 11: Primary Threat

### The Primary Health Meter

Runs from **0 (safe) to 100 (defeated).** At primary checkpoints, if the meter exceeds a threshold, the player loses their seat and the game ends.

### Primary Dates

Two primary dates per game: **Early (day 20)** and **Late (day 45).** Player chooses theirs. Other members split roughly evenly.

**Choosing Early:** Face election before much progress. Campaign on promises. If you survive: 40 days of legislative freedom.

**Choosing Late:** Time to build a record. Campaign on accomplishments. Electoral and legislative climaxes collide.

### Meter Increases

- Voting against district's core interests
- Report card attacks from factions/party (weekly, see Report Card System)
- Spending too little time campaigning back home
- Cosponsoring or supporting bills the district hates

### Meter Decreases

- Voting with district interests
- Campaigning back home (costs time slots, amplified by war chest)
- Report card payouts indirectly help (money funds campaigns)
- Bringing home a "win" — getting any district-friendly bill passed

### District Tolerance and the Slider

- **Loyalist districts** expect party-line voting. Punish deviation harshly.
- **Pragmatist districts** expect results. Punish extreme party loyalty at expense of local interests.

### Lame Duck Members

Members who lose their Early primary remain in congress until session's end. Their District Pressure component drops to 0. They have nothing to lose. Lame ducks are cheap allies — their endorsement is worthless but their vote still counts.

### Mid-Game Shift

After Day 20, the Early primary results transform the landscape. Some survived (free agents). Some lost (unpredictable lame ducks). Smart players plan around this shift.

---

## System 12: Special Interests / Factions

### Structure

Six factions total — five standard factions and one behemoth.

Each standard faction has:
- **1 Major Pro** — consistent across all games (permanent identity)
- **1 Minor Pro** — randomized each game (can be any of the 14 issues)
- **1 Minor Anti** — randomized each game (can be any of the 14 issues)
- **1 Major Anti** — consistent across all games (permanent enemy)
- **1 Permanent cross-cutting stance** — a fixed position on one of the 6 cross-cutting issues

### The Five Standard Factions

| Faction | Major Pro | Major Anti | Cross-Cutting Stance | Identity |
|---|---|---|---|---|
| **The Timber Union** | Habitat & Burrows | Conservation | Negative on Nocturnal Affairs (construction is daytime work) | Industry, construction, development. |
| **The Grazing Council** | Agriculture & Foraging | Predation & Defense | Positive on Youth & Offspring (herd animals invest heavily in offspring) | Food production, herbivore interests. |
| **The Migratory Compact** | Migration & Transit | Habitat & Burrows | Positive on Trade & Commerce (free movement means free trade) | Seasonal travelers, open movement. Two permanent enemies. |
| **The Claw & Fang Caucus** | Predation & Defense | Agriculture & Foraging | Negative on Interspecies Relations (predators resist coexistence mandates) | Apex predators, security hawks. Well-funded and aggressive. |
| **The Watershed Alliance** | Freshwater & Marine Affairs | Migration & Transit | Positive on Public Wellness (waterborne disease is their issue) | Aquatic species, river ecosystems, marine interests. |

### Permanent Conflict Lines

- **Timber Union** vs. **Migratory Compact** (building vs. movement)
- **Grazing Council** vs. **Claw & Fang Caucus** (prey vs. predator)
- **Watershed Alliance** vs. **Migratory Compact** (water stability vs. free movement)

### The Banana Lobby

Not a faction — a **force of nature.**

**Agenda:** Exclusively pro-Banana. Positive on Bananas (obviously). Negative on Trade & Commerce (free trade threatens their monopoly position). Anything anti-Banana draws their ire. Treasury roughly equal to the other five factions combined. Dormant for long stretches, then suddenly, terrifyingly active.

The Banana Lobby is the only faction with a permanent Major Pro on a cross-cutting issue (Bananas). This means its primary interest doesn't have a "home committee" — Banana bills get routed through Agriculture, but the Agriculture chair isn't necessarily a Banana ally. The Lobby projects power without institutional infrastructure, using money and fear instead.

**The silent chill effect:** Quantified through the report card system. A player with an F from the Banana Lobby has -12 Faction Pressure applied to every NPC interaction. Members decline anti-Banana asks not because they disagree, but because they're afraid.

**Hidden triggers:** Each game, 1–2 hidden issues that aren't obviously banana-related but provoke Banana Lobby intervention. Keeps the player productively paranoid.

**Beatable but brutal.** The hardest path in the game but not impossible.

### Faction Bill Opinions

Each faction evaluates every bill based on tag overlap:

| Condition | Opinion |
|---|---|
| Bill pro-tag matches faction's Major Pro | Positive |
| Bill pro-tag matches faction's Minor Pro | Positive |
| Bill anti-tag targets faction's Major Anti | Positive |
| Bill pro-tag matches faction's Major Anti | Negative |
| Bill anti-tag targets faction's Major Pro | Negative |
| Bill pro-tag matches faction's Minor Anti | Negative |
| None of the above | Neutral (not tracked) |

If both Positive and Negative conditions are triggered, Major beats Minor. If equal, Negative wins.

---

## System 13: The Report Card System

Factions, parties, and the President publish public scorecards tracking every legislator's voting record. These grades drive money, primary attacks, NPC sentiment, and the player's political identity.

### Grade Calculation

```
Grade Percentage = (Correct Votes / Total Tracked Votes) × 100
```

| Grade | Percentage |
|---|---|
| A+ | 95–100% |
| A | 85–94% |
| B | 75–84% |
| C | 65–74% |
| D | 50–64% |
| F | Below 50% |

"Correct" means voting the way the faction/party wanted on bills where they had an opinion (Positive or Negative). Neutral bills are not tracked.

### Cold Start: Prior Expectations

Grades aren't published until a faction has tracked at least **3 votes.** Each faction starts with a **prior** based on the player's bill tags — equivalent to 2 phantom votes:

- Bill aligns with faction: prior = 2/2 correct
- Bill conflicts: prior = 0/2
- Neutral: prior = 1/2

### Update Frequency

Grades recalculate in **real time** after every tracked vote. Consequences are processed **weekly on the Day 1 Dawn Brief.**

### Weekly Consequences

**Faction Payouts (A or higher):**

| Source | A Grade | A+ Grade |
|---|---|---|
| Standard faction | $150/week | $250/week |
| Banana Lobby | $400/week | $650/week |
| Player's own party | $300/week | $500/week |

**Faction Attacks (C or lower):**

| Source | C Grade | D Grade | F Grade |
|---|---|---|---|
| Standard faction | +2 primary/week | +4 primary/week | +6 primary/week |
| Banana Lobby | +5 primary/week | +8 primary/week | +12 primary/week |
| Player's own party | +4 primary/week | +7 primary/week | +10 primary/week |

**B-grade members get nothing.** No payout, no attack. B is the quiet middle ground — the strategic sweet spot for factions you want to keep neutral.

### Party Grade → Party Standing

| Party Grade | Party Standing Tier |
|---|---|
| A+ | Insider |
| A or B | Member in Good Standing |
| C | On Thin Ice |
| D or F | Outcast |

### The President as Seventh Scorecard

The President functions as a seventh "faction" for report card purposes. Key differences:

- The President's opinion on some bills is **hidden until revealed** through the White House access tiers
- Votes on bills with hidden presidential stances are not tracked until those stances become public
- When stances are revealed, the player's grade **retroactively adjusts** for past votes that aligned or conflicted — a "turns out the goldfish liked what I was doing" moment
- Presidential report card payouts and attacks follow party-tier values ($300/$500 for A/A+, +4/+7/+10 primary for C/D/F)

### Integration with Decision Engine

The report card replaces the old faction color icons on the dashboard. NPC Faction Pressure is now calculated from the player's publicly visible grades. NPC-to-NPC faction pressure uses the same system — NPC grades are visible on their profile screens, providing free intelligence.

### Report Cards and Budget Scoring

The Budget Committee does not generate its own faction-style report card. Budget is an issue, not a faction. But the player's votes on *other bills' pay-for amendments* are tracked by the factions whose interests those pay-fors target. Voting for an anti-Agriculture pay-for dings your Grazing Council grade. The Budget scoring process indirectly generates report card pressure through the votes it forces.

### Dashboard Display

```
┌─ REPORT CARDS ─────────────────────────────────────┐
│  FERALIST PARTY        A  (87%)  +$300/wk          │
│  Timber Union          B  (78%)                     │
│  Grazing Council       A  (90%)  +$150/wk          │
│  Migratory Compact     C  (68%)  +2 primary/wk     │
│  Claw & Fang Caucus    F  (35%)  +6 primary/wk     │
│  Watershed Alliance    A  (88%)  +$150/wk          │
│  Banana Lobby          B  (76%)                     │
│  President Gold        —  (unrated)                 │
│                                                     │
│  Weekly net: +$600, +8 primary                      │
│  Next report: Day 16 (2 days)                       │
└─────────────────────────────────────────────────────┘
```

---

## System 14: The 14 Issues

### Overview

The game has 14 policy issues that define bill tags, NPC interests, faction stances, and public attention. Eight are committee-mapped (each corresponds to a standing committee). Six are cross-cutting (they don't belong to a single committee and create political cleavages that cut across faction and party lines).

### Committee-Mapped Issues (8)

| Issue | Primary Committee |
|---|---|
| Agriculture & Foraging | Agriculture & Foraging |
| Habitat & Burrows | Habitat & Burrows |
| Migration & Transit | Migration & Transit |
| Predation & Defense | Predation & Defense |
| Freshwater & Marine | Freshwater & Marine Affairs |
| Environment & Conservation | Environment & Conservation |
| Rules & Procedures | Rules & Procedures (temperature locked at Lukewarm) |
| Budget | Budget (temperature locked at Lukewarm) |

### Cross-Cutting Issues (6)

| Issue | Secondary Referral Committee | Identity |
|---|---|---|
| **Bananas** | Agriculture & Foraging | International banana trade, land rights, labor, tariffs. The Banana Lobby's exclusive domain. Any bill with a Banana tag immediately draws Banana Lobby attention. |
| **Nocturnal Affairs** | Habitat & Burrows | Day/night species divide. Lighting regulation, curfew laws, den access hours. Splits congress along species lines that don't map to party. Creates unusual cross-party coalitions. |
| **Interspecies Relations** | Predation & Defense | Predator-prey coexistence laws, mixed-species communities, segregation vs. integration. The most socially divisive issue — touching it guarantees strong reactions. |
| **Trade & Commerce** | Budget | Territorial foraging permits, resource distribution, market regulation, monopoly enforcement. Everyone's second priority and nobody's first — a great horse-trading tag. |
| **Public Wellness** | Environment & Conservation | Disease control, parasite regulation, veterinary access, hibernation policy, epidemic preparedness. Hard to openly oppose — who campaigns on "I voted against disease prevention"? But expensive. |
| **Youth & Offspring** | Habitat & Burrows | Nesting rights, juvenile protection, education, spawning grounds, hatchling nutrition. Emotionally loaded — voting against Youth looks terrible in a primary. A political shield that costs legislative capital. |

### Why Cross-Cutting Issues Matter

Cross-cutting issues expand bill diversity (14 issues yield 1,092+ unique bill configurations vs. ~120 with only 8), create cleavages that break neat faction lines, and provide strategic tag options: Youth & Offspring is a natural sweetener (hard to vote against), anti-Bananas is a high-risk poison pill, and Trade & Commerce is a safe tag nobody loves or hates.

### NPC Issue Stances

Every NPC has a stance on each issue: Positive, Neutral, or Negative. Derived from existing profile data:

| Condition | Stance |
|---|---|
| Issue matches NPC's core interest | Positive |
| Issue matches NPC's flexible interest | Positive |
| Issue is natural enemy of NPC's core interest | Negative |
| Issue matches NPC's district hostility | Negative |
| None of the above | Neutral |

If conflicting conditions apply, the NPC's temperament priority stack breaks the tie. Ideologues favor core interest. Followers check party stance. Opportunists check district.

---

## System 15: Issue Temperature & Headlines

### Issue Temperature

Each of the 6 committee-mapped fluctuating issues (excluding Rules & Procedures and Budget, which are locked at Lukewarm) and the 6 cross-cutting issues has a temperature:

| Temperature | Meaning |
|---|---|
| **Hot** | Dominating public discourse. Leadership pressured to act. Whip takes positions. President signals. |
| **Lukewarm** | Normal background noise. No special pressure. |
| **Cold** | Public doesn't care. Leadership deprioritizes. "Why are you wasting my time with this?" |

### Starting Temperatures

**1 Permanent Hot Issue:** Selected at game generation. Must meet all criteria: both parties have opposing stances, the President has a publicly known stance, and at least one faction has it as a Major Pro or Anti. Only committee-mapped issues are eligible (cross-cutting issues are too niche for the defining fight of a session). This issue stays Hot for the entire 60-day session and never cools.

**1–2 Starting Hot Issues:** Can be any of the 12 fluctuating issues, including cross-cutting ones. Not permanent — can be cooled by headlines.

**4–5 Starting Lukewarm Issues.**

**4–5 Starting Cold Issues.**

**Bananas always starts Lukewarm** unless a Banana-related headline fires. The Banana Lobby prefers to operate in the shadows — a Hot Bananas issue draws scrutiny they don't want.

### How Temperature Affects the Game

**1. Bill Momentum:**

| Bill Tag Relationship to Issue | Hot | Lukewarm | Cold |
|---|---|---|---|
| Pro-tag matches the issue | +10 momentum | +0 | -8 momentum |
| Anti-tag targets the issue | +5 momentum | +0 | -5 momentum |

Applies to player's bill and NPC bills alike.

**2. Whip Behavior:**

The Whip **only issues instructions on bills that touch at least one Hot issue.** Bills touching exclusively Lukewarm or Cold issues don't get Whip instructions — they're not important enough. The permanent Hot issue always has Whip instructions. This is a major mechanical consequence: for Follower NPCs (Party Pressure ×2.0), losing Whip backing swings their calculation by 24–30 points.

**3. Presidential Priority:**

| Bill touches... | Presidential behavior |
|---|---|
| Permanent Hot issue | Public stance immediately. Signs or vetoes within 1 day. |
| Non-permanent Hot issue | Signals through Chief of Staff within 2 days. Acts within 2 days. |
| Lukewarm issue only | Takes 2–3 days. May pocket sign. Less predictable. |
| Cold issue only | Takes maximum time. May pocket sign with zero comment. A Cold-issue bill can slip through because the President doesn't care enough to veto. |

**4. Decision Engine Situational Modifier:**

| Issue Temperature | Bill Alignment | Modifier |
|---|---|---|
| Hot | Pro-tag matches issue | +10 |
| Hot | Anti-tag targets issue | +5 |
| Hot | Pro-tag conflicts with issue | -10 |
| Lukewarm | Any | +0 |
| Cold | Pro-tag matches issue | -5 |
| Cold | Anti-tag targets issue | -3 |

### Bombshell Headlines

**4–5 times per game** (roughly Days 8, 20, 32, 44, 55 with ±2 days variance), a Bombshell Headline fires.

Each bombshell has: **an event** (1–2 sentences, animal-themed, darkly humorous), **a temperature shift** (one issue heats up one step, one cools down one step; permanent Hot issue is immune to cooling), and **ripple effects** (faction activation, presidential approval shifts, NPC-specific impacts).

**Example headlines from the curated pool (~30 templates):**

| Headline | Heats | Cools | Ripple |
|---|---|---|---|
| *"Drought Devastates Southern Grazing Lands"* | Agriculture | Environment | Grazing Council activates. Farming district members: primary +3. |
| *"Apex Predator Attack at the Northern Border"* | Predation | Migration | Claw & Fang gains influence. Migratory Compact loses. |
| *"Toxic Runoff Poisons Three Rivers"* | Freshwater | Habitat | Watershed Alliance activates. |
| *"Mass Migration Wave Overwhelms Southern Territories"* | Migration | Agriculture | Migratory Compact and Watershed both activate from opposite sides. |
| *"Banana Blight Threatens Global Supply"* | Agriculture | Environment | **Banana Lobby activates.** Every Agriculture bill under scrutiny. |
| *"Celebrity Migration Advocate in Corruption Scandal"* | *(none)* | Migration (2 steps) | Migration cools dramatically. Migratory Compact loses influence. |
| *"Budget Office Reveals Hidden Costs of [Hot Issue] Legislation"* | *(none)* | Current non-permanent Hot | Public tires of the issue. Budget hawks gain ammunition. |
| *"President Gold's Approval Plummets After Gaffe"* | Varies | Varies | Presidential approval -10 to -15. |

**Headline selection logic:** Filter pool by current conditions → weight by disruption value (prefer headlines affecting the player's bill or current political landscape) → exclude already-fired templates → select one.

**Bombshell timing design:** Day ~8 (wake-up call), Day ~20 (Early primary chaos), Day ~32 (mid-game inflection), Day ~44 (Late primary chaos), Day ~55 (final disruption, 5 days before session end).

### Minor Headlines

**1–2 per week** between bombshells. Don't shift temperatures. Provide narrative texture and occasional intelligence. Examples: *"Senator Crane Proposes Controversial Freshwater Amendment"* or *"President Gold Seen Meeting with Banana Lobby Representatives"* (no mechanical effect — but the player should be nervous).

### Temperature Tracker Display

```
┌─ ISSUE TEMPERATURES ───────────────────────────────┐
│  Agriculture & Foraging    🔥 HOT                   │
│  Predation & Defense       🔥 HOT (permanent)       │
│  Migration & Transit          Lukewarm              │
│  Habitat & Burrows            Lukewarm              │
│  Freshwater & Marine          Cold ❄                │
│  Environment & Conservation   Cold ❄                │
│  Bananas                      Lukewarm              │
│  Nocturnal Affairs            Cold ❄                │
│  Interspecies Relations       Lukewarm              │
│  Trade & Commerce             Lukewarm              │
│  Public Wellness              Cold ❄                │
│  Youth & Offspring            Lukewarm              │
│  ─────────────────────────────────────────────────  │
│  YOUR BILL TAGS:                                    │
│  pro-Agriculture (HOT ✓)                            │
│  pro-Freshwater (Cold ✗)                            │
│  anti-Predation (HOT — controversial)               │
└─────────────────────────────────────────────────────┘
```

---

## System 16: The President

President Gold is a goldfish in a simple tank. Mechanically present but physically almost inaccessible.

### Presidential Stance Score

The President has a hidden opinion on each of the 14 policy issues:

| Stance | Score |
|---|---|
| Strongly supports | +2 |
| Mildly supports | +1 |
| Neutral | 0 |
| Mildly opposes | -1 |
| Strongly opposes | -2 |

3–4 stances are public at game start. The rest are hidden.

**Aggregate stance on a bill:**
```
Presidential Stance = Σ Stance(each pro-tag) + Σ Stance(each anti-tag, inverted)
```

For a standard 3-tag bill, range is -6 to +6. Amended bills with more tags produce wider ranges — a 6-tag bill can range -12 to +12. Only calculable from publicly known stances. Hidden stances contribute +0. Gossip-hinted stances apply at ×0.5.

**Burden Rating modifies Presidential Aggregate Stance:** Lean +1, Heavy -1, Bloated -2. Applied after the tag-based calculation. A bill the President mildly supports (+2 aggregate) becomes a coin flip (+0) if it's rated Bloated.

### How Presidential Stance Enters the Decision Engine

Presidential stance modifies **Party Pressure** and **District Pressure** for every NPC (see NPC Decision Engine, Components 3 and 4). It also generates a **Veto Signal** Situational Modifier.

**Revealing a favorable presidential stance** is like flipping a switch that shifts Net Willingness across all 49 NPCs simultaneously. Revealing an unfavorable stance does the opposite. The player must gamble on whether revealing presidential opinions will help or hurt.

### Access Tiers

| Tier | NPC | Information Quality | Availability |
|---|---|---|---|
| **White House Liaison** | Junior staffer | Vague signals | Most days |
| **Chief of Staff** | Old tortoise | Clearer information, can relay pitches | Occasional, competitive |
| **Presidential Meeting** | President Gold | Clear read, can negotiate | 1–2 per session, invitation only |

### Veto Mechanics

If the bill passes the floor and is vetoed:
- **Override attempt:** Requires 34 votes. Triggers a second floor vote. Player's presidential report card drops to F immediately, rippling through every NPC's calculation.
- **Amend and resubmit:** Address objections and restart from committee.
- The veto is a disaster, not a game-over screen. The scramble IS the game.

---

## System 17: The Whip

The party Whip is a special NPC whose sentiment is anchored to the player's party report card grade.

### Mechanics

Before floor votes on bills that touch at least one **Hot issue**, the Whip contacts members with voting instructions. The Whip's instruction is the party's opinion for report card purposes. Bills touching exclusively Lukewarm or Cold issues do not receive Whip instructions — they're not politically important enough for leadership to spend disciplinary capital on. The permanent Hot issue always generates Whip instructions.

- **Complying:** Party report card grade maintained or improved. Small sentiment bonus.
- **Defying:** Party report card grade drops. -15 to -20 sentiment with Whip (fighting against grade-anchored gravity).
- **Repeated defiance:** Grade drops to C or below → Party Standing falls to "On Thin Ice" or "Outcast" → weekly primary attacks from own party begin.

### The Core Tension

The Whip's demands may conflict with the player's bill interests, district preferences, or cross-party promises. The player's party report card is the running ledger of compliance.

---

## System 18: NPC Autonomous Behavior

NPCs pursue their own agendas in the background. The player is the protagonist but not the center of the political universe.

### Bill Generation

Each of the 15 active NPC legislators gets a bill with the same pro/pro/anti tag structure. Tags are drawn from core interests, party agenda, and faction alignment. At least 3 NPC bills must conflict with the player's bill. At least 2 should be natural allies.

### The Advancement Engine

Each NPC bill has a hidden **Momentum score** (0–100). The game checks advancement every 5 days (Days 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55).

**Momentum factors:**

| Factor | Modifier |
|---|---|
| NPC Seniority | +8 per level (1–5) |
| Committee chair alignment | +20 if aligned, -20 if conflicting |
| Party agenda alignment | +10 if aligned, -5 if conflicting |
| Faction support | +5 per aligned, -5 per opposed |
| Cosponsor count | +2 per cosponsor (cap +20) |
| Competing bills in same committee stage | -5 per competing bill |
| Issue temperature | +10 per pro-tag on Hot issue, -8 per pro-tag on Cold issue, +5 per anti-tag on Hot issue, -5 per anti-tag on Cold issue |
| Burden Rating (post-scoring) | Lean +8, Routine 0, Heavy -12, Bloated -20 (applied once at the advancement check following scoring) |
| Temperament modifier | Varies (see below) |

**Temperament effects on bill-pushing:**
- **Ideologue:** +5 base (relentless) but refuses to amend, capping cosponsors
- **Follower:** +0 base, +15 if leadership-aligned, -10 if leadership-indifferent
- **Dealmaker:** +3 per NPC-to-NPC deal struck (max 5 deals)
- **Opportunist:** +10 above 60 momentum, -10 below 30 (amplifies own success/failure)

**Advancement thresholds:**

| Stage Transition | Momentum Needed |
|---|---|
| Referred → Hearing Scheduled | 40+ |
| Hearing → Markup | 50+ |
| Markup → Committee Vote | 45+ |
| Committee Vote → Rules | Pass the vote |
| Rules → Floor Vote | 55+ |

### NPC Bill Scoring

NPC bills are scored using the same Budget Scoring formula as the player's bill. The Budget Chair applies the same politically-biased Chair Adjustment. NPC bill Burden Ratings are processed at the Day 4 Morning Budget Committee meeting. A Bloated NPC bill with -20 momentum is functionally dead — the Budget Committee is an NPC bill graveyard.

**Player exploitation:** A savvy player can weaponize the Budget Committee. Building sentiment with the Budget Chair and then lobbying them on the policy concerns of a rival NPC's bill can produce a harsh Chair Adjustment. This costs time but never dirties the player's hands directly.

### NPC Bill Attrition

Target: ~9–11 of 15 NPC bills die during the session, including ~2–3 killed by bad Budget scores.
- Days 1–20: 2–3 die
- Days 20–40: 2–3 more die
- Days 40–60: Only 4–6 still in play

NPCs whose primary meter exceeds 70 abandon their bills to campaign. Discoverable through gossip.

### Calendar Interaction

**Committee hearing slots:** 2 per committee per week. NPC hearings compete with the player's hearing for slots.

**Floor vote slots:** Maximum 2 per week. Speaker controls priority. NPC bills compete with the player's for floor time.

**Mandatory event load:** NPC bill advancement directly drives the mandatory schedule — more NPC bills reaching hearings and floor votes = more mandatory slots consumed.

### NPC-to-NPC Deals

2–3 new deals generated per week. Each deal locks one vote. Deals are hidden by default, discoverable through gossip, meetings, and whip counts.

### The Abstraction Boundary

The system does NOT simulate: NPC daily schedules, NPC-to-NPC meeting conversations, NPC fundraising, NPC campaign activities (abstracted into primary meter), NPC whip count operations. **Simulate what the player can discover, abstract what they can't.**

---

## System 19: The Gossip System

A rolling notification log providing intelligence during mandatory events.

### Rules

- Maximum **15 messages** in the log
- **1–2 gossip items** per mandatory event
- ~5–8 items per week for an attentive player
- Triggers only during **mandatory events**
- Each item is **true but incomplete**

### Gossip Quality Scaling

Players with higher average sentiment across the body receive more specific, actionable intelligence. Well-liked members get better whispers.

### Budget Scoring Gossip

Budget scoring generates specific gossip triggers:

**Post-scoring gossip (always fires when any bill is scored):** Reports the bill's score and the chair's mood. Example: *"Z.B. 42 scored Heavy — the osprey didn't look happy about it."*

**Pay-for preview gossip (fires when Chair Adjustment is +1 or higher):** Reports the Chair's likely recommendation. Example: *"The osprey wants to offset Z.B. 42 by cutting Migration funds."*

**Challenge intelligence gossip (fires when Chair Adjustment is +2 or higher, OR when score lands exactly on a tier boundary):** Reports whether a challenge would succeed. Example: *"Budget members are divided on the Clean Rivers score. The beaver and the frog think it's inflated."* Or: *"Nobody on Budget disagrees with the osprey's assessment. Don't waste your time."* This gives the player enough information to decide whether challenging is worth the slot and the Chair's enmity — the "feel clever, not lucky" principle.

---

## System 20: The Information Game

The player should never have complete information.

### Hidden or Partially Hidden Elements

- Exact sentiment scores (tiers visible, numbers hidden)
- How members will actually vote (whip counts are estimates)
- The President's full policy preferences (partially revealed through effort)
- NPC temperament labels (inferred through bark patterns)
- NPC-to-NPC deals (discovered through gossip and meetings)
- What amendments other members are planning
- Whether a faction is about to campaign against you
- The mechanical effect of arm-twist offers during floor votes
- The Budget Chair's exact Net Willingness on the player's bill (the Chair Adjustment is hidden math — the player sees the final Burden Score and rating but not the breakdown between Base Burden and Chair Adjustment)

### Information-Gathering Costs

| Action | Slot Cost | Information Gained |
|---|---|---|
| One-on-one meeting ("discuss") | 1 slot | One member's likely position and concerns |
| Whip count | 1 slot | Survey of 5–8 members |
| Final whip check (vote days only) | 1 slot | Most accurate read, names undecided members |
| White House liaison meeting | 1 slot | One presidential preference revealed |
| Budget challenge hearing | 1 slot (Day 4 Morning) | Forces a committee vote on the score's fairness |
| Gossip (passive) | 0 | 1–2 true-but-incomplete intel items |
| Committee whispers (passive) | 0 | Overheard fragments |
| NPC report cards (passive) | 0 | Publicly visible voting alignment data |
| Burden Rating (passive) | 0 | Public once assigned — visible on bill profile and Speaker's Queue |

---

## System 21: Congressional Leadership

| Role | Power |
|---|---|
| **Speaker of the Den** | Controls floor calendar, influences Rules. Most powerful NPC. |
| **Majority Leader** | Manages legislative agenda, coordinates with Speaker. |
| **Minority Leader** | Leads opposition strategy, controls minority party discipline. |
| **Party Whip (each party)** | Enforces party discipline. Sentiment anchored to party report card. |
| **Committee Chairs** | Schedule or refuse hearings. Gatekeepers for bill advancement. |
| **Rules Committee Chair** | Sets terms for floor debate. |
| **Budget Committee Chair** | Controls Burden Ratings through the Chair Adjustment formula. One of the 4–5 most important NPCs alongside the Speaker, Rules Chair, and the player's Whip. A long-term relationship investment that pays off at one critical moment. |

---

## System 22: Floor Vote Presentation

### Pre-Vote Phase: Final Whip Check

On vote days, the slot before the vote is flagged as a **Final Whip Check** opportunity. More detailed than mid-session whip counts — names undecided members with one-line reads pulled from the decision engine's dominant driver:

```
UNDECIDED MEMBERS:
• Elk (F) — leaning yes, worried about district
• Badger (F) — primary in 3 days, scared
• Crane (C) — open to deal, hasn't been asked
```

The player can use this slot for the whip check (intelligence, no action) or a last-minute meeting (action, less visibility).

### The Vote Screen

Full-screen **hemicycle** — semicircular seating showing all 50 members as static pixel portraits. Arranged by party (Feralists left, Communalists right, moderates center).

Portrait states: **Unlit** (hasn't voted), **Green glow** (YES), **Red glow** (NO).

Running tally above the hemicycle. Vote log ticker below.

### Vote Order (Three Phases)

**Phase 1 — The Predictables (seats 1–20).** Members with Net Willingness above +40 or below -40. Locked-in votes. Fast pace (0.5–1 second each). Establishes the baseline. The ABSENCE of expected voters from this phase signals something has shifted.

**Phase 2 — The Leaners (seats 21–35).** Net Willingness +20 to +40 or -20 to -40. First surprises possible. Moderate pace (1–1.5 seconds each).

**Phase 3 — The Swing Votes (seats 36–50).** Net Willingness -20 to +20. The undecided. Slow pace (2–3 seconds each). Every vote moves the tally meaningfully.

### The Arm-Twist

During Phase 3 only, the player can target **one** undecided member. The vote pauses. The NPC delivers a bark (pulled from the standard engine — dominant driver determines the verbal signature). The player sees a list of offers with **no mechanical readout — no numbers, no probability.**

```
┌─ ARM-TWIST: Rep. Badger (F) ───────────────────────┐
│                                                      │
│  "My constituents are watching this vote closely."   │
│                                                      │
│  [Promise to campaign in her district]               │
│  [Promise your vote on her bill]                     │
│  [Remind her of the party line]                      │
│  [Promise war chest support]                         │
│  [Say nothing — let her vote her conscience]          │
│                                                      │
└──────────────────────────────────────────────────────┘
```

The player must rely on what they've learned about this member throughout the game to choose correctly. The offer runs through the decision engine silently. If it pushes Net Willingness above 0, the member votes YES. If not, they vote NO and the promise is logged regardless.

**Constraints:**
- One arm-twist per floor vote, total
- Only during Phase 3
- The offer is a real, binding promise
- No feedback on whether it worked until the vote is cast
- If it fails, no second attempt

### NPC Bill Votes

Same hemicycle presentation, compressed pacing. No arm-twist available. Before the ticker starts, the player votes on the bill with a preview of report card impact for each option.

### Vote Breakdown (Post-Vote)

After the result, a breakdown screen shows: raw tally, party split, promises kept and broken, surprises (unexpected flips), faction reactions, report card impact, and presidential posture.

### Veto Sequence

If the player's bill passes and the President vetoes, the player chooses: **Override** (34 votes, second floor vote, presidential grade drops to F immediately), **Amend and Resubmit** (restart from committee), or **Accept Defeat.**

---

## System 23: The Gameplay Loop

### The Dawn Brief

Every day opens with a static information screen. Four sections:

**Today's Calendar:** Three slots with what's booked (mandatory events pre-filled, tentative meetings shown, open slots marked).

**Notices:** Actionable items that arrived overnight — NPC meeting requests, Whip instructions, hearing invitations, time-sensitive gossip, headline events, Burden Rating announcements. Each notice has an immediate response (accept/decline/acknowledge) or can be deferred.

**Dashboard Snapshot:** All status indicators with overnight changes highlighted.

**Promise Ledger Reminder:** Only appears when promises are due within 3 days.

### Slot Selection

After the Dawn Brief, the player resolves each slot in order (Morning → Afternoon → Evening). They don't pre-plan the whole day — information from Morning changes Afternoon decisions. Each slot opens the Action Menu:

- **Schedule a meeting** (from pending requests or new)
- **Attend optional event** (overflow hearings, receptions)
- **Flexible actions** (whip count, campaign, review calendar)

### Meeting Flow

Meetings follow the three-phase system (Read → Ask → Offer). The bark system delivers NPC responses. The mechanical readout shows strategic context. Deals are logged in the Promise Ledger.

### Dusk Summary

Brief receipt for the day: actions taken, promise ledger updates, and a "TOMORROW" preview showing the next day's mandatory events. If the player's bill passed committee today, the Dusk Summary celebrates the passage. The Burden Rating appears on the *next* Dawn Brief — one slot of feeling good before the Budget Chair drops the hammer.

### Between Days

Background systems tick: NPC momentum (on weekly check days), NPC-to-NPC deals, faction behavior, sentiment decay, headline events. None of this is visible directly — it feeds into the next Dawn Brief.

### Decision Cadence

~6 major decisions per day (slot allocation) + 4–8 minor decisions (meeting responses, votes, notice handling) = **10–14 decisions per day, ~300–420 across a full game.** Enough to feel substantial. Not so many that individual decisions feel cheap.

---

## System 24: Budget Scoring (The Ledger)

The Budget Committee evaluates every bill that passes its primary committee. In a game with no GDP and no tax revenue, the Budget Committee measures **Burden** — an abstract score representing institutional weight, enforcement capacity, territorial disruption, and resource reallocation. The number is partly formulaic and partly political, because the Budget Chair gets to put a thumb on the scale.

### Where It Sits in the Pipeline

Budget scoring happens **simultaneously with committee passage** — the Burden Rating is calculated and published the moment a bill passes its primary committee vote, using the bill's post-markup tags. No additional calendar delay.

```
Referral → Hearing → Markup → Committee Vote [+ Budget Score assigned] → Rules → Floor Vote → President
```

The Budget Committee's Day 4 Morning slot is used for: processing Budget challenges, voting on pay-for recommendations, and scoring NPC bills (processed in batch at the weekly meeting). If the player wants to challenge the score, they must do so before the bill reaches the Rules Chair, at the next Day 4 Morning meeting. Accepting the score costs zero calendar time.

**Exception:** If the bill was referred to Budget as its *primary* committee (because it carries a Budget tag), the scoring happens during the hearing phase, before markup. The bill goes through full committee stages at Budget.

### The Burden Formula

Every bill tag has a **Burden Weight** based on which policy area it touches.

**Issue Burden Weights:**

| Weight | Issues | Rationale |
|---|---|---|
| **Heavy (3)** | Habitat & Burrows, Agriculture & Foraging, Freshwater & Marine, Public Wellness | Construction, land management, water infrastructure, disease control. These physically change the territory. |
| **Medium (2)** | Migration & Transit, Predation & Defense, Environment & Conservation, Youth & Offspring, Trade & Commerce, Bananas | Enforcement, institutional capacity, trade apparatus. Significant but less concrete than building dams. |
| **Light (1)** | Nocturnal Affairs, Interspecies Relations | Primarily regulatory adjustments. Writing rules, not moving resources. |
| **Zero (0)** | Rules & Procedures, Budget | Procedural. No resource implication. |

**Base Burden calculation:**

```
Base Burden = Σ (each pro-tag's Burden Weight) + Σ (1 per anti-tag, regardless of issue)
```

Pro-tags carry their full weight because *mandating* something new is expensive. Anti-tags are a flat 1 each because *banning* something is cheap — you're removing activity, not creating it.

**Ranges for standard 3-tag bills (2 pro, 1 anti):**

| Bill Profile | Example | Base Burden |
|---|---|---|
| Two Light pro + Light anti | pro-Nocturnal, pro-Interspecies, anti-Nocturnal | 1 + 1 + 1 = **3** |
| One Heavy + one Medium pro + Medium anti | pro-Freshwater, pro-Migration, anti-Predation | 3 + 2 + 1 = **6** |
| Two Heavy pro + Heavy anti | pro-Habitat, pro-Agriculture, anti-Freshwater | 3 + 3 + 1 = **7** |

**Ranges for amended bills:** A 5-tag bill with 3 Heavy pro-tags, 1 Medium pro-tag, and 1 anti-tag: 3+3+3+2+1 = **12**. A 6-tag monstrosity: easily 14+.

### The Budget Chair's Thumb

The Budget Chair calculates the **Chair Adjustment** — a modifier based on the Chair's political disposition toward the bill.

```
Chair Adjustment = floor( -Chair's Net Willingness toward bill / 15 )
```

The Chair's Net Willingness is calculated using the standard Decision Engine (System 5), treating the scoring as a vote-type ask.

| Chair's Net Willingness | Chair Adjustment | Translation |
|---|---|---|
| +60 or higher | -4 | "Our analysis found significant efficiencies." |
| +45 to +59 | -3 | Favorable assumptions. |
| +30 to +44 | -2 | Generous reading. |
| +15 to +29 | -1 | Slight benefit of the doubt. |
| -14 to +14 | 0 | Straight math, no bias. |
| -15 to -29 | +1 | Slight pessimism. |
| -30 to -44 | +2 | Unfavorable assumptions. |
| -45 to -59 | +3 | "The costs are worse than they look." |
| -60 or lower | +4 | "This bill is a fiscal catastrophe." |

**Range: -4 to +4.** The asymmetry principle applies: hostility is easy; generosity is hard.

### The Burden Rating

```
Final Burden Score = max(0, Base Burden + Chair Adjustment)
```

| Score | Rating | Shorthand |
|---|---|---|
| 0–3 | **Lean** | "Fiscally responsible." |
| 4–7 | **Routine** | "Within normal parameters." |
| 8–11 | **Heavy** | "Significant cost concerns." |
| 12+ | **Bloated** | "Fiscally reckless." |

The rating is **public information** the moment it's issued. It appears on the bill's status in the Speaker's Queue, on the bill's profile screen, and in the Dawn Brief the day after scoring.

### Mechanical Consequences

**1. Decision Engine — Situational Modifier (permanent once assigned):**

| Burden Rating | Modifier | Notes |
|---|---|---|
| Lean | +3 | Fiscal responsibility is popular |
| Routine | 0 | Expected |
| Heavy | -5 | Budget-conscious NPCs hesitate. Applied to ALL NPCs. |
| Bloated | -8 | Fiscal poison. Applied to ALL NPCs. Stacks with everything else. |

**2. Speaker's Queue Priority:**

| Burden Rating | Queue Modifier |
|---|---|
| Lean | +8 (leadership likes cheap wins) |
| Routine | 0 |
| Heavy | -10 (leadership hesitates on expensive bills) |
| Bloated | -20 (back of the line unless the player forces the issue) |

**3. Rules Committee Behavior:**

| Burden Rating | Rules Chair Disposition |
|---|---|
| Lean | More likely to grant Closed Rule |
| Routine | Standard consideration |
| Heavy | Likely to impose Modified Rule with a mandatory pay-for amendment slot |
| Bloated | Will not grant Closed Rule. Demands Open Rule unless the player negotiates a Modified Rule with at least one pay-for. |

**4. Presidential Behavior:**

| Burden Rating | Presidential Aggregate Stance Modifier |
|---|---|
| Lean | +1 |
| Routine | 0 |
| Heavy | -1 |
| Bloated | -2 |

### Pay-For Amendments

When a bill scores Heavy or Bloated, the Budget Chair recommends a **pay-for** — a special anti-tag that offsets costs.

**How pay-fors work:** A pay-for is a new anti-tag added to the bill, representing cutting or restricting a program to offset costs. The Burden Score is reduced by the targeted issue's Burden Weight. The anti-tag's normal +1 burden cost is **waived** for pay-fors. But the anti-tag has all its normal *political* effects: faction opinions shift, NPC Interest Alignment recalculates, report card tracking updates.

```
Pay-For Reduction = targeted issue's Burden Weight
```

| Pay-For Target | Reduction | Example |
|---|---|---|
| Anti-Habitat (Heavy) | -3 | "Offset costs by freezing burrow construction subsidies." |
| Anti-Migration (Medium) | -2 | "Fund it by reducing border corridor maintenance." |
| Anti-Nocturnal (Light) | -1 | "Suspend the lighting standards program." |

**Pay-for recommendation algorithm:** The Budget Chair selects the recommended pay-for by simulating all 14 issues not already tagged on the bill:

```
For each of the 14 issues NOT already tagged on the bill:
    Simulate adding anti-[issue] as a pay-for tag
    Calculate Chair's Net Willingness on the bill WITH the pay-for
    Record the result

Select the issue where the Chair's Net Willingness is HIGHEST.
```

The Chair picks the pay-for that makes *the Chair personally* most supportive of the bill — typically cutting an issue the Chair dislikes or an issue the Chair's faction opposes. The recommendation is *technically* about cost savings but *functionally* about the Chair's political agenda.

**Counter-proposals:** If the player sits on the Budget Committee, they can propose an alternative pay-for during the scoring hearing. The committee votes between the Chair's recommendation and the player's counter-proposal using the standard Vote Decision Function (each member compares Net Willingness on the bill with each pay-for option and votes for the one they prefer).

**The recommended pay-for is not mandatory at the scoring stage.** It's a recommendation. But if the Rules Chair later *requires* a pay-for slot on the floor, the Budget Committee's recommendation becomes the default amendment unless the player negotiates an alternative.

**Pay-for cascade:** If a pay-for amendment adds an anti-tag in a new policy area, the standard amendment cascade check applies — the Speaker *could* trigger secondary committee referral. Budget Chairs occasionally propose pay-fors specifically designed to trigger this.

### The Budget Challenge

If the player believes the Chair inflated the score, they can **challenge the Burden Rating.** This costs one time slot — heard at the next Day 4 Morning Budget Committee meeting.

**The challenge argument:** Strip the Chair Adjustment and revert to Base Burden only. The Budget Committee votes: YES to sustain the Chair's score, NO to strip the adjustment. Each committee member runs the Decision Engine on the bill. If Net Willingness > 0, they vote NO (help the bill). If ≤ 0, they vote YES (sustain). Simple majority decides.

**Costs of challenging:**
- **Win:** Score drops to Base Burden. Chair loses face. Chair sentiment toward player: **-15 to -20.** You've publicly humiliated the Chair of the Budget Committee.
- **Lose:** Score unchanged. Slot wasted. Challenge is public — opponents know you're worried.

**Constraints:**
- One challenge per bill, total. No appeals.
- If the player doesn't sit on the Budget Committee, they must convince a Budget member to raise the challenge on their behalf (requires a meeting + the member's willingness via the Decision Engine).

### NPC Bill Scoring

NPC bills use the same formula. The Burden Rating applies a one-time momentum modifier at the next advancement check:

| Burden Rating | NPC Momentum Modifier |
|---|---|
| Lean | +8 |
| Routine | 0 |
| Heavy | -12 |
| Bloated | -20 |

Of the ~9–11 NPC bills that die per session, **2–3 should die from bad Budget scores.** The Budget Committee thins the field and frees floor vote slots.

### Dashboard Display

```
┌─ BILL STATUS: Z.B. 42, the Clean Rivers Act ──────┐
│                                                     │
│  [Referral ✓] [Hearing ✓] [Markup ✓]              │
│  [Committee ✓] [BUDGET: HEAVY ⚖] [Rules ...]      │
│  [Floor Vote ...] [President ...]                   │
│                                                     │
│  Burden Score: 9 (Heavy)                            │
│  Base: 7  |  Chair Adjustment: +2                   │
│  Pay-for recommended: anti-Migration (-2)           │
│  Queue position: 4th (penalty applied)              │
│                                                     │
└─────────────────────────────────────────────────────┘
```

### Worked Example: The Osprey and the Rivers

The player's bill: **Z.B. 42, the Clean Rivers Act**
- Pro: Freshwater & Marine (Heavy, weight 3)
- Pro: Environment & Conservation (Medium, weight 2)
- Anti: Agriculture & Foraging (Heavy, but anti-tags are flat 1)

During committee markup, two amendments were adopted: pro-Youth & Offspring (Medium, weight 2) and pro-Habitat & Burrows (Heavy, weight 3).

**Post-markup tags (5 total):** pro-Freshwater (3), pro-Environment (2), pro-Youth (2), pro-Habitat (3), anti-Agriculture (1).

**Step 1 — Base Burden:**
```
Base Burden = 3 + 2 + 2 + 3 + 1 = 11
```

That's the top of Heavy. One more point and it's Bloated.

**Step 2 — Budget Chair evaluation.**

The Budget Chair is **Rep. Osprey (Feralist)**, seniority 4, core interests: Trade & Commerce, Budget. Temperament: Ideologue. Aligned with the Claw & Fang Caucus.

*Interest Alignment:* No tags match Osprey's core interests (Trade, Budget). Sum: 0. ×1.5 (Ideologue) = **0**

*Sentiment Modifier:* Player has +12 sentiment (Neutral). 12 × 0.4 = 4.8. ×0.5 (Ideologue) = **2.4**

*Party Pressure:* Same party. No Whip instruction (Budget is Lukewarm). Party grade B: +0. Presidential bonus: +1 aggregate stance × 3 = +3. ×0.5 (Ideologue) = **+1.5**

*District Pressure:* Osprey's district hostility: Environment. Bill has pro-Environment: -12. ×0.8 (Ideologue) = **-9.6**

*Faction Pressure:* Claw & Fang grade D: -4. Banana Lobby grade B: +2. Total: **-2**

*Situational Modifiers:* Player cosponsored Osprey's bill: +10. Veto signal "Likely to sign": +2. Total: **+12**

**Net Willingness: 0 + 2.4 + 1.5 + (-9.6) + (-2) + 12 = +4.3 → +4**

**Chair Adjustment:** floor(-4 / 15) = floor(-0.27) = **0**. Straight math.

**Final Score: 11 + 0 = 11. Rating: Heavy.**

Consequences: -5 Decision Engine modifier on all NPCs. -10 Speaker's Queue priority. Rules Chair likely to impose a pay-for slot. Presidential aggregate stance -1.

**The Osprey's recommended pay-for:** Running the simulation across all untagged issues, the Osprey's Net Willingness is highest with anti-Trade & Commerce (removing Trade regulation aligns with Osprey's core interest). Reduction: -2. Score drops from 11 to 9, still Heavy but closer to Routine.

**What if the player had blocked the pro-Habitat amendment during markup?** Without it, Base Burden = 8. Same Chair Adjustment of 0. Score: 8 instead of 11. Still Heavy, but barely — and much closer to the Routine boundary where consequences are zero. One unnecessary amendment turned a manageable bill into a fiscal problem.

---

## Resource Architecture Summary

**Two spendable resources:**
- **Time** — 180 slots across 60 days. Fixed, non-renewable.
- **Money** — The war chest. Earned through fundraising and report card payouts. Spent on campaigns, colleague fundraisers, party contributions, ad campaigns.

**Dashboard conditions:**
- Bill status (pipeline tracker with Burden Rating and blocked indicator)
- Primary threat (meter with trend arrow and threshold line)
- War chest (exact dollar amount)
- Report cards (8 grades with percentages, weekly net income/primary impact)
- Caucus support estimate (three-tier indicator: Unlikely / Too Close / Likely)
- District mood (approval indicator)

**One implicit constraint:**
- Accumulated promises and obligations — tracked in the Promise Ledger. The anxiety of overcommitment is a feeling, not a meter.

---

## Scoring and Replayability

### Win Quality Scoring

**Solo passage scoring:**
- **Pure passage** — Bill passed with zero amendments (rare, impressive)
- **Primary dominance** — Kept primary meter low throughout
- **Respected colleague** — High average sentiment at game end
- **Fiscal discipline** — Ended with a healthy war chest
- **Budget efficiency** — Lean Burden Rating (bonus), Bloated (penalty)
- **Difficulty bonus** — Scaled by party balance setting
- **Speed bonus** — Calendar time remaining

**Omnibus passage scoring:** Base score is 60% of normal. +10% per surviving player tag (up to 30%). +15% if the player's anti-tag survived. +10% if zero post-merge amendments. Typical omnibus victory scores ~70–80% of solo passage. All other scoring categories (primary dominance, respected colleague, etc.) apply normally on top of the omnibus base.

A letter grade or star rating at the end screen gives completionists a reason to replay — can you get a perfect score on Brutal difficulty with a solo passage?

### Replayability Drivers

- Randomized party agendas, faction minor positions, faction power levels
- Randomized member profiles and temperaments
- Randomized presidential preferences
- Player choices at game creation (including Burden Weight tradeoffs in bill crafting)
- Multiple viable strategies

---

## Open Design Questions

### Systems Needing Detail
- **Discharge petition difficulty:** Political costs and signature-gathering mechanics

### Balance and Numbers
- **Exact thresholds for primary defeat**
- **Sentiment starting values** across different slider positions
- **War chest economy** — exact starting amounts, fundraiser yields, spending costs, scarcity curve
- **Calendar pacing fine-tuning** — how crowded does the mandatory schedule actually get in playtesting?
- **Headline pool expansion** — the ~30 bombshell templates and ~40 minor headline templates need full authoring
- **Bark corpus authoring** — the ~590–810 bark lines need writing, organized by response tier × dominant driver × temperament (including ~20–28 Budget scoring barks)

### UI and Presentation
- **The Civ I aesthetic in practice:** Screen layout, information density, drill-down screens
- **Pixel portrait style guide:** Level of detail, how static portraits convey character through design rather than animation
- **Committee markup UI:** Visual presentation of amendment proposals, voting, and tag changes during markup sessions
