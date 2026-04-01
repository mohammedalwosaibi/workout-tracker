'use client';

import Link from 'next/link';
import { useExercises } from '@/hooks/useExercises';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import { useUserStats } from '@/hooks/useUserStats';
import StreakCard from '@/components/dashboard/StreakCard';
import RecentStatsCard from '@/components/dashboard/RecentStatsCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { capitalize, getDayOfWeek } from '@/lib/utils';
import { DAYS_OF_WEEK } from '@/types';
import type { DayOfWeek } from '@/types';

export default function Dashboard() {
  const { exercises, getExercisesByDay, mounted: exMounted } = useExercises();
  const { logs, getRecentLogs, mounted: logsMounted } = useWorkoutLogs();
  const { stats, mounted: statsMounted } = useUserStats();

  const mounted = exMounted && logsMounted && statsMounted;

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-20 bg-gray-900/50 rounded-xl" />
        <div className="h-40 bg-gray-900/50 rounded-xl" />
      </div>
    );
  }

  const today = getDayOfWeek();
  const todayExercises = getExercisesByDay(today);
  const recentLogs = getRecentLogs(5);
  const isNewUser = exercises.length === 0 && logs.length === 0;

  if (isNewUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-6">🏋️</span>
        <h1 className="text-3xl font-bold text-gray-100 mb-3">Welcome to IronLog</h1>
        <p className="text-gray-500 max-w-md mb-8">
          Track your workouts, build strength with progressive overload, and watch your gains grow over time.
        </p>
        <Link href="/exercises">
          <Button size="lg">Add Your Exercises</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>

      {/* Week overview */}
      <div className="grid grid-cols-7 gap-2">
        {DAYS_OF_WEEK.map(day => {
          const count = getExercisesByDay(day).length;
          const isToday = day === today;
          return (
            <Link key={day} href={`/day/${day}`}>
              <div
                className={`rounded-lg p-2 text-center transition-all cursor-pointer ${
                  isToday
                    ? 'bg-indigo-500/20 border border-indigo-500/30 ring-1 ring-indigo-500/20'
                    : 'bg-gray-900/50 border border-gray-800/50 hover:border-gray-700/50'
                }`}
              >
                <p className={`text-xs font-medium ${isToday ? 'text-indigo-300' : 'text-gray-500'}`}>
                  {capitalize(day).slice(0, 3)}
                </p>
                <p className={`text-lg font-bold ${isToday ? 'text-indigo-200' : count > 0 ? 'text-gray-300' : 'text-gray-600'}`}>
                  {count}
                </p>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Today's card */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-medium text-gray-200">
              {todayExercises.length > 0
                ? `Today: ${todayExercises.map(e => e.name).join(', ')}`
                : 'Rest Day'}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {todayExercises.length > 0
                ? `${todayExercises.length} exercise${todayExercises.length !== 1 ? 's' : ''} planned`
                : 'No exercises scheduled for today.'}
            </p>
          </div>
          {todayExercises.length > 0 && (
            <Link href={`/day/${today}`}>
              <Button size="sm">Start Workout</Button>
            </Link>
          )}
        </div>
      </Card>

      {/* Stats grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <StreakCard stats={stats} />
        <Card>
          <p className="text-sm text-gray-500 mb-1">Total Workouts</p>
          <p className="text-4xl font-bold text-gray-100">{logs.length}</p>
          {stats.lastWorkoutDate && (
            <p className="text-xs text-gray-600 mt-1">
              Last: {new Date(stats.lastWorkoutDate).toLocaleDateString()}
            </p>
          )}
        </Card>
      </div>

      {/* Recent workouts */}
      <RecentStatsCard logs={recentLogs} exercises={exercises} />
    </div>
  );
}
