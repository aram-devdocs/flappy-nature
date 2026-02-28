import type { FlappyEngine } from '@repo/engine';
import type { GameState, LeaderboardData } from '@repo/types';
import { GameState as GS } from '@repo/types';
import { useCallback, useEffect, useRef, useState } from 'react';

export interface LiveRankResult {
  rank: number | null;
  improving: boolean;
}

/**
 * Computes an approximate leaderboard rank in real-time during gameplay.
 * Snapshots the leaderboard scores on play-start, then binary-searches on
 * each engine scoreChange event. Only triggers a React re-render when rank
 * actually changes.
 */
export function useLiveRank(
  engineRef: React.RefObject<FlappyEngine | null>,
  engineReady: boolean,
  state: GameState,
  leaderboard: LeaderboardData | undefined,
): LiveRankResult {
  const [rank, setRank] = useState<number | null>(null);
  const [improving, setImproving] = useState(false);
  const thresholdsRef = useRef<number[]>([]);
  const prevRankRef = useRef<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  useEffect(() => {
    if (state === GS.Play && leaderboard) {
      thresholdsRef.current = leaderboard.entries.map((e) => e.score).sort((a, b) => b - a);
      setRank(null);
      prevRankRef.current = null;
      setImproving(false);
      clearTimer();
    }
  }, [state, leaderboard, clearTimer]);

  useEffect(() => {
    const engine = engineRef.current;
    if (!engine || !engineReady || state !== GS.Play) return;

    const onScore = (score: number) => {
      const t = thresholdsRef.current;
      if (t.length === 0) return;

      let lo = 0;
      let hi = t.length;
      while (lo < hi) {
        const mid = (lo + hi) >>> 1;
        if ((t[mid] ?? 0) >= score) lo = mid + 1;
        else hi = mid;
      }
      const newRank = lo + 1;

      setRank((prev) => {
        if (prev === newRank) return prev;
        const wasImprovement = prev !== null && newRank < prev;
        prevRankRef.current = prev;
        if (wasImprovement) {
          setImproving(true);
          clearTimer();
          timerRef.current = setTimeout(() => setImproving(false), 1500);
        }
        return newRank;
      });
    };

    engine.on('scoreChange', onScore);
    return () => engine.off('scoreChange', onScore);
  }, [engineRef, engineReady, state, clearTimer]);

  useEffect(() => clearTimer, [clearTimer]);

  return { rank, improving };
}
