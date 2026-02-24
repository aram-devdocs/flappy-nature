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
        background: 'rgba(9, 9, 73, 0.45)',
        zIndex: 5,
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
          background: 'var(--fn-white, #FFFFFF)',
          borderRadius: '16px',
          padding: '24px 32px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '20px',
            fontWeight: 800,
            color: 'var(--fn-navy, #090949)',
            margin: '0 0 8px',
          }}
        >
          Game Over
        </h2>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--fn-violet, #6500D9)',
            margin: '0 0 4px',
          }}
        >
          Score: {score}
        </p>
        <p
          style={{
            fontSize: '14px',
            fontWeight: 700,
            color: 'var(--fn-magenta, #D76EFF)',
            margin: '0 0 16px',
          }}
        >
          Best: {bestScore}
        </p>
        <p
          style={{
            fontSize: '12px',
            fontWeight: 600,
            color: 'var(--fn-navy, #090949)',
            opacity: 0.5,
            margin: 0,
          }}
        >
          Space / Click to retry
        </p>
      </div>
    </dialog>
  );
}
