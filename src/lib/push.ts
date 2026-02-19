"use client";

import { subscribePush } from "./concierge-api";

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ?? "";

/**
 * Convert a base64url-encoded string to a Uint8Array.
 * Required by pushManager.subscribe({ applicationServerKey }).
 */
function urlBase64ToUint8Array(base64String: string): Uint8Array {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const outputArray = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    outputArray[i] = raw.charCodeAt(i);
  }
  return outputArray;
}

/** Compare existing subscription's applicationServerKey with expected key. */
function keysMatch(sub: PushSubscription, expected: Uint8Array): boolean {
  const existing = sub.options.applicationServerKey;
  if (!existing) return false;
  const a = new Uint8Array(existing);
  if (a.length !== expected.length) return false;
  return a.every((v, i) => v === expected[i]);
}

/** Check whether push is supported in this browser. */
export function isPushSupported(): boolean {
  return (
    typeof window !== "undefined" &&
    "serviceWorker" in navigator &&
    "PushManager" in window &&
    "Notification" in window &&
    !!VAPID_PUBLIC_KEY
  );
}

/** Check if already subscribed (for UI state). */
export async function isSubscribed(): Promise<boolean> {
  if (!isPushSupported()) return false;
  const registration = await navigator.serviceWorker.ready;
  const sub = await registration.pushManager.getSubscription();
  return sub !== null;
}

/**
 * Register the service worker, request notification permission,
 * subscribe to push, and send the subscription to the backend.
 *
 * The backend upserts by endpoint, so calling this from multiple
 * tabs or after key rotation is safe and idempotent.
 *
 * Returns true if subscription was successful.
 */
export async function registerPush(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    // 1. Register service worker
    await navigator.serviceWorker.register("/sw.js", { scope: "/" });
    const registration = await navigator.serviceWorker.ready;

    // 2. Request permission
    const permission = await Notification.requestPermission();
    if (permission !== "granted") return false;

    // 3. Get or create push subscription (re-subscribe if VAPID key changed)
    const appServerKey = urlBase64ToUint8Array(VAPID_PUBLIC_KEY);
    let subscription = await registration.pushManager.getSubscription();
    if (subscription && !keysMatch(subscription, appServerKey)) {
      await subscription.unsubscribe();
      subscription = null;
    }
    if (!subscription) {
      subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: appServerKey.buffer as ArrayBuffer,
      });
    }

    // 4. Send subscription to backend (upserted by endpoint)
    const subJSON = subscription.toJSON();
    if (subJSON) {
      await subscribePush(subJSON);
    }

    return true;
  } catch (err) {
    console.error("Push registration failed:", err);
    return false;
  }
}

/**
 * Unsubscribe this browser's push subscription on logout.
 * Only unsubscribes the local browser — does NOT call DELETE /all/ on the
 * backend, which would wipe other devices' subscriptions too.
 * The stale backend record is auto-deactivated by pywebpush on the next
 * push attempt when it receives a 410 Gone from the push service.
 */
export async function unregisterPush(): Promise<void> {
  if (!isPushSupported()) return;

  try {
    const registration = await navigator.serviceWorker.ready;
    const subscription = await registration.pushManager.getSubscription();
    if (subscription) {
      await subscription.unsubscribe();
    }
  } catch (err) {
    console.error("Push unregistration failed:", err);
  }
}

/**
 * Get the current notification permission state.
 */
export function getPermissionState(): NotificationPermission | "unsupported" {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}
