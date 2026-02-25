import {
  type DifficultyKey,
  FlappyNatureGame,
  LeaderboardBottomSheet,
  type LeaderboardCallbacks,
  type LeaderboardData,
  LeaderboardTab,
  SPACING,
  useNickname,
} from '@repo/flappy-nature-game';
import { useQueryClient } from '@tanstack/react-query';
import { useCallback, useMemo, useState } from 'react';
import { useLeaderboard } from '../hooks/useLeaderboard.js';
import { useLeaderboardRealtime } from '../hooks/useLeaderboardRealtime.js';
import { useLeaderboardService } from './LeaderboardProvider.js';

export function GameWithLeaderboard() {
  const service = useLeaderboardService();
  const queryClient = useQueryClient();
  const { nickname, setNickname } = useNickname();
  const [difficulty, setDifficulty] = useState<DifficultyKey>('normal');
  const [sheetOpen, setSheetOpen] = useState(false);

  const { data: entries, isLoading } = useLeaderboard(difficulty);
  const { status: connectionStatus } = useLeaderboardRealtime(difficulty);

  const playerEntry = useMemo(() => {
    if (!nickname || !entries) return null;
    return entries.find((e) => e.nickname === nickname) ?? null;
  }, [entries, nickname]);

  const leaderboardData: LeaderboardData = useMemo(
    () => ({
      entries: entries ?? [],
      playerEntry,
      isLoading,
      connectionStatus,
    }),
    [entries, playerEntry, isLoading, connectionStatus],
  );

  const toggleSheet = useCallback(() => {
    setSheetOpen((prev) => !prev);
  }, []);

  const closeSheet = useCallback(() => {
    setSheetOpen(false);
  }, []);

  const callbacks: LeaderboardCallbacks = useMemo(
    () => ({
      onScoreSubmit: (score: number, diff: DifficultyKey) => {
        service
          .submitScore(score, diff)
          .then(() => {
            queryClient.invalidateQueries({ queryKey: ['leaderboard'] });
          })
          .catch((err: unknown) => {
            // biome-ignore lint/suspicious/noConsole: operational warning for failed score submission
            console.warn('[leaderboard] score submit failed:', err);
          });
      },
      onNicknameSet: (name: string) => {
        setNickname(name);
        service.registerNickname(name).catch((err: unknown) => {
          // biome-ignore lint/suspicious/noConsole: operational warning for failed registration
          console.warn('[leaderboard] nickname registration failed:', err);
        });
      },
      onNicknameCheck: (name: string) => service.checkNickname(name),
    }),
    [service, setNickname, queryClient],
  );

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <FlappyNatureGame
        showFps
        leaderboard={leaderboardData}
        leaderboardCallbacks={callbacks}
        nickname={nickname}
        onDifficultyChange={setDifficulty}
      />
      <LeaderboardTab
        visible
        expanded={sheetOpen}
        onClick={toggleSheet}
        connectionStatus={connectionStatus}
        style={{
          top: 'auto',
          bottom: SPACING[2],
          transform: 'none',
        }}
      />
      <LeaderboardBottomSheet
        visible={sheetOpen}
        entries={entries ?? []}
        playerEntry={playerEntry}
        isLoading={isLoading}
        onClose={closeSheet}
        difficulty={difficulty}
        connectionStatus={connectionStatus}
      />
    </div>
  );
}
