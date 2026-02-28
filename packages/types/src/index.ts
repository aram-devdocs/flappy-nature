export {
  GameState,
  Difficulty,
  DIFF_KEYS,
  DIFF_LABELS,
  STORAGE_KEYS,
  createEmptyBestScores,
  getDifficultyColors,
} from './constants';
export type { DifficultyKey, BestScores } from './constants';

export { isDifficultyKey, isGameState, safeJsonParse } from './guards';

export type {
  DifficultyPreset,
  DifficultyMap,
  GameConfig,
  GameColors,
  BackgroundConfig,
} from './game';

export type {
  Bird,
  Pipe,
  Cloud,
  SkylineCity,
  SkylineBuilding,
  SkylineSegment,
  BuildingType,
  Building,
  TreeType,
  Tree,
  GroundDeco,
  BgLayers,
} from './entities';

export type { EngineEvents, EngineEventName, EngineConfig } from './engine';

export { PatternType, MovementArc } from './director';
export type {
  PipeIntent,
  PhaseConfig,
  MilestoneThreshold,
  DifficultyProfile,
  ProgressionState,
} from './director';

export type { CanvasStack, CanvasContexts, RendererDeps } from './canvas';

export type { FlappyGoudaGameProps } from './props';

export type {
  DebugFrameSnapshot,
  DebugFrameStats,
  DebugEntityCounts,
  DebugSystemInfo,
  DebugLogEntry,
  DebugMetricsSnapshot,
  DebugRecordingSession,
  DebugRecording,
  DebugControls,
} from './debug';

export type {
  LeaderboardEntry,
  NicknameCheckResult,
  LeaderboardConnectionStatus,
  LeaderboardData,
  LeaderboardCallbacks,
  LeaderboardProps,
  LeaderboardSeparator,
  LeaderboardWindowEntry,
  LeaderboardWindowItem,
} from './leaderboard';

export { NICKNAME_LENGTH, NICKNAME_PATTERN } from './leaderboard';

export {
  DESIGN_TOKENS,
  DEFAULT_GAME_COLORS,
  COLOR_TOKENS,
  COLOR_RGB,
  CSS_VAR_PREFIX,
  RGBA_TOKENS,
  FONT_FAMILY,
  FONT_SIZE,
  FONT_WEIGHT,
  LINE_HEIGHT,
  SPACING,
  RADIUS,
  BORDER_WIDTH,
  SHADOW,
  TEXT_SHADOW,
  Z_INDEX,
  OPACITY,
  STATUS_COLORS,
  cssVar,
} from './tokens';
