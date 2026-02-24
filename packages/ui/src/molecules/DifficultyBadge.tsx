import type { DifficultyKey } from '@repo/types';
import { DIFF_LABELS } from '@repo/types';

/** Props for {@link DifficultyBadge}. */
interface DifficultyBadgeProps {
  /** Currently active difficulty level. */
  difficulty: DifficultyKey;
  /** Whether the badge is shown. */
  visible: boolean;
  /** Called when the badge is clicked (typically opens the difficulty picker). */
  onClick: () => void;
}

/** Small pill button showing the current difficulty level. */
export function DifficultyBadge({ difficulty, visible, onClick }: DifficultyBadgeProps) {
  if (!visible) return null;

  return (
    <button
      type="button"
      aria-label={`Difficulty: ${DIFF_LABELS[difficulty]}`}
      onClick={onClick}
      style={{
        padding: '2px 10px',
        fontSize: '11px',
        fontWeight: 700,
        color: 'var(--fn-violet, #6500D9)',
        background: 'rgba(101, 0, 217, 0.08)',
        border: '1px solid rgba(101, 0, 217, 0.15)',
        borderRadius: '12px',
        cursor: 'pointer',
        lineHeight: '18px',
      }}
    >
      {DIFF_LABELS[difficulty]}
    </button>
  );
}
