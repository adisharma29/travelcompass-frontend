import type {
  Destination,
  ExperienceListItem,
  ExperienceDetail,
  GeoJSONCollection,
  NearbyPlace,
} from "./types";
import { getServerApiUrl, getClientApiUrl } from "./utils";

const API_BASE = "/api/v1";

// ── Server-side fetches (used in Server Components) ──

export async function fetchDestination(slug: string): Promise<Destination> {
  const url = `${getServerApiUrl()}${API_BASE}/destinations/${slug}/`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch destination: ${res.status}`);
  return res.json();
}

export async function fetchExperiences(slug: string): Promise<ExperienceListItem[]> {
  const url = `${getServerApiUrl()}${API_BASE}/destinations/${slug}/experiences/`;
  const res = await fetch(url, { next: { revalidate: 300 } });
  if (!res.ok) throw new Error(`Failed to fetch experiences: ${res.status}`);
  const data = await res.json();
  // Handle DRF pagination wrapper
  return Array.isArray(data) ? data : data.results ?? [];
}

// ── Client-side fetches ──

export async function fetchGeoJSON(slug: string): Promise<GeoJSONCollection> {
  const url = `${getClientApiUrl()}${API_BASE}/destinations/${slug}/geojson/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch GeoJSON: ${res.status}`);
  return res.json();
}

export async function fetchExperienceDetail(
  slug: string,
  code: string
): Promise<ExperienceDetail> {
  const url = `${getClientApiUrl()}${API_BASE}/destinations/${slug}/experiences/${code}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch experience detail: ${res.status}`);
  return res.json();
}

export async function fetchNearbyPlaces(
  slug: string,
  code: string
): Promise<NearbyPlace[]> {
  const url = `${getClientApiUrl()}${API_BASE}/destinations/${slug}/nearby-places/${code}/`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Failed to fetch nearby places: ${res.status}`);
  return res.json();
}
