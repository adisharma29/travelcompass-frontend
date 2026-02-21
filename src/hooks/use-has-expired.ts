import { useEffect, useState } from "react";

/**
 * Returns true once the given ISO datetime has passed.
 * Sets a single timeout for the exact expiry moment — no polling.
 * Automatically resets if the datetime prop changes to a future value.
 */
export function useHasExpired(isoDatetime: string | null | undefined): boolean {
  // Track which datetime value we've marked as expired.
  // Deriving `expired` from this vs the current prop handles resets:
  // when isoDatetime changes, the comparison fails → expired = false.
  const [expiredFor, setExpiredFor] = useState<string | null>(() => {
    if (!isoDatetime) return null;
    // State initializer may use Date.now() (runs once, not during re-render)
    return new Date(isoDatetime).getTime() <= Date.now() ? isoDatetime : null;
  });

  const expired = !!isoDatetime && expiredFor === isoDatetime;

  useEffect(() => {
    if (!isoDatetime || expired) return;
    const ms = Math.max(0, new Date(isoDatetime).getTime() - Date.now());
    const timer = setTimeout(() => setExpiredFor(isoDatetime), ms);
    return () => clearTimeout(timer);
  }, [isoDatetime, expired]);

  return expired;
}
