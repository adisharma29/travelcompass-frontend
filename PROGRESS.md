# Frontend Implementation Progress

## Status Key
- [x] Complete
- [ ] Not started
- [~] In progress

---

## Phase 0: Design System & Project Setup
- [x] Study brand guidelines and existing homepage design
- [x] Define SaaS design system (see `design-system.md`)
- [x] Create CLAUDE.md with project conventions
- [x] Create progress tracking (this file)
- [x] Install and configure shadcn/ui with Tailwind v4
- [x] Set up shadcn theme (CSS variables in globals.css, OKLCH, light+dark)
- [x] Configure `components.json` for project paths
- [x] Add `cn()` utility to `lib/utils.ts`
- [x] Install base shadcn components (button, input, card, dialog, tabs, sidebar, etc.)
- [ ] Set up `.env.local` with `NEXT_PUBLIC_API_URL=http://localhost:8000`

## Phase 2: Frontend Auth + Dashboard Shell
- [x] Create `lib/auth.ts` (cookie-based, NO localStorage)
- [x] Create `lib/concierge-types.ts` (TypeScript types mirroring backend serializers)
- [x] Create `lib/concierge-api.ts` (API functions with authFetch)
- [x] Add `cn()` utility to existing `lib/utils.ts`
- [x] Create `context/AuthContext.tsx` (profile fetch, hotel picker state, logout)
- [x] Create login page (`/login`) with Email and Phone OTP tabs
- [x] Create `(dashboard)/layout.tsx` with auth guard + sidebar
- [x] Create `hooks/use-request-stream.ts` (SSE hook with auto-reconnect)
- [x] Create dashboard home page (stats cards, dept breakdown, recent requests)

## Phase 3: Frontend — Admin CRUD
- [x] Add missing API functions (delete dept/exp/qr, getHotelSettings, backend GET settings)
- [x] Install shadcn switch, select, textarea, table components
- [x] Hotel settings page (timezone, room validation, escalation config) — SUPERADMIN only
- [x] Team management page (member table, invite dialog, role change, deactivate) — ADMIN+/SUPERADMIN
- [x] QR code generator page (list with images, create dialog, download, delete) — ADMIN+
- [x] Departments CRUD pages + forms (with schedule editor, photo upload, cascade warning) — ADMIN+
- [x] Experiences CRUD pages + forms (grouped by dept, image validation, highlights editor) — ADMIN+
- [x] Requests page (table with filters, expand detail, status transitions, SSE live updates) — all staff
- [x] Fix paginated response unwrapping for getDepartments, getMembers, getQRCodes

## Phase 3.5: Admin UX Enhancements
- [x] Backend: auto-generate slugs for departments and experiences (models.py save())
- [x] Backend: bleach HTML sanitization for descriptions (serializers.py)
- [x] Backend: bulk reorder endpoints for departments and experiences (views.py, urls.py)
- [x] Backend: ExperienceImage model + gallery upload/delete/reorder API (models.py, views.py, urls.py, migration)
- [x] Frontend: install @tiptap/react, @tiptap/starter-kit, @dnd-kit/core, @dnd-kit/sortable + shadcn command/popover
- [x] Frontend: create shared components (RichTextEditor, SortableList, ImageUploadArea, TimezoneCombobox)
- [x] Frontend: add ProseMirror CSS to globals.css
- [x] Frontend: add ExperienceImage type + 5 new API functions (reorder depts/exps, gallery upload/delete/reorder)
- [x] Frontend: rewrite departments page (rich text, drag-reorder, styled upload, timezone dropdown, horizontal day overrides, no slug/display_order fields)
- [x] Frontend: rewrite experiences page (rich text, drag-reorder per dept group, styled photo/cover uploads, gallery image management, highlights helper text, no slug/display_order fields)
- [x] Frontend: HtmlContent component for rendering formatted Tiptap descriptions in card previews
- [x] Frontend: ConfirmDialog component replacing all window.confirm/alert with themed modals
- [x] Frontend: prevent self-deactivation and self-role-change on team page
- [x] Frontend: fix hotel-switch race condition with slugRef pattern across all 6 dashboard pages
- [x] Frontend: fix Tiptap SSR hydration (immediatelyRender: false)
- [x] Frontend: fix DRF boolean validation (explicit "true"/"false" in FormData)
- [x] Frontend: fix object URL blob leak in ImageUploadArea (useMemo + useEffect cleanup)
- [x] Frontend: add ALREADY_BOOKED_OFFLINE to requests filter
- [x] Frontend: replace TabBar alert() with themed coming-soon dialog
- [x] Backend: merge ServiceRequestUpdate into ServiceRequestDetail (RetrieveUpdateAPIView)
- [x] Backend: make email/phone optional in invite (at least one required)
- [x] Backend: enforce STAFF role requires department on member updates
- [x] Backend: fix N+1 gallery queries with prefetch_related on public endpoints

## Pre-Phase 4: Admin UX Revamp (see PRE_PHASE4_REVAMP.md)
- [x] Backend: ContentStatus enum (DRAFT/PUBLISHED/UNPUBLISHED) + status/published_at fields on Department & Experience
- [x] Backend: dual-write in save() — is_active computed from status for backward compat
- [x] Backend: data migration (is_active=True → PUBLISHED, False → UNPUBLISHED)
- [x] Backend: serializers — status/published_at in fields, is_active read-only, auto-set published_at on first publish
- [x] Backend: public views filter on status=PUBLISHED (with Prefetch for nested published-only)
- [x] Backend: dashboard stats filter on status=PUBLISHED
- [x] Backend: admin — status in list_display/list_filter for Department & Experience
- [x] Backend: extend dashboard stats with setup completion flags (settings_configured, has_departments, has_experiences, has_photos, has_team, has_qr_codes, has_published)
- [x] Frontend: useUnsavedChanges hook (beforeunload, popstate, programmatic guard + ConfirmDialog)
- [x] Frontend: useLocalDraft hook (localStorage auto-save with 1.5s debounce, restore/discard/clear)
- [x] Frontend: types updated (ContentStatus, status, published_at, setup flags, department/price on Experience)
- [x] Frontend: getDepartment + getExperience API functions added
- [x] Frontend: DepartmentEditor full-page component with cards layout, schedule editor, status dropdown
- [x] Frontend: ExperienceEditor full-page component with gallery, highlights, status dropdown
- [x] Frontend: editor routes — /departments/new, /departments/[slug]/edit, /departments/[deptSlug]/experiences/new, /departments/[deptSlug]/experiences/[id]/edit
- [x] Frontend: strip DeptDialog and ExpDialog from list pages, replace with Link-based navigation
- [x] Frontend: status badges on department and experience cards (Draft/Unpublished), opacity for non-published
- [x] Frontend: status dropdown in editors replaces is_active toggle
- [x] Frontend: mobile reorder buttons (ChevronUp/Down on mobile, drag handle on desktop) + team mobile cards
- [x] Frontend: setup checklist on dashboard home

## Phase 3.75: White-Label Branding (see WHITE_LABEL_PLAN.md)
- [x] Backend: add brand fields to Hotel model (colors, fonts, favicon, social links, og_image, footer/legal) + migration
- [x] Backend: update HotelPublicSerializer + HotelSettingsSerializer with new fields
- [x] Backend: hex color validation on color fields
- [x] Frontend: update Hotel + HotelSettings types in concierge-types.ts
- [x] Frontend: create FontCombobox component (searchable Google Fonts picker)
- [x] Frontend: add Branding / Social Links / Footer & Legal cards to hotel settings page
- [x] Frontend: create inject-brand-theme utility (CSS variable injection)
- [x] Frontend: create BrandFontLoader component (dynamic Google Fonts <link> loading)
- [x] Frontend: create BrandPreview component (live preview in settings page)

## Phase 4: Frontend — Guest-Facing (white-label aware)
- [x] Create `lib/guest-auth.ts` (sendOTP, verifyOTP, updateRoom, public data endpoints)
- [x] Create `lib/schedule-utils.ts` (getDeptStatus, isAfterHours, formatScheduleRange, getTodaySchedule)
- [x] Create `context/GuestContext.tsx` (hotel, guestStay, qrCode, guardedNavigate, setAuthState)
- [x] Create shared guest components (SafeHtml with DOMPurify, GuestFooter, GuestHeader)
- [x] Guest layout with BrandFontLoader + injectBrandTheme on mount + generateMetadata (title, favicon, OG image per hotel)
- [x] Hotel landing page (`/h/[hotelSlug]/`) with HotelHero, DepartmentGrid, ScheduleBadge — brand colors/fonts
- [x] Department detail + experience list (`/h/[hotelSlug]/[deptSlug]/`) with ExperienceCard, SafeHtml — brand colors/fonts
- [x] Experience detail page (`/h/[hotelSlug]/[deptSlug]/[expId]/`) with ExperienceGallery (CSS scroll-snap), StickyBookingBar, highlights, details
- [x] Guest OTP verification flow (`/h/[hotelSlug]/verify/`) — phone → code → room, dev mode code display, auto-submit, resend cooldown
- [x] Request form page (`/h/[hotelSlug]/request/`) — pre-filled from query params, category-adaptive fields, GuestStepper
- [x] Request confirmation view (`/h/[hotelSlug]/confirmation/`) — acknowledgement card + SLA info + after-hours notice
- [x] Loading skeletons for all guest routes (landing, dept detail, exp detail)
- [x] Install DOMPurify for client-side HTML sanitization
- [x] Build passes with no errors

## Phase 4.5: Guest UI/UX Revamp (see GUEST_UI_REVAMP.md)
- [x] Global max-width container (max-w-6xl) on landing page + all content areas
- [x] HotelHero — constrained overlay text, desktop cinematic aspect (21/9), padding
- [x] DepartmentGrid — responsive columns (2/3/4 at breakpoints)
- [x] DepartmentCard — hover shadow elevation, responsive image sizes, icon badge overlay
- [x] ExperienceCard — hover background, larger desktop thumbnail (md:size-28), 2-line title, button hover
- [x] ScheduleBadge — replaced hardcoded hex with brand CSS vars
- [x] GuestFooter — max-width + desktop horizontal layout
- [x] Loading skeletons — updated to match new responsive grid + containers
- [x] Experience detail — 2-column desktop layout (gallery left, info+booking right)
- [x] ExperienceGallery — desktop arrows, dot indicators on mobile, thumbnail strip on desktop
- [x] StickyBookingBar — entrance animation, hidden on desktop (replaced by inline booking card)
- [x] Experience page server component — parallel department fetch with Promise.all
- [x] GuestHeader — breadcrumb navigation on desktop, max-width container
- [x] Department detail — 2-column layout (photo+schedule left, experiences right), breadcrumbs
- [x] Desktop card wrappers on verify/request/confirmation pages
- [x] Confirmation page — "Continue Browsing" text update
- [x] Hotel description shown on landing page
- [x] WhatsAppFAB — floating action button when hotel has whatsapp_number
- [x] WeeklySchedule — full 7-day schedule table on department detail
- [x] Request page — capacity-based stepper max from experience.capacity
- [x] SafeHtml — added style prop support
- [x] Focus-visible rings on all interactive guest elements (buttons, links, inputs)
- [x] Build passes with no errors

## Phase 4.75: Staff UX + Guest Landing Enhancements
- [x] Staff requests: ACTION_LABEL map with imperative verbs (Acknowledge, Confirm, Mark Unavailable, Mark No-Show, Mark Booked Offline)
- [x] Guest API: `getMyRequests(hotelSlug)` with paginated response unwrap (guest-auth.ts)
- [x] Guest landing: "Your Requests" section with expandable cards (notes, date/time, guest count)
- [x] Guest landing: user dropdown with logout in branded header
- [x] Guest landing: hotel-scoped auth state (verified vs authenticated-but-expired)

### Multi-Hotel Session Hardening
- [x] Backend: `?hotel=` now mandatory on `/me/requests/` — returns 400 if missing (views.py)
- [x] Backend: `expire_stale_stays_task` Celery beat job deactivates stays with `expires_at <= now` (hourly)
- [x] Backend: OTP verify reuses active stay for same (guest, hotel) — extends expiry, updates QR code. Atomic + row lock for race safety (services.py)
- [x] Backend: data migration dedupes existing active stays + partial unique constraint `unique_active_stay_per_guest_hotel` (migration 0011)
- [x] Frontend: `isVerified` in GuestContext — checks `is_active` AND `expires_at > now - 60s` buffer (hotel-local access)
- [x] Frontend: `isAuthenticated` remains global identity (has JWT); `isVerified` gates protected actions
- [x] Frontend: `guardedNavigate` uses `isVerified && hasRoom` instead of `isAuthenticated && hasRoom`
- [x] Frontend: header shows "Verify for this hotel" CTA when `isAuthenticated && !isVerified`
- [x] Frontend: centralized 403 handler — `guestMutationFetch` dispatches `guest:session-expired` event on 403; GuestContext listens and redirects to verify page
- [x] Frontend: request history still visible to expired guests (gates on `isAuthenticated`, not `isVerified`)
- [x] Backend + frontend builds pass

## Phase 5: Notifications + PWA (see PHASE5_NOTIFICATIONS_PWA.md)
- [x] VAPID key generation + env vars (`NEXT_PUBLIC_VAPID_PUBLIC_KEY`) in `.env.local` and `.dev.vars`
- [x] Push subscription API functions (`subscribePush`, `unsubscribeAllPush`) in `concierge-api.ts`
- [x] Fix `getNotifications()` to unwrap `PaginatedResponse<Notification>` → `.results`
- [x] Service worker (`public/sw.js`) — push-only (no cache), notificationclick with URL normalization
- [x] Push helper (`lib/push.ts`) — `isPushSupported`, `registerPush`, `unregisterPush`, `getPermissionState`
- [x] Centralized SSE context (`context/SSEContext.tsx`) — single `useRequestStream`, custom event dispatch, Sonner toasts
- [x] `DashboardHeader` component with shared page header + NotificationBell
- [x] `NotificationBell` component — bell icon, unread badge, popover dropdown, 30s poll + SSE refresh, mark all read
- [x] `PushPermissionBanner` — one-time opt-in banner with localStorage dismissal
- [x] `ServiceWorkerRegistration` shared component — mounted in both dashboard and guest layouts
- [x] Auth context push lifecycle — auto-register on bootstrap if permission granted, unregister before logout
- [x] Dashboard layout — Toaster, SW registration, manifest metadata
- [x] `DashboardShell` — SSEProvider wrapper, PushPermissionBanner
- [x] All 6 dashboard pages updated: replace inline headers with `DashboardHeader`, swap `useRequestStream` with `useSSE()`/`useSSERefetch()`
- [x] Static PWA manifest (`public/manifest.json`) for dashboard
- [x] Dynamic PWA manifest route (`/h/[hotelSlug]/manifest.json/route.ts`) with hotel brand colors + favicon
- [x] Guest hotel layout — manifest link in `generateMetadata`
- [x] `InstallPrompt` component — `beforeinstallprompt` listener, branded bottom-sheet CTA, localStorage dismissal
- [x] Backend: `generate_vapid_keys` command outputs base64url applicationServerKey format
- [x] Backend: `PushSubscriptionCreate` endpoint-based upsert with user row locking for concurrency safety
- [x] Backend: push subscription JSON validation (endpoint, keys.p256dh, keys.auth)
- [x] Backend: `_ExperienceNestedSerializer` with status field for admin department view
- [x] Backend: `reminder_sent_at` dedup field on ServiceRequest — prevents duplicate reminder notifications
- [x] Backend: disable `check-escalations` and `response-due-reminder` celery beat tasks (dev)
- [x] Backend: OTP verify returns `stay_room_number` + `stay_expires_at` for returning guest UX
- [x] Backend: decouple `NEXT_PUBLIC_VAPID_PUBLIC_KEY` from `VAPID_PUBLIC_KEY` in docker-compose
- [x] Guest requests: top 3 on landing page with "View all (N)" link using real API count
- [x] Guest requests: paginated `/h/[hotelSlug]/requests` page with prev/next from API `next`/`previous`
- [x] Guest requests: `RequestCard` extracted to shared component (`components/guest/RequestCard.tsx`)
- [x] Guest requests: `getMyRequestsPaginated()` returns `hasNext`/`hasPrev` (no hardcoded page size)
- [x] Guest requests: 403 session-expiry detection in `getMyRequests` + `getMyRequestsPaginated`
- [x] Fix: returning guests skip room step when stay already has room number
- [x] Fix: synthetic stay `expires_at` uses real backend value (not empty string) — `isVerified` now correct
- [x] Fix: notification unread tab removes items on click (filter, not toggle)
- [x] Fix: unhandled rejection on per-item mark-read (`.catch` added)
- [x] Fix: VAPID key rotation detection — `keysMatch()` compares applicationServerKey, resubscribes on mismatch
- [x] Fix: OTP login state race — `flushSync` before `router.push`
- [x] Fix: dead Install button after browser prompt dismissed
- [x] Fix: experience status "Unpublished" on dashboard — wrong serializer for nested experiences
- [x] Build + lint pass with no errors

## Phase 6: Polish (see PHASE6_POLISH.md)

### P0 — Critical fixes
- [x] Add toast.error catches to silent action handlers (requests, departments, qr-codes, team, experiences pages)
- [x] Add mobile card view for requests table (responsive `md:hidden` / `hidden md:block`)
- [x] Add error state + Alert to dashboard home page
- [x] Add defensive `.catch()` to guest requests fetch (requests-client.tsx)
- [x] Fix SSE toast description (was "Room ..." → now "Request ...")
- [x] Replace experiences page inline header with DashboardHeader

### P1 — Key features
- [x] Request detail page (`/dashboard/requests/[publicId]`) — full detail view, staff notes editor, enum-based confirmation reason dialog, add note, take ownership, activity timeline, SSE refresh
- [x] Backend: `assigned_to_name` SerializerMethodField on ServiceRequestDetailSerializer
- [x] NotificationBell + SSE toast deep-link to specific request detail page
- [x] Service worker: remove URL normalization regex that blocked detail page navigation
- [x] Request list: server-side pagination with `getRequestsPaginated()` (hasNext/hasPrev from DRF)
- [x] Request list: click-to-navigate to detail page (desktop table rows + mobile cards)
- [x] Dashboard home: recent requests link to detail page

### P2 — Polish & robustness
- [x] Error boundaries: `(dashboard)/error.tsx`, `(dashboard)/not-found.tsx`, `(hotel)/error.tsx`, `(hotel)/not-found.tsx`
- [x] Confirmation page: primary CTA changed to "View My Requests" → `/h/[hotelSlug]/requests`
- [x] GuestContext: brand-colored loading spinner instead of `null` flash
- [x] Guest landing: defensive `.catch(() => {})` on getMyRequests
- [x] Settings page: `useUnsavedChanges(dirty)` guard + ConfirmDialog
- [x] DnD keyboard accessibility: already implemented (SortableList has KeyboardSensor)
- [x] Content completeness indicators: amber warnings on published departments/experiences missing photo, description, etc.
- [x] CSP: `Content-Security-Policy-Report-Only` header for guest routes (`/h/*`) in next.config.ts
- [x] Twitter card metadata in hotel layout (`generateMetadata`)
- [x] Request form: cancellation guard on experience/department fetch effect
- [x] Build passes with no errors

## Phase 7: Analytics Dashboard (see ANALYTICS_DASHBOARD_PLAN.md)

### Phase 7.1: Analytics with Existing Data
- [x] Backend: `concierge/analytics.py` — 6 query functions (overview, requests-over-time, departments, experiences, response-times, heatmap)
- [x] Backend: shared `_parse_date_range()` helper (supports `?range=7d|30d|90d` and `?start=&end=`, max 90d, hotel timezone)
- [x] Backend: `_base_qs()` helper with hotel/department/date filtering
- [x] Backend: hotel-timezone bucketing via `TruncDate`, `ExtractHour`, `ExtractWeekDay` with `zoneinfo`
- [x] Backend: overview endpoint with trend comparison vs previous period of same length
- [x] Backend: response-time distribution (5 buckets) + staff leaderboard (by assigned_to)
- [x] Backend: heatmap 7×24 matrix (Mon=0, Sun=6) with Django ExtractWeekDay conversion
- [x] Backend: `concierge/analytics_views.py` — 6 API views (`AnalyticsBaseView` with shared date range + dept extraction)
- [x] Backend: STAFF gets dept-filtered data on all endpoints; STAFF gets 403 on `/departments/` (hotel-wide only)
- [x] Backend: registered 6 URL patterns under `hotels/<slug>/analytics/`
- [x] Backend: all imports verified, smoke test with live data passes
- [x] Frontend: install recharts
- [x] Frontend: `src/lib/analytics-types.ts` — types for all 6 endpoints
- [x] Frontend: `src/lib/analytics-api.ts` — typed fetch functions with date range param builder
- [x] Frontend: `DateRangeSelector` component (7d/30d/90d select dropdown)
- [x] Frontend: `KPICard` component with trend arrows (green/red coloring, invertTrend for response time)
- [x] Frontend: `RequestTrendChart` (Recharts line chart, total vs confirmed, gap-filled dates)
- [x] Frontend: `DepartmentBarChart` (horizontal bar chart, total + confirmed per dept)
- [x] Frontend: `ExperienceTable` (sortable table with inline bars, conversion % coloring)
- [x] Frontend: `ResponseHistogram` (vertical bar chart, 5 buckets, color-coded)
- [x] Frontend: `StaffLeaderboard` (table with handled/avg response/confirmed)
- [x] Frontend: `RequestHeatmap` (7×24 grid with intensity coloring, hover tooltips, legend)
- [x] Frontend: Analytics page with Overview + Performance tabs, parallel data fetching, AbortController, slugRef guard
- [x] Frontend: loading skeletons for both tabs
- [x] Frontend: "Analytics" nav item added to sidebar (between Dashboard and Requests, visible to all roles)
- [x] Fix: `get_department_stats` — remove `output_field=FloatField()` causing timedelta cast error; compute avg response in separate query
- [x] Fix: chart colors — replace `hsl(var(--chart-*))` with `var(--chart-*)` (CSS vars already contain full OKLCH value)
- [x] Add Legends to Department bar chart and Request trend line chart
- [x] Backend: `get_qr_placement_stats()` — QR performance by placement (lobby/room/pool/etc.), counts sessions + sessions-with-requests
- [x] Backend: `AnalyticsQRPlacements` view + URL at `analytics/qr-placements/`
- [x] Frontend: `QRPlacementChart` component (horizontal bar chart, sessions vs with-requests, legend)
- [x] Frontend: QR placement chart wired into Overview tab (ADMIN/SUPERADMIN only)
- [x] Build passes with no errors

### Phase 7.2: Event Tracking + Funnel (not started)
- [ ] Backend: `EngagementEvent` model + migration
- [ ] Backend: POST endpoint with compound throttle (hotel+IP+UA)
- [ ] Frontend: `useTrackEvent()` hook with `sendBeacon` + debounce
- [ ] Frontend: Funnel tab on analytics page

### Phase 7.3: VIEWER Role + PDF Export (not started)
- [ ] Backend: VIEWER role + permission hardening
- [ ] Frontend: DashboardShell VIEWER detection + SSE/push bypass
- [ ] Frontend: PDF export

---

## Notes
- Backend is complete in `tcomp-backend` on branch `feat/concierge-v1`
- Backend API runs on `localhost:8000`
- Frontend dev server runs on `localhost:6001`
- All auth is cookie-based (httpOnly JWT) — no tokens in JS
