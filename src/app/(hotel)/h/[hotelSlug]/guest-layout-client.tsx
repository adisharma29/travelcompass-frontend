"use client";

import type { ReactNode } from "react";
import { Suspense } from "react";
import type { Hotel } from "@/lib/concierge-types";
import { GuestProvider } from "@/context/GuestContext";
import { BrandFontLoader } from "@/components/guest/BrandFontLoader";
import { WhatsAppFAB } from "@/components/guest/WhatsAppFAB";

export function GuestLayoutClient({
  hotel,
  children,
}: {
  hotel: Hotel;
  children: ReactNode;
}) {
  return (
    <Suspense>
      <GuestProvider hotel={hotel}>
        <BrandFontLoader
          headingFont={hotel.heading_font}
          bodyFont={hotel.body_font}
        />
        <div
          data-guest-fonts=""
          className="min-h-dvh flex flex-col"
          style={{
            backgroundColor: "var(--brand-secondary)",
            color: "var(--brand-primary)",
          }}
        >
          {children}
          <WhatsAppFAB />
        </div>
      </GuestProvider>
    </Suspense>
  );
}
