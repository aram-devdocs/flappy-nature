import type { Meta, StoryObj } from '@storybook/react';
import { TitleScreen } from './TitleScreen';

const meta: Meta<typeof TitleScreen> = {
  title: 'organisms/TitleScreen',
  component: TitleScreen,
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 400, height: 400 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof TitleScreen>;

export const Default: Story = { args: { visible: true, bestScore: 0, onPlay: () => {} } };
export const WithBestScore: Story = { args: { visible: true, bestScore: 42, onPlay: () => {} } };
export const Hidden: Story = { args: { visible: false, bestScore: 0, onPlay: () => {} } };
