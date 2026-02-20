# Pre-Phase 4 Revamp: Admin UX Overhaul

> Goal: Make the admin dashboard feel like a product a hotel GM can confidently use on their phone during a busy shift — not a developer tool.

---

## Execution Order

| # | Priority | Scope | Summary |
|---|----------|-------|---------|
| 1 | **P0** | Frontend | Full-page editors + mobile-first forms + unsaved-changes guard + local draft autosave |
| 2 | **P0** | Backend + Frontend | Draft / Published / Unpublished status workflow |
| 3 | **P1** | Frontend | Mobile reorder fallback (up/down buttons) + team page mobile cards |
| 4 | **P1** | Frontend | Setup checklist on dashboard home |
| 5 | **P2** | Frontend | Preview-as-guest (blocked on Phase 4 guest views) |
| 6 | **P2** | Frontend | Content completeness indicators |
| 7 | **P3** | Backend + Frontend | Bulk import / quick-add |

---

## P0-A: Full-Page Editors + Unsaved-Changes Protection

### Problem

Complex create/edit forms live inside `max-w-lg` dialogs. On mobile:
- Scrolling inside a dialog inside a page is disorienting
- Tapping outside the dialog dismisses it and **loses all work**
- Rich text toolbar barely fits at 375px
- Gallery drag-reorder is unusable on touch
- No URL to bookmark or share — everything is ephemeral state

### Design Decisions

- **Keep dialogs** for: delete confirmations, toggle active, invite member, create QR code (small forms)
- **Full-page editors** for: department create/edit, experience create/edit
- Each editor gets its own route with a proper URL
- Mobile-first layout: single column, stacked sections, generous touch targets

### New Routes

Department routes use the department slug. Experience routes are nested under their
department slug and use the experience numeric ID, since the backend retrieve endpoint
is `ExperienceViewSet` scoped by `dept_slug` + `pk`. This ensures every edit URL is
fully self-contained — a hard refresh or shared link works without any client-side state.

```
/dashboard/departments/new                                → DepartmentEditor (create)
/dashboard/departments/[slug]/edit                        → DepartmentEditor (edit)
/dashboard/departments/[deptSlug]/experiences/new          → ExperienceEditor (create)
/dashboard/departments/[deptSlug]/experiences/[id]/edit    → ExperienceEditor (edit)
```

The experience "New" button on the list page pre-selects the department based on which
group the user clicked from. The URL carries `deptSlug` so the editor can fetch the
department and its other experiences for context.

### New Files

```
src/app/(dashboard)/dashboard/departments/new/page.tsx
src/app/(dashboard)/dashboard/departments/[slug]/edit/page.tsx
src/app/(dashboard)/dashboard/departments/[deptSlug]/experiences/new/page.tsx
src/app/(dashboard)/dashboard/departments/[deptSlug]/experiences/[id]/edit/page.tsx
src/hooks/use-unsaved-changes.ts
src/hooks/use-local-draft.ts
```

### Department Editor Layout (mobile-first)

```
┌─────────────────────────────────┐
│ ← Back to Departments    [Save]│  ← sticky header
├─────────────────────────────────┤
│ ┌─ Basic Info ────────────────┐ │
│ │ Name          [___________] │ │
│ │ Icon          [___________] │ │
│ │ Photo         [upload area] │ │
│ └─────────────────────────────┘ │
│ ┌─ Description ───────────────┐ │
│ │ [Rich text editor          ]│ │
│ │ [                          ]│ │
│ │ [                          ]│ │
│ └─────────────────────────────┘ │
│ ┌─ Settings ──────────────────┐ │
│ │ Status     [Draft ▾]        │ │  ← P0-B adds this
│ │ Ops dept   [toggle]         │ │
│ └─────────────────────────────┘ │
│ ┌─ Schedule ──────────────────┐ │
│ │ Timezone   [combobox      ] │ │
│ │ Default    [09:00] to [22:00│ │
│ │ Overrides  [MON][TUE]...    │ │
│ └─────────────────────────────┘ │
│                                 │
│ Unsaved changes auto-saved      │  ← subtle footer text
└─────────────────────────────────┘
```

On desktop (md+): two-column grid where logical (Basic Info + Settings side by side, Description full width, Schedule full width).

### Experience Editor Layout (mobile-first)

```
┌─────────────────────────────────┐
│ ← Back to Experiences    [Save]│
├─────────────────────────────────┤
│ ┌─ Basic Info ────────────────┐ │
│ │ Department  [select ▾]      │ │
│ │ Name        [___________]   │ │
│ │ Category    [select ▾]      │ │
│ └─────────────────────────────┘ │
│ ┌─ Description ───────────────┐ │
│ │ [Rich text editor          ]│ │
│ └─────────────────────────────┘ │
│ ┌─ Details ───────────────────┐ │
│ │ Price       [___________]   │ │
│ │ Timing      [___________]   │ │
│ │ Duration    [___________]   │ │
│ │ Capacity    [___________]   │ │
│ └─────────────────────────────┘ │
│ ┌─ Images ────────────────────┐ │
│ │ Photo       [upload area]   │ │
│ │ Cover       [upload area]   │ │
│ │ Gallery     [grid + upload] │ │
│ └─────────────────────────────┘ │
│ ┌─ Highlights ────────────────┐ │
│ │ [chip] [chip] [+ Add]       │ │
│ └─────────────────────────────┘ │
│ ┌─ Settings ──────────────────┐ │
│ │ Status     [Draft ▾]        │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

### `use-unsaved-changes` Hook

> **Note**: Next.js App Router (`next/navigation`) does NOT have `router.events` or
> `onBeforePopState` — those are Pages Router APIs. The strategy below uses only
> browser-native APIs and React patterns compatible with App Router client components.

```typescript
// src/hooks/use-unsaved-changes.ts
function useUnsavedChanges(isDirty: boolean) {
  // 1. beforeunload listener — catches tab close, browser back to external site,
  //    URL bar navigation. Browser shows its own native prompt.
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => { e.preventDefault(); };
    window.addEventListener('beforeunload', handler);
    return () => window.removeEventListener('beforeunload', handler);
  }, [isDirty]);

  // 2. popstate listener — catches browser back/forward within the SPA.
  //    On popstate, if dirty, push current URL back and show our themed
  //    ConfirmDialog. If user confirms, call router.back() programmatically.
  //    This works because App Router still uses History API under the hood.

  // 3. Link interception — the editor page wraps its "Back" link and sidebar
  //    nav items with an onClick guard. If dirty, prevent default and show
  //    ConfirmDialog. On confirm, navigate via router.push().
  //    Sidebar links can be intercepted via a context provider that the
  //    DashboardShell checks before navigating.

  // Returns:
  //   { ConfirmUnsavedDialog, setConfirmCallback }
  //   — ConfirmUnsavedDialog is a pre-wired AlertDialog component
  //   — setConfirmCallback stores the pending navigation to execute on confirm
}
```

The hook returns a `ConfirmUnsavedDialog` component (pre-wired AlertDialog) and a
guard function. The editor renders `<ConfirmUnsavedDialog />` and uses the guard
for its "Back" button. For sidebar navigation, the editor sets a context flag that
`DashboardSidebar` checks before calling `router.push()`.

### `use-local-draft` Hook

```typescript
// src/hooks/use-local-draft.ts
function useLocalDraft<T>(key: string, initialData: T) {
  // 1. On mount: check localStorage for `draft:${key}`
  //    If found and newer than server data, offer to restore
  // 2. Auto-save to localStorage on debounced changes (1.5s)
  // 3. Clear draft on successful save
  // 4. Returns { data, setData, hasDraft, discardDraft, lastSaved }
}
```

Key format: `draft:dept:${hotelSlug}:${slug|"new"}` / `draft:exp:${hotelSlug}:${slug|"new"}`

Show a small toast or inline text: "Draft auto-saved" with timestamp.

### Changes to Existing List Pages

**departments/page.tsx**:
- Remove `DeptDialog` component entirely
- "New Department" button → `<Link href="/dashboard/departments/new">`
- Edit (pencil) button → `<Link href={`/dashboard/departments/${dept.slug}/edit`}>`
- Keep: delete ConfirmDialog, SortableList, card layout

**experiences/page.tsx**:
- Remove `ExpDialog` component entirely
- "New Experience" button per dept group → `<Link href={`/dashboard/departments/${dept.slug}/experiences/new`}>`
- Edit button → `<Link href={`/dashboard/departments/${dept.slug}/experiences/${exp.id}/edit`}>`
- Keep: delete ConfirmDialog, SortableList, card layout

### API Changes

Need frontend functions to fetch single entities for the edit pages (backend
`DepartmentViewSet` and `ExperienceViewSet` already support retrieve by slug/pk):

```typescript
// concierge-api.ts
export async function getDepartment(hotelSlug: string, deptSlug: string): Promise<Department>
export async function getExperience(hotelSlug: string, deptSlug: string, expId: number): Promise<Experience>
```

`getDepartment` hits `GET /hotels/{slug}/admin/departments/{dept_slug}/`.
`getExperience` hits `GET /hotels/{slug}/admin/departments/{dept_slug}/experiences/{pk}/`.
Both return the full admin serializer including `gallery_images`.

---

## P0-B: Draft / Published / Unpublished Workflow

### Problem

`is_active` is a boolean that conflates "never been live" with "was live, now hidden." Hotels setting up for the first time must either publish incomplete content or tediously toggle each item after finishing.

### Backend Changes

**models.py** — Add `ContentStatus` enum, replace `is_active` on `Department` and `Experience`:

```python
class ContentStatus(models.TextChoices):
    DRAFT = 'DRAFT', 'Draft'
    PUBLISHED = 'PUBLISHED', 'Published'
    UNPUBLISHED = 'UNPUBLISHED', 'Unpublished'

class Department(models.Model):
    # Remove: is_active = models.BooleanField(default=True)
    # Add:
    status = models.CharField(
        max_length=12,
        choices=ContentStatus.choices,
        default=ContentStatus.DRAFT,
    )
    published_at = models.DateTimeField(null=True, blank=True)
```

Same for `Experience`.

**Data migration**: `is_active=True` → `PUBLISHED`, `is_active=False` → `UNPUBLISHED`. Set `published_at = updated_at` for published items. No existing item becomes DRAFT (they were already created).

**serializers.py**:
- Replace `is_active` with `status` in `DepartmentSerializer` and `ExperienceSerializer` fields
- Remove `is_active` from `DepartmentPublicSerializer` / `ExperiencePublicSerializer` (already not exposed)
- `status` is writable in admin serializers
- On status change to `PUBLISHED`, set `published_at = timezone.now()` in view/serializer

**views.py** — Update public view filters:
- `is_active=True` → `status='PUBLISHED'` (4 locations: HotelPublicDetail prefetch, DepartmentPublicList, DepartmentPublicDetail, ExperiencePublicDetail)

**services.py** — Dashboard stats:
- `Department.objects.filter(hotel=hotel, is_active=True)` → `status='PUBLISHED'`

**admin.py** — Update `list_display` and `list_filter` to use `status`.

**Other models keep `is_active`**: Hotel, HotelMembership, GuestStay, QRCode, PushSubscription — these are simple on/off toggles, not content publishing workflows.

### Frontend Changes

**concierge-types.ts**:
```typescript
export type ContentStatus = 'DRAFT' | 'PUBLISHED' | 'UNPUBLISHED';

// In Department and Experience interfaces:
// Remove: is_active: boolean;
// Add:
status: ContentStatus;
published_at: string | null;
```

**Department/Experience list pages** — Card badges:
- `DRAFT` → yellow/amber badge "Draft"
- `PUBLISHED` → green badge "Published"  (or no badge — it's the default state)
- `UNPUBLISHED` → gray badge "Unpublished"

**Department/Experience editors** — Status control:
- Dropdown or segmented control for status selection
- When changing to `PUBLISHED`: show confirmation if content seems incomplete (no photo, empty description)
- "Publish" primary action button on draft items (prominent CTA)

**FormData changes**:
- Replace `fd.append("is_active", ...)` with `fd.append("status", form.status)`

**Filter on list pages** (optional, nice-to-have):
- Tab bar or dropdown: All | Draft | Published | Unpublished
- Default: show all for admin

---

## P1-A: Mobile Reorder Fallback + Team Mobile Cards

### Problem

- `@dnd-kit` drag-and-drop is unreliable on touch devices — long-press conflicts with scroll, handles are tiny
- Team page uses `<Table>` which requires horizontal scroll on mobile

### Mobile Reorder Buttons

Add up/down arrow buttons alongside the drag handle on every `SortableList` item:

```
┌────────────────────────────────┐
│ ⠿  ↑  ↓   [Department Name]   │
│ drag      [description...]     │
└────────────────────────────────┘
```

Implementation:
- `SortableList` gets optional `showMoveButtons` prop (default true on mobile via media query, or always show)
- Pass `onMoveUp` / `onMoveDown` callbacks to `renderItem`
- Up button disabled on first item, down disabled on last
- On click: swap items in array, call `onReorder` with new order
- Buttons are `ChevronUp` / `ChevronDown` icons, small and subtle

**Files changed**: `src/components/dashboard/SortableList.tsx`, all pages using it.

### Team Page Mobile Cards

Below `md` breakpoint, replace `<Table>` with a card list:

```
┌─────────────────────────────────┐
│ John Doe              [Admin ▾] │
│ john@hotel.com  •  +91 98...    │
│ Department: Front Desk          │
│ ● Active            [Deactivate]│
└─────────────────────────────────┘
```

Implementation:
- Use a `useMediaQuery` hook or responsive Tailwind (`hidden md:block` for table, `md:hidden` for cards)
- Cards reuse the same state and handlers as table rows
- Role dropdown and deactivate button still functional in card layout

**Files changed**: `src/app/(dashboard)/dashboard/team/page.tsx`

---

## P1-B: Setup Checklist on Dashboard Home

### Problem

New hotel admins see an empty dashboard with stats showing all zeros. No guidance on what to do first.

### Design

Insert a collapsible card between the stats grid and "By Department" section. Only shown when setup is incomplete.

```
┌─────────────────────────────────────────────┐
│ 🏨 Get your hotel ready          3/7 done   │
│ ─────────────────────────────────────────── │
│ ✓ Configure hotel settings                  │
│ ✓ Create your first department              │
│ ✓ Add experiences to a department           │
│ ○ Upload photos for departments        →    │
│ ○ Invite at least one team member      →    │
│ ○ Generate a QR code                   →    │
│ ○ Publish a department                 →    │
│                                             │
│ [Dismiss checklist]                         │
└─────────────────────────────────────────────┘
```

### Checklist Items & Detection Logic

All checklist conditions are computed **server-side** and returned as boolean flags in
the dashboard stats response. The frontend never guesses — it just reads the flags.
This avoids ambiguous heuristics (e.g., "is timezone set?" — the default may be valid).

| Step | Backend flag | Link |
|------|-------------|------|
| Configure hotel settings | `setup.settings_configured` | `/dashboard/settings` |
| Create your first department | `setup.has_departments` | `/dashboard/departments/new` |
| Add experiences | `setup.has_experiences` | (contextual) |
| Upload photos | `setup.has_photos` | `/dashboard/departments` |
| Invite a team member | `setup.has_team` | `/dashboard/team` |
| Generate a QR code | `setup.has_qr_codes` | `/dashboard/qr-codes` |
| Publish a department | `setup.has_published` | `/dashboard/departments` |

### Implementation

**Backend**: Extend `getDashboardStats` response with a `setup` object. The backend
computes each flag with simple existence queries:

```python
# services.py — inside get_dashboard_stats()
setup = {
    'settings_configured': hotel.settings_configured,  # explicit boolean on Hotel model
    'has_departments': hotel.departments.exists(),
    'has_experiences': Experience.objects.filter(department__hotel=hotel).exists(),
    'has_photos': (
        hotel.departments.exclude(photo='').exists() or
        Experience.objects.filter(department__hotel=hotel).exclude(photo='').exists()
    ),
    'has_team': hotel.memberships.filter(is_active=True).count() > 1,
    'has_qr_codes': hotel.qr_codes.exists(),
    'has_published': hotel.departments.filter(status='PUBLISHED').exists(),
}
```

`settings_configured` is an explicit boolean field on the Hotel model, set to `True`
when an admin saves settings for the first time. This avoids guessing whether default
values are intentional.

**Frontend**:
- Fetch checklist data as part of existing `getDashboardStats` call (no extra request)
- Store "dismissed" state in localStorage: `checklist_dismissed:${hotelSlug}`
- Dismissal is per-hotel — switching hotels may show checklist again if incomplete

**New files**: `SetupChecklist` component in `src/components/dashboard/`.

---

## P2-A: Preview as Guest (After Phase 4)

### Concept

A "Preview" button in the editor and on list pages that opens the guest-facing view of the hotel/department/experience. Requires Phase 4 guest views to be built first.

### Implementation Approach

- Add a "Preview" button to the department and experience editor headers
- Opens the guest-facing view in a new tab
- For DRAFT content: append `?preview=true` and a short-lived preview token
- Backend allows preview-token-authenticated requests to see draft content
- Show a banner on previewed pages: "Preview Mode — This content is not published yet"

### Deferred Details

> **Provisional**: All guest-facing route paths below are placeholders. The exact URL
> structure will be defined when Phase 4 guest routes are implemented. Preview logic
> will be wired up after those routes stabilize — the editor layout reserves space for
> a "Preview" button in the header, but the button will be hidden/disabled until a
> concrete guest route exists to link to.

Placeholder route format (subject to change):
```
/h/{hotelSlug}/                          → Hotel landing
/h/{hotelSlug}/{deptSlug}/               → Department detail
/h/{hotelSlug}/{deptSlug}/{expSlug}/     → Experience detail
```

---

## P2-B: Content Completeness Indicators

### Concept

Subtle visual hints on list page cards showing what's missing. Not blocking — purely informational.

### Examples

```
┌─────────────────────────────────────┐
│ ⠿  🖼  Spa Department    Published │
│       2 experiences • 09:00–22:00  │
│       ⚠ Missing: photo            │  ← amber text, only if incomplete
└─────────────────────────────────────┘
```

### Fields to Check

**Department**: name ✓ (required), description, photo, schedule, at least 1 experience
**Experience**: name ✓ (required), description, photo, cover_image, price_display, timing, duration, highlights

### Implementation

- Pure frontend logic — compute from existing data, no backend changes
- Show as a subtle line below the card content: `⚠ Missing: photo, description`
- Only show for DRAFT and PUBLISHED items (not unpublished — they're intentionally hidden)
- Optional: show a completeness percentage or progress ring on the card

---

## P3: Bulk Import / Quick Add

### Concept

For large hotels with many departments and experiences, entering everything one by one is tedious.

### Quick Add Mode

A streamlined "quick add" form on the list page — just type a name and hit Enter to create a draft:

```
┌─────────────────────────────────────────┐
│ Quick add: [Type name and press Enter] │
└─────────────────────────────────────────┘
```

Creates a DRAFT with just the name. User fills in details later via the full-page editor.

### CSV Import (Stretch)

- Upload a CSV with columns: name, description, category, price, timing, duration
- Preview parsed rows in a table
- Bulk-create as drafts
- Backend endpoint: `POST /hotels/{slug}/admin/departments/{dept_slug}/experiences/bulk/`

### Deferred

Full spec to be written if/when hotel onboarding data shows this is a bottleneck. Quick-add is low effort and can ship sooner.

---

## Migration Strategy

### Order of Implementation

```
 1. Backend: Add ContentStatus enum + status field + dual-write migration   (P0-B Step 1)
    - Add status field alongside is_active, data migration, serializer dual-read/write
    - Public views filter on status='PUBLISHED'
    - Deploy backend — old frontend still works via is_active compatibility
 2. Backend: Extend dashboard stats with setup completion flags             (P1-B backend)
    - Add settings_configured to Hotel model
    - Add setup{} object to stats response
 3. Frontend: Create useUnsavedChanges + useLocalDraft hooks                (P0-A hooks)
 4. Frontend: Build DepartmentEditor full-page component                    (P0-A)
 5. Frontend: Build ExperienceEditor full-page component                    (P0-A)
    - Routes: /departments/[deptSlug]/experiences/[id]/edit
 6. Frontend: Strip dialogs from list pages, wire up new routes             (P0-A)
 7. Frontend: Switch to status field in types, FormData, editors            (P0-B Step 2)
    - Add status badges + filters to list pages
    - Deploy frontend — now uses status, ignores is_active
 8. Backend: Remove is_active from models + serializers + migration         (P0-B Step 3)
    - Clean up dual-write/dual-read, drop column
 9. Frontend: Add move up/down buttons to SortableList                      (P1-A)
10. Frontend: Team page mobile card layout                                  (P1-A)
11. Frontend: Setup checklist component on dashboard home                   (P1-B)
12. Frontend: Completeness indicators on list cards                         (P2-B)
```

### Backward-Compatible Rollout (is_active → status)

Deploying a hard breaking change simultaneously is risky. Instead, use a 3-step
transitional approach so backend and frontend can deploy independently:

**Step 1 — Backend: dual-write, dual-read (deploy first)**
- Add `status` field with `default='DRAFT'`.
- Run data migration: `is_active=True` → `PUBLISHED`, `is_active=False` → `UNPUBLISHED`.
- Keep `is_active` column (do NOT remove yet).
- Admin serializers expose BOTH `is_active` (read-only, computed from status) and `status` (writable).
  `is_active` property: `return self.status == 'PUBLISHED'`
- On write: if client sends `is_active` (old frontend), map it:
  `True → PUBLISHED`, `False → UNPUBLISHED`. If client sends `status`, use that directly.
  `status` takes precedence if both are sent.
- Public views filter on `status='PUBLISHED'` (replaces `is_active=True`).
- **Result**: Old frontend still works (reads/writes `is_active`), new frontend can start using `status`.

**Step 2 — Frontend: switch to status (deploy second)**
- Types: add `status: ContentStatus`, keep `is_active` as optional for reading.
- FormData builders: send `status` instead of `is_active`.
- List pages: read `status` for badges, fall back to `is_active` if `status` is absent (defensive).
- Editors: use `status` dropdown.
- **Result**: Frontend fully on `status`. Old `is_active` field in API responses is ignored.

**Step 3 — Backend: remove is_active (deploy last, after frontend is stable)**
- Remove `is_active` from models, serializers, and migration.
- Remove dual-write/dual-read logic from serializers.
- **Result**: Clean API surface with only `status`.

### Files Touched Summary

**Backend** (`tcomp-backend/tcomp/concierge/`):
- `models.py` — ContentStatus enum, replace is_active on Department + Experience
- `serializers.py` — Replace is_active with status in admin serializers
- `views.py` — Update 4 public view filters, dashboard stats
- `services.py` — Update stats query
- `admin.py` — Update list_display, list_filter
- New migration file (schema + data migration)

**Frontend** (`tcomp-frontend/src/`):
- `lib/concierge-types.ts` — ContentStatus type, update interfaces
- `lib/concierge-api.ts` — Add getDepartment, getExperience single-fetch functions
- `hooks/use-unsaved-changes.ts` — New
- `hooks/use-local-draft.ts` — New
- `app/(dashboard)/dashboard/departments/new/page.tsx` — New
- `app/(dashboard)/dashboard/departments/[slug]/edit/page.tsx` — New
- `app/(dashboard)/dashboard/departments/page.tsx` — Remove dialog, add links
- `app/(dashboard)/dashboard/departments/[deptSlug]/experiences/new/page.tsx` — New
- `app/(dashboard)/dashboard/departments/[deptSlug]/experiences/[id]/edit/page.tsx` — New
- `app/(dashboard)/dashboard/experiences/page.tsx` — Remove dialog, update links to nested routes
- `app/(dashboard)/dashboard/team/page.tsx` — Mobile cards
- `app/(dashboard)/dashboard/page.tsx` — Setup checklist
- `components/dashboard/SortableList.tsx` — Move buttons
- `components/dashboard/SetupChecklist.tsx` — New (optional, can inline)

---

## Verification Checklist

After implementation, verify:

- [ ] Create department on mobile (375px) — form is usable, scrolls naturally
- [ ] Write a long description, accidentally press back → unsaved changes warning shown
- [ ] Close browser mid-edit, reopen → draft restored with prompt
- [ ] Create department as DRAFT → not visible in public API
- [ ] Publish department → visible in public API, published_at set
- [ ] Unpublish department → hidden from public, shows "Unpublished" badge
- [ ] Reorder departments on mobile using up/down buttons → order persists
- [ ] View team page on mobile → card layout, all actions functional
- [ ] New hotel admin sees setup checklist → items link to correct pages
- [ ] Complete all checklist items → checklist shows 100%, dismiss works
- [ ] Edit experience with gallery on mobile → upload/delete/reorder all work
- [ ] `npm run build` passes with no errors
- [ ] Backend migration runs cleanly, existing data preserved correctly
