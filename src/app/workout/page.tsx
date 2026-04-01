'use client';

import { useState, useMemo } from 'react';
import { useExercises } from '@/hooks/useExercises';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import { useTrainingPlan } from '@/hooks/useTrainingPlan';
import { useUserStats } from '@/hooks/useUserStats';
import { getSuggestion, calculateVolume } from '@/lib/progressive-overload';
import { todayISO } from '@/lib/utils';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Badge from '@/components/ui/Badge';
import EmptyState from '@/components/ui/EmptyState';
import SetLogger from '@/components/workout/SetLogger';
import WorkoutSummary from '@/components/workout/WorkoutSummary';
import type { Exercise, WorkoutExerciseLog, WorkoutSet } from '@/types';

export default function WorkoutPage() {
  const { exercises, mounted: exMounted } = useExercises();
  const { addLog, getLastLogForExercise, mounted: logsMounted } = useWorkoutLogs();
  const { getTodaysMuscles, hasPlan } = useTrainingPlan();
  const { recordWorkout } = useUserStats();

  const [selectedExerciseId, setSelectedExerciseId] = useState<string | null>(null);
  const [currentSets, setCurrentSets] = useState<WorkoutSet[]>([]);
  const [sessionEntries, setSessionEntries] = useState<(WorkoutExerciseLog & { exercise: Exercise })[]>([]);
  const [finished, setFinished] = useState(false);

  const todaysMuscles = getTodaysMuscles();
  const hasPlanSetup = hasPlan();

  // Filter exercises based on today's plan, or show all
  const availableExercises = useMemo(() => {
    if (!hasPlanSetup || todaysMuscles.length === 0) return exercises;
    return exercises.filter(e => todaysMuscles.includes(e.muscleGroup));
  }, [exercises, todaysMuscles, hasPlanSetup]);

  // Also show exercises not in today's plan as "other"
  const otherExercises = useMemo(() => {
    if (!hasPlanSetup || todaysMuscles.length === 0) return [];
    return exercises.filter(e => !todaysMuscles.includes(e.muscleGroup));
  }, [exercises, todaysMuscles, hasPlanSetup]);

  const selectedExercise = exercises.find(e => e.id === selectedExerciseId);

  const selectExercise = (exercise: Exercise) => {
    setSelectedExerciseId(exercise.id);
    const lastLog = getLastLogForExercise(exercise.id);
    const suggestion = getSuggestion(exercise, lastLog?.sets || null);
    // Pre-fill with suggestion
    setCurrentSets(
      suggestion.suggestedSets.length > 0
        ? suggestion.suggestedSets
        : Array.from({ length: exercise.sets }, () => ({ weight: 0, reps: 0 })),
    );
  };

  const addToSession = () => {
    if (!selectedExercise || currentSets.some(s => s.weight === 0 && s.reps === 0)) return;

    setSessionEntries(prev => [
      ...prev.filter(e => e.exerciseId !== selectedExercise.id),
      { exerciseId: selectedExercise.id, sets: currentSets, exercise: selectedExercise },
    ]);
    setSelectedExerciseId(null);
    setCurrentSets([]);
  };

  const removeFromSession = (exerciseId: string) => {
    setSessionEntries(prev => prev.filter(e => e.exerciseId !== exerciseId));
  };

  const finishWorkout = () => {
    if (sessionEntries.length === 0) return;
    const date = todayISO();

    // Check if any exercise improved
    let hadImprovement = false;
    for (const entry of sessionEntries) {
      const lastLog = getLastLogForExercise(entry.exerciseId);
      if (!lastLog) {
        hadImprovement = true;
        break;
      }
      const currentVol = calculateVolume(entry.sets);
      const lastVol = calculateVolume(lastLog.sets);
      if (currentVol > lastVol) {
        hadImprovement = true;
        break;
      }
      // Also check if weight increased on any set
      if (entry.sets.some((s, i) => lastLog.sets[i] && s.weight > lastLog.sets[i].weight)) {
        hadImprovement = true;
        break;
      }
    }

    addLog({
      date,
      exercises: sessionEntries.map(({ exerciseId, sets }) => ({ exerciseId, sets })),
    });
    recordWorkout(date, hadImprovement);
    setFinished(true);
  };

  if (!exMounted || !logsMounted) {
    return <div className="animate-pulse space-y-4">
      <div className="h-32 bg-gray-900/50 rounded-xl" />
      <div className="h-48 bg-gray-900/50 rounded-xl" />
    </div>;
  }

  if (finished) {
    const totalVolume = sessionEntries.reduce((sum, e) => sum + calculateVolume(e.sets), 0);
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-4">🎉</span>
        <h2 className="text-2xl font-bold text-gray-100 mb-2">Workout Complete!</h2>
        <p className="text-gray-500 mb-1">
          {sessionEntries.length} exercise{sessionEntries.length !== 1 ? 's' : ''} logged
        </p>
        <p className="text-lg font-semibold text-indigo-400 mb-6">
          {totalVolume.toLocaleString()} lbs total volume
        </p>
        <div className="flex gap-3">
          <Button onClick={() => { setSessionEntries([]); setFinished(false); }}>
            New Workout
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = '/history'}>
            View History
          </Button>
        </div>
      </div>
    );
  }

  if (exercises.length === 0) {
    return (
      <EmptyState
        icon="🏋️"
        title="No exercises added yet"
        description="Add some exercises first, then come back to log your workout."
        actionLabel="Add Exercises"
        actionHref="/exercises"
      />
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Log Workout</h1>
        <p className="text-sm text-gray-500 mt-1">
          {todaysMuscles.length > 0
            ? `Today's focus: ${todaysMuscles.join(', ')}`
            : 'Select an exercise to get started'}
        </p>
      </div>

      {/* Exercise picker */}
      {!selectedExercise && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
            {hasPlanSetup && todaysMuscles.length > 0 ? "Today's Exercises" : 'Pick an Exercise'}
          </h2>
          <div className="grid gap-2">
            {availableExercises
              .filter(e => !sessionEntries.some(s => s.exerciseId === e.id))
              .map(exercise => {
                const lastLog = getLastLogForExercise(exercise.id);
                return (
                  <Card
                    key={exercise.id}
                    hover
                    className="cursor-pointer"
                    onClick={() => selectExercise(exercise)}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-gray-200">{exercise.name}</span>
                          <Badge muscle={exercise.muscleGroup} />
                        </div>
                        <p className="text-xs text-gray-500">
                          {exercise.sets} sets · {exercise.repRangeMin}–{exercise.repRangeMax} reps
                          {lastLog && (
                            <span className="ml-2 text-gray-600">
                              Last: {lastLog.sets.map(s => `${s.weight}×${s.reps}`).join(', ')}
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-gray-600 text-lg">→</span>
                    </div>
                  </Card>
                );
              })}
          </div>

          {otherExercises.length > 0 && (
            <>
              <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mt-6">
                Other Exercises
              </h2>
              <div className="grid gap-2">
                {otherExercises
                  .filter(e => !sessionEntries.some(s => s.exerciseId === e.id))
                  .map(exercise => (
                    <Card
                      key={exercise.id}
                      hover
                      className="cursor-pointer opacity-60 hover:opacity-100"
                      onClick={() => selectExercise(exercise)}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-300">{exercise.name}</span>
                        <Badge muscle={exercise.muscleGroup} />
                      </div>
                    </Card>
                  ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Set logger for selected exercise */}
      {selectedExercise && (
        <Card>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-gray-200">{selectedExercise.name}</h2>
              <Badge muscle={selectedExercise.muscleGroup} />
            </div>
            <Button variant="ghost" size="sm" onClick={() => { setSelectedExerciseId(null); setCurrentSets([]); }}>
              ← Back
            </Button>
          </div>
          <SetLogger
            exercise={selectedExercise}
            sets={currentSets}
            lastSets={getLastLogForExercise(selectedExercise.id)?.sets || null}
            onChange={setCurrentSets}
          />
          <div className="mt-4 flex justify-end">
            <Button onClick={addToSession}>
              Add to Session
            </Button>
          </div>
        </Card>
      )}

      {/* Session summary */}
      <WorkoutSummary entries={sessionEntries} onRemove={removeFromSession} />

      {/* Finish button */}
      {sessionEntries.length > 0 && !selectedExercise && (
        <div className="flex justify-center pt-4">
          <Button size="lg" onClick={finishWorkout}>
            Finish Workout ({sessionEntries.length} exercise{sessionEntries.length !== 1 ? 's' : ''})
          </Button>
        </div>
      )}
    </div>
  );
}
