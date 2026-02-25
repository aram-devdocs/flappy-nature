import type { Meta, StoryObj } from '@storybook/react';
import { CheeseIcon } from './CheeseIcon';

const meta: Meta<typeof CheeseIcon> = {
  title: 'atoms/CheeseIcon',
  component: CheeseIcon,
};
export default meta;
type Story = StoryObj<typeof CheeseIcon>;

export const Default: Story = {};
export const Small: Story = { args: { size: 24 } };
export const Large: Story = { args: { size: 96 } };
export const CustomColor: Story = { args: { color: '#0A3D5C' } };
