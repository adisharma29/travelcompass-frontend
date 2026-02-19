import { notFound } from "next/navigation";
import { getPublicExperience, getPublicDepartment, GuestApiError } from "@/lib/guest-auth";
import { ExpDetailClient } from "./exp-detail-client";

interface Props {
  params: Promise<{ hotelSlug: string; deptSlug: string; expSlug: string }>;
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { hotelSlug, deptSlug, expSlug } = await params;
  let experience, department;
  try {
    [experience, department] = await Promise.all([
      getPublicExperience(hotelSlug, deptSlug, expSlug),
      getPublicDepartment(hotelSlug, deptSlug),
    ]);
  } catch (err) {
    if (err instanceof GuestApiError && err.status === 404) notFound();
    throw err;
  }

  return (
    <ExpDetailClient
      experience={experience}
      hotelSlug={hotelSlug}
      deptSlug={deptSlug}
      departmentName={department.name}
    />
  );
}
