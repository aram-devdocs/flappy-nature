import type { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <div
        style={
          {
            '--fn-navy': '#090949',
            '--fn-violet': '#6500D9',
            '--fn-cyan': '#00D9FF',
            '--fn-magenta': '#D76EFF',
            '--fn-light': '#FBF6F6',
            '--fn-white': '#FFFFFF',
            '--fn-midviolet': '#4B00A0',
          } as React.CSSProperties
        }
      >
        <Story />
      </div>
    ),
  ],
};

export default preview;
