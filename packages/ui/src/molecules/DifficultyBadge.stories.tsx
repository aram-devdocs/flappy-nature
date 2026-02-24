import type { Meta, StoryObj } from '@storybook/react';
import { DifficultyBadge } from './DifficultyBadge';

const meta: Meta<typeof DifficultyBadge> = {
  title: 'molecules/DifficultyBadge',
  component: DifficultyBadge,
};
export default meta;
type Story = StoryObj<typeof DifficultyBadge>;

export const Easy: Story = { args: { difficulty: 'easy', visible: true, onClick: () => {} } };
export const Normal: Story = { args: { difficulty: 'normal', visible: true, onClick: () => {} } };
export const Hard: Story = { args: { difficulty: 'hard', visible: true, onClick: () => {} } };
export const Hidden: Story = { args: { difficulty: 'easy', visible: false, onClick: () => {} } };
