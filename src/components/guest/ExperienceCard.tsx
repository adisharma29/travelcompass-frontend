"use client";

import Link from "next/link";
import Image from "next/image";
import type { Experience } from "@/lib/concierge-types";
import { useGuest } from "@/context/GuestContext";

const CTA_LABELS: Record<string, string> = {
  DINING: "Book",
  SPA: "Book",
  ACTIVITY: "Book",
  TOUR: "Book",
  TRANSPORT: "Reserve",
  OTHER: "Request",
};

export function ExperienceCard({
  experience,
  hotelSlug,
  deptSlug,
}: {
  experience: Experience;
  hotelSlug: string;
  deptSlug: string;
}) {
  const { guardedNavigate } = useGuest();
  const ctaLabel = CTA_LABELS[experience.category] ?? "Book";
  const requestType = experience.category === "OTHER" ? "CUSTOM" : "BOOKING";

  const handleCTA = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    guardedNavigate(
      `/h/${hotelSlug}/request?dept=${deptSlug}&exp=${experience.slug}&type=${requestType}`,
    );
  };

  return (
    <Link
      href={`/h/${hotelSlug}/${deptSlug}/${experience.slug}`}
      className="flex gap-4 p-4 rounded-2xl transition-colors active:bg-black/[0.03] hover:bg-[color-mix(in_oklch,var(--brand-primary)_3%,transparent)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
    >
      {/* Photo */}
      {experience.photo && (
        <div className="relative size-20 md:size-28 rounded-xl overflow-hidden flex-shrink-0">
          <Image
            src={experience.photo}
            alt={experience.name}
            fill
            sizes="(max-width: 768px) 80px, 112px"
            className="object-cover"
          />
        </div>
      )}

      {/* Text content */}
      <div className="flex-1 min-w-0">
        <h3
          className="text-sm font-semibold leading-tight mb-1 line-clamp-2"
          style={{
            fontFamily: "var(--brand-heading-font)",
            color: "var(--brand-primary)",
          }}
        >
          {experience.name}
        </h3>

        <div className="flex items-center gap-2 text-xs mb-2 flex-wrap"
          style={{ color: "color-mix(in oklch, var(--brand-primary) 60%, transparent)" }}
        >
          {experience.price_display && (
            <span className="font-medium">{experience.price_display}</span>
          )}
          {experience.duration && (
            <>
              <span className="opacity-40">·</span>
              <span>{experience.duration}</span>
            </>
          )}
          {experience.timing && (
            <>
              <span className="opacity-40">·</span>
              <span>{experience.timing}</span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={handleCTA}
          className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-semibold transition-all active:opacity-80 hover:opacity-90 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
          style={{
            backgroundColor: "var(--brand-accent)",
            color: "var(--brand-secondary)",
          }}
        >
          {ctaLabel}
        </button>
      </div>
    </Link>
  );
}
