import { authFetch } from "./auth";
import { getClientApiUrl } from "./utils";
import type {
  DateRangeParams,
  DepartmentAnalytics,
  ExperienceAnalytics,
  HeatmapData,
  OverviewStats,
  QRPlacementStats,
  RequestsOverTimeEntry,
  ResponseTimesData,
} from "./analytics-types";

const API = getClientApiUrl();

function url(path: string): string {
  return `${API}/api/v1${path}`;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new Error(`Analytics API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

function buildParams(dateRange: DateRangeParams): string {
  const params = new URLSearchParams();
  if (dateRange.start && dateRange.end) {
    params.set("start", dateRange.start);
    params.set("end", dateRange.end);
  } else if (dateRange.range) {
    params.set("range", dateRange.range);
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function getAnalyticsOverview(
  hotelSlug: string,
  dateRange: DateRangeParams = { range: "7d" },
  signal?: AbortSignal,
): Promise<OverviewStats> {
  const qs = buildParams(dateRange);
  const res = await authFetch(url(`/hotels/${hotelSlug}/analytics/overview/${qs}`), { signal });
  return json<OverviewStats>(res);
}

export async function getRequestsOverTime(
  hotelSlug: string,
  dateRange: DateRangeParams = { range: "7d" },
  signal?: AbortSignal,
): Promise<RequestsOverTimeEntry[]> {
  const qs = buildParams(dateRange);
  const res = await authFetch(url(`/hotels/${hotelSlug}/analytics/requests-over-time/${qs}`), { signal });
  return json<RequestsOverTimeEntry[]>(res);
}

export async function getDepartmentAnalytics(
  hotelSlug: string,
  dateRange: DateRangeParams = { range: "7d" },
  signal?: AbortSignal,
): Promise<DepartmentAnalytics[]> {
  const qs = buildParams(dateRange);
  const res = await authFetch(url(`/hotels/${hotelSlug}/analytics/departments/${qs}`), { signal });
  return json<DepartmentAnalytics[]>(res);
}

export async function getExperienceAnalytics(
  hotelSlug: string,
  dateRange: DateRangeParams = { range: "7d" },
  signal?: AbortSignal,
): Promise<ExperienceAnalytics[]> {
  const qs = buildParams(dateRange);
  const res = await authFetch(url(`/hotels/${hotelSlug}/analytics/experiences/${qs}`), { signal });
  return json<ExperienceAnalytics[]>(res);
}

export async function getResponseTimes(
  hotelSlug: string,
  dateRange: DateRangeParams = { range: "7d" },
  signal?: AbortSignal,
): Promise<ResponseTimesData> {
  const qs = buildParams(dateRange);
  const res = await authFetch(url(`/hotels/${hotelSlug}/analytics/response-times/${qs}`), { signal });
  return json<ResponseTimesData>(res);
}

export async function getHeatmapData(
  hotelSlug: string,
  dateRange: DateRangeParams = { range: "7d" },
  signal?: AbortSignal,
): Promise<HeatmapData> {
  const qs = buildParams(dateRange);
  const res = await authFetch(url(`/hotels/${hotelSlug}/analytics/heatmap/${qs}`), { signal });
  return json<HeatmapData>(res);
}

export async function getQRPlacementStats(
  hotelSlug: string,
  dateRange: DateRangeParams = { range: "7d" },
  signal?: AbortSignal,
): Promise<QRPlacementStats[]> {
  const qs = buildParams(dateRange);
  const res = await authFetch(url(`/hotels/${hotelSlug}/analytics/qr-placements/${qs}`), { signal });
  return json<QRPlacementStats[]>(res);
}
