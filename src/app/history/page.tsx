'use client';

import { useWorkoutLogs } from '@/hooks/useWorkoutLogs';
import { useExercises } from '@/hooks/useExercises';
import WorkoutLogCard from '@/components/history/WorkoutLogCard';
import EmptyState from '@/components/ui/EmptyState';

export default function HistoryPage() {
  const { logs, mounted: logsMounted } = useWorkoutLogs();
  const { exercises, mounted: exMounted } = useExercises();

  if (!logsMounted || !exMounted) {
    return <div className="animate-pulse space-y-4">
      {Array.from({ length: 3 }, (_, i) => (
        <div key={i} className="h-24 bg-gray-900/50 rounded-xl" />
      ))}
    </div>;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-100">Workout History</h1>
        <p className="text-sm text-gray-500 mt-1">
          {logs.length} workout{logs.length !== 1 ? 's' : ''} logged
        </p>
      </div>

      {logs.length === 0 ? (
        <EmptyState
          icon="📊"
          title="No workouts logged yet"
          description="Complete your first workout to see it here."
          actionLabel="Start Workout"
          actionHref="/"
        />
      ) : (
        <div className="space-y-3">
          {logs.map((log, i) => (
            <WorkoutLogCard
              key={log.id}
              log={log}
              exercises={exercises}
              prevLog={logs[i + 1]}
            />
          ))}
        </div>
      )}
    </div>
  );
}
