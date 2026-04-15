# Hill Zoo — Visual Style Guide

## Reference Implementation

The file `hillzoo_v2.html` is the canonical reference for the meeting screen. Load it in a browser to see the target aesthetic. All screens in the game should feel like they belong in the same application as that mockup.

---

## Aesthetic Identity

Hill Zoo looks like a 1991 strategy game that was rebuilt with modern CSS but kept its soul. The reference point is **Civilization I** — information-dense, pixel art portraits, no animations or transitions beyond functional state changes. Everything is static, sharp-edged, and rendered at low visual fidelity with high information fidelity.

The setting is a wood-paneled congressional chamber. The palette reflects mahogany desks, brass fixtures, marble floors, and green-phosphor CRT readouts. It should feel like a political war room, not a mobile game.

**Key principles:**

- No border-radius anywhere. Every corner is a hard 90-degree pixel edge.
- No gradients, glows, or blur effects. Depth is conveyed with `box-shadow` using `0px` blur (hard pixel offsets) and `inset` beveling.
- No animations or transitions except functional state changes (hover highlights, active tab swaps).
- `image-rendering: pixelated` on all images and the body.
- Information density is a feature, not a problem. Every pixel should earn its space.

---

## Typography

**Font:** `'VT323', monospace` — load from Google Fonts. This is the only font in the entire game. No secondary fonts, no fallback styling differences.

**Import:**
```html
<link href="https://fonts.googleapis.com/css2?family=VT323&display=swap" rel="stylesheet">
```

**Size scale (rem-based):**

| Use | Size | Context |
|---|---|---|
| Primary stat values | 1.6–2.0rem | Header bar numbers, big readouts |
| Dialogue / bark text | 1.5–1.7rem | NPC speech in the dialogue body |
| Menu options / buttons | 1.3rem | Verb options, action bar buttons |
| Labels, headers | 1.1–1.3rem | Dossier headers, agenda headers, tab labels |
| Secondary info | 1.0–1.05rem | Intel ledger lines, gossip items, source tags |

**All text is uppercase** via `text-transform: uppercase`. The game never displays lowercase text in any UI element.

---

## Color Palette

```css
:root {
    --mahogany: #3a130c;       /* Primary frame/border color, dark wood */
    --mahogany-light: #5d251a; /* Background texture dots, lighter wood */
    --mahogany-mid: #4a1a10;   /* Reference tab backgrounds */
    --marble: #c0c0c0;         /* Panel backgrounds (Win95 gray) */
    --marble-white: #e0e0e0;   /* Inset highlight (top-left bevel) */
    --marble-dark: #909090;    /* Inactive elements, secondary text */
    --gold: #b8860b;           /* Brass fixtures — header bar, active tabs, portrait frame */
    --gold-light: #edd18a;     /* Bevel highlight on gold surfaces */
    --black: #000000;          /* Borders, body background */
    --shadow: #1a0a08;         /* Game stage deep background */
    --phosphor-green: #33ff33; /* Intel ledger text, "active now" indicators */
    --phosphor-dim: #1a8a1a;   /* Secondary intel text */
    --primary-red: #aa0000;    /* Danger — primary threat, end-slot button, gossip header */
    --ega-blue: #0000aa;       /* Interactive option text (verb menu choices) */
    --ega-cyan: #00aaaa;       /* Active buttons, tentative bookings */
    --warm-amber: #cc8800;     /* Mandatory events, warning text */
}
```

### Color Semantics

These color assignments are consistent across every screen:

| Color | Meaning |
|---|---|
| Phosphor green | Current/active state, positive intel, "happening now" |
| Amber/warm-amber | Mandatory, forced, caution — things the player can't avoid |
| Primary red | Danger, threat, urgency — primary meter, end-of-slot, gossip alerts |
| EGA blue | Interactive choices — anything the player can click to take action |
| EGA cyan | Tentative / pending — bookings not yet confirmed, active toggle buttons |
| Gold | Structural chrome — headers, frames, active tabs, fixtures |
| Marble gray | Neutral panel backgrounds — information surfaces |
| Mahogany | Structural framing — borders, dark backgrounds, section dividers |
| Green (dark, #006600) | Positive relationship/alignment indicators |
| Red (dark, #aa0000) | Negative relationship/conflict indicators |

---

## Panel Construction

Every information panel in the game follows the same construction pattern:

```css
.panel {
    background: var(--marble);
    border: 3px solid var(--black);
    box-shadow:
        inset 3px 3px 0px var(--marble-white),   /* top-left highlight */
        inset -3px -3px 0px #707070,              /* bottom-right shadow */
        6px 6px 0px rgba(0,0,0,0.3);              /* drop shadow */
}
```

**Panel headers** use mahogany background with gold text:
```css
.panel-header {
    background: var(--mahogany);
    color: var(--gold);
    padding: 4px 12px;
    font-size: 1.2–1.3rem;
    border-bottom: 3px solid var(--black);
    text-transform: uppercase;
}
```

---

## Button Construction

**Standard button (marble, Win95-style):**
```css
.btn {
    background: var(--marble);
    border: 3px solid var(--black);
    padding: 8px 14px;
    font-size: 1.3rem;
    font-family: var(--pixel-font);
    cursor: pointer;
    box-shadow: inset 2px 2px 0px #fff, inset -2px -2px 0px #707070;
    text-transform: uppercase;
}
.btn:hover { background: var(--gold); }
```

**Active/toggled button:** Background `var(--ega-cyan)`, white text, cyan bevel shadows.

**Danger button (End Slot, destructive actions):** Background `var(--primary-red)`, white text, red bevel shadows.

**Disabled button:** Background `#888`, color `#555`, `cursor: not-allowed`.

---

## The Game Stage

The main play area is a fixed-size mahogany-bordered rectangle:

```css
.game-stage {
    width: 980px;
    height: 560px;
    background: var(--shadow);
    border: 6px solid var(--mahogany);
    position: relative;
    overflow: hidden;
}
```

The background uses a dot-pattern texture:
```css
.stage-background {
    background-color: var(--mahogany);
    background-image: radial-gradient(var(--mahogany-light) 1.5px, transparent 0);
    background-size: 4px 4px;
}
```

---

## Portrait Frames

NPC portraits are displayed in ornate gilded frames built from layered CSS box-shadows and positioned div elements. The frame has:

- **Outer border:** 4px solid black with pixel-stepped corner nubs
- **Gold body:** 14px padding, beveled with `inset` box-shadow (light top-left, dark bottom-right)
- **Inner groove:** 2px recessed border inside the gold body
- **Corner rosettes:** 12px squares at each corner with their own beveled highlights
- **Mid-edge studs:** 8px squares at the midpoint of each edge

The portrait image inside uses `object-fit: cover` with `object-position: center 15%` to prioritize showing the head/horns/features of each animal while cropping from the bottom.

The nameplate sits below the frame with a 6px gap — it is NOT fused to the frame border.

See the reference HTML for exact implementation.

---

## The Agenda Sidebar

A 180px-wide vertical panel to the right of the game stage. Uses the same mahogany border system. Interior is black (#0a0a0a) to contrast with the mahogany game stage.

Sections stack vertically: TODAY → TOMORROW → GOSSIP, separated by `border-bottom: 2px solid #222` (agenda sections) and `border-top: 2px solid var(--gold)` (gossip divider).

---

## The Intel Ledger (Phosphor Readout)

A black-background strip with green phosphor text, used wherever the game delivers strategic analysis to the player. Always appears at the bottom of the relevant panel.

```css
.intel-ledger {
    background: #000;
    padding: 8px 10px;
    font-size: 1.1rem;
    border-top: 3px solid var(--black);
    color: var(--phosphor-green);  /* #33ff33 */
    line-height: 1.3;
}
```

Secondary/hint text within the ledger uses `var(--phosphor-dim)` (#1a8a1a).

Each line is prefixed with `>` to evoke a terminal readout.

---

## Interaction Color Coding

**Sentiment/attitude tiers** use text color only (no backgrounds):

| Tier | Text Color | CSS class |
|---|---|---|
| Allied | #006600 | `.allied` |
| Warm | #006600 | `.warm` |
| Neutral | #444444 | `.neutral` |
| Cold | #aa0000 | `.cold` |
| Hostile | #aa0000 | `.hostile` |

**Interest alignment** in dossier views: `+` prefix with `.warm` color for aligned, `−` prefix with `.cold` color for conflicting.

---

## Screen Layout Pattern

The game uses a consistent three-tier vertical layout across all screens:

1. **Brass header bar** — persistent across all screens, gold background, 6 stat boxes
2. **Game stage + sidebar** — the main content area, wrapped in a flex container
3. **Action bar** — context-sensitive button row below the stage

The header and action bar always span the full width of stage + sidebar combined.

---

## What NOT to Do

- No rounded corners. Ever.
- No gradients or linear-gradient backgrounds.
- No opacity/transparency effects (except drop shadows).
- No CSS transitions or animations.
- No emoji in the game UI (emoji in the action bar buttons of the mockup are placeholder — replace with text or pixel icons).
- No lowercase text in any UI element.
- No sans-serif or serif fonts. VT323 only.
- No modal dialogs or overlays — all information is displayed in panels within the game stage.
- No scroll bars visible to the player. If content overflows, the panel is too small — redesign the layout.
