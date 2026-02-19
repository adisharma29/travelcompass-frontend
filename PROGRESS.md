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
- [ ] Create `lib/guest-auth.ts` (sendOTP, verifyOTP, updateRoom)
- [ ] Guest layout with BrandFontLoader + injectBrandTheme on mount + generateMetadata (title, favicon, OG image per hotel)
- [ ] Hotel landing page (`/h/[hotelSlug]/`) with departments grid + schedule badges — brand colors/fonts
- [ ] Department detail + experience list (`/h/[hotelSlug]/[deptSlug]/`) — brand colors/fonts
- [ ] Guest OTP verification flow (`/h/[hotelSlug]/verify/`) — phone → code → room
- [ ] Request form modal (guest_name pre-fill, date/time/guests/notes)
- [ ] Request confirmation view (acknowledgement card + SLA info)
- [ ] Guest footer component (footer_text, social icons, terms/privacy links)

## Phase 5: Notifications + PWA
- [ ] PWA manifest — dynamic per-hotel theme_color/background_color from brand colors
- [ ] Service worker (`public/sw.js`) — push only, no offline cache
- [ ] `lib/push.ts` — push subscription helper
- [ ] Push subscription flow (subscribe on login, unregister before logout)
- [ ] NotificationBell component + dropdown

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
