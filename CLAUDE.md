# Project: Field Guide — Hotel Concierge Platform (Frontend)

## Overview
Multi-tenant hotel concierge SaaS frontend. Next.js 16.1.6 (App Router) + React 19 + Tailwind v4 + shadcn/ui.
Extends the existing Refuje travel guide website with guest-facing hotel pages and a staff/admin dashboard.

## Domains
- Production: `refuje.com` (frontend), `api.refuje.com` (API)
- Development: `localhost:6001` (frontend), `localhost:8000` (API)

## Implementation Tracking
- **Always check `PROGRESS.md`** at the project root before starting work — it tracks what's done and what's next.
- **`design-system.md`** defines the SaaS design system, color tokens, and shadcn theme.
- Implementation follows phases 2-6 in `v1_implementation_plan_FIXED_v4_updated.md`.
- Backend is complete on branch `feat/concierge-v1` in `tcomp-backend`.

## Branch
- Feature branch: `feat/concierge-v1`
- Do not push to main without review.

## Project Structure
```
src/
├── app/
│   ├── (site)/          # Existing marketing/guide pages (DO NOT MODIFY)
│   ├── (fieldguide)/    # Existing field guide pages (DO NOT MODIFY)
│   ├── (hotel)/         # NEW: Guest-facing hotel pages (/h/[hotelSlug]/)
│   ├── (dashboard)/     # NEW: Staff/admin dashboard
│   ├── login/           # NEW: Staff login page
│   └── globals.css      # Global styles + design tokens
├── components/
│   ├── ui/              # NEW: shadcn/ui components
│   ├── hotel/           # NEW: Guest-facing hotel components
│   ├── dashboard/       # NEW: Dashboard components
│   └── site/            # Existing marketing components (DO NOT MODIFY)
├── lib/
│   ├── auth.ts          # NEW: Cookie-based auth (staff)
│   ├── guest-auth.ts    # NEW: Guest OTP auth
│   ├── concierge-api.ts # NEW: All concierge API functions
│   ├── concierge-types.ts # NEW: TypeScript types for concierge models
│   ├── push.ts          # NEW: Push subscription helper
│   ├── use-request-stream.ts # NEW: SSE hook for real-time dashboard
│   ├── utils.ts         # NEW: shadcn cn() utility
│   └── api.ts           # Existing API helpers
├── context/
│   └── AuthContext.tsx   # NEW: Auth context for dashboard
├── hooks/               # Existing + new hooks
└── data/                # Existing experience data (DO NOT MODIFY)
```

## Key Conventions

### Auth
- Cookie-based JWT auth (httpOnly) — NO tokens in JavaScript, NO localStorage
- Every API call uses `credentials: 'include'`
- Unsafe methods (POST/PATCH/DELETE) must include `X-CSRFToken` header
- On app mount, call `GET /api/v1/auth/csrf/` to obtain CSRF cookie
- Auth refresh handled transparently in `authFetch()` wrapper
- Guest auth uses same cookie system (OTP → httpOnly JWT)

### API
- Backend base URL: `process.env.NEXT_PUBLIC_API_URL` (e.g. `http://localhost:8000`)
- All endpoints prefixed with `/api/v1/`
- Use `authFetch()` from `lib/auth.ts` for all authenticated requests
- Hotel-scoped routes use `{hotel_slug}` parameter
- Push deep-links resolve via `/me/requests/{public_id}/` (no hotel slug needed)

### Styling & Components
- shadcn/ui (v3.8.x, Radix primitives) for all dashboard UI components
- Tailwind v4 with `@theme inline` for design tokens
- OKLCH color format for shadcn CSS variables
- Brand fonts: BioRhyme (display headings), Brinnan (body text), DM Sans (UI/system fallback)
- Guest pages use warm brand palette; Dashboard uses neutral SaaS palette
- See `design-system.md` for complete token definitions

### Route Groups
- `(site)` — Existing marketing site. **DO NOT MODIFY.**
- `(fieldguide)` — Existing interactive guide. **DO NOT MODIFY.**
- `(hotel)` — Guest-facing hotel pages. Warm brand styling. CSP-hardened.
- `(dashboard)` — Staff/admin dashboard. Clean SaaS styling. Auth-guarded.
- `login` — Staff login. Two tabs: Email + Password, Phone + OTP.

### Real-Time
- Dashboard uses SSE (Server-Sent Events) via `useRequestStream` hook
- SSE endpoint: `GET /hotels/{hotel_slug}/requests/stream/`
- STAFF sees own department events; ADMIN/SUPERADMIN sees all
- No polling — SSE is the only real-time mechanism

### Security
- No `dangerouslySetInnerHTML` anywhere — all text rendered as plain text
- Strict CSP for guest route group `(hotel)`
- Push payloads contain only `request_public_id` + type — no PII
- Dashboard URLs use opaque `public_id`, never numeric IDs
- `confirmation_token` field must NEVER appear in any frontend code (Phase 2 reserved)

## Commands
- Dev server: `npm run dev` (port 6001)
- Build: `npm run build`
- Lint: `npm run lint`
- Deploy: `npm run deploy` (Cloudflare Workers via OpenNext)

## Do Not
- Commit with attribution to anyone
- Modify existing `(site)` or `(fieldguide)` route groups
- Store tokens in localStorage or sessionStorage
- Expose `confirmation_token` in any component or API call
- Use `dangerouslySetInnerHTML` for user-supplied content
- Use numeric request IDs in dashboard URLs (use `public_id` only)
- Add polling for real-time updates (use SSE)
