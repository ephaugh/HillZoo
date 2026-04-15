/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Utilities
   Seeded RNG, weighted random, shuffle, clamping, ID gen
   ═══════════════════════════════════════════════════════════ */

/**
 * Mulberry32 seeded PRNG.
 * Returns a function that produces deterministic floats [0, 1).
 */
export function createRng(seed: number): () => number {
  let s = seed | 0;
  return function () {
    s = (s + 0x6d2b79f5) | 0;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * Weighted random selection from an array.
 * weights[i] is the relative weight for items[i].
 */
export function weightedRandom<T>(rng: () => number, items: T[], weights: number[]): T {
  const totalWeight = weights.reduce((sum, w) => sum + w, 0);
  let r = rng() * totalWeight;
  for (let i = 0; i < items.length; i++) {
    r -= weights[i];
    if (r <= 0) return items[i];
  }
  return items[items.length - 1];
}

/**
 * Fisher-Yates shuffle using seeded RNG. Returns a new array.
 */
export function shuffle<T>(rng: () => number, array: readonly T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(rng() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

/**
 * Clamp a value between min and max (inclusive).
 */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

/**
 * Generate a short unique ID. Uses random hex.
 */
let idCounter = 0;
export function generateId(prefix = ''): string {
  idCounter++;
  const hex = idCounter.toString(16).padStart(4, '0');
  return prefix ? `${prefix}_${hex}` : hex;
}

/**
 * Pick a random item from an array.
 */
export function pick<T>(rng: () => number, array: readonly T[]): T {
  return array[Math.floor(rng() * array.length)];
}

/**
 * Pick N unique items from an array.
 */
export function pickN<T>(rng: () => number, array: readonly T[], n: number): T[] {
  const shuffled = shuffle(rng, array);
  return shuffled.slice(0, n);
}

/**
 * Random integer between min and max (inclusive).
 */
export function randomInt(rng: () => number, min: number, max: number): number {
  return Math.floor(rng() * (max - min + 1)) + min;
}

/**
 * Get the sentiment tier label from a numeric score.
 */
export function getSentimentTier(score: number): 'hostile' | 'cold' | 'neutral' | 'warm' | 'allied' {
  if (score <= -60) return 'hostile';
  if (score <= -20) return 'cold';
  if (score <= 20) return 'neutral';
  if (score <= 60) return 'warm';
  return 'allied';
}

/**
 * Narrative description of a sentiment shift. Player-facing.
 * Never returns a number. Use this anywhere the UI would otherwise show +5 / -3.
 */
export function getRelationshipChangeNarrative(shift: number): string {
  if (shift >= 8) return 'SEEMS GENUINELY PLEASED';
  if (shift >= 4) return 'SEEMS PLEASED';
  if (shift >= 1) return 'APPEARS SATISFIED';
  if (shift === 0) return 'NODS POLITELY';
  if (shift >= -3) return 'SEEMS SLIGHTLY PUT OFF';
  if (shift >= -7) return 'HARDENS VISIBLY';
  return 'VISIBLY ANGERED';
}

/**
 * Narrative description of a sentiment tier. Player-facing.
 */
export function getTierDescription(tier: 'hostile' | 'cold' | 'neutral' | 'warm' | 'allied'): string {
  switch (tier) {
    case 'hostile': return 'HOSTILE — WILL ACTIVELY WORK AGAINST YOU';
    case 'cold':    return 'COLD — DISTANT, RELUCTANT TO ENGAGE';
    case 'neutral': return 'NEUTRAL — NO STRONG LEANING';
    case 'warm':    return 'WARM — INCLINED TO WORK WITH YOU';
    case 'allied':  return 'ALLIED — WILL GO TO THE MAT FOR YOU';
  }
}
