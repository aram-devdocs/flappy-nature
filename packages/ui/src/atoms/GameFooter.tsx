import { FONT_SIZE, OPACITY, SPACING, cssVar } from '@repo/types';

/** Props for {@link GameFooter}. */
export interface GameFooterProps {
  /** Text content for the footer. */
  text: string;
}

/** Centered footer text with subdued styling. */
export function GameFooter({ text }: GameFooterProps) {
  return (
    <div
      style={{
        padding: `${SPACING[1.5]} ${SPACING[3]}`,
        fontSize: FONT_SIZE.xs,
        textAlign: 'center',
        color: cssVar('navy'),
        opacity: OPACITY.subtle,
      }}
    >
      {text}
    </div>
  );
}
