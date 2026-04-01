'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { MuscleGroup, Exercise, WorkoutExerciseLog } from '@/types';

interface TodayWorkoutCardProps {
  muscles: MuscleGroup[];
  exercises: Exercise[];
  getLastLog: (exerciseId: string) => WorkoutExerciseLog | undefined;
}

export default function TodayWorkoutCard({ muscles, exercises, getLastLog }: TodayWorkoutCardProps) {
  const todaysExercises = exercises.filter(e => muscles.includes(e.muscleGroup));

  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-1">
            Today&apos;s Workout
          </h3>
          <div className="flex gap-1.5">
            {muscles.map(m => <Badge key={m} muscle={m} size="md" />)}
          </div>
        </div>
        <Link href="/workout">
          <Button>Start Workout</Button>
        </Link>
      </div>

      {todaysExercises.length > 0 ? (
        <div className="space-y-2 mt-3">
          {todaysExercises.map(exercise => {
            const lastLog = getLastLog(exercise.id);
            return (
              <div key={exercise.id} className="flex items-center justify-between py-1.5">
                <span className="text-sm text-gray-300">{exercise.name}</span>
                <span className="text-xs text-gray-600">
                  {lastLog
                    ? lastLog.sets.map(s => `${s.weight}×${s.reps}`).join(', ')
                    : 'Not logged yet'}
                </span>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-2">
          No exercises added for these muscles yet.{' '}
          <Link href="/exercises" className="text-indigo-400 hover:text-indigo-300">Add some →</Link>
        </p>
      )}
    </Card>
  );
}
