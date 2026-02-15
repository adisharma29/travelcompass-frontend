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
    el.scrollBy({ left: direction === "left" ? -200 : 200, behavior: "smooth" });
  };

  return (
    <div className="relative flex items-center">
      {canScrollLeft && (
        <button
          onClick={() => scroll("left")}
          className="absolute left-0 z-10 w-8 h-8 flex items-center justify-center bg-[#FFE9CF] text-[#434431]"
          aria-label="Scroll filters left"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}
      <div
        ref={scrollRef}
        className="flex gap-8 md:gap-[46px] overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden px-2"
      >
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => onFilterChange(f)}
            className={`shrink-0 font-[family-name:var(--font-biorhyme)] text-[14px] md:text-[18px] px-1 py-0.5 transition-colors ${
              f === active
                ? "text-[#BA6000] border-b-2 border-[#BA6000]"
                : "text-[#434431] hover:text-[#BA6000]"
            }`}
          >
            {f}
          </button>
        ))}
      </div>
      {canScrollRight && (
        <button
          onClick={() => scroll("right")}
          className="absolute right-0 z-10 w-8 h-8 flex items-center justify-center bg-[#FFE9CF] text-[#434431]"
          aria-label="Scroll filters right"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
