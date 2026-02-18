import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { DESKTOP_BREAKPOINT, SIDEBAR_WIDTH, SNAP_HALF } from "./constants";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function isDesktop(): boolean {
  if (typeof window === "undefined") return false;
  return window.innerWidth >= DESKTOP_BREAKPOINT;
}

export function getMapPadding(sheetHeight?: number): {
  top: number;
  bottom: number;
  left: number;
  right: number;
} {
  if (isDesktop()) {
    return { top: 80, bottom: 40, left: 40, right: 40 };
  }
  const vh = sheetHeight ?? SNAP_HALF;
  return {
    top: 80,
    bottom: Math.round(window.innerHeight * (vh / 100)) + 20,
    left: 50,
    right: 50,
  };
}

export function getBreakdownLabel(key: string): string {
  const labels: Record<string, string> = {
    how_it_feels: "How it feels",
    what_to_expect: "What to expect",
    effort_and_surface: "Effort & surface",
    time_and_access: "Time & access",
    time_and_commitment: "Time & commitment",
    access_and_return: "Access & return",
    crowd_and_environment: "Crowd & environment",
    safety_and_weather: "Safety & weather",
    reward_at_end: "Reward at the end",
    water_and_food: "Water & food",
    vice_regal_lodge_practicalities: "Vice Regal Lodge practicalities",
    locals_secret: "Local's secret",
    locals_tips: "Local's tips",
    anti_persona: "Not for you if",
  };
  return (
    labels[key] ||
    key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase())
  );
}

/** Get the API base URL for server-side fetches */
export function getServerApiUrl(): string {
  return process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}

/** Get the API base URL for client-side fetches */
export function getClientApiUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
}
