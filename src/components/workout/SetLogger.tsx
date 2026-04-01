'use client';

import Input from '@/components/ui/Input';
import VolumeComparison from './VolumeComparison';
import { getSuggestion } from '@/lib/progressive-overload';
import type { Exercise, WorkoutSet } from '@/types';

interface SetLoggerProps {
  exercise: Exercise;
  sets: WorkoutSet[];
  lastSets: WorkoutSet[] | null;
  onChange: (sets: WorkoutSet[]) => void;
}

export default function SetLogger({ exercise, sets, lastSets, onChange }: SetLoggerProps) {
  const suggestion = getSuggestion(exercise, lastSets);

  const updateSet = (index: number, field: 'weight' | 'reps', value: number) => {
    const updated = sets.map((s, i) =>
      i === index ? { ...s, [field]: value } : s,
    );
    onChange(updated);
  };

  return (
    <div className="space-y-4">
      {/* Suggestion banner */}
      <div
        className={`px-4 py-3 rounded-lg text-sm ${
          suggestion.type === 'increase_weight'
            ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/20'
            : suggestion.type === 'increase_reps'
              ? 'bg-blue-500/10 text-blue-300 border border-blue-500/20'
              : 'bg-gray-800/50 text-gray-400 border border-gray-700/50'
        }`}
      >
        {suggestion.type === 'increase_weight' && '🔥 '}
        {suggestion.type === 'increase_reps' && '📈 '}
        {suggestion.message}
      </div>

      {/* Set rows */}
      <div className="space-y-2">
        <div className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 text-xs text-gray-500 px-1">
          <span>Set</span>
          <span>Weight (lbs)</span>
          <span>Reps</span>
          <span>Last time</span>
        </div>
        {sets.map((set, i) => (
          <div key={i} className="grid grid-cols-[40px_1fr_1fr_1fr] gap-2 items-center">
            <span className="text-sm font-medium text-gray-500 text-center">{i + 1}</span>
            <Input
              type="number"
              min={0}
              value={set.weight || ''}
              onChange={e => updateSet(i, 'weight', Number(e.target.value))}
              placeholder="0"
            />
            <Input
              type="number"
              min={0}
              value={set.reps || ''}
              onChange={e => updateSet(i, 'reps', Number(e.target.value))}
              placeholder="0"
            />
            <span className="text-xs text-gray-600 truncate">
              {lastSets && lastSets[i]
                ? `${lastSets[i].weight} × ${lastSets[i].reps}`
                : '—'}
            </span>
          </div>
        ))}
      </div>

      {/* Volume comparison */}
      <VolumeComparison currentSets={sets} previousSets={lastSets} />
    </div>
  );
}
