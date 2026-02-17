"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useCallback } from "react";

interface Experience {
  slug: string;
  title: string;
  location: string;
  description: string;
  image: string;
}

interface V2ExperienceScrollerProps {
  experiences: Experience[];
}

export function V2ExperienceScroller({ experiences }: V2ExperienceScrollerProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  const scroll = useCallback((direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector("a")?.offsetWidth ?? el.clientWidth * 0.52;
    el.scrollBy({
      left: direction === "right" ? cardWidth + 24 : -(cardWidth + 24),
      behavior: "smooth",
    });
  }, []);

  return (
    <section className="bg-[#C9B29D] py-16 md:py-24">
      <div className="mb-8 px-6 text-center md:mb-12 md:px-10">
        <p className="mb-3 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.25em] text-[#434431]/60 md:text-[12px]">
          Curated Journeys
        </p>
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[32px] leading-[1.1] text-[#434431] md:text-[40px]">
          Signature Experiences
        </h2>
      </div>

      {/* Carousel with overlaid arrows */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-6 md:gap-6 md:px-[20vw] md:pb-8"
          style={{ scrollbarWidth: "none" }}
        >
          {experiences.map((exp) => (
            <Link
              key={exp.slug}
              href={`/experience/${exp.slug}`}
              className="group w-[82vw] flex-shrink-0 snap-center overflow-hidden rounded-sm md:w-[52vw]"
            >
              <div className="relative aspect-[3/2] overflow-hidden">
                <Image
                  src={exp.image}
                  alt={exp.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 768px) 82vw, 52vw"
                />
              </div>
              <div className="flex min-h-[160px] flex-col bg-[#FFE9CF] px-5 py-5 md:min-h-[180px] md:px-8 md:py-6">
                <p className="font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.14em] text-[#7C7B55] md:text-[12px]">
                  {exp.location}
                </p>
                <h3 className="mt-2 font-[family-name:var(--font-biorhyme)] text-[22px] leading-[1.15] text-[#434431] md:text-[28px]">
                  {exp.title}
                </h3>
                <p className="mt-2 line-clamp-2 font-[family-name:var(--font-brinnan)] text-[13px] leading-[1.6] text-[#7C7B55] md:text-[15px]">
                  {exp.description}
                </p>
                <span className="mt-auto inline-block pt-3 font-[family-name:var(--font-brinnan)] text-[13px] text-[#A56014] underline underline-offset-4 transition-colors group-hover:text-[#434431] md:text-[14px]">
                  Discover
                </span>
              </div>
            </Link>
          ))}
        </div>

        {/* Overlaid arrows — desktop only */}
        <button
          onClick={() => scroll("left")}
          aria-label="Previous experience"
          className="absolute left-4 top-[30%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#434431] shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white md:flex"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 15L7.5 10L12.5 5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <button
          onClick={() => scroll("right")}
          aria-label="Next experience"
          className="absolute right-4 top-[30%] z-10 hidden h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#434431] shadow-md backdrop-blur-sm transition-all hover:scale-110 hover:bg-white md:flex"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
    </section>
  );
}
