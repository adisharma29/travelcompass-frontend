"use client";

import { useState, useEffect } from "react";
import { useGuest } from "@/context/GuestContext";
import type { Experience } from "@/lib/concierge-types";

const CTA_LABELS: Record<string, string> = {
  DINING: "Book Now",
  SPA: "Book Now",
  ACTIVITY: "Book Now",
  TOUR: "Book Now",
  TRANSPORT: "Reserve",
  OTHER: "Request",
};

export function StickyBookingBar({
  experience,
  hotelSlug,
  deptSlug,
}: {
  experience: Experience;
  hotelSlug: string;
  deptSlug: string;
}) {
  const { guardedNavigate } = useGuest();
  const ctaLabel = CTA_LABELS[experience.category] ?? "Book Now";
  const requestType = experience.category === "OTHER" ? "CUSTOM" : "BOOKING";
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 300);
    return () => clearTimeout(timer);
  }, []);

  const handleBook = () => {
    guardedNavigate(
      `/h/${hotelSlug}/request?dept=${deptSlug}&exp=${experience.slug}&type=${requestType}`,
    );
  };

  return (
    <div
      className={`fixed bottom-0 inset-x-0 z-40 border-t border-black/5 transition-all duration-500 ease-out ${
        visible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      }`}
      style={{
        backgroundColor: "color-mix(in oklch, var(--brand-secondary) 90%, transparent)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
      }}
    >
      <div className="flex items-center justify-between px-5 py-3 max-w-lg mx-auto">
        {/* Price */}
        <div>
          {experience.price_display && (
            <p
              className="text-sm font-semibold"
              style={{ color: "var(--brand-primary)" }}
            >
              {experience.price_display}
            </p>
          )}
        </div>

        {/* CTA button */}
        <button
          type="button"
          onClick={handleBook}
          className="px-6 py-3 rounded-full text-sm font-semibold transition-all active:opacity-80 hover:opacity-90 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
          style={{
            backgroundColor: "var(--brand-accent)",
            color: "var(--brand-secondary)",
            minHeight: "44px",
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </div>
  );
}
