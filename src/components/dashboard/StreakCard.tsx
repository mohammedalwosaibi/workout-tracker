'use client';

import Card from '@/components/ui/Card';
import type { UserStats } from '@/types';

interface StreakCardProps {
  stats: UserStats;
}

export default function StreakCard({ stats }: StreakCardProps) {
  return (
    <Card className="relative overflow-hidden">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-500 mb-1">Improvement Streak</p>
          <p className="text-4xl font-bold text-gray-100">
            {stats.currentStreak}
            <span className="text-lg text-gray-500 ml-1">workout{stats.currentStreak !== 1 ? 's' : ''}</span>
          </p>
          {stats.longestStreak > 0 && (
            <p className="text-xs text-gray-600 mt-1">
              Best: {stats.longestStreak} in a row
            </p>
          )}
        </div>
        <div className="text-5xl opacity-20">
          {stats.currentStreak >= 5 ? '🔥' : stats.currentStreak >= 1 ? '💪' : '🏁'}
        </div>
      </div>
      {stats.currentStreak >= 3 && (
        <div className="absolute inset-0 bg-gradient-to-r from-orange-500/5 to-transparent pointer-events-none" />
      )}
    </Card>
  );
}
