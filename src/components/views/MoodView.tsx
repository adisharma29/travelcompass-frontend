"use client";

import { useApp } from "@/context/AppContext";
import { ExperienceCard } from "../experience/ExperienceCard";
import { BackButton } from "../shared/BackButton";

export function MoodView() {
  const { state, dispatch, destination, experiences } = useApp();

  const mood = destination.moods.find((m) => m.slug === state.currentMoodSlug);
  if (!mood) return null;

  const moodExps = experiences.filter((e) => e.mood_slug === mood.slug);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-accent/12 sticky top-0 bg-bg z-10">
        <BackButton onClick={() => dispatch({ type: "GO_BACK" })} />
        <div className="flex-1">
          <h1 className="font-serif text-lg text-text leading-tight">
            {mood.name}
          </h1>
          <p className="text-[13px] text-text-secondary mt-0.5">
            {mood.tagline}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
        {/* Tip */}
        {mood.tip && (
          <div className="bg-accent/8 rounded-xl px-4 py-3 mb-5 flex items-start gap-2.5 border-l-[3px] border-accent">
            <span className="text-[15px] shrink-0">💡</span>
            <p className="text-[13px] text-text leading-normal">{mood.tip}</p>
          </div>
        )}

        {/* Experiences header */}
        <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-text-secondary mb-3">
          Experiences
        </div>

        {/* Experience cards */}
        <div className="flex flex-col gap-3">
          {moodExps.map((exp) => (
            <ExperienceCard
              key={exp.code}
              experience={exp}
              onClick={() =>
                dispatch({
                  type: "OPEN_EXPERIENCE",
                  experienceCode: exp.code,
                })
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}
