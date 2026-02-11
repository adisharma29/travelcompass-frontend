"use client";

import { useState } from "react";

export function TabBar() {
  const [activeTab, setActiveTab] = useState<"explore" | "stay">("explore");

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] flex h-14 bg-bg-tab border-t border-text/10 pb-[env(safe-area-inset-bottom,0px)] font-sans lg:w-[420px] lg:right-auto">
      <button
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer tap-highlight-none text-[11px] font-medium transition-colors duration-200 ${
          activeTab === "explore" ? "text-text" : "text-text-secondary"
        }`}
        onClick={() => setActiveTab("explore")}
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
            activeTab === "explore" ? "bg-bg w-14" : ""
          }`}
        >
          <svg
            className="w-[22px] h-[22px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
          </svg>
        </div>
        <span>Explore</span>
      </button>

      <button
        className={`flex-1 flex flex-col items-center justify-center gap-0.5 cursor-pointer tap-highlight-none text-[11px] font-medium transition-colors duration-200 ${
          activeTab === "stay" ? "text-text" : "text-text-secondary"
        }`}
        onClick={() => {
          setActiveTab("stay");
          alert("Coming soon!");
          setActiveTab("explore");
        }}
      >
        <div
          className={`flex items-center justify-center w-8 h-8 rounded-2xl transition-colors duration-200 ${
            activeTab === "stay" ? "bg-bg w-14" : ""
          }`}
        >
          <svg
            className="w-[22px] h-[22px]"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
        </div>
        <span>Your Stay</span>
      </button>
    </div>
  );
}
