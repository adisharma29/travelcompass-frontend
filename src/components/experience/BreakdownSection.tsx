"use client";

import { useState } from "react";
import { getBreakdownLabel } from "@/lib/utils";

interface BreakdownSectionProps {
  breakdown: Record<string, string | string[]>;
}

export function BreakdownSection({ breakdown }: BreakdownSectionProps) {
  const [expanded, setExpanded] = useState(false);

  // Order: how_it_feels first, anti_persona last, everything else in between
  const allKeys = Object.keys(breakdown);
  const orderedKeys: string[] = [];
  if (breakdown.how_it_feels) orderedKeys.push("how_it_feels");
  allKeys.forEach((k) => {
    if (k !== "how_it_feels" && k !== "anti_persona") orderedKeys.push(k);
  });
  if (breakdown.anti_persona) orderedKeys.push("anti_persona");

  return (
    <div className="mt-4">
      <button
        className={`flex items-center justify-between w-full px-4 py-3.5 bg-gradient-to-br from-[#F5F0E8] to-[#EDE8DD] border border-brand-accent/12 rounded-xl cursor-pointer transition-all duration-200 tap-highlight-none hover:from-[#EDE8DD] hover:to-[#E5E0D5] active:scale-[0.98]`}
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center gap-2.5">
          <svg
            className="w-5 h-5 text-text-secondary"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" />
            <path d="M12 16v-4M12 8h.01" />
          </svg>
          <span className="text-[13px] font-semibold text-text">
            The Breakdown
          </span>
        </div>
        <svg
          className={`w-5 h-5 text-text-secondary transition-transform duration-300 ${
            expanded ? "rotate-180" : ""
          }`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      <div
        className={`overflow-hidden transition-[max-height,padding] duration-400 ease bg-[#FDFBF7] rounded-b-xl -mt-2 ${
          expanded
            ? "max-h-[2000px] px-4 pt-5 pb-4 border border-brand-accent/8 border-t-0"
            : "max-h-0 p-0"
        }`}
      >
        {orderedKeys.map((key) => {
          const val = breakdown[key];
          if (!val || (Array.isArray(val) && val.length === 0)) return null;

          return (
            <div key={key} className="mb-5 last:mb-0">
              <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-brand-accent mb-2.5 pb-1.5 border-b border-brand-accent/10">
                {getBreakdownLabel(key)}
              </div>
              {Array.isArray(val) ? (
                <ul className="list-none p-0 m-0">
                  {val.map((item, i) => (
                    <li
                      key={i}
                      className="relative pl-4 mb-2 text-sm text-text leading-[1.65] last:mb-0 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-text-secondary"
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-[13px] text-text leading-normal py-2">
                  {val}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
