// Bottom sheet snap points (vh)
export const SNAP_COLLAPSED = 15;
export const SNAP_HALF = 45;
export const SNAP_EXPANDED = 78;
export const TRANSITION_STYLE = "height 0.45s cubic-bezier(0.32, 0.72, 0, 1)";
export const DRAG_THRESHOLD = 8;

// Desktop sidebar
export const DESKTOP_BREAKPOINT = 1024;
export const SIDEBAR_WIDTH = 420;

// Map
export const MAPBOX_STYLE =
  process.env.NEXT_PUBLIC_MAPBOX_STYLE ||
  "mapbox://styles/adisharma29/cmksp8la3000c01sh8l085gaf";
export const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

// Breakdown key labels
export const BREAKDOWN_LABELS: Record<string, string> = {
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
