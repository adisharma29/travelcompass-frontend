"use client";

import { useEffect, useRef } from "react";

/**
 * Dynamically loads Google Fonts for the hotel's configured heading
 * and body fonts. Injects <link> tags into <head> and cleans up on
 * unmount or when fonts change.
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
    // Deduplicate in case both are the same font
    const unique = [...new Set(fonts)];

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
