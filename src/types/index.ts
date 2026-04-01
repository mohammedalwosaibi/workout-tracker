export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export interface Exercise {
  id: string;
  name: string;
  days: DayOfWeek[];
  repRangeMin: number;
  repRangeMax: number;
  sets: number;
}

export interface WorkoutSet {
  weight: number;
  reps: number;
}

export interface WorkoutExerciseLog {
  exerciseId: string;
  sets: WorkoutSet[];
}

export interface WorkoutLog {
  id: string;
  date: string;
  exercises: WorkoutExerciseLog[];
}

export interface UserStats {
  currentStreak: number;
  longestStreak: number;
  lastWorkoutDate: string | null;
}

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];
