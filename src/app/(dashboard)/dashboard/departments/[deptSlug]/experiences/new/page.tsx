"use client";

import { use } from "react";
import { ExperienceEditor } from "@/components/dashboard/ExperienceEditor";

export default function NewExperiencePage({
  params,
}: {
  params: Promise<{ deptSlug: string }>;
}) {
  const { deptSlug } = use(params);
  return <ExperienceEditor deptSlug={deptSlug} />;
}
