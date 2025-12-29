'use client';

import { useState, useCallback } from 'react';
import type { GameState, GameMode, BattleResult, PlayHistory, ScoreboardEntry } from '../types';
import { DEFAULT_HERO_STATS, MONSTER_CONFIGS } from '../constants';
import { gameStorage } from '../storage';
import { monsterAI } from '../monster-ai';
import { GameLobby } from './GameLobby';
import { GameArena } from './GameArena';

type GameScreen = 'lobby' | 'playing' | 'gameOver';

export function MonsterBattlerGame() {
  const [screen, setScreen] = useState<GameScreen>('lobby');
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [currentRun, setCurrentRun] = useState<PlayHistory | null>(null);

  const initializeGame = useCallback((mode: GameMode) => {
    // For tutorial mode, use first monster
    // For boss rush, start from first but no breaks between fights
    // For endless, cycle through monsters
    const startIndex = mode === 'tutorial' ? 0 : 0;
    const firstMonster = MONSTER_CONFIGS[startIndex];
    const scaledMonster = monsterAI.scaleMonsterStats(firstMonster, startIndex);

    const initialState: GameState = {
      mode,
      currentMonsterIndex: startIndex,
      hero: {
        stats: { ...DEFAULT_HERO_STATS },
        comboCount: 0,
        comboMultiplier: 1,
        isBlocking: false,
        isDodging: false,
        dodgeDirection: null,
        lastAction: null,
        upgrades: [],
      },
      monster: {
        ...scaledMonster.baseStats,
        currentHealth: scaledMonster.baseStats.maxHealth,
        phase: 'idle',
        phaseTimer: 2000,
        attackCooldown: 0,
      },
      monsterConfig: scaledMonster,
      score: 0,
      startTime: Date.now(),
      isPaused: false,
      isGameOver: false,
      isVictory: false,
      counterWindowActive: false,
      counterWindowExpires: 0,
    };

    const run: PlayHistory = {
      runId: `run-${Date.now()}`,
      mode,
      startTime: Date.now(),
      endTime: null,
      battles: [],
      totalScore: 0,
      monstersDefeated: 0,
      completionTime: null,
    };

    setGameState(initialState);
    setCurrentRun(run);
    setScreen('playing');
  }, []);

  const handleBattleComplete = useCallback(
    (result: BattleResult) => {
      if (!currentRun || !gameState) return;

      const updatedRun: PlayHistory = {
        ...currentRun,
        battles: [...currentRun.battles, result],
        monstersDefeated: result.victory
          ? currentRun.monstersDefeated + 1
          : currentRun.monstersDefeated,
        totalScore: currentRun.totalScore + result.damageDealt * 10,
      };

      setCurrentRun(updatedRun);

      // Update game state score
      if (gameState) {
        setGameState({
          ...gameState,
          score: updatedRun.totalScore,
        });
      }
    },
    [currentRun, gameState]
  );

  const handleGameOver = useCallback(() => {
    if (!currentRun || !gameState) return;

    const completedRun: PlayHistory = {
      ...currentRun,
      endTime: Date.now(),
      completionTime: Date.now() - currentRun.startTime,
    };

    // Save to storage
    gameStorage.addPlayHistory(completedRun);

    // Create scoreboard entry
    const scoreboardEntry: ScoreboardEntry = {
      id: `score-${Date.now()}`,
      userId: null, // Will be set by storage if logged in
      mode: gameState.mode,
      score: completedRun.totalScore,
      monstersDefeated: completedRun.monstersDefeated,
      completionTime: completedRun.completionTime || 0,
      timestamp: Date.now(),
      playHistory: completedRun,
    };

    gameStorage.addScoreboardEntry(scoreboardEntry);

    setScreen('gameOver');
  }, [currentRun, gameState]);

  if (screen === 'lobby') {
    return <GameLobby onStartGame={initializeGame} />;
  }

  if (screen === 'playing' && gameState) {
    return (
      <GameArena
        initialState={gameState}
        onBattleComplete={handleBattleComplete}
        onGameOver={handleGameOver}
      />
    );
  }

  if (screen === 'gameOver') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center">
        <div className="bg-gray-900 rounded-lg p-8 border-2 border-cyan-500 max-w-2xl">
          <h2 className="text-3xl font-bold text-center mb-6 text-cyan-400">
            Game Over
          </h2>
          {currentRun && (
            <div className="space-y-4 mb-6">
              <div className="text-white">
                <p className="text-lg">Final Score: {currentRun.totalScore.toLocaleString()}</p>
                <p className="text-lg">Monsters Defeated: {currentRun.monstersDefeated}</p>
                {currentRun.completionTime && (
                  <p className="text-lg">
                    Completion Time: {(currentRun.completionTime / 1000).toFixed(1)}s
                  </p>
                )}
              </div>
            </div>
          )}
          <button
            onClick={() => setScreen('lobby')}
            className="w-full bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg transition-all"
          >
            Return to Lobby
          </button>
        </div>
      </div>
    );
  }

  return null;
}

