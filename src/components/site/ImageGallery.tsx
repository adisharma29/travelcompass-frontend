"use client";

import Image from "next/image";
import { useState } from "react";

const galleryImages = [
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-1.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-2.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-3.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-4.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-5.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-6.jpg",
];

export function ImageGallery() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <div className="max-w-[1000px] mx-auto">
      {/* Main image */}
      <div className="relative w-full aspect-[16/9] overflow-hidden">
        <Image
          src={galleryImages[activeIndex]}
          alt={`Gallery image ${activeIndex + 1}`}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, 1000px"
          priority
        />
        {/* Right arrow */}
        <button
          onClick={() => setActiveIndex((prev) => (prev + 1) % galleryImages.length)}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Next image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M9 5l7 7-7 7" />
          </svg>
        </button>
        {/* Left arrow */}
        <button
          onClick={() => setActiveIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length)}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/40 hover:bg-black/60 rounded-full flex items-center justify-center text-white transition-colors"
          aria-label="Previous image"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </div>
      {/* Thumbnails */}
      <div className="grid grid-cols-6 gap-1 mt-1">
        {galleryImages.map((img, i) => (
          <button
            key={i}
            onClick={() => setActiveIndex(i)}
            className={`relative aspect-[4/3] overflow-hidden ${
              i === activeIndex ? "ring-2 ring-[#BA6000]" : "opacity-70 hover:opacity-100"
            } transition-opacity`}
          >
            <Image
              src={img}
              alt={`Thumbnail ${i + 1}`}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 16vw, 160px"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
