import type { Exercise, WorkoutSet } from '@/types';

export interface OverloadSuggestion {
  type: 'increase_weight' | 'increase_reps' | 'maintain' | 'first_time';
  message: string;
  suggestedSets: WorkoutSet[];
}

const WEIGHT_INCREMENT = 5; // lbs

export function getSuggestion(
  exercise: Exercise,
  lastPerformance: WorkoutSet[] | null,
): OverloadSuggestion {
  if (!lastPerformance || lastPerformance.length === 0) {
    return {
      type: 'first_time',
      message: 'First time! Pick a comfortable weight and aim for the bottom of your rep range.',
      suggestedSets: Array.from({ length: exercise.sets }, () => ({
        weight: 0,
        reps: exercise.repRangeMin,
      })),
    };
  }

  const allAtMax = lastPerformance.every(s => s.reps >= exercise.repRangeMax);

  if (allAtMax) {
    const lastWeight = lastPerformance[0].weight;
    const newWeight = lastWeight + WEIGHT_INCREMENT;
    return {
      type: 'increase_weight',
      message: `All sets hit ${exercise.repRangeMax} reps! Bump weight to ${newWeight} lbs and aim for ${exercise.repRangeMin} reps.`,
      suggestedSets: Array.from({ length: exercise.sets }, () => ({
        weight: newWeight,
        reps: exercise.repRangeMin,
      })),
    };
  }

  // Find the lowest rep count, then pick the earliest set with that count
  const minReps = Math.min(...lastPerformance.map(s => s.reps));
  const targetIndex = lastPerformance.findIndex(s => s.reps === minReps);
  const suggestedSets = lastPerformance.map((set, i) => {
    if (i === targetIndex) {
      return { weight: set.weight, reps: set.reps + 1 };
    }
    return { ...set };
  });

  return {
    type: 'increase_reps',
    message: `+1 rep on set ${targetIndex + 1}. Goal: ${exercise.repRangeMax} reps across all sets.`,
    suggestedSets,
  };
}

export function calculateVolume(sets: WorkoutSet[]): number {
  return sets.reduce((sum, s) => sum + s.weight * s.reps, 0);
}

export function volumeChangePercent(
  current: WorkoutSet[],
  previous: WorkoutSet[],
): number {
  const curr = calculateVolume(current);
  const prev = calculateVolume(previous);
  if (prev === 0) return 0;
  return ((curr - prev) / prev) * 100;
}
