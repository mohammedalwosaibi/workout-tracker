'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import type { UserStats } from '@/types';

const DEFAULT_STATS: UserStats = {
  currentStreak: 0,
  longestStreak: 0,
  lastWorkoutDate: null,
};

export function useUserStats() {
  const [stats, setStats, mounted] = useLocalStorage<UserStats>(
    STORAGE_KEYS.STATS,
    DEFAULT_STATS,
  );

  const recordWorkout = (date: string, hadImprovement: boolean) => {
    setStats(prev => {
      const newStreak = hadImprovement ? prev.currentStreak + 1 : 0;
      return {
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        lastWorkoutDate: date,
      };
    });
  };

  return { stats, recordWorkout, mounted };
}
