/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Sentiment System
   Shifts, decay, tier mapping.
   Pure TypeScript — no Svelte imports.
   ═══════════════════════════════════════════════════════════ */

import type { GameState, SentimentTier } from './types';
import { clamp, getSentimentTier } from './utils';

/**
 * Apply a sentiment shift to an NPC.
 * Negative shifts are ~2x as impactful as positive (asymmetry).
 * Returns updated sentiment record.
 */
export function shiftSentiment(
  state: GameState,
  npcId: string,
  rawShift: number,
): Record<string, number> {
  const current = state.sentiment[npcId] ?? 0;
  // Asymmetry: negative shifts amplified
  const effectiveShift = rawShift < 0 ? rawShift * 1.5 : rawShift;
  const newValue = clamp(current + effectiveShift, -100, 100);
  return { ...state.sentiment, [npcId]: Math.round(newValue) };
}

/**
 * Apply weekly sentiment decay. Drifts toward baseline, not zero.
 */
export function decaySentiment(
  sentiment: Record<string, number>,
  npcs: { id: string; sentimentBaseline: number; party: string }[],
  playerParty: string,
): Record<string, number> {
  const result = { ...sentiment };
  for (const npc of npcs) {
    const current = result[npc.id] ?? 0;
    const baseline = npc.sentimentBaseline;
    if (current === baseline) continue;

    // Decay rate: 1-2 points per week
    // Same party decays slower, cross-party faster
    // Allied decays slowest, Warm decays fastest
    const sameParty = npc.party === playerParty;
    const tier = getSentimentTier(current);
    let rate = sameParty ? 1 : 2;
    if (tier === 'allied') rate = 0.5;
    else if (tier === 'warm') rate = 2;

    if (current > baseline) {
      result[npc.id] = Math.max(baseline, Math.round(current - rate));
    } else {
      result[npc.id] = Math.min(baseline, Math.round(current + rate));
    }
  }
  return result;
}

/**
 * Get the sentiment tier label for display.
 */
export function getSentimentLabel(score: number): string {
  const tier = getSentimentTier(score);
  return tier.toUpperCase();
}

/**
 * Get the CSS class for a sentiment tier.
 */
export function getSentimentClass(score: number): string {
  return getSentimentTier(score);
}
