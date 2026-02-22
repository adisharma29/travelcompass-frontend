"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
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

/**
 * Vertical card for the landing page featured events section.
 * Shows cover/photo image on top, details below — optimised for grid & carousel layouts.
 *
 * Uses a stretched-link pattern: an invisible <a> covers the card for detail
 * navigation, while the CTA <button> sits above it (z-10). No invalid nesting.
 */
export function FeaturedEventCard({
  event,
  hotelSlug,
  onOccurrenceExpired,
}: {
  event: HotelEventPublic;
  hotelSlug: string;
  onOccurrenceExpired?: () => void;
}) {
  const { guardedNavigate, hotel } = useGuest();
  const defaultCtaLabel = CTA_LABELS[event.category] ?? "Book";

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

  useEffect(() => {
    if (occurrenceExpired && event.is_recurring && onOccurrenceExpired) {
      onOccurrenceExpired();
    }
  }, [occurrenceExpired, event.is_recurring, onOccurrenceExpired]);

  const deptSlug = event.routing_department_slug;
  const requestParams = new URLSearchParams();
  if (deptSlug) requestParams.set("dept", deptSlug);
  requestParams.set("event", event.slug);
  requestParams.set("type", event.category === "OTHER" ? "CUSTOM" : "BOOKING");
  if (event.is_recurring && event.next_occurrence) {
    requestParams.set("occurrence_date", event.next_occurrence.split("T")[0]);
  }

  const handleCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!canBook) return;
    guardedNavigate(`/h/${hotelSlug}/request?${requestParams.toString()}`);
  };

  const heroSrc = event.cover_image || event.photo;
  const detailHref = `/h/${hotelSlug}/events/${event.slug}`;

  return (
    <div
      className="group relative flex flex-col rounded-2xl overflow-hidden border border-black/5 shadow-sm transition-shadow hover:shadow-md"
      style={{ backgroundColor: "var(--brand-secondary)" }}
    >
      {/* Stretched link — covers the entire card for detail navigation */}
      <Link
        href={detailHref}
        className="absolute inset-0 z-0 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 rounded-2xl"
        aria-label={`View ${event.name}`}
        tabIndex={0}
      />

      {/* Hero image — pointer-events-none so clicks pass to stretched link */}
      <div className="relative w-full aspect-[16/9] bg-black/5 pointer-events-none">
        {heroSrc ? (
          <Image
            src={heroSrc}
            alt={event.name}
            fill
            sizes="(max-width: 640px) 80vw, (max-width: 1024px) 45vw, 30vw"
            className="object-cover"
          />
        ) : (
          <div
            className="absolute inset-0 flex items-center justify-center text-2xl font-bold opacity-10"
            style={{ color: "var(--brand-primary)" }}
          >
            {event.name.charAt(0)}
          </div>
        )}
      </div>

      {/* Content — pointer-events-none so clicks pass to stretched link; CTA re-enables */}
      <div className="flex flex-col gap-1.5 p-4 pointer-events-none">
        <h3
          className="text-sm font-semibold leading-snug line-clamp-2"
          style={{
            fontFamily: "var(--brand-heading-font)",
            color: "var(--brand-primary)",
          }}
        >
          {event.name}
        </h3>

        <EventDateLabel
          eventStart={event.event_start}
          eventEnd={event.event_end}
          isAllDay={event.is_all_day}
          isRecurring={event.is_recurring}
          recurrenceRule={event.recurrence_rule}
          timezone={hotel.timezone}
          className="text-xs"
          style={{
            color: "color-mix(in oklch, var(--brand-primary) 55%, transparent)",
          }}
        />

        {event.price_display && (
          <span
            className="text-xs font-medium"
            style={{
              color: "color-mix(in oklch, var(--brand-primary) 65%, transparent)",
            }}
          >
            {event.price_display}
          </span>
        )}

        {/* CTA sits above the stretched link — re-enable pointer events */}
        <button
          type="button"
          onClick={handleCTA}
          disabled={!canBook}
          className="pointer-events-auto relative z-10 mt-2 self-start inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:opacity-80 hover:opacity-90 hover:shadow-sm disabled:opacity-40 disabled:pointer-events-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
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
