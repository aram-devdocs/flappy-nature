import { COLOR_TOKENS, FONT_FAMILY, FONT_SIZE, FONT_WEIGHT, SPACING } from '@repo/types';
import type { ReactNode } from 'react';

/** Props for {@link GamePage}. */
export interface GamePageProps {
  /** Page title displayed above the game. */
  title: string;
  /** Page content (typically the game component). */
  children: ReactNode;
}

/** Full-page centered layout for hosting the game. */
export function GamePage({ title, children }: GamePageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        padding: SPACING[6],
        fontFamily: FONT_FAMILY.body,
      }}
    >
      <h1
        style={{
          fontSize: FONT_SIZE['4xl'],
          fontWeight: FONT_WEIGHT.extrabold,
          color: COLOR_TOKENS.navy,
          marginBottom: SPACING[4],
        }}
      >
        {title}
      </h1>
      {children}
    </div>
  );
}
