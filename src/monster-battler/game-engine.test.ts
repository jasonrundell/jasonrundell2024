import { GameEngine } from './game-engine';
import type { GameState, HeroState, MonsterStats, MonsterConfig } from './types';
import { DEFAULT_HERO_STATS, MONSTER_CONFIGS } from './constants';

describe('GameEngine', () => {
  let engine: GameEngine;
  let mockGameState: GameState;
  let mockHero: HeroState;
  let mockMonster: MonsterStats;
  let mockMonsterConfig: MonsterConfig;

  beforeEach(() => {
    engine = new GameEngine();
    mockHero = {
      stats: { ...DEFAULT_HERO_STATS },
      comboCount: 0,
      comboMultiplier: 1,
      isBlocking: false,
      isDodging: false,
      dodgeDirection: null,
      lastAction: null,
      upgrades: [],
    };
    mockMonsterConfig = MONSTER_CONFIGS[0];
    mockMonster = {
      ...mockMonsterConfig.baseStats,
      currentHealth: mockMonsterConfig.baseStats.maxHealth,
      phase: 'idle',
      phaseTimer: 2000,
      attackCooldown: 0,
    };
    mockGameState = {
      mode: 'gauntlet',
      currentMonsterIndex: 0,
      hero: mockHero,
      monster: mockMonster,
      monsterConfig: mockMonsterConfig,
      score: 0,
      startTime: Date.now(),
      isPaused: false,
      isGameOver: false,
      isVictory: false,
      counterWindowActive: false,
      counterWindowExpires: 0,
    };
  });

  describe('calculateHeroDamage', () => {
    it('should calculate light attack damage correctly', () => {
      const damage = engine.calculateHeroDamage(mockHero, 'light', false);
      expect(damage).toBeGreaterThan(0);
      expect(damage).toBeLessThanOrEqual(mockHero.stats.attackPower * 2);
    });

    it('should calculate heavy attack damage correctly', () => {
      const damage = engine.calculateHeroDamage(mockHero, 'heavy', false);
      expect(damage).toBeGreaterThan(mockHero.stats.attackPower);
    });

    it('should calculate special attack damage correctly', () => {
      const damage = engine.calculateHeroDamage(mockHero, 'special', false);
      expect(damage).toBeGreaterThan(mockHero.stats.attackPower * 2);
    });

    it('should apply counter multiplier when counter window is active', () => {
      const normalDamage = engine.calculateHeroDamage(mockHero, 'light', false);
      const counterDamage = engine.calculateHeroDamage(mockHero, 'light', true);
      expect(counterDamage).toBeGreaterThan(normalDamage);
    });

    it('should apply combo multiplier', () => {
      const heroWithCombo = {
        ...mockHero,
        comboCount: 10,
        comboMultiplier: 2.0,
      };
      const damage = engine.calculateHeroDamage(heroWithCombo, 'light', false);
      expect(damage).toBeGreaterThan(mockHero.stats.attackPower);
    });
  });

  describe('calculateMonsterDamage', () => {
    it('should calculate monster damage with defense', () => {
      const damage = engine.calculateMonsterDamage(mockMonster, 10, 5);
      expect(damage).toBe(5);
    });

    it('should return at least 1 damage even with high defense', () => {
      const damage = engine.calculateMonsterDamage(mockMonster, 10, 100);
      expect(damage).toBe(1);
    });
  });

  describe('getStaminaCost', () => {
    it('should return correct stamina cost for light attack', () => {
      expect(engine.getStaminaCost('light')).toBe(10);
    });

    it('should return correct stamina cost for heavy attack', () => {
      expect(engine.getStaminaCost('heavy')).toBe(25);
    });

    it('should return 0 stamina cost for special attack', () => {
      expect(engine.getStaminaCost('special')).toBe(0);
    });
  });

  describe('processInput', () => {
    it('should process light attack input', () => {
      const newState = engine.processInput(mockGameState, { attack: 'light' }, 16);
      expect(newState.hero.lastAction).toBe('light');
      expect(newState.hero.stats.currentStamina).toBeLessThan(mockHero.stats.currentStamina);
    });

    it('should not process attack if stamina is insufficient', () => {
      const lowStaminaHero = {
        ...mockHero,
        stats: { ...mockHero.stats, currentStamina: 5 },
      };
      const lowStaminaState = { ...mockGameState, hero: lowStaminaHero };
      const newState = engine.processInput(lowStaminaState, { attack: 'heavy' }, 16);
      expect(newState.hero.stats.currentStamina).toBe(5);
    });

    it('should process block input', () => {
      const newState = engine.processInput(mockGameState, { block: true }, 16);
      expect(newState.hero.isBlocking).toBe(true);
    });

    it('should process dodge input', () => {
      const newState = engine.processInput(mockGameState, { dodge: 'left' }, 16);
      expect(newState.hero.isDodging).toBe(true);
      expect(newState.hero.dodgeDirection).toBe('left');
    });

    it('should regenerate stamina over time', () => {
      const lowStaminaHero = {
        ...mockHero,
        stats: { ...mockHero.stats, currentStamina: 50 },
      };
      const lowStaminaState = { ...mockGameState, hero: lowStaminaHero };
      const newState = engine.processInput(lowStaminaState, {}, 1000);
      expect(newState.hero.stats.currentStamina).toBeGreaterThan(50);
    });
  });

  describe('checkGameOver', () => {
    it('should set game over when hero health reaches zero', () => {
      const deadHero = {
        ...mockHero,
        stats: { ...mockHero.stats, currentHealth: 0 },
      };
      const deadState = { ...mockGameState, hero: deadHero };
      const result = engine.checkGameOver(deadState);
      expect(result.isGameOver).toBe(true);
      expect(result.isVictory).toBe(false);
    });

    it('should set victory when monster health reaches zero', () => {
      const deadMonster = {
        ...mockMonster,
        currentHealth: 0,
      };
      const deadState = { ...mockGameState, monster: deadMonster };
      const result = engine.checkGameOver(deadState);
      expect(result.isVictory).toBe(true);
    });
  });
});

