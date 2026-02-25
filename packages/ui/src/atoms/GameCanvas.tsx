import { RADIUS } from '@repo/types';
import { forwardRef } from 'react';

/** Props for {@link GameCanvas}. */
export interface GameCanvasProps {
  /** Additional CSS class name for the canvas element. */
  className?: string;
  /** When true, applies a blur filter over the canvas (e.g. behind modals). */
  blurred?: boolean;
}

/** Accessible canvas element that hosts the game rendering surface. */
export const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(
  ({ className, blurred }, ref) => {
    return (
      <canvas
        ref={ref}
        className={className}
        aria-label="Flappy Gouda game"
        role="img"
        tabIndex={0}
        style={{
          display: 'block',
          maxWidth: '100%',
          borderRadius: RADIUS.xl,
          filter: blurred ? 'blur(4px)' : 'none',
          transition: 'filter 0.3s ease-out',
        }}
      />
    );
  },
);

GameCanvas.displayName = 'GameCanvas';
