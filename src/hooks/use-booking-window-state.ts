import { useEffect, useMemo, useState } from "react";
import type { HotelEventPublic } from "@/lib/concierge-types";

export type BookingWindowState = "bookable" | "not_yet_open" | "closed" | "no_occurrence";

/**
 * Returns the current booking window state and auto-updates at boundary transitions.
 *
 * When window timestamps (opens_at / closes_at) are available, state is derived
 * from them directly so that long-lived pages transition correctly even though
 * `event.is_bookable` is a stale snapshot from fetch time. When no timestamps
 * exist, falls back to `event.is_bookable`.
 *
 * Sets timers to transition:
 *   - At booking_opens_at: "not_yet_open" → "bookable"
 *   - At booking_closes_at: "bookable" → "closed"
 *
 * The CTA state derived from this hook is advisory only — the server
 * re-validates at request submission time.
 */
export function useBookingWindowState(event: HotelEventPublic): {
  state: BookingWindowState;
  opensAt: Date | null;
  closesAt: Date | null;
} {
  const [now, setNow] = useState(() => Date.now());

  const opensAt = useMemo(
    () => (event.booking_opens_at ? new Date(event.booking_opens_at) : null),
    [event.booking_opens_at],
  );
  const closesAt = useMemo(
    () => (event.booking_closes_at ? new Date(event.booking_closes_at) : null),
    [event.booking_closes_at],
  );

  const state = useMemo<BookingWindowState>(() => {
    // When window timestamps exist, derive state from them directly.
    // This handles long-lived pages where the server snapshot (is_bookable)
    // was computed at fetch time and becomes stale as boundaries pass.
    if (opensAt && now < opensAt.getTime()) return "not_yet_open";
    if (closesAt && now >= closesAt.getTime()) return "closed";
    // Within window: past opens (or no opens restriction) and before closes
    if (closesAt && now < closesAt.getTime()) return "bookable";

    // No window timestamps — fall back to server snapshot
    if (event.is_bookable) return "bookable";
    return "no_occurrence";
  }, [now, opensAt, closesAt, event.is_bookable]);

  // Set timer for next transition
  useEffect(() => {
    let ms: number | null = null;
    if (state === "not_yet_open" && opensAt) {
      ms = opensAt.getTime() - Date.now();
    } else if (state === "bookable" && closesAt) {
      ms = closesAt.getTime() - Date.now();
    }
    if (ms === null || ms <= 0) return;
    // Cap at 1 hour to avoid overflow and stale timers
    const capped = Math.min(ms, 3_600_000);
    const timer = setTimeout(() => setNow(Date.now()), capped);
    return () => clearTimeout(timer);
  }, [state, opensAt, closesAt]);

  return { state, opensAt, closesAt };
}
