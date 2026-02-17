"use client";

import { HeroVideo } from "@/components/site/HeroVideo";
import { useScrollProgress } from "./useScrollProgress";

const R2 = "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev";

export function V2HeroSection() {
  const { ref, progress } = useScrollProgress();

  // As you scroll past hero: text fades out + scales up, video zooms in subtly
  // progress 0→0.5 = hero in view, 0.5→1 = scrolling away
  const scrollAway = Math.max(0, (progress - 0.35) / 0.35); // 0→1 as hero leaves
  const textOpacity = 1 - scrollAway;
  const textScale = 1 + scrollAway * 0.15;
  const videoScale = 1 + progress * 0.08;

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className="relative h-[100svh] w-full overflow-hidden"
    >
      {/* Desktop video with parallax zoom */}
      <div
        className="absolute inset-0 hidden md:block"
        style={{
          transform: `scale(${videoScale})`,
          willChange: "transform",
        }}
      >
        <HeroVideo
          src={`${R2}/videos/site/home/hero-desktop.mp4`}
          poster={`${R2}/images/site/home/hero-desktop-poster.webp`}
          className="h-full w-full object-cover"
        />
      </div>
      {/* Mobile video */}
      <div
        className="absolute inset-0 md:hidden"
        style={{
          transform: `scale(${videoScale})`,
          willChange: "transform",
        }}
      >
        <HeroVideo
          src={`${R2}/videos/site/home/hero-mobile.mp4`}
          poster={`${R2}/images/site/home/hero-mobile-poster.webp`}
          className="h-full w-full object-cover"
        />
      </div>

      {/* Gradient overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#434431]/20 via-transparent to-[#434431]/60" />

      {/* Typography overlay — fades + scales on scroll */}
      <div
        className="absolute inset-0 flex flex-col items-center justify-center px-6"
        style={{
          opacity: textOpacity,
          transform: `scale(${textScale}) translateY(${scrollAway * -30}px)`,
          willChange: "transform, opacity",
        }}
      >
        <h1
          className="text-center font-[family-name:var(--font-biorhyme)] text-[48px] font-bold uppercase leading-[1] tracking-[0.2em] text-white md:text-[120px] md:tracking-[0.25em]"
          style={{ textShadow: "0 2px 40px rgba(0,0,0,0.3)" }}
        >
          Wonder Again
        </h1>
        <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[13px] uppercase tracking-[0.3em] text-white/80 md:mt-6 md:text-[18px]">
          Himalayan Soul Journeys
        </p>
      </div>

      {/* Scroll indicator */}
      <div
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ opacity: textOpacity }}
      >
        <div className="h-10 w-px overflow-hidden">
          <div className="h-full w-full animate-[scrollPulse_2s_ease-in-out_infinite] bg-white/70" />
        </div>
        <style jsx>{`
          @keyframes scrollPulse {
            0% { transform: translateY(-100%); }
            50% { transform: translateY(0); }
            100% { transform: translateY(100%); }
          }
        `}</style>
      </div>
    </section>
  );
}
