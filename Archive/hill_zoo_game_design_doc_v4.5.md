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
= ~570–780 total authored lines
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

**"I want to discuss..."**
→ Select: a policy area, a specific bill, or another member. Information-gathering. Costs nothing politically. The NPC delivers a bark, and a **mechanical readout** below the bark provides concrete intelligence scaled by the NPC's sentiment toward the player. The bark signals willingness; the readout is the payload.

**Discussion output — Discussing a Policy Area:**

| Sentiment | Output |
|---|---|
| Warm/Allied | Temperature trend with prediction. 2–3 NPC stances revealed (names, Positive/Negative). Faction activity warnings. Committee intel if the NPC is a chair or member of the relevant committee. |
| Neutral | Temperature confirmation only (already known). 1 NPC stance, hedged (20% chance of inaccuracy). No faction or committee intel. |
| Cold/Hostile | Nothing actionable. 10% chance of misleading NPC stance presented as real. |

**Discussion output — Discussing a Specific Bill:**

| Sentiment | Output |
|---|---|
| Warm/Allied | Approximate vote count range. 1–2 undecided members named with one-line reads. NPC-to-NPC deal revealed if known. Amendment warning if NPC sits on relevant committee and markup is upcoming. Budget score prediction if NPC is qualified. |
| Neutral | Vague vote impression (no numbers, no names). Bill's public status restated. |
| Cold/Hostile | Nothing actionable. 15% chance of misleading vote impression. |

**Discussion output — Discussing Another Member:**

*Eligibility gate:* The player can only ask NPC A about NPC B if they share a committee or cosponsor the same bill. The filtered menu tells the player who the speaking NPC has direct knowledge of.

| Sentiment | Output |
|---|---|
| Warm/Allied | Temperament hint (one-phrase behavioral description, e.g., "Follows leadership's lead on everything"). Dominant current concern. 1 NPC-to-NPC deal involving the target. Sentiment hint toward the player. All accurate — no misleading intel on member discussions. |
| Neutral | Public profile recap (party, committees, report cards, seniority). Vague behavioral hint that doesn't clearly identify temperament. |
| Cold/Hostile | Nothing. The NPC refuses to discuss a colleague. |

Discussing another member is the most valuable intelligence action in the game for players who understand the temperament system — a single discussion with a Warm ally reveals what would otherwise take 3–4 meetings to infer from bark patterns.

**"I want to offer..."**
→ Your vote, cosponsorship, help pressuring a colleague, primary campaign support. Proactive goodwill-building.

**"I want to warn you about..."**
→ Can be genuine intelligence or a bluff. True warnings that prove accurate: big sentiment boost. Discovered lies: devastating hit.

**"I want to propose combining our bills."**
→ Only available when targeting an NPC with an active bill. Proposes merging the player's bill provisions into the NPC's bill as an omnibus package. Major ask — the NPC evaluates risk, tag conflicts, and what they'd demand in return (typically tag removal and cosponsorship concessions). See Omnibus Bills for full mechanics.

### The Promise Ledger

All promises made in meetings are tracked in a ledger — promises made to others and promises others have made to the player. When a promise comes due and is broken, betrayal is flagged and sentiment penalties apply automatically. NPCs reference broken promises via contextual interjections.

### Quick Interactions

Quick interactions are ambient conversations that happen between full meetings. They don't cost a time slot — they trigger at transition points between slots or during mandatory events. They use the same verb-object system as full meetings but heavily constrained: one exchange (two for Lingerers), limited verb options, smaller sentiment shifts (capped at ±5, ±8 for Lingerers), and no counter-asks or deal-making.

**Frequency:** ~1 every other day in the early game, scaling to ~1 per day in the late game. Hard cap of 2 per day.

**"What's in it for me?" downgrade:** If an NPC's response would be "What's in it for me?" during a quick interaction, it's downgraded to "I'm leaning your way, but..." with a bark signaling "bring this to a real meeting." Quick interactions don't have time for deals.

**Promises:** Commitments during quick interactions are informal and NOT logged in the Promise Ledger — except for Ambush accepts, which ARE logged because the NPC made a specific, urgent request.

**The Four Types:**

**Early Bird** — Triggers at the start of a day (Dawn Brief). The player arrives early and finds 1–2 NPCs already there. **High player control:** choose which to engage or skip entirely. Available verbs: discuss (condensed output), offer, or "Quick question" (ask one yes/no vote intention — response is a bark only, no readout). NPCs who appear are weighted toward active legislators, committee chairs, and NPCs with pending business with the player.

**Ambush** — Triggers at any transition. An NPC intercepts the player. **Low player control:** Engage or Divert. The NPC sets the agenda with a single bark stating their ask (vote, cosponsorship, help). The player responds with Accept, Decline, or "Let's talk later." Diverting costs -3 sentiment (-5 if it's the Whip). NPCs who ambush have urgent business — imminent floor votes, broken promises to confront, or Whip instructions to deliver.

**Hallway Encounter** — Triggers at non-committee transitions. **Medium player control:** one NPC appears, engage or pass with no penalty. Available verbs: discuss (condensed), offer, "Quick question," or "I heard something..." (share intel with the NPC — if true and useful, +3 to +5 sentiment; if the player has no real intel to share, this option doesn't appear). NPCs are weighted toward Warm/Allied members and committee-relevant members.

**Lingerer** — Triggers after the Evening slot. An NPC is still around late. **Medium-high player control:** engage or leave, no penalty. **Two verb selections** instead of one — the hallway is empty and there's no rush. Available verbs: discuss (condensed), offer, "Quick question," "I heard something...," or "How are you holding up?" (Lingerer-only personal check-in, +3 to +5 sentiment, NPC responds based on sentiment and stress level rather than the Decision Engine). NPCs who linger are under pressure — upcoming primaries, bill crises, or committee prep.

**Discussion output during quick interactions is condensed:** 1 item per category instead of full output (1 NPC stance instead of 2–3, temperament hint only instead of full member intel, etc.).

### NPC-Initiated Meeting Requests

~Twice per week, an NPC sends a meeting request. These skew heavily toward active NPC legislators asking for support on their bills. Taking meetings builds relationships. Ignoring requests is a missed opportunity.

---

## System 8: Bill Lifecycle

### Bill Tag Structure

Bills start with 3 tags at creation (2 pro, 1 anti). **Amendments can add, remove, or flip tags with no upper limit.** A bill that's been through brutal markup might emerge with 5 or 6 tags. Each added tag risks alienating someone who was previously a yes vote — the system self-regulates because more tags mean more faction opinions and more potential enemies alongside new friends.

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

**Poison pill warning signs** are discoverable through gossip (*"The cobra has been asking committee members about Predation policy"*), meetings with allies (*"Watch out for the cobra at markup"*), and committee whispers during the markup itself.

**The player's amendment options:** During markup of any bill in a committee the player sits on, the player gets their one proposal like everyone else — sweeteners, poison pills, strategic injections, or passing their turn.

**Amendment cascade effects:** When tags change, several systems recalculate: faction opinions, report card tracking, NPC Net Willingness, presidential stance, issue temperature modifiers, and potentially committee referral. Adding a tag in a new policy area can trigger **secondary committee referral** — the Speaker can send the bill to an additional committee, effectively resetting progress. Committee chairs sometimes propose amendments specifically to trigger this.

### Stage 4 — Committee Vote

Simple majority of the committee. If it fails, the bill is dead. If it passes, the bill receives a **Burden Rating** from the Budget Committee immediately (see System 24: Budget Scoring) and then moves to Rules.

### Stage 5 — Rules Committee

The Rules chair sets the terms for floor debate:
- **Open rule:** Any member can propose up to 3 floor amendments. Risky — poison pills incoming.
- **Closed rule:** No amendments, straight up-or-down vote. Safer, harder to get. The Rules Chair grants closed rules as a favor.
- **Modified rule:** The Rules Chair pre-approves a specific list of 1–3 amendments. The player can lobby to include or exclude specific amendments.

### Stage 6 — Floor Debate and Vote

Under Open or Modified rules, approved amendments are proposed, debated briefly (one bark from the proposer, one from the bill's author), and voted on by the full 50-member body before the final passage vote. All 50 members vote on passage. **26 votes needed to pass.** See Floor Vote Presentation for full details.

### Stage 7 — Presidential Action

**Sign:** The player wins.
**Veto:** Override attempt (34 votes) or amend and resubmit (brutal time crunch).
**Pocket signature:** The President does nothing and the bill becomes law automatically. More likely when the bill touches Cold issues — the President doesn't care enough to spend political capital on a veto.

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

**NPC willingness to merge** is affected by: tag alignment (+10 per aligned, -15 per conflicting), new faction allies (+8) or enemies (-10) the player's tags bring, sentiment, NPC bill momentum (struggling bills are more receptive), and temperament (Ideologues almost never accept at -25; Dealmakers evaluate transactionally; Followers need leadership approval; Opportunists check if the merge improves momentum).

**Step 4 — The Merge.** Bills combine. The NPC's bill gains the player's remaining tags. It stays at the NPC's current pipeline stage. Momentum recalculates. Player is listed as cosponsor. NPC retains authorship and strategic control.

**Step 5 — Loss of Control.** The player is no longer driving. The NPC makes decisions about amendments, markup strategy, and floor timing. If the NPC accepts a poison pill that guts the player's provisions — too bad. Control was traded for momentum.

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
| **Budget** | Scores bills for "cost" — every bill has a resource implication | Can tank a bill by declaring it too expensive. |

### Weekly Committee Schedule

| Day | Morning | Afternoon |
|---|---|---|
| **Day 1** | Agriculture & Foraging | Predation & Defense |
| **Day 2** | Migration & Transit | Freshwater & Marine Affairs |
| **Day 3** | Habitat & Burrows | Environment & Conservation |
| **Day 4** | Budget | Rules & Procedures |
| **Day 5** | *Open — no standing committees* | *Open — no standing committees* |

Each committee has one standing meeting slot per week. Day 5 is deliberately kept open — the premium scheduling day for one-on-ones, whip counts, and White House visits.

**Overflow hearings:** When a committee has more than one bill needing a hearing in the same week, the chair schedules overflow hearings in open Morning/Afternoon slots on Days 1–4. Announced 2–3 days in advance. Mandatory for committee members.

### Assignment

- Each member sits on **two committees**
- ~6–7 members per committee
- Committee chairs assigned by majority party leadership
- Player's assignments influenced by Loyalist-Pragmatist slider
- Transfer requests possible mid-session — costs political capital

### Chair Power

Committee chairs can **schedule or refuse to schedule hearings** on any bill in their jurisdiction. This is one of the most important powers in the game.

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

### NPC Bill Attrition

Target: ~9–11 of 15 NPC bills die during the session.
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

### Information-Gathering Costs

| Action | Slot Cost | Information Gained |
|---|---|---|
| Meeting: discuss policy area | 1 slot | NPC stances, faction activity, temperature trends, committee intel (Warm/Allied). Temperature confirmation only (Neutral). Nothing or misleading (Cold). |
| Meeting: discuss specific bill | 1 slot | Vote estimates, undecided names, deal intel, amendment warnings (Warm/Allied). Vague impression (Neutral). Nothing or misleading (Cold). |
| Meeting: discuss another member | 1 slot | Temperament hint, dominant concern, deals, sentiment read (Warm/Allied). Public profile recap (Neutral). Nothing (Cold). Requires shared committee or cosponsorship. |
| Whip count | 1 slot | Survey of 5–8 members' likely vote intentions on player's bill |
| Final whip check (vote days only) | 1 slot | Most accurate read, names undecided members with dominant-driver reads |
| White House liaison meeting | 1 slot | One presidential preference revealed |
| Quick interaction: "Quick question" | 0 slots | One NPC's vote intention on one bill (bark only, no readout) |
| Quick interaction: discussion (condensed) | 0 slots | 1 item per category instead of full output |
| Gossip (passive) | 0 | 1–2 true-but-incomplete intel items per mandatory event |
| NPC report cards (passive) | 0 | Publicly visible voting alignment data |

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

**Notices:** Actionable items that arrived overnight — NPC meeting requests, Whip instructions, hearing invitations, time-sensitive gossip, headline events. Each notice has an immediate response (accept/decline/acknowledge) or can be deferred.

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

Brief receipt for the day: actions taken, promise ledger updates, and a "TOMORROW" preview showing the next day's mandatory events. The preview creates anticipatory tension.

### Between Days

Background systems tick: NPC momentum (on weekly check days), NPC-to-NPC deals, faction behavior, sentiment decay, headline events. None of this is visible directly — it feeds into the next Dawn Brief.

### Decision Cadence

~6 major decisions per day (slot allocation) + 4–8 minor decisions (meeting responses, votes, notice handling) = **10–14 decisions per day, ~300–420 across a full game.** Enough to feel substantial. Not so many that individual decisions feel cheap.

---

## System 24: Budget Scoring

Every bill that passes its primary committee receives a **Burden Rating** from the Budget Committee — an assessment of institutional weight, enforcement capacity, and resource reallocation the bill demands. The rating is assigned immediately when the bill passes committee (no separate pipeline stage, no calendar delay) and is permanent once issued.

### The Burden Formula

Each bill tag has a **Burden Weight** based on policy area:

| Weight | Issues |
|---|---|
| **Heavy (3)** | Habitat & Burrows, Agriculture & Foraging, Freshwater & Marine, Public Wellness |
| **Medium (2)** | Migration & Transit, Predation & Defense, Environment & Conservation, Youth & Offspring, Trade & Commerce, Bananas |
| **Light (1)** | Nocturnal Affairs, Interspecies Relations |
| **Zero (0)** | Rules & Procedures, Budget |

**Base Burden:**
```
Base Burden = Σ (each pro-tag's Burden Weight) + Σ (1 per anti-tag, flat regardless of issue)
```

Pro-tags carry full weight (mandating something is expensive). Anti-tags are flat 1 each (banning something is cheap).

### The Budget Chair's Thumb

The Budget Chair applies a **Chair Adjustment** based on their political disposition toward the bill:

```
Chair Adjustment = floor( -Chair's Net Willingness toward bill / 15 )
```

| Chair's Net Willingness | Chair Adjustment |
|---|---|
| +60 or higher | -4 ("significant efficiencies found") |
| +45 to +59 | -3 |
| +30 to +44 | -2 |
| +15 to +29 | -1 |
| -14 to +14 | 0 (straight math) |
| -15 to -29 | +1 |
| -30 to -44 | +2 |
| -45 to -59 | +3 |
| -60 or lower | +4 ("fiscal catastrophe") |

**Final Burden Score = max(0, Base Burden + Chair Adjustment)**

### Burden Rating Tiers

| Score | Rating |
|---|---|
| 0–3 | **Lean** — "Fiscally responsible" |
| 4–7 | **Routine** — "Within normal parameters" |
| 8–11 | **Heavy** — "Significant cost concerns" |
| 12+ | **Bloated** — "Fiscally reckless" |

### Mechanical Consequences

**Decision Engine Situational Modifier:**

| Rating | Modifier |
|---|---|
| Lean | +3 |
| Routine | 0 |
| Heavy | -3 |
| Bloated | -8 |

Applied to ALL NPCs on every interaction about this bill. Permanent once assigned.

**Speaker's Queue Priority:**

| Rating | Modifier |
|---|---|
| Lean | +8 |
| Routine | 0 |
| Heavy | -10 |
| Bloated | -20 |

**Rules Committee Behavior:** Lean bills are more likely to receive Closed Rule. Heavy bills get Modified Rule with a mandatory pay-for amendment slot. Bloated bills cannot receive Closed Rule — Open Rule unless the player negotiates Modified with at least one pay-for.

**Presidential Aggregate Stance:** Lean: +1. Routine: 0. Heavy: -1. Bloated: -2.

### Pay-For Amendments

When a bill scores Heavy or Bloated, the Budget Chair recommends a **pay-for** — a special anti-tag that offsets costs. The Burden Score is reduced by the targeted issue's Burden Weight. The anti-tag's normal +1 burden cost is waived for pay-fors, but all political effects (faction opinions, report card tracking, NPC Interest Alignment) apply normally.

The Budget Chair selects the pay-for that maximizes their own Net Willingness on the amended bill — typically cutting something the Chair dislikes. The player can counter-propose a different pay-for if they sit on the Budget Committee. The committee votes between options.

### Budget Challenge

If the player believes the Chair inflated the score, they can challenge the Burden Rating (costs one slot). The Budget Committee votes: YES to sustain the Chair's score, NO to strip the adjustment. Win: score drops to Base Burden, Chair sentiment -15 to -20. Lose: score unchanged, slot wasted. One challenge per bill.

### NPC Bill Scoring

NPC bills are scored identically. Burden Ratings affect NPC momentum: Lean +8, Routine 0, Heavy -12, Bloated -20. Budget scoring kills 2–3 NPC bills per session.

### Omnibus Re-Scoring

When bills merge via omnibus, the combined bill is re-scored at the next Budget Committee meeting with the full combined tag set and a fresh Chair Adjustment.

---

## Resource Architecture Summary

**Two spendable resources:**
- **Time** — 180 slots across 60 days. Fixed, non-renewable.
- **Money** — The war chest. Earned through fundraising and report card payouts. Spent on campaigns, colleague fundraisers, party contributions, ad campaigns.

**Dashboard conditions:**
- Bill status (pipeline tracker with blocked indicator and Burden Rating once scored)
- Primary threat (meter with trend arrow and threshold line at 70)
- War chest (exact dollar amount)
- Report cards (8 grades with percentages, weekly net income/primary impact)
- Caucus support estimate (three-tier indicator: Unlikely / Too Close / Likely)
- District mood (approval indicator)
- Issue temperatures (12 fluctuating issues + 2 locked)

**One implicit constraint:**
- Accumulated promises and obligations — tracked in the Promise Ledger. The anxiety of overcommitment is a feeling, not a meter.

**Ambient intelligence layer:**
- Quick interactions (Early Bird, Ambush, Hallway Encounter, Lingerer) provide free intel and relationship maintenance between full meetings. ~1 per day on average, scaling with session phase.

---

## Scoring and Replayability

### Win Quality Scoring

**Solo passage scoring:**
- **Pure passage** — Bill passed with zero amendments (rare, impressive)
- **Primary dominance** — Kept primary meter low throughout
- **Respected colleague** — High average sentiment at game end
- **Fiscal discipline** — Ended with a healthy war chest
- **Difficulty bonus** — Scaled by party balance setting
- **Speed bonus** — Calendar time remaining

**Omnibus passage scoring:** Base score is 60% of normal. +10% per surviving player tag (up to 30%). +15% if the player's anti-tag survived. +10% if zero post-merge amendments. Typical omnibus victory scores ~70–80% of solo passage. All other scoring categories (primary dominance, respected colleague, etc.) apply normally on top of the omnibus base.

A letter grade or star rating at the end screen gives completionists a reason to replay — can you get a perfect score on Brutal difficulty with a solo passage?

### Replayability Drivers

- Randomized party agendas, faction minor positions, faction power levels
- Randomized member profiles and temperaments
- Randomized presidential preferences
- Player choices at game creation
- Multiple viable strategies

---

## Open Design Questions

### Systems Needing Detail
- **Discharge petition difficulty:** Political costs and signature-gathering mechanics
- **NPC bill naming:** Expand the tag-based name generation pool. Define naming patterns per policy area.

### Balance and Numbers
- **Calendar pacing fine-tuning** — how crowded does the mandatory schedule actually get in playtesting?
- **Headline pool expansion** — the ~30 bombshell templates and ~40 minor headline templates need full authoring

### UI and Presentation
- **The Civ I aesthetic in practice:** Screen layout, information density, drill-down screens
- **Pixel portrait style guide:** Level of detail, how static portraits convey character through design rather than animation
- **Committee markup UI:** Visual presentation of amendment proposals, voting, and tag changes during markup sessions

---

## Appendix A: First-Pass Balance Numbers

All values are starting estimates for a playable prototype. Every number will need tuning after playtesting.

### War Chest Economy

**Starting War Chest:**

| Slider Position | Majority Party | Minority Party |
|---|---|---|
| Full Loyalist | $3,500 | $3,000 |
| Loyalist-leaning | $3,000 | $2,500 |
| Middle | $2,500 | $2,000 |
| Pragmatist-leaning | $2,000 | $1,500 |
| Full Pragmatist | $1,500 | $1,000 |

**Income Sources:**

| Source | Amount | Frequency |
|---|---|---|
| Fundraiser (evening slot) | $800 base | Per event |
| Report card: standard faction A/A+ | $150/$250 | Weekly |
| Report card: Banana Lobby A/A+ | $400/$650 | Weekly |
| Report card: own party A/A+ | $300/$500 | Weekly |
| Report card: President A/A+ | $300/$500 | Weekly |

**Fundraiser Modifiers:** Insider ×1.3, Good Standing ×1.0, Thin Ice ×0.8, Outcast ×0.6. Faction ally (A+ or A) bonus: +$200. First fundraiser of week: +$100. Third+ fundraiser of week: -$200.

**Spending Costs:**

| Action | Cost | Effect |
|---|---|---|
| Campaign amplification | $400/slot | Primary reduction increased from -4 to -7 per slot |
| Host fundraiser for colleague | $1,200 | +15 to +20 sentiment |
| Contribute to party committee | $1,000 | Party grade +3 percentage points |
| Fund ad campaign on issue | $2,500 | 60% chance to nudge issue temperature one step toward Hot. Max 2 per game. |

### Primary Threat

**Defeat threshold: 70.** Primary meter exceeding 70 at a primary checkpoint ends the game.

**Starting Primary Meter:**

| Slider Position | Starting Meter |
|---|---|
| Full Loyalist | 15 |
| Loyalist-leaning | 20 |
| Middle | 30 |
| Pragmatist-leaning | 35 |
| Full Pragmatist | 40 |

**Meter Increases:**

| Source | Amount | Frequency |
|---|---|---|
| Vote against district core interest | +4 | Per vote |
| Vote against district secondary interest | +2 | Per vote |
| Cosponsor bill district hates | +6 | Per occurrence |
| Report card attack: standard faction C/D/F | +2/+4/+6 | Weekly |
| Report card attack: Banana Lobby C/D/F | +5/+8/+12 | Weekly |
| Report card attack: own party C/D/F | +4/+7/+10 | Weekly |
| Zero campaign slots this week | +3 | Weekly |
| Two consecutive weeks no campaigning | +5 (replaces +3) | Weekly |

**Meter Decreases:**

| Source | Amount |
|---|---|
| Campaign back home (base) | -4 per slot |
| Campaign back home (amplified, $400) | -7 per slot |
| Vote with district core interest | -2 per vote |
| District-friendly bill passes | -5 per occurrence |
| Campaign for colleague in their district | -3 to own meter |

**Diminishing campaign returns:** 1st slot/week: full value. 2nd: 75%. 3rd: 50%. 4th+: 25%.

### Sentiment Starting Values

**Base Sentiment by Slider:**

| Slider Position | Own Party | Opposition |
|---|---|---|
| Full Loyalist | +25 | -25 |
| Loyalist-leaning | +20 | -18 |
| Middle | +12 | -10 |
| Pragmatist-leaning | +7 | -5 |
| Full Pragmatist | +3 | -3 |

**Modifiers:** Shared core interest with player's bill: +10 per tag. Conflicting core interest: -10. Natural enemy conflict: -5. Seniority 2: -1, Seniority 3: -3, Seniority 4: -5, Seniority 5: -7.

### Scheduling Costs

| Action | Sentiment Cost |
|---|---|
| Cancel meeting before day-of | -3 |
| Cancel day-of | -5 |
| No-show | -8 |
| Cancel for mandatory event | -2 |
| Accept NPC meeting request and attend | +3 |
| Accept and cancel | -5 |
| Decline request | 0 |
| Ignore request | -1 |

### Presidential Approval

Starts at 50%. Range typically 35–65%. Popular bill signing: +3. Veto of popular bill: -5. "Approval plummets" headline: -10 to -15. Default drift toward 45% (-1 per 2 weeks above 50).

### Gossip Quality

| Player's Average Sentiment | Quality |
|---|---|
| Below -10 | Minimal — generic, no names |
| -10 to +5 | Basic — occasional names |
| +6 to +15 | Standard — names and directional info |
| +16 to +25 | Good — specific and actionable |
| +26+ | Excellent — reveals hidden information |

### Key Thresholds Quick Reference

| Metric | Value |
|---|---|
| Votes to pass | 26 of 50 |
| Votes to override veto | 34 of 50 |
| Discharge petition signatures | 26 |
| Primary defeat | 70 |
| Sentiment: Hostile | -60 |
| Sentiment: Cold | -20 |
| Sentiment: Warm | +21 |
| Sentiment: Allied | +61 |
| Burden: Lean | 0–3 |
| Burden: Routine | 4–7 |
| Burden: Heavy | 8–11 |
| Burden: Bloated | 12+ |
| Decision Engine: "Done" | +60 |
| Decision Engine: "What's in it for me?" | -19 to +19 |
| Decision Engine: "Absolutely not" | -60 |
| Promise override break | -40 Net Willingness |
| Total slots | 180 |
| Total floor votes per session | 18–23 |
| Bombshell headlines per session | 4–5 |
| NPC bills that die per session | 9–11 of 15 |
| Total bark corpus | ~839 lines across 5 files |
