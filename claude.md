# CLAUDE.md — Hill Zoo

## What Is This

Hill Zoo is a single-player political strategy simulator set in a fictional 50-member unicameral animal congress. The player is a freshman legislator trying to pass one bill in a 60-day session. Think Suzerain meets Cultist Simulator: information-dense, mechanically deep, built on authored dialogue (not LLM-generated text), and driven by a hidden NPC decision engine the player must learn to read through behavioral patterns. The aesthetic is Civilization I — pixel art, VT323 monospace font, mahogany-and-brass UI, hard pixel edges, zero animations.

The game has ~25 interlocking systems (action economy, sentiment, NPC decision engine, bark selection, bill lifecycle, report cards, factions, primary threat, war chest, issue temperature, headlines, presidential stance, the Whip, NPC autonomous behavior, gossip, the information game, calendar pacing, committee markup, discharge petitions, omnibus strategy, arm-twisting, quick interactions, scoring). All are documented. Your job is execution, not design.

---

## Tech Stack (Settled — Not Up for Debate)

**TypeScript + Svelte + Vite** as the primary development target. The game runs as a pure client-side web app. Zero server dependencies. All game state lives client-side.

**Tauri** for desktop wrapping later (Windows `.exe`, Linux `.AppImage`). Do not build for Tauri yet — the browser version comes first. But the architecture must not preclude it.

**Save system** uses an abstracted storage interface. Define a `StorageAdapter` interface early:
- Browser build: `localStorage` / `IndexedDB`
- Desktop build (future): filesystem via Tauri's API

The interface must be defined in the first sprint so game logic never calls storage directly. All save/load goes through the adapter.

**No server calls. No backend. No fetch() to external APIs. No WebSocket. No multiplayer. This is a local single-player game.**

---

## Project Structure

```
hill-zoo/
├── claude.md                    ← You are here
├── package.json
├── svelte.config.js
├── vite.config.ts
├── tsconfig.json
│
├── src/
│   ├── app.html                 ← Shell HTML (loads VT323, sets meta)
│   ├── app.css                  ← Global CSS: variables, VT323 import, reset, shared patterns
│   ├── main.ts                  ← Svelte app entry
│   │
│   ├── core/                    ← Game engine — pure TypeScript, no Svelte imports
│   │   ├── state.ts             ← Central GameState type + initial state factory
│   │   ├── types.ts             ← All game types: NPC, Bill, Faction, Committee, etc.
│   │   ├── decision-engine.ts   ← Net Willingness calculation, response thresholds
│   │   ├── bark-engine.ts       ← Bark selection: tier → dominant driver → temperament → variant
│   │   ├── npc-generator.ts     ← World generation: 49 NPCs, profiles, temperaments, interests
│   │   ├── bill-lifecycle.ts    ← Referral, hearing, markup, budget score, floor, president
│   │   ├── calendar.ts          ← Day/slot management, mandatory event scheduling, pacing arc
│   │   ├── sentiment.ts         ← Sentiment math: shifts, decay, extremes, NPC-to-NPC
│   │   ├── war-chest.ts         ← Income/spending, fundraiser modifiers, lame duck penalties
│   │   ├── primary.ts           ← Primary threat meter, increases/decreases, defeat check
│   │   ├── report-cards.ts      ← Grade calculation, cold start priors, weekly consequences
│   │   ├── factions.ts          ← Faction generation, bill opinions, banana lobby logic
│   │   ├── issues.ts            ← 14 issues, temperature system, bombshell/minor headlines
│   │   ├── president.ts         ← Presidential stances, approval rating, veto mechanics
│   │   ├── whip.ts              ← Whip instructions, sentiment anchoring, defiance tracking
│   │   ├── npc-behavior.ts      ← Autonomous NPC bill advancement, deals, scheduling pressure
│   │   ├── gossip.ts            ← Gossip generation, quality scaling, rolling log
│   │   ├── committees.ts        ← Committee assignment, chairs, markup amendment logic
│   │   ├── promises.ts          ← Promise ledger, tracking, betrayal detection
│   │   ├── scoring.ts           ← Win quality scoring, omnibus scoring, letter grades
│   │   ├── storage.ts           ← StorageAdapter interface + localStorage implementation
│   │   └── utils.ts             ← RNG, weighted random, clamping, ID generation
│   │
│   ├── stores/                  ← Svelte stores wrapping core state
│   │   ├── game.ts              ← Writable store holding the full GameState
│   │   ├── derived.ts           ← Derived stores: current NPC list, active bill status, etc.
│   │   └── actions.ts           ← Store mutation functions: advanceSlot(), bookMeeting(), etc.
│   │
│   ├── screens/                 ← One Svelte component per screen
│   │   ├── creation/
│   │   │   ├── SpeciesSelect.svelte       ← Screen 1.1
│   │   │   ├── PartySelect.svelte         ← Screen 1.2
│   │   │   ├── LoyalistSlider.svelte      ← Screen 1.3
│   │   │   ├── PartyBalance.svelte        ← Screen 1.4
│   │   │   ├── BillCraft.svelte           ← Screen 1.5
│   │   │   ├── PrimaryDate.svelte         ← Screen 1.6
│   │   │   └── DistrictSetup.svelte       ← Screen 1.7
│   │   ├── gameplay/
│   │   │   ├── DawnBrief.svelte           ← Screen 2.1
│   │   │   ├── SlotSelection.svelte       ← Screen 2.2
│   │   │   ├── QuickInteraction.svelte    ← Screen 2.3
│   │   │   ├── DuskSummary.svelte         ← Screen 2.4
│   │   │   └── MeetingScreen.svelte       ← Screen 3.1 (core gameplay)
│   │   ├── events/
│   │   │   ├── CommitteeHearing.svelte    ← Screen 4.1
│   │   │   ├── CommitteeMarkup.svelte     ← Screen 4.2
│   │   │   ├── BudgetScore.svelte         ← Screen 4.3
│   │   │   ├── FloorVote.svelte           ← Screen 4.4
│   │   │   ├── CaucusMeeting.svelte       ← Screen 4.5
│   │   │   ├── PrimaryElection.svelte     ← Screen 4.6
│   │   │   └── PresidentialAction.svelte  ← Screen 4.7
│   │   ├── reference/
│   │   │   ├── MembersList.svelte         ← Screen 5.1
│   │   │   ├── FactionsReport.svelte      ← Screen 5.2
│   │   │   ├── PromiseLedger.svelte       ← Screen 5.3
│   │   │   ├── GossipLog.svelte           ← Screen 5.4
│   │   │   ├── CalendarView.svelte        ← Screen 5.5
│   │   │   ├── BillStatus.svelte          ← Screen 5.6
│   │   │   └── WhipCount.svelte           ← Screen 5.7
│   │   └── endgame/
│   │       ├── Victory.svelte             ← Screen 6.1
│   │       └── Defeat.svelte              ← Screen 6.2
│   │
│   ├── components/              ← Reusable UI pieces
│   │   ├── BrassHeader.svelte   ← Persistent header bar (6 stat boxes)
│   │   ├── AgendaSidebar.svelte ← Persistent right sidebar (today/tomorrow/gossip)
│   │   ├── ActionBar.svelte     ← Context-sensitive bottom button row
│   │   ├── PortraitFrame.svelte ← Gilded NPC portrait with nameplate
│   │   ├── Panel.svelte         ← Standard marble panel with header
│   │   ├── Button.svelte        ← Win95-style button (standard/active/danger/disabled)
│   │   ├── IntelLedger.svelte   ← Phosphor-green terminal readout strip
│   │   └── SentimentBadge.svelte← Tier label display (HOSTILE/COLD/NEUTRAL/WARM/ALLIED)
│   │
│   └── data/                    ← Static game data (imported, not fetched)
│       ├── barks/
│       │   ├── core.ts          ← Compiled from barks_core.md
│       │   ├── discussion.ts    ← Compiled from barks_discussion.md
│       │   ├── interjections.ts ← Compiled from barks_interjections.md
│       │   ├── armtwist.ts      ← Compiled from barks_armtwist.md
│       │   └── quick.ts         ← Compiled from barks_quick_interactions.md
│       ├── balance.ts           ← All numbers from hill_zoo_balance_numbers_v1.md
│       ├── species.ts           ← Species list with portrait references
│       ├── issues.ts            ← The 14 issues, committee mappings, cross-cutting flags
│       └── headlines.ts         ← Bombshell + minor headline templates
│
├── static/
│   └── portraits/               ← Pixel art portrait images (placeholder squares for now)
│
└── docs/                        ← Design documents (read-only reference)
    ├── hill_zoo_game_design_doc_v5.md
    ├── hill_zoo_balance_numbers_v1.md
    ├── hillzoo_style_guide.md
    ├── hillzoo_ui_requirements.md
    ├── hillzoo_v2.html           ← CANONICAL meeting screen mockup — open in browser
    ├── barks_core.md
    ├── barks_discussion.md
    ├── barks_interjections.md
    ├── barks_armtwist.md
    ├── barks_quick_interactions.md
    └── Skill.md                  ← Bark revision instructions + temperament voice reference
```

---

## Design Documents — What Each Contains

Read ALL of these before writing code. They are the spec.

| File | What It Is | What You Need From It |
|---|---|---|
| `hill_zoo_game_design_doc_v5.md` | **The bible.** Complete mechanical specification for all ~25 game systems. | Every system's rules, formulas, thresholds, edge cases. The NPC Decision Engine (System 5) is the mechanical core — read it three times. |
| `hill_zoo_balance_numbers_v1.md` | First-pass numbers for every system. | Starting values, income/cost tables, sentiment shifts, primary meter math, scheduling costs, gossip quality tiers, key thresholds quick reference. All numbers are tuning targets but use them as-is for the prototype. |
| `hillzoo_style_guide.md` | Visual specification. CSS variables, panel construction, button patterns, portrait frames, color semantics, typography scale. | Every CSS rule you write. The `What NOT to Do` section is law. |
| `hillzoo_ui_requirements.md` | Every screen enumerated with fields, data sources, interactions, visibility rules, and build priority order. | Screen-by-screen implementation spec. The interactive element summary table lists every clickable thing in the game. |
| `hillzoo_v2.html` | **Canonical reference mockup** of the Meeting Screen. | Open it in a browser. This is the target look. Every screen must feel like it belongs in the same application. Copy its construction patterns for all new screens. |
| `barks_core.md` | ~588 authored NPC dialogue lines organized by response tier × dominant driver × temperament. | The bark selection engine pulls from this corpus. Convert to TypeScript data structures. |
| `barks_discussion.md` | ~50 discussion/information barks for the meeting ASK verb. | Same conversion treatment. |
| `barks_interjections.md` | ~30 contextual interjections triggered by boolean game-state flags. | Prepended to barks when trigger conditions are met. |
| `barks_armtwist.md` | Arm-twist barks for the floor vote arm-twisting mechanic. | Separate corpus, same structure. |
| `barks_quick_interactions.md` | 113 barks for quick interactions (Early Bird, Ambush, Hallway Encounter, Lingerer). | New bark pool, different tone — more casual and compressed. |
| `Skill.md` | Bark revision instructions + temperament voice reference table. | The voice reference table at the top is the definitive guide to how each temperament speaks. Use it when validating bark selection logic. |

---

## Architecture Principles

### This Is a State Machine Game

Hill Zoo is a finite state machine with ~25 subsystems. The game state must be:

1. **Centralized** — One `GameState` object holds everything. No distributed state across components.
2. **Serializable** — `JSON.stringify(gameState)` must produce a valid save file. No class instances, no functions, no circular references in the state object. Use plain objects and arrays.
3. **Immutable-ish** — State mutations go through action functions in `stores/actions.ts`, never through direct property assignment in components. Components read from stores, dispatch actions. This isn't Redux — Svelte stores are simpler — but the principle is the same.

### The GameState Object

```typescript
interface GameState {
  // Meta
  version: string;
  seed: number;
  createdAt: string;

  // Player
  player: PlayerState;        // species, party, slider, bill, district, committees
  warChest: number;
  primaryThreat: number;
  primaryDate: 'early' | 'late';
  primarySurvived: boolean;
  isLameDuck: boolean;
  partyStanding: PartyStandingTier;

  // Calendar
  currentDay: number;         // 1–60
  currentSlot: Slot;          // 'morning' | 'afternoon' | 'evening'
  schedule: ScheduleEntry[];  // Full 180-slot calendar
  mandatoryEvents: MandatoryEvent[];

  // Congress
  npcs: NPC[];                // All 49 members, full profiles
  factions: Faction[];        // 5 standard + Banana Lobby
  committees: Committee[];    // 8 standing committees
  parties: PartyState[];      // Feralist + Communalist agendas

  // Bills
  playerBill: Bill;
  npcBills: Bill[];           // ~15 active NPC bills
  speakerQueue: BillQueueEntry[];

  // Relationships
  sentiment: Record<string, number>;     // npcId → sentiment score (-100 to +100)
  npcSentiment: Record<string, Record<string, number>>; // npcId → npcId → score
  promises: Promise[];

  // Report Cards
  reportCards: ReportCard[];  // One per faction + party + president

  // Issues & Headlines
  issueTemperatures: Record<string, Temperature>;
  permanentHotIssue: string;
  headlineHistory: Headline[];
  nextBombshellDay: number;

  // President
  president: PresidentState;

  // Information
  gossipLog: GossipEntry[];   // Rolling 15-item log
  knownInfo: KnownInformation; // What the player has discovered

  // Scoring
  voteHistory: VoteRecord[];
}
```

Every field must be serializable. Every subsystem reads from and writes to this object through action functions.

### Core Engine Is Pure TypeScript

Everything in `src/core/` is pure TypeScript with zero Svelte imports. These modules export pure functions that take state (or relevant slices) and return new state or calculation results. They are testable without a browser.

```typescript
// GOOD — pure function in core/
export function calculateNetWillingness(npc: NPC, bill: Bill, gameState: GameState): number { ... }

// BAD — importing Svelte in core/
import { get } from 'svelte/store'; // NEVER do this in core/
```

### Svelte Stores Are the Bridge

`src/stores/game.ts` holds a single writable store containing the full `GameState`. Derived stores in `derived.ts` compute filtered/projected views (e.g., "NPCs on my committee," "bills in the speaker queue"). Action functions in `actions.ts` call core engine functions and update the store.

```typescript
// stores/actions.ts
import { gameStore } from './game';
import { advanceCalendar } from '../core/calendar';

export function endSlot() {
  gameStore.update(state => advanceCalendar(state));
}
```

Components bind to stores. Components never contain game logic. If you're writing an `if` statement in a `.svelte` file that references game rules, move it to `core/`.

### Deterministic RNG

The game uses a seeded PRNG (e.g., a simple mulberry32 or xoshiro). The seed is set at game creation and stored in `GameState.seed`. All "random" events (NPC generation, headline selection, bark variant selection, gossip generation) use this seeded RNG. This makes games reproducible from seed for debugging and potential future replay features.

---

## Visual Rules — ABSOLUTE (from Style Guide)

These are not guidelines. They are hard constraints. Every violation is a bug.

### NEVER DO

- **No `border-radius`.** Every corner is a hard 90° pixel edge. Zero exceptions.
- **No gradients** (`linear-gradient`, `radial-gradient` on visible elements). The one exception is the mahogany dot-pattern background texture on the game stage, which uses `radial-gradient` for the dot pattern only.
- **No CSS transitions or animations.** State changes are instant. Hover highlights use `:hover` pseudo-class, not `transition`.
- **No opacity/transparency** except on drop shadows.
- **No lowercase text.** Every UI element uses `text-transform: uppercase`. If you see lowercase in the browser, it's a bug.
- **No fonts other than VT323.** No fallback fonts that look different. Load from Google Fonts.
- **No emoji in the game UI.** Emoji in the reference mockup's action bar are placeholders — replace with text labels.
- **No visible scrollbars.** If content overflows, the panel is too small — redesign the layout, don't add scroll.
- **No modal dialogs or overlays** (except quick interactions, which are the one overlay pattern). All information displays in panels within the game stage.
- **No `blur()`, `glow`, or `text-shadow` with blur.** Depth is conveyed with `box-shadow` using `0px` blur (hard pixel offsets).

### ALWAYS DO

- `image-rendering: pixelated` on all images and the body.
- `font-family: 'VT323', monospace` on everything.
- Use the CSS variables from the style guide's `:root` block. No hardcoded color values outside of `app.css`.
- Panel construction follows the marble + inset bevel + drop shadow pattern from the style guide.
- Buttons follow the Win95-style construction from the style guide.
- Portrait frames use the gilded frame pattern from the reference mockup.
- Color semantics are consistent: phosphor green = active/positive, amber = mandatory/caution, red = danger/threat, blue = interactive, cyan = tentative, gold = structural chrome.

---

## Player-Facing Information Rules — ABSOLUTE

These protect the imperfect-information design. Violations break the game's core tension.

### NEVER SHOW THE PLAYER

- **NPC temperament labels.** The words "Ideologue," "Follower," "Dealmaker," and "Opportunist" must never appear in any player-facing UI, tooltip, log, or debug output visible to the player. The player infers temperament from bark patterns. This is the game's skill ceiling.
- **Exact sentiment numbers.** The player sees tier labels only: HOSTILE, COLD, NEUTRAL, WARM, ALLIED. The underlying -100 to +100 score is hidden. No number, no bar fill, no percentage. Just the word.
- **Net Willingness scores.** The player sees NPC barks and behavior. Never the calculation that produced them.
- **Exact vote predictions.** Whip counts show estimates with built-in uncertainty, not guaranteed outcomes.
- **NPC-to-NPC deal details** unless discovered through gossip or meetings.
- **Presidential hidden stances** until revealed through the access tier system.
- **Report card percentage breakdowns** beyond the letter grade and percentage shown on the report card screen.

### ALWAYS SHOW THE PLAYER

- Sentiment tier labels on NPC profiles and during meetings.
- Report card letter grades and payout/attack consequences.
- Issue temperatures (Hot / Lukewarm / Cold) on the temperature tracker.
- The war chest as an exact dollar amount.
- Primary threat as an exact number with the defeat threshold visible.
- Day/slot, week number, primary countdown — all time information is precise.

---

## Screen Build Priority

Build in this order. Each tier must be playable before starting the next.

### Tier 1 — Minimum Viable Game (build first)

1. **Game Creation flow** (Screens 1.1–1.7) — without this, no game starts
2. **Dawn Brief** (Screen 2.1) — the daily loop entry point
3. **Slot Selection / Action Menu** (Screen 2.2) — how the player spends time
4. **Meeting Screen** (Screen 3.1) — the core interaction. Reference mockup exists (`hillzoo_v2.html`). This is the most complex screen.
5. **Floor Vote Screen** (Screen 4.4) — the dramatic climax
6. **Victory / Defeat Screens** (Screens 6.1–6.2) — game needs endings
7. **Members List** (Screen 5.1) — essential reference during play

### Tier 2 — Important But Not Blocking

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

---

## Coding Conventions

### TypeScript

- **Strict mode.** `"strict": true` in tsconfig. No `any` types except in test utilities.
- All game state types defined in `core/types.ts`. Components import from there.
- Discriminated unions for state machines (e.g., `BillStage = 'referral' | 'hearing' | 'markup' | 'budget' | 'queue' | 'floor' | 'president' | 'law' | 'dead'`).
- Enums are fine for fixed sets (temperament types, slot types, party names). String literal unions are fine too — be consistent within a module.
- No classes for game data. Plain objects + type interfaces. Classes are fine for engine services (the RNG, the storage adapter) but game state is always plain serializable objects.

### Svelte

- One component per screen. Reusable UI pieces in `components/`.
- Use `$:` reactive declarations to derive display values from stores. Don't compute in the template.
- Props for reusable components. Stores for game state. Don't pass game state as props through multiple levels.
- Component files should be thin — display logic only. If a function references game rules, it belongs in `core/`.

### CSS

- Global CSS variables in `app.css`. No component-scoped overrides of color variables.
- Use the style guide's panel/button/header construction patterns. Copy them literally.
- No utility-class frameworks. No Tailwind. Write plain CSS matching the style guide.
- Component-scoped `<style>` blocks in Svelte files for layout-specific styling. Global patterns in `app.css`.

### Data Files

- Bark corpus files are converted from markdown to TypeScript data structures (arrays of objects with typed fields: `tier`, `dominantDriver`, `temperament`, `variant`, `text`).
- Balance numbers are typed constants: `export const FUNDRAISER_BASE_YIELD = 800;`
- Headline templates are typed arrays with fields for event text, temperature shifts, and ripple effects.

---

## Key Mechanical Reminders for Implementation

These are the rules most likely to be missed or simplified incorrectly:

1. **The Decision Engine is ONE function.** `calculateNetWillingness()` runs every time the player asks any NPC for anything. Bark selection, vote decisions, trade evaluation, and meeting responses all flow from this single calculation. Do not create separate systems for different interaction types.

2. **Temperament multipliers apply to components 1–4 BEFORE summing.** Interest Alignment, Sentiment, Party Pressure, and District Pressure each get multiplied by the temperament-specific multiplier. Faction Pressure, Presidential Stance, and Situational Modifiers are NOT multiplied.

3. **Sentiment asymmetry.** Negative shifts are ~2× as impactful as positive shifts of the same category. Building from Neutral to Warm takes 5–8 positive interactions. Destroying it takes 1 betrayal.

4. **Sentiment decay targets baseline, not zero.** Each NPC has a baseline sentiment determined by starting factors. Decay drifts toward that baseline, not toward 0.

5. **The Whip's sentiment is anchored to party grade.** It drifts 5 points per week toward the grade-determined target. Meetings and favors still shift it, but they fight against grade-driven gravity.

6. **Report card cold start uses phantom votes.** Each faction starts with a prior of 2 phantom votes before any real votes are tracked. Grades aren't published until 3+ real votes are tracked.

7. **The Banana Lobby is not a standard faction.** It has its own meeting rules (player must request, Lobby may decline), disproportionate treasury, the Silent Chill Effect (quantified as faction pressure in the decision engine), and hidden trigger issues.

8. **Bark selection is a 5-step pipeline:** Net Willingness → response tier → check interjection triggers → identify dominant driver → filter by temperament → select random variant. Do not skip steps or collapse the pipeline.

9. **Floor vote arm-twisting is a special meeting mode** that happens during the vote, not before. Different bark corpus, different rules, costs war chest money. See System 8 in the GDD.

10. **The Speaker's Queue is a visible list** the player can see but not directly control. Influencing queue position is a strategic action, not a UI interaction.

---

## Testing Strategy

- Core engine functions (`core/`) should have unit tests. The Decision Engine especially — the GDD provides two worked examples (median same-party Follower and cultivated cross-party Dealmaker) that serve as test cases.
- Use the balance doc's "gut-check scenarios" as integration test cases.
- Visual testing is manual — open the browser, compare against the reference mockup.

---

## What "Done" Looks Like for Each Sprint

**Sprint 1 (Game Creation):** `npm run dev` opens the browser. Player clicks through all 7 creation steps. Choices are reflected in a generated `GameState` visible in devtools console (`window.__gameState`). All 49 NPCs exist with full profiles. Committees, factions, party agendas, issue temperatures, and the president are generated. Every screen matches the Civ I aesthetic from the reference mockup.

**Sprint 2 (Core Loop):** Player experiences Day 1. Dawn Brief appears. Player can select actions from the slot menu. Player can enter a meeting, see NPC barks driven by the real Decision Engine, and make asks/offers. Day advances through 3 slots. Calendar shows upcoming events.

**Sprint 3 (Legislative Path):** Player's bill moves through the full lifecycle — referral, hearing, markup, budget score, speaker queue, floor vote, presidential action. Victory and defeat screens fire correctly.

**Sprint 4 (Full Systems):** All 20 screens functional. Report cards, primary elections, headlines, gossip, quick interactions, caucus meetings, arm-twisting, NPC autonomous behavior all running. A complete game is playable from creation to ending.
