'use client';

import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import type { Exercise } from '@/types';

interface ExerciseCardProps {
  exercise: Exercise;
  onEdit: () => void;
  onDelete: () => void;
}

export default function ExerciseCard({ exercise, onEdit, onDelete }: ExerciseCardProps) {
  return (
    <Card hover className="flex items-center justify-between gap-4">
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-medium text-gray-200 truncate">{exercise.name}</h3>
          <Badge muscle={exercise.muscleGroup} />
        </div>
        <p className="text-sm text-gray-500">
          {exercise.sets} sets &middot; {exercise.repRangeMin}–{exercise.repRangeMax} reps
        </p>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <Button variant="ghost" size="sm" onClick={onEdit}>Edit</Button>
        <Button variant="danger" size="sm" onClick={onDelete}>Delete</Button>
      </div>
    </Card>
  );
}
