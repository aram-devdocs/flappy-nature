import { RGBA_TOKENS, cssVar } from './tokens';

/** GameState maps semantic names to game lifecycle string literals. */
export const GameState = {
  Idle: 'idle',
  Play: 'play',
  Dead: 'dead',
  Paused: 'paused',
} as const;

/** Current state of the game lifecycle. */
export type GameState = (typeof GameState)[keyof typeof GameState];

/** Difficulty maps semantic names to difficulty string literals. */
export const Difficulty = {
  Easy: 'easy',
  Normal: 'normal',
  Hard: 'hard',
  Souls: 'souls',
} as const;

/** Identifier for a difficulty level. */
export type DifficultyKey = (typeof Difficulty)[keyof typeof Difficulty];

/** localStorage key constants for persisted game data (v3 prefix). */
export const STORAGE_KEYS = {
  bestScores: 'fg-v3-best',
  difficulty: 'fg-v3-diff',
  nickname: 'fg-v3-nickname',
  leaderboard: 'fg-v3-leaderboard',
  migrated: 'fg-v3-migrated',
} as const;

/** Ordered list of all difficulty keys. */
export const DIFF_KEYS: DifficultyKey[] = Object.values(Difficulty);

/** Human-readable labels for each difficulty level. */
export const DIFF_LABELS: Record<DifficultyKey, string> = {
  [Difficulty.Easy]: 'Easy',
  [Difficulty.Normal]: 'Normal',
  [Difficulty.Hard]: 'Hard',
  [Difficulty.Souls]: 'Souls',
};

/** Per-difficulty best scores persisted across sessions. */
export type BestScores = Record<DifficultyKey, number>;

/** Create a zeroed-out best scores record for all difficulty levels. */
export function createEmptyBestScores(): BestScores {
  return Object.fromEntries(DIFF_KEYS.map((k) => [k, 0])) as BestScores;
}

/** Resolve accent/bg/border colors for a difficulty, handling the souls variant. */
export function getDifficultyColors(key: DifficultyKey) {
  const isSouls = key === Difficulty.Souls;
  return {
    accent: isSouls ? cssVar('souls') : cssVar('violet'),
    bgSubtle: isSouls ? RGBA_TOKENS.soulsBgSubtle : RGBA_TOKENS.violetBgSubtle,
    borderSubtle: isSouls ? RGBA_TOKENS.soulsBorderSubtle : RGBA_TOKENS.violetBorderSubtle,
  };
}
