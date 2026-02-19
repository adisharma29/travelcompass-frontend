import { notFound } from "next/navigation";
import { getPublicDepartment, GuestApiError } from "@/lib/guest-auth";
import { DeptDetailClient } from "./dept-detail-client";

interface Props {
  params: Promise<{ hotelSlug: string; deptSlug: string }>;
}

export default async function DepartmentDetailPage({ params }: Props) {
  const { hotelSlug, deptSlug } = await params;
  let department;
  try {
    department = await getPublicDepartment(hotelSlug, deptSlug);
  } catch (err) {
    if (err instanceof GuestApiError && err.status === 404) notFound();
    throw err;
  }

  return <DeptDetailClient department={department} hotelSlug={hotelSlug} />;
}
