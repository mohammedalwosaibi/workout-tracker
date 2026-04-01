'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { generateId } from '@/lib/utils';
import type { Exercise, MuscleGroup } from '@/types';

export function useExercises() {
  const [exercises, setExercises, mounted] = useLocalStorage<Exercise[]>(
    STORAGE_KEYS.EXERCISES,
    [],
  );

  const addExercise = (exercise: Omit<Exercise, 'id'>) => {
    setExercises(prev => [...prev, { ...exercise, id: generateId() }]);
  };

  const updateExercise = (id: string, updates: Partial<Exercise>) => {
    setExercises(prev =>
      prev.map(e => (e.id === id ? { ...e, ...updates } : e)),
    );
  };

  const deleteExercise = (id: string) => {
    setExercises(prev => prev.filter(e => e.id !== id));
  };

  const getExercisesByMuscle = (muscle: MuscleGroup): Exercise[] => {
    return exercises.filter(e => e.muscleGroup === muscle);
  };

  const getExerciseById = (id: string): Exercise | undefined => {
    return exercises.find(e => e.id === id);
  };

  return {
    exercises,
    addExercise,
    updateExercise,
    deleteExercise,
    getExercisesByMuscle,
    getExerciseById,
    mounted,
  };
}
