/**
 * Fonts already loaded globally via next/font in the root layout.
 * These are referenced via their CSS variable instead of a quoted name,
 * and BrandFontLoader should skip fetching them from Google Fonts.
 */
const LOCAL_FONTS = new Map(
  Object.entries({
    brinnan: "var(--font-brinnan)",
    biorhyme: "var(--font-biorhyme)",
  }),
);

/** Check whether a font name is loaded locally (case-insensitive). */
export function isLocalFont(name: string): boolean {
  return LOCAL_FONTS.has(name.toLowerCase());
}

function resolveFontStack(name: string, fallback: string): string {
  if (!name) return fallback;
  const local = LOCAL_FONTS.get(name.toLowerCase());
  if (local) return `${local}, ${fallback}`;
  return `"${name}", ${fallback}`;
}

/**
 * Injects hotel brand CSS custom properties onto <html>.
 * Called by the guest layout on mount so all guest components can
 * use var(--brand-primary) etc. instead of hardcoded colors.
 */
export function injectBrandTheme(brand: {
  primary_color: string;
  secondary_color: string;
  accent_color: string;
  heading_font: string;
  body_font: string;
}) {
  const root = document.documentElement;
  root.style.setProperty("--brand-primary", brand.primary_color);
  root.style.setProperty("--brand-secondary", brand.secondary_color);
  root.style.setProperty("--brand-accent", brand.accent_color);
  root.style.setProperty(
    "--brand-heading-font",
    resolveFontStack(brand.heading_font, '"BioRhyme", serif'),
  );
  root.style.setProperty(
    "--brand-body-font",
    resolveFontStack(brand.body_font, 'var(--font-brinnan), "DM Sans", sans-serif'),
  );
}

/** Removes all injected brand CSS variables. */
export function clearBrandTheme() {
  const root = document.documentElement;
  root.style.removeProperty("--brand-primary");
  root.style.removeProperty("--brand-secondary");
  root.style.removeProperty("--brand-accent");
  root.style.removeProperty("--brand-heading-font");
  root.style.removeProperty("--brand-body-font");
}
