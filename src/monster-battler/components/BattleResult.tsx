'use client';

import type { BattleResult as BattleResultType } from '../types';

interface BattleResultProps {
  result: BattleResultType;
  onContinue: () => void;
  onRetry: () => void;
}

export function BattleResult({ result, onContinue, onRetry }: BattleResultProps) {
  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
      <div className="bg-gray-900 border-2 border-cyan-500 rounded-lg p-8 max-w-2xl w-full mx-4">
        <h2 className="text-3xl font-bold text-center mb-6">
          {result.victory ? (
            <span className="text-green-400">Victory!</span>
          ) : (
            <span className="text-red-400">Defeat</span>
          )}
        </h2>

        <div className="space-y-4 mb-6">
          <div className="bg-gray-800 rounded p-4">
            <h3 className="text-xl font-bold text-cyan-400 mb-3">
              {result.monsterName}
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-400">Damage Dealt:</span>
                <span className="text-white ml-2">{result.damageDealt}</span>
              </div>
              <div>
                <span className="text-gray-400">Damage Taken:</span>
                <span className="text-white ml-2">{result.damageTaken}</span>
              </div>
              <div>
                <span className="text-gray-400">Dodges:</span>
                <span className="text-white ml-2">{result.totalDodges}</span>
              </div>
              <div>
                <span className="text-gray-400">Blocks:</span>
                <span className="text-white ml-2">{result.totalBlocks}</span>
              </div>
              <div>
                <span className="text-gray-400">Longest Combo:</span>
                <span className="text-white ml-2">{result.longestCombo}</span>
              </div>
              <div>
                <span className="text-gray-400">Specials Used:</span>
                <span className="text-white ml-2">{result.specialsUsed}</span>
              </div>
              <div>
                <span className="text-gray-400">Accuracy:</span>
                <span className="text-white ml-2">{result.accuracy}%</span>
              </div>
              <div>
                <span className="text-gray-400">Duration:</span>
                <span className="text-white ml-2">
                  {(result.duration / 1000).toFixed(1)}s
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          {result.victory ? (
            <button
              onClick={onContinue}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded transition-colors"
            >
              Continue
            </button>
          ) : (
            <button
              onClick={onRetry}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded transition-colors"
            >
              Retry
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

