"use client";

import { useState, useEffect } from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { isPushSupported, registerPush, getPermissionState } from "@/lib/push";

const DISMISS_KEY = "concierge_push_dismissed";

export function PushPermissionBanner() {
  const [visible, setVisible] = useState(false);

  // Async IIFE: setState after await satisfies react-hooks/set-state-in-effect.
  // Browser-only checks (Notification API, localStorage) cannot run during SSR.
  useEffect(() => {
    (async () => {
      if (!isPushSupported()) return;
      if (getPermissionState() !== "default") return;
      if (localStorage.getItem(DISMISS_KEY)) return;
      setVisible(true);
    })();
  }, []);

  if (!visible) return null;

  async function handleEnable() {
    const success = await registerPush();
    setVisible(false);
    if (!success) {
      localStorage.setItem(DISMISS_KEY, "1");
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="mx-4 mt-4 flex items-center gap-3 rounded-lg border bg-card p-3 text-sm">
      <Bell className="size-4 shrink-0 text-primary" />
      <p className="flex-1">
        Enable push notifications to get alerted about new requests even when
        the dashboard is closed.
      </p>
      <Button size="sm" className="h-7 text-xs" onClick={handleEnable}>
        Enable
      </Button>
      <button
        onClick={handleDismiss}
        className="text-muted-foreground hover:text-foreground"
        aria-label="Dismiss"
      >
        <X className="size-4" />
      </button>
    </div>
  );
}
