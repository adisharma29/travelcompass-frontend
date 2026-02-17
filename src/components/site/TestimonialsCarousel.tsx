"use client";

import { useState } from "react";

interface Testimonial {
  text: string;
  author: string;
  initial?: string;
}

interface TestimonialsCarouselProps {
  testimonials: Testimonial[];
}

const GOOGLE_ICON_URL = "https://www.gstatic.com/images/branding/product/1x/googleg_32dp.png";

function StarsWithVerified({ mobile = false }: { mobile?: boolean }) {
  const starClass = mobile ? "h-3.5 w-3.5" : "h-5 w-5";
  const checkClass = mobile ? "h-3.5 w-3.5" : "h-4 w-4";
  return (
    <div className="mt-3 flex items-center gap-0.5 text-[#e0ac39]">
      {Array.from({ length: 5 }).map((_, i) => (
        <svg key={i} className={starClass} fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
      <svg className={`ml-1 text-[#4285f4] ${checkClass}`} fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Zm4.53 7.97-5.1 5.1a1 1 0 0 1-1.42 0L7.47 12.5a1 1 0 0 1 1.41-1.41l1.84 1.83 4.39-4.39a1 1 0 0 1 1.42 1.44Z" />
      </svg>
    </div>
  );
}

function avatarFor(author: string) {
  return `https://i.pravatar.cc/120?u=${encodeURIComponent(author.toLowerCase())}`;
}

export function TestimonialsCarousel({ testimonials }: TestimonialsCarouselProps) {
  const [startIndex, setStartIndex] = useState(0);
  const [mobileIndex, setMobileIndex] = useState(0);
  const [expanded, setExpanded] = useState<Record<number, boolean>>({});

  if (testimonials.length === 0) return null;

  const visibleCount = 3;
  const maxStart = Math.max(0, testimonials.length - visibleCount);
  const mobileMax = Math.max(0, testimonials.length - 1);

  const prevDesktop = () => setStartIndex((i) => (i <= 0 ? maxStart : i - 1));
  const nextDesktop = () => setStartIndex((i) => (i >= maxStart ? 0 : i + 1));
  const prevMobile = () => setMobileIndex((i) => (i <= 0 ? mobileMax : i - 1));
  const nextMobile = () => setMobileIndex((i) => (i >= mobileMax ? 0 : i + 1));
  const toggleExpand = (idx: number) => setExpanded((prev) => ({ ...prev, [idx]: !prev[idx] }));
  const desktopPreviewLimit = 165;
  const mobilePreviewLimit = 110;

  const visibleDesktop = testimonials.slice(startIndex, startIndex + visibleCount);
  const visibleMobile = testimonials[mobileIndex];
  const mobileExpanded = Boolean(expanded[mobileIndex]);
  const mobileHasOverflow = visibleMobile.text.length > mobilePreviewLimit;
  const mobileDisplayText =
    !mobileExpanded && mobileHasOverflow
      ? `${visibleMobile.text.slice(0, mobilePreviewLimit).trimEnd()}...`
      : visibleMobile.text;

  return (
    <>
      <div className="hidden items-center gap-6 md:flex md:gap-8">
        <aside className="w-[220px] shrink-0">
          <p className="font-[family-name:var(--font-biorhyme)] text-[30px] leading-[1.1] text-[#4a4c3a]">
            Refuje
          </p>
          <div className="mt-2 flex items-center gap-0.5 text-[#e0ac39]">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg key={i} className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>
            ))}
          </div>
          <p className="mt-2 font-[family-name:var(--font-brinnan)] text-[14px] leading-[1.5] text-[#67684f]">
            5 Google reviews
          </p>
        </aside>

        <button
          onClick={prevDesktop}
          className="h-14 w-14 shrink-0 rounded-full border border-[#e2d6c6] text-[#b8ad9a] transition-colors hover:bg-[#434431] hover:text-white"
          aria-label="Previous testimonials"
        >
          <svg className="mx-auto h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
          </svg>
        </button>

        <div className="grid flex-1 grid-cols-3 gap-4">
          {visibleDesktop.map((testimonial, i) => {
            const absoluteIndex = startIndex + i;
            const isExpanded = Boolean(expanded[absoluteIndex]);
            const hasOverflow = testimonial.text.length > desktopPreviewLimit;
            const displayText =
              !isExpanded && hasOverflow
                ? `${testimonial.text.slice(0, desktopPreviewLimit).trimEnd()}...`
                : testimonial.text;

            return (
              <article
                key={`${absoluteIndex}-${testimonial.author}`}
                className="flex min-h-[335px] flex-col rounded-[18px] bg-[#ececef] px-6 py-6 shadow-[0_1px_2px_rgba(0,0,0,0.08)]"
              >
              <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
                <img
                  src={avatarFor(testimonial.author)}
                  alt={testimonial.author}
                  className="h-12 w-12 rounded-full border border-[#cfcac1] object-cover"
                  loading="lazy"
                />
                <h3 className="min-w-0 font-[family-name:var(--font-brinnan)] text-[16px] font-semibold leading-[1.3] text-[#2f3127]">
                  {testimonial.author}
                </h3>
                <img src={GOOGLE_ICON_URL} alt="Google" className="h-7 w-7 shrink-0" loading="lazy" />
              </div>

              <StarsWithVerified />

              <p className="mt-4 whitespace-pre-line font-[family-name:var(--font-brinnan)] text-[12px] leading-[1.55] text-[#2f3127]">
                {displayText}
              </p>

              {hasOverflow && (
                <button
                  type="button"
                  onClick={() => toggleExpand(absoluteIndex)}
                  className="mt-auto pt-4 text-left font-[family-name:var(--font-brinnan)] text-[12px] text-[#2f3127] underline underline-offset-2"
                >
                  {isExpanded ? "Hide" : "Read more"}
                </button>
              )}
              </article>
            );
          })}
        </div>

        <button
          onClick={nextDesktop}
          className="h-14 w-14 shrink-0 rounded-full border border-[#e2d6c6] text-[#a9a08f] transition-colors hover:bg-[#434431] hover:text-white"
          aria-label="Next testimonials"
        >
          <svg className="mx-auto h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
          </svg>
        </button>
      </div>

      <div className="md:hidden">
        <article className="flex h-[274px] flex-col rounded-[16px] bg-[#ececef] px-4 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.08)]">
          <div className="grid grid-cols-[auto_1fr_auto] items-start gap-3">
            <img
              src={avatarFor(visibleMobile.author)}
              alt={visibleMobile.author}
              className="h-10 w-10 rounded-full border border-[#cfcac1] object-cover"
              loading="lazy"
            />
            <h3 className="min-w-0 font-[family-name:var(--font-brinnan)] text-[14px] font-semibold leading-[1.3] text-[#2f3127]">
              {visibleMobile.author}
            </h3>
            <img src={GOOGLE_ICON_URL} alt="Google" className="h-6 w-6 shrink-0" loading="lazy" />
          </div>

          <StarsWithVerified mobile />

          <p className="mt-3 whitespace-pre-line font-[family-name:var(--font-brinnan)] text-[14px] leading-[1.5] text-[#2f3127]">
            {mobileDisplayText}
          </p>

          {mobileHasOverflow && (
            <button
              type="button"
              onClick={() => toggleExpand(mobileIndex)}
              className="mt-auto pt-3 text-left font-[family-name:var(--font-brinnan)] text-[13px] text-[#2f3127] underline underline-offset-2"
            >
              {mobileExpanded ? "Hide" : "Read more"}
            </button>
          )}
        </article>

        <div className="mt-3 flex items-center justify-center gap-3">
          <button
            onClick={prevMobile}
            className="h-9 w-9 rounded-full border border-[#e2d6c6] text-[#b8ad9a] transition-colors hover:bg-[#434431] hover:text-white"
            aria-label="Previous testimonial"
          >
            <svg className="mx-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <div className="font-[family-name:var(--font-brinnan)] text-[12px] text-[#7f8067]">
            {mobileIndex + 1} / {testimonials.length}
          </div>
          <button
            onClick={nextMobile}
            className="h-9 w-9 rounded-full border border-[#e2d6c6] text-[#a9a08f] transition-colors hover:bg-[#434431] hover:text-white"
            aria-label="Next testimonial"
          >
            <svg className="mx-auto h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
            </svg>
          </button>
        </div>
      </div>

    </>
  );
}
