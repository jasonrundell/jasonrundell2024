/**
 * Core game engine for Monster Battler
 * Handles combat, damage calculation, hit detection, and counter windows
 */

import type {
  GameState,
  HeroState,
  MonsterStats,
  MonsterConfig,
  GameInput,
  AttackType,
  BattleResult,
} from './types';
import { GAME_CONSTANTS } from './constants';

export class GameEngine {
  /**
   * Process hero input and update game state
   */
  processInput(
    state: GameState,
    input: GameInput,
    deltaTime: number
  ): GameState {
    const newState = { ...state };
    const hero = { ...newState.hero };

    // Regenerate stamina
    hero.stats.currentStamina = Math.min(
      hero.stats.maxStamina,
      hero.stats.currentStamina +
        GAME_CONSTANTS.STAMINA_REGEN_RATE * (deltaTime / 1000)
    );

    // Handle attacks
    if (input.attack && hero.stats.currentStamina >= this.getStaminaCost(input.attack)) {
      const damage = this.calculateHeroDamage(hero, input.attack, newState.counterWindowActive);
      hero.stats.currentStamina -= this.getStaminaCost(input.attack);
      hero.lastAction = input.attack;

      // Apply damage to monster
      if (newState.monster && newState.monsterConfig) {
        const actualDamage = this.applyDamage(
          newState.monster,
          damage,
          newState.monsterConfig.baseStats.defense
        );
        newState.monster.currentHealth = Math.max(
          0,
          newState.monster.currentHealth - actualDamage
        );

        // Update combo
        hero.comboCount += 1;
        hero.comboMultiplier = Math.min(
          GAME_CONSTANTS.MAX_COMBO_MULTIPLIER,
          GAME_CONSTANTS.COMBO_MULTIPLIER_BASE +
            hero.comboCount * GAME_CONSTANTS.COMBO_MULTIPLIER_INCREMENT
        );

        // Gain focus
        hero.stats.currentFocus = Math.min(
          hero.stats.maxFocus,
          hero.stats.currentFocus + GAME_CONSTANTS.FOCUS_GAIN_PER_HIT
        );
      }
    }

    // Handle block
    if (input.block !== undefined) {
      hero.isBlocking = input.block;
      hero.lastAction = input.block ? 'block' : null;
      if (input.block && hero.stats.currentStamina >= 5) {
        hero.stats.currentStamina -= 5;
      }
    }

    // Handle dodge
    if (input.dodge && hero.stats.currentStamina >= 15) {
      hero.isDodging = true;
      hero.dodgeDirection = input.dodge;
      hero.stats.currentStamina -= 15;
      hero.lastAction = 'dodge';

      // Gain focus from dodging
      hero.stats.currentFocus = Math.min(
        hero.stats.maxFocus,
        hero.stats.currentFocus + GAME_CONSTANTS.FOCUS_GAIN_PER_DODGE
      );

      // Check if dodge was successful (simplified - would check against monster attack)
      if (this.checkDodgeSuccess(hero, newState.monster, input.dodge)) {
        newState.counterWindowActive = true;
        newState.counterWindowExpires =
          Date.now() + GAME_CONSTANTS.COUNTER_WINDOW_DURATION;
      }
    } else {
      hero.isDodging = false;
      hero.dodgeDirection = null;
    }

    // Handle special attack
    if (input.special && hero.stats.currentFocus >= hero.stats.maxFocus) {
      const damage = this.calculateHeroDamage(hero, 'special', newState.counterWindowActive);
      hero.stats.currentFocus = 0;
      hero.lastAction = 'special';

      if (newState.monster && newState.monsterConfig) {
        const actualDamage = this.applyDamage(
          newState.monster,
          damage,
          newState.monsterConfig.baseStats.defense
        );
        newState.monster.currentHealth = Math.max(
          0,
          newState.monster.currentHealth - actualDamage
        );

        hero.comboCount += 1;
        hero.comboMultiplier = Math.min(
          GAME_CONSTANTS.MAX_COMBO_MULTIPLIER,
          GAME_CONSTANTS.COMBO_MULTIPLIER_BASE +
            hero.comboCount * GAME_CONSTANTS.COMBO_MULTIPLIER_INCREMENT
        );
      }
    }

    // Decay combo if no action taken
    if (!input.attack && !input.special) {
      setTimeout(() => {
        hero.comboCount = Math.max(0, hero.comboCount - 1);
        hero.comboMultiplier = Math.max(
          GAME_CONSTANTS.COMBO_MULTIPLIER_BASE,
          hero.comboMultiplier - GAME_CONSTANTS.COMBO_MULTIPLIER_INCREMENT
        );
      }, GAME_CONSTANTS.COMBO_DECAY_TIME);
    }

    // Update counter window expiration
    if (newState.counterWindowActive && Date.now() > newState.counterWindowExpires) {
      newState.counterWindowActive = false;
    }

    // Check if successful block creates counter window
    if (hero.isBlocking && this.checkBlockSuccess(hero, newState.monster)) {
      newState.counterWindowActive = true;
      newState.counterWindowExpires =
        Date.now() + GAME_CONSTANTS.COUNTER_WINDOW_DURATION;
      hero.stats.currentFocus = Math.min(
        hero.stats.maxFocus,
        hero.stats.currentFocus + GAME_CONSTANTS.FOCUS_GAIN_PER_BLOCK
      );
    }

    newState.hero = hero;
    return newState;
  }

  /**
   * Process monster AI and attacks
   */
  processMonsterAI(
    state: GameState,
    deltaTime: number
  ): GameState {
    const newState = { ...state };
    if (!newState.monster || !newState.monsterConfig) {
      return newState;
    }

    const monster = { ...newState.monster };
    monster.phaseTimer -= deltaTime;
    monster.attackCooldown = Math.max(0, monster.attackCooldown - deltaTime);

    const phaseConfig = newState.monsterConfig.phases.find(
      (p) => p.phase === monster.phase
    );

    if (!phaseConfig) {
      return newState;
    }

    // Phase transition logic
    if (monster.phaseTimer <= 0) {
      monster.phase = this.getNextPhase(monster.phase, monster.currentHealth, newState.monsterConfig);
      monster.phaseTimer = phaseConfig.duration;
    }

    // Monster attack logic
    if (
      monster.phase === 'attack' &&
      monster.attackCooldown <= 0 &&
      Math.random() < phaseConfig.attackFrequency
    ) {
      const attackPattern = newState.monsterConfig.attackPatterns.find(
        (p) => p.phase === 'attack'
      );

      if (attackPattern) {
        const damage = this.calculateMonsterDamage(
          monster,
          attackPattern.damage,
          newState.hero.stats.defense
        );

        // Check if hero blocked or dodged
        if (!newState.hero.isBlocking && !newState.hero.isDodging) {
          newState.hero.stats.currentHealth = Math.max(
            0,
            newState.hero.stats.currentHealth - damage
          );
        }

        monster.attackCooldown = attackPattern.recoveryTime;
      }
    }

    newState.monster = monster;
    return newState;
  }

  /**
   * Calculate hero damage
   */
  calculateHeroDamage(
    hero: HeroState,
    attackType: AttackType,
    isCounter: boolean
  ): number {
    let baseDamage = hero.stats.attackPower;

    switch (attackType) {
      case 'light':
        baseDamage *= GAME_CONSTANTS.LIGHT_ATTACK_DAMAGE;
        break;
      case 'heavy':
        baseDamage *= GAME_CONSTANTS.HEAVY_ATTACK_DAMAGE;
        break;
      case 'special':
        baseDamage *= GAME_CONSTANTS.SPECIAL_ATTACK_DAMAGE;
        break;
    }

    // Apply combo multiplier
    baseDamage *= hero.comboMultiplier;

    // Apply counter multiplier
    if (isCounter) {
      baseDamage *= GAME_CONSTANTS.COUNTER_DAMAGE_MULTIPLIER;
    }

    return Math.floor(baseDamage);
  }

  /**
   * Calculate monster damage
   */
  calculateMonsterDamage(
    monster: MonsterStats,
    baseDamage: number,
    heroDefense: number
  ): number {
    const damage = baseDamage - heroDefense;
    return Math.max(1, Math.floor(damage));
  }

  /**
   * Apply damage with defense calculation
   */
  applyDamage(
    target: MonsterStats,
    damage: number,
    defense: number
  ): number {
    const actualDamage = Math.max(1, damage - defense);
    return actualDamage;
  }

  /**
   * Check if dodge was successful
   */
  checkDodgeSuccess(
    hero: HeroState,
    monster: MonsterStats | null,
    direction: string
  ): boolean {
    if (!monster || monster.phase !== 'attack') {
      return false;
    }
    // Simplified dodge check - in real implementation would check hitboxes
    return Math.random() > 0.3; // 70% success rate
  }

  /**
   * Check if block was successful
   */
  checkBlockSuccess(hero: HeroState, monster: MonsterStats | null): boolean {
    if (!monster || monster.phase !== 'attack') {
      return false;
    }
    return hero.isBlocking;
  }

  /**
   * Get stamina cost for action
   */
  getStaminaCost(attackType: AttackType): number {
    switch (attackType) {
      case 'light':
        return 10;
      case 'heavy':
        return 25;
      case 'special':
        return 0; // Uses focus instead
      default:
        return 0;
    }
  }

  /**
   * Get next phase for monster
   */
  private getNextPhase(
    currentPhase: string,
    health: number,
    config: MonsterConfig
  ): string {
    const healthPercent = health / config.baseStats.maxHealth;

    // Enter enrage phase if health is low
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
        return 'idle';
      case 'enrage':
        return 'attack';
      default:
        return 'idle';
    }
  }

  /**
   * Check if game is over
   */
  checkGameOver(state: GameState): GameState {
    const newState = { ...state };

    if (newState.hero.stats.currentHealth <= 0) {
      newState.isGameOver = true;
      newState.isVictory = false;
    } else if (
      newState.monster &&
      newState.monster.currentHealth <= 0
    ) {
      newState.isVictory = true;
      // Check if there are more monsters
      if (newState.currentMonsterIndex >= 11) {
        newState.isGameOver = true;
      }
    }

    return newState;
  }

  /**
   * Calculate battle result
   */
  calculateBattleResult(
    state: GameState,
    battleStats: {
      damageDealt: number;
      damageTaken: number;
      totalDodges: number;
      totalBlocks: number;
      longestCombo: number;
      specialsUsed: number;
    }
  ): BattleResult {
    if (!state.monsterConfig) {
      throw new Error('Monster config is required to calculate battle result');
    }

    const duration = Date.now() - state.startTime;
    const totalActions =
      battleStats.totalDodges +
      battleStats.totalBlocks +
      battleStats.specialsUsed;
    const accuracy =
      totalActions > 0
        ? (battleStats.damageDealt / totalActions) * 100
        : 0;

    return {
      monsterId: state.monsterConfig.id,
      monsterName: state.monsterConfig.name,
      victory: state.isVictory,
      damageDealt: battleStats.damageDealt,
      damageTaken: battleStats.damageTaken,
      totalDodges: battleStats.totalDodges,
      totalBlocks: battleStats.totalBlocks,
      longestCombo: battleStats.longestCombo,
      specialsUsed: battleStats.specialsUsed,
      accuracy: Math.round(accuracy),
      duration,
    };
  }
}

export const gameEngine = new GameEngine();

