import { COLOR_TOKENS, CSS_VAR_PREFIX } from './colors';

type ColorKey = keyof typeof COLOR_TOKENS;

/** Build a `var(--fg-<key>, <fallback>)` string from a color token key. */
export function cssVar(key: ColorKey): string {
  return `var(${CSS_VAR_PREFIX}-${key}, ${COLOR_TOKENS[key]})`;
}
