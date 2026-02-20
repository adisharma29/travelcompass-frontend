"use client";

import type { DepartmentSchedule } from "@/lib/concierge-types";
import { getSlotsForDay, formatScheduleRange } from "@/lib/schedule-utils";

const DAYS = [
  { key: "monday", label: "Mon" },
  { key: "tuesday", label: "Tue" },
  { key: "wednesday", label: "Wed" },
  { key: "thursday", label: "Thu" },
  { key: "friday", label: "Fri" },
  { key: "saturday", label: "Sat" },
  { key: "sunday", label: "Sun" },
] as const;

function getTodayKey(timezone: string): string {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    timeZone: timezone,
  })
    .format(new Date())
    .toLowerCase();
}

export function WeeklySchedule({ schedule }: { schedule: DepartmentSchedule }) {
  const tz = schedule.timezone || "UTC";
  const today = getTodayKey(tz);

  return (
    <div className="space-y-1">
      {DAYS.map(({ key, label }) => {
        const slots = getSlotsForDay(schedule, key);
        const isToday = key === today;
        return (
          <div
            key={key}
            className="flex items-center justify-between py-1.5 px-2 rounded-lg text-xs"
            style={{
              backgroundColor: isToday
                ? "color-mix(in oklch, var(--brand-accent) 8%, transparent)"
                : "transparent",
            }}
          >
            <span
              className={`w-10 ${isToday ? "font-semibold" : "font-medium"}`}
              style={{
                color: isToday
                  ? "var(--brand-accent)"
                  : "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
              }}
            >
              {label}
            </span>
            <span
              style={{
                color: isToday
                  ? "var(--brand-primary)"
                  : "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
              }}
            >
              {slots.length > 0
                ? slots.map((slot) => formatScheduleRange(slot)).join(", ")
                : "Closed"}
            </span>
          </div>
        );
      })}
    </div>
  );
}
