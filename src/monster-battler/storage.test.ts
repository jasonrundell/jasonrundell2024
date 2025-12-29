import { gameStorage } from './storage';
import type { ScoreboardEntry, PlayHistory } from './types';
import { STORAGE_KEYS } from './constants';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock Supabase client
jest.mock('@/utils/supabase/client', () => ({
  createClient: () => ({
    auth: {
      getSession: jest.fn().mockResolvedValue({
        data: { session: null },
      }),
    },
    from: jest.fn().mockReturnValue({
      insert: jest.fn().mockResolvedValue({ error: null }),
      select: jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockReturnValue({
            limit: jest.fn().mockResolvedValue({ data: [], error: null }),
          }),
        }),
      }),
    }),
  }),
}));

describe('GameStorageManager', () => {
  beforeEach(() => {
    localStorageMock.clear();
  });

  describe('loadGameData', () => {
    it('should return default storage when no data exists', () => {
      const data = gameStorage.loadGameData();
      expect(data).toEqual({
        scoreboard: [],
        playHistory: [],
        bestScore: 0,
        bestTime: Infinity,
        achievements: [],
      });
    });

    it('should load existing game data from localStorage', () => {
      const testData = {
        scoreboard: [],
        playHistory: [],
        bestScore: 1000,
        bestTime: 5000,
        achievements: [],
      };
      localStorageMock.setItem(STORAGE_KEYS.GAME_DATA, JSON.stringify(testData));

      const data = gameStorage.loadGameData();
      expect(data.bestScore).toBe(1000);
      expect(data.bestTime).toBe(5000);
    });

    it('should throw error on invalid JSON', () => {
      localStorageMock.setItem(STORAGE_KEYS.GAME_DATA, 'invalid json');
      expect(() => gameStorage.loadGameData()).toThrow();
    });
  });

  describe('saveGameData', () => {
    it('should save game data to localStorage', () => {
      const testData = {
        scoreboard: [],
        playHistory: [],
        bestScore: 500,
        bestTime: 3000,
        achievements: [],
      };

      gameStorage.saveGameData(testData);
      const saved = localStorageMock.getItem(STORAGE_KEYS.GAME_DATA);
      expect(saved).toBeTruthy();
      const parsed = JSON.parse(saved!);
      expect(parsed.bestScore).toBe(500);
    });
  });

  describe('addScoreboardEntry', () => {
    it('should add entry to scoreboard', async () => {
      const entry: ScoreboardEntry = {
        id: 'test-1',
        userId: null,
        mode: 'gauntlet',
        score: 1000,
        monstersDefeated: 5,
        completionTime: 60000,
        timestamp: Date.now(),
        playHistory: {
          runId: 'run-1',
          mode: 'gauntlet',
          startTime: Date.now(),
          endTime: Date.now(),
          battles: [],
          totalScore: 1000,
          monstersDefeated: 5,
          completionTime: 60000,
        },
      };

      await gameStorage.addScoreboardEntry(entry);
      const data = gameStorage.loadGameData();
      expect(data.scoreboard.length).toBe(1);
      expect(data.scoreboard[0].score).toBe(1000);
    });

    it('should update best score when new entry is higher', async () => {
      const entry1: ScoreboardEntry = {
        id: 'test-1',
        userId: null,
        mode: 'gauntlet',
        score: 1000,
        monstersDefeated: 5,
        completionTime: 60000,
        timestamp: Date.now(),
        playHistory: {
          runId: 'run-1',
          mode: 'gauntlet',
          startTime: Date.now(),
          endTime: Date.now(),
          battles: [],
          totalScore: 1000,
          monstersDefeated: 5,
          completionTime: 60000,
        },
      };

      const entry2: ScoreboardEntry = {
        ...entry1,
        id: 'test-2',
        score: 2000,
        playHistory: {
          ...entry1.playHistory,
          totalScore: 2000,
        },
      };

      await gameStorage.addScoreboardEntry(entry1);
      await gameStorage.addScoreboardEntry(entry2);

      const data = gameStorage.loadGameData();
      expect(data.bestScore).toBe(2000);
    });

    it('should keep only top 100 entries', async () => {
      for (let i = 0; i < 150; i++) {
        const entry: ScoreboardEntry = {
          id: `test-${i}`,
          userId: null,
          mode: 'gauntlet',
          score: i,
          monstersDefeated: 1,
          completionTime: 60000,
          timestamp: Date.now(),
          playHistory: {
            runId: `run-${i}`,
            mode: 'gauntlet',
            startTime: Date.now(),
            endTime: Date.now(),
            battles: [],
            totalScore: i,
            monstersDefeated: 1,
            completionTime: 60000,
          },
        };
        await gameStorage.addScoreboardEntry(entry);
      }

      const data = gameStorage.loadGameData();
      expect(data.scoreboard.length).toBeLessThanOrEqual(100);
    });
  });

  describe('addPlayHistory', () => {
    it('should add play history entry', () => {
      const history: PlayHistory = {
        runId: 'run-1',
        mode: 'gauntlet',
        startTime: Date.now(),
        endTime: Date.now(),
        battles: [],
        totalScore: 1000,
        monstersDefeated: 5,
        completionTime: 60000,
      };

      gameStorage.addPlayHistory(history);
      const data = gameStorage.loadGameData();
      expect(data.playHistory.length).toBe(1);
      expect(data.playHistory[0].runId).toBe('run-1');
    });

    it('should keep only last 50 runs', () => {
      for (let i = 0; i < 60; i++) {
        const history: PlayHistory = {
          runId: `run-${i}`,
          mode: 'gauntlet',
          startTime: Date.now(),
          endTime: Date.now(),
          battles: [],
          totalScore: 1000,
          monstersDefeated: 5,
          completionTime: 60000,
        };
        gameStorage.addPlayHistory(history);
      }

      const data = gameStorage.loadGameData();
      expect(data.playHistory.length).toBeLessThanOrEqual(50);
    });
  });

  describe('clearGameData', () => {
    it('should clear all game data', () => {
      const testData = {
        scoreboard: [{ id: 'test' }],
        playHistory: [],
        bestScore: 1000,
        bestTime: 5000,
        achievements: [],
      };
      gameStorage.saveGameData(testData);
      gameStorage.clearGameData();

      const data = gameStorage.loadGameData();
      expect(data.scoreboard.length).toBe(0);
      expect(data.bestScore).toBe(0);
    });
  });
});

