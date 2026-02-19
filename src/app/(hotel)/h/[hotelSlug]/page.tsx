import { notFound } from "next/navigation";
import { getHotelPublic, getPublicDepartments, GuestApiError } from "@/lib/guest-auth";
import { HotelLandingClient } from "./hotel-landing-client";

interface Props {
  params: Promise<{ hotelSlug: string }>;
}

export default async function HotelLandingPage({ params }: Props) {
  const { hotelSlug } = await params;
  let hotel, departments;
  try {
    [hotel, departments] = await Promise.all([
      getHotelPublic(hotelSlug),
      getPublicDepartments(hotelSlug),
    ]);
  } catch (err) {
    if (err instanceof GuestApiError && err.status === 404) notFound();
    throw err;
  }

  return <HotelLandingClient hotel={hotel} departments={departments} />;
}
