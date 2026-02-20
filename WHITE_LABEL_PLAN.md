# White-Label Plan: Guest-Facing Branding

## Goal

Before building the guest-facing pages (Phase 4), each hotel must be fully white-labelable — their brand identity, colors, fonts, and content should drive the entire guest experience. No trace of the platform brand should appear on guest pages.

---

## Current State

### Hotel model fields (backend)
Already exists: `name`, `slug`, `description`, `tagline`, `logo`, `cover_image`, `phone`, `email`, `website`, `timezone`

### Missing for white-label
- Brand colors (primary, secondary, accent, background, text)
- Typography (heading font, body font)
- Favicon
- Social media links (Instagram, Facebook, Twitter/X, WhatsApp)
- OG image (for social sharing previews)
- Custom footer text
- Legal page URLs (terms, privacy policy)

---

## Phase 3.75: White-Label Implementation

### Step 1: Backend — Extend Hotel Model

**File:** `tcomp-backend/tcomp/concierge/models.py`

Add these fields to the `Hotel` model:

```python
# --- Brand Colors ---
primary_color    = CharField(max_length=7, default="#1a1a1a", help_text="Hex, e.g. #1a1a1a")
secondary_color  = CharField(max_length=7, default="#f5f5f4", help_text="Hex, e.g. #f5f5f4")
accent_color     = CharField(max_length=7, default="#b45309", help_text="Hex, e.g. #b45309")

# --- Typography ---
heading_font     = CharField(max_length=100, blank=True, default="", help_text="Google Font name for headings")
body_font        = CharField(max_length=100, blank=True, default="", help_text="Google Font name for body text")

# --- Favicon ---
favicon          = ImageField(upload_to="hotel_favicons/", null=True, blank=True)

# --- Social Links ---
instagram_url    = URLField(blank=True, default="")
facebook_url     = URLField(blank=True, default="")
twitter_url      = URLField(blank=True, default="")
whatsapp_number  = CharField(max_length=20, blank=True, default="", help_text="With country code, e.g. +919876543210")

# --- SEO / Sharing ---
og_image         = ImageField(upload_to="hotel_og/", null=True, blank=True)

# --- Legal & Footer ---
footer_text      = CharField(max_length=500, blank=True, default="")
terms_url        = URLField(blank=True, default="")
privacy_url      = URLField(blank=True, default="")
```

**Migration:** `makemigrations` + `migrate`

### Step 2: Backend — Update Serializers

**File:** `tcomp-backend/tcomp/concierge/serializers.py`

**HotelPublicSerializer** — add all new fields so the guest page can consume them:
```
primary_color, secondary_color, accent_color,
heading_font, body_font, favicon,
instagram_url, facebook_url, twitter_url, whatsapp_number,
og_image, footer_text, terms_url, privacy_url
```

**HotelSettingsSerializer** (admin) — add all new fields as editable.

### Step 3: Backend — Hex Color Validation

Add a simple validator to ensure color fields are valid hex:
```python
import re
from django.core.validators import RegexValidator

hex_color_validator = RegexValidator(
    regex=r'^#[0-9a-fA-F]{6}$',
    message='Enter a valid hex color (e.g. #1a1a1a)'
)
```
Apply to `primary_color`, `secondary_color`, `accent_color`.

### Step 4: Frontend — Update Types

**File:** `src/lib/concierge-types.ts`

Add to `Hotel` interface:
```typescript
// Brand
primary_color: string;
secondary_color: string;
accent_color: string;
heading_font: string;
body_font: string;
favicon: string | null;

// Social
instagram_url: string;
facebook_url: string;
twitter_url: string;
whatsapp_number: string;

// SEO
og_image: string | null;

// Legal & Footer
footer_text: string;
terms_url: string;
privacy_url: string;
```

Add to `HotelSettings` interface (same fields, all editable).

### Step 5: Frontend — Branding Admin UI

**File:** `src/app/(dashboard)/dashboard/settings/page.tsx`

Add a new **"Branding"** card to the hotel settings page:

| Field | Component |
|-------|-----------|
| Primary color | Color input (`<input type="color">`) + hex text input |
| Secondary color | Same |
| Accent color | Same |
| Heading font | Combobox with popular Google Fonts (searchable) |
| Body font | Same |
| Favicon | `<ImageUploadArea>` (existing component) |
| OG image | `<ImageUploadArea>` |

Add a **"Social Links"** card:

| Field | Component |
|-------|-----------|
| Instagram URL | `<Input>` with placeholder |
| Facebook URL | `<Input>` with placeholder |
| Twitter/X URL | `<Input>` with placeholder |
| WhatsApp number | `<Input>` with placeholder "+919876543210" |

Add a **"Footer & Legal"** card:

| Field | Component |
|-------|-----------|
| Footer text | `<Input>` (short tagline for footer) |
| Terms URL | `<Input>` |
| Privacy policy URL | `<Input>` |

### Step 6: Frontend — CSS Variable Injection

**File:** New `src/lib/inject-brand-theme.ts`

A utility that takes a hotel's branding data and sets CSS custom properties on `document.documentElement`:

```typescript
export function injectBrandTheme(hotel: Hotel) {
  const root = document.documentElement;
  root.style.setProperty('--brand-primary', hotel.primary_color);
  root.style.setProperty('--brand-secondary', hotel.secondary_color);
  root.style.setProperty('--brand-accent', hotel.accent_color);
}
```

Guest-facing components will use these variables instead of hardcoded colors:
```css
.guest-hero { background-color: var(--brand-primary); }
.guest-cta  { background-color: var(--brand-accent); }
```

### Step 7: Frontend — Dynamic Google Fonts Loading

**File:** New `src/components/guest/BrandFontLoader.tsx`

A component that loads Google Fonts dynamically via `<link>` tags when `heading_font` or `body_font` is specified:

```typescript
// Inserts <link href="https://fonts.googleapis.com/css2?family=Playfair+Display&display=swap" rel="stylesheet">
// Sets --brand-heading-font and --brand-body-font CSS variables
```

Fallback fonts: `--brand-heading-font: serif` and `--brand-body-font: sans-serif` when no custom fonts are configured.

### Step 8: Frontend — Dynamic Metadata

**File:** Guest layout `src/app/(guest)/h/[hotelSlug]/layout.tsx`

Use Next.js `generateMetadata` to set per-hotel:
- `<title>` — hotel name
- `<meta name="description">` — hotel tagline/description
- `<link rel="icon">` — hotel favicon URL
- `<meta property="og:image">` — hotel OG image URL
- `<meta property="og:title">` — hotel name
- `<meta property="og:description">` — hotel tagline
- Theme color meta tag from `primary_color`

### Step 9: Frontend — Font Picker Component

**File:** New `src/components/dashboard/FontCombobox.tsx`

A searchable combobox (same pattern as `TimezoneCombobox`) with a curated list of ~30 popular Google Fonts suitable for hospitality:

Headings: Playfair Display, Cormorant Garamond, Libre Baskerville, Lora, Merriweather, EB Garamond, Crimson Text, DM Serif Display, Fraunces, etc.

Body: Inter, DM Sans, Source Sans 3, Nunito Sans, Work Sans, Outfit, Plus Jakarta Sans, Instrument Sans, etc.

Preview the selected font in the dropdown items.

### Step 10: Frontend — Brand Preview Component

**File:** New `src/components/dashboard/BrandPreview.tsx`

A live preview card in the settings page that shows how the brand will look on guest pages:
- Shows hotel logo on the configured primary_color background
- Heading text in the selected heading_font
- Body text in the selected body_font
- CTA button in the accent_color
- Updates in real-time as the admin changes values

---

## Impact on Phase 4, 5, 6

### Phase 4: Guest-Facing Pages

All guest pages will consume the brand theme:
- **Layout:** `BrandFontLoader` + `injectBrandTheme()` called on mount
- **Hotel landing:** Uses `--brand-primary` for hero bg, `--brand-accent` for CTAs, heading/body fonts
- **Department/experience pages:** Same brand variables throughout
- **Footer:** Shows `footer_text`, social icons linking to configured URLs, `terms_url`/`privacy_url` links
- **Metadata:** Dynamic per-hotel title, favicon, OG image via `generateMetadata`

### Phase 5: Notifications + PWA

- **PWA manifest:** `theme_color` and `background_color` from hotel's brand colors
- **Manifest generation** should be dynamic per hotel (endpoint or build-time)

### Phase 6: Polish

- **Guest page CSP headers:** Must allow Google Fonts CDN (`fonts.googleapis.com`, `fonts.gstatic.com`)
- **Social sharing validation:** Test OG tags render correctly per hotel
- **Performance:** Ensure font loading doesn't block rendering (use `display=swap`)

---

## Execution Order

1. Backend: add fields to Hotel model + migration
2. Backend: update serializers (public + settings)
3. Backend: hex color validation
4. Frontend: update types (Hotel, HotelSettings)
5. Frontend: create FontCombobox component
6. Frontend: add Branding / Social / Legal cards to settings page
7. Frontend: create inject-brand-theme utility
8. Frontend: create BrandFontLoader component
9. Frontend: create BrandPreview component for settings page
10. Frontend: verify build passes

---

## Verification

- Add brand colors to a hotel via settings — hex inputs validate, color picker works
- Select heading + body fonts — preview updates in real-time
- Upload favicon + OG image — preview shown in ImageUploadArea
- Add social links + footer text + legal URLs — save and reload, values persist
- Guest page (Phase 4) will consume all these values — verified when built

---

## Design Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Color format | Hex only (#RRGGBB) | Simple, universal, easy to validate, works directly as CSS values |
| Font source | Google Fonts only | Free, no licensing issues, massive selection, CDN-hosted |
| Font loading | Dynamic `<link>` injection | No build-time config needed, works per-hotel, `display=swap` prevents FOIT |
| CSS variables | Runtime injection on `<html>` | No build step, instant preview, works with any CSS framework |
| Number of color fields | 3 (primary, secondary, accent) | Covers 95% of branding needs without overwhelming non-designer hotel admins |
| Favicon format | Image upload (any format) | Next.js can serve any image as favicon via metadata API |
