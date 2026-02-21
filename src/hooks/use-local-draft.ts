"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const DEBOUNCE_MS = 1500;

/** Check whether a stored draft exists AND differs from the baseline data. */
function checkDraft<T>(storageKey: string, baseline: T): boolean {
  try {
    const stored = localStorage.getItem(storageKey);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (parsed && parsed.data) {
        // Only report a draft if it meaningfully differs from baseline
        return JSON.stringify(parsed.data) !== JSON.stringify(baseline);
      }
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
 * On mount / key change: checks for an existing draft. If found AND it differs from the
 * baseline, exposes `hasDraft = true` so the editor can offer to restore it.
 *
 * On change: auto-saves to localStorage after 1.5s debounce (only if data differs from
 * the baseline — saves of unchanged data are suppressed).
 * On successful server save: caller calls `clearDraft()`.
 *
 * For edit forms, call `setBaseline(serverData)` after loading server data so that the
 * loaded state is treated as "clean" (not a draft).
 */
export function useLocalDraft<T>(key: string, initialData: T) {
  const storageKey = `draft:${key}`;
  const baselineRef = useRef(initialData);
  const [data, setData] = useState<T>(initialData);
  const [hasDraft, setHasDraft] = useState(() =>
    checkDraft(storageKey, initialData),
  );
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const prevStorageKeyRef = useRef<string | null>(null);

  // Reset all state when key changes (React-endorsed "set state during render" pattern)
  const [prevKey, setPrevKey] = useState(key);
  if (key !== prevKey) {
    setPrevKey(key);
    setHasDraft(checkDraft(`draft:${key}`, initialData));
    setData(initialData);
    setLastSaved(null);
  }

  // Keep baseline ref in sync on key change (can't write refs during render)
  // Auto-save effect is already skipped on key change via prevStorageKeyRef guard
  useEffect(() => {
    baselineRef.current = initialData;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

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
        // Don't save if data matches baseline (no meaningful edits)
        if (
          JSON.stringify(data) === JSON.stringify(baselineRef.current)
        ) {
          // Clean up any stale draft from a previous visit
          localStorage.removeItem(storageKey);
          setLastSaved(null);
          return;
        }
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

  /**
   * Update the baseline (clean state). Clears any stored draft that matches it.
   * Returns `true` if a false-positive draft was cleared — callers should use this
   * to hydrate the form even when `hasDraft` was true in the current render.
   */
  const setBaseline = useCallback(
    (baselineData: T): boolean => {
      baselineRef.current = baselineData;
      try {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (
            parsed?.data &&
            JSON.stringify(parsed.data) === JSON.stringify(baselineData)
          ) {
            // Stored draft matches new baseline — not a real draft
            localStorage.removeItem(storageKey);
            setHasDraft(false);
            return true;
          }
        }
      } catch {
        // ignore
      }
      return false;
    },
    [storageKey],
  );

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
    setBaseline,
    lastSaved,
  };
}
