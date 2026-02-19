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
      images: hotel.og_image ? [{ url: hotel.og_image }] : undefined,
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
