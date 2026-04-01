'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import { capitalize } from '@/lib/utils';
import { MUSCLE_GROUPS } from '@/types';
import type { Exercise, MuscleGroup } from '@/types';

interface ExerciseFormProps {
  initial?: Exercise;
  onSubmit: (data: Omit<Exercise, 'id'>) => void;
  onCancel: () => void;
}

export default function ExerciseForm({ initial, onSubmit, onCancel }: ExerciseFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [muscleGroup, setMuscleGroup] = useState<MuscleGroup>(initial?.muscleGroup || 'chest');
  const [repRangeMin, setRepRangeMin] = useState(initial?.repRangeMin || 8);
  const [repRangeMax, setRepRangeMax] = useState(initial?.repRangeMax || 12);
  const [sets, setSets] = useState(initial?.sets || 3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      muscleGroup,
      repRangeMin: Math.max(1, repRangeMin),
      repRangeMax: Math.max(repRangeMin, repRangeMax),
      sets: Math.max(1, sets),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        id="exercise-name"
        label="Exercise Name"
        placeholder="e.g., Barbell Bicep Curl"
        value={name}
        onChange={e => setName(e.target.value)}
        required
      />

      <Select
        id="muscle-group"
        label="Muscle Group"
        value={muscleGroup}
        onChange={e => setMuscleGroup(e.target.value as MuscleGroup)}
        options={MUSCLE_GROUPS.map(m => ({ value: m, label: capitalize(m) }))}
      />

      <div className="grid grid-cols-3 gap-3">
        <Input
          id="rep-min"
          label="Min Reps"
          type="number"
          min={1}
          value={repRangeMin}
          onChange={e => setRepRangeMin(Number(e.target.value))}
        />
        <Input
          id="rep-max"
          label="Max Reps"
          type="number"
          min={1}
          value={repRangeMax}
          onChange={e => setRepRangeMax(Number(e.target.value))}
        />
        <Input
          id="sets"
          label="Sets"
          type="number"
          min={1}
          value={sets}
          onChange={e => setSets(Number(e.target.value))}
        />
      </div>

      <div className="flex gap-2 pt-2">
        <Button type="submit">{initial ? 'Update' : 'Add Exercise'}</Button>
        <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
      </div>
    </form>
  );
}
