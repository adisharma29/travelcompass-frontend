"use client";

import Image from "next/image";
import { useState } from "react";

interface ExperienceGalleryProps {
  images: string[];
  title: string;
}

export function ExperienceGallery({ images, title }: ExperienceGalleryProps) {
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  return (
    <>
      <div className="flex gap-3 overflow-x-auto px-5 md:px-10 pb-2 scrollbar-hide">
        {images.map((src, i) => (
          <button
            key={i}
            onClick={() => setLightboxIndex(i)}
            className="relative shrink-0 w-[250px] md:w-[350px] aspect-[3/2] rounded-[10px] overflow-hidden"
          >
            <Image
              src={src}
              alt={`${title} gallery ${i + 1}`}
              fill
              className="object-cover hover:scale-105 transition-transform duration-300"
              sizes="350px"
            />
          </button>
        ))}
      </div>

      {/* Lightbox */}
      {lightboxIndex !== null && (
        <div
          className="fixed inset-0 z-[100] bg-black/90 flex items-center justify-center"
          onClick={() => setLightboxIndex(null)}
        >
          <button
            onClick={() => setLightboxIndex(null)}
            className="absolute top-4 right-4 text-white text-3xl z-10"
            aria-label="Close"
          >
            &times;
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(lightboxIndex > 0 ? lightboxIndex - 1 : images.length - 1);
            }}
            className="absolute left-4 text-white text-3xl z-10"
            aria-label="Previous"
          >
            &#8249;
          </button>
          <div
            className="relative w-[90vw] h-[70vh] md:w-[80vw] md:h-[80vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={images[lightboxIndex]}
              alt={`${title} gallery ${lightboxIndex + 1}`}
              fill
              className="object-contain"
              sizes="80vw"
            />
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setLightboxIndex(lightboxIndex < images.length - 1 ? lightboxIndex + 1 : 0);
            }}
            className="absolute right-4 text-white text-3xl z-10"
            aria-label="Next"
          >
            &#8250;
          </button>
        </div>
      )}
    </>
  );
}
