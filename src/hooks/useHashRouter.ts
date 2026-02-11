"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { slugify } from "@/lib/utils";

export function useHashRouter() {
  const { state, dispatch, destination, experiences } = useApp();
  const skipNextUpdate = useRef(false);

  // Sync state → URL hash
  useEffect(() => {
    if (skipNextUpdate.current) {
      skipNextUpdate.current = false;
      return;
    }

    let hash = "";
    if (state.view === "mood" && state.currentMoodSlug) {
      hash = `#/mood/${state.currentMoodSlug}`;
    } else if (state.view === "experience" && state.currentExperienceCode) {
      const exp = experiences.find((e) => e.code === state.currentExperienceCode);
      if (exp) {
        hash = `#/experience/${slugify(exp.name)}`;
      }
    }

    if (window.location.hash !== hash) {
      if (hash) {
        window.history.pushState(null, "", hash);
      } else {
        window.history.pushState(null, "", window.location.pathname);
      }
    }
  }, [state.view, state.currentMoodSlug, state.currentExperienceCode, experiences]);

  // URL hash → state (on popstate)
  useEffect(() => {
    function handlePopstate() {
      const hash = window.location.hash.slice(1);
      skipNextUpdate.current = true;

      if (!hash) {
        dispatch({ type: "GO_HOME" });
        return;
      }

      const parts = hash.split("/").filter(Boolean);
      if (parts[0] === "mood" && parts[1]) {
        const moodSlug = parts[1];
        const mood = destination.moods.find((m) => m.slug === moodSlug);
        if (mood) {
          dispatch({ type: "OPEN_MOOD", moodSlug });
        }
      } else if (parts[0] === "experience" && parts[1]) {
        const expSlug = parts[1];
        const exp = experiences.find((e) => slugify(e.name) === expSlug);
        if (exp) {
          // Also set the mood
          if (exp.mood_slug && state.currentMoodSlug !== exp.mood_slug) {
            dispatch({ type: "OPEN_MOOD", moodSlug: exp.mood_slug });
          }
          setTimeout(() => {
            skipNextUpdate.current = true;
            dispatch({ type: "OPEN_EXPERIENCE", experienceCode: exp.code });
          }, 50);
        }
      }
    }

    // Handle initial hash on mount
    const initialHash = window.location.hash.slice(1);
    if (initialHash) {
      handlePopstate();
    }

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
  }, [dispatch, destination.moods, experiences, state.currentMoodSlug]);
}
