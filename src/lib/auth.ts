"use client";

import { getClientApiUrl } from "./utils";

const API = getClientApiUrl();

// ----- CSRF -----

function getCSRFToken(): string {
  if (typeof document === "undefined") return "";
  const match = document.cookie.match(/csrftoken=([^;]+)/);
  return match ? match[1] : "";
}

export async function ensureCSRFCookie(): Promise<void> {
  await fetch(`${API}/api/v1/auth/csrf/`, { credentials: "include" });
}

// ----- Authenticated fetch with auto-refresh -----

const UNSAFE_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

export async function authFetch(
  url: string,
  options: RequestInit = {},
): Promise<Response> {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers);

  headers.set("Accept", "application/json");
  if (UNSAFE_METHODS.has(method)) {
    if (!getCSRFToken()) await ensureCSRFCookie();
    headers.set("X-CSRFToken", getCSRFToken());
  }
  // Only set Content-Type for methods that carry a body (#7)
  if (
    UNSAFE_METHODS.has(method) &&
    !headers.has("Content-Type") &&
    !(options.body instanceof FormData)
  ) {
    headers.set("Content-Type", "application/json");
  }

  const res = await fetch(url, {
    ...options,
    headers,
    credentials: "include",
  });

  if (res.status === 401) {
    // Attempt silent refresh — bootstrap CSRF if missing
    if (!getCSRFToken()) await ensureCSRFCookie();
    const refreshRes = await fetch(`${API}/api/v1/auth/token/refresh/`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      credentials: "include",
    });
    if (refreshRes.ok) {
      // Re-build headers for retry (CSRF token may have changed)
      const retryHeaders = new Headers(options.headers);
      retryHeaders.set("Accept", "application/json");
      if (UNSAFE_METHODS.has(method)) {
        retryHeaders.set("X-CSRFToken", getCSRFToken());
      }
      if (
        UNSAFE_METHODS.has(method) &&
        !retryHeaders.has("Content-Type") &&
        !(options.body instanceof FormData)
      ) {
        retryHeaders.set("Content-Type", "application/json");
      }
      return fetch(url, {
        ...options,
        headers: retryHeaders,
        credentials: "include",
      });
    }
    // Refresh failed — caller handles redirect
  }

  return res;
}

// ----- Staff login methods -----

export async function loginWithEmail(
  email: string,
  password: string,
): Promise<Response> {
  await ensureCSRFCookie();

  return fetch(`${API}/api/v1/auth/token/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
    body: JSON.stringify({ email, password }),
  });
}

export async function sendStaffOTP(phone: string): Promise<Response> {
  await ensureCSRFCookie();

  return fetch(`${API}/api/v1/auth/otp/send/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
    body: JSON.stringify({ phone }),
  });
}

export async function loginWithOTP(
  phone: string,
  code: string,
): Promise<Response> {
  await ensureCSRFCookie();

  return fetch(`${API}/api/v1/auth/otp/verify/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
    body: JSON.stringify({ phone, code }),
  });
}

export async function logout(): Promise<void> {
  await fetch(`${API}/api/v1/auth/logout/`, {
    method: "POST",
    headers: {
      Accept: "application/json",
      "X-CSRFToken": getCSRFToken(),
    },
    credentials: "include",
  });
}

// fetchProfile now uses authFetch so 401 → silent refresh works (#1)
export async function fetchProfile(): Promise<Response> {
  return authFetch(`${API}/api/v1/auth/profile/`);
}
