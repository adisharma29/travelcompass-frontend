"use client";

import { useCallback } from "react";

export function useShare() {
  const share = useCallback(
    async (title: string, text: string, url: string) => {
      if (navigator.share) {
        try {
          await navigator.share({ title, text, url });
        } catch {
          // User cancelled share
        }
      } else {
        try {
          await navigator.clipboard.writeText(url);
          alert("Link copied to clipboard!");
        } catch {
          prompt("Copy this link:", url);
        }
      }
    },
    []
  );

  return share;
}
