import type { BestScores, DifficultyKey } from '@repo/types';
import {
  DIFF_KEYS,
  Difficulty,
  STORAGE_KEYS,
  createEmptyBestScores,
  isDifficultyKey,
} from '@repo/types';
import { createLogger } from './logger';
import { safeGet, safeSet } from './safe-storage';

const log = createLogger('persistence');

const MAX_SCORE = 9999;

/** Load per-difficulty best scores from localStorage, migrating the legacy single-score key if needed. */
export function loadBestScores(): BestScores {
  const scores = createEmptyBestScores();
  try {
    const raw = safeGet(STORAGE_KEYS.bestScores);
    if (raw) {
      const parsed = JSON.parse(raw) as Record<string, unknown>;
      for (const k of DIFF_KEYS) {
        if (
          typeof parsed[k] === 'number' &&
          (parsed[k] as number) > 0 &&
          (parsed[k] as number) <= MAX_SCORE
        ) {
          scores[k] = parsed[k] as number;
        }
      }
    }
    if (!raw) {
      const old = Number.parseInt(safeGet('fg-flappy-best') ?? '0', 10);
      if (old > 0) {
        scores.normal = old;
        saveBestScores(scores);
        localStorage.removeItem('fg-flappy-best');
      }
    }
  } catch (e) {
    log.warn('Failed to load best scores from localStorage', { error: String(e) });
  }
  return scores;
}

/** Persist best scores to localStorage. */
export function saveBestScores(scores: BestScores): void {
  safeSet(STORAGE_KEYS.bestScores, JSON.stringify(scores));
}

/** Load the saved difficulty preference from localStorage, defaulting to normal. */
export function loadDifficulty(): DifficultyKey {
  const stored = safeGet(STORAGE_KEYS.difficulty);
  if (isDifficultyKey(stored)) return stored;
  return Difficulty.Normal;
}

/** Persist the selected difficulty key to localStorage. */
export function saveDifficulty(key: DifficultyKey): void {
  safeSet(STORAGE_KEYS.difficulty, key);
}
