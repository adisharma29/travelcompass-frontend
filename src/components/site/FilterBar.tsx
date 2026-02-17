"use client";

import { useRef, useState, useEffect, useCallback } from "react";

interface FilterBarProps {
  active: string;
  onFilterChange: (filter: string) => void;
}

const filters = [
  "All",
  "Camping",
  "Culinary",
  "Culture",
  "Cycling",
  "Expeditions",
  "Hiking",
  "Local Life",
  "Photography",
  "Riding & Driving",
  "Slow & Chill",
  "Solace",
  "Stargazing",
  "Wildlife",
];

export function FilterBar({ active, onFilterChange }: FilterBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const checkScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 0);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 1);
  }, []);

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", checkScroll, { passive: true });
    window.addEventListener("resize", checkScroll);
    return () => {
      el.removeEventListener("scroll", checkScroll);
      window.removeEventListener("resize", checkScroll);
    };
  }, [checkScroll]);

  const scroll = (direction: "left" | "right") => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollBy({ left: direction === "left" ? -240 : 240, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#a8a37d] bg-[#efe7dd] text-[#434431]"
          aria-label="Scroll filters left"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      <div
        ref={scrollRef}
        className="flex gap-2 overflow-x-auto px-10 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => onFilterChange(filter)}
            className={`shrink-0 border px-3 py-1.5 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.1em] transition-colors md:px-4 md:py-2 md:text-[12px] ${
              filter === active
                ? "border-[#a45e1a] bg-[#b26214] text-[#f8e9d5]"
                : "border-[#a8a37d] bg-transparent text-[#434431] hover:border-[#a45e1a] hover:text-[#a45e1a]"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#a8a37d] bg-[#efe7dd] text-[#434431]"
          aria-label="Scroll filters right"
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
