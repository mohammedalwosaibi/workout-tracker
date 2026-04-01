'use client';

import Card from '@/components/ui/Card';
import VolumeTrend from './VolumeTrend';
import { calculateVolume } from '@/lib/progressive-overload';
import { formatDate } from '@/lib/utils';
import type { Exercise, WorkoutSet } from '@/types';

interface ExerciseHistoryProps {
  exercise: Exercise;
  history: { date: string; sets: WorkoutSet[] }[];
}

export default function ExerciseHistory({ exercise, history }: ExerciseHistoryProps) {
  const recent = history.slice(0, 5);

  return (
    <Card>
      <div className="mb-3">
        <h3 className="font-medium text-gray-200">{exercise.name}</h3>
        <p className="text-xs text-gray-500">
          {exercise.sets} sets · {exercise.repRangeMin}–{exercise.repRangeMax} reps
        </p>
      </div>

      {recent.length === 0 ? (
        <p className="text-sm text-gray-600">No history yet</p>
      ) : (
        <div className="space-y-4">
          {/* Recent performances */}
          <div className="space-y-1.5">
            {recent.map((entry, i) => (
              <div key={i} className="flex items-center justify-between text-sm py-1 border-b border-gray-800/30 last:border-0">
                <span className="text-gray-500">{formatDate(entry.date)}</span>
                <span className="text-gray-400">
                  {entry.sets.map(s => `${s.weight}×${s.reps}`).join(', ')}
                </span>
                <span className="text-gray-300 font-medium">
                  {calculateVolume(entry.sets)} lbs
                </span>
              </div>
            ))}
          </div>

          {/* Volume trend bars */}
          <VolumeTrend history={recent.slice().reverse()} />
        </div>
      )}
    </Card>
  );
}
