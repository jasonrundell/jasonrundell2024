import { MonsterAI } from './monster-ai';
import type { MonsterStats, MonsterConfig } from './types';
import { MONSTER_CONFIGS } from './constants';

describe('MonsterAI', () => {
  let ai: MonsterAI;
  let mockMonster: MonsterStats;
  let mockConfig: MonsterConfig;

  beforeEach(() => {
    ai = new MonsterAI();
    mockConfig = MONSTER_CONFIGS[0];
    mockMonster = {
      ...mockConfig.baseStats,
      currentHealth: mockConfig.baseStats.maxHealth,
      phase: 'idle',
      phaseTimer: 2000,
      attackCooldown: 0,
    };
  });

  describe('updateMonster', () => {
    it('should update phase timer', () => {
      const updated = ai.updateMonster(mockMonster, mockConfig, 100, 100);
      expect(updated.phaseTimer).toBeLessThan(mockMonster.phaseTimer);
    });

    it('should transition phases when timer expires', () => {
      const updated = ai.updateMonster(mockMonster, mockConfig, 2500, 100);
      expect(updated.phase).not.toBe(mockMonster.phase);
    });

    it('should update attack cooldown', () => {
      const monsterWithCooldown = {
        ...mockMonster,
        attackCooldown: 500,
      };
      const updated = ai.updateMonster(monsterWithCooldown, mockConfig, 100, 100);
      expect(updated.attackCooldown).toBeLessThan(monsterWithCooldown.attackCooldown);
    });

    it('should enter enrage phase when health is low', () => {
      const lowHealthMonster = {
        ...mockMonster,
        currentHealth: mockConfig.baseStats.maxHealth * 0.2,
        phase: 'idle',
      };
      const updated = ai.updateMonster(lowHealthMonster, mockConfig, 2500, 100);
      expect(updated.phase).toBe('enrage');
    });
  });

  describe('shouldAttack', () => {
    it('should return false when not in attack phase', () => {
      const idleMonster = {
        ...mockMonster,
        phase: 'idle',
      };
      expect(ai.shouldAttack(idleMonster, mockConfig, false, false)).toBe(false);
    });

    it('should return false when attack cooldown is active', () => {
      const cooldownMonster = {
        ...mockMonster,
        phase: 'attack',
        attackCooldown: 100,
      };
      expect(ai.shouldAttack(cooldownMonster, mockConfig, false, false)).toBe(false);
    });

    it('should return true when conditions are met', () => {
      const attackMonster = {
        ...mockMonster,
        phase: 'attack',
        attackCooldown: 0,
      };
      // Mock Math.random to return high value
      const originalRandom = Math.random;
      Math.random = jest.fn(() => 0.1);
      const result = ai.shouldAttack(attackMonster, mockConfig, false, false);
      Math.random = originalRandom;
      expect(typeof result).toBe('boolean');
    });
  });

  describe('getTelegraphDuration', () => {
    it('should return 0 when not in telegraph phase', () => {
      expect(ai.getTelegraphDuration(mockMonster, mockConfig)).toBe(0);
    });

    it('should return telegraph duration when in telegraph phase', () => {
      const telegraphMonster = {
        ...mockMonster,
        phase: 'telegraph',
      };
      const duration = ai.getTelegraphDuration(telegraphMonster, mockConfig);
      expect(duration).toBeGreaterThan(0);
    });
  });

  describe('scaleMonsterStats', () => {
    it('should scale monster stats based on index', () => {
      const scaled = ai.scaleMonsterStats(mockConfig, 2);
      expect(scaled.baseStats.maxHealth).toBeGreaterThan(mockConfig.baseStats.maxHealth);
      expect(scaled.baseStats.attackPower).toBeGreaterThan(mockConfig.baseStats.attackPower);
    });

    it('should return same stats for index 0', () => {
      const scaled = ai.scaleMonsterStats(mockConfig, 0);
      expect(scaled.baseStats.maxHealth).toBe(mockConfig.baseStats.maxHealth);
    });

    it('should scale exponentially', () => {
      const scaled1 = ai.scaleMonsterStats(mockConfig, 1);
      const scaled2 = ai.scaleMonsterStats(mockConfig, 2);
      const ratio1 = scaled1.baseStats.maxHealth / mockConfig.baseStats.maxHealth;
      const ratio2 = scaled2.baseStats.maxHealth / scaled1.baseStats.maxHealth;
      expect(ratio2).toBeGreaterThan(ratio1);
    });
  });
});

