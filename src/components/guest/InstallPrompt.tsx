"use client";

import { useState, useEffect, useRef } from "react";
import { Download, X } from "lucide-react";

const DISMISS_KEY = "concierge_install_dismissed";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function InstallPrompt() {
  const [visible, setVisible] = useState(false);
  const deferredRef = useRef<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    if (localStorage.getItem(DISMISS_KEY)) return;

    function handler(e: Event) {
      e.preventDefault();
      deferredRef.current = e as BeforeInstallPromptEvent;
      setVisible(true);
    }

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  if (!visible) return null;

  async function handleInstall() {
    const prompt = deferredRef.current;
    if (!prompt) return;
    await prompt.prompt();
    const { outcome } = await prompt.userChoice;
    deferredRef.current = null;
    if (outcome === "accepted") {
      setVisible(false);
    } else {
      // User dismissed the browser prompt — hide the banner
      // so the Install button isn't left in a dead state.
      setVisible(false);
    }
  }

  function handleDismiss() {
    localStorage.setItem(DISMISS_KEY, "1");
    setVisible(false);
  }

  return (
    <div className="fixed bottom-4 left-4 right-4 z-50 mx-auto max-w-sm animate-in slide-in-from-bottom-4 duration-300">
      <div
        className="flex items-center gap-3 rounded-xl p-4 shadow-lg"
        style={{
          backgroundColor: "var(--brand-primary, #434431)",
          color: "var(--brand-secondary, #FAFAF8)",
        }}
      >
        <Download className="size-5 shrink-0" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">Add to Home Screen</p>
          <p className="text-xs opacity-80">Quick access without the browser</p>
        </div>
        <button
          onClick={handleInstall}
          className="shrink-0 rounded-lg px-3 py-1.5 text-xs font-medium"
          style={{
            backgroundColor: "var(--brand-accent, #C45D3E)",
            color: "var(--brand-secondary, #FAFAF8)",
          }}
        >
          Install
        </button>
        <button
          onClick={handleDismiss}
          className="shrink-0 opacity-60 hover:opacity-100"
          aria-label="Dismiss"
        >
          <X className="size-4" />
        </button>
      </div>
    </div>
  );
}
