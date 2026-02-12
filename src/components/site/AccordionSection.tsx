"use client";

import { useState } from "react";

interface AccordionItem {
  title: string;
  content: React.ReactNode;
}

interface AccordionSectionProps {
  items: AccordionItem[];
  className?: string;
}

export function AccordionSection({ items, className = "" }: AccordionSectionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {items.map((item, i) => (
        <div key={i} className="rounded-[15px] overflow-hidden">
          <button
            onClick={() => setOpenIndex(openIndex === i ? null : i)}
            className={`w-full flex items-center justify-between px-5 py-4 text-left transition-colors ${
              openIndex === i ? "bg-[#A08B7A]" : "bg-[#C9B29D]"
            }`}
          >
            <span className="font-[family-name:var(--font-brinnan)] text-[15px] font-bold text-[#434431] tracking-[1px]">
              {item.title}
            </span>
            <svg
              className={`w-4 h-4 text-[#434431] transition-transform ${openIndex === i ? "rotate-180" : ""}`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          {openIndex === i && (
            <div className="bg-[#FFF4E8] px-5 py-4">
              <div className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#434431] leading-relaxed tracking-[0.5px]">
                {item.content}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
