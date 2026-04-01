'use client';

import { useLocalStorage } from './useLocalStorage';
import { STORAGE_KEYS } from '@/lib/storage';
import { getDayOfWeek } from '@/lib/utils';
import type { TrainingPlan, MuscleGroup } from '@/types';

export function useTrainingPlan() {
  const [plan, setPlan, mounted] = useLocalStorage<TrainingPlan>(
    STORAGE_KEYS.PLAN,
    {},
  );

  const getTodaysMuscles = (): MuscleGroup[] => {
    const today = getDayOfWeek();
    return plan[today] || [];
  };

  const hasPlan = (): boolean => {
    return Object.values(plan).some(muscles => muscles && muscles.length > 0);
  };

  return { plan, setPlan, getTodaysMuscles, hasPlan, mounted };
}
