/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Game Store
   Single writable store holding the full GameState.
   Null before game creation.
   ═══════════════════════════════════════════════════════════ */

import { writable } from 'svelte/store';
import type { GameState } from '../core/types';

export const gameStore = writable<GameState | null>(null);

// Expose to devtools in dev mode
if (import.meta.env.DEV) {
  gameStore.subscribe((state) => {
    (window as unknown as Record<string, unknown>).__gameState = state;
  });
}
