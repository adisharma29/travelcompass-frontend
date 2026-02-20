"use client";

import { BrandFontLoader } from "@/components/guest/BrandFontLoader";

interface BrandPreviewProps {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  headingFont: string;
  bodyFont: string;
  logoUrl?: string | null;
  hotelName?: string;
}

export function BrandPreview({
  primaryColor,
  secondaryColor,
  accentColor,
  headingFont,
  bodyFont,
  logoUrl,
  hotelName = "Your Hotel",
}: BrandPreviewProps) {
  const headingFamily = headingFont
    ? `"${headingFont}", serif`
    : "serif";
  const bodyFamily = bodyFont
    ? `"${bodyFont}", sans-serif`
    : "sans-serif";

  return (
    <>
      <BrandFontLoader headingFont={headingFont} bodyFont={bodyFont} />
      <div
        className="rounded-lg border overflow-hidden"
        style={{ fontFamily: bodyFamily }}
      >
        {/* Hero bar */}
        <div
          className="flex items-center gap-3 px-4 py-3"
          style={{ backgroundColor: primaryColor }}
        >
          {logoUrl && (
            <img
              src={logoUrl}
              alt="Logo"
              className="h-8 w-8 rounded object-cover"
            />
          )}
          <span
            className="text-sm font-semibold"
            style={{
              color: secondaryColor,
              fontFamily: headingFamily,
            }}
          >
            {hotelName}
          </span>
        </div>

        {/* Body preview */}
        <div
          className="px-4 py-4 space-y-3"
          style={{ backgroundColor: secondaryColor }}
        >
          <h3
            className="text-lg font-semibold"
            style={{
              color: primaryColor,
              fontFamily: headingFamily,
            }}
          >
            Welcome to {hotelName}
          </h3>
          <p
            className="text-sm leading-relaxed"
            style={{ color: primaryColor }}
          >
            Discover our curated experiences and let us make your stay
            unforgettable.
          </p>
          <button
            className="px-4 py-1.5 rounded text-sm font-medium transition-opacity hover:opacity-90"
            style={{
              backgroundColor: accentColor,
              color: secondaryColor,
            }}
          >
            Explore Experiences
          </button>
        </div>
      </div>
    </>
  );
}
