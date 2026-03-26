# Hill Zoo — First-Pass Balance Numbers

All values in this document are starting estimates for a playable prototype. Every number will need tuning after playtesting. Values are set to create the intended feel described in the GDD: money should feel scarce, time should feel crushingly short in the late game, relationships should be slow to build and fast to destroy, and the primary should feel like a constant background anxiety that occasionally spikes into crisis.

---

## 1. War Chest Economy

### Design Target

The player should be able to comfortably afford 2–3 major spending actions across a full 60-day game, and afford a 4th only by sacrificing something else. A player who tries to do everything — host fundraisers for colleagues, fund their own campaign, contribute to the party, AND run an ad campaign — should run out of money by Day 40.

### Starting War Chest

| Slider Position | Majority Party | Minority Party |
|---|---|---|
| Full Loyalist | $3,500 | $3,000 |
| Loyalist-leaning | $3,000 | $2,500 |
| Middle | $2,500 | $2,000 |
| Pragmatist-leaning | $2,000 | $1,500 |
| Full Pragmatist | $1,500 | $1,000 |

The range is $1,000 (Full Pragmatist, Minority) to $3,500 (Full Loyalist, Majority). This is roughly one major spending action's worth of difference — enough to matter in the early game without being deterministic.

### Income Sources

| Source | Amount | Frequency | Notes |
|---|---|---|---|
| **Fundraiser** (evening slot) | $800 | Per event | The baseline income action. 1 slot = $800. |
| **Report card payout: Standard faction A** | $150 | Weekly (Day 1) | Per faction at A grade |
| **Report card payout: Standard faction A+** | $250 | Weekly | Per faction at A+ |
| **Report card payout: Banana Lobby A** | $400 | Weekly | |
| **Report card payout: Banana Lobby A+** | $650 | Weekly | |
| **Report card payout: Own party A** | $300 | Weekly | |
| **Report card payout: Own party A+** | $500 | Weekly | |
| **Report card payout: President A** | $300 | Weekly | Same as party tier |
| **Report card payout: President A+** | $500 | Weekly | |

**Typical weekly income for a well-aligned player (Weeks 4–8):**
- Party grade A: $300
- 2 factions at A: $300
- 1 faction at B: $0
- Banana Lobby B: $0
- Total: ~$600/week

**Maximum possible weekly income (all A+ across the board, very rare):**
$500 (party) + $250×5 (factions) + $650 (Banana) + $500 (President) = $2,900/week. This is theoretically possible but practically impossible — maintaining A+ with all factions requires voting records that are mutually contradictory.

**Realistic income across a full game:** ~$600–900/week × 10 reporting weeks (report cards don't start paying until Week 3 due to cold start) = $6,000–9,000 from report cards. Plus 5–8 fundraiser events = $4,000–6,400. **Total income: ~$10,000–15,400.**

### Spending Costs

| Action | Cost | Effect | Notes |
|---|---|---|---|
| **Campaign back home (amplified)** | $400 per campaign slot | Primary meter reduction increased from base to amplified rate (see Primary section) | Can campaign without spending money, but it's less effective |
| **Host fundraiser for colleague** | $1,200 | +15 to +20 sentiment with recipient | The premium relationship-building tool. ~8–10 of these would drain the entire game's income. |
| **Contribute to party committee** | $1,000 | Party report card grade +3 percentage points | A financial shortcut to institutional standing. Stacks, but diminishing political returns past A grade. |
| **Fund ad campaign on issue** | $2,500 | Nudges target issue temperature one step toward Hot. 60% chance of success, 40% chance of no effect. | The most expensive single action. Roughly 1/6 of total game income. Maximum 2 per game (hard cap). |

### Scarcity Curve

| Phase | Weeks | Typical Income/Week | Typical Spending | Net |
|---|---|---|---|---|
| Opening (1–3) | 3 | $800 (fundraisers only, no report cards yet) | $400–800 (1–2 campaign slots) | Slightly positive |
| Ramp-Up (4–6) | 3 | $1,200–1,500 (report cards + fundraisers) | $1,200–2,000 (colleague fundraiser + campaigns) | Tight |
| Peak (7–9) | 3 | $600–900 (less time to fundraise, fewer evening slots) | $1,500–2,500 (campaign spending spikes near Late primary) | Negative |
| Crunch (10–12) | 3 | $400–600 (almost no time to fundraise) | $500–1,000 (campaign or last-ditch spending) | Bleeding out |

The player should feel comfortable in Weeks 1–3, stretched in Weeks 4–6, anxious in Weeks 7–9, and broke in Weeks 10–12. A player who hoards money early has a war chest for the crunch. A player who spends freely on colleague fundraisers early has better relationships but an empty account when the primary hits.

---

## 2. Primary Threat

### Defeat Threshold

**Primary defeat occurs when the meter exceeds 70 at a primary checkpoint.**

Not 50 (too punishing — the player barely has room to take political risks), not 90 (too forgiving — the primary never feels threatening). At 70, a player who starts at 25–30 and takes moderate report card attacks (+8/week from hostile factions) hits the danger zone around Week 5–6 without any campaign time investment. That's the right pacing — it forces campaign attention but doesn't dominate the game.

### Starting Primary Meter

| Slider Position | Starting Meter | Rationale |
|---|---|---|
| Full Loyalist | 15 | Safe start. Party base is loyal. But deviation is punished hard. |
| Loyalist-leaning | 20 | Comfortable. Some room to maneuver. |
| Middle | 30 | Nervous from Day 1. Nobody's enthusiastic about you. |
| Pragmatist-leaning | 35 | Constant low-grade threat. Your base is skeptical. |
| Full Pragmatist | 40 | Dangerous. You're almost halfway to defeat before casting a vote. |

### Meter Changes

**Increases (things that make you electorally vulnerable):**

| Source | Amount | Frequency |
|---|---|---|
| Voting against district's core interest | +4 per vote | Per occurrence |
| Voting against district's secondary interest | +2 per vote | Per occurrence |
| Cosponsoring a bill the district hates | +6 | Per occurrence |
| Report card attack: standard faction C | +2 | Weekly |
| Report card attack: standard faction D | +4 | Weekly |
| Report card attack: standard faction F | +6 | Weekly |
| Report card attack: Banana Lobby C | +5 | Weekly |
| Report card attack: Banana Lobby D | +8 | Weekly |
| Report card attack: Banana Lobby F | +12 | Weekly |
| Report card attack: own party C | +4 | Weekly |
| Report card attack: own party D | +7 | Weekly |
| Report card attack: own party F | +10 | Weekly |
| Week with zero campaign slots spent | +3 | Weekly (checked Day 1) |
| Two consecutive weeks with zero campaigning | +5 (replaces the +3) | Weekly |

**Decreases (things that protect you electorally):**

| Source | Amount | Notes |
|---|---|---|
| Campaign back home (base, no money spent) | -4 per slot | Evening or full-day slot |
| Campaign back home (amplified, $400 spent) | -7 per slot | Evening or full-day slot. The $400 buys +3 additional reduction. |
| Voting with district's core interest | -2 per vote | Smaller than the penalty for voting against — asymmetry. |
| District-friendly bill passes (any bill, not just yours) | -5 | Per occurrence. Rewards legislative engagement. |
| Campaign for a colleague in their district | -3 to your own meter | Side effect of spending time in another district — you're still visible. |

### Primary Math Examples

**Scenario A: Full Pragmatist, Late primary (Day 45), no hostile factions.**
Starting meter: 40. Need to stay below 70 by Day 45 (9 weeks). Budget: 30 points of headroom. Even without faction attacks, +3/week for not campaigning = +27 over 9 weeks. The player MUST campaign at least once every 2 weeks just to tread water. One campaign slot per 2 weeks (base -4) barely keeps pace. This player is spending 1 of every 30 slots on campaign maintenance, which feels right — a tax, not a dominating concern.

**Scenario B: Full Loyalist, Early primary (Day 20), Claw & Fang F grade.**
Starting meter: 15. C&F attacks at +6/week. By Day 20 (4 weeks): 15 + 24 (C&F attacks) = 39 before any other factors. Safe — but only if the player doesn't vote against their district or ignore campaigning. One bad week of district-hostile votes (+4 per vote × 2 votes = +8) pushes to 47. Still safe, but two bad weeks pushes to 55+ and now the player needs 2–3 campaign slots to recover. The Loyalist's safety net is real but thin.

**Scenario C: Middle slider, Late primary, own party D grade + Banana Lobby D.**
Starting meter: 30. Party attacks +7/week, Banana +8/week = +15/week. In 4 weeks: 30 + 60 = 90. Dead. This player is in existential crisis and needs to either fix their report cards immediately or campaign every single evening slot. This is the "force of nature" design goal for the Banana Lobby — an F or D from them plus party hostility is unsurvivable without massive campaign investment.

---

## 3. Sentiment Starting Values

### Base Sentiment by Slider Position

| Slider Position | Own Party Members | Opposition Members |
|---|---|---|
| Full Loyalist | +25 | -25 |
| Loyalist-leaning | +20 | -18 |
| Middle | +12 | -10 |
| Pragmatist-leaning | +7 | -5 |
| Full Pragmatist | +3 | -3 |

### Modifiers Applied After Base

| Condition | Modifier | Notes |
|---|---|---|
| NPC shares a core interest with player's bill pro-tag | +10 | Per shared tag. Max +20 for 2 matches. |
| NPC's core interest conflicts with player's bill anti-tag | -10 | Per conflict. |
| NPC's core interest matches player's bill anti-tag's natural enemy | -5 | Weaker indirect conflict. |
| NPC seniority 2 | -1 | Mild freshman penalty |
| NPC seniority 3 | -3 | |
| NPC seniority 4 | -5 | |
| NPC seniority 5 | -7 | Senior members look down on freshmen |

### Resulting Distribution (Slim Majority, Loyalist-leaning)

With a Loyalist-leaning slider (+20 own party, -18 opposition):
- **2–4 same-party NPCs** with shared bill interests start at +30 to +40 (Warm). These are natural allies.
- **15–18 same-party NPCs** start at +15 to +25 (high Neutral to low Warm). Friendly but not committed.
- **3–5 same-party NPCs** with conflicting bill interests start at +5 to +15 (low Neutral). They're in your party but your bill bothers them.
- **3–5 opposition NPCs** with shared bill interests start at -8 to +2 (Neutral). Possible cross-aisle partners.
- **10–15 opposition NPCs** start at -18 to -10 (Cold). Standard opposition.
- **3–5 opposition NPCs** with conflicting interests start at -28 to -35 (deep Cold, approaching Hostile). Your bill is their nightmare.

Nobody starts Allied (+61 or higher). Nobody starts Hostile (-60 or lower). The most extreme starting positions are around +40 and -35. Both extremes must be earned.

---

## 4. Campaign Effectiveness Formula

```
Primary Reduction = Base Reduction + War Chest Amplification

Base Reduction = 4 (per campaign slot, no money spent)
War Chest Amplification = 3 (if player spends $400 on this campaign slot)

Total with amplification: 7 per slot
Total without: 4 per slot
```

**Diminishing returns for consecutive campaign days:**

| Campaign Slots This Week | Reduction per Slot |
|---|---|
| 1st slot | Full value (4 or 7) |
| 2nd slot | 75% value (3 or 5) |
| 3rd slot | 50% value (2 or 3.5, round to 4) |
| 4th+ slot | 25% value (1 or 2) |

The first campaign slot each week is the most efficient. A player who campaigns once per week gets 80% of the benefit of a player who campaigns three times per week — but at one-third the time cost. This discourages parking in the district and rewards strategic timing.

**Full-day campaign trip:** Spending both Morning and Afternoon on campaigning (skipping all official business) counts as 2 slots in a single day. This is a crisis move — it maxes out the weekly campaign benefit quickly but costs 2 official business slots. Reserved for the week before a primary when the meter is dangerously high.

---

## 5. Fundraiser Yield Modifiers

Base fundraiser yield is $800 per evening slot. Modifiers:

| Condition | Modifier | Notes |
|---|---|---|
| Party standing: Insider (A+) | ×1.3 ($1,040) | The party apparatus helps you fundraise |
| Party standing: Good Standing (A/B) | ×1.0 ($800) | Standard |
| Party standing: On Thin Ice (C) | ×0.8 ($640) | Donors are nervous |
| Party standing: Outcast (D/F) | ×0.6 ($480) | Nobody wants to be seen giving you money |
| Hosting with a faction ally (grade A+/A) | +$200 bonus | Faction donors show up. One bonus per fundraiser, from highest-graded faction. |
| First fundraiser of the week | +$100 bonus | Fresh donor pool |
| Third+ fundraiser of the week | -$200 penalty | Donor fatigue |

**Typical yields:**
- Good-standing player, first fundraiser of the week, one A-grade faction: $800 + $200 + $100 = $1,100
- Good-standing player, second fundraiser, no faction bonus: $800
- Outcast player, third fundraiser: $480 - $200 = $280

The Outcast fundraiser is almost not worth the slot — and that's intentional. The War Chest punishes players who alienate their party by making it harder to earn money, which makes it harder to campaign, which makes the primary more threatening. A death spiral that rewards early relationship investment.

---

## 6. NPC Bill Generation Numbers

### Active Legislator Distribution

Of the 15 active NPC legislators:
- **3 must have bills that directly conflict** with the player's bill (share an anti-tag targeting one of the player's pro-tags, or have a pro-tag the player's bill opposes)
- **2 must be natural allies** (share at least one pro-tag with the player's bill)
- **5 should touch the permanent Hot issue** (guaranteeing legislative traffic on the session's defining fight)
- **5 are independent** (drawn from NPC interests and party agendas without reference to the player's bill)

### NPC Seniority Distribution Among Active Legislators

| Seniority | Count | Effect on Momentum |
|---|---|---|
| 5 (senior) | 2 | +40 base momentum. These bills move fast. |
| 4 | 3 | +32 base momentum |
| 3 | 4 | +24 base momentum |
| 2 | 4 | +16 base momentum |
| 1 (freshman) | 2 | +8 base momentum. Long shots. |

### NPC Bill Momentum Starting Values

At game start, NPC bills begin at momentum = seniority × 8. The first advancement check (Day 5) applies all other modifiers. This means seniority-5 bills start at 40 (already at the Hearing threshold) while seniority-1 bills start at 8 (far from any threshold). Senior members' bills move first, which creates the early hearing competition the player faces.

### NPC Cosponsor Accumulation Rate

NPCs gather cosponsors off-screen at:
- Base rate: 1 cosponsor per week for bills with momentum > 30
- Dealmaker temperament: 1.5 per week (rounded, alternating 1 and 2)
- Ideologue temperament: 0.5 per week (they won't compromise to build support)
- Bills with momentum > 60: +1 additional per week (success breeds success)
- Bills with momentum < 20: 0 per week (nobody wants to cosponsor a loser)

---

## 7. Committee and Hearing Numbers

### Committee Size

Each committee has **6 members** (plus the chair = 7 total). With 50 members each sitting on 2 committees and 8 committees: 50 × 2 = 100 committee seats across 8 committees = 12.5 per committee. With the chair, that's ~13, but several members will sit on the same two committees. Adjusted: **6 regular members + 1 chair = 7 per committee.** Some members may appear on committees where their interests don't align — this is intentional (the player with a low slider gets assigned to committees they didn't choose).

### Hearing Slots and Competition

| Phase | Hearings/Week/Committee | Total Hearings Across All Committees |
|---|---|---|
| Opening (Weeks 1–3) | 1 | 8 |
| Ramp-Up (Weeks 4–6) | 1–2 | 10–14 |
| Peak (Weeks 7–9) | 2 | 16 |
| Crunch (Weeks 10–12) | 2 (+ overflow) | 16–20 |

With 15 NPC bills + the player's bill competing for hearing slots, and ~8–16 hearings per week, the committee calendar is tight but not impossible. A bill that misses its hearing slot in Week 4 can catch the next one in Week 5 — but by Weeks 8–9, overflow hearings are eating the player's free slots.

---

## 8. Floor Vote Math Verification

### Can the Player Actually Win?

With 50 members, 26 votes needed. In a Slim Majority (27–23, player's party):

**Best case (Loyalist, all own-party members vote yes):** 27 yes votes. Passes with 1 to spare. But this requires every single party member, which means zero defections — and the player's anti-tag will alienate at least 2–3 same-party members with conflicting interests.

**Realistic case:** 22–24 own-party members vote yes (3–5 defect due to interest conflicts, district pressure, or NPC deals). Player needs 2–4 cross-party votes. This requires relationship building with opposition members — the core challenge of the mid-game.

**Pragmatist path:** 18–20 own-party votes (Pragmatists start with weaker party sentiment) + 6–8 cross-party votes. More cross-aisle work, less party infrastructure.

**Omnibus path:** Player attaches to an NPC bill that already has 20+ supporters, contributing their own 3–5 locked-in allies to push past 26. The NPC author does most of the vote-gathering.

### Decision Engine Spot Check

For a "median" NPC — same-party Follower, Seniority 3, one shared interest, no conflicting interest, Neutral sentiment (+15), Whip says yes, no faction complications:

```
Interest Alignment: +15 (one shared pro-tag) × 0.7 (Follower) = +10.5
Sentiment: +15 × 0.4 × 0.8 (Follower) = +4.8
Party Pressure: +12 (Whip yes) × 2.0 (Follower) = +24
District Pressure: 0 (no district alignment or conflict) × 1.2 = 0
Faction Pressure: +4 (one aligned faction at A) = +4
Situational: +3 (shares committee)

Net Willingness: +46.3
```

Response: "I'm with you on this." That's correct — a same-party Follower with one shared interest and Whip backing should be a reliable yes, but it costs them something. Not a freebie "Done" (+60 needed), which would require either higher sentiment or stronger interest alignment.

For a cross-party Dealmaker the player has cultivated — opposition party, Seniority 2, no shared interests, sentiment at +35 (Warm, built through meetings and a colleague fundraiser), no Whip instruction, one faction conflict:

```
Interest Alignment: 0 × 0.8 = 0
Sentiment: +35 × 0.4 × 1.5 (Dealmaker) = +21
Party Pressure: 0 (no Whip instruction, cross-party) × 0.7 = 0
District Pressure: 0 × 1.0 = 0
Faction Pressure: -4 (one opposed faction at A) = -4
Situational: +10 (player cosponsored NPC's bill)

Net Willingness: +27
```

Response: "I'm leaning your way, but..." The Dealmaker needs a deal. The player has built real sentiment and has reciprocity credit, but it's not quite enough for a free yes. One counter-ask closes the gap. That feels exactly right for a cross-party ally the player has invested in.

---

## 9. Presidential Approval Rating

### Starting Value

**Presidential approval starts at 50%.** Neutral baseline.

### Fluctuations

| Event | Approval Change |
|---|---|
| Bombshell headline (positive for president) | +5 to +8 |
| Bombshell headline (negative for president) | -5 to -10 |
| President signs a popular bill (Hot issue, bipartisan support) | +3 |
| President vetoes a popular bill | -5 |
| President signs a controversial bill (party-line) | +2 own party, -3 opposition (net: depends on composition) |
| "President Gold's Approval Plummets" headline | -10 to -15 |
| Default drift toward 45% | -1 per 2 weeks if above 50 |

**Range across a game:** Typically 35–65%. Rarely drops below 30 or rises above 70.

**Mechanical impact reminder:** Presidential approval modifies District Pressure for all NPCs via the formula `District Pressure bonus = Presidential Stance × (Approval / 25)`. At 50% approval, the multiplier is 2. At 75%, it's 3. At 25%, it's 1. This means a popular president's endorsement is worth +6 to District Pressure per NPC (at stance +2, approval 75%), while an unpopular president's endorsement is worth only +2.

---

## 10. NPC-to-NPC Deal Generation

### Frequency

| Phase | Deals Generated/Week | Notes |
|---|---|---|
| Opening (Weeks 1–3) | 1–2 | Few bills in play, few deals to make |
| Ramp-Up (Weeks 4–6) | 2–3 | Bills hitting committee, deals start forming |
| Peak (Weeks 7–9) | 3–4 | Maximum deal activity |
| Crunch (Weeks 10–12) | 2–3 | Fewer bills alive, but remaining deals are high-stakes |

**Total deals across a session: ~25–35.** Each locks one vote. At any given time, 8–15 deals are active (older ones resolve as bills pass or die).

### Deal Value Thresholds

When an NPC evaluates whether to break an existing NPC-to-NPC deal for the player's offer:
- Player sentiment must be +40 or higher (Warm) with the NPC
- OR the player's offer must address a higher-priority need than the existing deal (evaluated by the NPC's temperament priority stack)
- Breaking an NPC-to-NPC deal costs -15 sentiment between those two NPCs

---

## 11. Gossip Quality Scaling

### Average Sentiment Thresholds

| Player's Average Sentiment Across All 49 NPCs | Gossip Quality |
|---|---|
| Below -10 | **Minimal.** Generic, low-value gossip. Names rarely included. "Someone on the Agriculture committee is unhappy." |
| -10 to +5 | **Basic.** Occasionally names an NPC or faction. "The Grazing Council is mobilizing against something." |
| +6 to +15 | **Standard.** Names NPCs and gives directional information. "The rattlesnake struck a deal with the coyote." |
| +16 to +25 | **Good.** Specific and actionable. "The rattlesnake promised the coyote her vote on Bill 9 in exchange for cosponsorship." |
| +26 or higher | **Excellent.** Reveals hidden information. "The President is privately opposed to Freshwater legislation." |

A player who maintains broad positive relationships (average sentiment +15–20) gets meaningfully better intelligence than a player who has a few strong allies and many enemies (average might be +5 due to the enemies dragging it down). This rewards the Pragmatist playstyle — broad shallow relationships produce better gossip than narrow deep ones.

---

## 12. Scheduling and Cancellation Costs

### Meeting Booking

| Action | Sentiment Cost | Notes |
|---|---|---|
| Book a tentative meeting | 0 | Free to schedule |
| Cancel before day-of | -3 | Minor annoyance |
| Cancel day-of | -5 | "You're wasting my time" |
| No-show (booked but didn't attend) | -8 | Serious disrespect |
| Cancel to attend a mandatory event | -2 | Reduced penalty — NPCs understand obligations |

### NPC Meeting Request Response

| Response | Effect |
|---|---|
| Accept and attend | +3 sentiment (showed up), plus meeting outcomes |
| Accept and cancel | -5 sentiment (worse than never accepting) |
| Decline | 0 sentiment (no relationship change, but NPC may not ask again for 10+ days) |
| Ignore (let it expire) | -1 sentiment (slight snub) |

---

## 13. Whip Instruction Frequency

| Issue Temperature | Whip Issues Instructions? | Notes |
|---|---|---|
| Bill touches permanent Hot issue | Always | Every floor vote on the defining issue |
| Bill touches non-permanent Hot issue | Usually (80% chance) | Leadership occasionally lets members vote freely |
| Bill touches only Lukewarm issues | Rarely (20% chance) | Only if the bill is politically significant for other reasons |
| Bill touches only Cold issues | Never | Not worth leadership's attention |

**Whip instruction accuracy:** The Whip's instruction reflects the party's official position, not a prediction of what will pass. Defying the Whip costs -15 to -20 sentiment with the Whip and moves the player's party report card in the wrong direction. Complying earns +3 sentiment with the Whip.

---

## 14. Quick Reference: Key Thresholds

| Metric | Value | Source |
|---|---|---|
| Votes to pass a bill | 26 of 50 | Bill Lifecycle |
| Votes to override a veto | 34 of 50 | Presidential Action |
| Signatures for discharge petition | 26 | Bill Lifecycle |
| Primary defeat threshold | 70 | Primary Threat |
| Sentiment: Hostile threshold | -60 | Sentiment System |
| Sentiment: Cold threshold | -20 | Sentiment System |
| Sentiment: Warm threshold | +21 | Sentiment System |
| Sentiment: Allied threshold | +61 | Sentiment System |
| Burden rating: Lean | 0–3 | Budget Scoring |
| Burden rating: Routine | 4–7 | Budget Scoring |
| Burden rating: Heavy | 8–11 | Budget Scoring |
| Burden rating: Bloated | 12+ | Budget Scoring |
| Decision Engine: "Done" threshold | +60 | NPC Decision Engine |
| Decision Engine: "What's in it for me?" | -19 to +19 | NPC Decision Engine |
| Decision Engine: "Absolutely not" threshold | -60 | NPC Decision Engine |
| Promise break: override threshold | -40 Net Willingness | Vote Decision Function |
| Total time slots in a session | 180 | Action Economy |
| Total floor votes per session | 18–23 | Calendar Pacing |
| Bombshell headlines per session | 4–5 | Issue Temperature |
| NPC bills that die per session | 9–11 of 15 | NPC Autonomous Behavior |
| Bark corpus: core barks | 588 | Bark System |
| Bark corpus: total lines | ~726 | Bark System |

---

## 15. Balance Gut-Check Scenarios

### "Standard Game" — Slim Majority, Loyalist-leaning, Early Primary

**Day 1:** Starting war chest $3,000. Primary meter 20. 22 NPCs start in Warm or high Neutral (same party + interest overlap). 5 NPCs start Cold (opposition + conflicting interests). Permanent Hot issue is Predation & Defense. Player's bill is pro-Agriculture, pro-Freshwater, anti-Predation — touches the permanent Hot issue, meaning Whip attention on every relevant vote.

**Day 20 (Early primary):** If player campaigns once per week (4 slots spent) and has report card income of ~$600/week starting Week 3: primary meter should be around 25–35 (safe below 70). War chest around $3,500–4,500. Bill should be in committee or just past. Player has had ~40 free official slots for meetings and relationship building.

**Day 40:** Bill should be through committee, scored by Budget, and in the Rules/Speaker queue. 5–7 NPC bills have died. Floor votes happening twice per week. Player has ~15–20 committed yes votes and needs to close 6–8 more. War chest around $2,000–3,000 (spent on colleague fundraisers and campaigns).

**Day 55:** Floor vote imminent or just happened. If passed, waiting on President. If still in queue, player is in crisis mode lobbying the Speaker. War chest nearly empty. Calendar almost completely mandatory events.

### "Hard Mode" — Slim Minority, Pragmatist-leaning, Late Primary

**Day 1:** Starting war chest $1,500. Primary meter 35. Few allies above Neutral. Need 6+ cross-party votes. No committee chairs in your party. Bill likely assigned to hostile committee.

**Day 20:** Early primary clears — some members become lame ducks (exploitable). Player's primary is Day 45, meter probably around 45–50 (faction attacks have been accumulating). Urgent need to campaign. Bill may still be stuck waiting for a hearing in hostile committee.

**Day 35:** Player should be desperately pursuing either: (a) discharge petition to bypass committee, (b) omnibus merger with a friendly NPC bill, or (c) an alliance with a sympathetic opposition committee chair. All three cost enormous political capital. War chest nearly empty. Primary approaching.

**Day 45 (Late primary):** Survive or die. If survived, player has 15 days of freedom but bill may not be through committee yet. Omnibus becomes the most likely victory path.

These scenarios verify that the numbers create the intended game feel at each difficulty level. The Standard game should feel achievable but challenging. The Hard Mode game should feel desperate but theoretically winnable.
