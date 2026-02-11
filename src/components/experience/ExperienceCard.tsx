"use client";

import type { ExperienceListItem } from "@/lib/types";

interface ExperienceCardProps {
  experience: ExperienceListItem;
  onClick: () => void;
}

export function ExperienceCard({ experience, onClick }: ExperienceCardProps) {
  return (
    <button
      className="bg-bg-card rounded-[14px] p-4 cursor-pointer transition-[transform,box-shadow] duration-200 border border-accent/10 tap-highlight-none hover:translate-y-[-2px] hover:shadow-[0_4px_16px_rgba(165,96,20,0.12)] hover:border-accent/20 active:scale-[0.99] w-full text-left"
      onClick={onClick}
    >
      <div className="flex items-start gap-3 mb-2.5">
        <div
          className="w-1.5 h-10 rounded-[3px] shrink-0 mt-0.5"
          style={{ background: experience.color }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-[15px] font-semibold text-text mb-1 leading-tight">
            {experience.display_name || experience.name}
          </h3>
          <p className="text-[13px] text-text-secondary leading-normal line-clamp-2">
            {experience.tagline}
          </p>
        </div>
      </div>
      <div className="flex gap-4 flex-wrap">
        {experience.experience_type && (
          <MetaItem label="Type" value={experience.experience_type} />
        )}
        {experience.duration && (
          <MetaItem label="Duration" value={experience.duration} />
        )}
        {experience.effort && (
          <MetaItem label="Effort" value={experience.effort} />
        )}
      </div>
    </button>
  );
}

function MetaItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="text-[11px] text-text-secondary">
      <strong className="text-text font-medium">{label}:</strong> {value}
    </div>
  );
}
