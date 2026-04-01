'use client';

import { useTrainingPlan } from '@/hooks/useTrainingPlan';
import DayCard from '@/components/plan/DayCard';
import Button from '@/components/ui/Button';
import { getDayOfWeek } from '@/lib/utils';
import { DAYS_OF_WEEK } from '@/types';
import type { DayOfWeek, MuscleGroup } from '@/types';

export default function PlanPage() {
  const { plan, setPlan, hasPlan, mounted } = useTrainingPlan();
  const today = getDayOfWeek();

  const updateDay = (day: DayOfWeek, muscles: MuscleGroup[]) => {
    setPlan(prev => ({ ...prev, [day]: muscles }));
  };

  const clearPlan = () => {
    setPlan({});
  };

  if (!mounted) {
    return <div className="animate-pulse space-y-4">{Array.from({ length: 7 }, (_, i) => (
      <div key={i} className="h-24 bg-gray-900/50 rounded-xl" />
    ))}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Training Plan</h1>
          <p className="text-sm text-gray-500 mt-1">
            Assign muscle groups to each day of the week
          </p>
        </div>
        {hasPlan() && (
          <Button variant="danger" size="sm" onClick={clearPlan}>
            Reset Plan
          </Button>
        )}
      </div>

      <div className="grid gap-3">
        {DAYS_OF_WEEK.map(day => (
          <DayCard
            key={day}
            day={day}
            muscles={plan[day] || []}
            isToday={day === today}
            onUpdate={(muscles) => updateDay(day, muscles)}
          />
        ))}
      </div>
    </div>
  );
}
