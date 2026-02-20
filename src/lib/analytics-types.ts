// ============================================================
// Analytics dashboard types — mirrors backend analytics API
// ============================================================

export type DateRange = "7d" | "30d" | "90d" | "custom";

export interface DateRangeParams {
  range?: DateRange;
  start?: string; // YYYY-MM-DD
  end?: string; // YYYY-MM-DD
}

// --- Overview ---

export interface OverviewStats {
  total_requests: number;
  confirmed: number;
  escalated: number;
  conversion_rate: number;
  avg_response_min: number | null;
  trends: {
    total_requests: number | null;
    confirmed: number | null;
    escalated: number | null;
    conversion_rate: number | null;
    avg_response_min: number | null;
  };
  period_days: number;
}

// --- Requests over time ---

export interface RequestsOverTimeEntry {
  date: string; // YYYY-MM-DD
  total: number;
  confirmed: number;
}

// --- Departments ---

export interface DepartmentAnalytics {
  name: string;
  slug: string;
  requests: number;
  confirmed: number;
  avg_response_min: number | null;
}

// --- Experiences ---

export interface ExperienceAnalytics {
  name: string;
  department: string;
  requests: number;
  confirmed: number;
  conversion_pct: number;
}

// --- Response times ---

export interface ResponseTimeBucket {
  label: string;
  count: number;
  pct: number;
}

export interface StaffLeaderboardEntry {
  name: string;
  handled: number;
  avg_response_min: number | null;
  confirmed: number;
  confirmed_pct: number;
}

export interface ResponseTimesData {
  total_acknowledged: number;
  buckets: ResponseTimeBucket[];
  leaderboard: StaffLeaderboardEntry[];
}

// --- Heatmap ---

/** 7×24 matrix: heatmap[dayOfWeek][hour] = count. Mon=0, Sun=6. */
export type HeatmapData = number[][];

// --- QR Placements ---

export interface QRPlacementStats {
  placement: string;
  sessions: number;
  with_requests: number;
  conversion_pct: number;
}
