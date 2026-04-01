import type { DayOfWeek } from '@/types';

export function cn(...classes: (string | false | null | undefined)[]): string {
  return classes.filter(Boolean).join(' ');
}

export function formatDate(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
  });
}

export function getDayOfWeek(): DayOfWeek {
  const days: DayOfWeek[] = [
    'sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday',
  ];
  return days[new Date().getDay()];
}

export function generateId(): string {
  return crypto.randomUUID();
}

export function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

export function todayISO(): string {
  return new Date().toISOString().split('T')[0];
}
