import { STORAGE_KEYS, safeJsonParse } from '@repo/types';
import { useCallback, useEffect, useState } from 'react';

/** Return value of the useNickname hook. */
export interface UseNicknameReturn {
  /** Current nickname, or null if unset. */
  nickname: string | null;
  /** Persist a new nickname to localStorage. */
  setNickname: (nickname: string) => void;
  /** Remove the stored nickname. */
  clearNickname: () => void;
}

/** Manages a player nickname persisted in localStorage and synced across tabs. */
export function useNickname(): UseNicknameReturn {
  const [nickname, setNicknameState] = useState<string | null>(() => {
    try {
      const item = localStorage.getItem(STORAGE_KEYS.nickname);
      return item ? safeJsonParse<string | null>(item, null) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEYS.nickname) return;
      setNicknameState(e.newValue ? safeJsonParse<string | null>(e.newValue, null) : null);
    };
    window.addEventListener('storage', handler);
    return () => window.removeEventListener('storage', handler);
  }, []);

  const setNickname = useCallback((value: string) => {
    setNicknameState(value);
    try {
      localStorage.setItem(STORAGE_KEYS.nickname, JSON.stringify(value));
    } catch {
      /* storage full or unavailable */
    }
  }, []);

  const clearNickname = useCallback(() => {
    setNicknameState(null);
    try {
      localStorage.removeItem(STORAGE_KEYS.nickname);
    } catch {
      /* storage unavailable */
    }
  }, []);

  return { nickname, setNickname, clearNickname };
}
