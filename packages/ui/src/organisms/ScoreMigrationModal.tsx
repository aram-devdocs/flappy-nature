import type { ScoreComparison } from '@repo/types';
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

/** Props for {@link ScoreMigrationModal}. */
export interface ScoreMigrationModalProps {
  /** Whether the modal is shown. */
  visible: boolean;
  /** Per-difficulty score comparisons to display. */
  comparisons: ScoreComparison[];
  /** Called when the user accepts the import. */
  onAccept: () => void;
  /** Called when the user declines the import. */
  onDecline: () => void;
}

/** Modal shown once to offer importing scores from the old site. */
export function ScoreMigrationModal({
  visible,
  comparisons,
  onAccept,
  onDecline,
}: ScoreMigrationModalProps) {
  if (!visible) return null;

  return (
    <dialog
      open
      aria-label="Import scores from old site"
      style={{
        position: 'absolute',
        inset: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: RGBA_TOKENS.scrimDense,
        zIndex: Z_INDEX.picker,
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
          padding: `${SPACING[6]} ${SPACING[7]}`,
          textAlign: 'center',
          boxShadow: SHADOW.cardHeavy,
          maxWidth: '320px',
          width: '100%',
        }}
      >
        <h2
          style={{
            fontSize: FONT_SIZE['2xl'],
            fontWeight: FONT_WEIGHT.extrabold,
            color: cssVar('navy'),
            margin: `0 0 ${SPACING[1]}`,
          }}
        >
          Scores Found
        </h2>
        <p
          style={{
            fontSize: FONT_SIZE.md,
            color: cssVar('navy'),
            opacity: OPACITY.visible,
            margin: `0 0 ${SPACING[4]}`,
          }}
        >
          Import your best scores from the old site?
        </p>
        <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: SPACING[4] }}>
          <thead>
            <tr>
              <th style={thStyle}>Difficulty</th>
              <th style={thStyle}>Old</th>
              <th style={thStyle}>Current</th>
            </tr>
          </thead>
          <tbody>
            {comparisons.map((c) => (
              <tr key={c.difficulty}>
                <td style={tdStyle}>{c.label}</td>
                <td
                  style={{
                    ...tdStyle,
                    fontWeight: c.isImprovement ? FONT_WEIGHT.bold : FONT_WEIGHT.normal,
                    color: c.isImprovement ? cssVar('violet') : cssVar('navy'),
                  }}
                >
                  {c.oldScore}
                </td>
                <td style={tdStyle}>{c.newScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div style={{ display: 'flex', gap: SPACING[2], justifyContent: 'center' }}>
          <button type="button" onClick={onDecline} style={declineBtnStyle}>
            No Thanks
          </button>
          <button type="button" onClick={onAccept} style={acceptBtnStyle}>
            Import
          </button>
        </div>
      </div>
    </dialog>
  );
}

const thStyle: React.CSSProperties = {
  fontSize: FONT_SIZE.sm,
  fontWeight: FONT_WEIGHT.semibold,
  color: cssVar('navy'),
  opacity: OPACITY.soft,
  padding: `${SPACING[1]} ${SPACING[2]}`,
  textAlign: 'center',
};

const tdStyle: React.CSSProperties = {
  fontSize: FONT_SIZE.xl,
  padding: `${SPACING[1]} ${SPACING[2]}`,
  textAlign: 'center',
  color: cssVar('navy'),
};

const acceptBtnStyle: React.CSSProperties = {
  padding: `${SPACING[2]} ${SPACING[5]}`,
  borderRadius: RADIUS.lg,
  border: 'none',
  background: cssVar('violet'),
  color: cssVar('white'),
  fontWeight: FONT_WEIGHT.bold,
  fontSize: FONT_SIZE.xl,
  cursor: 'pointer',
};

const declineBtnStyle: React.CSSProperties = {
  padding: `${SPACING[2]} ${SPACING[5]}`,
  borderRadius: RADIUS.lg,
  border: `1px solid ${cssVar('navy')}`,
  background: 'transparent',
  color: cssVar('navy'),
  fontWeight: FONT_WEIGHT.semibold,
  fontSize: FONT_SIZE.xl,
  cursor: 'pointer',
  opacity: OPACITY.prominent,
};
