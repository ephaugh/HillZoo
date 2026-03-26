markdown

# Hill Zoo — Game Design Document

## Overview

Hill Zoo is a political strategy simulator set in a fictional 50-member unicameral congress of animals. The player is a freshman member of congress attempting to pass a single piece of legislation within a 60-day congressional session. The game draws heavily from real U.S. congressional mechanics — committee systems, party politics, special interests, and electoral pressure — wrapped in an animal-themed setting that makes dense political systems approachable and memorable.

**Win Condition:** The player's bill passes out of committee, survives a floor vote, and is signed into law by President Gold (a goldfish).

**Lose Conditions:** The player's bill dies at any stage of the legislative process, or the player is defeated in a primary election.

**Aesthetic:** Civilization 1-inspired pixel art with a modernized UI. Detailed pixel portraits for all 49 NPC congress members, the President, and key staffers. Information-dense but readable interface.

---

## Game Creation

When starting a new game, the player makes a series of interconnected choices that function as both character creation and difficulty selection. The randomized elements (party agendas, faction minor positions, member profiles) ensure high replayability, while the player's choices determine their strategic starting position.

### Step 1 — Choose Your Species

Cosmetic only. The player selects from 20–30 animal species, each with a unique pixel portrait. No mechanical impact, but this is the player's identity for the entire game — other members reference it, and it appears in all interactions.

### Step 2 — Choose Your Party

**Feralist** or **Communalist.** Before committing, the player sees both parties' randomized policy agendas for this session. Each party has 2–3 strong policy positions (pro or anti various policy areas) and is neutral on the rest. Agendas are randomized each game — the parties may share one area of agreement, be ambivalent on similar things, and be completely at odds on others. The only constant is that a two-party system exists.

### Step 3 — Set the Loyalist–Pragmatist Slider

A continuous slider that determines the player's political identity within their party. This single input cascades across every system in the game:

- **Committee Assignments:** Loyalists get top picks. Pragmatists get third or fourth choices. Mid-slider gets one good committee, maybe not two.
- **Starting Relationships:** Loyalists start warm with their party and cold/hostile with the opposition. Pragmatists start near-neutral with everyone. Mid-slider creates a lukewarm mix — nobody's first call, nobody's enemy.
- **Primary Vulnerability:** Loyalists are initially safer but face catastrophic backlash if they ever deviate from the party line. Pragmatists face a constant low-grade threat that doesn't spike as sharply from individual deviations.
- **Special Interest Dynamics:** Loyalists attract more aligned lobby support but are punished harder for defection. Pragmatists get less support overall but can court either side's groups more freely.
- **Whip Interactions:** A Loyalist defying the Whip is a serious offense. A Pragmatist defying the Whip is expected. But the Whip comes to Pragmatists when they need cross-aisle votes, creating leverage opportunities.
- **District Tolerance:** A Loyalist's district expects party-line voting and punishes deviation. A Pragmatist's district expects results and punishes blind party loyalty.

### Step 4 — Choose Party Balance

Determines the ratio of seats held by each party in congress. Functionally serves as a difficulty selector.

| Setting | Split | Votes to Pass | President's Party | Difficulty |
|---|---|---|---|---|
| Large Majority | 30–20 | 26 | Player's party | Standard |
| Slim Majority | 27–23 | 26 | Player's party | Challenging |
| Split Evenly | 25–25 | 26 | Coin flip | Expert |
| Slim Minority | 23–27 | 26 | Opposing party | Brutal |
| Large Minority | 20–30 | 26 | Opposing party | Legendary |

- **Large Majority:** Player's party controls all committees, leadership, and the Rules Committee. Main obstacle is intra-party division. Fewest external enemies, most internal politics.
- **Slim Majority:** Player's party controls infrastructure, but every vote is razor-thin. Individual holdouts gain enormous leverage. Cannot afford more than 1 defection.
- **Split Evenly:** Chaotic. Committee assignments are negotiated, leadership is contested, every vote requires bipartisan work. Pragmatist's dream, Loyalist's nightmare.
- **Slim Minority:** Player's bills go through committees chaired by the opposition. Cross-aisle votes are required for everything. The Pragmatist slider is nearly mandatory.
- **Large Minority:** Hard mode. Player needs to peel off 6+ opposition members. Bills will be buried in committee without sympathetic chairs or discharge petitions. Special interests become critical allies.

**First-time players** are defaulted to Slim Majority, Loyalist-leaning, Early primary.

### Step 5 — Craft Your Bill

The player selects two "pro" tags and one "anti" tag from the available policy areas. The game displays which factions and party positions align or conflict with the chosen tags, allowing an informed strategic bet.

**Policy Areas (used as bill tags and faction/committee domains):**
- Bananas
- Agriculture & Foraging
- Habitat & Burrows
- Migration & Transit
- Predation & Defense
- Freshwater & Marine Affairs
- Conservation

### Step 6 — Choose Primary Date

**Early Primary (Day 20):** Face voters before establishing a legislative record. Campaign on promises and party loyalty. If you survive, 40 days of legislative freedom with no electoral pressure. Risk: fewer allies and accomplishments to defend yourself with.

**Late Primary (Day 45):** Campaign on real accomplishments. More time to build a record. Risk: the electoral and legislative climaxes may collide — your bill might approach a floor vote exactly when you need to be campaigning.

### Step 7 — Set Your District

The game generates a district profile that is **partially aligned** with the player's bill — it shares one pro-tag but has its own independent interests that may pull the player in uncomfortable directions. The player sees the profile and may reroll once. A perfectly aligned district cannot be custom-built.

**District Profile includes:** Two strong interest preferences and one hostility. These determine what votes raise or lower the player's primary threat meter.

---

## Core Systems

### System 1 — The Action Economy

The fundamental resource of the game is **time.** Every strategic decision flows through the scheduling system.

**Structure:** Each day has 3 time slots — Morning, Afternoon, Evening. A 60-day session provides **180 total actions** across the game.

**Action Types:**

**Mandatory Actions** (forced onto calendar, consequences for missing):
- Committee hearings for committees you sit on
- Scheduled floor votes
- Party caucus meetings (~1 per week)

Mandatory actions consume roughly one-third of total slots over the session.

**Scheduled Actions** (booked in advance, adjustable until day-of):
- One-on-one meetings with other members
- Meetings with the White House liaison / Chief of Staff
- Meetings with special interest factions
- Fundraisers

**Flexible Actions** (can be done in any open slot without pre-booking):
- Whipping votes (surveying where members stand)
- Campaigning back home
- Reviewing the legislative calendar

**Scheduling Rules:**
- Future slots can be booked and adjusted flexibly up until the day-of.
- **Tentative vs. confirmed commitments:** Booking a meeting puts it on both parties' calendars as tentative. Canceling before day-of incurs a minor relationship hit. Canceling day-of incurs a larger hit. No-showing incurs a significant hit.
- **Overbooking** is allowed as a risky strategy — the player can tentatively book two things in the same slot, knowing they'll have to cancel one.
- **Forced events create dilemmas:** A mandatory floor vote announced for tomorrow may collide with a crucial scheduled meeting.
- **Evening slots** have a different flavor — dinners, receptions, informal relationship-building. More effective at building sentiment but cannot be used for official actions (voting). Campaigning back home typically consumes an evening or a full day for serious district trips.

**Design Goal:** A "good" turn accomplishes two things advancing different goals. A "great" turn finds a single meeting that serves double duty. The game rewards players who identify these overlaps.

### System 2 — Sentiment

The hidden numerical backbone of every relationship in the game.

**Scale:** -100 to +100 per NPC, never displayed as a number.

**Display Tiers:**

| Tier | Range | Behavior |
|---|---|---|
| Hostile | -100 to -60 | Actively works against you. Won't take meetings. May sabotage your bills. |
| Cold | -59 to -20 | Won't do favors. Gives minimal information. Requires lopsided deals. |
| Neutral | -19 to +20 | Open to interaction. Evaluates requests purely on merit. |
| Warm | +21 to +60 | Willing to do reasonable favors. Shares information. Gives generous margins on trades. |
| Allied | +61 to +100 | Will stick with you through moderate pressure. Takes slightly unfavorable deals on trust. |

**Starting Sentiment** is determined by three factors:
- **Party Alignment:** Same-party bonus, cross-party penalty, scaled by Loyalist–Pragmatist slider. Full Loyalist: ~+25 own party, ~-25 opposition. Full Pragmatist: ~+5 own party, ~-5 opposition.
- **Interest Overlap:** +10 for each shared core interest with the player's bill tags. -10 for each conflicting core interest.
- **Seniority Gap:** Senior members start mildly cold toward freshmen (~-5). Overcome through interaction.

Most NPCs start in the Neutral band. A few same-party allies may start Warm. A few cross-party opponents may start Cold. Nobody starts Allied or Hostile.

**Earning Sentiment:**

*Small Shifts (±3 to ±8):*
| Action | Shift |
|---|---|
| Voting with their interests on any bill | +3 to +5 |
| Voting against their interests | -3 to -5 |
| Attending same committee / participating | +1 to +2 per event |
| Proactive support offer (no ask attached) | +5 to +8 |
| Canceling a meeting | -3 to -5 (scales with lateness) |

*Medium Shifts (±10 to ±20):*
| Action | Shift |
|---|---|
| Keeping an explicit vote promise | +10 to +15 |
| Cosponsoring their bill | +10 to +15 |
| Completing a requested favor | +12 to +18 |
| Voting against their bill while Neutral+ | -10 to -15 |
| Refusing a direct request | -5 to -10 |

*Large Shifts (±20 to ±40):*
| Action | Shift |
|---|---|
| Breaking an explicit promise | -25 to -35 |
| Attaching a hostile amendment to their bill | -20 to -30 |
| Whipping votes / spending multiple slots to save their bill | +20 to +30 |
| Campaigning for them in their district before a primary | +25 to +35 |
| Warning them about a real threat | +15 to +25 |

**Asymmetry Principle:** Negative shifts are roughly **twice as impactful** as positive shifts of the same category. Building trust from Neutral to Warm takes 5–8 positive interactions. Destroying it takes one betrayal.

**Floor/Ceiling Effects:** Sentiment changes are less impactful at the extremes. A Hostile member doesn't get much more hostile from one more slight. An Allied member has resilience — one bad vote cracks but doesn't destroy the relationship. The Neutral band is the most volatile.

**Sentiment Decay:** Sentiment slowly drifts toward a baseline determined by starting factors (party, interests, seniority) if the player doesn't maintain the relationship. Decay rate: ~1–2 points per week of no interaction. Same-party members decay slower. Cross-party members decay faster. Allied sentiment decays slowest; Warm decays fastest.

**NPC-to-NPC Sentiment** also exists in simplified form, tracking party affiliation, committee overlap, and past voting alignment. This matters when asking Member A to pressure Member B — it only works if A has leverage over B.

### System 3 — Member Profiles

Each of the 49 NPC congress members has a fixed profile generated at game start.

**Profile Components:**
- **Species:** Cosmetic but memorable. Players remember "the alligator who blocked my bill" or "the parrot who never flipped."
- **District Type:** Determines primary electorate priorities.
- **Party:** Feralist or Communalist.
- **Seniority:** 1–5 scale. Higher seniority = more influence, better committees, and a mild initial cold shoulder toward freshmen.
- **Core Interests (2):** Policy areas they care deeply about. They will almost always vote aligned with these.
- **Flexible Interests:** Policy areas where they can be persuaded with sufficient incentive.
- **Temperament:** Hidden trait governing behavior under pressure. The player never sees the label but can infer it through observation.

**Temperament Types:**

| Type | Priority Stack | Behavior |
|---|---|---|
| **Ideologue** | Core Interests → District → Relationships → Party | Predictable, immovable on convictions, granite-reliable once committed. Will vote convictions even at personal cost. |
| **Follower** | Party Loyalty → District → Core Interests → Relationships | The Whip's soldiers. Vote as leadership directs unless reelection is directly threatened. Flip them by getting leadership's blessing or proving the vote hurts their district. |
| **Dealmaker** | Relationships → District → Core Interests → Party | Transactional. Accumulate and trade IOUs. Easiest to negotiate with, but unreliable — a better offer can flip them. |
| **Opportunist** | District Survival → Influence → Relationships → Core Interests | Weathervanes. Read the room and follow momentum. Jump on winning bills, abandon struggling ones. Useful allies in the endgame, unreliable before. |

### System 4 — Bill Lifecycle

The player's bill follows a fixed path with branching failure points. Failure at any stage is potentially game-ending for that bill.

**Stage 1 — Referral**
The bill is assigned to one or two committees based on its policy tags. The player does not control this. If the bill goes to a committee the player sits on, that's a significant advantage. If it goes to a committee chaired by someone hostile, trouble begins immediately.

**Stage 2 — Getting a Hearing**
The committee chair decides whether to schedule a hearing. A friendly chair schedules quickly. A hostile chair buries the bill indefinitely.

*Player levers:*
- Build sentiment with the chair directly.
- Get party leadership to pressure the chair.
- **Discharge petition** (last resort): Requires 26 signatures from the full body. Forces the bill to the floor, bypassing committee entirely. Makes the chair a permanent enemy. Politically expensive — signers are publicly defying institutional norms.

Most first-third gameplay should focus on clearing this gate.

**Stage 3 — Committee Markup**
Committee members debate and amend the bill. Each committee member may propose one amendment (adding or changing a policy tag). Amendments are voted on by the committee.

*Player actions during markup:*
- Lobby members before markup to propose friendly amendments or vote down hostile ones.
- Quick sidebar negotiations during the markup itself — compressed, hurried, risky.
- Accept or fight amendments that change the bill's identity.

**Critical:** Amendments that help in committee might hurt on the floor or with the player's district. The bill's policy tags can shift here, with cascading consequences.

**Stage 4 — Committee Vote**
Simple majority of the committee. If it fails, the bill is dead. If it passes, the bill moves to the Rules Committee.

**Stage 5 — Rules Committee**
The Rules Committee chair sets terms for floor debate:
- **Open Rule:** Any member can propose amendments on the floor. Risky — poison pills and hostile riders incoming.
- **Closed Rule:** No amendments. Straight up-or-down vote. Safer, but harder to secure.
- **Modified Rule:** Specific pre-approved amendments only. A negotiated middle ground.

Relationship with the Rules chair matters enormously. Party leadership can also pressure for favorable rules.

**Stage 6 — Floor Debate and Vote**
All 50 members vote. 26 votes required to pass. This is where the whip count pays off. Members may flip under last-minute pressure. The Whip may work for or against the player. Surprises happen.

**Stage 7 — Presidential Action**
President Gold has three options:
- **Sign:** The player wins.
- **Veto:** The player may attempt a **veto override** (requires 34 votes — two-thirds supermajority, nearly impossible) or **amend and resubmit** (brutal time crunch with the calendar running out).
- **Pocket Signature:** The President does nothing for a set number of days and the bill becomes law automatically. A quiet, anticlimactic win.

**Drafting a Second Bill:** If the first bill dies, the player can draft a new one. But the clock is against them, relationships are burned, and time is spent. This should feel like a desperate pivot, not a routine option.

### System 5 — Primary Threat

The player has a **primary health meter** from 0 (safe) to 100 (defeated).

**Primary Check Dates:**
- **Early Primary:** Day 20
- **Late Primary:** Day 45
- Each member (player included) is assigned Early or Late. The player chooses theirs during game creation.

If the meter exceeds a threshold at the player's primary date, they lose their seat and the game ends.

**Meter Increases:**
- Voting against district core interests
- Special interest campaigns against you
- Insufficient time spent campaigning back home
- Cosponsoring or supporting bills the district opposes

**Meter Decreases:**
- Voting with district interests
- Campaigning back home (costs time slots)
- Allied special interest support
- Bringing home a "win" — getting any bill the district likes passed, even someone else's

**District Profile:** Generated at game start. Two strong interest preferences, one hostility. Partially aligned with the player's bill but not perfectly — some of the player's legislative agenda may offer no electoral benefit.

**NPC Primaries:** Other members also face primaries. After the Early Primary date (~Day 20), roughly half the body has either survived (free agents with reduced electoral pressure) or lost (lame ducks — unpredictable, ungovernable, potentially useful cheap allies whose votes still count but whose endorsements are worthless).

**Lame Duck Members:** Members who lose their primary remain in congress until session's end. They have no electoral pressure and may vote their conscience, settle grudges, or become free agents. Cultivating lame ducks is a viable desperation strategy.

### System 6 — Special Interests / Factions

Six factions operate in each game. Five standard factions plus the Banana Lobby.

#### The Five Standard Factions

Each has 1 permanent Major Pro, 1 permanent Major Anti, 1 randomized Minor Pro, and 1 randomized Minor Anti. Permanent positions define their identity across all games. Randomized positions create unpredictable alliances each playthrough.

| Faction | Major Pro (Permanent) | Major Anti (Permanent) | Minor Pro | Minor Anti |
|---|---|---|---|---|
| **Timber Union** | Habitat & Burrows | Conservation | Random | Random |
| **Grazing Council** | Agriculture & Foraging | Predation & Defense | Random | Random |
| **Migratory Compact** | Migration & Transit | Habitat & Burrows | Random | Random |
| **Claw & Fang Caucus** | Predation & Defense | Agriculture & Foraging | Random | Random |
| **Watershed Alliance** | Freshwater & Marine Affairs | Migration & Transit | Random | Random |

**Permanent Conflict Lines:**
- Timber Union vs. Migratory Compact (building vs. movement)
- Grazing Council vs. Claw & Fang Caucus (prey vs. predator)
- Watershed Alliance vs. Migratory Compact (water stability vs. free movement)

The Migratory Compact has two permanent enemies, making alliance with them high-risk, high-reward.

**Faction Power Levels** are randomized within a range each game. 1–3 factions are "dominant" (high treasury, more influence); the rest are weaker.

**Standard Faction Behavior:**
- Approach the player early if the player's bill aligns with their interests.
- Offer support: campaign help (lowers primary meter), intelligence (reveals hidden information), and pressure (lobby other members on the player's behalf).
- In exchange, demand the player's vote on other legislation serving their interests.
- Hostile factions fund primary challengers and lobby members to oppose the player's bill.
- Can be neutralized through meetings and finding common ground, but this costs time and may require bill modifications.

#### The Banana Lobby

A singular, monolithic economic force. Not a political faction — a force of nature.

**Agenda:** Exclusively Pro-Banana. No other political positions. Anything anti-Banana draws their attention.

**Unique Mechanical Differences from Standard Factions:**

- **Doesn't approach the player.** The player must request meetings with them, and the Lobby may decline unless the player's bill is relevant to banana interests. Getting a meeting feels like getting a meeting with the President.
- **Has no enemies, only interests.** Cordial with everyone because everyone is afraid of them. Doesn't engage in factional warfare. Watches the legislative calendar and acts when banana interests are at stake.
- **Disproportionate intervention.** Treasury roughly equal to the other five factions combined. Campaign attacks cause massive primary meter spikes. Endorsements dramatically lower primary threat and signal to other members that the player is serious.
- **The Silent Chill Effect.** Members will abstain or quietly vote yes on banana-friendly legislation rather than draw attention. Anti-Banana bills struggle to find cosponsors — members decline with unique messaging ("I agree with you but I can't be seen on this") rather than the standard "I disagree."
- **Hidden trigger issues.** Each game, the Banana Lobby has 1–2 issues that aren't obviously banana-related but provoke intervention (a river critical to banana transport, labor policy affecting banana workers). The player is never quite sure what will awaken them.
- **Beatable but barely.** A broad enough coalition, careful timing, presidential support, or a distracted Lobby can overcome them. Defeating the Banana Lobby should feel legendary. Most games, smart players simply avoid touching banana interests.

### System 7 — The Information Game

The player should never have complete information. Replayability and tension depend on uncertainty.

**Hidden or Partially Hidden Information:**
- Exact sentiment scores (visible only as tiers)
- How other members will actually vote (whip counts are estimates, not guarantees)
- The President's full policy preferences (partially revealed through effort)
- What amendments other members are planning
- Whether a special interest is about to run a campaign against you
- Your primary opponent's actual support level
- NPC temperament types (inferred through observation, never labeled)

**Information-Gathering Actions:**
- One-on-one meetings reveal a member's likely vote and current concerns.
- Whip actions survey 5–8 members quickly but with less accuracy.
- White House liaison meetings reveal one presidential preference.
- Gossip system provides passive intelligence (see below).

**Surprises:** A member thought to be a safe vote flips due to off-screen faction pressure. A committee chair suddenly schedules your hearing because they need a favor. The President's approval rating drops. These are driven by NPC-to-NPC interactions, not random — but they should feel like the ground shifting.

#### Gossip System

A rolling log of the 15 most recent intelligence notifications. Old gossip disappears permanently. Gossip triggers only during mandatory events (committee hearings, floor sessions, party caucus meetings) — 1–2 items per event, yielding roughly 5–8 items per in-game week.

**Design Principle:** Each gossip item is **true but incomplete.** It reveals a real piece of hidden information without full context.

**Example Gossip Items:**
- "The fox was seen leaving the Banana Lobby's offices." *(He's dealing with them — but what was discussed?)*
- "The owl told three members she's voting no on Bill 14." *(Her position is known — but can she be flipped?)*
- "The Claw & Fang Caucus is pooling funds for a primary challenge." *(Someone's getting targeted — but who?)*
- "Committee Chair Tortoise is considering scheduling a hearing on your bill." *(Actionable — shore up that relationship now.)*
- "The Whip is furious about last week's defections." *(Party discipline is tightening.)*

**Gossip Quality** scales with the player's average sentiment. Well-liked players receive more specific, actionable intelligence. Players with low average sentiment get generic gossip.

---

## Member Interactions

### Meeting Structure

Every one-on-one meeting follows a three-phase flow.

**Phase 1 — The Read**
Before the player speaks, the game displays a status readout based on current knowledge: attitude tier, known interests, committee seats, and any outstanding business (unfulfilled promises in either direction). First meetings with unknown members show minimal information. Repeated interaction reveals more.

**Phase 2 — The Ask**
The player constructs a request using a verb + object selection system. Available objects change based on the selected verb.

| Verb | Objects / Branches | Purpose |
|---|---|---|
| **"I need your vote..."** | Select a bill → vote yes / vote no / abstain | Direct vote solicitation. Most common ask. |
| **"I need your cosponsorship on..."** | Select a bill | Higher stakes than a vote — cosponsorship is public. NPC weighs visibility risk (Banana Lobby chill effect applies here). |
| **"I need help with..."** | Getting a hearing scheduled / A meeting with [NPC] / The Rules Committee / The President | Asking the NPC to spend their political capital on your behalf. Big ask, usually requires a trade. |
| **"I want to discuss..."** | A policy area / A specific bill / A faction / Another member | Information-gathering. No political cost. Quality depends on NPC knowledge, sentiment, and temperament. Free but uses a time slot. |
| **"I want to offer..."** | Your vote / Your cosponsorship / Help pressuring a colleague / Primary campaign support | Proactive goodwill-building. No ask attached. NPC files it away, sentiment increases. |
| **"I want to warn you about..."** | A faction is targeting you / Leadership is unhappy / Threat intelligence | Can be genuine or a bluff. NPC evaluates trust. True warnings that prove correct: big sentiment boost. Discovered lies: devastating sentiment hit. |

**Phase 3 — The Offer**
Triggered when an NPC responds "what's in it for me?" or when the player anticipates resistance. The player constructs a paired offer using the same verb-object system pointed at themselves: "I'll [action] if you [action]."

NPC evaluates trades by weighing **value received** vs. **cost incurred**, filtered through their priority stack and current sentiment toward the player. Allied members give generous margins. Neutral members need clearly favorable terms. Cold members demand lopsided deals. Hostile members won't deal.

### NPC Response Spectrum

| Response | Meaning | Player Implication |
|---|---|---|
| **"Done."** | Immediate agreement, no conditions. Ask aligned with their interests anyway. | You didn't need to spend a meeting on this — could have saved it for a harder ask. |
| **"I'm with you on this."** | Agreement, but signaling it costs them something. | Implicit IOU created. They'll come back expecting reciprocity. |
| **"I'm leaning your way, but..."** | Persuadable, not there yet. Names a specific concern. | Tells you what obstacle to remove — an amendment, a Whip release, a district concern. |
| **"What's in it for me?"** | Open to a deal, won't do it free. | Triggers Phase 3. Their counter-ask reflects their own current needs. |
| **"I can't."** | Unwilling now, door not closed. Explains why. | Work on underlying conditions and try again later. |
| **"No."** | Flat refusal. Interests too opposed or sentiment too low. | Don't push further — it'll make things worse. Reassess the relationship. |
| **"Absolutely not, and..."** | Hostile refusal with consequences. May alert Whip, warn others, actively oppose you. | Triggered by offensive asks. Learn to read the room. |

### Counter-Ask Mechanic

When an NPC says "what's in it for me," they make a **specific demand** driven by their own current needs. Examples: "Cosponsor my conservation bill" / "Skip a committee vote to campaign with me in my district" / "Accept a pro-Predation amendment to your bill." Counter-asks should sometimes be genuinely uncomfortable — the best deals are ones where the player thinks "this helps my bill but it costs me something real."

### Quick Interactions

Not every interaction requires a full time slot. **Quick interactions** occur passively during mandatory events — a whispered exchange during a committee hearing, a sidebar on the floor. Limited in scope (no complex negotiations), free in time cost. 1–2 per mandatory event, semi-random based on who's nearby. The core principle is that these use the same verb-object interaction system as full meetings, but with constraints that make them feel distinct. They're shorter, less predictable, and you don't always get to choose who you're talking to.

**Committee markup sidebars:** During active markup sessions, quick real-time negotiations with other committee members are possible — "vote down this amendment and I'll support yours." Compressed, hurried, risky.

What Makes Them Different From Full Meetings
Scope limits. In a quick interaction, you get one exchange — one ask or one offer, and the NPC's response. No back-and-forth negotiation. No counter-ask phase. If the NPC says "what's in it for me," you can make one offer, but if they don't accept, the conversation is over with a natural "let's schedule something." You can't drill deeper. This keeps them fast and prevents them from replacing scheduled meetings.
Reduced information in the Read phase. A full meeting gives you a detailed status readout. A quick interaction gives you just their attitude tier and maybe one piece of context — "she seems distracted" or "he looks like he's in a good mood." Less preparation, more gut instinct. You're reading body language in a hallway, not sitting down with a briefing sheet.
No promise ledger entries for vague commitments. If a member says "yeah, I'll think about supporting your bill" in a hallway, that's not a tracked promise. Only explicit "done" or "I'm with you" responses create ledger entries. This means hallway agreements are softer — useful but not bankable. It rewards the player who follows up a promising quick interaction with a scheduled meeting to lock down the commitment.
Trigger Types
There should be four distinct flavors of quick interaction, each with its own feel and strategic use.
The Ambush. An NPC targets you with a specific want. This triggers during any mandatory event or between scheduled items. The NPC approaches you — you don't choose them. They open with an ask: "I need your vote on Bill 9" or "Are you really cosponsoring that anti-Freshwater bill?" You respond using the same verb-object system but from a reactive position. This is the game simulating the reality that other politicians have agendas too and won't wait for you to schedule a meeting. The ambush is also how the Whip might informally pressure you outside of official channels, how a faction-aligned member might deliver a veiled threat, or how an ally might tip you off about something urgent. The player's options should always include a polite deflection — "let's get something on the calendar" — which costs nothing but also gains nothing. Sometimes deflection is the right call because you're not prepared, but sometimes the NPC needed an answer now and deflecting means losing the opportunity.
The Early Bird. Before a committee hearing or floor session officially starts, the player arrives early and sees 2–3 other members already in the room. The game presents a prompt like "You arrive to find a few colleagues already seated." The player picks one to approach or skips the opportunity entirely. This rewards players who pay attention to who sits on which committee — if you know the owl is on Agriculture & Foraging and you need her vote, seeing her in the early bird list before a hearing is a chance to make a quick pitch. The shortlist should be weighted toward members of that committee or members relevant to the day's agenda, with maybe one wild card.
The Hallway Encounter. Between any two scheduled items, there's a chance (maybe 40–50% per transition) of bumping into someone. The game presents 1–2 members with a prompt like "You spot a colleague in the corridor" or "A fellow member falls into step beside you." These are the most random and serendipitous interactions. The shortlist is drawn from the full congress, weighted slightly toward members you've interacted with before (they recognize you, they'd stop to chat) and members on the same floor of the building (same committee wing, same party caucus area). The hallway encounter is where you might run into a cross-party member you'd never schedule a meeting with but who, in a casual hallway chat, reveals something useful or is more receptive than they'd be in a formal setting. Some encounters should be with members the player has never spoken to — an organic way to expand the player's network.
The Lingerer. After a mandatory event ends, the player can choose to linger rather than rushing to their next item. If the next slot is open, lingering is free. If the next slot is booked, lingering means arriving late (minor negative consequence depending on what's next — late to a meeting is a small sentiment hit, late to a committee hearing means missing opening remarks). Lingering presents a shortlist of 2–4 members who also stuck around, with a prompt like "You hang back as the room clears out. Still here are..." The lingerer list should be contextually smart — after a contentious committee vote, the members who linger might be the ones who want to debrief, vent, or make deals in the aftermath. After a routine hearing, it might be a more random assortment. This is the player trading punctuality for social opportunity, which is a micro-version of the game's central time-management tension.
Frequency and Distribution
Across a typical day with 2–3 mandatory events and transitions between items, a player should encounter roughly 3–5 quick interaction opportunities per day. Not all will be useful. Some days you'll bump into people you have nothing to discuss with. Other days you'll get an ambush from exactly the member you needed to talk to. The slight randomness keeps the player alert and makes every day feel a little different.
To prevent quick interactions from overshadowing scheduled meetings, there should be a daily cap — maybe the player can engage in a maximum of 3 quick interactions per day. After that, prompts still appear but the player is "too busy" or "running late" to stop. This forces prioritization even within the ambient layer.
Sentiment Effects
Quick interactions should generate smaller sentiment shifts than full meetings — roughly half the values. A kept promise from a hallway chat might earn +5 instead of +10. A deflection ("let's schedule something") should be nearly neutral, maybe -1 at most — it's not rude to be busy, and NPCs understand that. But an outright hostile response in a hallway chat (refusing an ask rudely, lying about your intentions when they ask directly) should carry the full negative weight because you chose to be confrontational when you could have just deflected.
The one exception: gossip-quality information shared during quick interactions should be just as valuable as what you'd learn in a meeting. If the fox casually mentions in a hallway that the Banana Lobby approached him this morning, that intelligence is worth the same whether you heard it over a scheduled dinner or while walking past each other. Information doesn't degrade based on the formality of the setting.
The "Let's Schedule Something" Response
This should be a dedicated response option in every quick interaction, functioning as a graceful exit that also opens a door. When selected, the game should offer to immediately place a tentative meeting with that member on the calendar for the next available slot. This turns the quick interaction into a scheduling tool — you bumped into someone useful, you weren't prepared to negotiate in the hallway, but now you've got a meeting booked. The NPC should almost always accept a scheduling request from a quick interaction because the social context is natural — you just ran into each other, of course you'd suggest getting together properly.
The exception: an NPC whose sentiment toward you is Cold or Hostile might decline even the scheduling request. "I don't think we have anything to discuss" is a signal that you need to work on the relationship through other channels before you can even get a meeting.
Quick Interactions During Markup
Committee markup sessions deserve special treatment because the stakes are immediate. During markup, the quick interactions aren't hallway chats — they're real-time tactical negotiations happening while amendments are being proposed and voted on. The player might get 2–3 sidebar opportunities during a single markup session, and the asks and offers are constrained to the business at hand: "vote down this amendment," "support my amendment," "I'll back your amendment if you back mine."
These should feel pressured. The player has limited time to decide (maybe a short countdown or a sense of urgency in the UI) because the vote on the amendment is happening NOW. There's no "let's schedule something" option during markup sidebars — you're either in or you're out. This creates a distinct tactical flavor that's different from the leisurely hallway encounter.

### Promise Ledger

All commitments made in meetings are tracked in a persistent **ledger** — promises the player has made and promises made to the player. When a promise comes due (a vote happens, a bill reaches committee), fulfillment or betrayal is flagged automatically, and sentiment adjustments apply. NPCs reference broken promises in future meetings.

---

## NPC Decision-Making AI

### Autonomous Behavior

NPCs pursue their own agendas independently of the player. Roughly **15 of 49 NPCs** are actively trying to pass their own legislation (each with the same pro/pro/anti tag structure). They lobby colleagues, seek cosponsors, and negotiate with committee chairs in the background. The remaining NPCs focus on protecting their districts, climbing the seniority ladder, and accumulating influence.

**Consequences for the player:** Key swing votes may be unavailable because another NPC already secured their commitment. Meeting requests from NPCs appear on the player's calendar (~2 per week) — taking these meetings builds relationships; ignoring them is a missed opportunity.

**NPC-to-NPC deal-making** happens off-screen but is discoverable through gossip and meetings. The political landscape shifts whether or not the player is watching.

### NPC Trade Evaluation

When evaluating a player's offer, the NPC calculates:

**Value of what they're getting:** How much the offer advances their top priorities (per their temperament-driven priority stack). Timing matters enormously — the same offer is worth 5 points or 50 points depending on context (e.g., campaign help the day before a primary vs. three weeks out).

**Cost of what they're giving:** How much the ask requires them to sacrifice. Voting aligned with their interests anyway = low cost. Voting against party position = moderate. Voting against core interests = high (Ideologues almost never agree). Voting against district interests near a primary = extreme.

**Sentiment margin:** Allied members accept slightly unfavorable deals on trust. Neutral members require clearly favorable terms. Cold members demand lopsided deals. Hostile members refuse all trades.

### The Whip (Special NPC)

The party Whip enforces discipline on key votes. Before major floor votes, the Whip contacts members (including the player) with voting expectations: "The Whip expects you to vote YES on Bill 7."

- **Complying:** Free. Small sentiment bonus with Whip and leadership.
- **Defying:** -15 to -20 sentiment with Whip. Multiple defections trigger escalation: denied meeting requests, pressure on other members not to deal with you, threats to committee assignments.
- **Loyalist–Pragmatist interaction:** Known Pragmatists get slightly more tolerance for defection. A Loyalist's defection is treated as a serious breach.

---

## Key Institutional Roles

| Role | Power | Relationship to Player |
|---|---|---|
| **Speaker of the Den** | Controls floor calendar, influences Rules Committee, face of majority party. | Getting on the Speaker's bad side is terrifying. A powerful NPC with strong opinions and a relationship meter. |
| **Party Whip** (both parties) | Enforces party discipline, counts votes, pressures members. | Demands compliance on key votes. Valuable ally, dangerous enemy. |
| **Majority / Minority Leaders** | Set party agenda, coordinate legislative strategy. | Influence committee assignments, can help or hinder the player's bill. |
| **Committee Chairs** | Schedule or refuse hearings within their committee's jurisdiction. Can block bills indefinitely. | One of the most important relationships to manage. A hostile chair is a major obstacle. |
| **Rules Committee Chair** | Sets terms for floor debate (open/closed/modified rules). | Controls whether the player's bill faces floor amendments. Relationship is critical in the mid-to-late game. |
| **President Gold** | Signs or vetoes legislation. | A looming shadow. Difficult to access. Known preferences on 3–4 policy areas are public; the rest are hidden. |
| **White House Chief of Staff** (Old Tortoise) | Gatekeeper to the President. Gives clearer policy signals than the liaison. | Available occasionally. May require competing with other members for meeting slots. |
| **White House Liaison** | Junior staffer. Gives vague presidential signals. | Most accessible presidential intelligence source. Available most days, costs one slot. |

---

## The President

President Gold is mechanically present but physically almost inaccessible.

**Known vs. Hidden Preferences:** At game start, the President's position on 3–4 policy areas is public. Positions on everything else are hidden. The player's bill may touch a hidden preference — investigation is required to avoid a surprise veto.

**Access Tiers:**

| Access Level | Information Quality | Availability |
|---|---|---|
| White House Liaison | Vague signals ("unlikely to support anti-Freshwater") | Most days, 1 slot |
| Chief of Staff | Clear information, can relay player's pitch | Occasional, competitive |
| Presidential Meeting | Direct pitch, clear read, possible negotiation | 1–2 per session, by invitation only |

Presidential meeting invitations go to leadership, members with bills near passage, or members the President wants something from.

**Veto Mechanics:** A veto is a crisis, not a game-over screen. Options after a veto:
- **Override attempt:** Requires 34 votes (two-thirds). Nearly impossible, but a desperate final round of vote-whipping.
- **Amend and resubmit:** Address objections and push through again — brutal time crunch.

**Presidential Coattails:** Public endorsement boosts the bill (swing-district members follow a popular president). Public opposition tanks it. Gold's approval rating fluctuates during the game based on random events, making the value of presidential support unstable.

---

## Committees

Eight standing committees. Each member sits on two. Committee chairs are assigned by majority party leadership. Roughly 6–7 members per committee.

| Committee | Jurisdiction | Notes |
|---|---|---|
| **Agriculture & Foraging** | Food supply, bananas, nuts, grazing land, farming | High demand — many constituent interests touch food. |
| **Habitat & Burrows** | Housing, nesting rights, territory, infrastructure, dam construction | Overlaps with Environment on land use. |
| **Migration & Transit** | Migratory patterns, flight lanes, ocean currents, borders | High-profile and contentious. |
| **Predation & Defense** | Predator-prey relations, self-defense, claws/fangs regulation, security | The "hawkish" committee. |
| **Freshwater & Marine Affairs** | Water rights, ocean policy, river access, fishing, wetlands | Overlaps with Habitat on waterway infrastructure. |
| **Environment & Conservation** | Pollution, climate, endangered status, deforestation, biodiversity | Often at odds with Agriculture. |
| **Rules & Procedures** | Controls which bills reach the floor and under what conditions | Chair is one of the most powerful figures in the game. |
| **Budget** | Scores bills for resource cost. Can tank a bill by declaring it too expensive. | Forces coalition-building across fiscal lines. Doesn't write policy. |

**Jurisdictional Overlaps** (bills may be referred to multiple committees):
- Habitat & Environment (land use)
- Freshwater & Habitat (waterway infrastructure)

**Committee Chair Power:** Chairs can schedule or refuse to schedule hearings on any bill in their jurisdiction. This is one of the most important and least understood powers — and a primary obstacle for the player.

---

## Scoring

After a win, the game rates the quality of victory:

- **Pure Passage:** Bill passed with zero amendments (rare, impressive).
- **Primary Dominance:** Low primary meter throughout the game.
- **Respected Colleague:** High average sentiment across the body at session's end.
- **Difficulty Bonus:** Scaled to party balance setting.
- **Banana Slayer:** Passed anti-Banana legislation (special achievement).

A letter grade or star rating at the end screen encourages replayability — can you get a perfect score on Legendary difficulty?

---

## Glossary

| Term | Definition |
|---|---|
| **Discharge Petition** | A mechanism requiring 26 signatures to force a bill out of committee when the chair refuses to schedule a hearing. Politically expensive. |
| **Logrolling** | Trading votes — "I'll vote for your bill if you vote for mine." |
| **Markup** | The committee process of debating and amending a bill line by line. |
| **Open/Closed Rule** | Terms set by the Rules Committee for  floor debate. Open allows amendments; closed does not.
| **Pocket Signature** | When the President takes no action on a bill and it becomes law automatically.
| **Rider/Amendment** |Additional policy tags attached to a bill during markup or floor debate. Can be friendly (sweeteners) or hostile (poison pills).
| **Whip Count** | An estimate of how members plan to vote, gathered through direct outreach. Always uncertain. 
| **Cosponsorship** | Publicly attaching your name to another member's bill. Signals support but carries visibility risk.
| **Lame Duck** | A member who has lost their primary but remains in office until the session ends. Unpredictable, no electoral pressure.
