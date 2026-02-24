import type { Meta, StoryObj } from '@storybook/react';
import { FpsCounter } from './FpsCounter';

const meta: Meta<typeof FpsCounter> = {
  title: 'atoms/FpsCounter',
  component: FpsCounter,
};
export default meta;
type Story = StoryObj<typeof FpsCounter>;

export const Default: Story = { args: { fps: 60, visible: true } };
export const Hidden: Story = { args: { fps: 60, visible: false } };
export const Zero: Story = { args: { fps: 0, visible: true } };
export const High: Story = { args: { fps: 144, visible: true } };
