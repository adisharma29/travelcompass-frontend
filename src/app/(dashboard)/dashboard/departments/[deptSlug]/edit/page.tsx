"use client";

import { use } from "react";
import { DepartmentEditor } from "@/components/dashboard/DepartmentEditor";

export default function EditDepartmentPage({
  params,
}: {
  params: Promise<{ deptSlug: string }>;
}) {
  const { deptSlug } = use(params);
  return <DepartmentEditor deptSlug={deptSlug} />;
}
