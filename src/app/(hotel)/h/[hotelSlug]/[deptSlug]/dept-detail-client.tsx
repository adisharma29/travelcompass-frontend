"use client";

import Image from "next/image";
import type { Department } from "@/lib/concierge-types";
import { GuestHeader } from "@/components/guest/GuestHeader";
import { ExperienceCard } from "@/components/guest/ExperienceCard";
import { GuestFooter } from "@/components/guest/GuestFooter";
import { SafeHtml } from "@/components/guest/SafeHtml";
import { getTodaySchedule } from "@/lib/schedule-utils";
import { ScheduleBadge } from "@/components/guest/ScheduleBadge";
import { WeeklySchedule } from "@/components/guest/WeeklySchedule";

export function DeptDetailClient({
  department,
  hotelSlug,
}: {
  department: Department;
  hotelSlug: string;
}) {
  const todaySchedule = getTodaySchedule(department.schedule);
  // Public API already returns only published experiences — no client filter needed
  const publishedExperiences = department.experiences ?? [];

  return (
    <>
      <GuestHeader
        title={department.name}
        backHref={`/h/${hotelSlug}`}
        breadcrumbs={[
          { label: "Home", href: `/h/${hotelSlug}` },
          { label: department.name },
        ]}
      />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto md:grid md:grid-cols-[minmax(300px,400px)_1fr] md:gap-8 md:px-6 md:py-6">
          {/* Left column: Photo + schedule */}
          <div className="md:sticky md:top-16 md:self-start">
            {/* Department photo */}
            {department.photo && (
              <div className="relative aspect-[16/9] w-full md:rounded-2xl md:overflow-hidden">
                <Image
                  src={department.photo}
                  alt={department.name}
                  fill
                  priority
                  sizes="(max-width: 768px) 100vw, 400px"
                  className="object-cover"
                />
              </div>
            )}

            {/* Schedule */}
            <div className="px-5 py-4 border-b border-black/5 md:border-b-0 md:px-0">
              <div className="flex items-center gap-2">
                <ScheduleBadge schedule={department.schedule} />
              </div>
              <p
                className="text-xs mt-1"
                style={{
                  color: "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
                }}
              >
                {todaySchedule}
              </p>

              {/* Weekly schedule */}
              <div className="mt-3">
                <WeeklySchedule schedule={department.schedule} />
              </div>
            </div>
          </div>

          {/* Right column: Description + experiences */}
          <div>
            {/* Description */}
            {department.description && (
              <div className="px-5 py-4 border-b border-black/5 md:px-0 md:border-b-0 md:pb-2">
                <SafeHtml
                  html={department.description}
                  className="prose prose-sm max-w-none"
                />
              </div>
            )}

            {/* Experiences */}
            {publishedExperiences.length > 0 && (
              <div className="py-4">
                <h2
                  className="text-base font-semibold px-5 mb-2 md:px-0"
                  style={{
                    fontFamily: "var(--brand-heading-font)",
                    color: "var(--brand-primary)",
                  }}
                >
                  Experiences
                </h2>
                <div className="divide-y divide-black/5">
                  {publishedExperiences.map((exp) => (
                    <ExperienceCard
                      key={exp.id}
                      experience={exp}
                      hotelSlug={hotelSlug}
                      deptSlug={department.slug}
                    />
                  ))}
                </div>
              </div>
            )}

            {publishedExperiences.length === 0 && (
              <div className="text-center py-12 px-4">
                <p
                  className="text-sm"
                  style={{
                    color: "color-mix(in oklch, var(--brand-primary) 40%, transparent)",
                  }}
                >
                  No experiences available at the moment.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>

      <GuestFooter />
    </>
  );
}
