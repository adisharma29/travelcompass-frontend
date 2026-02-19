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
    brand.heading_font ? `"${brand.heading_font}", serif` : "serif",
  );
  root.style.setProperty(
    "--brand-body-font",
    brand.body_font ? `"${brand.body_font}", sans-serif` : "sans-serif",
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
