'use client';

import Link from 'next/link';
import Card from '@/components/ui/Card';
import { calculateVolume } from '@/lib/progressive-overload';
import { formatDate } from '@/lib/utils';
import type { WorkoutLog, Exercise } from '@/types';

interface RecentStatsCardProps {
  logs: WorkoutLog[];
  exercises: Exercise[];
}

export default function RecentStatsCard({ logs, exercises }: RecentStatsCardProps) {
  if (logs.length === 0) return null;

  const getExercise = (id: string) => exercises.find(e => e.id === id);

  return (
    <Card>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
          Recent Workouts
        </h3>
        <Link href="/history" className="text-xs text-indigo-400 hover:text-indigo-300">
          View all →
        </Link>
      </div>
      <div className="space-y-3">
        {logs.map(log => {
          const totalVolume = log.exercises.reduce(
            (sum, e) => sum + calculateVolume(e.sets), 0,
          );
          const exerciseNames = log.exercises
            .map(e => getExercise(e.exerciseId)?.name)
            .filter(Boolean);

          return (
            <div key={log.id} className="flex items-center justify-between py-2 border-b border-gray-800/50 last:border-0">
              <div>
                <p className="text-sm text-gray-300">{formatDate(log.date)}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {exerciseNames.slice(0, 3).join(', ')}
                  {exerciseNames.length > 3 && ` +${exerciseNames.length - 3}`}
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm font-medium text-gray-200">{totalVolume.toLocaleString()} lbs</p>
                <p className="text-xs text-gray-500">{log.exercises.length} exercises</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
