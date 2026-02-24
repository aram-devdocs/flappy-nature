import { COLOR_TOKENS, FONT_SIZE, FONT_WEIGHT, OPACITY, SPACING } from '@repo/flappy-nature-game';

export function DemoFooter() {
  return (
    <footer
      style={{
        padding: `${SPACING[5]} ${SPACING[6]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING[1.5],
      }}
    >
      <img src="/favicon.svg" alt="" width={20} height={20} style={{ opacity: OPACITY.visible }} />
      <span
        style={{
          fontSize: FONT_SIZE.xs,
          fontWeight: FONT_WEIGHT.semibold,
          color: COLOR_TOKENS.navy,
          opacity: OPACITY.subtle,
          letterSpacing: '0.025em',
        }}
      >
        A tribute by{' '}
        <a
          href="https://aramhammoudeh.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: 'inherit', textDecoration: 'underline' }}
        >
          aramhammoudeh.com
        </a>
      </span>
    </footer>
  );
}
