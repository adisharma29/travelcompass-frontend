"use client";

import { use } from "react";
import { ExperienceEditor } from "@/components/dashboard/ExperienceEditor";

export default function EditExperiencePage({
  params,
}: {
  params: Promise<{ deptSlug: string; id: string }>;
}) {
  const { deptSlug, id } = use(params);
  return <ExperienceEditor deptSlug={deptSlug} expId={Number(id)} />;
}
