'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import { calculateVolume } from '@/lib/progressive-overload';
import { formatDate } from '@/lib/utils';
import type { WorkoutLog, Exercise } from '@/types';

interface WorkoutLogCardProps {
  log: WorkoutLog;
  exercises: Exercise[];
  prevLog?: WorkoutLog;
}

export default function WorkoutLogCard({ log, exercises, prevLog }: WorkoutLogCardProps) {
  const [expanded, setExpanded] = useState(false);

  const getExercise = (id: string) => exercises.find(e => e.id === id);
  const totalVolume = log.exercises.reduce((sum, e) => sum + calculateVolume(e.sets), 0);

  const prevTotalVolume = prevLog
    ? prevLog.exercises.reduce((sum, e) => sum + calculateVolume(e.sets), 0)
    : null;

  const volumeChange = prevTotalVolume
    ? ((totalVolume - prevTotalVolume) / prevTotalVolume) * 100
    : null;

  const muscles = [...new Set(
    log.exercises.map(e => getExercise(e.exerciseId)?.muscleGroup).filter(Boolean),
  )];

  return (
    <Card hover className="cursor-pointer" onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between">
        <div>
          <p className="font-medium text-gray-200">{formatDate(log.date)}</p>
          <div className="flex gap-1 mt-1">
            {muscles.map(m => m && <Badge key={m} muscle={m} />)}
          </div>
        </div>
        <div className="text-right">
          <p className="font-medium text-gray-200">{totalVolume.toLocaleString()} lbs</p>
          <div className="flex items-center justify-end gap-2">
            <p className="text-xs text-gray-500">{log.exercises.length} exercises</p>
            {volumeChange !== null && (
              <span className={`text-xs font-medium px-1.5 py-0.5 rounded-full ${
                volumeChange > 0
                  ? 'bg-emerald-500/20 text-emerald-400'
                  : volumeChange < 0
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-700/50 text-gray-400'
              }`}>
                {volumeChange > 0 ? '↑' : volumeChange < 0 ? '↓' : '='}{Math.abs(volumeChange).toFixed(1)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {expanded && (
        <div className="mt-4 pt-4 border-t border-gray-800/50 space-y-3">
          {log.exercises.map(entry => {
            const exercise = getExercise(entry.exerciseId);
            return (
              <div key={entry.exerciseId}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-gray-300">
                    {exercise?.name || 'Unknown'}
                  </span>
                  {exercise && <Badge muscle={exercise.muscleGroup} />}
                </div>
                <div className="flex gap-3 text-xs text-gray-500">
                  {entry.sets.map((s, i) => (
                    <span key={i}>
                      Set {i + 1}: {s.weight} × {s.reps}
                    </span>
                  ))}
                  <span className="text-gray-400 font-medium">
                    = {calculateVolume(entry.sets)} lbs
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}
