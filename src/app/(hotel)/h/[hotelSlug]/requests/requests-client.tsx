"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import type { Hotel, ServiceRequestListItem } from "@/lib/concierge-types";
import { getMyRequestsPaginated } from "@/lib/guest-auth";
import { RequestCard } from "@/components/guest/RequestCard";
import { useGuest } from "@/context/GuestContext";

export function RequestsClient({ hotel }: { hotel: Hotel }) {
  const router = useRouter();
  const { isAuthenticated } = useGuest();
  const [requests, setRequests] = useState<ServiceRequestListItem[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  // Initial loading = true when authenticated (first fetch on mount).
  // Subsequent page changes set loading via goToPage before the effect fires.
  const [loading, setLoading] = useState(isAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) return;
    let stale = false;
    getMyRequestsPaginated(hotel.slug, page).then((data) => {
      if (stale) return;
      setRequests(data.results);
      setTotalCount(data.count);
      setHasNext(data.hasNext);
      setHasPrev(data.hasPrev);
      setLoading(false);
    }).catch(() => {
      if (!stale) setLoading(false);
    });
    return () => { stale = true; };
  }, [isAuthenticated, hotel.slug, page]);

  function goToPage(p: number) {
    setLoading(true);
    setPage(p);
  }

  // Redirect unauthenticated users to verify
  useEffect(() => {
    if (!isAuthenticated) {
      router.replace(`/h/${hotel.slug}/verify?next=/h/${hotel.slug}/requests`);
    }
  }, [isAuthenticated, hotel.slug, router]);

  // Listen for session expiry
  useEffect(() => {
    function handleExpired() {
      router.replace(`/h/${hotel.slug}/verify?next=/h/${hotel.slug}/requests`);
    }
    window.addEventListener("guest:session-expired", handleExpired);
    return () =>
      window.removeEventListener("guest:session-expired", handleExpired);
  }, [hotel.slug, router]);

  if (!isAuthenticated) return null;

  return (
    <>
      {/* Header */}
      <header
        className="sticky top-0 z-30"
        style={{ backgroundColor: "var(--brand-primary)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-5 h-14">
          <Link
            href={`/h/${hotel.slug}`}
            className="flex items-center gap-1.5 text-xs font-medium"
            style={{ color: "var(--brand-secondary)" }}
          >
            <ArrowLeft className="size-4" />
            {hotel.name}
          </Link>
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-6">
        <h1
          className="text-xl font-bold mb-4"
          style={{
            fontFamily: "var(--brand-heading-font)",
            color: "var(--brand-primary)",
          }}
        >
          My Requests{totalCount > 0 ? ` (${totalCount})` : ""}
        </h1>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-xl h-16 animate-pulse"
                style={{
                  backgroundColor:
                    "color-mix(in oklch, var(--brand-primary) 6%, transparent)",
                }}
              />
            ))}
          </div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <p
              className="text-sm"
              style={{
                color:
                  "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
              }}
            >
              No requests yet
            </p>
            <Link
              href={`/h/${hotel.slug}`}
              className="inline-block text-sm font-medium mt-3"
              style={{ color: "var(--brand-accent, var(--brand-primary))" }}
            >
              Browse services
            </Link>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              {requests.map((req) => (
                <RequestCard key={req.public_id} req={req} />
              ))}
            </div>

            {/* Pagination */}
            {(hasPrev || hasNext) && (
              <div className="flex items-center justify-center gap-4 mt-6">
                <button
                  onClick={() => goToPage(page - 1)}
                  disabled={!hasPrev}
                  className="flex items-center gap-1 text-sm font-medium disabled:opacity-30"
                  style={{ color: "var(--brand-primary)" }}
                >
                  <ChevronLeft className="size-4" />
                  Prev
                </button>
                <span
                  className="text-xs"
                  style={{
                    color:
                      "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
                  }}
                >
                  Page {page}
                </span>
                <button
                  onClick={() => goToPage(page + 1)}
                  disabled={!hasNext}
                  className="flex items-center gap-1 text-sm font-medium disabled:opacity-30"
                  style={{ color: "var(--brand-primary)" }}
                >
                  Next
                  <ChevronRight className="size-4" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
