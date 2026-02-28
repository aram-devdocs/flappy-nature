import type { GameState, LeaderboardData } from '@repo/types';
import { GameState as GS } from '@repo/types';
import { LeaderboardMiniOverlay } from '@repo/ui';

interface LeaderboardOverlayProps {
  leaderboard: LeaderboardData;
  gameState: GameState;
}

/** Renders the compact top-3 mini overlay during active gameplay. */
export function LeaderboardOverlay({ leaderboard, gameState }: LeaderboardOverlayProps) {
  const top3 = leaderboard.entries.slice(0, 3);

  return (
    <LeaderboardMiniOverlay
      entries={top3}
      visible={gameState === GS.Play}
      playerEntryId={leaderboard.playerEntry?.id ?? null}
    />
  );
}
