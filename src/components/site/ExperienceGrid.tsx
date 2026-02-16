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
  All: "all",
  Camping: "camping",
  Culinary: "culinary",
  Culture: "culture",
  Cycling: "cycling",
  Expeditions: "expeditions",
  Hiking: "hiking",
  "Local Life": "local-life",
  Photography: "photography",
  "Riding & Driving": "ridingdriving",
  "Slow & Chill": "slowchill",
  Solace: "solace",
  Stargazing: "stargazing",
  Wildlife: "wildlife",
};

export function ExperienceGrid({ experiences }: { experiences: Experience[] }) {
  const [active, setActive] = useState("All");

  const filtered =
    active === "All"
      ? experiences
      : experiences.filter((experience) => experience.types.includes(filterKeyMap[active]));

  return (
    <>
      <section id="experiences-grid" className="bg-[#efe7dd] px-5 py-5 md:px-10 md:py-10">
        <div className="mx-auto max-w-[1272px]">
          <FilterBar active={active} onFilterChange={setActive} />
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 pb-12 pt-3 md:px-10 md:pb-20 md:pt-6">
        <div className="mx-auto max-w-[1272px]">
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 md:gap-8 lg:grid-cols-3">
              {filtered.map((experience) => (
                <ExperienceCard key={experience.slug} {...experience} />
              ))}
            </div>
          ) : (
            <div className="py-14 text-center">
              <p className="font-[family-name:var(--font-biorhyme)] text-[28px] uppercase tracking-[0.08em] text-[#434431] md:text-[36px]">
                Coming Soon
              </p>
              <p className="mt-2 font-[family-name:var(--font-brinnan)] text-[13px] text-[#5f5f4c] md:text-[16px]">
                We are crafting new experiences for this category.
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
