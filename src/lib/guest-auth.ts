import { authFetch, ensureCSRFCookie } from "./auth";
import { getClientApiUrl, getServerApiUrl } from "./utils";
import type {
  AuthProfile,
  Department,
  Experience,
  GuestStay,
  Hotel,
  HotelEventPublic,
  RequestType,
  ServiceRequestListItem,
} from "./concierge-types";

const API = getClientApiUrl();

function url(path: string): string {
  return `${API}/api/v1${path}`;
}

/** Use the server-side URL when running in RSC (no window). */
function serverUrl(path: string): string {
  const base = typeof window === "undefined" ? getServerApiUrl() : API;
  return `${base}/api/v1${path}`;
}

interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export class GuestApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`API ${status}: ${body}`);
    this.name = "GuestApiError";
  }
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new GuestApiError(res.status, body);
  }
  return res.json() as Promise<T>;
}

// ----- Public data (no auth required) -----

export async function getHotelPublic(hotelSlug: string): Promise<Hotel> {
  const res = await fetch(serverUrl(`/hotels/${hotelSlug}/`), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  } as RequestInit);
  return json<Hotel>(res);
}

export async function getPublicDepartments(
  hotelSlug: string,
): Promise<Department[]> {
  const res = await fetch(serverUrl(`/hotels/${hotelSlug}/departments/`), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  } as RequestInit);
  const data = await json<PaginatedResponse<Department> | Department[]>(res);
  // Backend returns paginated response — unwrap it
  return Array.isArray(data) ? data : data.results;
}

export async function getPublicDepartment(
  hotelSlug: string,
  deptSlug: string,
): Promise<Department> {
  const res = await fetch(
    serverUrl(`/hotels/${hotelSlug}/departments/${deptSlug}/`),
    {
      headers: { Accept: "application/json" },
      next: { revalidate: 60 },
    } as RequestInit,
  );
  return json<Department>(res);
}

export async function getPublicExperience(
  hotelSlug: string,
  deptSlug: string,
  expSlug: string,
): Promise<Experience> {
  const res = await fetch(serverUrl(`/hotels/${hotelSlug}/departments/${deptSlug}/experiences/${expSlug}/`), {
    headers: { Accept: "application/json" },
    next: { revalidate: 60 },
  } as RequestInit);
  return json<Experience>(res);
}

export async function getPublicEvents(
  hotelSlug: string,
  params?: { featured?: boolean; all?: boolean },
): Promise<HotelEventPublic[]> {
  const qs = new URLSearchParams();
  if (params?.featured) qs.set("featured", "true");
  if (params?.all) qs.set("all", "true");
  const qsStr = qs.toString() ? `?${qs.toString()}` : "";
  const res = await fetch(serverUrl(`/hotels/${hotelSlug}/events/${qsStr}`), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  } as RequestInit);
  const data = await json<PaginatedResponse<HotelEventPublic> | HotelEventPublic[]>(res);
  return Array.isArray(data) ? data : data.results;
}

export async function getPublicEvent(
  hotelSlug: string,
  eventSlug: string,
): Promise<HotelEventPublic> {
  const res = await fetch(serverUrl(`/hotels/${hotelSlug}/events/${eventSlug}/`), {
    headers: { Accept: "application/json" },
    cache: "no-store",
  } as RequestInit);
  return json<HotelEventPublic>(res);
}

// ----- OTP flow -----

interface SendOTPResponse {
  detail: string;
}

export async function sendGuestOTP(
  phone: string,
  hotelSlug: string,
): Promise<SendOTPResponse> {
  await ensureCSRFCookie();
  const csrf =
    document.cookie.match(/csrftoken=([^;]+)/)?.[1] ?? "";

  const res = await fetch(url("/auth/otp/send/"), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": csrf,
    },
    body: JSON.stringify({ phone, hotel_slug: hotelSlug }),
  });
  return json<SendOTPResponse>(res);
}

/** Backend returns flat AuthProfile fields + stay_id (guest) or no stay_id (staff) */
type VerifyOTPResponse = AuthProfile & { stay_id?: number; stay_room_number?: string; stay_expires_at?: string };

export async function verifyGuestOTP(
  phone: string,
  code: string,
  hotelSlug: string,
  qrCode?: string | null,
): Promise<VerifyOTPResponse> {
  await ensureCSRFCookie();
  const csrf =
    document.cookie.match(/csrftoken=([^;]+)/)?.[1] ?? "";

  const body: Record<string, string> = { phone, code, hotel_slug: hotelSlug };
  if (qrCode) body.qr_code = qrCode;

  const res = await fetch(url("/auth/otp/verify/"), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": csrf,
    },
    body: JSON.stringify(body),
  });
  return json<VerifyOTPResponse>(res);
}

export async function updateGuestRoom(
  hotelSlug: string,
  stayId: number,
  roomNumber: string,
): Promise<GuestStay> {
  const res = await guestMutationFetch(
    url(`/hotels/${hotelSlug}/stays/${stayId}/`),
    {
      method: "PATCH",
      body: JSON.stringify({ room_number: roomNumber }),
    },
  );
  return json<GuestStay>(res);
}

// ----- Auth-guarded fetch with 403 interception -----

/**
 * Wraps authFetch for guest mutation endpoints (hotel-scoped).
 * On 403, dispatches a custom event so GuestContext can redirect to verify.
 */
async function guestMutationFetch(
  input: string,
  init?: RequestInit,
): Promise<Response> {
  const res = await authFetch(input, init);
  if (res.status === 403 && typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("guest:session-expired"));
  }
  return res;
}

// ----- Guest actions (auth required) -----

export interface GuestRequestPayload {
  department?: number;
  experience?: number;
  event?: number;
  occurrence_date?: string;
  request_type: RequestType;
  guest_name: string;
  guest_date?: string;
  guest_time?: string;
  guest_count?: number;
  guest_notes?: string;
  qr_code?: string;
}

export async function submitGuestRequest(
  hotelSlug: string,
  data: GuestRequestPayload,
): Promise<{ id: number; public_id: string }> {
  const res = await guestMutationFetch(url(`/hotels/${hotelSlug}/requests/`), {
    method: "POST",
    body: JSON.stringify(data),
  });
  return json<{ id: number; public_id: string }>(res);
}

export async function getMyRequests(
  hotelSlug: string,
): Promise<{ results: ServiceRequestListItem[]; count: number }> {
  try {
    const res = await authFetch(url(`/me/requests/?hotel=${encodeURIComponent(hotelSlug)}`));
    if (res.status === 403 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("guest:session-expired"));
    }
    if (!res.ok) return { results: [], count: 0 };
    const data: PaginatedResponse<ServiceRequestListItem> = await res.json();
    return { results: data.results, count: data.count };
  } catch {
    return { results: [], count: 0 };
  }
}

export async function getMyRequestsPaginated(
  hotelSlug: string,
  page: number = 1,
): Promise<{
  results: ServiceRequestListItem[];
  count: number;
  hasNext: boolean;
  hasPrev: boolean;
}> {
  try {
    const res = await authFetch(
      url(`/me/requests/?hotel=${encodeURIComponent(hotelSlug)}&page=${page}`),
    );
    if (res.status === 403 && typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("guest:session-expired"));
    }
    if (!res.ok) return { results: [], count: 0, hasNext: false, hasPrev: false };
    const data: PaginatedResponse<ServiceRequestListItem> = await res.json();
    return {
      results: data.results,
      count: data.count,
      hasNext: data.next !== null,
      hasPrev: data.previous !== null,
    };
  } catch {
    return { results: [], count: 0, hasNext: false, hasPrev: false };
  }
}

export async function getGuestProfile(): Promise<AuthProfile | null> {
  try {
    const res = await authFetch(url("/auth/profile/"));
    if (!res.ok) return null;
    return (await res.json()) as AuthProfile;
  } catch {
    return null;
  }
}
