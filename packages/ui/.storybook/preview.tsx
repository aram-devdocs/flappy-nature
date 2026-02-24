import { COLOR_TOKENS } from '@repo/types';
import type { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        style={
          {
            '--fn-navy': COLOR_TOKENS.navy,
            '--fn-violet': COLOR_TOKENS.violet,
            '--fn-cyan': COLOR_TOKENS.cyan,
            '--fn-magenta': COLOR_TOKENS.magenta,
            '--fn-light': COLOR_TOKENS.light,
            '--fn-white': COLOR_TOKENS.white,
            '--fn-midviolet': COLOR_TOKENS.midviolet,
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
