import { DEFAULT_GAME_COLORS, FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, RGBA_TOKENS } from '@repo/types';
import type { GameColors } from '@repo/types';

/** Pre-cached RGBA strings to avoid string allocation per frame. */
export const RGBA = {
  scrim30: RGBA_TOKENS.scrimLight,
  scrim35: RGBA_TOKENS.scrimMedium,
  scrim45: RGBA_TOKENS.scrimHeavy,
  shadow09: RGBA_TOKENS.shadowBase,
  shadow08: RGBA_TOKENS.shadowSm,
  shadow05: RGBA_TOKENS.shadowXs,
};

/** Pre-computed CSS font strings to avoid template literal allocation per frame. */
export interface CachedFonts {
  banner: string;
  score: string;
  hint: string;
  diffTitle: string;
  diffBtn: string;
  diffBest: string;
  fps: string;
  deadTitle: string;
  deadScore: string;
  deadRetry: string;
}

/**
 * Build all CSS font shorthand strings from a given font family.
 * @param fontFamily The CSS font-family value, e.g. '"Poppins", sans-serif'.
 * @returns Pre-computed font strings for every text context in the game.
 */
export function buildFontCache(fontFamily: string): CachedFonts {
  return {
    banner: `${FONT_WEIGHT.extrabold} ${FONT_SIZE['2xs']} ${fontFamily}`,
    score: `${FONT_WEIGHT.extrabold} ${FONT_SIZE['5xl']} ${fontFamily}`,
    hint: `${FONT_WEIGHT.semibold} ${FONT_SIZE.sm} ${fontFamily}`,
    diffTitle: `${FONT_WEIGHT.extrabold} ${FONT_SIZE.md} ${fontFamily}`,
    diffBtn: `${FONT_WEIGHT.bold} ${FONT_SIZE.sm} ${fontFamily}`,
    diffBest: `${FONT_WEIGHT.semibold} ${FONT_SIZE['2xs']} ${fontFamily}`,
    fps: `${FONT_WEIGHT.semibold} ${FONT_SIZE.xs} ${fontFamily}`,
    deadTitle: `${FONT_WEIGHT.extrabold} ${FONT_SIZE['3xl']} ${fontFamily}`,
    deadScore: `${FONT_WEIGHT.bold} ${FONT_SIZE.xl} ${fontFamily}`,
    deadRetry: `${FONT_WEIGHT.semibold} ${FONT_SIZE.md} ${fontFamily}`,
  };
}

/** Default color palette from DESIGN_TOKENS. */
export const DEFAULT_COLORS: GameColors = DEFAULT_GAME_COLORS;

/** Default font family used when none is provided via EngineConfig. */
export const DEFAULT_FONT = FONT_FAMILY.heading;
