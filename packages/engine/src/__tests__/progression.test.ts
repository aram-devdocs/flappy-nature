import type { DifficultyProfile, GameConfig, PhaseConfig } from '@repo/types';
import { MovementArc, PatternType } from '@repo/types';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { DEFAULT_CONFIG } from '../config';
import { EngineEventEmitter } from '../engine-events';
import { ProgressionManager } from '../progression';

vi.mock('../persistence.js', () => ({
  saveBestScores: vi.fn(),
  saveDifficulty: vi.fn(),
}));

const ALL_ZERO_WEIGHTS: Record<string, number> = Object.fromEntries(
  Object.values(PatternType).map((p) => [p, 0]),
);

function makePhase(overrides: Partial<PhaseConfig> = {}): PhaseConfig {
  return {
    name: 'TestPhase',
    scoreThreshold: 0,
    gapMultiplier: 1.0,
    speedMultiplier: 1.0,
    spawnMultiplier: 1.0,
    patternWeights: ALL_ZERO_WEIGHTS as PhaseConfig['patternWeights'],
    breatherFrequency: 3,
    intensityRange: [0, 0.5],
    ...overrides,
  };
}

function makeProfile(overrides: Partial<DifficultyProfile> = {}): DifficultyProfile {
  return {
    key: 'normal',
    name: 'Test',
    subtitle: 'test profile',
    phases: [
      makePhase({ name: 'Warmup', scoreThreshold: 0 }),
      makePhase({ name: 'Rising', scoreThreshold: 10, gapMultiplier: 0.95 }),
      makePhase({
        name: 'Development',
        scoreThreshold: 30,
        gapMultiplier: 0.9,
        speedMultiplier: 1.1,
      }),
      makePhase({ name: 'Mastery', scoreThreshold: 60, gapMultiplier: 0.8, speedMultiplier: 1.2 }),
    ],
    graceFactor: 0.25,
    milestones: [
      { score: 10, label: 'Getting Started', celebration: 'minor' },
      { score: 25, label: 'Warmed Up', celebration: 'minor' },
      { score: 50, label: 'Half Century', celebration: 'major' },
      { score: 100, label: 'Century', celebration: 'major' },
    ],
    gapFloor: 100,
    speedCeiling: 5.0,
    hasGapVariation: false,
    gapVariationAmount: 0,
    hasTimingVariation: false,
    timingVariationAmount: 0,
    nearMissMargin: 10,
    ...overrides,
  };
}

function makeConfig(overrides: Partial<GameConfig> = {}): GameConfig {
  return { ...DEFAULT_CONFIG, ...overrides };
}

describe('ProgressionManager', () => {
  let events: EngineEventEmitter;
  let pm: ProgressionManager;
  let config: GameConfig;
  let profile: DifficultyProfile;

  beforeEach(() => {
    events = new EngineEventEmitter();
    profile = makeProfile();
    config = makeConfig();
    pm = new ProgressionManager(profile, config, events);
  });

  describe('initial state', () => {
    it('starts at phase 0 (Warmup)', () => {
      expect(pm.phase.name).toBe('Warmup');
      expect(pm.phaseIndex).toBe(0);
    });

    it('computes effective values from base config and phase multipliers', () => {
      expect(pm.effectiveGap).toBe(config.pipeGap * 1.0);
      expect(pm.effectiveSpeed).toBe(config.pipeSpeed * 1.0);
      expect(pm.effectiveSpawnDelay).toBe(config.pipeSpawn * 1.0);
    });

    it('starts with zero streak stats', () => {
      expect(pm.cleanStreak).toBe(0);
      expect(pm.clutchCount).toBe(0);
      expect(pm.longestCleanStreak).toBe(0);
    });
  });

  describe('phase transitions', () => {
    it('advances to phase 1 when score reaches threshold', () => {
      const handler = vi.fn();
      events.on('phaseChange', handler);

      pm.onScore(10);
      expect(pm.phase.name).toBe('Rising');
      expect(pm.phaseIndex).toBe(1);
      expect(handler).toHaveBeenCalledWith('Rising');
    });

    it('skips intermediate phases when score jumps ahead', () => {
      const handler = vi.fn();
      events.on('phaseChange', handler);

      pm.onScore(60);
      expect(pm.phase.name).toBe('Mastery');
      expect(pm.phaseIndex).toBe(3);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith('Mastery');
    });

    it('does not emit phaseChange when score stays in same phase', () => {
      const handler = vi.fn();
      events.on('phaseChange', handler);

      pm.onScore(5);
      pm.onScore(7);
      pm.onScore(9);
      expect(handler).not.toHaveBeenCalled();
      expect(pm.phase.name).toBe('Warmup');
    });

    it('stays at highest phase when score far exceeds all thresholds', () => {
      pm.onScore(9999);
      expect(pm.phase.name).toBe('Mastery');
      expect(pm.phaseIndex).toBe(3);
    });

    it('updates effective multipliers after phase change', () => {
      pm.onScore(30);
      expect(pm.effectiveGap).toBeCloseTo(config.pipeGap * 0.9);
      expect(pm.effectiveSpeed).toBeCloseTo(config.pipeSpeed * 1.1);
    });
  });

  describe('effective value clamping', () => {
    it('clamps gap to gapFloor when multiplier pushes below', () => {
      const tightProfile = makeProfile({
        phases: [makePhase({ gapMultiplier: 0.5 })],
        gapFloor: 100,
      });
      const tightPm = new ProgressionManager(tightProfile, config, events);
      expect(tightPm.effectiveGap).toBe(100);
    });

    it('clamps speed to speedCeiling when multiplier pushes above', () => {
      const fastProfile = makeProfile({
        phases: [makePhase({ speedMultiplier: 5.0 })],
        speedCeiling: 5.0,
      });
      const fastPm = new ProgressionManager(fastProfile, config, events);
      expect(fastPm.effectiveSpeed).toBe(5.0);
    });

    it('does not clamp when values are within bounds', () => {
      expect(pm.effectiveGap).toBe(config.pipeGap);
      expect(pm.effectiveSpeed).toBe(config.pipeSpeed);
    });
  });

  describe('milestones', () => {
    it('emits milestone events when score reaches thresholds', () => {
      const handler = vi.fn();
      events.on('milestone', handler);

      pm.onScore(10);
      expect(handler).toHaveBeenCalledWith(10, 'Getting Started', 'minor');
    });

    it('emits multiple milestones when score jumps past several', () => {
      const handler = vi.fn();
      events.on('milestone', handler);

      pm.onScore(50);
      expect(handler).toHaveBeenCalledTimes(3);
      expect(handler).toHaveBeenNthCalledWith(1, 10, 'Getting Started', 'minor');
      expect(handler).toHaveBeenNthCalledWith(2, 25, 'Warmed Up', 'minor');
      expect(handler).toHaveBeenNthCalledWith(3, 50, 'Half Century', 'major');
    });

    it('does not re-emit milestones already passed', () => {
      const handler = vi.fn();
      events.on('milestone', handler);

      pm.onScore(10);
      handler.mockClear();

      pm.onScore(15);
      expect(handler).not.toHaveBeenCalled();
    });

    it('emits remaining milestones on subsequent score changes', () => {
      const handler = vi.fn();
      events.on('milestone', handler);

      pm.onScore(10);
      expect(handler).toHaveBeenCalledTimes(1);
      handler.mockClear();

      pm.onScore(25);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(25, 'Warmed Up', 'minor');
    });

    it('does not emit when score is below first milestone', () => {
      const handler = vi.fn();
      events.on('milestone', handler);

      pm.onScore(5);
      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('streak tracking', () => {
    it('increments clean streak on clean passes', () => {
      pm.recordCleanPass();
      pm.recordCleanPass();
      pm.recordCleanPass();
      expect(pm.cleanStreak).toBe(3);
      expect(pm.longestCleanStreak).toBe(3);
    });

    it('resets clean streak on near-miss', () => {
      pm.recordCleanPass();
      pm.recordCleanPass();
      pm.recordNearMiss();
      expect(pm.cleanStreak).toBe(0);
      expect(pm.clutchCount).toBe(1);
    });

    it('preserves longest clean streak across resets from near-miss', () => {
      pm.recordCleanPass();
      pm.recordCleanPass();
      pm.recordCleanPass();
      pm.recordNearMiss();
      pm.recordCleanPass();
      expect(pm.longestCleanStreak).toBe(3);
      expect(pm.cleanStreak).toBe(1);
    });

    it('updates longest streak when new streak exceeds old record', () => {
      pm.recordCleanPass();
      pm.recordCleanPass();
      pm.recordNearMiss();
      pm.recordCleanPass();
      pm.recordCleanPass();
      pm.recordCleanPass();
      pm.recordCleanPass();
      expect(pm.longestCleanStreak).toBe(4);
    });

    it('accumulates clutch count across multiple near-misses', () => {
      pm.recordNearMiss();
      pm.recordNearMiss();
      pm.recordNearMiss();
      expect(pm.clutchCount).toBe(3);
    });
  });

  describe('snapshot', () => {
    it('returns all progression state fields', () => {
      pm.onScore(30);
      pm.recordCleanPass();
      pm.recordCleanPass();
      pm.recordNearMiss();

      const snap = pm.snapshot(MovementArc.Climax);
      expect(snap).toEqual({
        phaseName: 'Development',
        phaseIndex: 2,
        arc: 'climax',
        effectiveGap: config.pipeGap * 0.9,
        effectiveSpeed: config.pipeSpeed * 1.1,
        effectiveSpawnDelay: config.pipeSpawn * 1.0,
        cleanStreak: 0,
        clutchCount: 1,
        longestCleanStreak: 2,
      });
    });

    it('defaults arc to Build when not specified', () => {
      const snap = pm.snapshot();
      expect(snap.arc).toBe('build');
    });
  });

  describe('reset', () => {
    it('clears all progression state back to initial', () => {
      pm.onScore(60);
      pm.recordCleanPass();
      pm.recordCleanPass();
      pm.recordNearMiss();

      pm.reset();

      expect(pm.phaseIndex).toBe(0);
      expect(pm.phase.name).toBe('Warmup');
      expect(pm.cleanStreak).toBe(0);
      expect(pm.clutchCount).toBe(0);
      expect(pm.longestCleanStreak).toBe(0);
    });

    it('re-emits milestones after reset and new score', () => {
      const handler = vi.fn();
      events.on('milestone', handler);

      pm.onScore(10);
      expect(handler).toHaveBeenCalledTimes(1);
      handler.mockClear();

      pm.reset();
      pm.onScore(10);
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith(10, 'Getting Started', 'minor');
    });

    it('re-emits phaseChange after reset and new score', () => {
      const handler = vi.fn();
      events.on('phaseChange', handler);

      pm.onScore(30);
      handler.mockClear();

      pm.reset();
      pm.onScore(30);
      expect(handler).toHaveBeenCalledWith('Development');
    });
  });

  describe('edge cases', () => {
    it('handles a profile with a single phase', () => {
      const single = makeProfile({
        phases: [makePhase({ name: 'Only', scoreThreshold: 0 })],
      });
      const singlePm = new ProgressionManager(single, config, events);
      const handler = vi.fn();
      events.on('phaseChange', handler);

      singlePm.onScore(9999);
      expect(singlePm.phase.name).toBe('Only');
      expect(handler).not.toHaveBeenCalled();
    });

    it('handles a profile with no milestones', () => {
      const noMilestones = makeProfile({ milestones: [] });
      const nmPm = new ProgressionManager(noMilestones, config, events);
      const handler = vi.fn();
      events.on('milestone', handler);

      nmPm.onScore(9999);
      expect(handler).not.toHaveBeenCalled();
    });

    it('handles score of exactly 0', () => {
      const handler = vi.fn();
      events.on('phaseChange', handler);

      pm.onScore(0);
      expect(pm.phase.name).toBe('Warmup');
      expect(handler).not.toHaveBeenCalled();
    });
  });
});
