import type { Bird, DifficultyKey, GameConfig, MilestoneThreshold, Pipe } from '@repo/types';
import { Difficulty } from '@repo/types';
import { atIndex } from './assert';
import type { EngineEventEmitter } from './engine-events';

const NEAR_MISS_MARGINS: Record<DifficultyKey, number> = {
  [Difficulty.Easy]: 14,
  [Difficulty.Normal]: 10,
  [Difficulty.Hard]: 6,
  [Difficulty.Souls]: 3,
};

const MILESTONES: readonly MilestoneThreshold[] = [
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

const SHAKE_FRAMES = 3;
const SHAKE_AMP = 1;
const NEAR_MISS_FLASH_MS = 150;
const SCREEN_FLASH_MS = 100;
const SCREEN_FLASH_MAX_ALPHA = 0.1;

const PULSE: Record<'minor' | 'major' | 'epic', { scale: number; ms: number }> = {
  minor: { scale: 1.15, ms: 200 },
  major: { scale: 1.25, ms: 300 },
  epic: { scale: 1.4, ms: 400 },
};

/** Mutable state for game-feel visual effects and streak tracking. */
export interface GameFeelState {
  cleanStreak: number;
  clutchCount: number;
  longestCleanStreak: number;
  shakeFrames: number;
  shakeX: number;
  shakeY: number;
  pulseScale: number;
  pulseStart: number;
  pulseDuration: number;
  flashStart: number;
  screenFlashStart: number;
  nextMilestone: number;
}

export function createGameFeelState(): GameFeelState {
  return {
    cleanStreak: 0,
    clutchCount: 0,
    longestCleanStreak: 0,
    shakeFrames: 0,
    shakeX: 0,
    shakeY: 0,
    pulseScale: 1,
    pulseStart: 0,
    pulseDuration: 0,
    flashStart: 0,
    screenFlashStart: 0,
    nextMilestone: 0,
  };
}

export function resetGameFeel(gf: GameFeelState): void {
  gf.cleanStreak = 0;
  gf.clutchCount = 0;
  gf.longestCleanStreak = 0;
  gf.shakeFrames = 0;
  gf.shakeX = 0;
  gf.shakeY = 0;
  gf.pulseScale = 1;
  gf.pulseStart = 0;
  gf.pulseDuration = 0;
  gf.flashStart = 0;
  gf.screenFlashStart = 0;
  gf.nextMilestone = 0;
}

/** Snapshot streak counters before a reset so the UI can display end-of-run stats. */
export function finalizeStreaks(gf: GameFeelState): void {
  if (gf.cleanStreak > gf.longestCleanStreak) gf.longestCleanStreak = gf.cleanStreak;
}

function isNearMiss(
  bird: Bird,
  pipe: Pipe,
  config: GameConfig,
  difficulty: DifficultyKey,
): boolean {
  const margin = NEAR_MISS_MARGINS[difficulty];
  const gap = pipe.gap > 0 ? pipe.gap : config.pipeGap;
  const topDist = bird.y - pipe.topH;
  const botDist = pipe.topH + gap - (bird.y + config.birdSize);
  return topDist < margin || botDist < margin;
}

/** Scan recently-scored pipes for near-misses and update streaks accordingly. */
export function detectNearMisses(
  gf: GameFeelState,
  bird: Bird,
  pipes: Pipe[],
  activeCount: number,
  config: GameConfig,
  difficulty: DifficultyKey,
  scoreInc: number,
  events: EngineEventEmitter,
  now: number,
): void {
  if (scoreInc <= 0) return;
  const maxDist = config.pipeSpeed * 3;
  let found = 0;
  for (let i = 0; i < activeCount && found < scoreInc; i++) {
    const p = atIndex(pipes, i);
    if (!p.scored) continue;
    if (config.birdX - (p.x + config.pipeWidth) > maxDist) continue;
    found++;
    if (isNearMiss(bird, p, config, difficulty)) {
      if (gf.cleanStreak > gf.longestCleanStreak) gf.longestCleanStreak = gf.cleanStreak;
      gf.cleanStreak = 0;
      gf.clutchCount++;
      gf.shakeFrames = SHAKE_FRAMES;
      gf.flashStart = now;
      events.emit('nearMiss');
    } else {
      gf.cleanStreak++;
    }
  }
}

/**
 * Check score against milestone thresholds and trigger visual celebrations.
 * Event emission is handled by ProgressionManager to avoid duplicates.
 */
export function checkMilestones(
  gf: GameFeelState,
  score: number,
  _events: EngineEventEmitter,
  now: number,
): void {
  while (gf.nextMilestone < MILESTONES.length) {
    const ms = atIndex(MILESTONES as MilestoneThreshold[], gf.nextMilestone);
    if (score < ms.score) break;
    gf.nextMilestone++;
    const cfg = PULSE[ms.celebration];
    gf.pulseScale = cfg.scale;
    gf.pulseStart = now;
    gf.pulseDuration = cfg.ms;
    if (ms.celebration === 'epic') gf.screenFlashStart = now;
  }
}

/** Decay screen-shake offsets. Call once per simulation tick. */
export function updateShake(gf: GameFeelState): void {
  if (gf.shakeFrames > 0) {
    gf.shakeFrames--;
    gf.shakeX = Math.random() > 0.5 ? SHAKE_AMP : -SHAKE_AMP;
    gf.shakeY = Math.random() > 0.5 ? SHAKE_AMP : -SHAKE_AMP;
  } else {
    gf.shakeX = 0;
    gf.shakeY = 0;
  }
}

/** Current score-text scale factor with ease-out from milestone pulse. */
export function scorePulseScale(gf: GameFeelState, now: number): number {
  if (gf.pulseDuration <= 0) return 1;
  const t = (now - gf.pulseStart) / gf.pulseDuration;
  if (t >= 1) return 1;
  return 1 + (gf.pulseScale - 1) * (1 - t);
}

/** Near-miss score-flash opacity (0-1) with linear fade-out. */
export function nearMissFlash(gf: GameFeelState, now: number): number {
  if (gf.flashStart === 0) return 0;
  const t = (now - gf.flashStart) / NEAR_MISS_FLASH_MS;
  return t >= 1 ? 0 : 1 - t;
}

/** Epic milestone screen-flash opacity (0-0.1) with linear fade-out. */
export function screenFlash(gf: GameFeelState, now: number): number {
  if (gf.screenFlashStart === 0) return 0;
  const t = (now - gf.screenFlashStart) / SCREEN_FLASH_MS;
  return t >= 1 ? 0 : SCREEN_FLASH_MAX_ALPHA * (1 - t);
}
