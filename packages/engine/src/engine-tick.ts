import type { Bird, Cloud, GameConfig, Pipe } from '@repo/types';
import type { BackgroundSystem } from './background';
import type { DebugMetricsCollector } from './debug-metrics';
import { recordDebugFrame } from './engine-debug-bridge';
import { engineDraw, engineUpdate } from './engine-frame';
import type { EngineLoop } from './engine-loop';
import type { EngineState } from './engine-state';
import type { GameFeelState } from './game-feel';
import type { PipeDirector } from './pipe-director';
import type { Renderer } from './renderer';

export interface TickableEngine {
  loop: EngineLoop;
  state: EngineState;
  config: GameConfig;
  bird: Bird;
  prevBird: Bird;
  clouds: Cloud[];
  bg: BackgroundSystem;
  pipePool: Pipe[];
  pipeActiveCount: number;
  renderer: Renderer;
  gameFeel: GameFeelState;
  director: PipeDirector;
  debugCollector: DebugMetricsCollector | null;
  settingsIconHovered: boolean;
}

/** Run one simulation tick with optional debug timing. Returns elapsed update ms. */
export function tickUpdate(e: TickableEngine, dt: number, now: number): number {
  const dc = e.debugCollector;
  const t0 = dc ? performance.now() : 0;
  e.pipeActiveCount = engineUpdate(
    e.loop,
    e.state,
    e.config,
    e.bird,
    e.prevBird,
    e.clouds,
    e.bg,
    e.pipePool,
    e.pipeActiveCount,
    dt,
    now,
    e.gameFeel,
    e.director,
  );
  return dc ? performance.now() - t0 : 0;
}

/** Render one frame with optional debug recording. */
export function tickDraw(e: TickableEngine, updateMs: number, now: number): void {
  const dc = e.debugCollector;
  const drawT0 = dc ? performance.now() : 0;
  engineDraw(
    e.loop,
    e.state,
    e.renderer,
    e.bg,
    e.clouds,
    e.pipePool,
    e.pipeActiveCount,
    e.bird,
    e.prevBird,
    e.settingsIconHovered,
    now,
    e.gameFeel,
  );
  if (dc) {
    recordDebugFrame(
      dc,
      e.loop,
      updateMs,
      performance.now() - drawT0,
      now,
      e.pipeActiveCount,
      e.clouds.length,
      e.bg,
    );
  }
}
