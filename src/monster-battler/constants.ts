/**
 * Game constants and configuration
 */

import type { MonsterConfig, HeroStats, Achievement } from './types';

export const GAME_CONSTANTS = {
  // Hero defaults
  HERO_MAX_HEALTH: 100,
  HERO_MAX_STAMINA: 100,
  HERO_MAX_FOCUS: 100,
  HERO_BASE_ATTACK: 10,
  HERO_BASE_DEFENSE: 5,
  HERO_BASE_SPEED: 10,

  // Combat
  COUNTER_WINDOW_DURATION: 500, // milliseconds
  COMBO_DECAY_TIME: 2000, // milliseconds
  STAMINA_REGEN_RATE: 0.5, // per second
  FOCUS_GAIN_PER_DODGE: 10,
  FOCUS_GAIN_PER_HIT: 5,
  FOCUS_GAIN_PER_BLOCK: 15,

  // Damage multipliers
  LIGHT_ATTACK_DAMAGE: 1.0,
  HEAVY_ATTACK_DAMAGE: 2.0,
  SPECIAL_ATTACK_DAMAGE: 4.0,
  COUNTER_DAMAGE_MULTIPLIER: 2.0,

  // Combo system
  COMBO_MULTIPLIER_BASE: 1.0,
  COMBO_MULTIPLIER_INCREMENT: 0.1,
  MAX_COMBO_MULTIPLIER: 3.0,

  // Monster progression
  MONSTER_HEALTH_SCALING: 1.2,
  MONSTER_DAMAGE_SCALING: 1.15,
  MONSTER_SPEED_SCALING: 1.1,
} as const;

export const STORAGE_KEYS = {
  GAME_DATA: 'monster-battler-game-data',
  CURRENT_RUN: 'monster-battler-current-run',
  SETTINGS: 'monster-battler-settings',
} as const;

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 'perfect-run',
    name: 'Perfect Run',
    description: 'Complete a run without taking any damage',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'no-block-run',
    name: 'No Block Run',
    description: 'Complete a run without blocking',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'specials-only',
    name: 'Specials Only',
    description: 'Defeat a monster using only special attacks',
    unlockedAt: null,
    progress: 0,
    maxProgress: 1,
  },
  {
    id: 'combo-master',
    name: 'Combo Master',
    description: 'Achieve a 50-hit combo',
    unlockedAt: null,
    progress: 0,
    maxProgress: 50,
  },
  {
    id: 'speed-run',
    name: 'Speed Runner',
    description: 'Complete the gauntlet in under 10 minutes',
    unlockedAt: null,
    progress: 0,
    maxProgress: 600000, // 10 minutes in ms
  },
  {
    id: 'all-monsters',
    name: 'Monster Slayer',
    description: 'Defeat all 12 monsters',
    unlockedAt: null,
    progress: 0,
    maxProgress: 12,
  },
];

export const DEFAULT_HERO_STATS: HeroStats = {
  maxHealth: GAME_CONSTANTS.HERO_MAX_HEALTH,
  currentHealth: GAME_CONSTANTS.HERO_MAX_HEALTH,
  maxStamina: GAME_CONSTANTS.HERO_MAX_STAMINA,
  currentStamina: GAME_CONSTANTS.HERO_MAX_STAMINA,
  maxFocus: GAME_CONSTANTS.HERO_MAX_FOCUS,
  currentFocus: 0,
  attackPower: GAME_CONSTANTS.HERO_BASE_ATTACK,
  defense: GAME_CONSTANTS.HERO_BASE_DEFENSE,
  speed: GAME_CONSTANTS.HERO_BASE_SPEED,
};

// Monster configurations - 12 monsters with unique behaviors
export const MONSTER_CONFIGS: MonsterConfig[] = [
  // Row 1
  {
    id: 'magenta-crab-1',
    name: 'Crimson Pincer',
    spriteIndex: 0,
    color: 'magenta',
    baseStats: {
      maxHealth: 80,
      attackPower: 8,
      defense: 3,
      speed: 5,
    },
    phases: [
      { phase: 'idle', duration: 2000, attackFrequency: 0.3, movementSpeed: 1 },
      { phase: 'telegraph', duration: 800, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 400, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1000, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 5000, attackFrequency: 0.5, movementSpeed: 2 },
    ],
    attackPatterns: [
      {
        id: 'pincer-snap',
        phase: 'attack',
        damage: 8,
        windupTime: 800,
        recoveryTime: 600,
        hitbox: { x: 0, y: 0, width: 60, height: 40 },
        telegraphId: 'pincer-windup',
      },
    ],
    tells: [
      {
        id: 'pincer-windup',
        duration: 800,
        visualCue: 'pincers-closing',
        audioCue: 'click',
      },
    ],
  },
  {
    id: 'cyan-spider-1',
    name: 'Azure Weaver',
    spriteIndex: 1,
    color: 'cyan',
    baseStats: {
      maxHealth: 100,
      attackPower: 10,
      defense: 4,
      speed: 8,
    },
    phases: [
      { phase: 'idle', duration: 1500, attackFrequency: 0.4, movementSpeed: 2 },
      { phase: 'telegraph', duration: 600, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 300, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1200, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 6000, attackFrequency: 0.6, movementSpeed: 3 },
    ],
    attackPatterns: [
      {
        id: 'web-strike',
        phase: 'attack',
        damage: 10,
        windupTime: 600,
        recoveryTime: 500,
        hitbox: { x: 0, y: 0, width: 80, height: 50 },
        telegraphId: 'web-telegraph',
      },
    ],
    tells: [
      {
        id: 'web-telegraph',
        duration: 600,
        visualCue: 'legs-rearing',
        audioCue: 'hiss',
      },
    ],
  },
  {
    id: 'cyan-horned-1',
    name: 'Frost Horn',
    spriteIndex: 2,
    color: 'cyan',
    baseStats: {
      maxHealth: 120,
      attackPower: 12,
      defense: 5,
      speed: 6,
    },
    phases: [
      { phase: 'idle', duration: 1800, attackFrequency: 0.35, movementSpeed: 1.5 },
      { phase: 'telegraph', duration: 700, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 350, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1100, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 5500, attackFrequency: 0.55, movementSpeed: 2.5 },
    ],
    attackPatterns: [
      {
        id: 'horn-charge',
        phase: 'attack',
        damage: 12,
        windupTime: 700,
        recoveryTime: 700,
        hitbox: { x: 0, y: 0, width: 70, height: 45 },
        telegraphId: 'horn-telegraph',
      },
    ],
    tells: [
      {
        id: 'horn-telegraph',
        duration: 700,
        visualCue: 'head-lowering',
        audioCue: 'grunt',
      },
    ],
  },
  {
    id: 'cyan-octopus',
    name: 'Tentacle Terror',
    spriteIndex: 3,
    color: 'cyan',
    baseStats: {
      maxHealth: 110,
      attackPower: 11,
      defense: 4,
      speed: 7,
    },
    phases: [
      { phase: 'idle', duration: 1600, attackFrequency: 0.38, movementSpeed: 1.8 },
      { phase: 'telegraph', duration: 650, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 320, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1150, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 5800, attackFrequency: 0.58, movementSpeed: 2.8 },
    ],
    attackPatterns: [
      {
        id: 'tentacle-whip',
        phase: 'attack',
        damage: 11,
        windupTime: 650,
        recoveryTime: 550,
        hitbox: { x: 0, y: 0, width: 75, height: 48 },
        telegraphId: 'tentacle-telegraph',
      },
    ],
    tells: [
      {
        id: 'tentacle-telegraph',
        duration: 650,
        visualCue: 'tentacles-raising',
        audioCue: 'squish',
      },
    ],
  },
  // Row 2
  {
    id: 'green-tank',
    name: 'Neon Siege',
    spriteIndex: 4,
    color: 'green',
    baseStats: {
      maxHealth: 200,
      attackPower: 15,
      defense: 10,
      speed: 3,
    },
    phases: [
      { phase: 'idle', duration: 2500, attackFrequency: 0.25, movementSpeed: 0.5 },
      { phase: 'telegraph', duration: 1000, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 500, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1500, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 8000, attackFrequency: 0.4, movementSpeed: 1 },
    ],
    attackPatterns: [
      {
        id: 'cannon-blast',
        phase: 'attack',
        damage: 15,
        windupTime: 1000,
        recoveryTime: 800,
        hitbox: { x: 0, y: 0, width: 100, height: 60 },
        telegraphId: 'cannon-telegraph',
      },
    ],
    tells: [
      {
        id: 'cannon-telegraph',
        duration: 1000,
        visualCue: 'cannon-charging',
        audioCue: 'charge',
      },
    ],
  },
  {
    id: 'green-horned-1',
    name: 'Verdant Rage',
    spriteIndex: 5,
    color: 'green',
    baseStats: {
      maxHealth: 140,
      attackPower: 13,
      defense: 6,
      speed: 7,
    },
    phases: [
      { phase: 'idle', duration: 1700, attackFrequency: 0.33, movementSpeed: 1.6 },
      { phase: 'telegraph', duration: 680, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 340, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1120, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 5600, attackFrequency: 0.56, movementSpeed: 2.6 },
    ],
    attackPatterns: [
      {
        id: 'rage-strike',
        phase: 'attack',
        damage: 13,
        windupTime: 680,
        recoveryTime: 650,
        hitbox: { x: 0, y: 0, width: 72, height: 46 },
        telegraphId: 'rage-telegraph',
      },
    ],
    tells: [
      {
        id: 'rage-telegraph',
        duration: 680,
        visualCue: 'body-tensing',
        audioCue: 'roar',
      },
    ],
  },
  {
    id: 'cyan-winged',
    name: 'Sky Dancer',
    spriteIndex: 6,
    color: 'cyan',
    baseStats: {
      maxHealth: 130,
      attackPower: 12,
      defense: 5,
      speed: 9,
    },
    phases: [
      { phase: 'idle', duration: 1400, attackFrequency: 0.42, movementSpeed: 2.5 },
      { phase: 'telegraph', duration: 550, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 280, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1300, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 6200, attackFrequency: 0.62, movementSpeed: 3.5 },
    ],
    attackPatterns: [
      {
        id: 'dive-attack',
        phase: 'attack',
        damage: 12,
        windupTime: 550,
        recoveryTime: 480,
        hitbox: { x: 0, y: 0, width: 68, height: 44 },
        telegraphId: 'dive-telegraph',
      },
    ],
    tells: [
      {
        id: 'dive-telegraph',
        duration: 550,
        visualCue: 'wings-spreading',
        audioCue: 'whoosh',
      },
    ],
  },
  {
    id: 'green-winged-horned',
    name: 'Aerial Wrath',
    spriteIndex: 7,
    color: 'green',
    baseStats: {
      maxHealth: 150,
      attackPower: 14,
      defense: 6,
      speed: 8,
    },
    phases: [
      { phase: 'idle', duration: 1650, attackFrequency: 0.36, movementSpeed: 2.2 },
      { phase: 'telegraph', duration: 720, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 360, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1180, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 5700, attackFrequency: 0.57, movementSpeed: 3.2 },
    ],
    attackPatterns: [
      {
        id: 'aerial-strike',
        phase: 'attack',
        damage: 14,
        windupTime: 720,
        recoveryTime: 680,
        hitbox: { x: 0, y: 0, width: 74, height: 47 },
        telegraphId: 'aerial-telegraph',
      },
    ],
    tells: [
      {
        id: 'aerial-telegraph',
        duration: 720,
        visualCue: 'hovering-up',
        audioCue: 'flap',
      },
    ],
  },
  // Row 3
  {
    id: 'magenta-crab-2',
    name: 'Crimson Pincer Elite',
    spriteIndex: 8,
    color: 'magenta',
    baseStats: {
      maxHealth: 160,
      attackPower: 16,
      defense: 7,
      speed: 6,
    },
    phases: [
      { phase: 'idle', duration: 1900, attackFrequency: 0.32, movementSpeed: 1.2 },
      { phase: 'telegraph', duration: 750, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 380, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1050, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 5200, attackFrequency: 0.52, movementSpeed: 2.2 },
    ],
    attackPatterns: [
      {
        id: 'elite-pincer',
        phase: 'attack',
        damage: 16,
        windupTime: 750,
        recoveryTime: 620,
        hitbox: { x: 0, y: 0, width: 64, height: 42 },
        telegraphId: 'elite-telegraph',
      },
    ],
    tells: [
      {
        id: 'elite-telegraph',
        duration: 750,
        visualCue: 'dual-pincer-windup',
        audioCue: 'click-click',
      },
    ],
  },
  {
    id: 'blue-spider',
    name: 'Void Crawler',
    spriteIndex: 9,
    color: 'blue',
    baseStats: {
      maxHealth: 180,
      attackPower: 18,
      defense: 8,
      speed: 7,
    },
    phases: [
      { phase: 'idle', duration: 1750, attackFrequency: 0.3, movementSpeed: 1.8 },
      { phase: 'telegraph', duration: 800, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 400, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1080, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 5400, attackFrequency: 0.54, movementSpeed: 2.8 },
    ],
    attackPatterns: [
      {
        id: 'void-bite',
        phase: 'attack',
        damage: 18,
        windupTime: 800,
        recoveryTime: 700,
        hitbox: { x: 0, y: 0, width: 82, height: 52 },
        telegraphId: 'void-telegraph',
      },
    ],
    tells: [
      {
        id: 'void-telegraph',
        duration: 800,
        visualCue: 'mandibles-opening',
        audioCue: 'chitter',
      },
    ],
  },
  {
    id: 'blue-horned-insectoid',
    name: 'Abyssal Stalker',
    spriteIndex: 10,
    color: 'blue',
    baseStats: {
      maxHealth: 200,
      attackPower: 20,
      defense: 9,
      speed: 8,
    },
    phases: [
      { phase: 'idle', duration: 2000, attackFrequency: 0.28, movementSpeed: 2 },
      { phase: 'telegraph', duration: 850, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 420, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 1000, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 5000, attackFrequency: 0.5, movementSpeed: 3 },
    ],
    attackPatterns: [
      {
        id: 'abyssal-strike',
        phase: 'attack',
        damage: 20,
        windupTime: 850,
        recoveryTime: 750,
        hitbox: { x: 0, y: 0, width: 76, height: 49 },
        telegraphId: 'abyssal-telegraph',
      },
    ],
    tells: [
      {
        id: 'abyssal-telegraph',
        duration: 850,
        visualCue: 'body-rearing',
        audioCue: 'screech',
      },
    ],
  },
  {
    id: 'green-horned-pink-arms',
    name: 'Chaos Bringer',
    spriteIndex: 11,
    color: 'green',
    baseStats: {
      maxHealth: 250,
      attackPower: 25,
      defense: 12,
      speed: 9,
    },
    phases: [
      { phase: 'idle', duration: 2200, attackFrequency: 0.26, movementSpeed: 2.5 },
      { phase: 'telegraph', duration: 900, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'attack', duration: 450, attackFrequency: 1, movementSpeed: 0 },
      { phase: 'vulnerable', duration: 950, attackFrequency: 0, movementSpeed: 0 },
      { phase: 'enrage', duration: 4800, attackFrequency: 0.48, movementSpeed: 3.5 },
    ],
    attackPatterns: [
      {
        id: 'chaos-blast',
        phase: 'attack',
        damage: 25,
        windupTime: 900,
        recoveryTime: 800,
        hitbox: { x: 0, y: 0, width: 90, height: 55 },
        telegraphId: 'chaos-telegraph',
      },
    ],
    tells: [
      {
        id: 'chaos-telegraph',
        duration: 900,
        visualCue: 'arms-glowing',
        audioCue: 'power-up',
      },
    ],
  },
];

