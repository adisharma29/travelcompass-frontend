"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/context/AppContext";
import { slugify } from "@/lib/utils";

/**
 * Syncs app view state ↔ browser URL using clean paths:
 *   /shimla                              → home
 *   /shimla/mood/calm-nature             → mood
 *   /shimla/experience/heritage-walk     → experience
 *
 * Initial state is resolved server-side and passed via AppProvider,
 * so this hook only handles ongoing navigation and popstate.
 */
export function useHashRouter() {
  const { state, dispatch, destination, experiences } = useApp();
  const skipNextUpdate = useRef(false);
  const basePath = `/${destination.slug}`;

  // Sync state → URL path
  useEffect(() => {
    if (skipNextUpdate.current) {
      skipNextUpdate.current = false;
      return;
    }

    let targetPath = basePath;
    if (state.view === "mood" && state.currentMoodSlug) {
      targetPath = `${basePath}/mood/${state.currentMoodSlug}`;
    } else if (state.view === "experience" && state.currentExperienceCode) {
      const exp = experiences.find((e) => e.code === state.currentExperienceCode);
      if (exp) {
        targetPath = `${basePath}/experience/${slugify(exp.name)}`;
      }
    }

    if (window.location.pathname !== targetPath) {
      if (targetPath === basePath) {
        window.history.replaceState(null, "", targetPath);
      } else {
        window.history.pushState(null, "", targetPath);
      }
    }
  }, [state.view, state.currentMoodSlug, state.currentExperienceCode, experiences, basePath]);

  // URL path → state (popstate only — initial state comes from server)
  useEffect(() => {
    function handlePopstate() {
      const path = window.location.pathname;
      const sub = path.startsWith(basePath)
        ? path.slice(basePath.length)
        : "";
      const parts = sub.split("/").filter(Boolean);

      skipNextUpdate.current = true;

      if (parts[0] === "mood" && parts[1]) {
        const moodSlug = parts[1];
        const mood = destination.moods.find((m) => m.slug === moodSlug);
        if (mood) {
          dispatch({ type: "OPEN_MOOD", moodSlug });
        } else {
          dispatch({ type: "GO_HOME" });
        }
      } else if (parts[0] === "experience" && parts[1]) {
        const expSlug = parts[1];
        const exp = experiences.find((e) => slugify(e.name) === expSlug);
        if (exp) {
          if (exp.mood_slug) {
            dispatch({ type: "OPEN_MOOD", moodSlug: exp.mood_slug });
          }
          setTimeout(() => {
            skipNextUpdate.current = true;
            dispatch({ type: "OPEN_EXPERIENCE", experienceCode: exp.code });
          }, 50);
        } else {
          dispatch({ type: "GO_HOME" });
        }
      } else {
        dispatch({ type: "GO_HOME" });
      }
    }

    window.addEventListener("popstate", handlePopstate);
    return () => window.removeEventListener("popstate", handlePopstate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, destination.moods, destination.slug, experiences]);
}
