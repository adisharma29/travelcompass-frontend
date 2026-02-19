"use client";

import Link from "next/link";
import Image from "next/image";
import type { Department } from "@/lib/concierge-types";
import { ScheduleBadge } from "./ScheduleBadge";

export function DepartmentCard({
  department,
  hotelSlug,
}: {
  department: Department;
  hotelSlug: string;
}) {
  const expCount = department.experiences?.length ?? 0;

  return (
    <Link
      href={`/h/${hotelSlug}/${department.slug}`}
      className="group relative block overflow-hidden rounded-2xl aspect-[3/4] transition-shadow duration-300 hover:shadow-lg hover:shadow-black/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
    >
      {/* Background image */}
      {department.photo ? (
        <Image
          src={department.photo}
          alt={department.name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{
            backgroundColor: "color-mix(in oklch, var(--brand-primary) 10%, transparent)",
          }}
        />
      )}

      {/* Icon badge */}
      {department.icon && (
        <div className="absolute top-3 right-3 z-10 size-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
          <Image
            src={department.icon}
            alt=""
            width={16}
            height={16}
            className="object-contain"
          />
        </div>
      )}

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

      {/* Content overlay */}
      <div className="absolute inset-x-0 bottom-0 p-4">
        <h3
          className="text-white text-base font-semibold mb-1 leading-tight"
          style={{ fontFamily: "var(--brand-heading-font)" }}
        >
          {department.name}
        </h3>

        {expCount > 0 && (
          <p className="text-white/70 text-xs mb-2">
            {expCount} {expCount === 1 ? "experience" : "experiences"}
          </p>
        )}

        <ScheduleBadge schedule={department.schedule} compact />
      </div>
    </Link>
  );
}
