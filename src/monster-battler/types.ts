/**
 * Type definitions for Monster Battler game
 */

export type AttackType = 'light' | 'heavy' | 'special';
export type DodgeDirection = 'left' | 'right' | 'up' | 'down';
export type MonsterPhase = 'idle' | 'telegraph' | 'attack' | 'vulnerable' | 'enrage';
export type GameMode = 'gauntlet' | 'bossRush' | 'endless' | 'tutorial';

export interface HeroStats {
  maxHealth: number;
  currentHealth: number;
  maxStamina: number;
  currentStamina: number;
  maxFocus: number;
  currentFocus: number;
  attackPower: number;
  defense: number;
  speed: number;
}

export interface HeroState {
  stats: HeroStats;
  comboCount: number;
  comboMultiplier: number;
  isBlocking: boolean;
  isDodging: boolean;
  dodgeDirection: DodgeDirection | null;
  lastAction: AttackType | 'block' | 'dodge' | null;
  upgrades: HeroUpgrade[];
}

export interface HeroUpgrade {
  id: string;
  name: string;
  type: 'passive' | 'special';
  effect: string;
}

export interface MonsterStats {
  maxHealth: number;
  currentHealth: number;
  attackPower: number;
  defense: number;
  speed: number;
  phase: MonsterPhase;
  phaseTimer: number;
  attackCooldown: number;
}

export interface MonsterConfig {
  id: string;
  name: string;
  spriteIndex: number; // Index in the sprite sheet
  color: 'magenta' | 'cyan' | 'green' | 'blue';
  baseStats: Omit<MonsterStats, 'currentHealth' | 'phase' | 'phaseTimer' | 'attackCooldown'>;
  phases: MonsterPhaseConfig[];
  attackPatterns: AttackPattern[];
  tells: TelegraphConfig[];
}

export interface MonsterPhaseConfig {
  phase: MonsterPhase;
  duration: number;
  attackFrequency: number;
  movementSpeed: number;
}

export interface AttackPattern {
  id: string;
  phase: MonsterPhase;
  damage: number;
  windupTime: number;
  recoveryTime: number;
  hitbox: Hitbox;
  telegraphId: string;
}

export interface TelegraphConfig {
  id: string;
  duration: number;
  visualCue: string;
  audioCue?: string;
}

export interface Hitbox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface GameState {
  mode: GameMode;
  currentMonsterIndex: number;
  hero: HeroState;
  monster: MonsterStats;
  monsterConfig: MonsterConfig | null;
  score: number;
  startTime: number;
  isPaused: boolean;
  isGameOver: boolean;
  isVictory: boolean;
  counterWindowActive: boolean;
  counterWindowExpires: number;
}

export interface BattleResult {
  monsterId: string;
  monsterName: string;
  victory: boolean;
  damageDealt: number;
  damageTaken: number;
  totalDodges: number;
  totalBlocks: number;
  longestCombo: number;
  specialsUsed: number;
  accuracy: number;
  duration: number;
}

export interface PlayHistory {
  runId: string;
  mode: GameMode;
  startTime: number;
  endTime: number | null;
  battles: BattleResult[];
  totalScore: number;
  monstersDefeated: number;
  completionTime: number | null;
}

export interface ScoreboardEntry {
  id: string;
  userId: string | null;
  mode: GameMode;
  score: number;
  monstersDefeated: number;
  completionTime: number;
  timestamp: number;
  playHistory: PlayHistory;
}

export interface GameStorage {
  scoreboard: ScoreboardEntry[];
  playHistory: PlayHistory[];
  bestScore: number;
  bestTime: number;
  achievements: Achievement[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  unlockedAt: number | null;
  progress: number;
  maxProgress: number;
}

export interface GameInput {
  attack?: AttackType;
  block?: boolean;
  dodge?: DodgeDirection;
  special?: boolean;
}

