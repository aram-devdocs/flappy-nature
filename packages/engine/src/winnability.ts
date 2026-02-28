import type { GameConfig, PipeIntent } from '@repo/types';

/** Duration of a single fixed-timestep physics tick in milliseconds. */
const TICK_MS = 1000 / 60;

/** Vertical range the bird can physically reach from a starting Y position. */
export interface ReachableBand {
  /** Highest reachable point (smallest Y value — continuous flapping). */
  minY: number;
  /** Lowest reachable point (largest Y value — free fall). */
  maxY: number;
}

/**
 * Simulate the bird's maximum vertical reach in both directions.
 *
 * Upward: bird flaps every tick (vy resets to flapForce, then gravity applies).
 * Downward: bird free-falls (gravity accumulates, capped at terminalVel).
 * The ceiling (y = 0) is enforced during the upward simulation.
 */
export function computeReachableBand(
  fromCenter: number,
  ticks: number,
  gravity: number,
  flapForce: number,
  terminalVel: number,
): ReachableBand {
  let upY = fromCenter;
  let upVy = 0;
  for (let t = 0; t < ticks; t++) {
    upVy = flapForce;
    upVy += gravity;
    upY += upVy;
    if (upY < 0) {
      upY = 0;
      upVy = 0;
    }
  }

  let downY = fromCenter;
  let downVy = 0;
  for (let t = 0; t < ticks; t++) {
    downVy += gravity;
    if (downVy > terminalVel) downVy = terminalVel;
    downY += downVy;
  }

  return { minY: upY, maxY: downY };
}

/**
 * Validate a PipeIntent against physics reachability and clamp if needed.
 *
 * Computes how many ticks the bird has between pipes (derived from spawn
 * delay and pipe speed), determines the reachable band, shrinks it by the
 * grace factor, and clamps the gap center into the graced band.
 */
export function validateAndClamp(
  intent: PipeIntent,
  prevCenter: number,
  config: GameConfig,
  graceFactor: number,
): PipeIntent {
  const delay = intent.delay > 0 ? intent.delay : config.pipeSpawn;
  const delayTicks = delay / TICK_MS;
  const horizontalDist = config.pipeSpeed * delayTicks - config.pipeWidth;
  const ticks = Math.max(1, Math.floor(horizontalDist / config.pipeSpeed));

  const band = computeReachableBand(
    prevCenter,
    ticks,
    config.gravity,
    config.flapForce,
    config.terminalVel,
  );

  const playableMax = config.height - config.groundH;
  const boundedMin = Math.max(0, band.minY);
  const boundedMax = Math.min(playableMax, band.maxY);

  const range = boundedMax - boundedMin;
  const margin = range * graceFactor * 0.5;
  const gracedMin = boundedMin + margin;
  const gracedMax = boundedMax - margin;

  if (gracedMin >= gracedMax) {
    return { ...intent, gapCenter: (boundedMin + boundedMax) / 2 };
  }

  const clamped = Math.max(gracedMin, Math.min(gracedMax, intent.gapCenter));
  if (clamped === intent.gapCenter) return intent;
  return { ...intent, gapCenter: clamped };
}
