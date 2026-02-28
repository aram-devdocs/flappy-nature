import { safeJsonParse } from '@repo/types';
import { useCallback, useState } from 'react';

/** Persist and hydrate a value in localStorage, returning a stateful getter and setter. */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = localStorage.getItem(key);
      return item ? safeJsonParse<T>(item, initialValue) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = useCallback(
    (value: T) => {
      setStoredValue(value);
      try {
        localStorage.setItem(key, JSON.stringify(value));
      } catch {
        /* storage full or unavailable */
      }
    },
    [key],
  );

  return [storedValue, setValue];
}
