"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type {
  Department,
  Hotel,
  ServiceRequestListItem,
} from "@/lib/concierge-types";
import { DepartmentGrid } from "@/components/guest/DepartmentGrid";
import { GuestFooter } from "@/components/guest/GuestFooter";
import { SafeHtml } from "@/components/guest/SafeHtml";
import { RequestCard } from "@/components/guest/RequestCard";
import { useGuest } from "@/context/GuestContext";
import { getMyRequests } from "@/lib/guest-auth";
import { logout } from "@/lib/auth";
import { User, LogOut, ChevronDown, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function HotelLandingClient({
  hotel,
  departments,
}: {
  hotel: Hotel;
  departments: Department[];
}) {
  const router = useRouter();
  const { isAuthenticated, isVerified, guestUser, guestStay, setAuthState } = useGuest();
  const [requests, setRequests] = useState<ServiceRequestListItem[]>([]);
  const [requestCount, setRequestCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyRequests(hotel.slug).then(({ results, count }) => {
      setRequests(results);
      setRequestCount(count);
    }).catch(() => {});
  }, [isAuthenticated, hotel.slug]);

  const guestDisplayName =
    guestUser?.first_name || guestUser?.phone || null;

  const handleLogout = useCallback(async () => {
    try {
      await logout();
    } catch {
      // Best-effort — clear local state regardless
    }
    setAuthState(null, null);
    setRequests([]);
    setRequestCount(0);
    router.refresh();
  }, [setAuthState, router]);

  return (
    <>
      {/* Branded header bar */}
      <header
        className="sticky top-0 z-30"
        style={{ backgroundColor: "var(--brand-primary)" }}
      >
        <div className="max-w-6xl mx-auto flex items-center gap-3 px-5 h-14">
          {hotel.logo && (
            <div className="relative size-8 shrink-0 rounded-lg overflow-hidden">
              <Image src={hotel.logo} alt="" fill className="object-cover" />
            </div>
          )}
          <span
            className="text-sm font-semibold truncate"
            style={{
              fontFamily: "var(--brand-heading-font)",
              color: "var(--brand-secondary)",
            }}
          >
            {hotel.name}
          </span>
          {isVerified && guestDisplayName ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="ml-auto flex items-center gap-1.5 outline-none"
                  style={{ color: "var(--brand-secondary)" }}
                >
                  <User className="size-4 shrink-0" />
                  <span className="text-xs font-medium truncate max-w-[120px]">
                    {guestDisplayName}
                  </span>
                  {guestStay?.room_number && (
                    <span className="text-xs opacity-70">· {guestStay.room_number}</span>
                  )}
                  <ChevronDown className="size-3 opacity-70" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-40">
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="size-4 mr-2" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : isAuthenticated && !isVerified ? (
            <button
              className="ml-auto flex items-center gap-1.5 text-xs font-medium outline-none"
              style={{ color: "var(--brand-secondary)" }}
              onClick={() => router.push(`/h/${hotel.slug}/verify`)}
            >
              <ShieldCheck className="size-4" />
              Verify for this hotel
            </button>
          ) : null}
        </div>
      </header>

      <main className="flex-1 max-w-6xl mx-auto w-full">
        {/* Hotel intro — name + photo + description */}
        <section className="px-5 pt-6 pb-4 flex gap-5 items-start">
          <div className="flex-1 min-w-0">
            <h1
              className="text-xl font-bold leading-tight"
              style={{
                fontFamily: "var(--brand-heading-font)",
                color: "var(--brand-primary)",
              }}
            >
              {hotel.name}
            </h1>
            {hotel.tagline && (
              <p
                className="text-xs mt-1"
                style={{
                  color:
                    "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
                }}
              >
                {hotel.tagline}
              </p>
            )}
            {hotel.description && (
              <SafeHtml
                html={hotel.description}
                className="text-sm leading-relaxed mt-3 max-w-2xl"
                style={{
                  color:
                    "color-mix(in oklch, var(--brand-primary) 70%, transparent)",
                }}
              />
            )}
          </div>
          {hotel.cover_image && (
            <div className="relative shrink-0 w-24 h-24 sm:w-32 sm:h-32 rounded-xl overflow-hidden">
              <Image
                src={hotel.cover_image}
                alt=""
                fill
                sizes="128px"
                className="object-cover"
              />
            </div>
          )}
        </section>

        {/* Your Requests — only when authenticated and has requests */}
        {isAuthenticated && requests.length > 0 && (
          <section className="px-5 pb-4">
            <h2
              className="text-lg font-semibold mb-3"
              style={{
                fontFamily: "var(--brand-heading-font)",
                color: "var(--brand-primary)",
              }}
            >
              Your Requests
            </h2>
            <div className="space-y-2">
              {requests.slice(0, 3).map((req) => (
                <RequestCard key={req.public_id} req={req} />
              ))}
            </div>
            {requestCount > 3 && (
              <Link
                href={`/h/${hotel.slug}/requests`}
                className="block text-center text-sm font-medium mt-3 py-2"
                style={{ color: "var(--brand-accent, var(--brand-primary))" }}
              >
                View all requests ({requestCount})
              </Link>
            )}
          </section>
        )}

        {/* Section heading */}
        <div className="px-5 pt-4 pb-4">
          <h2
            className="text-lg font-semibold"
            style={{
              fontFamily: "var(--brand-heading-font)",
              color: "var(--brand-primary)",
            }}
          >
            Explore Our Services
          </h2>
        </div>

        <DepartmentGrid departments={departments} hotelSlug={hotel.slug} />
      </main>

      <GuestFooter />
    </>
  );
}

