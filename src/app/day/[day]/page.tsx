'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useExercises } from '@/hooks/useExercises';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import { useUserStats } from '@/hooks/useUserStats';
import SetLogger from '@/components/workout/SetLogger';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import { capitalize, todayISO } from '@/lib/utils';
import { calculateVolume, getSuggestion } from '@/lib/progressive-overload';
import { DAYS_OF_WEEK } from '@/types';
import type { DayOfWeek, WorkoutSet, WorkoutExerciseLog } from '@/types';

export default function DayPage() {
  const params = useParams();
  const day = params.day as string;
  const { exercises, getExercisesByDay, getExerciseById, mounted: exMounted } = useExercises();
  const { addLog, getLastLogForExercise, mounted: logsMounted } = useWorkoutLogs();
  const { recordWorkout, mounted: statsMounted } = useUserStats();

  const [sessionSets, setSessionSets] = useState<Record<string, WorkoutSet[]>>({});
  const [finished, setFinished] = useState(false);

  const mounted = exMounted && logsMounted && statsMounted;

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-10 w-48 bg-gray-900/50 rounded-xl" />
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-48 bg-gray-900/50 rounded-xl" />
        ))}
      </div>
    );
  }

  if (!DAYS_OF_WEEK.includes(day as DayOfWeek)) {
    return (
      <EmptyState
        icon="❌"
        title="Invalid day"
        description={`"${day}" is not a valid day of the week.`}
      />
    );
  }

  const dayExercises = getExercisesByDay(day as DayOfWeek);

  const initSets = (exerciseId: string): WorkoutSet[] => {
    if (sessionSets[exerciseId]) return sessionSets[exerciseId];
    const exercise = getExerciseById(exerciseId);
    if (!exercise) return [];
    const lastLog = getLastLogForExercise(exerciseId);
    const suggestion = getSuggestion(exercise, lastLog?.sets ?? null);
    return suggestion.suggestedSets;
  };

  const updateSets = (exerciseId: string, sets: WorkoutSet[]) => {
    setSessionSets(prev => ({ ...prev, [exerciseId]: sets }));
  };

  const hasAnyInput = Object.values(sessionSets).some(sets =>
    sets.some(s => s.weight > 0 || s.reps > 0),
  );

  const handleFinish = () => {
    const loggedExercises: WorkoutExerciseLog[] = [];
    let hadImprovement = false;

    for (const [exerciseId, sets] of Object.entries(sessionSets)) {
      const hasData = sets.some(s => s.weight > 0 && s.reps > 0);
      if (!hasData) continue;

      loggedExercises.push({ exerciseId, sets });

      const lastLog = getLastLogForExercise(exerciseId);
      if (lastLog) {
        const prevVol = calculateVolume(lastLog.sets);
        const currVol = calculateVolume(sets);
        if (currVol > prevVol) hadImprovement = true;
        const prevMaxWeight = Math.max(...lastLog.sets.map(s => s.weight));
        const currMaxWeight = Math.max(...sets.map(s => s.weight));
        if (currMaxWeight > prevMaxWeight) hadImprovement = true;
      } else {
        hadImprovement = true;
      }
    }

    if (loggedExercises.length === 0) return;

    addLog({ date: todayISO(), exercises: loggedExercises });
    recordWorkout(todayISO(), hadImprovement);
    setFinished(true);
  };

  if (finished) {
    const loggedCount = Object.values(sessionSets).filter(sets =>
      sets.some(s => s.weight > 0 && s.reps > 0),
    ).length;
    const totalVolume = Object.values(sessionSets).reduce(
      (sum, sets) => sum + calculateVolume(sets),
      0,
    );

    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-6">💪</span>
        <h1 className="text-3xl font-bold text-gray-100 mb-3">Workout Complete!</h1>
        <p className="text-gray-400 mb-2">
          {loggedCount} exercise{loggedCount !== 1 ? 's' : ''} logged
        </p>
        <p className="text-gray-500 mb-8">
          Total volume: {totalVolume.toLocaleString()} lbs
        </p>
        <Link href="/">
          <Button size="lg">Back to Dashboard</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">{capitalize(day)}</h1>
        <p className="text-sm text-gray-500 mt-1">
          {dayExercises.length} exercise{dayExercises.length !== 1 ? 's' : ''}
        </p>
      </div>

      {dayExercises.length === 0 ? (
        <EmptyState
          icon="📋"
          title="No exercises for this day"
          description="Add exercises and assign them to this day."
          actionLabel="Go to Exercises"
          actionHref="/exercises"
        />
      ) : (
        <>
          {dayExercises.map(exercise => {
            const lastLog = getLastLogForExercise(exercise.id);
            const lastSets = lastLog?.sets ?? null;
            const sets = initSets(exercise.id);

            return (
              <Card key={exercise.id}>
                <h3 className="font-medium text-gray-200 mb-1">{exercise.name}</h3>
                <p className="text-xs text-gray-500 mb-4">
                  {exercise.sets} sets &middot; {exercise.repRangeMin}–{exercise.repRangeMax} reps
                </p>
                <SetLogger
                  exercise={exercise}
                  sets={sets}
                  lastSets={lastSets}
                  onChange={(newSets) => updateSets(exercise.id, newSets)}
                />
              </Card>
            );
          })}

          <Button
            size="lg"
            className="w-full"
            onClick={handleFinish}
            disabled={!hasAnyInput}
          >
            Finish Workout
          </Button>
        </>
      )}
    </div>
  );
}
