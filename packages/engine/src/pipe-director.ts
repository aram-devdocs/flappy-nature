import type {
  DifficultyProfile,
  GameConfig,
  PatternType,
  PhaseConfig,
  PipeIntent,
} from '@repo/types';
import { MovementArc, PatternType as PT } from '@repo/types';
import { PATTERN_GENERATORS, type PatternParams } from './patterns';
import type { ProgressionManager } from './progression';
import { validateAndClamp } from './winnability';

/** Phrase count range [min, max] for each arc phase, keyed by difficulty. */
const ARC_LENGTHS: Record<string, Record<MovementArc, [number, number]>> = {
  easy: {
    [MovementArc.Build]: [4, 5],
    [MovementArc.Climax]: [1, 1],
    [MovementArc.Release]: [2, 3],
  },
  normal: {
    [MovementArc.Build]: [3, 4],
    [MovementArc.Climax]: [1, 2],
    [MovementArc.Release]: [1, 2],
  },
  hard: {
    [MovementArc.Build]: [2, 3],
    [MovementArc.Climax]: [2, 3],
    [MovementArc.Release]: [1, 1],
  },
  souls: {
    [MovementArc.Build]: [1, 2],
    [MovementArc.Climax]: [3, 4],
    [MovementArc.Release]: [1, 1],
  },
};

const BUILD_PATTERNS = new Set<PatternType>([
  PT.Scatter,
  PT.StairUp,
  PT.StairDown,
  PT.SineWave,
  PT.Tunnel,
]);
const CLIMAX_PATTERNS = new Set<PatternType>([
  PT.Zigzag,
  PT.Squeeze,
  PT.Rapids,
  PT.Tunnel,
  PT.StairUp,
  PT.StairDown,
]);
const PHRASE_MIN = 3;
const PHRASE_MAX = 8;
const MAX_REROLLS = 3;
const MIN_TIMING_FLOOR_MS = 200;

/**
 * Orchestrates pipe placement using phrase-based patterns, movement arc cycling,
 * and winnability validation. Owns the intent queue and narrative rhythm.
 */
export class PipeDirector {
  private queue: PipeIntent[] = [];
  private lastCenter: number;
  private lastPattern: PatternType | null = null;
  private arc: MovementArc = MovementArc.Build;
  private arcPhraseIdx = 0;
  private arcTarget = 0;
  private phrasesSinceBreather = 0;
  constructor(
    private progression: ProgressionManager,
    private readonly profile: DifficultyProfile,
    private readonly config: GameConfig,
  ) {
    this.lastCenter = config.height / 2;
    this.arcTarget = this.rollArcLength(MovementArc.Build);
  }

  get currentArc(): MovementArc {
    return this.arc;
  }

  get effectiveSpeed(): number {
    return this.progression.effectiveSpeed;
  }
  get effectiveSpawnDelay(): number {
    return this.progression.effectiveSpawnDelay;
  }

  /** Pop the next validated PipeIntent, generating a new phrase if the queue is empty. */
  next(): PipeIntent {
    if (this.queue.length === 0) this.enqueuePhrase();
    const intent = this.queue.shift();
    if (!intent) throw new Error('PipeDirector: queue empty after enqueue');
    return intent;
  }

  /** Clear all state for a fresh run. */
  reset(): void {
    this.queue.length = 0;
    this.lastCenter = this.config.height / 2;
    this.lastPattern = null;
    this.arc = MovementArc.Build;
    this.arcPhraseIdx = 0;
    this.arcTarget = this.rollArcLength(MovementArc.Build);
    this.phrasesSinceBreather = 0;
  }

  private enqueuePhrase(): void {
    const phase = this.progression.phase;
    const breatherOverdue = this.phrasesSinceBreather >= phase.breatherFrequency;

    const pattern: PatternType =
      this.arc === MovementArc.Release || breatherOverdue ? pickRelease() : this.pickPattern(phase);

    if (this.arc === MovementArc.Release || breatherOverdue) {
      this.phrasesSinceBreather = 0;
    }

    const [minI, maxI] = phase.intensityRange;
    const intensity = minI + Math.random() * (maxI - minI);
    const count = PHRASE_MIN + Math.floor(Math.random() * (PHRASE_MAX - PHRASE_MIN + 1));

    const params: PatternParams = {
      count,
      startCenter: this.lastCenter,
      baseGap: this.progression.effectiveGap,
      canvasH: this.config.height,
      groundH: this.config.groundH,
      margin: this.config.pipeSpawnMargin,
      baseDelay: this.progression.effectiveSpawnDelay,
      intensity,
      rng: Math.random,
    };

    const raw = PATTERN_GENERATORS[pattern](params);
    let prev = this.lastCenter;
    for (let i = 0; i < raw.length; i++) {
      const base = raw[i];
      if (!base) continue;
      let intent: PipeIntent = this.applyVariations(base);
      intent = validateAndClamp(intent, prev, this.config, this.profile.graceFactor);
      raw[i] = intent;
      prev = intent.gapCenter;
    }

    this.queue.push(...raw);
    this.lastCenter = prev;
    this.lastPattern = pattern;
    this.phrasesSinceBreather++;
    this.advanceArc();
  }

  private pickPattern(phase: PhaseConfig): PatternType {
    const allowed = this.arc === MovementArc.Climax ? CLIMAX_PATTERNS : BUILD_PATTERNS;
    const weights = phase.patternWeights;

    for (let roll = 0; roll <= MAX_REROLLS; roll++) {
      const pick = weightedPick(weights, allowed);
      if (pick !== this.lastPattern || roll === MAX_REROLLS) return pick;
    }
    return PT.Scatter;
  }

  private applyVariations(intent: PipeIntent): PipeIntent {
    let { gapSize, delay } = intent;
    const { gapCenter } = intent;
    let changed = false;

    if (this.profile.hasGapVariation) {
      const v = this.profile.gapVariationAmount;
      gapSize += (Math.random() * 2 - 1) * v;
      gapSize = Math.max(this.profile.gapFloor, gapSize);
      changed = true;
    }
    if (this.profile.hasTimingVariation && delay > 0) {
      const v = this.profile.timingVariationAmount;
      delay += (Math.random() * 2 - 1) * v;
      delay = Math.max(MIN_TIMING_FLOOR_MS, delay);
      changed = true;
    }

    return changed ? { gapCenter, gapSize, delay } : intent;
  }

  private advanceArc(): void {
    this.arcPhraseIdx++;
    if (this.arcPhraseIdx < this.arcTarget) return;
    this.arcPhraseIdx = 0;
    this.arc = nextArcPhase(this.arc);
    this.arcTarget = this.rollArcLength(this.arc);
  }

  private rollArcLength(arc: MovementArc): number {
    const lengths = ARC_LENGTHS[this.profile.key] ?? ARC_LENGTHS.normal;
    const range = lengths?.[arc] ?? [3, 4];
    return range[0] + Math.floor(Math.random() * (range[1] - range[0] + 1));
  }
}

function pickRelease(): PatternType {
  return Math.random() < 0.5 ? PT.Scatter : PT.Drift;
}

function nextArcPhase(arc: MovementArc): MovementArc {
  if (arc === MovementArc.Build) return MovementArc.Climax;
  if (arc === MovementArc.Climax) return MovementArc.Release;
  return MovementArc.Build;
}

function weightedPick(
  weights: Record<PatternType, number>,
  allowed: Set<PatternType>,
): PatternType {
  let total = 0;
  for (const [k, w] of Object.entries(weights)) {
    if (allowed.has(k as PatternType) && w > 0) total += w;
  }
  if (total === 0) return PT.Scatter;

  let r = Math.random() * total;
  for (const [k, w] of Object.entries(weights)) {
    if (!allowed.has(k as PatternType) || w <= 0) continue;
    r -= w;
    if (r <= 0) return k as PatternType;
  }
  return PT.Scatter;
}
