"use client";

import type { DepartmentSchedule } from "@/lib/concierge-types";
import { getDeptStatus } from "@/lib/schedule-utils";

export function ScheduleBadge({
  schedule,
  compact,
}: {
  schedule: DepartmentSchedule;
  compact?: boolean;
}) {
  const { label, isOpen } = getDeptStatus(schedule);

  return (
    <span
      className={`inline-flex items-center gap-1.5 text-xs font-medium ${compact ? "" : "px-2 py-0.5 rounded-full"}`}
      style={{
        color: isOpen ? "var(--brand-accent)" : "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
        backgroundColor: compact
          ? "transparent"
          : isOpen
            ? "color-mix(in oklch, var(--brand-accent) 10%, transparent)"
            : "color-mix(in oklch, var(--brand-primary) 6%, transparent)",
      }}
    >
      <span
        className="size-1.5 rounded-full"
        style={{ backgroundColor: isOpen ? "var(--brand-accent)" : "color-mix(in oklch, var(--brand-primary) 40%, transparent)" }}
      />
      {label}
    </span>
  );
}
