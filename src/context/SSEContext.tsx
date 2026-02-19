"use client";

import {
  createContext,
  useContext,
  useCallback,
  useEffect,
  useRef,
  type ReactNode,
} from "react";
import { useAuth } from "@/context/AuthContext";
import { useRequestStream } from "@/hooks/use-request-stream";
import type { SSERequestEvent } from "@/lib/concierge-types";
import { toast } from "sonner";

interface SSEContextValue {
  connected: boolean;
}

const SSEContext = createContext<SSEContextValue>({ connected: false });

export function SSEProvider({ children }: { children: ReactNode }) {
  const { activeHotelSlug } = useAuth();

  const handleEvent = useCallback((event: SSERequestEvent) => {
    // 1. Dispatch for page-level data refetch
    window.dispatchEvent(
      new CustomEvent("sse:request-event", { detail: event }),
    );

    // 2. Refresh notification bell
    window.dispatchEvent(new CustomEvent("notifications:refresh"));

    // 3. Show toast
    if (event.event === "request.created") {
      toast.info("New request received", {
        description: `Room ${event.public_id.slice(0, 8)}…`,
        action: {
          label: "View",
          onClick: () => {
            window.location.href = "/dashboard/requests";
          },
        },
      });
    } else if (event.event === "request.updated") {
      toast("Request updated", {
        description: `Status: ${event.status.replace(/_/g, " ").toLowerCase()}`,
      });
    }
  }, []);

  const { connected } = useRequestStream({
    hotelSlug: activeHotelSlug,
    onEvent: handleEvent,
  });

  return (
    <SSEContext.Provider value={{ connected }}>
      {children}
    </SSEContext.Provider>
  );
}

export function useSSE() {
  return useContext(SSEContext);
}

/**
 * Hook for pages that need to refetch data on SSE events.
 * Replaces direct useRequestStream usage on individual pages.
 */
export function useSSERefetch(callback: () => void) {
  const callbackRef = useRef(callback);
  useEffect(() => {
    callbackRef.current = callback;
  }, [callback]);

  useEffect(() => {
    function handler() {
      callbackRef.current();
    }
    window.addEventListener("sse:request-event", handler);
    return () => window.removeEventListener("sse:request-event", handler);
  }, []);
}
