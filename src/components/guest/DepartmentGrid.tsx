"use client";

import type { Department } from "@/lib/concierge-types";
import { DepartmentCard } from "./DepartmentCard";

export function DepartmentGrid({
  departments,
  hotelSlug,
}: {
  departments: Department[];
  hotelSlug: string;
}) {
  if (!departments.length) {
    return (
      <div className="text-center py-12 px-4">
        <p
          className="text-sm"
          style={{
            color: "color-mix(in oklch, var(--brand-primary) 40%, transparent)",
          }}
        >
          No services available yet.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4 px-4 pb-4">
      {departments.map((dept) => (
        <DepartmentCard
          key={dept.id}
          department={dept}
          hotelSlug={hotelSlug}
        />
      ))}
    </div>
  );
}
