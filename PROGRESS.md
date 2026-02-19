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
- [x] Build passes with no errors

## Phase 6: Polish
- [ ] Request detail page with activity timeline
- [ ] Request status update flow (valid transitions only)
- [ ] EscalationHealth indicator + degraded banner (SUPERADMIN)
- [ ] Mobile responsive dashboard
- [ ] Error handling, loading states, empty states
- [ ] CSP headers for guest route group — allow Google Fonts CDN
- [ ] OG tag / social sharing validation per hotel

---

## Notes
- Backend is complete in `tcomp-backend` on branch `feat/concierge-v1`
- Backend API runs on `localhost:8000`
- Frontend dev server runs on `localhost:6001`
- All auth is cookie-based (httpOnly JWT) — no tokens in JS
