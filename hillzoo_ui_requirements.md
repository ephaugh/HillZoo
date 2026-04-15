# Hill Zoo — UI Requirements Document

## Purpose

This document enumerates every screen, view, panel, and interactive element needed for a playable Hill Zoo prototype. It is organized by game phase. Read this alongside `hillzoo_style_guide.md` for visual specifications and the Game Design Document for mechanical details.

The reference mockup (`hillzoo_v2.html`) shows the **Meeting Screen** in detail. All other screens described below should match that screen's construction patterns.

---

## Global Persistent Elements

These elements are visible on every screen throughout the game.

### 1. The Brass Header Bar

Always visible. Six stat boxes on a gold background spanning the full width.

| Stat | Source | Update Frequency |
|---|---|---|
| **Day / Slot** | "D23 · MORNING" — current day (1–60) and active slot (Morning, Afternoon, Evening) | Every slot transition |
| **Your Bill** | "Z.B. 42: CLEAN RIVERS" — player's bill name, set at game creation | Static after creation |
| **War Chest** | "$2,840" — current money, exact dollar amount | After any income/spend event |
| **Primary Threat** | "38 / 70" — current meter value / defeat threshold. Visual bar fill. Bar turns red above 50. | After any primary-affecting event |
| **Primary In** | "T−12 DAYS" — countdown to player's primary date. Shows "SURVIVED" after passing. | Daily |
| **Week** | "5 OF 12" — current week of the 12-week session | Weekly |

**Design note:** The primary threat meter is the most important anxiety-generating element. It must be visually prominent — bordered, highlighted, with the bar fill visible at a glance.

### 2. The Agenda Sidebar

A 180px vertical panel to the right of the game stage. Visible on all screens except Game Creation. Three sections stacked vertically:

**TODAY section:**
- Day number and week-day position
- Three slots (MOR / AFT / EVE) with event names
- Color coding: green = current slot, amber = mandatory, cyan = tentative, gray = open

**TOMORROW section:**
- Same format as today
- Creates anticipatory tension per GDD

**GOSSIP section:**
- Red "GOSSIP" header with a notification count badge
- Shows 2–3 most recent gossip items with source tags (caucus, hallway, meeting, etc.)
- "VIEW ALL" link opens the full Gossip Log reference screen

### 3. The Action Bar

Context-sensitive button row below the game stage. Changes based on current screen state.

**During open slots (no meeting active):**
- WHIP COUNT — flexible action, costs 1 slot
- REVIEW TAGS — view/edit player's bill tags (no slot cost)
- CALENDAR — open full calendar view (no slot cost)
- CAMPAIGN — flexible action, costs 1 slot (evening or full day)
- FUNDRAISE — scheduled action, evening only (grayed out during morning/afternoon)
- SCHEDULE MTG — opens meeting scheduler
- END [SLOT NAME] SLOT — red danger button, advances to next slot

**During meetings:** Action bar is hidden or replaced with a minimal "EXIT MEETING" option. The verb menu inside the interaction pane handles all meeting actions.

**During mandatory events (hearings, floor votes):** Action bar shows event-specific controls only.

---

## Phase 1: Game Creation

A sequential 7-step setup flow. Each step is a full-screen view within the game stage. No sidebar or action bar during creation.

### Screen 1.1 — Choose Your Species

- Grid of 20–30 animal pixel portraits
- Click to select. Selected portrait gets a gold highlight border.
- No mechanical text needed — this is cosmetic
- "CONFIRM" button at bottom

### Screen 1.2 — Choose Your Party

- Two columns: FERALIST (left) and COMMUNALIST (right)
- Each column shows the party's randomized policy agenda (2–3 strong positions)
- Policy positions displayed as tag pills with PRO/ANTI labels
- Neutral areas listed dimly below
- Click a party column to select. "CONFIRM" button.

### Screen 1.3 — Loyalist–Pragmatist Slider

- Horizontal slider from "FULL LOYALIST" to "FULL PRAGMATIST"
- Below the slider: a live-updating effects panel showing cascading consequences:
  - Committee priority: "TOP PICKS" ↔ "3RD-4TH CHOICE"
  - Starting relationships: "WARM WITH PARTY, COLD WITH OPPOSITION" ↔ "NEUTRAL WITH EVERYONE"
  - Primary risk: "SAFE BUT FRAGILE" ↔ "CONSTANT LOW THREAT"
  - Starting war chest: exact dollar amount updates as slider moves
- "CONFIRM" button

### Screen 1.4 — Choose Party Balance (Difficulty)

- 5 options displayed as rows, each with:
  - Setting name (Large Majority, Slim Majority, etc.)
  - Seat split (e.g., "27–23")
  - President's party
  - Difficulty label with color (Standard = green, Challenging = amber, Expert/Hard/Brutal = red)
  - One-sentence description of the strategic character
- Click to select. "CONFIRM" button.
- First-time players default to Slim Majority (highlighted/recommended).

### Screen 1.5 — Craft Your Bill

- The 14 policy issues displayed as selectable tag pills
- Player selects 2 pro-tags and 1 anti-tag
- Live alignment display: shows which factions, party positions, and issue temperatures align or conflict with current selections
- Bill naming: text input for bill number (1–99) and name (up to 30 chars)
- Preview: "Z.B. [number], THE [NAME] ACT"
- "CONFIRM" button

**The 14 policy issues:** Agriculture & Foraging, Habitat & Burrows, Migration & Transit, Predation & Defense, Freshwater & Marine Affairs, Environment & Conservation, Banana Policy, Nocturnal Affairs, Interspecies Relations, Aquatic-Terrestrial Equity, Pack Size Regulation, Hibernation Rights, Venom & Toxin Policy, Scavenger Protections.

### Screen 1.6 — Choose Primary Date

- Two options: EARLY (Day 20) and LATE (Day 45)
- Each with a brief risk/reward description
- Visual timeline showing where each date falls in the 60-day session
- "CONFIRM" button

### Screen 1.7 — Set Your District

- District profile card showing:
  - Two strong interest preferences (tag pills)
  - One policy hostility (tag pill, red)
  - Tolerance profile based on slider position
- "REROLL" button (once only — grays out after use)
- "CONFIRM AND BEGIN" button — starts the game, triggers world generation

---

## Phase 2: The Daily Loop

### Screen 2.1 — The Dawn Brief

Opens every day. A static information screen with four sections. The player reads, responds to notices, then proceeds to the first slot.

**Section A — Today's Calendar:**
- Three slots (MOR / AFT / EVE) displayed as a vertical stack
- Each shows: what's booked (mandatory events pre-filled, tentative meetings shown, open slots marked as "OPEN")
- Same color coding as sidebar but larger format

**Section B — Notices:**
- Scrollable list of overnight items, each with an inline response:
  - NPC meeting requests → ACCEPT / DECLINE
  - Whip instructions → ACKNOWLEDGE (displays the instruction text)
  - Hearing invitations → ACKNOWLEDGE
  - Gossip items → displayed with source tag
  - Headline events → displayed with impact description
- Each notice has a brief description and an immediate action or "DEFER" option

**Section C — Dashboard Snapshot:**
- All status indicators with overnight **changes highlighted**:
  - Primary threat (with delta: "+3 overnight")
  - War chest (with delta: "+$300 report card payout")
  - Bill stage (e.g., "IN COMMITTEE — Hearing scheduled Day 25")
  - Party standing tier
  - Key faction grades (only those that changed)
- Changes use amber text to draw the eye

**Section D — Promise Ledger Reminder:**
- Only appears when promises are due within 3 days
- Lists the promise, who it's to/from, and the due date
- Amber warning color

**"BEGIN DAY" button** at the bottom advances to the first slot.

### Screen 2.2 — Slot Selection (Action Menu)

Appears at the start of each slot (Morning, Afternoon, Evening). Shows what's booked and offers alternatives.

**If a mandatory event is scheduled:** The event fills the slot automatically. Display the event name and a "PROCEED" button. The player cannot choose something else (but may have chosen to skip/cancel — see scheduling rules).

**If a scheduled meeting is booked:** Show the meeting details and options:
- ATTEND MEETING → goes to Meeting Screen
- CANCEL MEETING → confirmation dialog, applies sentiment penalty, returns to open slot

**If the slot is open:** Display the Action Menu:
- SCHEDULE A MEETING → opens member selection, then books and immediately starts the meeting
- ATTEND OPTIONAL EVENT → list of available overflow hearings, receptions
- WHIP COUNT → executes the whip count action, displays results
- CAMPAIGN BACK HOME → executes campaign action, displays results
- REVIEW CALENDAR → opens Calendar view (no slot cost — returns to this menu)
- FUNDRAISE → evening only, executes fundraiser, displays results

### Screen 2.3 — Quick Interaction Overlay

Triggers between slots (not during). Appears as a compact overlay on top of the current screen — NOT a full-screen takeover. Shows:

- NPC portrait (small, ~100px) and name
- Interaction type label: EARLY BIRD / AMBUSH / HALLWAY / LINGERER
- NPC's bark (one sentence)
- Response options (varies by type):

**Early Bird:** DISCUSS / OFFER / QUICK QUESTION / SKIP
**Ambush:** ACCEPT / DECLINE / "LET'S TALK LATER" / DIVERT (with sentiment cost warning)
**Hallway Encounter:** DISCUSS / OFFER / QUICK QUESTION / "I HEARD SOMETHING..." / PASS
**Lingerer:** All hallway options + "HOW ARE YOU HOLDING UP?" (two verb selections allowed)

After the player responds, show the NPC's response bark and any mechanical outcome (e.g., "+3 SENTIMENT"), then dismiss.

### Screen 2.4 — The Dusk Summary

End-of-day receipt. Brief, not interactive.

- **Actions taken:** List of what happened in each slot (1 line per slot)
- **Promise ledger updates:** New promises made, promises fulfilled, promises approaching due date
- **TOMORROW preview:** Shows the next day's mandatory events with amber highlighting
- "END DAY" button advances to next Dawn Brief

---

## Phase 3: Meetings

The core interaction screen. The reference mockup shows this screen.

### Screen 3.1 — Meeting Screen (Three Phases)

The meeting uses a phased UI within the interaction pane. Phase indicators (READ / ASK / OFFER) show progress.

**Phase 1 — The Read (Dossier):**

Visible when the meeting opens, before the player acts. Contains:

| Field | Data | Visibility Rules |
|---|---|---|
| Attitude | Hostile / Cold / Neutral / Warm / Allied | Always visible |
| Committees | List of committee seats with (CHAIR) tag | Always visible |
| Known Interests | Pro/anti tag pills, color-coded | Revealed progressively — more meetings = more interests shown |
| Report Card | Public grades (Party, Banana Lobby, relevant factions) | Always visible (public data) |
| Prior Meetings | Count of previous meetings with this NPC | Always visible |
| Promise Ledger | Outstanding promises between player and this NPC | Always visible if promises exist |

**First meetings show minimal information.** Repeated interaction reveals more fields.

**Phase 2 — The Ask (Verb-Object Menu):**

The NPC delivers their opening bark (1–2 sentences) in the dialogue body. Below it, the verb menu appears:

| Verb | Object Selection | Notes |
|---|---|---|
| "I NEED YOUR VOTE..." | → Select a bill → yes/no/abstain | Core ask |
| "I NEED YOUR COSPONSORSHIP..." | → Select a bill | Higher stakes than a vote |
| "I NEED HELP WITH..." | → Submenu: hearing scheduled / meeting with [NPC] / Rules Committee / the President | Favor request |
| "I WANT TO DISCUSS..." | → Select: policy area / specific bill / another member | Intel gathering, no political cost |
| "I WANT TO OFFER..." | → Your vote / cosponsorship / help pressuring / campaign support | Proactive goodwill |
| "I WANT TO WARN YOU..." | → Free text selection of intel to share | Can be truth or bluff |
| "I WANT TO PROPOSE COMBINING..." | → Only if NPC has active bill | Omnibus proposal |
| EXIT | — | Leave the meeting |

After the player selects a verb+object, the Decision Engine runs and the NPC responds with a new bark. The intel ledger below the bark shows:
- The dominant concern driving the NPC's response (without naming the temperament)
- Behavioral pattern observations (e.g., "responds to reciprocal favors")
- Strategic notes (e.g., "Budget seat means they'll scrutinize burden score")

**Phase 3 — The Offer (Counter-Ask):**

Only triggers if the NPC responded "What's in it for me?" The panel shows:

- NPC's counter-ask (what they want in return)
- The "deal" laid out: THEY GIVE [X] / YOU GIVE [Y]
- Player options: ACCEPT / DECLINE / COUNTER (if applicable)
- Accepting logs both commitments in the Promise Ledger

---

## Phase 4: Legislative Events

### Screen 4.1 — Committee Hearing

When the player attends a committee hearing (mandatory if they sit on the committee):

- Panel header: committee name, bill being heard, chair's name
- Bill summary: tags displayed as pills, author name, brief description
- Hearing proceedings: 2–3 NPC barks from committee members reacting to the bill
- Player action (if they sit on this committee): SPEAK IN FAVOR / SPEAK AGAINST / STAY SILENT
- Result: hearing advances the bill to markup, or chair tables it

### Screen 4.2 — Committee Markup

Full committee amendment process. Each committee member proposes one amendment in seniority order.

- **Amendment proposal display:** Shows the proposed change as a tag diff:
  - "ADD PRO-TAG: CONSERVATION" or "REMOVE TAG: BANANA POLICY" or "FLIP: PRO-MIGRATION → ANTI-MIGRATION"
- **Live coalition impact preview:** Before each vote, show how many current supporters would flip
- **Vote on each amendment:** Committee members vote. Display as a mini tally (YES: 4 / NO: 3)
- **Player's turn:** When it's the player's turn (lowest seniority = last), show the amendment type menu:
  - ADD PRO-TAG / ADD ANTI-TAG / REMOVE TAG / FLIP TAG / PASS
  - With a preview of how the amendment affects faction alignment and vote count
- **Result:** Bill emerges with final tag set. Budget scoring applied immediately.

### Screen 4.3 — Budget Score Reveal

Appears immediately after a bill passes committee. Brief, dramatic.

- Bill name at top
- Burden rating revealed: LEAN (0–3) / ROUTINE (4–7) / HEAVY (8–11) / BLOATED (12+)
- Rating displayed large, color-coded: green → amber → red
- One-sentence impact description
- "ACKNOWLEDGE" button

### Screen 4.4 — Floor Vote Screen

Full-screen hemicycle view. The most visually dramatic screen in the game.

**Layout:**
- **Hemicycle:** Semicircular seating arrangement of all 50 members as small pixel portraits
  - Feralists on the left, Communalists on the right, moderates in the center
  - Portrait states: Unlit (hasn't voted), Green glow (YES), Red glow (NO)
- **Running tally:** Large numbers above the hemicycle — "YES: 14 / NO: 8 / REMAINING: 28"
- **Threshold line:** Visual marker at 26 (passage threshold)
- **Vote ticker:** Scrolling log below showing each vote as it's cast: "ELK (F) — YES"

**Pre-vote:** Player casts their own vote first. Show report card impact preview for YES / NO / ABSTAIN.

**Vote sequence (three phases):**
1. **The Predictables (1–20):** Locked-in votes. Fast pace (0.5–1 sec each).
2. **The Leaners (21–35):** Uncertain votes. Slower pace (2–3 sec each). Dramatic pauses.
3. **The Deciders (36–50):** Final votes. Slowest pace (3–5 sec). One at a time with tension.

**Post-vote breakdown screen:**
- Raw tally
- Party split (Feralist yes/no, Communalist yes/no)
- Promises kept and broken (highlighted)
- Surprises (unexpected flips, highlighted in amber)
- Faction reactions
- Report card impact
- Presidential posture (if visible)

### Screen 4.5 — Caucus Meeting

Weekly mandatory event (Day 3, Evening). A non-interactive information delivery screen.

- Whip delivers voting instructions (displayed as a list of upcoming bills with VOTE YES / VOTE NO / FREE VOTE labels)
- Leadership signals priorities (1–2 policy areas highlighted)
- 2 guaranteed gossip items delivered
- "ADJOURN" button

### Screen 4.6 — Primary Election

Triggers on the player's chosen primary date (Day 20 or Day 45).

- Primary threat meter displayed prominently with final value
- If below threshold (70): "YOU SURVIVED" — display margin and continue
- If above threshold: "DEFEATED" — game can continue as a Lame Duck but the loss is permanent
- Result breakdown: what raised/lowered the meter over the campaign period
- "CONTINUE" button

### Screen 4.7 — Presidential Action

Triggers after the player's bill passes the floor vote.

- President Gold's portrait (goldfish in a tank)
- Three possible outcomes displayed one at a time:
  - SIGNED INTO LAW → victory screen
  - VETOED → player chooses: Override (34 votes) / Amend and Resubmit / Accept Defeat
  - POCKET SIGNATURE → victory screen (understated)

---

## Phase 5: Reference Screens

Accessible via reference tabs in the top-right corner of the game stage. These overlay the game stage content and can be dismissed.

### Screen 5.1 — Members List

Sortable/filterable grid of all 50 congress members.

**Each member row shows:**
- Pixel portrait (small, ~40px)
- Name and species
- Party (F or C)
- Seniority (1–5)
- Attitude tier toward player (color-coded text)
- Committee seats
- Known interests (revealed through gameplay)
- Report card grades (public data)

**Sort options:** By name, party, seniority, attitude, committee
**Filter options:** By party, committee, attitude tier

**Clicking a member** opens their full profile card with all known information.

### Screen 5.2 — Factions Report

Overview of all factions and the player's standing with each.

**Per faction:**
- Faction name and policy domain
- Player's current grade (A+ through F)
- Grade trend arrow (improving/declining/stable)
- Weekly payout or attack amount
- Key members aligned with this faction

**Factions:** Agriculture & Foraging, Habitat & Burrows, Migration & Transit, Predation & Defense, Freshwater & Marine Affairs, Environment & Conservation, plus the Banana Lobby (special — higher payouts and attacks).

### Screen 5.3 — Promise Ledger

Full view of all outstanding commitments.

**Two sections:**
- PROMISES YOU OWE: each with recipient, description, due date, urgency color
- PROMISES OWED TO YOU: each with source, description, due date

**Completed/broken promises** shown in a collapsed history section below.

### Screen 5.4 — Gossip Log

Chronological feed of all gossip the player has received.

**Each entry:**
- Day received
- Content (1–2 sentences)
- Source (caucus, hallway, meeting with [NPC], etc.)
- Verified/unverified indicator (gossip that has been confirmed by events gets a checkmark)

### Screen 5.5 — Calendar View

The 5-day week displayed as a grid.

**Layout:** 5 columns (Day 1–5) × 3 rows (Morning, Afternoon, Evening). Shows the current week and the next week.

**Each cell shows:**
- Event name or "OPEN"
- Color coding matching the agenda sidebar
- Mandatory events cannot be moved
- Tentative meetings show with a "(T)" marker
- Clicking an open cell in the future opens the scheduling interface

**The Speaker's Queue** is displayed below the calendar grid: a ranked list of bills waiting for floor time with the player's bill position highlighted.

### Screen 5.6 — Bill Status View

Detailed view of the player's bill and its current pipeline position.

- Bill name and tags (displayed as pills)
- Current stage: REFERRED → HEARING → MARKUP → COMMITTEE VOTE → RULES → FLOOR → PRESIDENT
- Stage progress bar with completed stages filled
- Burden rating (if scored)
- Cosponsor count and list
- Known supporters and opponents (from whip counts)

### Screen 5.7 — Whip Count Results

Displayed after executing a whip count action (costs 1 slot).

- Survey of 5–8 members' likely vote intentions on the player's bill
- Each entry: NPC name, portrait, party, leaning (YES / NO / UNDECIDED), one-line read
- Final whip check (pre-floor-vote version) is more detailed: names undecided members with dominant-driver reads

---

## Phase 6: End States

### Screen 6.1 — Victory Screen

Triggers when the player's bill is signed into law.

- Bill name displayed large
- "SIGNED INTO LAW BY PRESIDENT GOLD"
- Scoring breakdown:
  - Pure passage (zero amendments) bonus
  - Primary dominance bonus
  - Respected colleague (average sentiment) bonus
  - Fiscal discipline (remaining war chest) bonus
  - Difficulty bonus
  - Speed bonus (calendar time remaining)
- Final letter grade / star rating
- "PLAY AGAIN" button

**Omnibus victory variant:** Reduced base score (60%), bonuses for surviving tags.

### Screen 6.2 — Defeat Screen

Triggers when the player's bill dies with no time to recover, or player loses primary.

- Cause of defeat displayed
- Session statistics (days played, meetings held, promises kept/broken, votes cast)
- "TRY AGAIN" and "NEW GAME" buttons

---

## Data Display Rules

### Hidden vs. Visible Information

The game's imperfect information system requires careful UI discipline:

| Data | Visibility | Notes |
|---|---|---|
| Sentiment (exact number) | NEVER shown | Only the attitude tier label is displayed |
| Temperament label | NEVER shown | Player infers from bark patterns and behavior |
| NPC Net Willingness | NEVER shown | Player sees response tiers via barks |
| Issue temperatures | Shown as HOT / WARM / COOL / COLD | Labels only, no numbers |
| NPC core interests | Progressively revealed | More meetings = more interests visible |
| Presidential preferences | Hidden until revealed via White House access | Retroactive grade adjustment when revealed |
| NPC-to-NPC deals | Hidden by default | Discoverable through gossip, meetings, whip counts |
| Report card grades | Always visible | Public data for all members |
| Promise ledger | Always visible | Both sides tracked |
| War chest | Always visible | Exact number |
| Primary threat meter | Always visible | Exact number with threshold |

### The Temperament Inference System

The UI must NEVER label an NPC's temperament. Instead, the intel ledger provides behavioral observations that a skilled player can interpret:

| Temperament | Intel Ledger Language |
|---|---|
| Ideologue | "Driven by policy conviction" / "Responds to principled arguments" / "Unmoved by political calculations" |
| Follower | "Closely tracks leadership signals" / "Defers to institutional hierarchy" / "Responsive to Whip pressure" |
| Dealmaker | "Responds to reciprocal favors" / "Keeps a running tally of debts" / "Transactional in approach" |
| Opportunist | "Tracks bill momentum closely" / "Follows the room" / "Responsive to cosponsor counts" |

These phrases appear in the intel ledger's "PATTERN" line. They are the ONLY hint the player gets — the rest comes from reading bark patterns over multiple meetings.

---

## Interactive Element Summary

Every clickable/interactive element in the game:

| Element | Location | Action |
|---|---|---|
| Stat boxes | Header | Display only (no interaction) |
| Phase pips | Game stage, top-left | Display only (show meeting progress) |
| Reference tabs | Game stage, top-right | Open overlay reference screens |
| Verb options | Meeting interaction pane | Select verb, triggers object submenu |
| Object submenus | Meeting interaction pane | Select target, triggers NPC response |
| Deal accept/decline | Meeting Phase 3 | Resolve counter-offer |
| Action bar buttons | Below game stage | Execute flexible actions or end slot |
| Agenda sidebar events | Right sidebar | Display only (no interaction in prototype) |
| Gossip "VIEW ALL" | Right sidebar | Opens Gossip Log reference screen |
| Dawn Brief notices | Dawn Brief screen | Accept/Decline/Acknowledge/Defer |
| Calendar cells | Calendar view | Open scheduling interface for future open slots |
| Quick interaction options | Overlay | Respond to ambient NPC encounter |
| Floor vote player vote | Pre-vote screen | Cast YES / NO / ABSTAIN |
| Amendment proposal | Committee markup | Select amendment type and tag |
| Amendment vote | Committee markup | Not interactive for player (NPC votes are automatic) |
| Primary result | Primary screen | CONTINUE |
| Veto response | Presidential action | Override / Amend / Accept |

---

## Screen Priority for Prototype

Build these screens first (minimum viable playable game):

1. **Game Creation flow** (Screens 1.1–1.7) — without this, no game starts
2. **Dawn Brief** (Screen 2.1) — the daily loop entry point
3. **Slot Selection / Action Menu** (Screen 2.2) — how the player spends time
4. **Meeting Screen** (Screen 3.1) — the core interaction, reference mockup exists
5. **Floor Vote Screen** (Screen 4.4) — the dramatic climax
6. **Victory / Defeat Screens** (Screens 6.1–6.2) — game needs endings
7. **Members List** (Screen 5.1) — essential reference during play

Build these second (important but not blocking):

8. Committee Hearing / Markup (Screens 4.1–4.2)
9. Calendar View (Screen 5.5)
10. Quick Interaction Overlay (Screen 2.3)
11. Promise Ledger (Screen 5.3)
12. Whip Count Results (Screen 5.7)
13. Caucus Meeting (Screen 4.5)
14. Dusk Summary (Screen 2.4)
15. Bill Status View (Screen 5.6)
16. Factions Report (Screen 5.2)
17. Gossip Log (Screen 5.4)
18. Budget Score Reveal (Screen 4.3)
19. Primary Election (Screen 4.6)
20. Presidential Action (Screen 4.7)
