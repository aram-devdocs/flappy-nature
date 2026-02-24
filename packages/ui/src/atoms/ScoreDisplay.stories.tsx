import type { Meta, StoryObj } from '@storybook/react';
import { ScoreDisplay } from './ScoreDisplay';

const meta: Meta<typeof ScoreDisplay> = {
  title: 'atoms/ScoreDisplay',
  component: ScoreDisplay,
};
export default meta;
type Story = StoryObj<typeof ScoreDisplay>;

export const Default: Story = { args: { score: 5, visible: true } };
export const Hidden: Story = { args: { score: 5, visible: false } };
export const Zero: Story = { args: { score: 0, visible: true } };
export const HighScore: Story = { args: { score: 999, visible: true } };
