/** Props for {@link ScoreDisplay}. */
interface ScoreDisplayProps {
  /** Current numeric score to display. */
  score: number;
  /** Whether the score overlay is shown. */
  visible: boolean;
}

/** Absolute-positioned score overlay with an accessible live region. */
export function ScoreDisplay({ score, visible }: ScoreDisplayProps) {
  if (!visible) return null;

  return (
    <output
      aria-live="polite"
      aria-label={`Score: ${score}`}
      style={{
        position: 'absolute',
        top: '12px',
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: '32px',
        fontWeight: 800,
        color: 'var(--fn-magenta, #D76EFF)',
        textShadow: '2px 2px 0 rgba(9, 9, 73, 0.12)',
        pointerEvents: 'none',
        zIndex: 2,
        display: 'block',
      }}
    >
      {score}
    </output>
  );
}
