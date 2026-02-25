import type { EngineConfig, GameColors } from '@repo/types';
import { type CachedFonts, DEFAULT_COLORS, DEFAULT_FONT, buildFontCache } from './cache';
import { createLogger } from './logger';

const log = createLogger('sanitize');

const FONT_FAMILY_PATTERN = /^[a-zA-Z0-9\s\-'"(),]+$/;

/** Validate a CSS font-family string, falling back to the default font if invalid. */
export function sanitizeFontFamily(input: string): string {
  if (FONT_FAMILY_PATTERN.test(input)) return input;
  log.warn('Invalid fontFamily rejected, using default', { input });
  return DEFAULT_FONT;
}

const COLOR_PATTERN = /^#[0-9a-fA-F]{3,8}$|^[a-zA-Z]+$/;

/** Validate color values against hex/named-color patterns, discarding invalid entries. */
export function sanitizeColors(colors: Partial<GameColors>): Partial<GameColors> {
  const result: Partial<GameColors> = {};
  for (const [key, value] of Object.entries(colors)) {
    if (typeof value === 'string' && COLOR_PATTERN.test(value)) {
      (result as Record<string, string>)[key] = value;
    } else {
      log.warn('Invalid color rejected', { key, value: String(value) });
    }
  }
  return result;
}

/** Fully resolved engine configuration with defaults applied and inputs sanitized. */
interface ResolvedConfig {
  /** Merged game color palette (user overrides on top of defaults). */
  colors: GameColors;
  /** Pre-built font cache derived from the resolved font family. */
  fonts: CachedFonts;
}

/** Merge user-supplied engine config with defaults, sanitizing all inputs. */
export function resolveEngineConfig(engineConfig?: EngineConfig): ResolvedConfig {
  const colors: GameColors = {
    ...DEFAULT_COLORS,
    ...(engineConfig?.colors ? sanitizeColors(engineConfig.colors) : {}),
  };
  const fontFamily = engineConfig?.fontFamily
    ? sanitizeFontFamily(engineConfig.fontFamily)
    : DEFAULT_FONT;
  const fonts = buildFontCache(fontFamily);
  return { colors, fonts };
}
