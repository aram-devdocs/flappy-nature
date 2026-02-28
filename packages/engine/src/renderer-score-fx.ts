import type { GameColors } from '@repo/types';
import type { CachedFonts } from './cache';
import { SCORE_Y, drawScore } from './renderer-entities';

/**
 * Draw the score with optional pulse-scale and near-miss white flash.
 * Falls through to the standard drawScore when no effects are active.
 */
export function drawScoreWithEffects(
  ctx: CanvasRenderingContext2D,
  scoreStr: string,
  width: number,
  fonts: CachedFonts,
  colors: GameColors,
  scale: number,
  flashAlpha: number,
): void {
  const cx = (width / 2) | 0;
  const needsScale = scale !== 1;
  if (needsScale) {
    ctx.save();
    ctx.translate(cx, SCORE_Y);
    ctx.scale(scale, scale);
    ctx.translate(-cx, -SCORE_Y);
  }
  drawScore(ctx, scoreStr, width, fonts, colors);
  if (flashAlpha > 0) {
    ctx.globalAlpha = flashAlpha;
    ctx.fillStyle = '#ffffff';
    ctx.font = fonts.score;
    ctx.textAlign = 'center';
    ctx.fillText(scoreStr, cx, SCORE_Y);
    ctx.globalAlpha = 1;
  }
  if (needsScale) ctx.restore();
}
