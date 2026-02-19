"use client";

import { Minus, Plus } from "lucide-react";

export function GuestStepper({
  value,
  onChange,
  min = 1,
  max = 20,
}: {
  value: number;
  onChange: (n: number) => void;
  min?: number;
  max?: number;
}) {
  return (
    <div className="inline-flex items-center gap-3">
      <button
        type="button"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        className="flex items-center justify-center size-10 rounded-full border transition-colors active:scale-95 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
        style={{
          borderColor: "color-mix(in oklch, var(--brand-primary) 15%, transparent)",
          color: "var(--brand-primary)",
        }}
        aria-label="Decrease guests"
      >
        <Minus className="size-4" />
      </button>

      <span
        className="w-8 text-center text-lg font-semibold tabular-nums"
        style={{ color: "var(--brand-primary)" }}
      >
        {value}
      </span>

      <button
        type="button"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        className="flex items-center justify-center size-10 rounded-full border transition-colors active:scale-95 disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
        style={{
          borderColor: "color-mix(in oklch, var(--brand-primary) 15%, transparent)",
          color: "var(--brand-primary)",
        }}
        aria-label="Increase guests"
      >
        <Plus className="size-4" />
      </button>
    </div>
  );
}
