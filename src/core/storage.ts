/* ═══════════════════════════════════════════════════════════
   HILL ZOO — Storage Adapter
   Abstract interface + localStorage implementation.
   Game logic never calls storage directly.
   ═══════════════════════════════════════════════════════════ */

import type { GameState } from './types';

export interface StorageAdapter {
  save(key: string, state: GameState): Promise<void>;
  load(key: string): Promise<GameState | null>;
  delete(key: string): Promise<void>;
  listSaves(): Promise<string[]>;
}

const SAVE_PREFIX = 'hillzoo_save_';

export class LocalStorageAdapter implements StorageAdapter {
  async save(key: string, state: GameState): Promise<void> {
    const serialized = JSON.stringify(state);
    localStorage.setItem(SAVE_PREFIX + key, serialized);
  }

  async load(key: string): Promise<GameState | null> {
    const data = localStorage.getItem(SAVE_PREFIX + key);
    if (!data) return null;
    return JSON.parse(data) as GameState;
  }

  async delete(key: string): Promise<void> {
    localStorage.removeItem(SAVE_PREFIX + key);
  }

  async listSaves(): Promise<string[]> {
    const saves: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k && k.startsWith(SAVE_PREFIX)) {
        saves.push(k.slice(SAVE_PREFIX.length));
      }
    }
    return saves;
  }
}
