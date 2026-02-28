import type { CanvasStack, Cloud, GameColors, GameConfig, Pipe } from '@repo/types';
import { BackgroundSystem } from './background';
import type { CachedFonts } from './cache';
import { loadCheeseImage } from './cheese';
import { BASE_H, BASE_W, PIPE_POOL_SIZE } from './config';
import { EngineError } from './errors';
import { Renderer } from './renderer';
import type { CanvasContexts } from './renderer-fg';
import { prerenderAllClouds } from './renderer-prerender';

/** Extract and validate 2D contexts from the layered canvas stack. */
export function getContextStack(stack: CanvasStack): CanvasContexts {
  const bg = stack.bg.getContext('2d', { alpha: false });
  const mg = stack.mg.getContext('2d');
  const fg = stack.fg.getContext('2d');
  if (!bg || !mg || !fg)
    throw new EngineError('Canvas 2D context not available', 'CANVAS_CONTEXT_UNAVAILABLE');
  return { bg, mg, fg };
}

export interface BootResult {
  dpr: number;
  renderer: Renderer;
  pipePool: Pipe[];
  clouds: Cloud[];
}

/** Set up DPR scaling, create renderer, load assets, and initialise clouds/background. */
export async function bootEngine(
  canvasStack: CanvasStack,
  ctxStack: CanvasContexts,
  config: GameConfig,
  colors: GameColors,
  fonts: CachedFonts,
  bg: BackgroundSystem,
): Promise<BootResult> {
  const dpr = setupCanvasStack(canvasStack);
  for (const ctx of Object.values(ctxStack)) ctx.scale(dpr, dpr);
  const renderer = createRenderer(ctxStack, config, colors, fonts, dpr);
  renderer.buildGradients();
  renderer.spriteImg = await Promise.race([
    loadCheeseImage(colors.violet),
    new Promise<null>((r) => setTimeout(() => r(null), 5000)),
  ]);
  const pipePool: Pipe[] = Array.from({ length: PIPE_POOL_SIZE }, () => ({
    x: 0,
    topH: 0,
    scored: false,
    gap: 0,
  }));
  const clouds = initClouds(config);
  bg.init();
  prerenderAllClouds(clouds, bg, dpr, colors);
  return { dpr, renderer, pipePool, clouds };
}

/** Configure all three layered canvases for DPR scaling, returning the device pixel ratio. */
export function setupCanvasStack(stack: CanvasStack): number {
  const maxCssW = Math.max(1, Math.min(BASE_W, window.innerWidth - 48));
  const cssScale = maxCssW / BASE_W;
  const cssW = Math.round(BASE_W * cssScale);
  const cssH = Math.round(BASE_H * cssScale);
  const dpr = window.devicePixelRatio || 1;
  for (const canvas of [stack.bg, stack.mg, stack.fg]) {
    canvas.width = BASE_W * dpr;
    canvas.height = BASE_H * dpr;
    canvas.style.width = `${cssW}px`;
    canvas.style.height = `${cssH}px`;
  }
  return dpr;
}

/** Create the initial array of randomly positioned clouds based on game config. */
export function initClouds(config: GameConfig): Cloud[] {
  const clouds: Cloud[] = [];
  for (let i = 0; i < config.cloudCount; i++) {
    clouds.push({
      x: Math.random() * config.width,
      y: 30 + Math.random() * (config.height * 0.35),
      w: 40 + Math.random() * 50,
      speed: 0.15 + Math.random() * 0.25,
      _canvas: null,
      _pad: 0,
      _logW: 0,
      _logH: 0,
    });
  }
  return clouds;
}

/** Instantiate a BackgroundSystem with layout derived from the game config. */
export function createBgSystem(config: GameConfig): BackgroundSystem {
  return new BackgroundSystem({
    width: config.width,
    height: config.height,
    groundH: config.groundH,
    pipeSpeed: config.pipeSpeed,
  });
}

/** Create a Renderer instance wired to the given canvas contexts, config, colors, and fonts. */
export function createRenderer(
  contexts: CanvasContexts,
  config: GameConfig,
  colors: GameColors,
  fonts: CachedFonts,
  dpr: number,
): Renderer {
  return new Renderer(
    contexts,
    {
      width: config.width,
      height: config.height,
      groundH: config.groundH,
      pipeWidth: config.pipeWidth,
      pipeGap: config.pipeGap,
      birdSize: config.birdSize,
      birdX: config.birdX,
    },
    colors,
    fonts,
    dpr,
  );
}
