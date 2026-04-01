'use client';

import { cn, capitalize } from '@/lib/utils';
import { MUSCLE_GROUPS, MUSCLE_GROUP_COLORS } from '@/types';
import type { MuscleGroup } from '@/types';

interface MuscleGroupSelectorProps {
  selected: MuscleGroup[];
  onChange: (muscles: MuscleGroup[]) => void;
}

export default function MuscleGroupSelector({ selected, onChange }: MuscleGroupSelectorProps) {
  const toggle = (muscle: MuscleGroup) => {
    if (selected.includes(muscle)) {
      onChange(selected.filter(m => m !== muscle));
    } else {
      onChange([...selected, muscle]);
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      {MUSCLE_GROUPS.map(muscle => (
        <button
          key={muscle}
          type="button"
          onClick={() => toggle(muscle)}
          className={cn(
            'px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer',
            selected.includes(muscle)
              ? MUSCLE_GROUP_COLORS[muscle]
              : 'border-gray-700/50 text-gray-500 hover:text-gray-300 hover:border-gray-600',
          )}
        >
          {capitalize(muscle)}
        </button>
      ))}
    </div>
  );
}
