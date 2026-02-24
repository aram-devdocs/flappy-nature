import { FONT_SIZE, FONT_WEIGHT, OPACITY, RADIUS, SPACING, cssVar } from '@repo/types';

/** Props for {@link ErrorFallback}. */
interface ErrorFallbackProps {
  /** Human-readable error message to display. */
  message: string;
  /** Called when the user clicks "Try Again" to clear the error state. */
  onReset: () => void;
}

/** Accessible error alert with a retry button, used inside the error boundary. */
export function ErrorFallback({ message, onReset }: ErrorFallbackProps) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: SPACING[8],
        textAlign: 'center',
        minHeight: '200px',
      }}
    >
      <h2
        style={{
          fontSize: FONT_SIZE['2xl'],
          fontWeight: FONT_WEIGHT.bold,
          color: cssVar('navy'),
          margin: `0 0 ${SPACING[2]}`,
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          fontSize: FONT_SIZE.md,
          color: cssVar('navy'),
          opacity: OPACITY.visible,
          margin: `0 0 ${SPACING[4]}`,
        }}
      >
        {message}
      </p>
      <button
        type="button"
        onClick={onReset}
        style={{
          padding: `${SPACING[2]} ${SPACING[6]}`,
          fontSize: FONT_SIZE.lg,
          fontWeight: FONT_WEIGHT.bold,
          color: cssVar('white'),
          background: cssVar('violet'),
          border: 'none',
          borderRadius: RADIUS.lg,
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
