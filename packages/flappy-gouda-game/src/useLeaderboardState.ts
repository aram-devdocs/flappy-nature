import type { DifficultyKey, GameState, LeaderboardCallbacks } from '@repo/types';
import { GameState as GS } from '@repo/types';
import { useCallback, useEffect, useRef, useState } from 'react';

/** Internal state for leaderboard UI within the game component. */
export interface LeaderboardState {
  leaderboardOpen: boolean;
  nicknameValue: string;
  nicknameError: string | undefined;
  nicknameChecking: boolean;
  toggleLeaderboard: () => void;
  closeLeaderboard: () => void;
  handleNicknameChange: (value: string) => void;
  handleNicknameSubmit: () => void;
}

/** Manages leaderboard panel visibility, nickname input, and auto-submit on death. */
export function useLeaderboardState(
  state: GameState,
  score: number,
  difficulty: DifficultyKey,
  nickname: string | null | undefined,
  callbacks: LeaderboardCallbacks | undefined,
): LeaderboardState {
  const [leaderboardOpen, setLeaderboardOpen] = useState(false);
  const [nicknameValue, setNicknameValue] = useState('');
  const [nicknameError, setNicknameError] = useState<string | undefined>();
  const [nicknameChecking, setNicknameChecking] = useState(false);
  const submittedRef = useRef(false);

  useEffect(() => {
    if (state === GS.Dead && callbacks && nickname && !submittedRef.current) {
      submittedRef.current = true;
      callbacks.onScoreSubmit(score, difficulty);
    }
    if (state === GS.Play) {
      submittedRef.current = false;
    }
  }, [state, score, difficulty, nickname, callbacks]);

  const toggleLeaderboard = useCallback(() => {
    setLeaderboardOpen((prev) => !prev);
  }, []);

  const closeLeaderboard = useCallback(() => {
    setLeaderboardOpen(false);
  }, []);

  const handleNicknameChange = useCallback((value: string) => {
    setNicknameValue(value);
    setNicknameError(undefined);
  }, []);

  const handleNicknameSubmit = useCallback(async () => {
    if (!callbacks || nicknameValue.length !== 3) return;

    setNicknameChecking(true);
    setNicknameError(undefined);

    try {
      const result = await callbacks.onNicknameCheck(nicknameValue);
      if (result.available) {
        callbacks.onNicknameSet(nicknameValue);
        setNicknameValue('');
      } else {
        setNicknameError(result.reason ?? 'Nickname unavailable');
      }
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Check failed';
      setNicknameError(`${message}. Try again.`);
    } finally {
      setNicknameChecking(false);
    }
  }, [callbacks, nicknameValue]);

  return {
    leaderboardOpen,
    nicknameValue,
    nicknameError,
    nicknameChecking,
    toggleLeaderboard,
    closeLeaderboard,
    handleNicknameChange,
    handleNicknameSubmit,
  };
}
