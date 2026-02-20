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
 * Get the current open/closed status of a department based on its schedule.
 * Returns a human-readable label and boolean.
 */
export function getDeptStatus(schedule: DepartmentSchedule): DeptStatusResult {
  if (!schedule || (!schedule.default?.length && !schedule.overrides)) {
    return { label: "Hours not set", isOpen: false };
  }

  const tz = schedule.timezone || "UTC";
  const { hours, minutes, dayOfWeek } = nowInTimezone(tz);
  const currentMinutes = hours * 60 + minutes;
  const slots = getSlotsForDay(schedule, dayOfWeek);

  if (!slots.length) {
    return { label: "Closed today", isOpen: false };
  }

  for (const [open, close] of slots) {
    const openMin = parseTimeToMinutes(open);
    const closeMin = parseTimeToMinutes(close);

    if (currentMinutes >= openMin && currentMinutes < closeMin) {
      // Currently open — show when it closes
      return {
        label: `Open · Closes ${formatTime(close)}`,
        isOpen: true,
      };
    }

    if (currentMinutes < openMin) {
      // Not yet open — show when it opens
      return {
        label: `Opens ${formatTime(open)}`,
        isOpen: false,
      };
    }
  }

  // Past all slots for today
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
