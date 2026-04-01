'use client';

import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem } from '@/lib/storage';

export function useLocalStorage<T>(
  key: string,
  initialValue: T,
): [T, (value: T | ((prev: T) => T)) => void, boolean] {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setStoredValue(getItem(key, initialValue));
    setMounted(true);
  }, [key]); // eslint-disable-line react-hooks/exhaustive-deps

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue(prev => {
        const nextValue = value instanceof Function ? value(prev) : value;
        setItem(key, nextValue);
        return nextValue;
      });
    },
    [key],
  );

  return [storedValue, setValue, mounted];
}
