'use client';

import { calculateVolume } from '@/lib/progressive-overload';
import { formatDate } from '@/lib/utils';
import type { WorkoutSet } from '@/types';

interface VolumeTrendProps {
  history: { date: string; sets: WorkoutSet[] }[];
}

export default function VolumeTrend({ history }: VolumeTrendProps) {
  if (history.length === 0) return null;

  const volumes = history.map(h => ({
    date: h.date,
    volume: calculateVolume(h.sets),
  }));

  const maxVolume = Math.max(...volumes.map(v => v.volume));

  return (
    <div className="space-y-2">
      <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Volume Trend</h4>
      <div className="space-y-1.5">
        {volumes.map((v, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-gray-600 w-20 shrink-0">{formatDate(v.date)}</span>
            <div className="flex-1 bg-gray-800/30 rounded-full h-5 overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all flex items-center justify-end pr-2"
                style={{ width: `${maxVolume > 0 ? (v.volume / maxVolume) * 100 : 0}%`, minWidth: '2rem' }}
              >
                <span className="text-[10px] font-medium text-white">{v.volume}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
