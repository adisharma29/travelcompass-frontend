import { notFound } from "next/navigation";
import { getHotelPublic, GuestApiError } from "@/lib/guest-auth";
import { RequestsClient } from "./requests-client";

interface Props {
  params: Promise<{ hotelSlug: string }>;
}

export default async function RequestsPage({ params }: Props) {
  const { hotelSlug } = await params;
  let hotel;
  try {
    hotel = await getHotelPublic(hotelSlug);
  } catch (err) {
    if (err instanceof GuestApiError && err.status === 404) notFound();
    throw err;
  }

  return <RequestsClient hotel={hotel} />;
}
