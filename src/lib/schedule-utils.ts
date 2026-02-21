import type { DepartmentSchedule } from "./concierge-types";

/** Day names as returned by Intl.DateTimeFormat weekday "long" in English. */
const WEEKDAY_KEYS = [
  "sunday",
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
] as const;

/**
 * Get the current time in a timezone as { hours, minutes, dayOfWeek }.
 */
function nowInTimezone(timezone: string): {
  hours: number;
  minutes: number;
  dayOfWeek: string;
} {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "numeric",
    minute: "numeric",
    weekday: "long",
    hour12: false,
  });
  const parts = formatter.formatToParts(now);
  const hours = parseInt(parts.find((p) => p.type === "hour")?.value ?? "0", 10);
  const minutes = parseInt(parts.find((p) => p.type === "minute")?.value ?? "0", 10);
  const weekday = parts.find((p) => p.type === "weekday")?.value?.toLowerCase() ?? "monday";
  return { hours, minutes, dayOfWeek: weekday };
}

/**
 * Parse a time string like "09:00" into minutes since midnight.
 */
function parseTimeToMinutes(time: string): number {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Get the open/close slots for a given day from a schedule.
 * Checks overrides first, then falls back to default slots.
 */
export function getSlotsForDay(
  schedule: DepartmentSchedule,
  dayOfWeek: string,
): [string, string][] {
  // Check overrides
  if (schedule.overrides && schedule.overrides[dayOfWeek]) {
    return schedule.overrides[dayOfWeek];
  }
  // Fall back to default
  return schedule.default ?? [];
}

export interface DeptStatusResult {
  label: string;
  isOpen: boolean;
}

/**
 * Get the previous day's name from WEEKDAY_KEYS.
 */
function getYesterdayName(dayOfWeek: string): string {
  const idx = WEEKDAY_KEYS.indexOf(dayOfWeek as (typeof WEEKDAY_KEYS)[number]);
  return WEEKDAY_KEYS[(idx + 6) % 7];
}

/**
 * Get the current open/closed status of a department based on its schedule.
 * Returns a human-readable label and boolean.
 *
 * Handles overnight windows (e.g. ["22:00", "02:00"]) that span past midnight,
 * matching the backend's is_department_after_hours() behavior.
 */
export function getDeptStatus(schedule: DepartmentSchedule): DeptStatusResult {
  if (!schedule || (!schedule.default?.length && !schedule.overrides)) {
    return { label: "Hours not set", isOpen: false };
  }

  const tz = schedule.timezone || "UTC";
  const { hours, minutes, dayOfWeek } = nowInTimezone(tz);
  const currentMinutes = hours * 60 + minutes;
  const todaySlots = getSlotsForDay(schedule, dayOfWeek);

  // 1. Check today's windows (handles same-day and overnight start)
  for (const [open, close] of todaySlots) {
    const openMin = parseTimeToMinutes(open);
    const closeMin = parseTimeToMinutes(close);

    if (openMin <= closeMin) {
      // Same-day window, e.g. ["09:00", "17:00"]
      if (currentMinutes >= openMin && currentMinutes <= closeMin) {
        return { label: `Open · Closes ${formatTime(close)}`, isOpen: true };
      }
    } else {
      // Overnight window, e.g. ["22:00", "02:00"]
      // Before-midnight portion: open from openMin onward
      if (currentMinutes >= openMin) {
        return { label: `Open · Closes ${formatTime(close)}`, isOpen: true };
      }
    }
  }

  // 2. Check yesterday's overnight windows that extend past midnight
  const yesterdaySlots = getSlotsForDay(schedule, getYesterdayName(dayOfWeek));
  for (const [open, close] of yesterdaySlots) {
    const openMin = parseTimeToMinutes(open);
    const closeMin = parseTimeToMinutes(close);

    if (openMin > closeMin && currentMinutes <= closeMin) {
      // After-midnight portion of yesterday's overnight window
      return { label: `Open · Closes ${formatTime(close)}`, isOpen: true };
    }
  }

  // 3. Not open — find next opening today
  for (const [open] of todaySlots) {
    const openMin = parseTimeToMinutes(open);
    if (currentMinutes < openMin) {
      return { label: `Opens ${formatTime(open)}`, isOpen: false };
    }
  }

  // Past all slots for today
  if (!todaySlots.length) {
    return { label: "Closed today", isOpen: false };
  }
  return { label: "Closed today", isOpen: false };
}

/**
 * Check whether the department is currently outside its operating hours.
 */
export function isAfterHours(schedule: DepartmentSchedule): boolean {
  return !getDeptStatus(schedule).isOpen;
}

/**
 * Format a time range like ["09:00", "22:00"] as "9:00 AM - 10:00 PM".
 */
export function formatScheduleRange(slot: [string, string]): string {
  return `${formatTime(slot[0])} - ${formatTime(slot[1])}`;
}

/**
 * Get today's schedule ranges for display. Returns formatted strings or "Closed".
 */
export function getTodaySchedule(schedule: DepartmentSchedule): string {
  if (!schedule) return "Hours not set";

  const tz = schedule.timezone || "UTC";
  const { dayOfWeek } = nowInTimezone(tz);
  const slots = getSlotsForDay(schedule, dayOfWeek);

  if (!slots.length) return "Closed today";

  return slots.map((slot) => formatScheduleRange(slot)).join(", ");
}

/**
 * Format a 24h time string like "09:00" → "9:00 AM".
 */
function formatTime(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${m.toString().padStart(2, "0")} ${period}`;
}
