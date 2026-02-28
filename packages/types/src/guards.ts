import { DIFF_KEYS, GameState } from './constants';
import type { DifficultyKey } from './constants';

/** Type guard for DifficultyKey values. */
export function isDifficultyKey(v: unknown): v is DifficultyKey {
  return typeof v === 'string' && DIFF_KEYS.includes(v as DifficultyKey);
}

/** Type guard for GameState values. */
export function isGameState(v: unknown): v is GameState {
  return typeof v === 'string' && Object.values(GameState).includes(v as GameState);
}

/** Safely parse a JSON string, returning a fallback on failure. */
export function safeJsonParse<T>(raw: string, fallback: T): T {
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}
