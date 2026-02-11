"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { useBottomSheet } from "./useBottomSheet";
import { HomeView } from "../views/HomeView";
import { MoodView } from "../views/MoodView";
import { ExperienceView } from "../views/ExperienceView";
import { NearbyToggle } from "../shared/NearbyToggle";

export function BottomSheet() {
  const { state } = useApp();
  const {
    sheetRef,
    resetSheet,
    onHandleTouchStart,
    onHandleMouseDown,
    setupScrollBehavior,
  } = useBottomSheet();

  const homeRef = useRef<HTMLDivElement>(null);
  const moodRef = useRef<HTMLDivElement>(null);
  const expRef = useRef<HTMLDivElement>(null);
  const prevView = useRef(state.view);

  // Reset sheet height on view change
  useEffect(() => {
    if (prevView.current !== state.view) {
      resetSheet();
      prevView.current = state.view;
    }
  }, [state.view, resetSheet]);

  // Setup scroll-to-expand for each view
  useEffect(() => {
    const cleanups = [
      setupScrollBehavior(homeRef.current),
      setupScrollBehavior(moodRef.current),
      setupScrollBehavior(expRef.current),
    ];
    return () => cleanups.forEach((fn) => fn?.());
  }, [setupScrollBehavior]);

  // Scroll views to top on activation
  useEffect(() => {
    if (state.view === "home" && homeRef.current)
      homeRef.current.scrollTop = 0;
    if (state.view === "mood" && moodRef.current)
      moodRef.current.scrollTop = 0;
    if (state.view === "experience" && expRef.current)
      expRef.current.scrollTop = 0;
  }, [state.view, state.currentMoodSlug, state.currentExperienceCode]);

  function viewClass(target: "home" | "mood" | "experience") {
    const base =
      "absolute inset-0 bg-bg overflow-y-auto overscroll-contain transition-[transform,opacity] duration-300 ease-in-out";
    if (state.view === target) return `${base} translate-x-0 opacity-100`;
    // If this view is "behind" the current one, slide left
    const order = { home: 0, mood: 1, experience: 2 };
    if (order[target] < order[state.view])
      return `${base} -translate-x-[30%] opacity-0 pointer-events-none`;
    // If ahead, slide right
    return `${base} translate-x-full opacity-0 pointer-events-none`;
  }

  return (
    <div
      ref={sheetRef}
      className="fixed bottom-14 left-0 right-0 z-[100] flex flex-col bg-bg rounded-t-[20px] shadow-[0_-4px_20px_rgba(67,68,49,0.15)] touch-none will-change-[height] max-h-[90dvh] h-[45dvh] lg:left-0 lg:top-0 lg:bottom-0 lg:right-auto lg:w-[420px] lg:!h-dvh lg:max-h-none lg:rounded-none lg:shadow-[4px_0_20px_rgba(67,68,49,0.12)] lg:transition-none lg:!transform-none lg:bottom-0"
      style={{ transition: "height 0.45s cubic-bezier(0.32, 0.72, 0, 1)" }}
    >
      {/* Nearby toggle floating above sheet */}
      {state.view === "experience" && <NearbyToggle />}

      {/* Drag handle (mobile only) */}
      <div
        className="flex justify-center py-[10px] pb-1 cursor-grab active:cursor-grabbing touch-none shrink-0 lg:hidden"
        onTouchStart={onHandleTouchStart}
        onMouseDown={onHandleMouseDown}
      >
        <div className="w-12 h-[5px] bg-text/40 rounded-[3px]" />
      </div>

      {/* Views container */}
      <div className="flex-1 relative overflow-hidden min-h-0 lg:h-full lg:pb-16">
        <div ref={homeRef} className={viewClass("home")}>
          <HomeView />
        </div>
        <div ref={moodRef} className={viewClass("mood")}>
          <MoodView />
        </div>
        <div ref={expRef} className={viewClass("experience")}>
          <ExperienceView />
        </div>
      </div>
    </div>
  );
}
