'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import { calculateVolume } from '@/lib/progressive-overload';
import type { Exercise, WorkoutExerciseLog } from '@/types';

interface WorkoutSummaryProps {
  entries: (WorkoutExerciseLog & { exercise: Exercise })[];
  onRemove: (exerciseId: string) => void;
}

export default function WorkoutSummary({ entries, onRemove }: WorkoutSummaryProps) {
  if (entries.length === 0) return null;

  const totalVolume = entries.reduce(
    (sum, e) => sum + calculateVolume(e.sets),
    0,
  );

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          This Session
        </h3>
        <span className="text-sm text-gray-500">
          Total: <span className="text-gray-300 font-medium">{totalVolume.toLocaleString()} lbs</span>
        </span>
      </div>
      {entries.map(entry => (
        <Card key={entry.exerciseId} className="flex items-center justify-between py-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm font-medium text-gray-200">{entry.exercise.name}</span>
              <Badge muscle={entry.exercise.muscleGroup} />
            </div>
            <p className="text-xs text-gray-500">
              {entry.sets.map((s, i) => `${s.weight}×${s.reps}`).join(', ')}
              {' · '}
              {calculateVolume(entry.sets).toLocaleString()} lbs
            </p>
          </div>
          <Button variant="ghost" size="sm" onClick={() => onRemove(entry.exerciseId)}>
            ✕
          </Button>
        </Card>
      ))}
    </div>
  );
}
