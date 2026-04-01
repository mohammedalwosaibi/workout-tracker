'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { WorkoutLog, WorkoutExerciseLog, WorkoutSet } from '@/types';

export function useWorkoutLogs() {
  const [logs, setLogs, mounted] = useLocalStorage<WorkoutLog[]>(
    STORAGE_KEYS.LOGS,
    [],
  );

  const addLog = (log: Omit<WorkoutLog, 'id'>) => {
    setLogs(prev => [{ ...log, id: generateId() }, ...prev]);
  };

  const getLastLogForExercise = (exerciseId: string): WorkoutExerciseLog | undefined => {
    for (const log of logs) {
      const entry = log.exercises.find(e => e.exerciseId === exerciseId);
      if (entry) return entry;
    }
    return undefined;
  };

  const getLogsForExercise = (
    exerciseId: string,
  ): { date: string; sets: WorkoutSet[] }[] => {
    const results: { date: string; sets: WorkoutSet[] }[] = [];
    for (const log of logs) {
      const entry = log.exercises.find(e => e.exerciseId === exerciseId);
      if (entry) {
        results.push({ date: log.date, sets: entry.sets });
      }
    }
    return results;
  };

  const getRecentLogs = (count: number): WorkoutLog[] => {
    return logs.slice(0, count);
  };

  return { logs, addLog, getLastLogForExercise, getLogsForExercise, getRecentLogs, mounted };
}
