"use client";

import { useState } from "react";
import { ExperienceCard } from "./ExperienceCard";
import { FilterBar } from "./FilterBar";

interface Experience {
  slug: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  description: string;
  image: string;
  types: string[];
}

const filterKeyMap: Record<string, string> = {
  "All": "all",
  "Camping": "camping",
  "Culinary": "culinary",
  "Culture": "culture",
  "Cycling": "cycling",
  "Expeditions": "expeditions",
  "Hiking": "hiking",
  "Local Life": "local-life",
  "Photography": "photography",
  "Riding & Driving": "ridingdriving",
  "Slow & Chill": "slowchill",
  "Solace": "solace",
  "Stargazing": "stargazing",
  "Wildlife": "wildlife",
};

export function ExperienceGrid({ experiences }: { experiences: Experience[] }) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? experiences
      : experiences.filter((e) => e.types.includes(filterKeyMap[active]));

  return (
    <>
      <section id="experiences" className="px-5 md:px-10 py-6 max-w-[1200px] mx-auto overflow-hidden">
        <FilterBar active={active} onFilterChange={setActive} />
      </section>
      <section className="px-5 md:px-10 py-8 md:py-16 max-w-[1200px] mx-auto">
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-y-10 gap-x-5">
            {filtered.map((exp) => (
              <ExperienceCard key={exp.slug} {...exp} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[32px] font-bold text-[#434431] tracking-[2px] uppercase mb-3">
              Coming Soon
            </p>
            <p className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-[#434431] tracking-[1px]">
              We&apos;re crafting new experiences for this category. Stay tuned!
            </p>
          </div>
        )}
      </section>
    </>
  );
}
