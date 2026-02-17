"use client";

import { useEffect, useRef, useState } from "react";

interface LazyVideoProps {
  src: string;
  className?: string;
  controls?: boolean;
}

export function LazyVideo({ src, className, controls }: LazyVideoProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref}>
      {visible ? (
        <video
          autoPlay
          loop
          muted
          playsInline
          controls={controls}
          controlsList="nodownload"
          className={className}
        >
          <source src={src} type="video/mp4" />
        </video>
      ) : (
        <div className={className} />
      )}
    </div>
  );
}
