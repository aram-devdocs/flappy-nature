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
        padding: '32px',
        textAlign: 'center',
        minHeight: '200px',
      }}
    >
      <h2
        style={{
          fontSize: '18px',
          fontWeight: 700,
          color: 'var(--fn-navy, #090949)',
          margin: '0 0 8px',
        }}
      >
        Something went wrong
      </h2>
      <p
        style={{
          fontSize: '12px',
          color: 'var(--fn-navy, #090949)',
          opacity: 0.6,
          margin: '0 0 16px',
        }}
      >
        {message}
      </p>
      <button
        type="button"
        onClick={onReset}
        style={{
          padding: '8px 24px',
          fontSize: '13px',
          fontWeight: 700,
          color: 'var(--fn-white, #FFFFFF)',
          background: 'var(--fn-violet, #6500D9)',
          border: 'none',
          borderRadius: '8px',
          cursor: 'pointer',
        }}
      >
        Try Again
      </button>
    </div>
  );
}
