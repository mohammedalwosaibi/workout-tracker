'use client';

import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { capitalize } from '@/lib/utils';
import type { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExerciseCard({ exercise, onEdit, onDelete }: ExerciseCardProps) {
  const dayLabels = exercise.days.map(d => capitalize(d).slice(0, 3)).join(', ');

  return (
    <Card hover className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <h3 className="font-medium text-gray-200 truncate">{exercise.name}</h3>
        <p className="text-sm text-gray-500">
          {exercise.sets} sets &middot; {exercise.repRangeMin}–{exercise.repRangeMax} reps
          {dayLabels && <span className="ml-2 text-gray-600">&middot; {dayLabels}</span>}
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
        <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
      </div>
    </Card>
  );
}
