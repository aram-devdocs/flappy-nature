import type { DifficultyProfile, GameConfig, PhaseConfig, ProgressionState } from '@repo/types';
import { MovementArc } from '@repo/types';
import type { EngineEventEmitter } from './engine-events';

/**
 * Tracks score-based progression within a single run. Owns phase transitions,
 * effective difficulty multiplier computation, milestone events, and game-feel
 * streak stats. The movement arc is NOT managed here -- the PipeDirector owns
 * that -- but it's accepted as input for the combined state snapshot.
 */
export class ProgressionManager {
  private readonly profile: DifficultyProfile;
  private readonly baseGap: number;
  private readonly baseSpeed: number;
  private readonly baseSpawnDelay: number;
  private readonly events: EngineEventEmitter;

  private phaseIdx = 0;
  private milestonePtr = 0;
  private _cleanStreak = 0;
  private _clutchCount = 0;
  private _longestCleanStreak = 0;

  constructor(profile: DifficultyProfile, baseConfig: GameConfig, events: EngineEventEmitter) {
    this.profile = profile;
    this.baseGap = baseConfig.pipeGap;
    this.baseSpeed = baseConfig.pipeSpeed;
    this.baseSpawnDelay = baseConfig.pipeSpawn;
    this.events = events;
  }

  get phase(): PhaseConfig {
    return this.profile.phases[this.phaseIdx] as PhaseConfig;
  }

  get phaseIndex(): number {
    return this.phaseIdx;
  }

  get effectiveGap(): number {
    return Math.max(this.baseGap * this.phase.gapMultiplier, this.profile.gapFloor);
  }

  get effectiveSpeed(): number {
    return Math.min(this.baseSpeed * this.phase.speedMultiplier, this.profile.speedCeiling);
  }

  get effectiveSpawnDelay(): number {
    return this.baseSpawnDelay * this.phase.spawnMultiplier;
  }

  get cleanStreak(): number {
    return this._cleanStreak;
  }

  get clutchCount(): number {
    return this._clutchCount;
  }

  get longestCleanStreak(): number {
    return this._longestCleanStreak;
  }

  /**
   * Feed a new score. Advances phases and fires milestone events as thresholds
   * are crossed. Call this from the engine's scoreChange handler.
   */
  onScore(score: number): void {
    this.advancePhase(score);
    this.advanceMilestones(score);
  }

  recordNearMiss(): void {
    this._clutchCount++;
    this.finalizeStreak();
    this._cleanStreak = 0;
  }

  recordCleanPass(): void {
    this._cleanStreak++;
    this.finalizeStreak();
  }

  /**
   * Build a read-only snapshot for debug UI / death screen. The `arc` parameter
   * is provided by the PipeDirector since it owns the movement arc lifecycle.
   */
  snapshot(arc: MovementArc = MovementArc.Build): ProgressionState {
    return {
      phaseName: this.phase.name,
      phaseIndex: this.phaseIdx,
      arc,
      effectiveGap: this.effectiveGap,
      effectiveSpeed: this.effectiveSpeed,
      effectiveSpawnDelay: this.effectiveSpawnDelay,
      cleanStreak: this._cleanStreak,
      clutchCount: this._clutchCount,
      longestCleanStreak: this._longestCleanStreak,
    };
  }

  reset(): void {
    this.phaseIdx = 0;
    this.milestonePtr = 0;
    this._cleanStreak = 0;
    this._clutchCount = 0;
    this._longestCleanStreak = 0;
  }

  // --- internals ---

  /** Upper-bound binary search: find the highest phase whose threshold <= score. */
  private advancePhase(score: number): void {
    const phases = this.profile.phases;
    let lo = 0;
    let hi = phases.length - 1;
    while (lo < hi) {
      const mid = (lo + hi + 1) >>> 1;
      const p = phases[mid];
      if (p && p.scoreThreshold <= score) lo = mid;
      else hi = mid - 1;
    }
    if (lo !== this.phaseIdx) {
      this.phaseIdx = lo;
      const entered = phases[lo];
      if (entered) this.events.emit('phaseChange', entered.name);
    }
  }

  /** Walk the milestone list forward, emitting events for each threshold crossed. */
  private advanceMilestones(score: number): void {
    const ms = this.profile.milestones;
    let m = ms[this.milestonePtr];
    while (m && this.milestonePtr < ms.length && score >= m.score) {
      this.events.emit('milestone', m.score, m.label, m.celebration);
      this.milestonePtr++;
      m = ms[this.milestonePtr];
    }
  }

  private finalizeStreak(): void {
    if (this._cleanStreak > this._longestCleanStreak) {
      this._longestCleanStreak = this._cleanStreak;
    }
  }
}
