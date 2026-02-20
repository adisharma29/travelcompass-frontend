import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getServerApiUrl } from "@/lib/utils";
import type { Hotel } from "@/lib/concierge-types";
import { GuestLayoutClient } from "./guest-layout-client";

const API = getServerApiUrl();

async function fetchHotel(hotelSlug: string): Promise<Hotel | null> {
  try {
    const res = await fetch(`${API}/api/v1/hotels/${hotelSlug}/`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    return (await res.json()) as Hotel;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ hotelSlug: string }>;
}): Promise<Metadata> {
  const { hotelSlug } = await params;
  const hotel = await fetchHotel(hotelSlug);
  if (!hotel) return { title: "Hotel not found" };

  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.refuje.com";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://refuje.com";
  const ogImage = hotel.og_image
    ? hotel.og_image.startsWith("http") ? hotel.og_image : `${apiUrl}${hotel.og_image}`
    : undefined;
  const canonicalUrl = `${siteUrl}/h/${hotelSlug}`;

  return {
    title: {
      template: `%s | ${hotel.name}`,
      default: hotel.name,
    },
    description: hotel.tagline || hotel.description || `Welcome to ${hotel.name}`,
    icons: hotel.favicon ? { icon: hotel.favicon } : undefined,
    manifest: `/h/${hotelSlug}/manifest.json`,
    openGraph: {
      title: hotel.name,
      description: hotel.tagline || hotel.description,
      url: canonicalUrl,
      siteName: hotel.name,
      type: "website",
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
    twitter: {
      card: ogImage ? "summary_large_image" : "summary",
      title: hotel.name,
      description: hotel.tagline || hotel.description,
      images: ogImage ? [ogImage] : undefined,
    },
    other: {
      "theme-color": hotel.primary_color,
    },
  };
}

export default async function GuestHotelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ hotelSlug: string }>;
}) {
  const { hotelSlug } = await params;
  const hotel = await fetchHotel(hotelSlug);
  if (!hotel) notFound();

  return <GuestLayoutClient hotel={hotel}>{children}</GuestLayoutClient>;
}
