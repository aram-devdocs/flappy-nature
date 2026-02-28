/** Three stacked canvas elements used for layered rendering. */
export interface CanvasStack {
  /** Bottom layer for slow-moving elements (sky, far clouds, skyline). */
  bg: HTMLCanvasElement;
  /** Middle layer for moderate-speed elements (mid clouds, buildings, trees). */
  mg: HTMLCanvasElement;
  /** Top layer for per-frame elements (pipes, bird, score, ground). */
  fg: HTMLCanvasElement;
}

/** Three rendering contexts for the layered canvas architecture. */
export interface CanvasContexts {
  bg: CanvasRenderingContext2D;
  mg: CanvasRenderingContext2D;
  fg: CanvasRenderingContext2D;
}

/** Layout dimensions the renderer needs from the game config. */
export interface RendererDeps {
  width: number;
  height: number;
  groundH: number;
  pipeWidth: number;
  pipeGap: number;
  birdSize: number;
  birdX: number;
}
