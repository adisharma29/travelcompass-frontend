"use client";

import { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { HotelEventPublic } from "@/lib/concierge-types";
import { GuestHeader } from "@/components/guest/GuestHeader";
import { GuestFooter } from "@/components/guest/GuestFooter";
import { EventDateLabel } from "@/components/guest/EventDateLabel";
import { SafeHtml } from "@/components/guest/SafeHtml";
import { useGuest } from "@/context/GuestContext";
import { useHasExpired } from "@/hooks/use-has-expired";
import { useBookingWindowState } from "@/hooks/use-booking-window-state";
import { CalendarDays, Star } from "lucide-react";

const CTA_LABELS: Record<string, string> = {
  DINING: "Book Now",
  SPA: "Book Now",
  ACTIVITY: "Book Now",
  TOUR: "Book Now",
  TRANSPORT: "Reserve",
  OTHER: "Make a Request",
};

export function EventDetailClient({
  event,
  hotelSlug,
}: {
  event: HotelEventPublic;
  hotelSlug: string;
}) {
  const router = useRouter();
  const { guardedNavigate, hotel } = useGuest();
  const defaultCtaLabel = CTA_LABELS[event.category] ?? "Book Now";

  // Auto-disable CTA when event_end or next_occurrence passes (even on long-lived pages)
  const endExpired = useHasExpired(!event.is_recurring ? event.event_end : null);
  const occurrenceExpired = useHasExpired(event.is_recurring ? event.next_occurrence : null);
  const { state: windowState, opensAt } = useBookingWindowState(event);
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

  // For recurring events, when the current occurrence passes, re-fetch server data
  // so next_occurrence updates and the CTA re-enables for the next date
  useEffect(() => {
    if (occurrenceExpired && event.is_recurring) {
      router.refresh();
    }
  }, [occurrenceExpired, event.is_recurring, router]);

  const deptSlug = event.routing_department_slug;
  const requestParams = new URLSearchParams();
  if (deptSlug) requestParams.set("dept", deptSlug);
  requestParams.set("event", event.slug);
  requestParams.set("type", event.category === "OTHER" ? "CUSTOM" : "BOOKING");
  // For recurring events, pass next occurrence date for backend validation
  if (event.is_recurring && event.next_occurrence) {
    requestParams.set("occurrence_date", event.next_occurrence.split("T")[0]);
  }

  const handleBook = () => {
    if (!canBook) return;
    guardedNavigate(`/h/${hotelSlug}/request?${requestParams.toString()}`);
  };

  const heroImage = event.cover_image || event.photo;

  const titleSection = (
    <div className="px-5 pt-5 pb-3 md:px-0">
      <div className="flex items-center gap-2 mb-1">
        <h1
          className="text-xl font-bold leading-tight"
          style={{
            fontFamily: "var(--brand-heading-font)",
            color: "var(--brand-primary)",
          }}
        >
          {event.name}
        </h1>
        {event.is_featured && (
          <Star
            className="size-5 flex-shrink-0"
            style={{ color: "var(--brand-accent)", fill: "var(--brand-accent)" }}
          />
        )}
      </div>
      {event.price_display && (
        <p
          className="text-sm font-medium"
          style={{
            color:
              "color-mix(in oklch, var(--brand-primary) 70%, transparent)",
          }}
        >
          {event.price_display}
        </p>
      )}
    </div>
  );

  const dateSection = (
    <div className="flex flex-wrap gap-2 px-5 pb-4 md:px-0">
      <span
        className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor:
            "color-mix(in oklch, var(--brand-accent) 10%, transparent)",
          color: "var(--brand-accent)",
        }}
      >
        <CalendarDays className="size-3" />
        <EventDateLabel
          eventStart={event.event_start}
          eventEnd={event.event_end}
          isAllDay={event.is_all_day}
          isRecurring={event.is_recurring}
          recurrenceRule={event.recurrence_rule}
          timezone={hotel.timezone}
        />
      </span>
      <span
        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
        style={{
          backgroundColor:
            "color-mix(in oklch, var(--brand-primary) 6%, transparent)",
          color:
            "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
        }}
      >
        {event.category.charAt(0) + event.category.slice(1).toLowerCase()}
      </span>
    </div>
  );

  const bookingWindowMessage = (() => {
    if (windowState === "not_yet_open" && opensAt) {
      const fmt = opensAt.toLocaleString(undefined, {
        month: "short",
        day: "numeric",
        hour: "numeric",
        minute: "2-digit",
        timeZone: hotel.timezone || undefined,
      });
      return `Bookings open ${fmt}`;
    }
    if (windowState === "closed") {
      return "Bookings have closed";
    }
    return null;
  })();

  const bookingWindowSection = bookingWindowMessage ? (
    <div className="px-5 py-3 md:px-0">
      <p
        className="text-xs font-medium"
        style={{
          color: "color-mix(in oklch, var(--brand-accent) 80%, var(--brand-primary))",
        }}
      >
        {bookingWindowMessage}
      </p>
    </div>
  ) : null;

  const descriptionSection = event.description ? (
    <div className="px-5 py-4 border-t border-black/5 md:px-0">
      <SafeHtml
        html={event.description}
        className="prose prose-sm max-w-none"
      />
    </div>
  ) : null;

  const highlightsSection =
    event.highlights?.length > 0 ? (
      <div className="px-5 py-4 border-t border-black/5 md:px-0">
        <h2
          className="text-sm font-semibold mb-3"
          style={{
            fontFamily: "var(--brand-heading-font)",
            color: "var(--brand-primary)",
          }}
        >
          Highlights
        </h2>
        <ul className="space-y-2">
          {event.highlights.map((h, i) => (
            <li
              key={i}
              className="flex items-start gap-2 text-sm"
              style={{
                color:
                  "color-mix(in oklch, var(--brand-primary) 70%, transparent)",
              }}
            >
              <span
                className="mt-1.5 size-1.5 rounded-full flex-shrink-0"
                style={{ backgroundColor: "var(--brand-accent)" }}
              />
              {h}
            </li>
          ))}
        </ul>
      </div>
    ) : null;

  const linkedExpSection =
    event.experience_name && event.experience_slug && event.experience_department_slug ? (
      <div className="px-5 py-4 border-t border-black/5 md:px-0">
        <p
          className="text-sm"
          style={{
            color:
              "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
          }}
        >
          Part of{" "}
          <Link
            href={`/h/${hotelSlug}/${event.experience_department_slug}/${event.experience_slug}`}
            className="font-medium underline underline-offset-2"
            style={{ color: "var(--brand-accent)" }}
          >
            {event.experience_name}
          </Link>
        </p>
      </div>
    ) : null;

  return (
    <>
      <GuestHeader
        title="Events"
        backHref={`/h/${hotelSlug}/events`}
        breadcrumbs={[
          { label: "Home", href: `/h/${hotelSlug}` },
          { label: "Events", href: `/h/${hotelSlug}/events` },
          { label: event.name },
        ]}
      />

      <main className="flex-1 pb-24 md:pb-0">
        <div className="max-w-6xl mx-auto md:grid md:grid-cols-[1fr_380px] md:gap-8 md:px-6 md:py-6">
          {/* Left column: Hero image */}
          <div>
            {heroImage ? (
              <div className="relative w-full h-56 md:h-80 md:rounded-2xl md:overflow-hidden">
                <Image
                  src={heroImage}
                  alt={event.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                  priority
                />
              </div>
            ) : (
              <div
                className="flex h-40 md:h-60 items-center justify-center md:rounded-2xl"
                style={{
                  backgroundColor:
                    "color-mix(in oklch, var(--brand-primary) 6%, transparent)",
                }}
              >
                <CalendarDays
                  className="size-12 opacity-30"
                  style={{ color: "var(--brand-primary)" }}
                />
              </div>
            )}

            {/* Mobile: content below image */}
            <div className="md:hidden">
              {titleSection}
              {dateSection}
              {bookingWindowSection}
              {descriptionSection}
              {highlightsSection}
              {linkedExpSection}
            </div>
          </div>

          {/* Right column: Info + desktop booking card */}
          <div className="hidden md:block">
            {titleSection}
            {dateSection}
            {bookingWindowSection}
            {descriptionSection}
            {highlightsSection}
            {linkedExpSection}

            {/* Desktop booking card */}
            <div
              className="sticky top-20 mt-4 p-5 rounded-2xl border"
              style={{
                borderColor:
                  "color-mix(in oklch, var(--brand-primary) 10%, transparent)",
              }}
            >
              {event.price_display && (
                <p
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--brand-primary)" }}
                >
                  {event.price_display}
                </p>
              )}
              <button
                type="button"
                onClick={handleBook}
                disabled={!canBook}
                className="w-full py-3 rounded-full text-sm font-semibold transition-all active:opacity-80 hover:opacity-90 hover:shadow-sm disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
                style={{
                  backgroundColor: "var(--brand-accent)",
                  color: "var(--brand-secondary)",
                  minHeight: "44px",
                }}
              >
                {canBook ? defaultCtaLabel : ctaLabel === defaultCtaLabel ? "Unavailable" : ctaLabel}
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Mobile sticky booking bar */}
      <div className="md:hidden">
        <div
          className="fixed inset-x-0 bottom-0 z-20 border-t px-5 py-3 flex items-center justify-between gap-4"
          style={{
            backgroundColor: "var(--brand-secondary, white)",
            borderColor:
              "color-mix(in oklch, var(--brand-primary) 10%, transparent)",
          }}
        >
          {event.price_display && (
            <p
              className="text-sm font-semibold truncate"
              style={{ color: "var(--brand-primary)" }}
            >
              {event.price_display}
            </p>
          )}
          <button
            type="button"
            onClick={handleBook}
            disabled={!canBook}
            className="shrink-0 px-6 py-2.5 rounded-full text-sm font-semibold transition-all active:opacity-80 disabled:opacity-40 disabled:cursor-not-allowed"
            style={{
              backgroundColor: "var(--brand-accent)",
              color: "var(--brand-secondary)",
              minHeight: "44px",
            }}
          >
            {canBook ? defaultCtaLabel : ctaLabel === defaultCtaLabel ? "Unavailable" : ctaLabel}
          </button>
        </div>
      </div>

      <GuestFooter />
    </>
  );
}
