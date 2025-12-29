'use client';

import type { HeroState, MonsterStats, MonsterConfig } from '../types';

interface GameHUDProps {
  hero: HeroState;
  monster: MonsterStats | null;
  monsterConfig: MonsterConfig | null;
  counterWindowActive: boolean;
}

export function GameHUD({
  hero,
  monster,
  monsterConfig,
  counterWindowActive,
}: GameHUDProps) {
  const heroHealthPercent = (hero.stats.currentHealth / hero.stats.maxHealth) * 100;
  const heroStaminaPercent = (hero.stats.currentStamina / hero.stats.maxStamina) * 100;
  const heroFocusPercent = (hero.stats.currentFocus / hero.stats.maxFocus) * 100;
  const monsterHealthPercent = monster
    ? (monster.currentHealth / monster.maxHealth) * 100
    : 0;

  return (
    <div className="absolute inset-0 pointer-events-none z-10">
      {/* Monster Health Bar - Top */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-3/4 max-w-2xl">
        <div className="bg-gray-900/80 rounded-lg p-4 border-2 border-cyan-500">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-cyan-400 font-bold text-lg">
              {monsterConfig?.name || 'Monster'}
            </h3>
            <span className="text-white text-sm">
              Phase: {monster?.phase || 'idle'}
            </span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-red-600 to-red-400 transition-all duration-300"
              style={{ width: `${monsterHealthPercent}%` }}
            />
          </div>
          <div className="text-white text-xs mt-1 text-right">
            {monster?.currentHealth || 0} / {monster?.maxHealth || 0}
          </div>
        </div>
      </div>

      {/* Hero Stats - Bottom */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4 max-w-2xl">
        <div className="bg-gray-900/80 rounded-lg p-4 border-2 border-pink-500">
          {/* Health Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-pink-400 font-bold">Hero</span>
              <span className="text-white text-sm">
                {hero.stats.currentHealth} / {hero.stats.maxHealth}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-6 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-green-600 to-green-400 transition-all duration-300"
                style={{ width: `${heroHealthPercent}%` }}
              />
            </div>
          </div>

          {/* Stamina Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-yellow-400 text-sm">Stamina</span>
              <span className="text-white text-xs">
                {Math.round(hero.stats.currentStamina)} / {hero.stats.maxStamina}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-yellow-600 to-yellow-400 transition-all duration-300"
                style={{ width: `${heroStaminaPercent}%` }}
              />
            </div>
          </div>

          {/* Focus Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-purple-400 text-sm">Focus</span>
              <span className="text-white text-xs">
                {Math.round(hero.stats.currentFocus)} / {hero.stats.maxFocus}
              </span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-4 overflow-hidden relative">
              <div
                className="h-full bg-gradient-to-r from-purple-600 to-purple-400 transition-all duration-300"
                style={{ width: `${heroFocusPercent}%` }}
              />
              {hero.stats.currentFocus >= hero.stats.maxFocus && (
                <div className="absolute inset-0 bg-purple-500 animate-pulse" />
              )}
            </div>
          </div>

          {/* Combo Counter */}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-cyan-400 text-sm">Combo: </span>
              <span className="text-cyan-300 font-bold text-lg">
                {hero.comboCount}
              </span>
            </div>
            <div>
              <span className="text-yellow-400 text-sm">Multiplier: </span>
              <span className="text-yellow-300 font-bold text-lg">
                x{hero.comboMultiplier.toFixed(1)}
              </span>
            </div>
          </div>

          {/* Counter Window Indicator */}
          {counterWindowActive && (
            <div className="mt-3 text-center">
              <div className="bg-yellow-500 text-black font-bold py-2 px-4 rounded animate-pulse">
                COUNTER WINDOW!
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

