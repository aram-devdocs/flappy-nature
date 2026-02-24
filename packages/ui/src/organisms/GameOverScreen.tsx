import {
  FONT_SIZE,
  FONT_WEIGHT,
  OPACITY,
  RADIUS,
  RGBA_TOKENS,
  SHADOW,
  SPACING,
  Z_INDEX,
  cssVar,
} from '@repo/types';

/** Props for {@link GameOverScreen}. */
interface GameOverScreenProps {
  /** Whether the game-over overlay is shown. */
  visible: boolean;
  /** Final score from the run that just ended. */
  score: number;
  /** Player's best score for the current difficulty. */
  bestScore: number;
}

/** Full-screen overlay shown after death displaying score, best score, and retry hint. */
export function GameOverScreen({ visible, score, bestScore }: GameOverScreenProps) {
  if (!visible) return null;

  return (
    <dialog
      open
      aria-label="Game over"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: RGBA_TOKENS.scrimHeavy,
        zIndex: Z_INDEX.modal,
        pointerEvents: 'none',
        border: 'none',
        padding: 0,
        margin: 0,
        maxWidth: 'none',
        maxHeight: 'none',
        width: '100%',
        height: '100%',
      }}
    >
      <div
        style={{
          background: cssVar('white'),
          borderRadius: RADIUS['2xl'],
          padding: `${SPACING[6]} ${SPACING[8]}`,
          textAlign: 'center',
          boxShadow: SHADOW.card,
        }}
      >
        <h2
          style={{
            fontSize: FONT_SIZE['3xl'],
            fontWeight: FONT_WEIGHT.extrabold,
            color: cssVar('navy'),
            margin: `0 0 ${SPACING[2]}`,
          }}
        >
          Game Over
        </h2>
        <p
          style={{
            fontSize: FONT_SIZE.xl,
            fontWeight: FONT_WEIGHT.bold,
            color: cssVar('violet'),
            margin: `0 0 ${SPACING[1]}`,
          }}
        >
          Score: {score}
        </p>
        <p
          style={{
            fontSize: FONT_SIZE.xl,
            fontWeight: FONT_WEIGHT.bold,
            color: cssVar('magenta'),
            margin: `0 0 ${SPACING[4]}`,
          }}
        >
          Best: {bestScore}
        </p>
        <p
          style={{
            fontSize: FONT_SIZE.md,
            fontWeight: FONT_WEIGHT.semibold,
            color: cssVar('navy'),
            opacity: OPACITY.soft,
            margin: 0,
          }}
        >
          Space / Click to retry
        </p>
      </div>
    </dialog>
  );
}
