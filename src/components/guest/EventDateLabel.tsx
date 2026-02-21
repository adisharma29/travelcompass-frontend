"use client";

import type { RecurrenceRule } from "@/lib/concierge-types";

const DAY_NAMES: Record<string, string> = {
  MON: "Monday",
  TUE: "Tuesday",
  WED: "Wednesday",
  THU: "Thursday",
  FRI: "Friday",
  SAT: "Saturday",
  SUN: "Sunday",
};

const SHORT_DAYS: Record<string, string> = {
  MON: "Mon",
  TUE: "Tue",
  WED: "Wed",
  THU: "Thu",
  FRI: "Fri",
  SAT: "Sat",
  SUN: "Sun",
};

function formatTime(date: Date, tz?: string): string {
  return date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      timeZone: tz,
    })
    .replace(":00 ", " ");
}

function formatDate(date: Date, includeYear = false, tz?: string): string {
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    timeZone: tz,
    ...(includeYear ? { year: "numeric" } : {}),
  };
  return date.toLocaleDateString("en-US", opts);
}

/** Compare date parts in the given timezone (or local if omitted). */
function datePartsInTz(date: Date, tz?: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: tz,
  }).formatToParts(date);
  const get = (type: string) =>
    parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}`;
}

function isToday(date: Date, tz?: string): boolean {
  return datePartsInTz(date, tz) === datePartsInTz(new Date(), tz);
}

function isTomorrow(date: Date, tz?: string): boolean {
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  return datePartsInTz(date, tz) === datePartsInTz(tomorrow, tz);
}

function isThisWeek(date: Date, tz?: string): boolean {
  // Compare in timezone: both dates' day strings for the next 7 days
  const now = new Date();
  const nowStr = datePartsInTz(now, tz);
  const dateStr = datePartsInTz(date, tz);
  if (dateStr <= nowStr) return false;
  const weekLater = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000);
  return dateStr < datePartsInTz(weekLater, tz);
}

function getDayName(date: Date, tz?: string): string {
  return date.toLocaleDateString("en-US", { weekday: "long", timeZone: tz });
}

/**
 * Builds a human-friendly label for recurring events.
 * e.g. "Every Saturday at 7 PM", "Every Mon, Wed, Fri"
 */
function formatRecurrence(
  rule: RecurrenceRule,
  eventStart: string,
  isAllDay: boolean,
  tz?: string,
): string {
  const start = new Date(eventStart);
  const time = isAllDay ? "" : ` at ${formatTime(start, tz)}`;
  const { freq, interval = 1, days } = rule;

  if (freq === "daily") {
    return interval === 1
      ? `Every day${time}`
      : `Every ${interval} days${time}`;
  }

  if (freq === "weekly") {
    if (days && days.length > 0) {
      if (days.length === 1) {
        return `Every ${DAY_NAMES[days[0]] ?? days[0]}${time}`;
      }
      const dayList = days.map((d) => SHORT_DAYS[d] ?? d).join(", ");
      return interval === 1
        ? `Every ${dayList}${time}`
        : `Every ${interval} weeks (${dayList})${time}`;
    }
    return interval === 1
      ? `Weekly${time}`
      : `Every ${interval} weeks${time}`;
  }

  if (freq === "monthly") {
    // Get day-of-month in hotel timezone
    const dayNum = parseInt(
      new Intl.DateTimeFormat("en-US", { day: "numeric", timeZone: tz }).format(
        start,
      ),
      10,
    );
    return interval === 1
      ? `Monthly on the ${dayNum}${ordinal(dayNum)}${time}`
      : `Every ${interval} months${time}`;
  }

  return `Recurring${time}`;
}

function ordinal(n: number): string {
  const s = ["th", "st", "nd", "rd"];
  const v = n % 100;
  return s[(v - 20) % 10] || s[v] || s[0];
}

/**
 * Smart event date label. Handles one-time, multi-day, and recurring events.
 * Pass `timezone` (IANA, e.g. "Asia/Kolkata") to display in hotel-local time.
 *
 * Examples:
 * - "Today at 7 PM"
 * - "Tomorrow, 3 PM – 5 PM"
 * - "This Saturday at 7 PM"
 * - "Mar 15 – Mar 17"
 * - "Every Saturday at 7 PM"
 */
export function EventDateLabel({
  eventStart,
  eventEnd,
  isAllDay,
  isRecurring,
  recurrenceRule,
  timezone,
  className,
  style,
}: {
  eventStart: string;
  eventEnd: string | null;
  isAllDay: boolean;
  isRecurring: boolean;
  recurrenceRule: RecurrenceRule | null;
  timezone?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const tz = timezone;

  if (isRecurring && recurrenceRule) {
    return (
      <span className={className} style={style}>
        {formatRecurrence(recurrenceRule, eventStart, isAllDay, tz)}
      </span>
    );
  }

  const start = new Date(eventStart);
  const end = eventEnd ? new Date(eventEnd) : null;

  // Single-day event
  let dateLabel: string;
  if (isToday(start, tz)) {
    dateLabel = "Today";
  } else if (isTomorrow(start, tz)) {
    dateLabel = "Tomorrow";
  } else if (isThisWeek(start, tz)) {
    dateLabel = `This ${getDayName(start, tz)}`;
  } else {
    dateLabel = formatDate(start, false, tz);
  }

  if (isAllDay) {
    if (
      end &&
      datePartsInTz(end, tz) !== datePartsInTz(start, tz)
    ) {
      return (
        <span className={className} style={style}>
          {formatDate(start, false, tz)} – {formatDate(end, false, tz)}
        </span>
      );
    }
    return (
      <span className={className} style={style}>
        {dateLabel}
      </span>
    );
  }

  const timeStr = formatTime(start, tz);

  if (
    end &&
    datePartsInTz(end, tz) !== datePartsInTz(start, tz)
  ) {
    // Multi-day with times
    return (
      <span className={className} style={style}>
        {formatDate(start, false, tz)}, {timeStr} – {formatDate(end, false, tz)},{" "}
        {formatTime(end, tz)}
      </span>
    );
  }

  if (
    end &&
    datePartsInTz(end, tz) === datePartsInTz(start, tz)
  ) {
    // Same day, time range
    return (
      <span className={className} style={style}>
        {dateLabel}, {timeStr} – {formatTime(end, tz)}
      </span>
    );
  }

  return (
    <span className={className} style={style}>
      {dateLabel} at {timeStr}
    </span>
  );
}
