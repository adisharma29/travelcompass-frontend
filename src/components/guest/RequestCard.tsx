"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import type { ServiceRequestListItem } from "@/lib/concierge-types";

export const GUEST_STATUS_LABEL: Record<string, string> = {
  CREATED: "Pending",
  ACKNOWLEDGED: "Being Reviewed",
  CONFIRMED: "Confirmed",
  NOT_AVAILABLE: "Not Available",
  NO_SHOW: "No Show",
  ALREADY_BOOKED_OFFLINE: "Booked Offline",
  EXPIRED: "Expired",
};

export const GUEST_STATUS_COLOR: Record<string, string> = {
  CREATED: "var(--brand-accent, #d97706)",
  ACKNOWLEDGED: "var(--brand-accent, #d97706)",
  CONFIRMED: "#16a34a",
  NOT_AVAILABLE: "#dc2626",
  NO_SHOW: "#6b7280",
  ALREADY_BOOKED_OFFLINE: "#6b7280",
  EXPIRED: "#6b7280",
};

export function formatRequestDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function RequestCard({ req }: { req: ServiceRequestListItem }) {
  const [open, setOpen] = useState(false);

  const hasDetails =
    req.guest_notes || req.guest_date || req.guest_time || req.guest_count;

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        backgroundColor:
          "color-mix(in oklch, var(--brand-accent, var(--brand-primary)) 4%, transparent)",
      }}
    >
      <button
        type="button"
        className="w-full flex items-center gap-3 px-4 py-3 text-left"
        onClick={() => hasDetails && setOpen(!open)}
      >
        <div className="flex-1 min-w-0">
          <p
            className="text-sm font-medium truncate"
            style={{ color: "var(--brand-primary)" }}
          >
            {req.experience_name ?? req.department_name}
          </p>
          <p
            className="text-xs mt-0.5"
            style={{
              color:
                "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
            }}
          >
            {formatRequestDate(req.created_at)}
          </p>
        </div>
        <span
          className="inline-flex items-center gap-1.5 text-xs font-medium shrink-0"
          style={{ color: GUEST_STATUS_COLOR[req.status] ?? "#6b7280" }}
        >
          <span
            className="size-2 rounded-full"
            style={{
              backgroundColor:
                GUEST_STATUS_COLOR[req.status] ?? "#6b7280",
            }}
          />
          {GUEST_STATUS_LABEL[req.status] ?? req.status}
        </span>
        {hasDetails && (
          <ChevronDown
            className="size-4 shrink-0 transition-transform duration-200"
            style={{
              color: "color-mix(in oklch, var(--brand-primary) 40%, transparent)",
              transform: open ? "rotate(180deg)" : undefined,
            }}
          />
        )}
      </button>

      {open && hasDetails && (
        <div
          className="px-4 pb-3 grid gap-x-4 gap-y-1.5 text-xs"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))",
            color: "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
          }}
        >
          {req.guest_date && (
            <div>
              <span className="font-medium block" style={{ color: "var(--brand-primary)" }}>
                Date
              </span>
              {req.guest_date}
              {req.guest_time ? ` at ${req.guest_time}` : ""}
            </div>
          )}
          {req.guest_count != null && (
            <div>
              <span className="font-medium block" style={{ color: "var(--brand-primary)" }}>
                Guests
              </span>
              {req.guest_count}
            </div>
          )}
          {req.guest_notes && (
            <div style={{ gridColumn: "1 / -1" }}>
              <span className="font-medium block" style={{ color: "var(--brand-primary)" }}>
                Notes
              </span>
              <p className="whitespace-pre-wrap">{req.guest_notes}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
