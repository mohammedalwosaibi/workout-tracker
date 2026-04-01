export type MuscleGroup =
  | 'chest'
  | 'back'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'legs'
  | 'core'
  | 'glutes'
  | 'forearms'
  | 'calves';

export type DayOfWeek =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type TrainingPlan = Partial<Record<DayOfWeek, MuscleGroup[]>>;

export interface Exercise {
  id: string;
  name: string;
  muscleGroup: MuscleGroup;
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

export const MUSCLE_GROUPS: MuscleGroup[] = [
  'chest', 'back', 'shoulders', 'biceps', 'triceps',
  'legs', 'core', 'glutes', 'forearms', 'calves',
];

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
];

export const MUSCLE_GROUP_COLORS: Record<MuscleGroup, string> = {
  chest: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  back: 'bg-green-500/20 text-green-400 border-green-500/30',
  shoulders: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  biceps: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
  triceps: 'bg-pink-500/20 text-pink-400 border-pink-500/30',
  legs: 'bg-red-500/20 text-red-400 border-red-500/30',
  core: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  glutes: 'bg-rose-500/20 text-rose-400 border-rose-500/30',
  forearms: 'bg-teal-500/20 text-teal-400 border-teal-500/30',
  calves: 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
};
