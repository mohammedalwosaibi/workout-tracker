'use client';

import { calculateVolume, volumeChangePercent } from '@/lib/progressive-overload';
import type { WorkoutSet } from '@/types';

interface VolumeComparisonProps {
  currentSets: WorkoutSet[];
  previousSets: WorkoutSet[] | null;
}

export default function VolumeComparison({ currentSets, previousSets }: VolumeComparisonProps) {
  const currentVolume = calculateVolume(currentSets);

  if (!previousSets) {
    return (
      <div className="text-sm text-gray-500">
        Volume: <span className="text-gray-300 font-medium">{currentVolume.toLocaleString()} lbs</span>
      </div>
    );
  }

  const previousVolume = calculateVolume(previousSets);
  const change = volumeChangePercent(currentSets, previousSets);
  const isUp = change > 0;
  const isDown = change < 0;

  return (
    <div className="flex items-center gap-3 text-sm">
      <span className="text-gray-500">
        Volume: <span className="text-gray-300 font-medium">{currentVolume.toLocaleString()} lbs</span>
      </span>
      <span className="text-gray-600">vs</span>
      <span className="text-gray-500">{previousVolume.toLocaleString()}</span>
      <span
        className={`font-semibold px-2 py-0.5 rounded-full text-xs ${
          isUp
            ? 'bg-emerald-500/20 text-emerald-400'
            : isDown
              ? 'bg-red-500/20 text-red-400'
              : 'bg-gray-700/50 text-gray-400'
        }`}
      >
        {isUp ? '↑' : isDown ? '↓' : '='} {Math.abs(change).toFixed(1)}%
      </span>
    </div>
  );
}
