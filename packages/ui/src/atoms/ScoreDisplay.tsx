import { FONT_SIZE, FONT_WEIGHT, SPACING, TEXT_SHADOW, Z_INDEX, cssVar } from '@repo/types';

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
        top: SPACING[3],
        left: '50%',
        transform: 'translateX(-50%)',
        fontSize: FONT_SIZE['5xl'],
        fontWeight: FONT_WEIGHT.extrabold,
        color: cssVar('magenta'),
        textShadow: TEXT_SHADOW.score,
        pointerEvents: 'none',
        zIndex: Z_INDEX.overlay,
        display: 'block',
      }}
    >
      {score}
    </output>
  );
}
