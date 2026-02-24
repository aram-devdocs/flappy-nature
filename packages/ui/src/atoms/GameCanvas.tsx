import { forwardRef } from 'react';

/** Props for {@link GameCanvas}. */
export interface GameCanvasProps {
  /** Additional CSS class name for the canvas element. */
  className?: string;
}

/** Accessible canvas element that hosts the game rendering surface. */
export const GameCanvas = forwardRef<HTMLCanvasElement, GameCanvasProps>(({ className }, ref) => {
  return (
    <canvas
      ref={ref}
      className={className}
      aria-label="Flappy Nature game"
      role="img"
      tabIndex={0}
      style={{
        display: 'block',
        maxWidth: '100%',
        borderRadius: '12px',
      }}
    />
  );
});

GameCanvas.displayName = 'GameCanvas';
