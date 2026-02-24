import type { Meta, StoryObj } from '@storybook/react';
import { GameCanvas } from './GameCanvas';

const meta: Meta<typeof GameCanvas> = {
  title: 'atoms/GameCanvas',
  component: GameCanvas,
};
export default meta;
type Story = StoryObj<typeof GameCanvas>;

export const Default: Story = { args: {} };
