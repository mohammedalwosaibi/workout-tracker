'use client';

import { useState } from 'react';
import Card from '@/components/ui/Card';
import Badge from '@/components/ui/Badge';
import Button from '@/components/ui/Button';
import MuscleGroupSelector from './MuscleGroupSelector';
import { capitalize } from '@/lib/utils';
import type { DayOfWeek, MuscleGroup } from '@/types';

interface DayCardProps {
  day: DayOfWeek;
  muscles: MuscleGroup[];
  isToday: boolean;
  onUpdate: (muscles: MuscleGroup[]) => void;
}

export default function DayCard({ day, muscles, isToday, onUpdate }: DayCardProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<MuscleGroup[]>(muscles);

  const handleSave = () => {
    onUpdate(draft);
    setEditing(false);
  };

  const handleCancel = () => {
    setDraft(muscles);
    setEditing(false);
  };

  return (
    <Card className={isToday ? 'ring-1 ring-indigo-500/50' : ''}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-200">{capitalize(day)}</h3>
          {isToday && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 font-medium">
              Today
            </span>
          )}
        </div>
        {!editing && (
          <Button variant="ghost" size="sm" onClick={() => { setDraft(muscles); setEditing(true); }}>
            Edit
          </Button>
        )}
      </div>

      {editing ? (
        <div className="space-y-3">
          <MuscleGroupSelector selected={draft} onChange={setDraft} />
          <div className="flex gap-2">
            <Button size="sm" onClick={handleSave}>Save</Button>
            <Button variant="ghost" size="sm" onClick={handleCancel}>Cancel</Button>
            {draft.length > 0 && (
              <Button variant="ghost" size="sm" onClick={() => setDraft([])}>Clear</Button>
            )}
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-1.5">
          {muscles.length > 0 ? (
            muscles.map(m => <Badge key={m} muscle={m} />)
          ) : (
            <span className="text-sm text-gray-600">Rest day</span>
          )}
        </div>
      )}
    </Card>
  );
}
