"use client";

import { useApp } from "@/context/AppContext";
import { MoodGrid } from "../mood/MoodGrid";
import { ShareButton } from "../shared/ShareButton";

export function HomeView() {
  const { destination } = useApp();

  return (
    <div className="px-4 py-3 pb-[calc(20px+env(safe-area-inset-bottom,0px))] md:p-8">
      {/* Header */}
      <div className="text-center mb-3 lg:text-left">
        <div className="flex justify-center items-start relative lg:justify-start">
          <div className="text-center lg:text-left">
            <h1 className="font-serif text-[22px] md:text-[26px] text-text-dark leading-tight">
              Field Guide - {destination.name}
            </h1>
            <p className="text-[13px] text-accent font-medium tracking-[0.4px] mt-1.5 uppercase">
              curated by Refuje
            </p>
          </div>
          <ShareButton
            className="absolute right-0 top-1"
            title={`Field Guide - ${destination.name}`}
            text="Discover your way — not places to see, but ways to spend time."
          />
        </div>
        <p className="text-[13px] text-text-secondary mt-2">
          {destination.tagline}
        </p>
      </div>

      {/* Intro */}
      <div className="mb-4">
        <p className="text-[13px] text-text leading-[1.65]">
          {destination.description}
        </p>
      </div>

      {/* Prompt */}
      <div className="text-center mb-3.5 lg:text-left">
        <h2 className="font-serif text-lg md:text-xl font-normal text-text-dark">
          How do you want to experience {destination.name}?
        </h2>
      </div>

      {/* Mood cards */}
      <MoodGrid />
    </div>
  );
}
