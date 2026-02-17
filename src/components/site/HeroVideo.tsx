"use client";

import { useEffect, useRef, useState } from "react";

interface HeroVideoProps {
  src: string;
  poster: string;
  className?: string;
}

export function HeroVideo({ src, poster, className }: HeroVideoProps) {
  const ref = useRef<HTMLVideoElement>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Defer video loading so poster paints as LCP without bandwidth competition
    const timer = setTimeout(() => setLoaded(true), 150);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (loaded && ref.current) {
      ref.current.play().catch(() => {});
    }
  }, [loaded]);

  return (
    <video
      ref={ref}
      autoPlay={loaded}
      loop
      muted
      playsInline
      poster={poster}
      preload="none"
      className={className}
      {...{ fetchPriority: "high" }}
    >
      {loaded && <source src={src} type="video/mp4" />}
    </video>
  );
}
