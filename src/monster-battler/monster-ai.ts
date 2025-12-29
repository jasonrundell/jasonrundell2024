/**
 * Monster AI system
 * Handles monster behavior, phase transitions, and attack patterns
 */

import type { MonsterStats, MonsterConfig, MonsterPhase } from './types';

export class MonsterAI {
  /**
   * Update monster state based on AI logic
   */
  updateMonster(
    monster: MonsterStats,
    config: MonsterConfig,
    deltaTime: number,
    heroHealth: number
  ): MonsterStats {
    const updated = { ...monster };

    // Update phase timer
    updated.phaseTimer -= deltaTime;

    // Check for phase transition
    if (updated.phaseTimer <= 0) {
      updated.phase = this.determineNextPhase(
        updated.phase,
        updated.currentHealth,
        config.baseStats.maxHealth,
        config
      );
      updated.phaseTimer = this.getPhaseDuration(updated.phase, config);
    }

    // Update attack cooldown
    updated.attackCooldown = Math.max(0, updated.attackCooldown - deltaTime);

    return updated;
  }

  /**
   * Determine if monster should attack
   */
  shouldAttack(
    monster: MonsterStats,
    config: MonsterConfig,
    heroBlocking: boolean,
    heroDodging: boolean
  ): boolean {
    if (monster.phase !== 'attack' && monster.phase !== 'enrage') {
      return false;
    }

    if (monster.attackCooldown > 0) {
      return false;
    }

    const phaseConfig = config.phases.find((p) => p.phase === monster.phase);
    if (!phaseConfig) {
      return false;
    }

    // Higher attack frequency in enrage phase
    const attackChance = phaseConfig.attackFrequency;
    return Math.random() < attackChance;
  }

  /**
   * Get telegraph duration for current phase
   */
  getTelegraphDuration(monster: MonsterStats, config: MonsterConfig): number {
    if (monster.phase !== 'telegraph') {
      return 0;
    }

    const tell = config.tells[0]; // Use first tell for now
    return tell?.duration || 0;
  }

  /**
   * Determine next phase based on current state
   */
  private determineNextPhase(
    currentPhase: MonsterPhase,
    currentHealth: number,
    maxHealth: number,
    config: MonsterConfig
  ): MonsterPhase {
    const healthPercent = currentHealth / maxHealth;

    // Enter enrage if health is low and not already enraged
    if (healthPercent < 0.3 && currentPhase !== 'enrage') {
      return 'enrage';
    }

    // Phase cycle
    switch (currentPhase) {
      case 'idle':
        return 'telegraph';
      case 'telegraph':
        return 'attack';
      case 'attack':
        return 'vulnerable';
      case 'vulnerable':
        return healthPercent < 0.3 ? 'enrage' : 'idle';
      case 'enrage':
        // In enrage, cycle between attack and vulnerable
        return 'attack';
      default:
        return 'idle';
    }
  }

  /**
   * Get duration for a phase
   */
  private getPhaseDuration(phase: MonsterPhase, config: MonsterConfig): number {
    const phaseConfig = config.phases.find((p) => p.phase === phase);
    return phaseConfig?.duration || 2000;
  }

  /**
   * Scale monster stats based on progression
   */
  scaleMonsterStats(
    baseConfig: MonsterConfig,
    monsterIndex: number
  ): MonsterConfig {
    const scaling = Math.pow(1.2, monsterIndex); // Exponential scaling

    return {
      ...baseConfig,
      baseStats: {
        ...baseConfig.baseStats,
        maxHealth: Math.floor(baseConfig.baseStats.maxHealth * scaling),
        attackPower: Math.floor(baseConfig.baseStats.attackPower * scaling),
        defense: Math.floor(baseConfig.baseStats.defense * scaling),
        speed: Math.floor(baseConfig.baseStats.speed * scaling),
      },
    };
  }
}

export const monsterAI = new MonsterAI();

