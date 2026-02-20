"use client";

import { useEffect, useRef } from "react";
import { isLocalFont } from "@/lib/inject-brand-theme";

/**
 * Dynamically loads Google Fonts for the hotel's configured heading
 * and body fonts. Injects preconnect + <link> tags into <head> and
 * cleans up on unmount or when fonts change.
 *
 * Fonts that are already loaded locally (Brinnan, BioRhyme) are skipped.
 */
export function BrandFontLoader({
  headingFont,
  bodyFont,
}: {
  headingFont: string;
  bodyFont: string;
}) {
  const linksRef = useRef<HTMLLinkElement[]>([]);

  useEffect(() => {
    // Clean up previous links
    for (const link of linksRef.current) {
      link.remove();
    }
    linksRef.current = [];

    const fonts = [headingFont, bodyFont].filter(Boolean);
    // Deduplicate, then skip fonts that are already loaded locally
    const unique = [...new Set(fonts)].filter((f) => !isLocalFont(f));

    if (unique.length === 0) return;

    // Inject preconnect links (idempotent — skip if already present)
    const preconnects: { href: string; crossOrigin?: string }[] = [
      { href: "https://fonts.googleapis.com" },
      { href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
    ];
    for (const pc of preconnects) {
      if (!document.head.querySelector(`link[rel="preconnect"][href="${pc.href}"]`)) {
        const link = document.createElement("link");
        link.rel = "preconnect";
        link.href = pc.href;
        if (pc.crossOrigin) link.crossOrigin = pc.crossOrigin;
        document.head.appendChild(link);
        linksRef.current.push(link);
      }
    }

    for (const font of unique) {
      const family = font.replace(/ /g, "+");
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = `https://fonts.googleapis.com/css2?family=${family}:wght@400;500;600;700&display=swap`;
      document.head.appendChild(link);
      linksRef.current.push(link);
    }

    return () => {
      for (const link of linksRef.current) {
        link.remove();
      }
      linksRef.current = [];
    };
  }, [headingFont, bodyFont]);

  return null;
}
