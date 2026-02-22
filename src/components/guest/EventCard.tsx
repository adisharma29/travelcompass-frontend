"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type { HotelEventPublic } from "@/lib/concierge-types";
import { EventDateLabel } from "./EventDateLabel";
import { useGuest } from "@/context/GuestContext";
import { useHasExpired } from "@/hooks/use-has-expired";
import { useBookingWindowState } from "@/hooks/use-booking-window-state";

const CTA_LABELS: Record<string, string> = {
  DINING: "Book",
  SPA: "Book",
  ACTIVITY: "Book",
  TOUR: "Book",
  TRANSPORT: "Reserve",
  OTHER: "Request",
};

export function EventCard({
  event,
  hotelSlug,
  onOccurrenceExpired,
}: {
  event: HotelEventPublic;
  hotelSlug: string;
  /** Called when a recurring event's current occurrence passes. Parent can refetch data. */
  onOccurrenceExpired?: () => void;
}) {
  const router = useRouter();
  const { guardedNavigate, hotel } = useGuest();
  const defaultCtaLabel = CTA_LABELS[event.category] ?? "Book";

  // Auto-disable CTA when event_end or next_occurrence passes (even on long-lived pages)
  const endExpired = useHasExpired(!event.is_recurring ? event.event_end : null);
  const occurrenceExpired = useHasExpired(event.is_recurring ? event.next_occurrence : null);
  const { state: windowState } = useBookingWindowState(event);
  const canBook =
    !!event.routing_department_slug &&
    !endExpired &&
    (!event.is_recurring || (!!event.next_occurrence && !occurrenceExpired)) &&
    windowState === "bookable";

  const ctaLabel =
    windowState === "not_yet_open"
      ? "Not Yet Open"
      : windowState === "closed"
        ? "Closed"
        : defaultCtaLabel;

  // Re-fetch data when a recurring occurrence passes so next_occurrence updates
  useEffect(() => {
    if (occurrenceExpired && event.is_recurring) {
      if (onOccurrenceExpired) {
        onOccurrenceExpired();
      } else {
        router.refresh();
      }
    }
  }, [occurrenceExpired, event.is_recurring, onOccurrenceExpired, router]);

  // Build request URL with optional department routing
  const deptSlug = event.routing_department_slug;
  const requestParams = new URLSearchParams();
  if (deptSlug) requestParams.set("dept", deptSlug);
  requestParams.set("event", event.slug);
  requestParams.set("type", event.category === "OTHER" ? "CUSTOM" : "BOOKING");
  // For recurring events, pass next occurrence date for backend validation
  if (event.is_recurring && event.next_occurrence) {
    requestParams.set("occurrence_date", event.next_occurrence.split("T")[0]);
  }

  const handleCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canBook) return;
    guardedNavigate(`/h/${hotelSlug}/request?${requestParams.toString()}`);
  };

  const detailHref = `/h/${hotelSlug}/events/${event.slug}`;

  return (
    <div className="group relative flex gap-4 p-4 rounded-2xl transition-colors hover:bg-[color-mix(in_oklch,var(--brand-primary)_3%,transparent)]">
      {/* Stretched link — covers the entire card for detail navigation */}
      <Link
        href={detailHref}
        className="absolute inset-0 z-0 rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
        aria-label={`View ${event.name}`}
        tabIndex={0}
      />

      {/* Photo — pointer-events-none so clicks pass to stretched link */}
      {event.photo && (
        <div className="relative size-20 md:size-28 rounded-xl overflow-hidden flex-shrink-0 pointer-events-none">
          <Image
            src={event.photo}
            alt={event.name}
            fill
            sizes="(max-width: 768px) 80px, 112px"
            className="object-cover"
          />
        </div>
      )}

      {/* Text content — pointer-events-none so clicks pass to stretched link; CTA re-enables */}
      <div className="flex-1 min-w-0 pointer-events-none">
        <div className="flex items-center gap-2 mb-0.5">
          <h3
            className="text-sm font-semibold leading-tight line-clamp-2"
            style={{
              fontFamily: "var(--brand-heading-font)",
              color: "var(--brand-primary)",
            }}
          >
            {event.name}
          </h3>
          {event.is_featured && (
            <span
              className="shrink-0 text-[10px] font-semibold uppercase tracking-wider px-1.5 py-0.5 rounded-full"
              style={{
                backgroundColor:
                  "color-mix(in oklch, var(--brand-accent) 15%, transparent)",
                color: "var(--brand-accent)",
              }}
            >
              Featured
            </span>
          )}
        </div>

        <EventDateLabel
          eventStart={event.event_start}
          eventEnd={event.event_end}
          isAllDay={event.is_all_day}
          isRecurring={event.is_recurring}
          recurrenceRule={event.recurrence_rule}
          timezone={hotel.timezone}
          className="text-xs block mb-2"
          style={{
            color:
              "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
          }}
        />

        <div
          className="flex items-center gap-2 text-xs mb-2 flex-wrap"
          style={{
            color:
              "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
          }}
        >
          {event.price_display && (
            <span className="font-medium">{event.price_display}</span>
          )}
          {event.experience_name && (
            <>
              {event.price_display && (
                <span className="opacity-40">·</span>
              )}
              <span>{event.experience_name}</span>
            </>
          )}
        </div>

        {/* CTA sits above the stretched link — re-enable pointer events */}
        <button
          type="button"
          onClick={handleCTA}
          disabled={!canBook}
          className="pointer-events-auto relative z-10 inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:opacity-80 hover:opacity-90 hover:shadow-sm disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
          style={{
            backgroundColor: "var(--brand-accent)",
            color: "var(--brand-secondary)",
          }}
        >
          {canBook ? defaultCtaLabel : ctaLabel === defaultCtaLabel ? "Unavailable" : ctaLabel}
        </button>
      </div>
    </div>
  );
}
