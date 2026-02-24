import type { Meta, StoryObj } from '@storybook/react';
import { GameContainer } from './GameContainer';

const meta: Meta<typeof GameContainer> = {
  title: 'organisms/GameContainer',
  component: GameContainer,
};
export default meta;
type Story = StoryObj<typeof GameContainer>;

export const Default: Story = {
  args: {
    children: <div style={{ padding: 24, textAlign: 'center' }}>Game content goes here</div>,
  },
};

export const CustomColors: Story = {
  args: {
    colors: { navy: '#1a1a2e', violet: '#e94560' },
    children: <div style={{ padding: 24, textAlign: 'center' }}>Custom themed content</div>,
  },
};
