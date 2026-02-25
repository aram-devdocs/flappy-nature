import { COLOR_TOKENS } from '@repo/types';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        style={
          {
            '--fg-navy': COLOR_TOKENS.navy,
            '--fg-violet': COLOR_TOKENS.violet,
            '--fg-cyan': COLOR_TOKENS.cyan,
            '--fg-magenta': COLOR_TOKENS.magenta,
            '--fg-light': COLOR_TOKENS.light,
            '--fg-white': COLOR_TOKENS.white,
            '--fg-midviolet': COLOR_TOKENS.midviolet,
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
