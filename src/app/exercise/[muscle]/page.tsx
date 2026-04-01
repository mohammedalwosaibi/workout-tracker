'use client';

import { use } from 'react';
import Link from 'next/link';
import { useExercises } from '@/hooks/useExercises';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import ExerciseHistory from '@/components/muscle/ExerciseHistory';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import { capitalize } from '@/lib/utils';
import { MUSCLE_GROUPS } from '@/types';
import type { MuscleGroup } from '@/types';

export default function MuscleGroupPage({
  params,
}: {
  params: Promise<{ muscle: string }>;
}) {
  const { muscle } = use(params);
  const { exercises, mounted: exMounted } = useExercises();
  const { getLogsForExercise, mounted: logsMounted } = useWorkoutLogs();

  const isValid = MUSCLE_GROUPS.includes(muscle as MuscleGroup);

  if (!exMounted || !logsMounted) {
    return <div className="animate-pulse space-y-4">
      <div className="h-8 w-48 bg-gray-900/50 rounded" />
      <div className="h-40 bg-gray-900/50 rounded-xl" />
    </div>;
  }

  if (!isValid) {
    return (
      <EmptyState
        icon="❓"
        title="Unknown muscle group"
        description={`"${muscle}" is not a recognized muscle group.`}
        actionLabel="Browse Exercises"
        actionHref="/exercises"
      />
    );
  }

  const muscleGroup = muscle as MuscleGroup;
  const muscleExercises = exercises.filter(e => e.muscleGroup === muscleGroup);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Link href="/exercises" className="text-gray-500 hover:text-gray-300 transition-colors">
          ← Exercises
        </Link>
      </div>

      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-100">{capitalize(muscleGroup)}</h1>
        <Badge muscle={muscleGroup} size="md" />
      </div>

      {muscleExercises.length === 0 ? (
        <EmptyState
          icon="🏋️"
          title={`No ${muscleGroup} exercises`}
          description={`Add some ${muscleGroup} exercises to start tracking.`}
          actionLabel="Add Exercises"
          actionHref="/exercises"
        />
      ) : (
        <div className="space-y-4">
          {muscleExercises.map(exercise => (
            <ExerciseHistory
              key={exercise.id}
              exercise={exercise}
              history={getLogsForExercise(exercise.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
