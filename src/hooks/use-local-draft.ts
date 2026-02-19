"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 1500;

function checkDraft(storageKey: string): boolean {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      return !!(parsed && parsed.data);
    }
  } catch {
    // Corrupted — ignore
  }
  return false;
}

/**
 * Hook for auto-saving form data to localStorage with debounce.
 *
 * Key format: `draft:${key}` (caller provides the key, e.g. `dept:hotel-slug:dept-slug`)
 *
 * On mount / key change: checks for an existing draft. If found, exposes `hasDraft = true`
 * so the editor can offer to restore it.
 *
 * On change: auto-saves to localStorage after 1.5s debounce.
 * On successful server save: caller calls `clearDraft()`.
 */
export function useLocalDraft<T>(key: string, initialData: T) {
  const storageKey = `draft:${key}`;
  const [data, setData] = useState<T>(initialData);
  const [hasDraft, setHasDraft] = useState(() => checkDraft(storageKey));
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStorageKeyRef = useRef<string | null>(null);

  // Reset all state when key changes (React-endorsed "set state during render" pattern)
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    setHasDraft(checkDraft(`draft:${key}`));
    setData(initialData);
    setLastSaved(null);
  }

  // Auto-save on data changes (skip mount + key resets via ref tracking)
  useEffect(() => {
    // On mount (null) or key change: record the key and skip this save
    if (prevStorageKeyRef.current !== storageKey) {
      prevStorageKeyRef.current = storageKey;
      return;
    }

    if (timerRef.current) clearTimeout(timerRef.current);

    timerRef.current = setTimeout(() => {
      try {
        const payload = JSON.stringify({
          data,
          savedAt: new Date().toISOString(),
        });
        localStorage.setItem(storageKey, payload);
        setLastSaved(new Date());
      } catch {
        // localStorage full or unavailable — silently ignore
      }
    }, DEBOUNCE_MS);

    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [data, storageKey]);

  const restoreDraft = useCallback(() => {
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed && parsed.data) {
          setData(parsed.data);
          setHasDraft(false);
          if (parsed.savedAt) {
            setLastSaved(new Date(parsed.savedAt));
          }
        }
      }
    } catch {
      // Corrupted — discard
      localStorage.removeItem(storageKey);
      setHasDraft(false);
    }
  }, [storageKey]);

  const discardDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    setHasDraft(false);
    setLastSaved(null);
  }, [storageKey]);

  const clearDraft = useCallback(() => {
    localStorage.removeItem(storageKey);
    setHasDraft(false);
    setLastSaved(null);
  }, [storageKey]);

  return {
    data,
    setData,
    hasDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
    lastSaved,
  };
}
