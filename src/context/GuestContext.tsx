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

interface GuestContextValue {
  hotel: Hotel;
  guestStay: GuestStay | null;
  guestUser: AuthProfile | null;
  qrCode: string | null;
  isAuthenticated: boolean;
  hasRoom: boolean;
  /** Navigate to target, redirecting through verify if not authenticated */
  guardedNavigate: (target: string) => void;
  /** Update auth state after successful OTP verification */
  setAuthState: (user: AuthProfile, stay: GuestStay) => void;
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

  // Bootstrap: ensure CSRF + silently check if user has existing session
  const bootstrapRef = useRef(false);
  useEffect(() => {
    if (bootstrapRef.current) return;
    bootstrapRef.current = true;

    (async () => {
      try {
        await ensureCSRFCookie();
        const profile = await getGuestProfile();
        if (profile) {
          setGuestUser(profile);
          // Find active stay for this hotel
          const stay = profile.stays?.find(
            (s) => s.hotel === hotel.id && s.is_active,
          );
          if (stay) setGuestStay(stay);
        }
      } catch {
        // Not authenticated — that's fine for guest browsing
      } finally {
        setLoading(false);
      }
    })();
  }, [hotel.id]);

  const isAuthenticated = guestUser !== null;
  const hasRoom = guestStay !== null && !!guestStay.room_number;

  const guardedNavigate = useCallback(
    (target: string) => {
      if (isAuthenticated && hasRoom) {
        routerRef.current.push(target);
      } else {
        const verifyUrl = `/h/${hotel.slug}/verify?next=${encodeURIComponent(target)}`;
        routerRef.current.push(verifyUrl);
      }
    },
    [isAuthenticated, hasRoom, hotel.slug],
  );

  const setAuthState = useCallback((user: AuthProfile, stay: GuestStay) => {
    setGuestUser(user);
    setGuestStay(stay);
  }, []);

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
