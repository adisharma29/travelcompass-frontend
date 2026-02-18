// ============================================================
// Concierge platform types — mirrors backend DRF serializers
// ============================================================

export type Role = "SUPERADMIN" | "ADMIN" | "STAFF";

export type UserType = "STAFF" | "GUEST";

export type RequestStatus =
  | "CREATED"
  | "ACKNOWLEDGED"
  | "CONFIRMED"
  | "NOT_AVAILABLE"
  | "NO_SHOW"
  | "ALREADY_BOOKED_OFFLINE"
  | "EXPIRED";

export const VALID_TRANSITIONS: Record<RequestStatus, RequestStatus[]> = {
  CREATED: ["ACKNOWLEDGED"],
  ACKNOWLEDGED: [
    "CONFIRMED",
    "NOT_AVAILABLE",
    "NO_SHOW",
    "ALREADY_BOOKED_OFFLINE",
  ],
  CONFIRMED: [],
  NOT_AVAILABLE: [],
  NO_SHOW: [],
  ALREADY_BOOKED_OFFLINE: [],
  EXPIRED: [],
};

export const TERMINAL_STATUSES: RequestStatus[] = [
  "CONFIRMED",
  "NOT_AVAILABLE",
  "NO_SHOW",
  "ALREADY_BOOKED_OFFLINE",
  "EXPIRED",
];

export type RequestType = "BOOKING" | "INQUIRY" | "CUSTOM";

export type NotificationType =
  | "NEW_REQUEST"
  | "ESCALATION"
  | "DAILY_DIGEST"
  | "SYSTEM";

export type ExperienceCategory =
  | "DINING"
  | "SPA"
  | "ACTIVITY"
  | "TOUR"
  | "TRANSPORT"
  | "OTHER";

export type QRPlacement =
  | "LOBBY"
  | "ROOM"
  | "RESTAURANT"
  | "SPA"
  | "POOL"
  | "BAR"
  | "GYM"
  | "GARDEN"
  | "OTHER";

// ----- Core entities -----

export interface UserMinimal {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
}

export interface Hotel {
  id: number;
  name: string;
  slug: string;
  description: string;
  tagline: string;
  logo: string | null;
  cover_image: string | null;
  timezone: string;
  escalation_enabled: boolean;
}

export interface HotelSettings {
  timezone: string;
  room_number_pattern: string;
  blocked_room_numbers: string[];
  room_number_min: number | null;
  room_number_max: number | null;
  escalation_enabled: boolean;
  escalation_fallback_channel: "NONE" | "EMAIL" | "SMS" | "EMAIL_SMS";
  oncall_email: string | null;
  oncall_phone: string | null;
  require_frontdesk_kiosk: boolean;
  escalation_tier_minutes: number[] | null;
}

export interface DepartmentSchedule {
  timezone: string;
  default: [string, string][];
  overrides?: Record<string, [string, string][]>;
}

export interface Department {
  id: number;
  name: string;
  slug: string;
  description: string;
  photo: string | null;
  icon: string | null;
  display_order: number;
  schedule: DepartmentSchedule;
  experiences: Experience[];
  is_ops: boolean;
  is_active: boolean;
}

export interface Experience {
  id: number;
  name: string;
  slug: string;
  description: string;
  photo: string | null;
  cover_image: string | null;
  price_display: string;
  category: ExperienceCategory;
  timing: string;
  duration: string;
  capacity: string | null;
  highlights: string[];
  is_active: boolean;
  display_order: number;
}

export interface GuestStay {
  id: number;
  hotel: number;
  room_number: string;
  is_active: boolean;
  created_at: string;
  expires_at: string;
}

/** List endpoint returns flattened fields (department_name, experience_name) */
export interface ServiceRequestListItem {
  id: number;
  public_id: string;
  status: RequestStatus;
  request_type: RequestType;
  guest_name: string;
  room_number: string;
  department_name: string;
  experience_name: string | null;
  guest_notes: string;
  guest_date: string | null;
  guest_time: string | null;
  guest_count: number | null;
  after_hours: boolean;
  response_due_at: string | null;
  created_at: string;
  acknowledged_at: string | null;
  confirmed_at: string | null;
}

/** Detail endpoint returns nested objects + activities */
export interface ServiceRequest extends ServiceRequestListItem {
  experience: Experience | null;
  department: Department;
  staff_notes: string;
  confirmation_reason: string | null;
  activities: RequestActivity[];
}

/** DRF paginated response wrapper */
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface RequestActivity {
  action: string;
  actor_name: string | null;
  details: Record<string, unknown>;
  created_at: string;
}

/** Minimal hotel info embedded in membership responses */
export interface HotelMinimal {
  id: number;
  name: string;
  slug: string;
}

/**
 * Membership as returned by the profile endpoint.
 * User fields are flattened (not nested), hotel is minimal.
 */
export interface HotelMembership {
  id: number;
  hotel: HotelMinimal;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  role: Role;
  department: number | null;
  is_active: boolean;
  created_at: string;
}

export interface Notification {
  id: number;
  title: string;
  body: string;
  notification_type: NotificationType;
  is_read: boolean;
  created_at: string;
  request_public_id: string | null;
}

export interface QRCode {
  id: number;
  code: string;
  hotel: number;
  department: number | null;
  placement: QRPlacement;
  label: string;
  target_url: string;
  qr_image: string;
  is_active: boolean;
  stay_count: number;
  created_at: string;
}

export interface DashboardStats {
  total_requests: number;
  pending: number;
  acknowledged: number;
  confirmed: number;
  conversion_rate: number;
  by_department: { name: string; count: number }[];
}

// ----- Auth payloads -----

export interface AuthUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  user_type: UserType;
}

/**
 * Profile response from GET /api/v1/auth/profile/.
 * User fields are at top level (not nested under `user`).
 */
export interface AuthProfile {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar: string | null;
  user_type: UserType;
  memberships: HotelMembership[];
  stays: GuestStay[];
}

// ----- SSE events -----

export interface SSERequestEvent {
  event: "request.created" | "request.updated";
  request_id: number;
  public_id: string;
  status: RequestStatus;
  department_id: number;
  updated_at: string;
}
