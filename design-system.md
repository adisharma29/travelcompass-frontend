# Refuje SaaS Design System

## Foundation: Brand → SaaS Translation

The Refuje brand is warm, earthy, and luxury-hospitality focused. The SaaS layer (hotel concierge dashboard) must feel professional and functional while maintaining brand connection. Two visual contexts coexist:

1. **Guest-facing pages** (`/h/[hotelSlug]/`) — Full warm brand palette. Cream backgrounds, rust accents, olive text. These are customer touchpoints that represent the hotel.
2. **Dashboard/admin pages** (`/dashboard/`) — Clean, neutral, data-friendly. White backgrounds with brand accents for key actions. These are staff productivity tools.

---

## 1. Color System

### 1.1 Brand Palette (Source of Truth)
From brand guidelines + existing homepage CSS:

| Token | Hex | RGB | Role |
|-------|-----|-----|------|
| **Rust** | `#A56014` | 165/96/20 | Primary accent, CTAs, links |
| **Deep Olive** | `#434431` | 67/68/49 | Primary text, dark surfaces |
| **Muted Olive** | `#7C7B55` | 124/123/85 | Secondary text, subtle labels |
| **Sand** | `#C9B29D` | 201/178/157 | Tertiary accent, light borders |
| **Cream** | `#FFE9CF` | 255/233/207 | Brand backgrounds, light surfaces |
| **White** | `#FFFFFF` | 255/255/255 | Text on dark, clean backgrounds |

### 1.2 SaaS Theme Tokens (shadcn/ui CSS Variables)

shadcn uses OKLCH color space with Tailwind v4's `@theme inline` directive. All tokens defined as CSS custom properties.

#### Light Mode (Dashboard)

```css
:root {
  /* Page */
  --background: oklch(0.99 0.003 80);          /* Near-white with warm micro-tint */
  --foreground: oklch(0.33 0.03 105);           /* Deep olive #434431 */

  /* Cards & Popovers */
  --card: oklch(1 0 0);                         /* Pure white */
  --card-foreground: oklch(0.33 0.03 105);      /* Deep olive */
  --popover: oklch(1 0 0);
  --popover-foreground: oklch(0.33 0.03 105);

  /* Primary — Rust (actions, buttons, links) */
  --primary: oklch(0.52 0.13 55);               /* #A56014 */
  --primary-foreground: oklch(1 0 0);           /* White */

  /* Secondary — Cream (subtle backgrounds, secondary buttons) */
  --secondary: oklch(0.95 0.03 75);             /* #FFE9CF */
  --secondary-foreground: oklch(0.33 0.03 105); /* Deep olive */

  /* Muted — Neutral warm (disabled, placeholder, subtle bg) */
  --muted: oklch(0.94 0.01 80);                 /* Warm gray ~#F0EBE5 */
  --muted-foreground: oklch(0.55 0.04 100);     /* Muted olive #7C7B55 */

  /* Accent — Hover/focus backgrounds */
  --accent: oklch(0.95 0.03 75);                /* Cream */
  --accent-foreground: oklch(0.33 0.03 105);    /* Deep olive */

  /* Destructive — Errors, delete actions */
  --destructive: oklch(0.55 0.22 27);           /* Red ~#DC2626 */
  --destructive-foreground: oklch(1 0 0);       /* White */

  /* Borders & Inputs */
  --border: oklch(0.88 0.02 75);                /* Warm border ~#E5DDD2 */
  --input: oklch(0.88 0.02 75);                 /* Same as border */
  --ring: oklch(0.52 0.13 55);                  /* Rust — focus ring */

  /* Sidebar */
  --sidebar: oklch(0.33 0.03 105);              /* Deep olive (dark sidebar) */
  --sidebar-foreground: oklch(0.95 0.03 75);    /* Cream text */
  --sidebar-primary: oklch(0.52 0.13 55);       /* Rust */
  --sidebar-primary-foreground: oklch(1 0 0);   /* White */
  --sidebar-accent: oklch(0.40 0.04 105);       /* Lighter olive hover */
  --sidebar-accent-foreground: oklch(0.95 0.03 75);
  --sidebar-border: oklch(0.40 0.04 105);
  --sidebar-ring: oklch(0.52 0.13 55);

  /* Charts (brand-derived progression) */
  --chart-1: oklch(0.52 0.13 55);               /* Rust */
  --chart-2: oklch(0.55 0.04 100);              /* Muted olive */
  --chart-3: oklch(0.78 0.03 60);               /* Sand */
  --chart-4: oklch(0.62 0.16 145);              /* Green (success) */
  --chart-5: oklch(0.60 0.15 250);              /* Blue (info) */

  /* Layout */
  --radius: 0.625rem;                           /* 10px — matches brand's rounded corners */
}
```

#### Dark Mode (Dashboard — future, define now for completeness)

```css
.dark {
  --background: oklch(0.18 0.02 105);           /* Dark olive-tinted */
  --foreground: oklch(0.93 0.01 80);            /* Warm off-white */

  --card: oklch(0.22 0.02 105);
  --card-foreground: oklch(0.93 0.01 80);
  --popover: oklch(0.22 0.02 105);
  --popover-foreground: oklch(0.93 0.01 80);

  --primary: oklch(0.62 0.14 55);               /* Lighter rust for dark bg */
  --primary-foreground: oklch(0.18 0.02 105);

  --secondary: oklch(0.28 0.03 105);
  --secondary-foreground: oklch(0.93 0.01 80);

  --muted: oklch(0.25 0.02 105);
  --muted-foreground: oklch(0.65 0.03 100);

  --accent: oklch(0.28 0.03 105);
  --accent-foreground: oklch(0.93 0.01 80);

  --destructive: oklch(0.55 0.22 27);
  --destructive-foreground: oklch(1 0 0);

  --border: oklch(0.30 0.02 105);
  --input: oklch(0.30 0.02 105);
  --ring: oklch(0.62 0.14 55);

  --sidebar: oklch(0.15 0.02 105);
  --sidebar-foreground: oklch(0.93 0.01 80);
  --sidebar-primary: oklch(0.62 0.14 55);
  --sidebar-primary-foreground: oklch(0.15 0.02 105);
  --sidebar-accent: oklch(0.22 0.03 105);
  --sidebar-accent-foreground: oklch(0.93 0.01 80);
  --sidebar-border: oklch(0.28 0.02 105);
  --sidebar-ring: oklch(0.62 0.14 55);

  --chart-1: oklch(0.62 0.14 55);
  --chart-2: oklch(0.65 0.05 100);
  --chart-3: oklch(0.78 0.04 60);
  --chart-4: oklch(0.70 0.16 145);
  --chart-5: oklch(0.68 0.15 250);
}
```

### 1.3 Request Status Colors

The concierge request state machine needs distinct, consistent status colors:

| Status | Color | Usage | Tailwind Class |
|--------|-------|-------|----------------|
| `CREATED` | Blue `oklch(0.60 0.15 250)` | New/pending requests | `bg-blue-100 text-blue-800` |
| `ACKNOWLEDGED` | Amber `oklch(0.75 0.15 85)` | Staff is aware, working on it | `bg-amber-100 text-amber-800` |
| `CONFIRMED` | Green `oklch(0.62 0.16 145)` | Booked/resolved positively | `bg-green-100 text-green-800` |
| `NOT_AVAILABLE` | Red `oklch(0.55 0.22 27)` | Unavailable | `bg-red-100 text-red-800` |
| `NO_SHOW` | Slate `oklch(0.55 0.02 260)` | Guest didn't show | `bg-slate-100 text-slate-800` |
| `ALREADY_BOOKED_OFFLINE` | Purple `oklch(0.55 0.15 300)` | Booked outside platform | `bg-purple-100 text-purple-800` |
| `EXPIRED` | Gray `oklch(0.60 0 0)` | System-expired (72h) | `bg-gray-100 text-gray-600` |

### 1.4 Guest Page Palette (Warm Brand)

Guest-facing pages under `(hotel)` retain the existing warm brand tokens:

```css
/* These already exist in globals.css @theme block — reuse as-is */
--color-bg: var(--color-brand-cream);           /* #FFE9CF */
--color-bg-card: #FFFAF3;
--color-text: var(--color-brand-olive-deep);    /* #434431 */
--color-text-secondary: var(--color-brand-olive-muted); /* #7C7B55 */
--color-accent: var(--color-brand-rust);        /* #A56014 */
```

Guest pages do NOT use shadcn components — they use custom-styled components with the warm palette to match the hotel brand experience.

---

## 2. Typography

### 2.1 Font Stack

| Role | Font | Weights | Usage |
|------|------|---------|-------|
| **Display** | BioRhyme | 400, 700 | Page titles, section headings, hero text |
| **Body** | Brinnan | 400, 700 | Body text, labels, UI copy |
| **System/UI** | DM Sans | 400, 500, 600 | Fallback, small UI text, badges, table headers |

### 2.2 Type Scale (Dashboard)

| Level | Size | Weight | Font | Line Height | Usage |
|-------|------|--------|------|-------------|-------|
| `h1` | 30px / 1.875rem | 700 | BioRhyme | 1.2 | Page titles |
| `h2` | 24px / 1.5rem | 700 | BioRhyme | 1.25 | Section headers |
| `h3` | 20px / 1.25rem | 600 | Brinnan | 1.3 | Card titles |
| `h4` | 16px / 1rem | 600 | Brinnan | 1.4 | Sub-section headers |
| `body` | 14px / 0.875rem | 400 | Brinnan | 1.5 | Default body text |
| `body-sm` | 13px / 0.8125rem | 400 | Brinnan | 1.5 | Secondary text, descriptions |
| `caption` | 12px / 0.75rem | 500 | DM Sans | 1.4 | Labels, badges, metadata |
| `overline` | 11px / 0.6875rem | 600 | DM Sans | 1.3 | Overlines, status labels (uppercase + tracking) |

### 2.3 Typography Rules
- Dashboard headings (h1, h2) use BioRhyme for brand presence
- All interactive UI text (buttons, inputs, labels) uses Brinnan
- Table headers, badges, and metadata use DM Sans at small sizes for clarity
- Guest pages use the same fonts but with the existing warm styling
- Letter-spacing: 0.01em for body, 0.08em for overlines/labels

---

## 3. Spacing & Layout

### 3.1 Spacing Scale
Use Tailwind's default spacing scale. Key recurring values:
- `4px` (1) — tight spacing within components
- `8px` (2) — standard inner padding
- `12px` (3) — between related elements
- `16px` (4) — card inner padding
- `24px` (6) — section spacing
- `32px` (8) — between major sections
- `48px` (12) — page-level spacing

### 3.2 Border Radius
- `--radius: 0.625rem` (10px) — default for cards, inputs, buttons
- `--radius / 2` (5px) — badges, chips
- `--radius * 2` (20px) — large containers, modals
- Full round — avatars, status dots

### 3.3 Dashboard Layout
- **Sidebar:** 256px wide (collapsed: 48px on mobile), dark olive background
- **Main content:** Max-width 1280px, centered with responsive padding
- **Cards:** White background, subtle warm border, 10px radius, light shadow
- **Tables:** Full-width within content area, zebra striping optional

---

## 4. Component Patterns

### 4.1 shadcn Components to Install

**Phase 0 (Foundation):**
```
button input label card dialog sheet select
separator badge avatar dropdown-menu
tooltip skeleton
```

**Phase 2 (Dashboard Shell):**
```
sidebar navigation-menu tabs form
table command popover
```

**Phase 3 (Admin CRUD):**
```
textarea switch checkbox radio-group
calendar date-picker time-picker
alert alert-dialog toast sonner
```

**Phase 5 (Notifications):**
```
scroll-area collapsible
```

### 4.2 Custom Components

These are built on shadcn primitives with project-specific styling:

| Component | Base | Purpose |
|-----------|------|---------|
| `StatusBadge` | Badge | Color-coded request status pill |
| `RequestTable` | Table | SSE-driven request queue with filters |
| `StatsCard` | Card | Dashboard metric with trend indicator |
| `ScheduleEditor` | Custom | Department schedule JSON editor |
| `OTPInput` | Input | 6-digit OTP code entry with auto-advance |
| `NotificationBell` | DropdownMenu | Bell icon + unread count + dropdown list |
| `EscalationBanner` | Alert | Degraded escalation warning |

### 4.3 Button Hierarchy

| Variant | Usage | Example |
|---------|-------|---------|
| `default` (primary) | Primary actions | "Acknowledge", "Confirm", "Submit Request" |
| `secondary` | Secondary actions | "Cancel", "Back", "View Details" |
| `outline` | Tertiary/toggle actions | "Filter", "Export", department pills |
| `destructive` | Dangerous actions | "Revoke Stay", "Deactivate" |
| `ghost` | Minimal/inline actions | Icon buttons, table row actions |
| `link` | Navigation | Breadcrumbs, inline links |

---

## 5. shadcn/ui Configuration

### 5.1 Installation
```bash
pnpm dlx shadcn@latest init
```

### 5.2 `components.json`
```json
{
  "$schema": "https://ui.shadcn.com/schema.json",
  "style": "new-york",
  "rsc": true,
  "tsx": true,
  "tailwind": {
    "config": "",
    "css": "src/app/globals.css",
    "baseColor": "neutral",
    "cssVariables": true,
    "prefix": ""
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "iconLibrary": "lucide"
}
```

### 5.3 `lib/utils.ts`
```typescript
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

### 5.4 New Dependencies
```
clsx
tailwind-merge
class-variance-authority
lucide-react
```

---

## 6. Iconography

- **Icon library:** Lucide React (shadcn default, tree-shakeable)
- **Icon size:** 16px (size-4) for inline, 20px (size-5) for buttons, 24px (size-6) for nav
- **Status icons:**
  - CREATED: `Circle` (unfilled)
  - ACKNOWLEDGED: `Eye`
  - CONFIRMED: `CheckCircle`
  - NOT_AVAILABLE: `XCircle`
  - NO_SHOW: `UserX`
  - ALREADY_BOOKED_OFFLINE: `CalendarCheck`
  - EXPIRED: `Clock`
- **Nav icons:** `LayoutDashboard`, `Inbox`, `Building2`, `Users`, `QrCode`, `Settings`

---

## 7. Responsive Breakpoints

Follow Tailwind's default breakpoints:
- `sm` (640px) — Mobile landscape
- `md` (768px) — Tablet
- `lg` (1024px) — Desktop (sidebar expands)
- `xl` (1280px) — Wide desktop (max content width)

### Dashboard Responsive Strategy
- **Mobile (<1024px):** Sidebar collapses to hamburger, tables become card lists
- **Desktop (>=1024px):** Full sidebar + table views
- **Guest pages:** Mobile-first (most guests use phones)

---

## 8. Dark Mode

- Dark mode support is defined in CSS variables above for future use.
- **v1 ships light mode only** for dashboard and guest pages.
- Dark mode toggle can be added post-launch via shadcn's `ThemeProvider`.
- Guest pages will NOT have dark mode (hotels control their brand appearance).

---

## 9. Animation & Motion

- **Default transitions:** 150ms ease for hovers, 200ms for state changes
- **Reduced motion:** Respect `prefers-reduced-motion` (already in globals.css)
- **Loading states:** shadcn Skeleton components
- **SSE updates:** Subtle highlight flash on new/updated table rows (200ms yellow fade)
- **No heavy animations in dashboard** — prioritize speed and clarity

---

## 10. Accessibility

- All interactive elements must have visible focus rings (rust `--ring` color)
- Color alone must not convey status — combine with icons and text labels
- Minimum contrast ratio: 4.5:1 for body text, 3:1 for large text
- All form inputs must have associated labels
- Status badges must include text (not just color)
- Dashboard keyboard-navigable (tab order, escape to close modals)
