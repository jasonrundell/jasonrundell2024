'use client';

import { useState } from 'react';
import type { GameMode } from '../types';
import { Scoreboard } from './Scoreboard';

interface GameLobbyProps {
  onStartGame: (mode: GameMode) => void;
}

export function GameLobby({ onStartGame }: GameLobbyProps) {
  const [selectedMode, setSelectedMode] = useState<GameMode>('gauntlet');

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-gray-800 to-gray-900 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-5xl font-bold text-center mb-8 bg-gradient-to-r from-cyan-400 to-pink-400 bg-clip-text text-transparent">
          Monster Battler
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Game Modes */}
          <div className="bg-gray-900 rounded-lg p-6 border-2 border-cyan-500">
            <h2 className="text-2xl font-bold text-cyan-400 mb-4">Game Modes</h2>
            <div className="space-y-4">
              <button
                onClick={() => setSelectedMode('gauntlet')}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedMode === 'gauntlet'
                    ? 'border-pink-500 bg-pink-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">Gauntlet</h3>
                <p className="text-gray-400">
                  Fight through all 12 monsters in sequence. Each victory unlocks the next challenge.
                </p>
              </button>

              <button
                onClick={() => setSelectedMode('bossRush')}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedMode === 'bossRush'
                    ? 'border-pink-500 bg-pink-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">Boss Rush</h3>
                <p className="text-gray-400">
                  Face all monsters back-to-back with no breaks. Unlocked after completing Gauntlet.
                </p>
              </button>

              <button
                onClick={() => setSelectedMode('endless')}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedMode === 'endless'
                    ? 'border-pink-500 bg-pink-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">Endless Gauntlet</h3>
                <p className="text-gray-400">
                  Survive as long as possible against increasingly difficult monsters.
                </p>
              </button>

              <button
                onClick={() => setSelectedMode('tutorial')}
                className={`w-full p-4 rounded-lg border-2 transition-colors text-left ${
                  selectedMode === 'tutorial'
                    ? 'border-pink-500 bg-pink-500/20'
                    : 'border-gray-700 hover:border-gray-600'
                }`}
              >
                <h3 className="text-xl font-bold text-white mb-2">Tutorial</h3>
                <p className="text-gray-400">
                  Learn the basics: dodging, blocking, combos, and special attacks.
                </p>
              </button>
            </div>

            <button
              onClick={() => onStartGame(selectedMode)}
              className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-pink-500 hover:from-cyan-600 hover:to-pink-600 text-white font-bold py-4 px-6 rounded-lg transition-all transform hover:scale-105"
            >
              Start Game
            </button>
          </div>

          {/* Scoreboard */}
          <div>
            <Scoreboard />
          </div>
        </div>
      </div>
    </div>
  );
}

