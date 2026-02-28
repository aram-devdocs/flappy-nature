import type { PipeIntent } from '@repo/types';
import { PatternType } from '@repo/types';
import { describe, expect, it } from 'vitest';
import { PATTERN_GENERATORS, type PatternParams, clampToBounds } from '../patterns';

const H = 520;
const G = 50;
const M = 60;
const GAP = 162;
const DELAY = 1700;

function makeRng(seed = 42): () => number {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) | 0;
    return (s >>> 0) / 4294967296;
  };
}

function params(over: Partial<PatternParams> = {}): PatternParams {
  return {
    count: 5,
    startCenter: 235,
    baseGap: GAP,
    canvasH: H,
    groundH: G,
    margin: M,
    baseDelay: DELAY,
    intensity: 0.5,
    rng: makeRng(),
    ...over,
  };
}

function assertInBounds(intents: PipeIntent[]): void {
  for (const { gapCenter, gapSize } of intents) {
    expect(gapSize).toBeGreaterThan(0);
    const topEdge = gapCenter - gapSize / 2;
    const botEdge = gapCenter + gapSize / 2;
    expect(topEdge).toBeGreaterThanOrEqual(M - 0.01);
    expect(botEdge).toBeLessThanOrEqual(H - G - M + 0.01);
  }
}

// ---------------------------------------------------------------------------
// clampToBounds
// ---------------------------------------------------------------------------

describe('clampToBounds', () => {
  it('returns center unchanged when within bounds', () => {
    expect(clampToBounds(235, GAP, H, G, M)).toBe(235);
  });

  it('clamps to minimum when center is too low', () => {
    expect(clampToBounds(0, GAP, H, G, M)).toBe(M + GAP / 2);
  });

  it('clamps to maximum when center is too high', () => {
    expect(clampToBounds(999, GAP, H, G, M)).toBe(H - G - M - GAP / 2);
  });

  it('returns midpoint when gap exceeds playable area', () => {
    const huge = 500;
    const min = M + huge / 2;
    const max = H - G - M - huge / 2;
    expect(clampToBounds(200, huge, H, G, M)).toBe((min + max) / 2);
  });
});

// ---------------------------------------------------------------------------
// All patterns: common bounds invariants
// ---------------------------------------------------------------------------

const ALL_TYPES = Object.values(PatternType) as PatternType[];

describe('all patterns — bounds correctness', () => {
  for (const type of ALL_TYPES) {
    describe(type, () => {
      const gen = PATTERN_GENERATORS[type];

      it('returns exactly count intents', () => {
        for (const count of [1, 3, 5, 8]) {
          expect(gen(params({ count }))).toHaveLength(count);
        }
      });

      it('all intents within playable bounds', () => {
        assertInBounds(gen(params()));
      });

      it('within bounds at intensity 0', () => {
        assertInBounds(gen(params({ intensity: 0 })));
      });

      it('within bounds at intensity 1', () => {
        assertInBounds(gen(params({ intensity: 1 })));
      });

      it('within bounds when startCenter at top edge', () => {
        assertInBounds(gen(params({ startCenter: M + GAP / 2 })));
      });

      it('within bounds when startCenter at bottom edge', () => {
        const bottom = H - G - M - GAP / 2;
        assertInBounds(gen(params({ startCenter: bottom })));
      });

      it('within bounds when startCenter is wildly out of range', () => {
        assertInBounds(gen(params({ startCenter: -500 })));
        assertInBounds(gen(params({ startCenter: 9999 })));
      });
    });
  }
});

// ---------------------------------------------------------------------------
// Pattern-specific behavior
// ---------------------------------------------------------------------------

describe('stairUp', () => {
  it('gap centers generally decrease (ascend in Y)', () => {
    const intents = PATTERN_GENERATORS[PatternType.StairUp](
      params({ startCenter: 300, intensity: 0.3 }),
    );
    for (let i = 1; i < intents.length; i++) {
      const prev = intents[i - 1]?.gapCenter ?? 0;
      const curr = intents[i]?.gapCenter ?? 0;
      expect(prev).toBeGreaterThanOrEqual(curr);
    }
  });
});

describe('stairDown', () => {
  it('gap centers generally increase (descend in Y)', () => {
    const intents = PATTERN_GENERATORS[PatternType.StairDown](
      params({ startCenter: 180, intensity: 0.3 }),
    );
    for (let i = 1; i < intents.length; i++) {
      const prev = intents[i - 1]?.gapCenter ?? Number.POSITIVE_INFINITY;
      const curr = intents[i]?.gapCenter ?? 0;
      expect(curr).toBeGreaterThanOrEqual(prev);
    }
  });
});

describe('tunnel', () => {
  it('gap sizes are smaller than baseGap', () => {
    const intents = PATTERN_GENERATORS[PatternType.Tunnel](params());
    for (const { gapSize } of intents) {
      expect(gapSize).toBeLessThan(GAP);
    }
  });

  it('gap centers cluster near startCenter', () => {
    const intents = PATTERN_GENERATORS[PatternType.Tunnel](params());
    for (const { gapCenter } of intents) {
      expect(Math.abs(gapCenter - 235)).toBeLessThan(20);
    }
  });
});

describe('squeeze', () => {
  it('middle intent has the tightest gap', () => {
    const intents = PATTERN_GENERATORS[PatternType.Squeeze](params({ count: 5, intensity: 0.8 }));
    const mid = Math.floor(intents.length / 2);
    const midGap = intents[mid]?.gapSize ?? Number.POSITIVE_INFINITY;
    const firstGap = intents[0]?.gapSize ?? 0;
    const lastGap = intents[intents.length - 1]?.gapSize ?? 0;
    expect(firstGap).toBeGreaterThanOrEqual(midGap);
    expect(lastGap).toBeGreaterThanOrEqual(midGap);
  });
});

describe('rapids', () => {
  it('delays are shorter than baseDelay', () => {
    const intents = PATTERN_GENERATORS[PatternType.Rapids](params());
    for (const { delay } of intents) {
      expect(delay).toBeGreaterThan(0);
      expect(delay).toBeLessThan(DELAY);
    }
  });
});

describe('drift', () => {
  it('gaps are wider than baseGap', () => {
    const intents = PATTERN_GENERATORS[PatternType.Drift](params());
    for (const { gapSize } of intents) {
      expect(gapSize).toBeGreaterThan(GAP);
    }
  });

  it('delays are longer than baseDelay', () => {
    const intents = PATTERN_GENERATORS[PatternType.Drift](params());
    for (const { delay } of intents) {
      expect(delay).toBeGreaterThan(DELAY);
    }
  });
});

describe('zigzag', () => {
  it('alternates high and low relative to startCenter', () => {
    const intents = PATTERN_GENERATORS[PatternType.Zigzag](
      params({ startCenter: 235, intensity: 0.5 }),
    );
    for (let i = 1; i < intents.length; i++) {
      const prev = intents[i - 1]?.gapCenter ?? 0;
      const curr = intents[i]?.gapCenter ?? 0;
      if (prev !== curr) {
        const prevSide = prev < 235 ? 'above' : 'below';
        const currSide = curr < 235 ? 'above' : 'below';
        expect(prevSide).not.toBe(currSide);
      }
    }
  });
});

describe('scatter', () => {
  it('uses default delays (0)', () => {
    const intents = PATTERN_GENERATORS[PatternType.Scatter](params());
    for (const { delay } of intents) {
      expect(delay).toBe(0);
    }
  });
});
