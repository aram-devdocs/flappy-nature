import { FONT_SIZE, FONT_WEIGHT, OPACITY, SPACING, Z_INDEX, cssVar } from '@repo/types';

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
        top: SPACING[2],
        left: SPACING[2],
        fontSize: FONT_SIZE.xs,
        fontWeight: FONT_WEIGHT.semibold,
        color: cssVar('navy'),
        opacity: OPACITY.muted,
        pointerEvents: 'none',
        zIndex: Z_INDEX.overlay,
      }}
    >
      {fps} FPS
    </div>
  );
}
