import type { BestScores, DifficultyKey } from '@repo/types';
import { DIFF_KEYS, DIFF_LABELS } from '@repo/types';

/** Props for {@link DifficultyPicker}. */
interface DifficultyPickerProps {
  /** The currently selected difficulty level. */
  currentDifficulty: DifficultyKey;
  /** Per-difficulty best scores shown alongside each option. */
  bestScores: BestScores;
  /** Whether the picker dialog is shown. */
  visible: boolean;
  /** Called when the player selects a difficulty option. */
  onSelect: (key: DifficultyKey) => void;
  /** Called when the picker is dismissed (backdrop click or Escape). */
  onClose: () => void;
}

/** Modal dialog listing all difficulty levels with best-score annotations. */
export function DifficultyPicker({
  currentDifficulty,
  bestScores,
  visible,
  onSelect,
  onClose,
}: DifficultyPickerProps) {
  if (!visible) return null;

  return (
    <dialog
      open
      aria-label="Select difficulty"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(9, 9, 73, 0.3)',
        zIndex: 10,
        border: 'none',
        padding: 0,
        margin: 0,
        maxWidth: 'none',
        maxHeight: 'none',
        width: '100%',
        height: '100%',
      }}
      onClick={onClose}
      onKeyDown={(e) => e.key === 'Escape' && onClose()}
    >
      <div
        role="radiogroup"
        aria-label="Difficulty options"
        style={{
          background: 'var(--fn-white, #FFFFFF)',
          borderRadius: '12px',
          padding: '16px',
          minWidth: '150px',
          boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
        }}
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div
          style={{
            fontSize: '12px',
            fontWeight: 800,
            textAlign: 'center',
            marginBottom: '12px',
            color: 'var(--fn-navy, #090949)',
          }}
        >
          Difficulty
        </div>
        {DIFF_KEYS.map((key) => {
          const isActive = key === currentDifficulty;
          const best = bestScores[key];
          return (
            <button
              key={key}
              type="button"
              aria-pressed={isActive}
              onClick={() => onSelect(key)}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%',
                padding: '6px 10px',
                marginBottom: '6px',
                fontSize: '11px',
                fontWeight: 700,
                color: isActive ? 'var(--fn-white, #FFFFFF)' : 'var(--fn-navy, #090949)',
                background: isActive ? 'var(--fn-violet, #6500D9)' : 'var(--fn-light, #FBF6F6)',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
              }}
            >
              <span>{DIFF_LABELS[key]}</span>
              {best > 0 && (
                <span style={{ fontSize: '9px', fontWeight: 600, opacity: isActive ? 0.75 : 0.45 }}>
                  Best: {best}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </dialog>
  );
}
