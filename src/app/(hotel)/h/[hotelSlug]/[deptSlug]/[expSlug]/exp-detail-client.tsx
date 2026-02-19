"use client";

import type { Experience } from "@/lib/concierge-types";
import { GuestHeader } from "@/components/guest/GuestHeader";
import { ExperienceGallery } from "@/components/guest/ExperienceGallery";
import { StickyBookingBar } from "@/components/guest/StickyBookingBar";
import { SafeHtml } from "@/components/guest/SafeHtml";
import { GuestFooter } from "@/components/guest/GuestFooter";
import { useGuest } from "@/context/GuestContext";
import { Clock, Users, Calendar } from "lucide-react";

const CTA_LABELS: Record<string, string> = {
  DINING: "Book Now",
  SPA: "Book Now",
  ACTIVITY: "Book Now",
  TOUR: "Book Now",
  TRANSPORT: "Reserve",
  OTHER: "Request",
};

export function ExpDetailClient({
  experience,
  hotelSlug,
  deptSlug,
  departmentName,
}: {
  experience: Experience;
  hotelSlug: string;
  deptSlug: string;
  departmentName: string;
}) {
  const { guardedNavigate } = useGuest();
  const ctaLabel = CTA_LABELS[experience.category] ?? "Book Now";
  const requestType = experience.category === "OTHER" ? "CUSTOM" : "BOOKING";

  const handleBook = () => {
    guardedNavigate(
      `/h/${hotelSlug}/request?dept=${deptSlug}&exp=${experience.slug}&type=${requestType}`,
    );
  };

  // Build gallery images list: cover_image first, then gallery_images
  const galleryImages = [
    ...(experience.cover_image
      ? [{ src: experience.cover_image, alt: experience.name }]
      : experience.photo
        ? [{ src: experience.photo, alt: experience.name }]
        : []),
    ...(experience.gallery_images ?? []).map((img) => ({
      src: img.image,
      alt: img.alt_text || experience.name,
    })),
  ];

  // Shared content sections
  const titleSection = (
    <div className="px-5 pt-5 pb-3 md:px-0">
      <h1
        className="text-xl font-bold leading-tight mb-1"
        style={{
          fontFamily: "var(--brand-heading-font)",
          color: "var(--brand-primary)",
        }}
      >
        {experience.name}
      </h1>
      {experience.price_display && (
        <p
          className="text-sm font-medium"
          style={{
            color: "color-mix(in oklch, var(--brand-primary) 70%, transparent)",
          }}
        >
          {experience.price_display}
        </p>
      )}
    </div>
  );

  const badgesSection = (
    <div className="flex flex-wrap gap-2 px-5 pb-4 md:px-0">
      {experience.category && (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: "color-mix(in oklch, var(--brand-accent) 10%, transparent)",
            color: "var(--brand-accent)",
          }}
        >
          {experience.category.charAt(0) + experience.category.slice(1).toLowerCase()}
        </span>
      )}
      {experience.duration && (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: "color-mix(in oklch, var(--brand-primary) 6%, transparent)",
            color: "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
          }}
        >
          <Clock className="size-3" />
          {experience.duration}
        </span>
      )}
      {experience.timing && (
        <span
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium"
          style={{
            backgroundColor: "color-mix(in oklch, var(--brand-primary) 6%, transparent)",
            color: "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
          }}
        >
          <Calendar className="size-3" />
          {experience.timing}
        </span>
      )}
    </div>
  );

  const descriptionSection = experience.description ? (
    <div className="px-5 py-4 border-t border-black/5 md:px-0">
      <SafeHtml
        html={experience.description}
        className="prose prose-sm max-w-none"
      />
    </div>
  ) : null;

  const highlightsSection = experience.highlights?.length > 0 ? (
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
        {experience.highlights.map((h, i) => (
          <li
            key={i}
            className="flex items-start gap-2 text-sm"
            style={{
              color: "color-mix(in oklch, var(--brand-primary) 70%, transparent)",
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

  const detailsSection = (experience.capacity || experience.duration || experience.timing) ? (
    <div className="px-5 py-4 border-t border-black/5 md:px-0">
      <h2
        className="text-sm font-semibold mb-3"
        style={{
          fontFamily: "var(--brand-heading-font)",
          color: "var(--brand-primary)",
        }}
      >
        Details
      </h2>
      <dl className="space-y-2 text-sm">
        {experience.capacity && (
          <div className="flex items-center gap-2">
            <Users className="size-4 flex-shrink-0" style={{ color: "var(--brand-accent)" }} />
            <dt className="font-medium">Capacity:</dt>
            <dd style={{ color: "color-mix(in oklch, var(--brand-primary) 70%, transparent)" }}>
              {experience.capacity}
            </dd>
          </div>
        )}
        {experience.duration && (
          <div className="flex items-center gap-2">
            <Clock className="size-4 flex-shrink-0" style={{ color: "var(--brand-accent)" }} />
            <dt className="font-medium">Duration:</dt>
            <dd style={{ color: "color-mix(in oklch, var(--brand-primary) 70%, transparent)" }}>
              {experience.duration}
            </dd>
          </div>
        )}
        {experience.timing && (
          <div className="flex items-center gap-2">
            <Calendar className="size-4 flex-shrink-0" style={{ color: "var(--brand-accent)" }} />
            <dt className="font-medium">Timing:</dt>
            <dd style={{ color: "color-mix(in oklch, var(--brand-primary) 70%, transparent)" }}>
              {experience.timing}
            </dd>
          </div>
        )}
      </dl>
    </div>
  ) : null;

  return (
    <>
      <GuestHeader
        title={departmentName}
        backHref={`/h/${hotelSlug}/${deptSlug}`}
        breadcrumbs={[
          { label: "Home", href: `/h/${hotelSlug}` },
          { label: departmentName, href: `/h/${hotelSlug}/${deptSlug}` },
          { label: experience.name },
        ]}
      />

      <main className="flex-1 pb-24 md:pb-0">
        {/* Desktop: 2-column layout */}
        <div className="max-w-6xl mx-auto md:grid md:grid-cols-[1fr_380px] md:gap-8 md:px-6 md:py-6">
          {/* Left column: Gallery */}
          <div>
            <div className="md:rounded-2xl md:overflow-hidden">
              <ExperienceGallery images={galleryImages} />
            </div>

            {/* Mobile: content below gallery */}
            <div className="md:hidden">
              {titleSection}
              {badgesSection}
              {descriptionSection}
              {highlightsSection}
              {detailsSection}
            </div>
          </div>

          {/* Right column: Info + desktop booking card */}
          <div className="hidden md:block">
            {titleSection}
            {badgesSection}
            {descriptionSection}
            {highlightsSection}
            {detailsSection}

            {/* Desktop booking card */}
            <div
              className="sticky top-20 mt-4 p-5 rounded-2xl border"
              style={{
                borderColor: "color-mix(in oklch, var(--brand-primary) 10%, transparent)",
              }}
            >
              {experience.price_display && (
                <p
                  className="text-lg font-semibold mb-4"
                  style={{ color: "var(--brand-primary)" }}
                >
                  {experience.price_display}
                </p>
              )}
              <button
                type="button"
                onClick={handleBook}
                className="w-full py-3 rounded-full text-sm font-semibold transition-all active:opacity-80 hover:opacity-90 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
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
        </div>
      </main>

      {/* Mobile sticky bar only */}
      <div className="md:hidden">
        <StickyBookingBar experience={experience} hotelSlug={hotelSlug} deptSlug={deptSlug} />
      </div>

      <GuestFooter />
    </>
  );
}
