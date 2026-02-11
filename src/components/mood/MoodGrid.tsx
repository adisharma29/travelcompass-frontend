"use client";

import { useApp } from "@/context/AppContext";
import { MoodCard } from "./MoodCard";

export function MoodGrid() {
  const { destination, dispatch } = useApp();

  const regularMoods = destination.moods.filter((m) => !m.is_special);
  const specialMoods = destination.moods.filter((m) => m.is_special);

  return (
    <div className="flex flex-col gap-2.5">
      {regularMoods.map((mood) => (
        <MoodCard
          key={mood.slug}
          mood={mood}
          onClick={() =>
            dispatch({ type: "OPEN_MOOD", moodSlug: mood.slug })
          }
        />
      ))}

      {specialMoods.length > 0 && (
        <>
          {/* Divider */}
          <div className="text-center py-5 pb-3 relative">
            <div className="absolute top-1/2 left-0 right-0 h-px bg-text/15" />
            <span className="relative bg-bg px-4 text-[13px] text-text-secondary italic">
              Want to go deeper?
            </span>
          </div>

          {specialMoods.map((mood) => (
            <MoodCard
              key={mood.slug}
              mood={mood}
              onClick={() =>
                dispatch({ type: "OPEN_MOOD", moodSlug: mood.slug })
              }
            />
          ))}
        </>
      )}
    </div>
  );
}
