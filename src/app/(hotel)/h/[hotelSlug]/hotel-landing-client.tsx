"use client";

import Image from "next/image";
import type { Department, Hotel } from "@/lib/concierge-types";
import { DepartmentGrid } from "@/components/guest/DepartmentGrid";
import { GuestFooter } from "@/components/guest/GuestFooter";
import { SafeHtml } from "@/components/guest/SafeHtml";

export function HotelLandingClient({
  hotel,
  departments,
}: {
  hotel: Hotel;
  departments: Department[];
}) {
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
