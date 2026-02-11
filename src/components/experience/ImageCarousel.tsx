"use client";

import { useRef, useState, useCallback } from "react";
import type { ExperienceImage } from "@/lib/types";
import { mediaUrl } from "@/lib/media";

interface ImageCarouselProps {
  images: ExperienceImage[];
  name: string;
}

export function ImageCarousel({ images, name }: ImageCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const startXRef = useRef(0);
  const isDragging = useRef(false);

  const goToSlide = useCallback(
    (index: number) => {
      const clamped = Math.max(0, Math.min(index, images.length - 1));
      setCurrentIndex(clamped);
      if (trackRef.current) {
        trackRef.current.style.transition = "transform 0.3s ease-out";
        trackRef.current.style.transform = `translateX(-${clamped * 100}%)`;
      }
    },
    [images.length]
  );

  const onTouchStart = useCallback((e: React.TouchEvent) => {
    startXRef.current = e.touches[0].clientX;
    isDragging.current = true;
    if (trackRef.current) trackRef.current.style.transition = "none";
  }, []);

  const onTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current || !trackRef.current || !containerRef.current)
        return;
      const diff = e.touches[0].clientX - startXRef.current;
      const offset =
        -currentIndex * 100 + (diff / containerRef.current.offsetWidth) * 100;
      trackRef.current.style.transform = `translateX(${offset}%)`;
    },
    [currentIndex]
  );

  const onTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      if (!isDragging.current || !containerRef.current) return;
      isDragging.current = false;
      const diff = e.changedTouches[0].clientX - startXRef.current;
      const threshold = containerRef.current.offsetWidth * 0.2;
      if (diff > threshold && currentIndex > 0) {
        goToSlide(currentIndex - 1);
      } else if (diff < -threshold && currentIndex < images.length - 1) {
        goToSlide(currentIndex + 1);
      } else {
        goToSlide(currentIndex);
      }
    },
    [currentIndex, images.length, goToSlide]
  );

  if (images.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="relative w-full h-[200px] overflow-hidden touch-pan-y"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div ref={trackRef} className="flex h-full">
        {images.map((img, i) => (
          <div key={i} className="min-w-full h-full">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={mediaUrl(img.image)}
              alt={img.alt_text || name}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      {/* Dots */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {images.map((_, i) => (
            <button
              key={i}
              className={`w-2 h-2 rounded-full border-none p-0 cursor-pointer transition-colors duration-200 ${
                i === currentIndex
                  ? "bg-white"
                  : "bg-white/50"
              }`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}
