import { NextResponse } from "next/server";
import { getServerApiUrl } from "@/lib/utils";
import type { Hotel } from "@/lib/concierge-types";

const API = getServerApiUrl();

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ hotelSlug: string }> },
) {
  const { hotelSlug } = await params;

  let hotel: Hotel | null = null;
  try {
    const res = await fetch(`${API}/api/v1/hotels/${hotelSlug}/`, {
      next: { revalidate: 300 },
    });
    if (res.ok) hotel = (await res.json()) as Hotel;
  } catch {
    // fall through to defaults
  }

  const name = hotel?.name ?? "Hotel Concierge";
  const shortName = hotel?.name?.split(" ").slice(0, 2).join(" ") ?? "Concierge";
  const themeColor = hotel?.primary_color ?? "#434431";
  const backgroundColor = hotel?.secondary_color ?? "#FAFAF8";
  const faviconUrl = hotel?.favicon ?? "/images/site/shared/logo.png";

  const manifest = {
    name,
    short_name: shortName,
    start_url: `/h/${hotelSlug}/`,
    scope: `/h/${hotelSlug}/`,
    display: "standalone",
    orientation: "portrait",
    theme_color: themeColor,
    background_color: backgroundColor,
    icons: [
      {
        src: faviconUrl,
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: faviconUrl,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=300",
    },
  });
}
