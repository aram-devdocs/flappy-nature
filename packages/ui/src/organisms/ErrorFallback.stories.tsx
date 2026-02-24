import type { Meta, StoryObj } from '@storybook/react';
import { ErrorFallback } from './ErrorFallback';

const meta: Meta<typeof ErrorFallback> = {
  title: 'organisms/ErrorFallback',
  component: ErrorFallback,
};
export default meta;
type Story = StoryObj<typeof ErrorFallback>;

export const Default: Story = {
  args: { message: 'An unexpected error occurred while running the game.', onReset: () => {} },
};

export const ShortMessage: Story = {
  args: { message: 'Canvas not supported.', onReset: () => {} },
};
