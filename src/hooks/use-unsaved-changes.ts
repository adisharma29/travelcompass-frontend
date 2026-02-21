"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

/**
 * Hook to warn users about unsaved changes when navigating away.
 *
 * Handles:
 * 1. beforeunload — tab close, URL bar navigation, browser back to external site
 * 2. popstate — browser back/forward within the SPA
 * 3. Link click interception — catches <Link> / <a> navigations (sidebar, breadcrumbs, etc.)
 * 4. Provides a guard function for programmatic navigation (Back button)
 *
 * Returns:
 * - confirmDialogProps: props to spread onto a ConfirmDialog component
 * - guardNavigation: call before navigating; returns true if safe, false if blocked (dialog shown)
 */
export function useUnsavedChanges(isDirty: boolean) {
  const router = useRouter();
  const [showDialog, setShowDialog] = useState(false);
  const pendingNavigation = useRef<(() => void) | null>(null);
  const showDialogRef = useRef(false);
  useEffect(() => {
    showDialogRef.current = showDialog;
  });

  // 1. beforeunload — native browser prompt
  useEffect(() => {
    if (!isDirty) return;
    const handler = (e: BeforeUnloadEvent) => {
      e.preventDefault();
    };
    window.addEventListener("beforeunload", handler);
    return () => window.removeEventListener("beforeunload", handler);
  }, [isDirty]);

  // 2. popstate — browser back/forward within SPA
  const skipNextPopRef = useRef(false);
  useEffect(() => {
    if (!isDirty) return;

    const handler = () => {
      // Absorb the single popstate fired by our own go(-2) call
      if (skipNextPopRef.current) {
        skipNextPopRef.current = false;
        return;
      }

      // Push current URL back to prevent navigation
      window.history.pushState(null, "", window.location.href);

      // Only set up the pending navigation on the first back press;
      // subsequent presses while dialog is open just re-push.
      if (!showDialogRef.current) {
        setShowDialog(true);
        pendingNavigation.current = () => {
          const urlBefore = window.location.href;
          skipNextPopRef.current = true;
          // go(-2): skip both the re-pushed entry and the sentinel
          window.history.go(-2);
          // Fallback: if go(-2) was a no-op (shallow history), the
          // flag stays set because no popstate fires. Reset it on
          // the next tick so subsequent back presses remain guarded.
          setTimeout(() => {
            if (
              skipNextPopRef.current &&
              window.location.href === urlBefore
            ) {
              skipNextPopRef.current = false;
            }
          }, 0);
        };
      }
    };

    // Push a sentinel entry so the first back press stays on this page
    // (prevents Next.js App Router from starting a client-side route change)
    window.history.pushState(null, "", window.location.href);
    window.addEventListener("popstate", handler);

    return () => {
      window.removeEventListener("popstate", handler);
    };
  }, [isDirty]);

  // 3. Link click interception — catch <Link> / <a> navigations
  useEffect(() => {
    if (!isDirty) return;

    const handler = (e: MouseEvent) => {
      // Only intercept normal left clicks (not ctrl/cmd/shift/right-click)
      if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey)
        return;

      const anchor = (e.target as HTMLElement).closest?.(
        "a[href]",
      ) as HTMLAnchorElement | null;
      if (!anchor) return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || anchor.target === "_blank") return;

      // Only intercept internal same-origin links that navigate to a different page
      try {
        const url = new URL(href, window.location.origin);
        if (url.origin !== window.location.origin) return;
        if (
          url.pathname + url.search ===
          window.location.pathname + window.location.search
        )
          return;
      } catch {
        return;
      }

      e.preventDefault();
      e.stopPropagation();

      if (!showDialogRef.current) {
        setShowDialog(true);
        pendingNavigation.current = () => {
          router.push(href);
        };
      }
    };

    // Use capture phase to intercept before Next.js <Link> handlers
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [isDirty, router]);

  // 4. Guard for programmatic navigation
  const guardNavigation = useCallback(
    (navigate: () => void): boolean => {
      if (!isDirty) {
        navigate();
        return true;
      }
      pendingNavigation.current = navigate;
      setShowDialog(true);
      return false;
    },
    [isDirty],
  );

  const handleConfirm = useCallback(() => {
    setShowDialog(false);
    pendingNavigation.current?.();
    pendingNavigation.current = null;
  }, []);

  const handleOpenChange = useCallback((open: boolean) => {
    if (!open) {
      setShowDialog(false);
      pendingNavigation.current = null;
    }
  }, []);

  return {
    guardNavigation,
    confirmDialogProps: {
      open: showDialog,
      onOpenChange: handleOpenChange,
      title: "Unsaved changes",
      description:
        "You have unsaved changes. Are you sure you want to leave? Your changes will be lost.",
      confirmLabel: "Leave",
      cancelLabel: "Stay",
      variant: "destructive" as const,
      onConfirm: handleConfirm,
    },
  };
}
