"use client";

import Image from "next/image";
import { useScrollProgress } from "./useScrollProgress";

const R2 = "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev";

const cells = [
  {
    src: `${R2}/images/site/home/forest-bathing-full.jpg`,
    label: "Forest Bathing",
    area: "tall" as const,
    parallaxSpeed: 0.12,
  },
  {
    src: `${R2}/images/site/home/ebiking.jpg`,
    label: "E-Biking",
    area: "sq1" as const,
    parallaxSpeed: 0.06,
  },
  {
    src: `${R2}/images/site/home/celestial-slumber-full.jpg`,
    label: "Celestial Slumber",
    area: "sq2" as const,
    parallaxSpeed: 0.09,
  },
  {
    src: `${R2}/images/site/life/basecamp-stars.jpg`,
    label: "Under the Stars",
    area: "wide" as const,
    parallaxSpeed: 0.15,
  },
];

export function V2BentoGrid() {
  const { ref, progress } = useScrollProgress();

  // Scale in from 0.95 as section enters view
  const scaleProgress = Math.min(1, progress * 2.5);
  const scale = 0.95 + scaleProgress * 0.05;
  const opacity = Math.min(1, progress * 3);

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="bg-[#FFE9CF] px-6 py-16 md:px-10 md:py-24"
    >
      <div className="mx-auto max-w-[1272px]">
        <div className="mb-8 text-center md:mb-12" style={{ opacity }}>
          <p className="mb-3 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.25em] text-[#A56014] md:text-[12px]">
            What Awaits
          </p>
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[36px] leading-[1.1] text-[#434431] md:text-[48px]">
            Worlds We Open
          </h2>
        </div>

        {/* Desktop bento grid */}
        <div
          className="hidden gap-4 md:grid"
          style={{
            gridTemplateColumns: "1.4fr 1fr",
            gridTemplateRows: "300px 300px 360px",
            gridTemplateAreas: `
              "tall sq1"
              "tall sq2"
              "wide wide"
            `,
            transform: `scale(${scale})`,
            opacity,
            willChange: "transform, opacity",
          }}
        >
          {cells.map((cell) => {
            const parallaxY = (progress - 0.5) * cell.parallaxSpeed * 100;
            return (
              <div
                key={cell.area}
                className="group relative overflow-hidden rounded-sm"
                style={{ gridArea: cell.area }}
              >
                <Image
                  src={cell.src}
                  alt={cell.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{
                    transform: `translateY(${parallaxY}px) scale(1.08)`,
                    willChange: "transform",
                  }}
                  sizes={cell.area === "wide" ? "100vw" : "50vw"}
                />
                <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#434431]/50 to-transparent px-5 pb-4 pt-10">
                  <span className="font-[family-name:var(--font-biorhyme)] text-[14px] uppercase tracking-[0.12em] text-white drop-shadow-sm">
                    {cell.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile single column */}
        <div className="flex flex-col gap-3 md:hidden" style={{ opacity }}>
          {cells.map((cell) => (
            <div
              key={cell.area}
              className="relative h-[280px] overflow-hidden rounded-sm"
            >
              <Image
                src={cell.src}
                alt={cell.label}
                fill
                className="object-cover"
                sizes="100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[#434431]/60 to-transparent px-4 pb-3 pt-8">
                <span className="font-[family-name:var(--font-biorhyme)] text-[13px] uppercase tracking-[0.12em] text-white">
                  {cell.label}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
