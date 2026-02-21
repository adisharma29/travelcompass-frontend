import { notFound } from "next/navigation";
import { getPublicEvent, GuestApiError } from "@/lib/guest-auth";
import { EventDetailClient } from "./event-detail-client";

interface Props {
  params: Promise<{ hotelSlug: string; eventSlug: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { hotelSlug, eventSlug } = await params;
  let event;
  try {
    event = await getPublicEvent(hotelSlug, eventSlug);
  } catch (err) {
    if (err instanceof GuestApiError && err.status === 404) notFound();
    throw err;
  }

  return <EventDetailClient event={event} hotelSlug={hotelSlug} />;
}
