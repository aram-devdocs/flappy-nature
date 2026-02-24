/** Props for {@link FpsCounter}. */
interface FpsCounterProps {
  /** Smoothed frames-per-second value. */
  fps: number;
  /** Whether the counter is shown. */
  visible: boolean;
}

/** Subtle debug overlay showing the current frame rate (hidden from screen readers). */
export function FpsCounter({ fps, visible }: FpsCounterProps) {
  if (!visible || fps <= 0) return null;

  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: '8px',
        left: '8px',
        fontSize: '10px',
        fontWeight: 600,
        color: 'var(--fn-navy, #090949)',
        opacity: 0.18,
        pointerEvents: 'none',
        zIndex: 2,
      }}
    >
      {fps} FPS
    </div>
  );
}
