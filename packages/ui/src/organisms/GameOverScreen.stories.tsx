import type { Meta, StoryObj } from '@storybook/react';
import { GameOverScreen } from './GameOverScreen';

const meta: Meta<typeof GameOverScreen> = {
  title: 'organisms/GameOverScreen',
  component: GameOverScreen,
  decorators: [
    (Story) => (
      <div style={{ position: 'relative', width: 400, height: 400 }}>
        <Story />
      </div>
    ),
  ],
};
export default meta;
type Story = StoryObj<typeof GameOverScreen>;

export const Default: Story = { args: { visible: true, score: 7, bestScore: 15 } };
export const NewHighScore: Story = { args: { visible: true, score: 20, bestScore: 20 } };
export const ZeroScore: Story = { args: { visible: true, score: 0, bestScore: 0 } };
export const Hidden: Story = { args: { visible: false, score: 0, bestScore: 0 } };
