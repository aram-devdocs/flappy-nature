import type { DifficultyKey, LeaderboardEntry, NicknameCheckResult } from '@repo/flappy-gouda-game';
import { STORAGE_KEYS, safeJsonParse } from '@repo/flappy-gouda-game';
import type { LeaderboardService } from './service';

interface StoredScore {
  nickname: string;
  score: number;
  difficulty: DifficultyKey;
  createdAt: string;
}

function readScores(): StoredScore[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEYS.leaderboard);
    return raw ? safeJsonParse<StoredScore[]>(raw, []) : [];
  } catch {
    return [];
  }
}

function writeScores(scores: StoredScore[]): void {
  try {
    localStorage.setItem(STORAGE_KEYS.leaderboard, JSON.stringify(scores));
  } catch {
    /* storage full */
  }
}

export class LocalLeaderboardService implements LeaderboardService {
  async initAuth(): Promise<void> {
    /* no-op */
  }

  async getLeaderboard(difficulty: DifficultyKey, limit = 100): Promise<LeaderboardEntry[]> {
    const scores = readScores()
      .filter((s) => s.difficulty === difficulty)
      .sort((a, b) => b.score - a.score)
      .slice(0, limit);

    return scores.map((s, i) => ({
      id: `local-${s.nickname}-${s.difficulty}`,
      nickname: s.nickname,
      score: s.score,
      difficulty: s.difficulty,
      createdAt: s.createdAt,
      rank: i + 1,
    }));
  }

  async submitScore(score: number, difficulty: DifficultyKey): Promise<LeaderboardEntry> {
    const raw = localStorage.getItem(STORAGE_KEYS.nickname);
    const nickname = raw ? safeJsonParse<string>(raw, 'AAA') : 'AAA';

    const scores = readScores();
    const existing = scores.find((s) => s.nickname === nickname && s.difficulty === difficulty);

    if (existing) {
      if (score > existing.score) {
        existing.score = score;
        existing.createdAt = new Date().toISOString();
      }
    } else {
      scores.push({ nickname, score, difficulty, createdAt: new Date().toISOString() });
    }

    writeScores(scores);
    return {
      id: `local-${nickname}-${difficulty}`,
      nickname,
      score: existing ? Math.max(existing.score, score) : score,
      difficulty,
      createdAt: new Date().toISOString(),
      rank: 0,
    };
  }

  async checkNickname(_nickname: string): Promise<NicknameCheckResult> {
    return { available: true };
  }

  async registerNickname(nickname: string): Promise<{ nickname: string }> {
    return { nickname };
  }

  subscribeToScores(_difficulty: DifficultyKey, onUpdate: () => void): () => void {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEYS.leaderboard) return;
      onUpdate();
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }

  async getNickname(): Promise<string | null> {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS.nickname);
      return raw ? safeJsonParse<string | null>(raw, null) : null;
    } catch {
      return null;
    }
  }

  dispose(): void {
    /* no-op */
  }
}
