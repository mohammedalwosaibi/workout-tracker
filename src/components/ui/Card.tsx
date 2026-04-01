import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
}

export default function Card({ className, hover, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'bg-gray-900/50 rounded-xl border border-gray-800/50 p-5 backdrop-blur-sm',
        hover && 'transition-all hover:border-gray-700/50 hover:bg-gray-900/70',
        className,
      )}
      {...props}
    />
  );
}
