'use client';

import Link from 'next/link';
import { useTrainingPlan } from '@/hooks/useTrainingPlan';
import { useExercises } from '@/hooks/useExercises';
import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import { useUserStats } from '@/hooks/useUserStats';
import TodayWorkoutCard from '@/components/dashboard/TodayWorkoutCard';
import StreakCard from '@/components/dashboard/StreakCard';
import RecentStatsCard from '@/components/dashboard/RecentStatsCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';

export default function Dashboard() {
  const { getTodaysMuscles, hasPlan, mounted: planMounted } = useTrainingPlan();
  const { exercises, mounted: exMounted } = useExercises();
  const { logs, getRecentLogs, getLastLogForExercise, mounted: logsMounted } = useWorkoutLogs();
  const { stats, mounted: statsMounted } = useUserStats();

  const mounted = planMounted && exMounted && logsMounted && statsMounted;

  if (!mounted) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-40 bg-gray-900/50 rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="h-32 bg-gray-900/50 rounded-xl" />
          <div className="h-32 bg-gray-900/50 rounded-xl" />
        </div>
      </div>
    );
  }

  const todaysMuscles = getTodaysMuscles();
  const recentLogs = getRecentLogs(5);
  const isNewUser = exercises.length === 0 && recentLogs.length === 0;

  if (isNewUser) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <span className="text-6xl mb-6">🏋️</span>
        <h1 className="text-3xl font-bold text-gray-100 mb-3">Welcome to IronLog</h1>
        <p className="text-gray-500 max-w-md mb-8">
          Track your workouts, build strength with progressive overload, and watch your gains grow over time.
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/plan">
            <Button size="lg" variant="secondary">Set Up Training Plan</Button>
          </Link>
          <Link href="/exercises">
            <Button size="lg">Add Your Exercises</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-100">Dashboard</h1>

      {/* Today's workout */}
      {hasPlan() && todaysMuscles.length > 0 ? (
        <TodayWorkoutCard
          muscles={todaysMuscles}
          exercises={exercises}
          getLastLog={getLastLogForExercise}
        />
      ) : (
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-200">
                {hasPlan() ? 'Rest Day' : 'No training plan set'}
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                {hasPlan()
                  ? 'Take it easy today. Recovery is part of the process.'
                  : 'Set up a plan to see daily workout suggestions.'}
              </p>
            </div>
            <div className="flex gap-2 shrink-0">
              {!hasPlan() && (
                <Link href="/plan">
                  <Button variant="secondary" size="sm">Set Up Plan</Button>
                </Link>
              )}
              <Link href="/workout">
                <Button size="sm">Quick Workout</Button>
              </Link>
            </div>
          </div>
        </Card>
      )}

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

      {/* Quick actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Link href="/workout">
          <Card hover className="text-center cursor-pointer">
            <span className="text-2xl">💪</span>
            <p className="text-sm text-gray-400 mt-1">Log Workout</p>
          </Card>
        </Link>
        <Link href="/exercises">
          <Card hover className="text-center cursor-pointer">
            <span className="text-2xl">📋</span>
            <p className="text-sm text-gray-400 mt-1">Exercises</p>
          </Card>
        </Link>
        <Link href="/plan">
          <Card hover className="text-center cursor-pointer">
            <span className="text-2xl">📅</span>
            <p className="text-sm text-gray-400 mt-1">Edit Plan</p>
          </Card>
        </Link>
        <Link href="/history">
          <Card hover className="text-center cursor-pointer">
            <span className="text-2xl">📊</span>
            <p className="text-sm text-gray-400 mt-1">History</p>
          </Card>
        </Link>
      </div>
    </div>
  );
}
