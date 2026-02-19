import { authFetch } from "./auth";
import { getClientApiUrl } from "./utils";
import type {
  AuthProfile,
  DashboardStats,
  Department,
  Experience,
  ExperienceImage,
  Hotel,
  HotelMembership,
  HotelSettings,
  Notification,
  PaginatedResponse,
  QRCode,
  ServiceRequest,
  ServiceRequestListItem,
} from "./concierge-types";

const API = getClientApiUrl();

function url(path: string): string {
  return `${API}/api/v1${path}`;
}

async function json<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.text().catch(() => "");
    throw new ApiError(res.status, body);
  }
  return res.json() as Promise<T>;
}

export class ApiError extends Error {
  constructor(
    public status: number,
    public body: string,
  ) {
    super(`API ${status}: ${body}`);
    this.name = "ApiError";
  }
}

// ----- Auth / Profile -----

export async function getProfile(): Promise<AuthProfile> {
  const res = await authFetch(url("/auth/profile/"));
  return json<AuthProfile>(res);
}

// ----- Hotels -----

export async function getMyHotels(): Promise<HotelMembership[]> {
  const res = await authFetch(url("/me/hotels/"));
  return json<HotelMembership[]>(res);
}

export async function getHotelPublic(hotelSlug: string): Promise<Hotel> {
  const res = await authFetch(url(`/hotels/${hotelSlug}/`));
  return json<Hotel>(res);
}

export async function getHotelSettings(
  hotelSlug: string,
): Promise<HotelSettings> {
  const res = await authFetch(url(`/hotels/${hotelSlug}/admin/settings/`));
  return json<HotelSettings>(res);
}

export async function updateHotelSettings(
  hotelSlug: string,
  data: Partial<HotelSettings> | FormData,
): Promise<HotelSettings> {
  const isFormData = data instanceof FormData;
  const res = await authFetch(url(`/hotels/${hotelSlug}/admin/settings/`), {
    method: "PATCH",
    body: isFormData ? data : JSON.stringify(data),
  });
  return json<HotelSettings>(res);
}

// ----- Dashboard -----

export async function getDashboardStats(
  hotelSlug: string,
  signal?: AbortSignal,
): Promise<DashboardStats> {
  const res = await authFetch(url(`/hotels/${hotelSlug}/dashboard/`), { signal });
  return json<DashboardStats>(res);
}

// ----- Requests -----

export async function getRequests(
  hotelSlug: string,
  params?: URLSearchParams,
  signal?: AbortSignal,
): Promise<ServiceRequestListItem[]> {
  const qs = params ? `?${params.toString()}` : "";
  const res = await authFetch(url(`/hotels/${hotelSlug}/requests/list/${qs}`), { signal });
  const page = await json<PaginatedResponse<ServiceRequestListItem>>(res);
  return page.results;
}

export async function getRequest(
  hotelSlug: string,
  id: number,
): Promise<ServiceRequest> {
  const res = await authFetch(url(`/hotels/${hotelSlug}/requests/${id}/`));
  return json<ServiceRequest>(res);
}

export async function getRequestByPublicId(
  publicId: string,
): Promise<ServiceRequest & { hotel_slug: string }> {
  const res = await authFetch(url(`/me/requests/${publicId}/`));
  return json<ServiceRequest & { hotel_slug: string }>(res);
}

export async function acknowledgeRequest(
  hotelSlug: string,
  id: number,
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/requests/${id}/acknowledge/`),
    { method: "POST" },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

export async function updateRequest(
  hotelSlug: string,
  id: number,
  data: { status?: string; staff_notes?: string; confirmation_reason?: string },
): Promise<ServiceRequest> {
  const res = await authFetch(url(`/hotels/${hotelSlug}/requests/${id}/`), {
    method: "PATCH",
    body: JSON.stringify(data),
  });
  return json<ServiceRequest>(res);
}

export async function addRequestNote(
  hotelSlug: string,
  id: number,
  note: string,
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/requests/${id}/notes/`),
    {
      method: "POST",
      body: JSON.stringify({ note }),
    },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

export async function takeOwnership(
  hotelSlug: string,
  id: number,
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/requests/${id}/take-ownership/`),
    { method: "POST" },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

// ----- Departments -----

export async function getDepartments(
  hotelSlug: string,
): Promise<Department[]> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/`),
  );
  const page = await json<PaginatedResponse<Department>>(res);
  return page.results;
}

export async function getDepartment(
  hotelSlug: string,
  deptSlug: string,
): Promise<Department> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/`),
  );
  return json<Department>(res);
}

export async function createDepartment(
  hotelSlug: string,
  data: FormData,
): Promise<Department> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/`),
    { method: "POST", body: data },
  );
  return json<Department>(res);
}

export async function updateDepartment(
  hotelSlug: string,
  deptSlug: string,
  data: FormData,
): Promise<Department> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/`),
    { method: "PATCH", body: data },
  );
  return json<Department>(res);
}

export async function deleteDepartment(
  hotelSlug: string,
  deptSlug: string,
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/`),
    { method: "DELETE" },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

// ----- Experiences -----

export async function getExperience(
  hotelSlug: string,
  deptSlug: string,
  expId: number,
): Promise<Experience> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/experiences/${expId}/`),
  );
  return json<Experience>(res);
}

export async function createExperience(
  hotelSlug: string,
  deptSlug: string,
  data: FormData,
): Promise<Experience> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/experiences/`),
    { method: "POST", body: data },
  );
  return json<Experience>(res);
}

export async function updateExperience(
  hotelSlug: string,
  deptSlug: string,
  expId: number,
  data: FormData,
): Promise<Experience> {
  const res = await authFetch(
    url(
      `/hotels/${hotelSlug}/admin/departments/${deptSlug}/experiences/${expId}/`,
    ),
    { method: "PATCH", body: data },
  );
  return json<Experience>(res);
}

export async function deleteExperience(
  hotelSlug: string,
  deptSlug: string,
  expId: number,
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/experiences/${expId}/`),
    { method: "DELETE" },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

// ----- Reorder -----

export async function reorderDepartments(
  hotelSlug: string,
  order: number[],
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/reorder/`),
    { method: "PATCH", body: JSON.stringify({ order }) },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

export async function reorderExperiences(
  hotelSlug: string,
  deptSlug: string,
  order: number[],
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/experiences/reorder/`),
    { method: "PATCH", body: JSON.stringify({ order }) },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

// ----- Experience Images -----

export async function uploadExperienceImage(
  hotelSlug: string,
  deptSlug: string,
  expId: number,
  data: FormData,
): Promise<ExperienceImage> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/experiences/${expId}/images/`),
    { method: "POST", body: data },
  );
  return json<ExperienceImage>(res);
}

export async function deleteExperienceImage(
  hotelSlug: string,
  deptSlug: string,
  imageId: number,
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/experience-images/${imageId}/`),
    { method: "DELETE" },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

export async function reorderExperienceImages(
  hotelSlug: string,
  deptSlug: string,
  expId: number,
  order: number[],
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/departments/${deptSlug}/experiences/${expId}/images/reorder/`),
    { method: "PATCH", body: JSON.stringify({ order }) },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

// ----- Members -----

export async function getMembers(
  hotelSlug: string,
): Promise<HotelMembership[]> {
  const res = await authFetch(url(`/hotels/${hotelSlug}/admin/members/`));
  const page = await json<PaginatedResponse<HotelMembership>>(res);
  return page.results;
}

export async function inviteMember(
  hotelSlug: string,
  data: { email?: string; role: string; department?: number; phone?: string; first_name?: string; last_name?: string },
): Promise<HotelMembership> {
  const res = await authFetch(url(`/hotels/${hotelSlug}/admin/members/`), {
    method: "POST",
    body: JSON.stringify(data),
  });
  return json<HotelMembership>(res);
}

export async function updateMember(
  hotelSlug: string,
  id: number,
  data: { role?: string; is_active?: boolean; department?: number },
): Promise<HotelMembership> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/members/${id}/`),
    { method: "PATCH", body: JSON.stringify(data) },
  );
  return json<HotelMembership>(res);
}

// ----- QR Codes -----

export async function getQRCodes(hotelSlug: string): Promise<QRCode[]> {
  const res = await authFetch(url(`/hotels/${hotelSlug}/admin/qr-codes/`));
  const page = await json<PaginatedResponse<QRCode>>(res);
  return page.results;
}

export async function createQRCode(
  hotelSlug: string,
  data: { placement: string; label: string; department?: number },
): Promise<QRCode> {
  const res = await authFetch(url(`/hotels/${hotelSlug}/admin/qr-codes/`), {
    method: "POST",
    body: JSON.stringify(data),
  });
  return json<QRCode>(res);
}

export async function deleteQRCode(
  hotelSlug: string,
  id: number,
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/admin/qr-codes/${id}/`),
    { method: "DELETE" },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

// ----- Notifications -----

export async function getNotifications(
  filter?: "unread" | "all",
): Promise<{ results: Notification[]; count: number }> {
  const qs = filter === "unread" ? "?is_read=false" : "";
  const res = await authFetch(url(`/me/notifications/${qs}`));
  const data = await json<PaginatedResponse<Notification>>(res);
  return { results: data.results, count: data.count };
}

export async function getUnreadNotificationCount(): Promise<number> {
  const res = await authFetch(url("/me/notifications/?is_read=false"));
  const data = await json<PaginatedResponse<Notification>>(res);
  return data.count;
}

export async function markNotificationsRead(
  ids: number[],
): Promise<void> {
  const res = await authFetch(url("/me/notifications/mark-read/"), {
    method: "POST",
    body: JSON.stringify({ ids }),
  });
  if (!res.ok) throw new ApiError(res.status, await res.text());
}

// ----- Push Subscriptions -----

export async function subscribePush(
  subscriptionInfo: PushSubscriptionJSON,
): Promise<{ id: number }> {
  const res = await authFetch(url("/me/push-subscriptions/"), {
    method: "POST",
    body: JSON.stringify({ subscription_info: subscriptionInfo }),
  });
  return json<{ id: number }>(res);
}

export async function unsubscribeAllPush(): Promise<void> {
  const res = await authFetch(url("/me/push-subscriptions/all/"), {
    method: "DELETE",
  });
  if (!res.ok && res.status !== 204) {
    throw new ApiError(res.status, await res.text());
  }
}

// ----- Guest stays (staff view) -----

export async function revokeStay(
  hotelSlug: string,
  stayId: number,
): Promise<void> {
  const res = await authFetch(
    url(`/hotels/${hotelSlug}/stays/${stayId}/revoke/`),
    { method: "POST" },
  );
  if (!res.ok) throw new ApiError(res.status, await res.text());
}
