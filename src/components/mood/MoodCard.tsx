"use client";

import type { Mood } from "@/lib/types";
import { mediaUrl } from "@/lib/media";

interface MoodCardProps {
  mood: Mood;
  onClick: () => void;
}

export function MoodCard({ mood, onClick }: MoodCardProps) {
  return (
    <button
      className="flex items-center gap-3.5 rounded-[14px] py-3 px-3.5 cursor-pointer transition-[transform,box-shadow] duration-200 border-none tap-highlight-none hover:translate-y-[-2px] hover:shadow-[0_4px_16px_rgba(67,68,49,0.12)] active:scale-[0.98] w-full text-left"
      style={{ background: `${mood.color}40` }}
      onClick={onClick}
    >
      <div className="w-14 h-14 rounded-[10px] overflow-hidden shrink-0">
        {mood.illustration && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={mediaUrl(mood.illustration)}
            alt={mood.name}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = "none";
            }}
          />
        )}
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-[15px] font-semibold text-text-dark mb-0.5 leading-tight">
          {mood.name}
        </div>
        <div className="text-[13px] text-text leading-normal">
          {mood.tagline}
        </div>
        {mood.support_line && (
          <div className="text-[11px] text-text-secondary mt-1 italic">
            {mood.support_line}
          </div>
        )}
      </div>
    </button>
  );
}
