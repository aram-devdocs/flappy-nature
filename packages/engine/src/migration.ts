import { STORAGE_KEYS } from '@repo/types';
import { createLogger } from './logger';
import { safeGet, safeRemove, safeSet } from './safe-storage';

const log = createLogger('migration');

const OLD_KEYS = [
  'fg-flappy-best',
  'fg-flappy-best-v2',
  'fg-flappy-diff',
  'fg-flappy-nickname',
  'fg-flappy-leaderboard',
];

/**
 * One-time migration from v2 → v3 storage keys.
 *
 * - Preserves the player's nickname so they don't have to re-register.
 * - Wipes old best scores (the scoring system changed fundamentally).
 * - Removes all legacy `fg-flappy-*` keys.
 * - Sets a flag so this only runs once.
 */
export function migrateToV3(): void {
  if (safeGet(STORAGE_KEYS.migrated)) return;

  const oldNickname = safeGet('fg-flappy-nickname');
  if (oldNickname) {
    safeSet(STORAGE_KEYS.nickname, oldNickname);
    log.info('Preserved nickname from v2', { nickname: oldNickname });
  }

  for (const key of OLD_KEYS) {
    safeRemove(key);
  }

  safeSet(STORAGE_KEYS.migrated, '1');
  log.info('Migration to v3 complete');
}
