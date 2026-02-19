"use client";

import { useEffect } from "react";

export default function HotelError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Hotel page error:", error);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center gap-4 p-8 text-center">
      <h2
        className="text-lg font-semibold"
        style={{ color: "var(--brand-primary, #1a1a1a)" }}
      >
        Something went wrong
      </h2>
      <p
        className="text-sm max-w-md"
        style={{ color: "color-mix(in oklch, var(--brand-primary, #1a1a1a) 60%, transparent)" }}
      >
        An unexpected error occurred. Please try again.
      </p>
      <button
        onClick={reset}
        className="px-6 py-2.5 rounded-full text-sm font-medium transition-opacity active:opacity-80"
        style={{
          backgroundColor: "var(--brand-accent, #333)",
          color: "var(--brand-secondary, #fff)",
        }}
      >
        Try again
      </button>
    </div>
  );
}
