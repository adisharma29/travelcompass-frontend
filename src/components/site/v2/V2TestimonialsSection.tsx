"use client";

import { useState, useEffect, useCallback } from "react";

interface Testimonial {
  author: string;
  text: string;
}

interface V2TestimonialsSectionProps {
  testimonials: Testimonial[];
}

export function V2TestimonialsSection({ testimonials }: V2TestimonialsSectionProps) {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => {
    setActive((i) => (i + 1) % testimonials.length);
  }, [testimonials.length]);

  const prev = useCallback(() => {
    setActive((i) => (i - 1 + testimonials.length) % testimonials.length);
  }, [testimonials.length]);

  useEffect(() => {
    if (paused) return;
    const timer = setInterval(next, 8000);
    return () => clearInterval(timer);
  }, [paused, next]);

  const t = testimonials[active];

  return (
    <section
      className="relative overflow-hidden bg-[#434431] px-6 py-16 md:px-10 md:py-24"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Film grain */}
      <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
        <svg width="100%" height="100%">
          <filter id="testimonial-grain">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#testimonial-grain)" />
        </svg>
      </div>
      <div className="relative mx-auto max-w-[900px] text-center">
        <p className="mb-6 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.25em] text-[#C9B29D]/60 md:mb-8 md:text-[12px]">
          Voices from the Trail
        </p>

        {/* Decorative quote mark */}
        <span className="block font-[family-name:var(--font-biorhyme)] text-[100px] leading-[0.6] text-[#A56014] md:text-[160px]">
          &ldquo;
        </span>

        {/* Testimonial text with crossfade */}
        <div className="relative min-h-[140px] md:min-h-[120px]">
          {testimonials.map((testimonial, i) => (
            <p
              key={i}
              className="absolute inset-0 font-[family-name:var(--font-brinnan)] text-[16px] leading-[1.7] text-[#FFE9CF] transition-opacity duration-500 md:text-[20px]"
              style={{ opacity: i === active ? 1 : 0 }}
              aria-hidden={i !== active}
            >
              {testimonial.text}
            </p>
          ))}
        </div>

        {/* Author */}
        <p className="mt-6 font-[family-name:var(--font-biorhyme)] text-[14px] tracking-[0.1em] text-[#C9B29D] transition-opacity duration-300 md:text-[15px]">
          &mdash; {t.author}
        </p>

        {/* Navigation */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={prev}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9B29D]/20 text-[#C9B29D] transition-colors hover:border-[#C9B29D]/50 hover:bg-[#C9B29D]/10"
            aria-label="Previous testimonial"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <span className="min-w-[40px] font-[family-name:var(--font-brinnan)] text-[12px] tracking-[0.1em] text-[#C9B29D]/40">
            {active + 1} / {testimonials.length}
          </span>
          <button
            onClick={next}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-[#C9B29D]/20 text-[#C9B29D] transition-colors hover:border-[#C9B29D]/50 hover:bg-[#C9B29D]/10"
            aria-label="Next testimonial"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
