import type { Bird, Cloud, GameConfig, Pipe } from '@repo/types';
import { GameState as GS } from '@repo/types';
import type { BackgroundSystem } from './background';
import { syncPrevBird } from './engine-lifecycle';
import type { EngineLoop } from './engine-loop';
import type { EngineState } from './engine-state';
import type { GameFeelState } from './game-feel';
import {
  checkMilestones,
  detectNearMisses,
  finalizeStreaks,
  nearMissFlash,
  scorePulseScale,
  screenFlash,
  updateShake,
} from './game-feel';
import { checkGroundCollision, spawnPipe, updateBird, updateClouds, updatePipes } from './physics';
import type { PipeDirector } from './pipe-director';
import type { Renderer } from './renderer';

/** Try spawning a pipe if the spawn interval has elapsed. Uses director when available. */
function trySpawnPipe(
  state: EngineState,
  config: GameConfig,
  pipePool: Pipe[],
  activeCount: number,
  now: number,
  director: PipeDirector | null,
): number {
  const baseDelay = director ? director.effectiveSpawnDelay : config.pipeSpawn;
  const spawnDelay = state.nextSpawnDelay > 0 ? state.nextSpawnDelay : baseDelay;
  if (now - state.lastPipeTime <= spawnDelay) return activeCount;

  let newCount: number;
  if (director) {
    const intent = director.next();
    newCount = spawnPipe(pipePool, activeCount, config, intent);
    state.nextSpawnDelay = intent.delay > 0 ? intent.delay : director.effectiveSpawnDelay;
  } else {
    newCount = spawnPipe(pipePool, activeCount, config);
    state.nextSpawnDelay =
      config.pipeSpawnVariation > 0
        ? config.pipeSpawn + (Math.random() * 2 - 1) * config.pipeSpawnVariation
        : config.pipeSpawn;
  }

  state.lastPipeTime = now;
  return newCount;
}

/** Process score changes through the game-feel system (near-miss + milestones). */
function processScoreFeel(
  gf: GameFeelState,
  state: EngineState,
  config: GameConfig,
  bird: Bird,
  pipes: Pipe[],
  activeCount: number,
  scoreInc: number,
  now: number,
): void {
  const events = state.getEmitter();
  detectNearMisses(gf, bird, pipes, activeCount, config, state.difficulty, scoreInc, events, now);
  state.setScore(state.score + scoreInc);
  checkMilestones(gf, state.score, events, now);
}

/** Spawn, move, score, and collide pipes. Returns updated active count. */
function tickPipes(
  state: EngineState,
  config: GameConfig,
  bird: Bird,
  pipePool: Pipe[],
  initialCount: number,
  dt: number,
  now: number,
  gf: GameFeelState | null,
  director: PipeDirector | null,
): number {
  let count = trySpawnPipe(state, config, pipePool, initialCount, now, director);
  const speed = director ? director.effectiveSpeed : undefined;
  const r = updatePipes(pipePool, count, bird, config, dt, speed);
  count = r.activeCount;
  if (r.scoreInc > 0) {
    if (gf) processScoreFeel(gf, state, config, bird, pipePool, count, r.scoreInc, now);
    else state.setScore(state.score + r.scoreInc);
  }
  if (r.died) {
    if (gf) finalizeStreaks(gf);
    state.die();
  }
  return count;
}

/**
 * Run one simulation tick. Returns the updated active pipe count.
 * Debug timing is handled by the caller to keep this path branch-free.
 */
export function engineUpdate(
  loop: EngineLoop,
  state: EngineState,
  config: GameConfig,
  bird: Bird,
  prevBird: Bird,
  clouds: Cloud[],
  bg: BackgroundSystem,
  pipePool: Pipe[],
  pipeActiveCount: number,
  dt: number,
  now: number,
  gf: GameFeelState | null,
  director: PipeDirector | null = null,
): number {
  loop.globalTime = now;
  updateClouds(clouds, config, dt);
  bg.update(dt, now, state.state === GS.Play, loop.reducedMotion);
  syncPrevBird(prevBird, bird);
  let activeCount = pipeActiveCount;
  if (state.state === GS.Play) {
    updateBird(bird, config, dt);
    if (checkGroundCollision(bird, config)) {
      if (gf) finalizeStreaks(gf);
      state.die();
    } else {
      activeCount = tickPipes(state, config, bird, pipePool, activeCount, dt, now, gf, director);
    }
    if (gf) updateShake(gf);
  }
  return activeCount;
}

/**
 * Render one frame. Debug timing is handled by the caller.
 */
export function engineDraw(
  loop: EngineLoop,
  state: EngineState,
  renderer: Renderer,
  bg: BackgroundSystem,
  clouds: Cloud[],
  pipePool: Pipe[],
  pipeActiveCount: number,
  bird: Bird,
  prevBird: Bird,
  settingsIconHovered: boolean,
  now: number,
  gf: GameFeelState | null,
): void {
  renderer.drawBgLayer(bg, now);
  renderer.drawMgLayer(bg, clouds, now);
  renderer.clearFg();

  const shakeX = gf ? gf.shakeX : 0;
  const shakeY = gf ? gf.shakeY : 0;
  const hasShake = shakeX !== 0 || shakeY !== 0;
  if (hasShake) renderer.translateFg(shakeX, shakeY);

  renderer.drawPipes(pipePool, pipeActiveCount);
  renderer.drawGround(bg);
  if (state.state !== GS.Idle) {
    const a = loop.alpha;
    const y = prevBird.y + (bird.y - prevBird.y) * a;
    const rot = prevBird.rot + (bird.rot - prevBird.rot) * a;
    renderer.drawBird(y, rot);
    const scale = gf ? scorePulseScale(gf, now) : 1;
    const flash = gf ? nearMissFlash(gf, now) : 0;
    renderer.drawScore(state.score, scale, flash);
    renderer.drawSettingsIcon(settingsIconHovered);
  }

  if (hasShake) renderer.translateFg(-shakeX, -shakeY);

  if (gf) {
    const flashA = screenFlash(gf, now);
    if (flashA > 0) renderer.drawScreenFlash(flashA);
  }

  loop.updateFps(now);
}
