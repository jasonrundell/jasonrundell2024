'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import type { GameState, GameInput, BattleResult } from '../types';
import { gameEngine } from '../game-engine';
import { monsterAI } from '../monster-ai';
import { MONSTER_CONFIGS } from '../constants';
import { GameHUD } from './GameHUD';
import { BattleResult as BattleResultComponent } from './BattleResult';

interface GameArenaProps {
  initialState: GameState;
  onBattleComplete: (result: BattleResult) => void;
  onGameOver: () => void;
}

export function GameArena({
  initialState,
  onBattleComplete,
  onGameOver,
}: GameArenaProps) {
  const [gameState, setGameState] = useState<GameState>(initialState);
  const [battleStats, setBattleStats] = useState({
    damageDealt: 0,
    damageTaken: 0,
    totalDodges: 0,
    totalBlocks: 0,
    longestCombo: 0,
    specialsUsed: 0,
  });
  const [showResult, setShowResult] = useState(false);
  const [battleResult, setBattleResult] = useState<BattleResult | null>(null);
  const animationFrameRef = useRef<number>();
  const lastTimeRef = useRef<number>(Date.now());
  const inputQueueRef = useRef<GameInput[]>([]);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const input: GameInput = {};

      // Attack keys
      if (e.key === 'j' || e.key === 'J') {
        input.attack = 'light';
      } else if (e.key === 'k' || e.key === 'K') {
        input.attack = 'heavy';
      } else if (e.key === 'l' || e.key === 'L') {
        input.special = true;
      }

      // Block
      if (e.key === 's' || e.key === 'S') {
        input.block = true;
      }

      // Dodge
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        input.dodge = 'left';
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        input.dodge = 'right';
      } else if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') {
        input.dodge = 'up';
      } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
        input.dodge = 'down';
      }

      if (Object.keys(input).length > 0) {
        inputQueueRef.current.push(input);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 's' || e.key === 'S') {
        inputQueueRef.current.push({ block: false });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Game loop
  useEffect(() => {
    const gameLoop = () => {
      const now = Date.now();
      const deltaTime = now - lastTimeRef.current;
      lastTimeRef.current = now;

      setGameState((prevState) => {
        if (prevState.isPaused || prevState.isGameOver) {
          return prevState;
        }

        let newState = { ...prevState };

        // Process queued inputs
        const input = inputQueueRef.current.shift();
        if (input) {
          newState = gameEngine.processInput(newState, input, deltaTime);

          // Update battle stats
          if (input.attack || input.special) {
            setBattleStats((stats) => ({
              ...stats,
              damageDealt: stats.damageDealt + (input.attack === 'special' ? 1 : 0),
              specialsUsed: stats.specialsUsed + (input.special ? 1 : 0),
              longestCombo: Math.max(stats.longestCombo, newState.hero.comboCount),
            }));
          }
          if (input.dodge) {
            setBattleStats((stats) => ({
              ...stats,
              totalDodges: stats.totalDodges + 1,
            }));
          }
          if (input.block) {
            setBattleStats((stats) => ({
              ...stats,
              totalBlocks: stats.totalBlocks + 1,
            }));
          }
        }

        // Process monster AI
        if (newState.monster && newState.monsterConfig) {
          newState.monster = monsterAI.updateMonster(
            newState.monster,
            newState.monsterConfig,
            deltaTime,
            newState.hero.stats.currentHealth
          );

          // Check if monster attacks
          if (
            monsterAI.shouldAttack(
              newState.monster,
              newState.monsterConfig,
              newState.hero.isBlocking,
              newState.hero.isDodging
            )
          ) {
            newState = gameEngine.processMonsterAI(newState, deltaTime);
            setBattleStats((stats) => ({
              ...stats,
              damageTaken: stats.damageTaken + 1,
            }));
          }
        }

        // Check game over conditions
        newState = gameEngine.checkGameOver(newState);

        // Check if battle is complete
        if (newState.isVictory || (newState.hero.stats.currentHealth <= 0 && !newState.isGameOver)) {
          if (!showResult && newState.monsterConfig) {
            const result = gameEngine.calculateBattleResult(newState, battleStats);
            setBattleResult(result);
            setShowResult(true);
            onBattleComplete(result);
          }
        }

        return newState;
      });

      animationFrameRef.current = requestAnimationFrame(gameLoop);
    };

    animationFrameRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [showResult, battleStats, onBattleComplete]);

  const handleContinue = useCallback(() => {
    if (gameState.isVictory) {
      let nextIndex: number;
      
      if (gameState.mode === 'endless') {
        // Cycle through monsters
        nextIndex = (gameState.currentMonsterIndex + 1) % MONSTER_CONFIGS.length;
      } else if (gameState.mode === 'bossRush' || gameState.mode === 'gauntlet') {
        // Progress through all monsters
        nextIndex = gameState.currentMonsterIndex + 1;
        if (nextIndex >= MONSTER_CONFIGS.length) {
          onGameOver();
          return;
        }
      } else {
        // Tutorial mode - only one fight
        onGameOver();
        return;
      }

      const nextConfig = MONSTER_CONFIGS[nextIndex];
      const scaledConfig = monsterAI.scaleMonsterStats(nextConfig, nextIndex);
      
      setGameState({
        ...gameState,
        currentMonsterIndex: nextIndex,
        monster: {
          ...scaledConfig.baseStats,
          currentHealth: scaledConfig.baseStats.maxHealth,
          phase: 'idle',
          phaseTimer: 2000,
          attackCooldown: 0,
        },
        monsterConfig: scaledConfig,
        isVictory: false,
        counterWindowActive: false,
        counterWindowExpires: 0,
      });
      setBattleStats({
        damageDealt: 0,
        damageTaken: 0,
        totalDodges: 0,
        totalBlocks: 0,
        longestCombo: 0,
        specialsUsed: 0,
      });
      setShowResult(false);
      setBattleResult(null);
    } else {
      onGameOver();
    }
  }, [gameState, onGameOver]);

  const handleRetry = useCallback(() => {
    // Reset to current monster
    const config = MONSTER_CONFIGS[gameState.currentMonsterIndex];
    setGameState({
      ...gameState,
      hero: {
        ...gameState.hero,
        stats: {
          ...gameState.hero.stats,
          currentHealth: gameState.hero.stats.maxHealth,
          currentStamina: gameState.hero.stats.maxStamina,
          currentFocus: 0,
        },
        comboCount: 0,
        comboMultiplier: 1,
        isBlocking: false,
        isDodging: false,
        dodgeDirection: null,
        lastAction: null,
      },
      monster: {
        ...config.baseStats,
        currentHealth: config.baseStats.maxHealth,
        phase: 'idle',
        phaseTimer: 2000,
        attackCooldown: 0,
      },
      isVictory: false,
      isGameOver: false,
      counterWindowActive: false,
      counterWindowExpires: 0,
    });
    setBattleStats({
      damageDealt: 0,
      damageTaken: 0,
      totalDodges: 0,
      totalBlocks: 0,
      longestCombo: 0,
      specialsUsed: 0,
    });
    setShowResult(false);
    setBattleResult(null);
  }, [gameState]);

  if (!gameState.monsterConfig) {
    return <div className="text-white">Loading monster...</div>;
  }

  return (
    <div className="relative w-full h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 overflow-hidden">
      {/* Monster - Top */}
      <div className="absolute top-20 left-1/2 transform -translate-x-1/2">
        <div className="relative w-64 h-64 overflow-hidden">
          <Image
            src="/monster-battler/monster-battler_monsters_sprite.png"
            alt={gameState.monsterConfig.name}
            width={256}
            height={256}
            className="object-none"
            style={{
              objectPosition: `-${(gameState.monsterConfig.spriteIndex % 4) * 64}px -${Math.floor(gameState.monsterConfig.spriteIndex / 4) * 64}px`,
            }}
          />
        </div>
      </div>

      {/* Hero - Bottom */}
      <div className="absolute bottom-40 left-1/2 transform -translate-x-1/2">
        <div className="relative w-64 h-64">
          <Image
            src="/monster-battler/monster-battler_hero_sprite.png"
            alt="Hero"
            width={256}
            height={256}
            className="object-none"
          />
        </div>
      </div>

      {/* HUD */}
      <GameHUD
        hero={gameState.hero}
        monster={gameState.monster}
        monsterConfig={gameState.monsterConfig}
        counterWindowActive={gameState.counterWindowActive}
      />

      {/* Battle Result Modal */}
      {showResult && battleResult && (
        <BattleResultComponent
          result={battleResult}
          onContinue={handleContinue}
          onRetry={handleRetry}
        />
      )}

      {/* Controls Hint */}
      <div className="absolute bottom-4 left-4 bg-gray-900/80 rounded-lg p-4 border border-gray-700 text-xs text-gray-400">
        <div className="space-y-1">
          <div>J - Light Attack | K - Heavy Attack | L - Special</div>
          <div>S - Block | Arrow Keys - Dodge</div>
        </div>
      </div>
    </div>
  );
}

