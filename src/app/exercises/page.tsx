'use client';

import { useState } from 'react';
import { useExercises } from '@/hooks/useExercises';
import ExerciseForm from '@/components/exercises/ExerciseForm';
import ExerciseCard from '@/components/exercises/ExerciseCard';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import EmptyState from '@/components/ui/EmptyState';
import Badge from '@/components/ui/Badge';
import { capitalize } from '@/lib/utils';
import { MUSCLE_GROUPS } from '@/types';
import type { Exercise, MuscleGroup } from '@/types';

export default function ExercisesPage() {
  const { exercises, addExercise, updateExercise, deleteExercise, mounted } = useExercises();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [filterMuscle, setFilterMuscle] = useState<MuscleGroup | 'all'>('all');

  const filtered = filterMuscle === 'all'
    ? exercises
    : exercises.filter(e => e.muscleGroup === filterMuscle);

  // Group by muscle
  const grouped = filtered.reduce<Record<string, Exercise[]>>((acc, ex) => {
    (acc[ex.muscleGroup] ||= []).push(ex);
    return acc;
  }, {});

  const editingExercise = editingId ? exercises.find(e => e.id === editingId) : undefined;

  if (!mounted) {
    return <div className="animate-pulse space-y-4">{Array.from({ length: 3 }, (_, i) => (
      <div key={i} className="h-20 bg-gray-900/50 rounded-xl" />
    ))}</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-100">Exercises</h1>
          <p className="text-sm text-gray-500 mt-1">{exercises.length} exercise{exercises.length !== 1 ? 's' : ''}</p>
        </div>
        <Button onClick={() => { setShowForm(true); setEditingId(null); }}>
          + Add Exercise
        </Button>
      </div>

      {/* Filter chips */}
      {exercises.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setFilterMuscle('all')}
            className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
              filterMuscle === 'all'
                ? 'border-indigo-500/50 text-indigo-300 bg-indigo-500/20'
                : 'border-gray-700/50 text-gray-500 hover:text-gray-300'
            }`}
          >
            All
          </button>
          {MUSCLE_GROUPS.filter(m => exercises.some(e => e.muscleGroup === m)).map(m => (
            <button
              key={m}
              onClick={() => setFilterMuscle(m)}
              className={`px-3 py-1.5 rounded-full text-sm font-medium border transition-all cursor-pointer ${
                filterMuscle === m
                  ? 'border-indigo-500/50 text-indigo-300 bg-indigo-500/20'
                  : 'border-gray-700/50 text-gray-500 hover:text-gray-300'
              }`}
            >
              {capitalize(m)}
            </button>
          ))}
        </div>
      )}

      {/* Add/Edit form */}
      {(showForm || editingId) && (
        <Card>
          <h2 className="text-lg font-semibold text-gray-200 mb-4">
            {editingId ? 'Edit Exercise' : 'New Exercise'}
          </h2>
          <ExerciseForm
            initial={editingExercise}
            onSubmit={(data) => {
              if (editingId) {
                updateExercise(editingId, data);
                setEditingId(null);
              } else {
                addExercise(data);
                setShowForm(false);
              }
            }}
            onCancel={() => { setShowForm(false); setEditingId(null); }}
          />
        </Card>
      )}

      {/* Exercise list */}
      {exercises.length === 0 && !showForm ? (
        <EmptyState
          icon="🏋️"
          title="No exercises yet"
          description="Add your first exercise to start tracking your workouts."
          actionLabel="Add Exercise"
          onAction={() => setShowForm(true)}
        />
      ) : (
        Object.entries(grouped).map(([muscle, exs]) => (
          <div key={muscle} className="space-y-2">
            <div className="flex items-center gap-2 mb-2">
              <Badge muscle={muscle as MuscleGroup} size="md" />
              <span className="text-sm text-gray-500">{exs.length}</span>
            </div>
            {exs.map(ex => (
              <ExerciseCard
                key={ex.id}
                exercise={ex}
                onEdit={() => { setEditingId(ex.id); setShowForm(false); }}
                onDelete={() => deleteExercise(ex.id)}
              />
            ))}
          </div>
        ))
      )}
    </div>
  );
}
