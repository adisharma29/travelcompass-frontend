"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import type { HotelEventPublic } from "@/lib/concierge-types";
import { getPublicEvents } from "@/lib/guest-auth";
import { GuestHeader } from "@/components/guest/GuestHeader";
import { GuestFooter } from "@/components/guest/GuestFooter";
import { EventCard } from "@/components/guest/EventCard";
import { CalendarDays, Loader2 } from "lucide-react";

type FilterTab = "upcoming" | "featured" | "all";

export function EventsListClient({
  events: initialEvents,
  hotelSlug,
}: {
  events: HotelEventPublic[];
  hotelSlug: string;
}) {
  const router = useRouter();
  const [filter, setFilter] = useState<FilterTab>("upcoming");
  const [fetchedEvents, setFetchedEvents] = useState<HotelEventPublic[] | null>(null);
  const [loading, setLoading] = useState(false);
  const fetchIdRef = useRef(0);
  const filterRef = useRef<FilterTab>("upcoming");

  // Use server-rendered data for "upcoming" (default), fetch for other tabs
  const events = filter === "upcoming" ? initialEvents : (fetchedEvents ?? []);

  // Called by EventCard when a recurring occurrence expires
  const handleOccurrenceExpired = useCallback(() => {
    const current = filterRef.current;
    if (current === "upcoming") {
      // SSR data — router.refresh() handles it
      router.refresh();
    } else {
      // Client-fetched tab — re-fetch
      const id = ++fetchIdRef.current;
      const params =
        current === "all"
          ? { all: true }
          : current === "featured"
            ? { featured: true }
            : undefined;
      getPublicEvents(hotelSlug, params)
        .then((data) => {
          if (fetchIdRef.current === id) setFetchedEvents(data);
        })
        .catch(() => {
          if (fetchIdRef.current === id) setFetchedEvents(null);
        });
    }
  }, [hotelSlug, router]);

  const handleTabChange = (tab: FilterTab) => {
    setFilter(tab);
    filterRef.current = tab;
    if (tab === "upcoming") {
      // Cancel any in-flight fetch and clear stale data
      fetchIdRef.current++;
      setFetchedEvents(null);
      setLoading(false);
      return;
    }
    const id = ++fetchIdRef.current;
    setLoading(true);
    const params =
      tab === "all"
        ? { all: true }
        : tab === "featured"
          ? { featured: true }
          : undefined;
    getPublicEvents(hotelSlug, params)
      .then((data) => {
        if (fetchIdRef.current === id) setFetchedEvents(data);
      })
      .catch(() => {
        if (fetchIdRef.current === id) setFetchedEvents(null);
      })
      .finally(() => {
        if (fetchIdRef.current === id) setLoading(false);
      });
  };

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "upcoming", label: "Upcoming" },
    { key: "featured", label: "Featured" },
    { key: "all", label: "All" },
  ];

  return (
    <>
      <GuestHeader
        title="Events"
        backHref={`/h/${hotelSlug}`}
        breadcrumbs={[
          { label: "Home", href: `/h/${hotelSlug}` },
          { label: "Events" },
        ]}
      />

      <main className="flex-1 max-w-6xl mx-auto w-full pb-8">
        {/* Filter tabs */}
        <div className="flex gap-2 px-5 pt-4 pb-2">
          {TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => handleTabChange(tab.key)}
              className="px-3 py-1.5 rounded-full text-xs font-medium transition-colors"
              style={{
                backgroundColor:
                  filter === tab.key
                    ? "var(--brand-accent)"
                    : "color-mix(in oklch, var(--brand-primary) 6%, transparent)",
                color:
                  filter === tab.key
                    ? "var(--brand-secondary)"
                    : "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2
              className="size-6 animate-spin"
              style={{ color: "var(--brand-accent)" }}
            />
          </div>
        ) : events.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-5">
            <CalendarDays
              className="size-10 mb-3 opacity-30"
              style={{ color: "var(--brand-primary)" }}
            />
            <p
              className="text-sm"
              style={{
                color:
                  "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
              }}
            >
              {filter === "featured"
                ? "No featured events right now"
                : filter === "all"
                  ? "No events yet"
                  : "No upcoming events"}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-black/5">
            {events.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                hotelSlug={hotelSlug}
                onOccurrenceExpired={handleOccurrenceExpired}
              />
            ))}
          </div>
        )}
      </main>

      <GuestFooter />
    </>
  );
}
