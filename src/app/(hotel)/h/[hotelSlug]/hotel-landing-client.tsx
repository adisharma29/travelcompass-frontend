"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import type {
  Department,
  Hotel,
  ServiceRequestListItem,
} from "@/lib/concierge-types";
import { DepartmentGrid } from "@/components/guest/DepartmentGrid";
import { GuestFooter } from "@/components/guest/GuestFooter";
import { SafeHtml } from "@/components/guest/SafeHtml";
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

const GUEST_STATUS_LABEL: Record<string, string> = {
  CREATED: "Pending",
  ACKNOWLEDGED: "Being Reviewed",
  CONFIRMED: "Confirmed",
  NOT_AVAILABLE: "Not Available",
  NO_SHOW: "No Show",
  ALREADY_BOOKED_OFFLINE: "Booked Offline",
  EXPIRED: "Expired",
};

const GUEST_STATUS_COLOR: Record<string, string> = {
  CREATED: "var(--brand-accent, #d97706)",
  ACKNOWLEDGED: "var(--brand-accent, #d97706)",
  CONFIRMED: "#16a34a",
  NOT_AVAILABLE: "#dc2626",
  NO_SHOW: "#6b7280",
  ALREADY_BOOKED_OFFLINE: "#6b7280",
  EXPIRED: "#6b7280",
};

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

  useEffect(() => {
    if (!isAuthenticated) return;
    getMyRequests(hotel.slug).then(setRequests);
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
              {requests.map((req) => (
                <RequestCard key={req.public_id} req={req} />
              ))}
            </div>
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

function RequestCard({ req }: { req: ServiceRequestListItem }) {
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

function formatRequestDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
