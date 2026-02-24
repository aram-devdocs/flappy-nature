import { COLOR_TOKENS, FONT_FAMILY, SPACING } from '@repo/flappy-nature-game';
import type { ReactNode } from 'react';
import { DemoBadges } from './DemoBadges.js';
import { DemoFooter } from './DemoFooter.js';
import { DemoHeader } from './DemoHeader.js';

interface DemoPageProps {
  children: ReactNode;
}

export function DemoPage({ children }: DemoPageProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
        background: `linear-gradient(to right bottom, ${COLOR_TOKENS.light}, ${COLOR_TOKENS.white})`,
        fontFamily: FONT_FAMILY.body,
      }}
    >
      <DemoHeader />
      <main
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: SPACING[6],
        }}
      >
        {children}
        <DemoBadges />
      </main>
      <DemoFooter />
    </div>
  );
}
