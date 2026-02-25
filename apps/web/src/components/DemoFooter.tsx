import { COLOR_TOKENS, FONT_SIZE, FONT_WEIGHT, OPACITY, SPACING } from '@repo/flappy-gouda-game';

export function DemoFooter() {
  return (
    <footer
      style={{
        background: COLOR_TOKENS.navy,
        padding: `0 ${SPACING[6]} ${SPACING[5]}`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING[1.5],
      }}
    >
      <div
        style={{
          height: '1px',
          width: '64px',
          background: `linear-gradient(90deg, ${COLOR_TOKENS.magenta}, ${COLOR_TOKENS.cyan})`,
          opacity: OPACITY.visible,
          marginBottom: SPACING[4],
          marginTop: SPACING[5],
        }}
      />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: SPACING[1],
        }}
      >
        <img
          src="/assets/logos/vegan-gouda-leaf.png"
          alt="Vegan Gouda Development"
          width={28}
          height={28}
          style={{ opacity: OPACITY.strong }}
        />
        <span
          style={{
            fontSize: FONT_SIZE.xs,
            fontWeight: FONT_WEIGHT.semibold,
            color: COLOR_TOKENS.light,
            opacity: OPACITY.visible,
            letterSpacing: '0.025em',
          }}
        >
          &copy; Vegan Gouda Development
        </span>
      </div>
      <span
        style={{
          fontSize: FONT_SIZE['2xs'],
          fontWeight: FONT_WEIGHT.normal,
          color: COLOR_TOKENS.light,
          opacity: OPACITY.subtle,
          letterSpacing: '0.025em',
        }}
      >
        Built by{' '}
        <a
          href="https://github.com/aram-devdocs"
          target="_blank"
          rel="noopener noreferrer"
          style={{
            color: COLOR_TOKENS.cyan,
            textDecoration: 'underline',
            fontWeight: FONT_WEIGHT.semibold,
          }}
        >
          aramhammoudeh
        </a>
      </span>
    </footer>
  );
}
