# Plan: Staff Action Labels + Guest "My Requests" on Landing

## Context

Two issues from testing:
1. Staff requests page shows "Acknowledged" as an action button — reads as past-tense state, not a verb. Confusing UX.
2. When a guest is logged in, the hotel landing page gives no indication of auth state and no way to see previous/ongoing requests.

---

## Change 1: Staff Action Button Labels

**File**: `src/app/(dashboard)/dashboard/requests/page.tsx`

The `STATUS_LABEL` map is used for both status badges and action buttons. Badges should stay as-is ("Acknowledged", "Confirmed"), but action buttons need imperative verbs.

**Steps**:
1. Add `ACTION_LABEL` map after `STATUS_LABEL` (~line 73):
   ```ts
   const ACTION_LABEL: Record<string, string> = {
     ACKNOWLEDGED: "Acknowledge",
     CONFIRMED: "Confirm",
     NOT_AVAILABLE: "Mark Unavailable",
     NO_SHOW: "Mark No-Show",
     ALREADY_BOOKED_OFFLINE: "Mark Booked Offline",
   };
   ```
2. Update line ~318 (action button text) from `STATUS_LABEL[t]` to `ACTION_LABEL[t] ?? STATUS_LABEL[t]`.

1 file, ~10 lines.

---

## Change 2: Guest Logged-In State + "Your Requests"

### Part A: Backend — hotel-scoped filtering for `/me/requests/`

**File**: `tcomp-backend/tcomp/concierge/views.py` — `MyRequestsList`

**Problem**: `MyRequestsList` returns all requests across all hotels for the authenticated guest. The serializer (`ServiceRequestListSerializer`) has no `hotel_slug` field, so client-side filtering is impossible. Showing requests from Hotel B on Hotel A's landing page is wrong.

**Fix**: Add optional `?hotel=<slug>` query param filter to `MyRequestsList.get_queryset()`:
```python
def get_queryset(self):
    qs = ServiceRequest.objects.filter(
        guest_stay__guest=self.request.user,
    ).select_related(
        'department', 'experience', 'guest_stay__guest',
    ).order_by('-created_at')
    hotel_slug = self.request.query_params.get('hotel')
    if hotel_slug:
        qs = qs.filter(guest_stay__hotel__slug=hotel_slug)
    return qs
```

~3 lines added. Backwards-compatible (no param = existing behavior).

### Part B: API function

**File**: `src/lib/guest-auth.ts`

Add `getMyRequests(hotelSlug: string)` calling `GET /me/requests/?hotel={hotelSlug}` via the existing `authFetch(url(...))` pattern used throughout the file.

**Pagination handling**: The endpoint is a DRF `ListAPIView` which returns `{ count, next, previous, results }`. The function must unwrap `.results` from the paginated envelope. Uses the local `PaginatedResponse<T>` interface already defined at the top of `guest-auth.ts` (line 24). Returns `ServiceRequestListItem[]` (empty array on auth failure — no page breakage). Import `ServiceRequestListItem` from `concierge-types.ts`.

```ts
export async function getMyRequests(hotelSlug: string): Promise<ServiceRequestListItem[]> {
  try {
    const res = await authFetch(url(`/me/requests/?hotel=${encodeURIComponent(hotelSlug)}`));
    if (!res.ok) return [];
    const data: PaginatedResponse<ServiceRequestListItem> = await res.json();
    return data.results;
  } catch {
    return [];
  }
}
```

### Part C: Header — show guest identity

**File**: `src/app/(hotel)/h/[hotelSlug]/hotel-landing-client.tsx`

In the branded header bar, add a right-aligned element showing guest's first name (or phone fallback) with a `User` icon from lucide. Uses `ml-auto` to push right. Only renders when `isAuthenticated`.

### Part D: "Your Requests" section

**File**: `src/app/(hotel)/h/[hotelSlug]/hotel-landing-client.tsx`

Between the hotel intro and "Explore Our Services", render a request list when `requests.length > 0`:

- Fetch on mount via `useEffect` when `isAuthenticated`, passing `hotelSlug` to scope results
- Each card: experience name (or dept name fallback), formatted date, status badge with colored dot
- Guest-friendly status labels: CREATED→"Pending", ACKNOWLEDGED→"Being Reviewed", CONFIRMED→"Confirmed", etc.
- Status badge colors: accent for pending/reviewing, green for confirmed, red for not available, gray for expired/no-show
- No empty state (nothing shown if no requests)
- Matches existing visual style (rounded-xl, 4% brand tint background)

---

## Files Modified

| File | Change |
|------|--------|
| `src/app/(dashboard)/dashboard/requests/page.tsx` | Add `ACTION_LABEL`, use for button text |
| `tcomp-backend/tcomp/concierge/views.py` | Add `?hotel` query param filter to `MyRequestsList` |
| `src/lib/guest-auth.ts` | Add `getMyRequests(hotelSlug)` with pagination unwrap |
| `src/app/(hotel)/h/[hotelSlug]/hotel-landing-client.tsx` | Guest identity in header, "Your Requests" section |

## Verification

1. Backend: `python manage.py check` passes after `MyRequestsList` change (run inside the backend container or venv).
2. Staff side: Open requests page → action buttons should read "Acknowledge" / "Confirm" / "Mark Unavailable" / "Mark No-Show" (all imperative verbs). Status badges unchanged.
3. Guest side (logged in): Hotel landing shows name in header + request cards with status. Only requests for *this* hotel appear. Submit a new request → return to landing → new request appears.
4. Guest side (logged out): No header identity, no requests section.
5. Cross-hotel: Guest with stays at two hotels sees only relevant requests on each landing page.
6. `npm run build` passes.
