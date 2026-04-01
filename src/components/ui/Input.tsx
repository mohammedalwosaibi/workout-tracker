import { cn } from '@/lib/utils';
import type { InputHTMLAttributes } from 'react';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
}

export default function Input({ label, className, id, ...props }: InputProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-400">
          {label}
        </label>
      )}
      <input
        id={id}
        className={cn(
          'w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg',
          'text-gray-100 placeholder-gray-500',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
          'transition-all',
          className,
        )}
        {...props}
      />
    </div>
  );
}
