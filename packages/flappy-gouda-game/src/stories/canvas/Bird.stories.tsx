import { DEFAULT_COLORS, drawBird, loadCheeseImage } from '@repo/engine';
import type { Meta, StoryObj } from '@storybook/react';
import { useCallback, useEffect, useState } from 'react';
import { CanvasStage } from '../../CanvasStage';

const SIZE = 160;
const BIRD = 60;
const POS = (SIZE - BIRD) / 2;

function CircleBirdPreview() {
  const draw = useCallback((ctx: CanvasRenderingContext2D) => {
    drawBird(ctx, POS, 0, POS, BIRD, null, DEFAULT_COLORS);
  }, []);

  return (
    <CanvasStage width={SIZE} height={SIZE} backgroundColor={DEFAULT_COLORS.light} draw={draw} />
  );
}

function CheeseBirdPreview({ rotation }: { rotation: number }) {
  const [spriteImg, setSpriteImg] = useState<HTMLImageElement | null>(null);

  useEffect(() => {
    loadCheeseImage(DEFAULT_COLORS.magenta).then(setSpriteImg).catch(console.error);
  }, []);

  const draw = useCallback(
    (ctx: CanvasRenderingContext2D) => {
      drawBird(ctx, POS, rotation, POS, BIRD, spriteImg, DEFAULT_COLORS);
    },
    [rotation, spriteImg],
  );

  return (
    <CanvasStage width={SIZE} height={SIZE} backgroundColor={DEFAULT_COLORS.light} draw={draw} />
  );
}

const meta: Meta<typeof CheeseBirdPreview> = {
  title: 'Canvas Assets/Bird',
  component: CheeseBirdPreview,
  argTypes: {
    rotation: { control: { type: 'range', min: -20, max: 55, step: 1 } },
  },
};

export default meta;

export const CircleBird: StoryObj<typeof CircleBirdPreview> = {
  render: () => <CircleBirdPreview />,
};

export const CheeseBird: StoryObj<typeof CheeseBirdPreview> = {
  args: { rotation: 0 },
};

export const NoseUp: StoryObj<typeof CheeseBirdPreview> = {
  args: { rotation: -20 },
};

export const NoseDown: StoryObj<typeof CheeseBirdPreview> = {
  args: { rotation: 55 },
};
