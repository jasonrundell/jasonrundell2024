'use client';

import type { ScoreboardEntry } from '../types';
import { useEffect, useState } from 'react';
import { gameStorage } from '../storage';

interface ScoreboardProps {
  mode?: string;
}

export function Scoreboard({ mode }: ScoreboardProps) {
  const [entries, setEntries] = useState<ScoreboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadScoreboard() {
      setLoading(true);
      try {
        const storage = gameStorage.loadGameData();
        let localEntries = storage.scoreboard;

        // Try to load from server if logged in
        const serverEntries = await gameStorage.loadServerScoreboard();
        if (serverEntries.length > 0) {
          // Merge and deduplicate
          const allEntries = [...localEntries, ...serverEntries];
          const uniqueEntries = allEntries.reduce(
            (acc, entry) => {
              const existing = acc.find((e) => e.id === entry.id);
              if (!existing) {
                acc.push(entry);
              }
              return acc;
            },
            [] as ScoreboardEntry[]
          );
          uniqueEntries.sort((a, b) => b.score - a.score);
          localEntries = uniqueEntries.slice(0, 100);
        }

        const filtered = mode
          ? localEntries.filter((e) => e.mode === mode)
          : localEntries;

        setEntries(filtered.slice(0, 20)); // Show top 20
      } catch (error) {
        console.error('Failed to load scoreboard:', error);
      } finally {
        setLoading(false);
      }
    }

    loadScoreboard();
  }, [mode]);

  if (loading) {
    return (
      <div className="bg-gray-900 rounded-lg p-6 border-2 border-cyan-500">
        <p className="text-white">Loading scoreboard...</p>
      </div>
    );
  }

  return (
    <div className="bg-gray-900 rounded-lg p-6 border-2 border-cyan-500">
      <h2 className="text-2xl font-bold text-cyan-400 mb-4">Scoreboard</h2>
      {entries.length === 0 ? (
        <p className="text-gray-400">No scores yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          <div className="grid grid-cols-5 gap-4 text-sm font-bold text-gray-400 border-b border-gray-700 pb-2">
            <div>Rank</div>
            <div>Score</div>
            <div>Monsters</div>
            <div>Time</div>
            <div>Mode</div>
          </div>
          {entries.map((entry, index) => (
            <div
              key={entry.id}
              className="grid grid-cols-5 gap-4 text-sm text-white py-2 hover:bg-gray-800 rounded"
            >
              <div>#{index + 1}</div>
              <div className="text-cyan-400 font-bold">{entry.score.toLocaleString()}</div>
              <div>{entry.monstersDefeated}</div>
              <div>{(entry.completionTime / 1000).toFixed(1)}s</div>
              <div className="text-xs text-gray-400">{entry.mode}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

