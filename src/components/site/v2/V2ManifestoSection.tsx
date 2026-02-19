"use client";

import { useRef, useState, useEffect, useCallback } from "react";

const lines = [
  "We don\u2019t sell destinations.",
  "We return you to wonder.",
];

const subtitle =
  "Refuje crafts offbeat Himalayan journeys for those who seek wonder over comfort, presence over pace, and stories over souvenirs.";

export function V2ManifestoSection() {
  const outerRef = useRef<HTMLDivElement>(null);
  const [progress, setProgress] = useState(0);

  const update = useCallback(() => {
    const el = outerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    // Start revealing when section is 30% into view (before top hits viewport edge)
    const offset = window.innerHeight * 0.3;
    const raw = (offset - rect.top) / scrollable;
    setProgress(Math.max(0, Math.min(1, raw)));
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      const frame = requestAnimationFrame(() => setProgress(1));
      return () => cancelAnimationFrame(frame);
    }

    let ticking = false;
    function onScroll() {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(() => {
          update();
          ticking = false;
        });
      }
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    update();
    return () => window.removeEventListener("scroll", onScroll);
  }, [update]);

  // Stagger reveals across the scroll range
  const totalItems = lines.length + 1;
  function itemProgress(index: number) {
    const start = (index / (totalItems + 0.5)) * 0.7;
    const end = start + 0.35;
    const raw = (progress - start) / (end - start);
    return Math.max(0, Math.min(1, raw));
  }

  const subtitleProg = itemProgress(lines.length);

  return (
    <div ref={outerRef} className="relative" style={{ height: "180vh" }}>
      <section className="sticky top-0 flex h-[100svh] items-center overflow-hidden bg-[#434431]">
        {/* Film grain overlay */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.035]">
          <svg width="100%" height="100%">
            <filter id="manifesto-grain">
              <feTurbulence
                type="fractalNoise"
                baseFrequency="0.65"
                numOctaves="3"
                stitchTiles="stitch"
              />
            </filter>
            <rect width="100%" height="100%" filter="url(#manifesto-grain)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-[1000px] px-6 md:px-10">
          {lines.map((line, i) => {
            const p = itemProgress(i);
            return (
              <p
                key={i}
                className="font-[family-name:var(--font-biorhyme)] text-[32px] leading-[1.15] text-[#FFE9CF] md:text-[72px]"
                style={{
                  opacity: p,
                  transform: `translateY(${(1 - p) * 40}px)`,
                  willChange: "transform, opacity",
                }}
              >
                {line}
              </p>
            );
          })}
          <p
            className="mt-8 max-w-[600px] font-[family-name:var(--font-brinnan)] text-[15px] leading-[1.7] text-[#C9B29D] md:mt-12 md:text-[18px]"
            style={{
              opacity: subtitleProg,
              transform: `translateY(${(1 - subtitleProg) * 40}px)`,
              willChange: "transform, opacity",
            }}
          >
            {subtitle}
          </p>
        </div>
      </section>
    </div>
  );
}
