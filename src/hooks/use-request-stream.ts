"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { getClientApiUrl } from "@/lib/utils";
import type { SSERequestEvent } from "@/lib/concierge-types";

const API = getClientApiUrl();

interface UseRequestStreamOptions {
  hotelSlug: string | null;
  onEvent?: (event: SSERequestEvent) => void;
}

/**
 * SSE hook for real-time dashboard updates.
 * Connects to `GET /hotels/{hotel_slug}/requests/stream/`
 * with proper cleanup and exponential backoff on disconnect.
 *
 * Backend sends named events (event: request.created / request.updated),
 * so we use addEventListener instead of onmessage.
 */
export function useRequestStream({
  hotelSlug,
  onEvent,
}: UseRequestStreamOptions) {
  const [connected, setConnected] = useState(false);
  const onEventRef = useRef(onEvent);
  useEffect(() => {
    onEventRef.current = onEvent;
  }, [onEvent]);

  // Persist backoff delay and reconnect timer across reconnects
  const retryDelayRef = useRef(1000);
  const retryTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const esRef = useRef<EventSource | null>(null);

  const cleanup = useCallback(() => {
    if (retryTimerRef.current !== null) {
      clearTimeout(retryTimerRef.current);
      retryTimerRef.current = null;
    }
    if (esRef.current) {
      esRef.current.close();
      esRef.current = null;
    }
    setConnected(false);
  }, []);

  useEffect(() => {
    if (!hotelSlug) return;

    // Reset backoff on fresh connection (new hotel or first mount)
    retryDelayRef.current = 1000;

    function connect() {
      // Clean up any prior connection before creating a new one
      if (esRef.current) {
        esRef.current.close();
        esRef.current = null;
      }

      const url = `${API}/api/v1/hotels/${hotelSlug}/requests/stream/`;
      const es = new EventSource(url, { withCredentials: true });
      esRef.current = es;

      es.onopen = () => {
        setConnected(true);
        retryDelayRef.current = 1000; // reset backoff on successful connect
      };

      // Backend sends named events — listen for each type
      const handleEvent = (e: MessageEvent) => {
        try {
          const data = JSON.parse(e.data) as SSERequestEvent;
          onEventRef.current?.(data);
        } catch {
          // Ignore malformed messages
        }
      };

      es.addEventListener("request.created", handleEvent);
      es.addEventListener("request.updated", handleEvent);

      es.onerror = () => {
        setConnected(false);
        es.close();
        if (esRef.current === es) {
          esRef.current = null;
        }

        // Reconnect with exponential backoff (max 30s)
        const delay = retryDelayRef.current;
        retryDelayRef.current = Math.min(delay * 2, 30000);
        retryTimerRef.current = setTimeout(connect, delay);
      };
    }

    connect();

    return cleanup;
  }, [hotelSlug, cleanup]);

  return { connected };
}
