"use client";

import { useRef, useState, useCallback, useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface GalleryImage {
  src: string;
  alt: string;
}

export function ExperienceGallery({ images }: { images: GalleryImage[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [current, setCurrent] = useState(0);

  const handleScroll = useCallback(() => {
    const el = scrollRef.current;
    if (!el) return;
    const idx = Math.round(el.scrollLeft / el.clientWidth);
    setCurrent(idx);
  }, []);

  const scrollToSlide = useCallback((index: number) => {
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" });
  }, []);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    el.addEventListener("scroll", handleScroll, { passive: true });
    return () => el.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  if (!images.length) {
    return (
      <div
        className="aspect-[3/2] w-full"
        style={{
          backgroundColor: "color-mix(in oklch, var(--brand-primary) 5%, transparent)",
        }}
      />
    );
  }

  if (images.length === 1) {
    return (
      <div className="relative aspect-[3/2] w-full">
        <Image
          src={images[0].src}
          alt={images[0].alt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div>
      {/* Main gallery */}
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none"
          style={{ scrollbarWidth: "none", WebkitOverflowScrolling: "touch" }}
        >
          {images.map((img, i) => (
            <div
              key={i}
              className="relative aspect-[3/2] w-full flex-shrink-0 snap-center"
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                priority={i === 0}
                loading={i === 0 ? "eager" : "lazy"}
                sizes="100vw"
                className="object-cover"
              />
            </div>
          ))}
        </div>

        {/* Desktop arrows */}
        <button
          type="button"
          onClick={() => scrollToSlide(current - 1)}
          disabled={current === 0}
          className="hidden md:flex absolute left-3 top-1/2 -translate-y-1/2 items-center justify-center size-10 rounded-full bg-white/80 shadow-lg transition-opacity disabled:opacity-30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
          aria-label="Previous image"
        >
          <ChevronLeft className="size-5 text-gray-800" />
        </button>
        <button
          type="button"
          onClick={() => scrollToSlide(current + 1)}
          disabled={current === images.length - 1}
          className="hidden md:flex absolute right-3 top-1/2 -translate-y-1/2 items-center justify-center size-10 rounded-full bg-white/80 shadow-lg transition-opacity disabled:opacity-30 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
          aria-label="Next image"
        >
          <ChevronRight className="size-5 text-gray-800" />
        </button>

        {/* Desktop counter overlay */}
        <div className="hidden md:block absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-xs font-medium">
          {current + 1}/{images.length}
        </div>
      </div>

      {/* Mobile dots */}
      <div className="flex md:hidden items-center justify-center gap-1.5 py-3">
        {images.map((_, i) => (
          <button
            key={i}
            type="button"
            onClick={() => scrollToSlide(i)}
            className="rounded-full transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
            style={{
              width: i === current ? 16 : 6,
              height: 6,
              backgroundColor: i === current
                ? "var(--brand-primary)"
                : "color-mix(in oklch, var(--brand-primary) 20%, transparent)",
            }}
            aria-label={`Go to image ${i + 1}`}
          />
        ))}
        <span
          className="ml-2 text-xs font-medium"
          style={{ color: "color-mix(in oklch, var(--brand-primary) 40%, transparent)" }}
        >
          {current + 1}/{images.length}
        </span>
      </div>

      {/* Desktop thumbnails */}
      {images.length > 1 && (
        <div className="hidden md:flex gap-2 mt-3 px-1">
          {images.map((img, i) => (
            <button
              key={i}
              type="button"
              onClick={() => scrollToSlide(i)}
              className={`relative size-16 rounded-lg overflow-hidden flex-shrink-0 transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 ${
                i === current
                  ? "ring-2 ring-[var(--brand-accent)]"
                  : "opacity-60 hover:opacity-100"
              }`}
              aria-label={`View image ${i + 1}`}
            >
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
