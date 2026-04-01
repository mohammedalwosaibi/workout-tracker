'use client';

import { useState } from 'react';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { capitalize } from '@/lib/utils';
import { DAYS_OF_WEEK } from '@/types';
import type { Exercise, DayOfWeek } from '@/types';

interface ExerciseFormProps {
  initial?: Exercise;
  onSubmit: (data: Omit<Exercise, 'id'>) => void;
  onCancel: () => void;
}

export default function ExerciseForm({ initial, onSubmit, onCancel }: ExerciseFormProps) {
  const [name, setName] = useState(initial?.name || '');
  const [days, setDays] = useState<DayOfWeek[]>(initial?.days || []);
  const [repRangeMin, setRepRangeMin] = useState(initial?.repRangeMin || 8);
  const [repRangeMax, setRepRangeMax] = useState(initial?.repRangeMax || 12);
  const [sets, setSets] = useState(initial?.sets || 3);

  const toggleDay = (day: DayOfWeek) => {
    setDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day],
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSubmit({
      name: name.trim(),
      days,
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

      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">Days</label>
        <div className="flex flex-wrap gap-2">
          {DAYS_OF_WEEK.map(day => (
            <button
              key={day}
              type="button"
              onClick={() => toggleDay(day)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                days.includes(day)
                  ? 'bg-indigo-500/20 text-indigo-300 border border-indigo-500/30'
                  : 'bg-gray-800/50 text-gray-500 border border-gray-700/50 hover:text-gray-300'
              }`}
            >
              {capitalize(day).slice(0, 3)}
            </button>
          ))}
        </div>
      </div>

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
