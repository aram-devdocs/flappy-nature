import { SPACING } from '@repo/flappy-nature-game';

const GITHUB_URL = 'https://github.com/aram-devdocs/flappy-nature';
const STORYBOOK_URL = 'https://flappy-nature.aramhammoudeh.com/storybook/';

export function DemoBadges() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: SPACING[2],
        padding: `${SPACING[3]} 0`,
        flexWrap: 'wrap',
      }}
    >
      <a href={GITHUB_URL} target="_blank" rel="noopener noreferrer">
        <img
          src="https://img.shields.io/badge/GitHub-flappy--nature-181717?logo=github&style=flat-square"
          alt="GitHub"
          height={20}
        />
      </a>
      <a href={STORYBOOK_URL} target="_blank" rel="noopener noreferrer">
        <img
          src="https://img.shields.io/badge/Storybook-live-FF4785?logo=storybook&style=flat-square"
          alt="Storybook"
          height={20}
        />
      </a>
    </div>
  );
}
