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

export type ContentStatus = "DRAFT" | "PUBLISHED" | "UNPUBLISHED";

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
  // Brand
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  heading_font: string;
  body_font: string;
  favicon: string | null;
  og_image: string | null;
  // Social
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  whatsapp_number: string;
  // Footer & Legal
  footer_text: string;
  terms_url: string;
  privacy_url: string;
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
  settings_configured: boolean;
  // Brand
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  heading_font: string;
  body_font: string;
  favicon: string | null;
  og_image: string | null;
  // Social
  instagram_url: string;
  facebook_url: string;
  twitter_url: string;
  whatsapp_number: string;
  // Footer & Legal
  footer_text: string;
  terms_url: string;
  privacy_url: string;
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
  status: ContentStatus;
  published_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface ExperienceImage {
  id: number;
  image: string;
  alt_text: string;
  display_order: number;
  created_at: string;
}

export interface Experience {
  id: number;
  department: number;
  name: string;
  slug: string;
  description: string;
  photo: string | null;
  cover_image: string | null;
  price: string | null;
  price_display: string;
  category: ExperienceCategory;
  timing: string;
  duration: string;
  capacity: string | null;
  highlights: string[];
  is_active: boolean;
  status: ContentStatus;
  published_at: string | null;
  display_order: number;
  gallery_images: ExperienceImage[];
  created_at: string;
  updated_at: string;
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
  assigned_to_name: string | null;
  assigned_to_id: number | null;
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

export interface SetupFlags {
  settings_configured: boolean;
  has_departments: boolean;
  has_experiences: boolean;
  has_photos: boolean;
  has_team: boolean;
  has_qr_codes: boolean;
  has_published: boolean;
}

export interface DashboardStats {
  total_requests: number;
  pending: number;
  acknowledged: number;
  confirmed: number;
  conversion_rate: number;
  by_department: { name: string; count: number }[];
  setup: SetupFlags;
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
