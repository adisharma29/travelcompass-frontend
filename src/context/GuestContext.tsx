"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { AuthProfile, GuestStay, Hotel } from "@/lib/concierge-types";
import { getGuestProfile } from "@/lib/guest-auth";
import { ensureCSRFCookie } from "@/lib/auth";
import { injectBrandTheme, clearBrandTheme } from "@/lib/inject-brand-theme";

/** Buffer in ms subtracted from expires_at to account for clock skew */
const EXPIRY_BUFFER_MS = 60_000;

function isStayValid(stay: GuestStay | null): boolean {
  if (!stay || !stay.is_active) return false;
  return new Date(stay.expires_at).getTime() - EXPIRY_BUFFER_MS > Date.now();
}

interface GuestContextValue {
  hotel: Hotel;
  guestStay: GuestStay | null;
  guestUser: AuthProfile | null;
  qrCode: string | null;
  /** Has a valid JWT / profile (global identity) */
  isAuthenticated: boolean;
  /** Has an active, non-expired stay for this hotel (hotel-local access) */
  isVerified: boolean;
  hasRoom: boolean;
  /** Navigate to target, redirecting through verify if not verified */
  guardedNavigate: (target: string) => void;
  /** Update auth state after OTP verification, or clear on logout (pass nulls) */
  setAuthState: (user: AuthProfile | null, stay: GuestStay | null) => void;
}

const GuestContext = createContext<GuestContextValue | null>(null);

export function GuestProvider({
  hotel,
  children,
}: {
  hotel: Hotel;
  children: ReactNode;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const routerRef = useRef(router);

  const [guestUser, setGuestUser] = useState<AuthProfile | null>(null);
  const [guestStay, setGuestStay] = useState<GuestStay | null>(null);
  const [loading, setLoading] = useState(true);

  const qrCode = searchParams.get("qr") ?? null;

  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  // Inject brand theme
  useEffect(() => {
    injectBrandTheme(hotel);
    return () => clearBrandTheme();
  }, [hotel]);

  // Bootstrap: ensure CSRF + silently check if user has existing session.
  // Re-runs when hotel.id changes (e.g. soft navigation between hotels)
  // to pick up the correct stay and clear stale state.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);

    (async () => {
      try {
        await ensureCSRFCookie();
        const profile = await getGuestProfile();
        if (cancelled) return;
        if (profile) {
          setGuestUser(profile);
          const stay = profile.stays?.find(
            (s) => s.hotel === hotel.id && s.is_active,
          ) ?? null;
          setGuestStay(stay);
        } else {
          setGuestUser(null);
          setGuestStay(null);
        }
      } catch {
        if (cancelled) return;
        // Not authenticated — that's fine for guest browsing
        setGuestUser(null);
        setGuestStay(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => { cancelled = true; };
  }, [hotel.id]);

  const isAuthenticated = guestUser !== null;
  const isVerified = isAuthenticated && isStayValid(guestStay);
  const hasRoom = isVerified && !!guestStay?.room_number;

  const guardedNavigate = useCallback(
    (target: string) => {
      if (isVerified && hasRoom) {
        routerRef.current.push(target);
      } else {
        const verifyUrl = `/h/${hotel.slug}/verify?next=${encodeURIComponent(target)}`;
        routerRef.current.push(verifyUrl);
      }
    },
    [isVerified, hasRoom, hotel.slug],
  );

  const setAuthState = useCallback((user: AuthProfile | null, stay: GuestStay | null) => {
    setGuestUser(user);
    setGuestStay(stay);
  }, []);

  // Listen for 403 session-expired events from guestMutationFetch
  useEffect(() => {
    function handleExpired() {
      setGuestStay(null);
      const returnTo = window.location.pathname + window.location.search + window.location.hash;
      const verifyUrl = `/h/${hotel.slug}/verify?next=${encodeURIComponent(returnTo)}`;
      routerRef.current.push(verifyUrl);
    }
    window.addEventListener("guest:session-expired", handleExpired);
    return () => window.removeEventListener("guest:session-expired", handleExpired);
  }, [hotel.slug]);

  if (loading) {
    return null; // Layout skeleton handles loading state
  }

  return (
    <GuestContext.Provider
      value={{
        hotel,
        guestStay,
        guestUser,
        qrCode,
        isAuthenticated,
        isVerified,
        hasRoom,
        guardedNavigate,
        setAuthState,
      }}
    >
      {children}
    </GuestContext.Provider>
  );
}

export function useGuest() {
  const ctx = useContext(GuestContext);
  if (!ctx) throw new Error("useGuest must be used within GuestProvider");
  return ctx;
}
