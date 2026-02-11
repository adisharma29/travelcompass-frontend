"use client";

import { useApp } from "@/context/AppContext";

export function NearbyToggle() {
  const { state, dispatch } = useApp();

  return (
    <button
      className={`absolute -top-[42px] right-3.5 z-[1] backdrop-blur-xl border rounded-3xl py-1.5 pl-2 pr-3.5 font-sans text-xs font-medium cursor-pointer flex items-center gap-2 shadow-[0_2px_12px_rgba(67,68,49,0.18)] whitespace-nowrap select-none transition-all duration-250 active:scale-[0.97] lg:fixed lg:top-auto lg:bottom-6 lg:right-auto lg:left-[calc(420px+(100vw-420px)/2)] lg:-translate-x-1/2 ${
        state.nearbyVisible
          ? "bg-text text-bg border-transparent shadow-[0_2px_12px_rgba(67,68,49,0.35)]"
          : "bg-bg/92 text-text border-text/12"
      }`}
      onClick={() => dispatch({ type: "TOGGLE_NEARBY" })}
    >
      <div
        className={`w-8 h-[18px] rounded-[9px] relative shrink-0 transition-colors duration-250 ${
          state.nearbyVisible ? "bg-[#7a9e6e]" : "bg-text/20"
        }`}
      >
        <div
          className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.5 left-0.5 shadow-[0_1px_3px_rgba(0,0,0,0.2)] transition-transform duration-250 ${
            state.nearbyVisible ? "translate-x-3.5" : ""
          }`}
        />
      </div>
      <span>Food & POIs</span>
    </button>
  );
}
