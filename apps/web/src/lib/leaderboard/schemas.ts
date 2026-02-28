import type { DifficultyKey } from '@repo/flappy-gouda-game';
import { DIFF_KEYS } from '@repo/flappy-gouda-game';
import { z } from 'zod';

const DIFFICULTIES = DIFF_KEYS as [DifficultyKey, ...DifficultyKey[]];

export const NicknameSchema = z
  .string()
  .length(3)
  .regex(/^[A-Z0-9]{3}$/, 'Must be 3 uppercase letters or numbers');

export const ScoreSubmitSchema = z.object({
  score: z.number().int().min(0).max(9999),
  difficulty: z.enum(DIFFICULTIES),
});

export const LeaderboardQuerySchema = z.object({
  difficulty: z.enum(DIFFICULTIES),
  limit: z.number().int().min(1).max(100).default(100),
});
