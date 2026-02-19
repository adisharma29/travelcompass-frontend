"use client";

import Image from "next/image";
import type { Hotel } from "@/lib/concierge-types";

export function HotelHero({ hotel }: { hotel: Hotel }) {
  return (
    <div className="relative">
      {/* Cover image */}
      {hotel.cover_image ? (
        <div className="relative aspect-[16/9] lg:aspect-[21/9] w-full">
          <Image
            src={hotel.cover_image}
            alt={hotel.name}
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Overlay content */}
          <div className="absolute inset-x-0 bottom-0 p-5 md:p-8">
            <div className="max-w-6xl mx-auto">
              {hotel.logo && (
                <div className="relative size-12 rounded-xl overflow-hidden mb-3 ring-2 ring-white/20">
                  <Image
                    src={hotel.logo}
                    alt=""
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <h1
                className="text-white text-2xl font-bold leading-tight"
                style={{ fontFamily: "var(--brand-heading-font)" }}
              >
                {hotel.name}
              </h1>
              {hotel.tagline && (
                <p className="text-white/80 text-sm mt-1">{hotel.tagline}</p>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* No cover image — text-only header */
        <div
          className="px-5 pt-12 pb-8 md:px-8"
          style={{ backgroundColor: "var(--brand-primary)" }}
        >
          <div className="max-w-6xl mx-auto">
            {hotel.logo && (
              <div className="relative size-12 rounded-xl overflow-hidden mb-3 ring-2 ring-white/20">
                <Image
                  src={hotel.logo}
                  alt=""
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <h1
              className="text-2xl font-bold leading-tight"
              style={{
                fontFamily: "var(--brand-heading-font)",
                color: "var(--brand-secondary)",
              }}
            >
              {hotel.name}
            </h1>
            {hotel.tagline && (
              <p
                className="text-sm mt-1"
                style={{
                  color: "color-mix(in oklch, var(--brand-secondary) 80%, transparent)",
                }}
              >
                {hotel.tagline}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
