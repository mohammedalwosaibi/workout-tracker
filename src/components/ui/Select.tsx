import { cn } from '@/lib/utils';
import type { SelectHTMLAttributes } from 'react';

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export default function Select({ label, options, className, id, ...props }: SelectProps) {
  return (
    <div className="space-y-1.5">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-gray-400">
          {label}
        </label>
      )}
      <select
        id={id}
        className={cn(
          'w-full px-3 py-2 bg-gray-800/50 border border-gray-700/50 rounded-lg',
          'text-gray-100',
          'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50',
          'transition-all appearance-none cursor-pointer',
          className,
        )}
        {...props}
      >
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}
