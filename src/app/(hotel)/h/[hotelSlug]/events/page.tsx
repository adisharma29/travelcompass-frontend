import { notFound } from "next/navigation";
import { getPublicEvents, GuestApiError } from "@/lib/guest-auth";
import { EventsListClient } from "./events-client";

interface Props {
  params: Promise<{ hotelSlug: string }>;
}

export default async function EventsPage({ params }: Props) {
  const { hotelSlug } = await params;
  let events;
  try {
    events = await getPublicEvents(hotelSlug);
  } catch (err) {
    if (err instanceof GuestApiError && err.status === 404) notFound();
    throw err;
  }

  return <EventsListClient events={events} hotelSlug={hotelSlug} />;
}
