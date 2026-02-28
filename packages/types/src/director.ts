import type { DifficultyKey } from './constants';

/** Identifiers for pipe-placement pattern generators. */
export const PatternType = {
  Scatter: 'scatter',
  StairUp: 'stairUp',
  StairDown: 'stairDown',
  SineWave: 'sineWave',
  Zigzag: 'zigzag',
  Tunnel: 'tunnel',
  Squeeze: 'squeeze',
  Rapids: 'rapids',
  Drift: 'drift',
} as const;
export type PatternType = (typeof PatternType)[keyof typeof PatternType];

/** Narrative arc phases that create tension/release cycles within a run. */
export const MovementArc = {
  Build: 'build',
  Climax: 'climax',
  Release: 'release',
} as const;
export type MovementArc = (typeof MovementArc)[keyof typeof MovementArc];

/** Blueprint for a single pipe's placement before winnability validation. */
export interface PipeIntent {
  /** Y position of the center of the gap. */
  gapCenter: number;
  /** Vertical size of the gap in pixels. */
  gapSize: number;
  /** Millisecond delay from the previous pipe spawn (0 = use phase default). */
  delay: number;
}

/** Configuration for a single score-based progression phase. */
export interface PhaseConfig {
  /** Human-readable phase name (e.g. "Warmup", "Intensification"). */
  name: string;
  /** Score at which this phase begins. */
  scoreThreshold: number;
  /** Multiplier on base gap size (1.0 = unchanged, < 1.0 = tighter). */
  gapMultiplier: number;
  /** Multiplier on pipe scroll speed (> 1.0 = faster). */
  speedMultiplier: number;
  /** Multiplier on spawn interval (< 1.0 = faster spawning). */
  spawnMultiplier: number;
  /** Probability weight for each pattern type in this phase. */
  patternWeights: Record<PatternType, number>;
  /** Insert a breather every N phrases. */
  breatherFrequency: number;
  /** [min, max] intensity range for pattern parameters (0.0–1.0). */
  intensityRange: [number, number];
}

/** A scored milestone that triggers a celebration. */
export interface MilestoneThreshold {
  /** Score at which the milestone fires. */
  score: number;
  /** Display label (e.g. "Century", "It's Over 9000"). */
  label: string;
  /** Visual celebration scale. */
  celebration: 'minor' | 'major' | 'epic';
}

/** Complete personality definition for a difficulty level. */
export interface DifficultyProfile {
  /** Which difficulty this profile belongs to. */
  key: DifficultyKey;
  /** Thematic name (e.g. "The Adventure", "The Crucible"). */
  name: string;
  /** Short flavor text for the UI. */
  subtitle: string;
  /** Ordered progression phases (ascending by scoreThreshold). */
  phases: PhaseConfig[];
  /** Winnability margin (0.0 = frame-perfect, 1.0 = trivial). */
  graceFactor: number;
  /** Score-based milestone definitions. */
  milestones: MilestoneThreshold[];
  /** Absolute minimum gap size in pixels. */
  gapFloor: number;
  /** Absolute maximum pipe speed in pixels/tick. */
  speedCeiling: number;
  /** Whether gap size varies per-pipe (Souls feature). */
  hasGapVariation: boolean;
  /** +- pixels of per-pipe gap variation. */
  gapVariationAmount: number;
  /** Whether spawn timing varies per-pipe (Souls feature). */
  hasTimingVariation: boolean;
  /** +- milliseconds of per-pipe spawn timing variation. */
  timingVariationAmount: number;
  /** Pixel margin for near-miss detection. */
  nearMissMargin: number;
}

/** Snapshot of the progression manager's current state. */
export interface ProgressionState {
  /** Name of the active phase (e.g. "Warmup", "Mastery"). */
  phaseName: string;
  /** Index into the profile's phases array. */
  phaseIndex: number;
  /** Current position in the build/climax/release arc. */
  arc: MovementArc;
  /** Effective gap size after phase multiplier + floor clamping. */
  effectiveGap: number;
  /** Effective pipe speed after phase multiplier + ceiling clamping. */
  effectiveSpeed: number;
  /** Effective spawn delay after phase multiplier. */
  effectiveSpawnDelay: number;
  /** Consecutive pipes passed without a near-miss. */
  cleanStreak: number;
  /** Total near-misses in the current run. */
  clutchCount: number;
  /** Longest clean streak achieved this run. */
  longestCleanStreak: number;
}
