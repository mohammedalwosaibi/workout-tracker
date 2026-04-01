import { cn } from '@/lib/utils';
import { capitalize } from '@/lib/utils';
import { MUSCLE_GROUP_COLORS } from '@/types';
import type { MuscleGroup } from '@/types';

interface BadgeProps {
  muscle: MuscleGroup;
  size?: 'sm' | 'md';
  className?: string;
}

export default function Badge({ muscle, size = 'sm', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        size === 'sm' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-sm',
        MUSCLE_GROUP_COLORS[muscle],
        className,
      )}
    >
      {capitalize(muscle)}
    </span>
  );
}
