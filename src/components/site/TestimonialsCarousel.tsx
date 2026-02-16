"use client";

import Image from "next/image";
import { useState } from "react";

interface Testimonial {
  text: string;
  author: string;
  location: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const visibleCount = 3;
  const maxStart = Math.max(0, testimonials.length - visibleCount);

  const prev = () => setStartIndex((i) => Math.max(0, i - 1));
  const next = () => setStartIndex((i) => Math.min(maxStart, i + 1));

  const visible = testimonials.slice(startIndex, startIndex + visibleCount);

  return (
    <div className="flex items-center gap-6 md:gap-10">
      {/* Brand badge - left side */}
      <div className="hidden md:flex flex-col items-center shrink-0 w-[120px]">
        <p className="font-[family-name:var(--font-brinnan)] text-[16px] font-bold text-[#434431] mb-1">
          Refuje
        </p>
        <div className="flex gap-0.5 mb-1">
          {[...Array(5)].map((_, i) => (
            <svg key={i} className="w-4 h-4 text-[#F4B400]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
            </svg>
          ))}
        </div>
        <p className="font-[family-name:var(--font-brinnan)] text-[12px] text-[#6B6A48] tracking-[0.5px]">
          5 Google reviews
        </p>
      </div>

      {/* Left arrow */}
      <button
        onClick={prev}
        disabled={startIndex === 0}
        className="shrink-0 w-9 h-9 rounded-full border border-[#C9B29D]/40 flex items-center justify-center text-[#434431] hover:bg-[#434431] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#434431]"
        aria-label="Previous testimonials"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Cards */}
      <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
        {visible.map((t, i) => (
          <div
            key={startIndex + i}
            className="bg-white p-5 shadow-sm flex flex-col"
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                {/* Avatar placeholder */}
                <div className="w-9 h-9 rounded-full bg-[#C9B29D]/30 flex items-center justify-center text-[#434431] font-[family-name:var(--font-brinnan)] text-[14px] font-bold">
                  {t.author[0]}
                </div>
                <p className="font-[family-name:var(--font-brinnan)] text-[13px] font-bold text-[#434431] tracking-[0.5px]">
                  {t.author} {t.location ? ` ` : ""}
                </p>
              </div>
              <Image
                src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/google-g.png"
                alt="Google"
                width={20}
                height={20}
              />
            </div>
            {/* Stars */}
            <div className="flex gap-0.5 mb-3">
              {[...Array(5)].map((_, j) => (
                <svg key={j} className="w-3.5 h-3.5 text-[#F4B400]" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                </svg>
              ))}
            </div>
            <p className="font-[family-name:var(--font-brinnan)] text-[13px] text-[#434431] leading-relaxed tracking-[0.5px] flex-1 line-clamp-4">
              {t.text}
            </p>
            <button className="mt-2 font-[family-name:var(--font-brinnan)] text-[12px] text-[#6B6A48] hover:text-[#434431] tracking-[0.5px] text-left">
              Read more
            </button>
          </div>
        ))}
      </div>

      {/* Right arrow */}
      <button
        onClick={next}
        disabled={startIndex >= maxStart}
        className="shrink-0 w-9 h-9 rounded-full border border-[#C9B29D]/40 flex items-center justify-center text-[#434431] hover:bg-[#434431] hover:text-white transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-[#434431]"
        aria-label="Next testimonials"
      >
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
}
