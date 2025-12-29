/**
 * Storage layer for Monster Battler game
 * Handles localStorage and Supabase sync for logged-in users
 */

import { createClient } from '@/utils/supabase/client';
import type {
  GameStorage,
  ScoreboardEntry,
  PlayHistory,
  Achievement,
} from './types';
import { STORAGE_KEYS } from './constants';

class GameStorageManager {
  private supabase = createClient();

  /**
   * Load game data from localStorage
   */
  loadGameData(): GameStorage {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.GAME_DATA);
      if (!stored) {
        return this.getDefaultStorage();
      }
      const parsed = JSON.parse(stored);
      return {
        scoreboard: parsed.scoreboard || [],
        playHistory: parsed.playHistory || [],
        bestScore: parsed.bestScore || 0,
        bestTime: parsed.bestTime || Infinity,
        achievements: parsed.achievements || [],
      };
    } catch (error) {
      console.error('Failed to load game data from localStorage:', error);
      throw new Error('Failed to load game data');
    }
  }

  /**
   * Save game data to localStorage
   */
  saveGameData(data: GameStorage): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GAME_DATA, JSON.stringify(data));
    } catch (error) {
      console.error('Failed to save game data to localStorage:', error);
      throw new Error('Failed to save game data');
    }
  }

  /**
   * Add a scoreboard entry
   */
  async addScoreboardEntry(entry: ScoreboardEntry): Promise<void> {
    const storage = this.loadGameData();
    storage.scoreboard.push(entry);
    storage.scoreboard.sort((a, b) => b.score - a.score);
    storage.scoreboard = storage.scoreboard.slice(0, 100); // Keep top 100

    // Update best score and time
    if (entry.score > storage.bestScore) {
      storage.bestScore = entry.score;
    }
    if (
      entry.completionTime < storage.bestTime ||
      storage.bestTime === Infinity
    ) {
      storage.bestTime = entry.completionTime;
    }

    this.saveGameData(storage);

    // Sync to Supabase if logged in
    await this.syncToServer(entry);
  }

  /**
   * Add play history entry
   */
  addPlayHistory(history: PlayHistory): void {
    const storage = this.loadGameData();
    storage.playHistory.push(history);
    storage.playHistory = storage.playHistory.slice(-50); // Keep last 50 runs
    this.saveGameData(storage);
  }

  /**
   * Update achievements
   */
  updateAchievements(achievements: Achievement[]): void {
    const storage = this.loadGameData();
    storage.achievements = achievements;
    this.saveGameData(storage);
  }

  /**
   * Sync scoreboard entry to Supabase
   */
  private async syncToServer(entry: ScoreboardEntry): Promise<void> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();

      if (!session?.user) {
        // Not logged in, skip sync
        return;
      }

      const { error } = await this.supabase.from('monster_battler_scores').insert({
        user_id: session.user.id,
        mode: entry.mode,
        score: entry.score,
        monsters_defeated: entry.monstersDefeated,
        completion_time: entry.completionTime,
        timestamp: new Date(entry.timestamp).toISOString(),
        play_history: entry.playHistory,
      });

      if (error) {
        console.error('Failed to sync scoreboard entry to server:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error syncing to server:', error);
      // Don't throw - localStorage is the source of truth
      // Log error as per requirements
    }
  }

  /**
   * Load scoreboard from server for logged-in users
   */
  async loadServerScoreboard(): Promise<ScoreboardEntry[]> {
    try {
      const {
        data: { session },
      } = await this.supabase.auth.getSession();

      if (!session?.user) {
        return [];
      }

      const { data, error } = await this.supabase
        .from('monster_battler_scores')
        .select('*')
        .eq('user_id', session.user.id)
        .order('score', { ascending: false })
        .limit(100);

      if (error) {
        console.error('Failed to load server scoreboard:', error);
        throw error;
      }

      return (
        data?.map((row) => ({
          id: row.id,
          userId: row.user_id,
          mode: row.mode,
          score: row.score,
          monstersDefeated: row.monsters_defeated,
          completionTime: row.completion_time,
          timestamp: new Date(row.timestamp).getTime(),
          playHistory: row.play_history,
        })) || []
      );
    } catch (error) {
      console.error('Error loading server scoreboard:', error);
      // Return empty array on error - localStorage is fallback
      return [];
    }
  }

  /**
   * Get default storage structure
   */
  private getDefaultStorage(): GameStorage {
    return {
      scoreboard: [],
      playHistory: [],
      bestScore: 0,
      bestTime: Infinity,
      achievements: [],
    };
  }

  /**
   * Clear all game data (for testing/reset)
   */
  clearGameData(): void {
    localStorage.removeItem(STORAGE_KEYS.GAME_DATA);
    localStorage.removeItem(STORAGE_KEYS.CURRENT_RUN);
  }
}

export const gameStorage = new GameStorageManager();

