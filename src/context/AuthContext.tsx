"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  fetchProfile,
  logout as apiLogout,
} from "@/lib/auth";
import type {
  AuthProfile,
  HotelMembership,
  Role,
} from "@/lib/concierge-types";

interface AuthState {
  user: AuthProfile | null;
  memberships: HotelMembership[];
  /** Currently selected hotel slug (persisted in localStorage) */
  activeHotelSlug: string | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  /** Active membership for the selected hotel */
  activeMembership: HotelMembership | null;
  /** Current user role at the active hotel */
  role: Role | null;
  /** Switch active hotel */
  setActiveHotel: (slug: string) => void;
  /** Re-fetch profile (e.g. after membership change) */
  refreshProfile: () => Promise<void>;
  /** Logout and redirect to login */
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const ACTIVE_HOTEL_KEY = "concierge_active_hotel";

function getStoredHotel(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACTIVE_HOTEL_KEY);
}

function storeHotel(slug: string) {
  localStorage.setItem(ACTIVE_HOTEL_KEY, slug);
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const routerRef = useRef(router);
  const [state, setState] = useState<AuthState>({
    user: null,
    memberships: [],
    activeHotelSlug: null,
    loading: true,
  });

  // Keep router ref current without triggering re-renders
  useEffect(() => {
    routerRef.current = router;
  }, [router]);

  const applyProfile = useCallback((profile: AuthProfile) => {
    const stored = getStoredHotel();
    const activeMemberships = profile.memberships.filter((m) => m.is_active);
    const matchesStored = activeMemberships.find(
      (m) => m.hotel.slug === stored,
    );
    const activeSlug =
      matchesStored?.hotel.slug ?? activeMemberships[0]?.hotel.slug ?? null;

    if (activeSlug) storeHotel(activeSlug);

    setState({
      user: profile,
      memberships: activeMemberships,
      activeHotelSlug: activeSlug,
      loading: false,
    });
  }, []);

  const clearAndRedirect = useCallback(() => {
    localStorage.removeItem(ACTIVE_HOTEL_KEY);
    setState({ user: null, memberships: [], activeHotelSlug: null, loading: false });
    routerRef.current.replace("/login");
  }, []);

  const refreshProfile = useCallback(async () => {
    try {
      const res = await fetchProfile();
      if (!res.ok) {
        clearAndRedirect();
        return;
      }
      const profile: AuthProfile = await res.json();
      applyProfile(profile);
    } catch {
      clearAndRedirect();
    }
  }, [applyProfile, clearAndRedirect]);

  // Bootstrap: fetch profile once on mount.
  // Inlined to satisfy react-hooks/set-state-in-effect — setState is in an
  // async callback (after await), not synchronous in the effect body.
  const bootstrapRef = useRef(false);
  useEffect(() => {
    if (bootstrapRef.current) return;
    bootstrapRef.current = true;

    (async () => {
      try {
        const res = await fetchProfile();
        if (!res.ok) {
          clearAndRedirect();
          return;
        }
        const profile: AuthProfile = await res.json();
        applyProfile(profile);
      } catch {
        clearAndRedirect();
      }
    })();
  }, [applyProfile, clearAndRedirect]);

  const setActiveHotel = useCallback(
    (slug: string) => {
      const exists = state.memberships.find((m) => m.hotel.slug === slug);
      if (!exists) return;
      storeHotel(slug);
      setState((s) => ({ ...s, activeHotelSlug: slug }));
    },
    [state.memberships],
  );

  const logout = useCallback(async () => {
    try { await apiLogout(); } catch { /* clear locally regardless */ }
    clearAndRedirect();
  }, [clearAndRedirect]);

  const activeMembership =
    state.memberships.find((m) => m.hotel.slug === state.activeHotelSlug) ??
    null;
  const role = activeMembership?.role ?? null;

  return (
    <AuthContext.Provider
      value={{
        ...state,
        activeMembership,
        role,
        setActiveHotel,
        refreshProfile,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
