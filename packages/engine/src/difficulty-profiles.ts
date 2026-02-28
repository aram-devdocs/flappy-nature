import { Difficulty, PatternType } from '@repo/types';
import type {
  DifficultyKey,
  DifficultyProfile,
  MilestoneThreshold,
  PhaseConfig,
} from '@repo/types';

const P = PatternType;
const PK = [
  P.Scatter,
  P.StairUp,
  P.StairDown,
  P.SineWave,
  P.Zigzag,
  P.Tunnel,
  P.Squeeze,
  P.Rapids,
  P.Drift,
] as const;

function pw(v: number[]): Record<PatternType, number> {
  return Object.fromEntries(PK.map((k, i) => [k, v[i] ?? 0])) as Record<PatternType, number>;
}

// Tiers: [scatter, stairUp, stairDown, sineWave, zigzag, tunnel, squeeze, rapids, drift]
const W_WARMUP = pw([3, 0, 0, 0, 0, 0, 0, 0, 2]);
const W_BASIC = pw([3, 2, 2, 2, 0, 0, 0, 0, 1]);
const W_MID = pw([2, 2, 2, 2, 0, 2, 0, 0, 1]);
const W_VARIED = pw([2, 2, 2, 2, 1, 2, 0, 0, 1]);
const W_INTENSE = pw([2, 2, 2, 2, 2, 2, 2, 0, 1]);
const W_FULL = pw([2, 2, 2, 2, 3, 2, 2, 2, 1]);
const W_AGGRO = pw([1, 2, 2, 1, 4, 2, 3, 3, 1]);

function ph(
  name: string,
  score: number,
  gap: number,
  speed: number,
  spawn: number,
  breather: number,
  intensity: [number, number],
  patterns: Record<PatternType, number>,
): PhaseConfig {
  return {
    name,
    scoreThreshold: score,
    gapMultiplier: gap,
    speedMultiplier: speed,
    spawnMultiplier: spawn,
    breatherFrequency: breather,
    intensityRange: intensity,
    patternWeights: patterns,
  };
}

export const MILESTONES: MilestoneThreshold[] = [
  { score: 10, label: 'Getting Started', celebration: 'minor' },
  { score: 25, label: 'Warmed Up', celebration: 'minor' },
  { score: 50, label: 'Half Century', celebration: 'major' },
  { score: 100, label: 'Century', celebration: 'major' },
  { score: 250, label: 'Quarter K', celebration: 'major' },
  { score: 500, label: 'Half K', celebration: 'epic' },
  { score: 1000, label: 'Thousand Club', celebration: 'epic' },
  { score: 2000, label: 'Double K', celebration: 'epic' },
  { score: 3000, label: 'Triple K', celebration: 'epic' },
  { score: 5000, label: 'Five Thousand', celebration: 'epic' },
  { score: 7000, label: 'Seven K', celebration: 'epic' },
  { score: 8001, label: 'The Final Stretch', celebration: 'epic' },
  { score: 9000, label: "It's Over 9000", celebration: 'epic' },
];

const EASY: DifficultyProfile = {
  key: Difficulty.Easy,
  name: 'The Adventure',
  subtitle: 'A relaxing journey through the landscape',
  graceFactor: 0.4,
  gapFloor: 130,
  speedCeiling: 3.0,
  nearMissMargin: 14,
  hasGapVariation: false,
  gapVariationAmount: 0,
  hasTimingVariation: false,
  timingVariationAmount: 0,
  milestones: MILESTONES,
  phases: [
    ph('Warmup', 0, 1.1, 0.9, 1.1, 2, [0.0, 0.2], W_WARMUP),
    ph('Rising', 15, 1.05, 0.95, 1.05, 2, [0.1, 0.3], W_BASIC),
    ph('Development', 40, 1.0, 1.0, 1.0, 3, [0.15, 0.4], W_MID),
    ph('Intensification', 80, 0.95, 1.05, 0.97, 3, [0.2, 0.5], W_VARIED),
    ph('Mastery', 200, 0.9, 1.08, 0.94, 3, [0.25, 0.55], W_INTENSE),
    ph('Endurance', 500, 0.85, 1.12, 0.9, 4, [0.3, 0.6], W_FULL),
    ph('Marathon', 1200, 0.8, 1.18, 0.87, 5, [0.35, 0.65], W_FULL),
    ph('Legendary', 3000, 0.77, 1.22, 0.83, 6, [0.4, 0.7], W_FULL),
    ph('Mythic', 6000, 0.72, 1.28, 0.8, 7, [0.45, 0.75], W_FULL),
    ph('Final', 8001, 0.65, 1.4, 0.73, 9, [0.5, 0.8], W_FULL),
  ],
};

const NORMAL: DifficultyProfile = {
  key: Difficulty.Normal,
  name: 'The Challenge',
  subtitle: 'The definitive Flappy Gouda experience',
  graceFactor: 0.25,
  gapFloor: 130,
  speedCeiling: 3.5,
  nearMissMargin: 10,
  hasGapVariation: false,
  gapVariationAmount: 0,
  hasTimingVariation: false,
  timingVariationAmount: 0,
  milestones: MILESTONES,
  phases: [
    ph('Warmup', 0, 1.05, 0.95, 1.05, 2, [0.1, 0.3], W_WARMUP),
    ph('Rising', 6, 1.0, 1.0, 1.0, 3, [0.15, 0.4], W_BASIC),
    ph('Development', 16, 0.95, 1.05, 0.97, 3, [0.2, 0.5], W_MID),
    ph('Intensification', 36, 0.9, 1.1, 0.94, 4, [0.3, 0.6], W_INTENSE),
    ph('Mastery', 61, 0.85, 1.15, 0.9, 4, [0.4, 0.7], W_FULL),
    ph('Endurance', 151, 0.8, 1.2, 0.87, 5, [0.5, 0.8], W_FULL),
    ph('Marathon', 501, 0.77, 1.25, 0.83, 6, [0.6, 0.85], W_FULL),
    ph('Legendary', 2001, 0.73, 1.3, 0.8, 7, [0.7, 0.9], W_FULL),
    ph('Mythic', 5001, 0.68, 1.35, 0.77, 8, [0.8, 0.95], W_FULL),
    ph('Final', 8001, 0.65, 1.4, 0.73, 9, [0.9, 1.0], W_FULL),
  ],
};

const HARD: DifficultyProfile = {
  key: Difficulty.Hard,
  name: 'The Gauntlet',
  subtitle: 'You know what you signed up for',
  graceFactor: 0.12,
  gapFloor: 108,
  speedCeiling: 4.5,
  nearMissMargin: 6,
  hasGapVariation: false,
  gapVariationAmount: 0,
  hasTimingVariation: false,
  timingVariationAmount: 0,
  milestones: MILESTONES,
  phases: [
    ph('Warmup', 0, 1.0, 1.0, 1.0, 3, [0.2, 0.5], W_VARIED),
    ph('Rising', 3, 0.97, 1.03, 0.98, 3, [0.3, 0.6], W_VARIED),
    ph('Development', 8, 0.93, 1.07, 0.96, 3, [0.35, 0.65], W_VARIED),
    ph('Intensification', 15, 0.88, 1.12, 0.92, 4, [0.4, 0.7], W_INTENSE),
    ph('Mastery', 30, 0.82, 1.18, 0.88, 4, [0.5, 0.8], W_FULL),
    ph('Endurance', 80, 0.77, 1.24, 0.84, 5, [0.6, 0.85], W_AGGRO),
    ph('Marathon', 250, 0.73, 1.3, 0.8, 5, [0.7, 0.9], W_AGGRO),
    ph('Legendary', 800, 0.68, 1.36, 0.77, 6, [0.75, 0.93], W_AGGRO),
    ph('Mythic', 3000, 0.63, 1.42, 0.73, 7, [0.85, 0.97], W_AGGRO),
    ph('Final', 8001, 0.58, 1.5, 0.7, 8, [0.9, 1.0], W_AGGRO),
  ],
};

const SOULS: DifficultyProfile = {
  key: Difficulty.Souls,
  name: 'The Crucible',
  subtitle: 'The Crucible spares no one',
  graceFactor: 0.05,
  gapFloor: 90,
  speedCeiling: 5.5,
  nearMissMargin: 3,
  hasGapVariation: true,
  gapVariationAmount: 15,
  hasTimingVariation: true,
  timingVariationAmount: 200,
  milestones: MILESTONES,
  phases: [
    ph('Warmup', 0, 1.0, 1.0, 1.0, 4, [0.4, 0.7], W_AGGRO),
    ph('Rising', 2, 0.95, 1.05, 0.97, 4, [0.5, 0.8], W_AGGRO),
    ph('Development', 5, 0.9, 1.1, 0.94, 5, [0.55, 0.83], W_AGGRO),
    ph('Intensification', 10, 0.85, 1.15, 0.9, 5, [0.6, 0.87], W_AGGRO),
    ph('Mastery', 20, 0.8, 1.2, 0.87, 5, [0.65, 0.9], W_AGGRO),
    ph('Endurance', 50, 0.75, 1.25, 0.83, 6, [0.7, 0.93], W_AGGRO),
    ph('Marathon', 150, 0.7, 1.3, 0.8, 6, [0.8, 0.95], W_AGGRO),
    ph('Legendary', 500, 0.65, 1.36, 0.77, 6, [0.85, 0.97], W_AGGRO),
    ph('Mythic', 2000, 0.6, 1.42, 0.73, 7, [0.9, 0.99], W_AGGRO),
    ph('Final', 8001, 0.55, 1.5, 0.7, 7, [0.95, 1.0], W_AGGRO),
  ],
};

export const DIFFICULTY_PROFILES: Record<DifficultyKey, DifficultyProfile> = {
  [Difficulty.Easy]: EASY,
  [Difficulty.Normal]: NORMAL,
  [Difficulty.Hard]: HARD,
  [Difficulty.Souls]: SOULS,
};

export function getDifficultyProfile(key: DifficultyKey): DifficultyProfile {
  return DIFFICULTY_PROFILES[key];
}
