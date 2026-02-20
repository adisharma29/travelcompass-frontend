"use client";

import { useEffect, useRef, useState, useCallback } from "react";

/**
 * Tracks scroll progress of an element through the viewport.
 * Returns a value from 0 (element bottom at viewport bottom)
 * to 1 (element top at viewport top).
 *
 * Respects prefers-reduced-motion by returning a static 0.5.
 */
export function useScrollProgress() {
  const ref = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  const update = useCallback(() => {
    const el = ref.current;
    if (!el) return;

    const rect = el.getBoundingClientRect();
    const vh = window.innerHeight;
    // 0 when element top is at viewport bottom, 1 when element bottom is at viewport top
    const raw = (vh - rect.top) / (vh + rect.height);
    setProgress(Math.max(0, Math.min(1, raw)));
    ticking.current = false;
  }, []);

  useEffect(() => {
    const prefersReduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReduced) {
      const frame = requestAnimationFrame(() => setProgress(0.5));
      return () => cancelAnimationFrame(frame);
    }

    function onScroll() {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    }

    window.addEventListener("scroll", onScroll, { passive: true });
    update(); // initial
    return () => window.removeEventListener("scroll", onScroll);
  }, [update]);

  return { ref, progress };
}
