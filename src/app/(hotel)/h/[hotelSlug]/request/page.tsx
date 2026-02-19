"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGuest } from "@/context/GuestContext";
import { GuestHeader } from "@/components/guest/GuestHeader";
import { GuestStepper } from "@/components/guest/GuestStepper";
import { submitGuestRequest, getPublicExperience, getPublicDepartment } from "@/lib/guest-auth";
import type { Experience, RequestType } from "@/lib/concierge-types";
import { Loader2 } from "lucide-react";

export default function RequestPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hotel, guestUser, isVerified, hasRoom, guardedNavigate } = useGuest();

  const deptSlug = searchParams.get("dept");
  const expSlug = searchParams.get("exp");
  const VALID_REQUEST_TYPES: RequestType[] = ["BOOKING", "INQUIRY", "CUSTOM"];
  const rawType = searchParams.get("type");
  const requestType: RequestType =
    rawType && VALID_REQUEST_TYPES.includes(rawType as RequestType)
      ? (rawType as RequestType)
      : "BOOKING";

  const [experience, setExperience] = useState<Experience | null>(null);
  const [departmentId, setDepartmentId] = useState<number | null>(null);
  const [guestName, setGuestName] = useState("");
  const [guestDate, setGuestDate] = useState("");
  const [guestTime, setGuestTime] = useState("");
  const [guestCount, setGuestCount] = useState(2);
  const [guestNotes, setGuestNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Redirect to verify if not verified or missing room for this hotel
  useEffect(() => {
    if (!isVerified || !hasRoom) {
      const currentUrl = window.location.pathname + window.location.search;
      guardedNavigate(currentUrl);
    }
  }, [isVerified, hasRoom, guardedNavigate]);

  // Pre-fill guest name from profile
  useEffect(() => {
    if (guestUser) {
      const name = [guestUser.first_name, guestUser.last_name].filter(Boolean).join(" ");
      if (name) setGuestName(name);
    }
  }, [guestUser]);

  // Fetch experience and/or department
  useEffect(() => {
    let cancelled = false;
    (async () => {
      if (expSlug && deptSlug) {
        try {
          const exp = await getPublicExperience(hotel.slug, deptSlug, expSlug);
          if (!cancelled) setExperience(exp);
        } catch {
          // Experience not found — continue without it
        }
      }
      if (deptSlug) {
        try {
          const dept = await getPublicDepartment(hotel.slug, deptSlug);
          if (!cancelled) setDepartmentId(dept.id);
        } catch {
          // Department not found — submit will show error
        }
      }
    })();
    return () => { cancelled = true; };
  }, [expSlug, deptSlug, hotel.slug]);

  // Today's date for min attribute
  const today = new Date().toISOString().split("T")[0];

  const handleSubmit = async () => {
    if (!guestName.trim()) {
      setError("Please enter your name");
      return;
    }
    const deptIdNum = departmentId;
    if (!deptIdNum) {
      setError("No department selected. Please go back and try again.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await submitGuestRequest(hotel.slug, {
        department: deptIdNum,
        experience: experience?.id,
        request_type: requestType,
        guest_name: guestName.trim(),
        guest_date: guestDate || undefined,
        guest_time: guestTime || undefined,
        guest_count: guestCount,
        guest_notes: guestNotes.trim() || undefined,
      });
      // Navigate to confirmation with request info
      const params = new URLSearchParams({
        id: res.public_id,
        ...(experience ? { exp: experience.name } : {}),
      });
      router.push(`/h/${hotel.slug}/confirmation?${params.toString()}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit request");
    } finally {
      setLoading(false);
    }
  };

  // Determine which fields to show based on category
  // Parse max guests from experience capacity.
  // Handles ranges like "4-8" (take last number), plain numbers like "10",
  // and descriptive strings like "Up to 12 guests" (take last number found).
  const maxGuests = (() => {
    if (!experience?.capacity) return 20;
    const numbers = experience.capacity.match(/\d+/g);
    if (!numbers?.length) return 20;
    const last = parseInt(numbers[numbers.length - 1], 10);
    return Math.min(last || 20, 99);
  })();

  const showDate = true; // Always show date
  const showTime = !experience || ["DINING", "SPA", "TRANSPORT"].includes(experience.category);
  const showGuestCount = !experience || ["DINING", "ACTIVITY", "TOUR"].includes(experience.category);
  const showNotes = true; // Always show notes

  const inputStyle = {
    borderColor: "color-mix(in oklch, var(--brand-primary) 15%, transparent)",
    color: "var(--brand-primary)",
    backgroundColor: "color-mix(in oklch, var(--brand-primary) 3%, transparent)",
  };

  return (
    <>
      <GuestHeader title="Make a Request" backHref={experience ? `/h/${hotel.slug}` : undefined} />

      <main className="flex-1 px-5 py-6 md:py-12 max-w-lg mx-auto w-full">
        <div className="md:p-8 md:rounded-3xl md:border md:border-black/5 md:shadow-sm">
        {/* Experience preview card */}
        {experience && (
          <div
            className="p-4 rounded-2xl mb-6"
            style={{
              backgroundColor: "color-mix(in oklch, var(--brand-primary) 4%, transparent)",
            }}
          >
            <h3
              className="text-sm font-semibold mb-1"
              style={{
                fontFamily: "var(--brand-heading-font)",
                color: "var(--brand-primary)",
              }}
            >
              {experience.name}
            </h3>
            <p
              className="text-xs"
              style={{
                color: "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
              }}
            >
              {experience.price_display}
              {experience.category && ` · ${experience.category.charAt(0) + experience.category.slice(1).toLowerCase()}`}
            </p>
          </div>
        )}

        {/* Form fields */}
        <div className="space-y-5">
          {/* Guest name */}
          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: "var(--brand-primary)" }}
            >
              Your Name
            </label>
            <input
              type="text"
              value={guestName}
              onChange={(e) => setGuestName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border text-sm"
              style={inputStyle}
            />
          </div>

          {/* Date */}
          {showDate && (
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--brand-primary)" }}
              >
                Preferred Date
              </label>
              <input
                type="date"
                value={guestDate}
                onChange={(e) => setGuestDate(e.target.value)}
                min={today}
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
          )}

          {/* Time */}
          {showTime && (
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--brand-primary)" }}
              >
                Preferred Time
              </label>
              <input
                type="time"
                value={guestTime}
                onChange={(e) => setGuestTime(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border text-sm"
                style={inputStyle}
              />
            </div>
          )}

          {/* Guest count */}
          {showGuestCount && (
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--brand-primary)" }}
              >
                Number of Guests
              </label>
              <GuestStepper value={guestCount} onChange={setGuestCount} max={maxGuests} />
              {experience?.capacity && (
                <p
                  className="text-xs mt-1.5"
                  style={{ color: "color-mix(in oklch, var(--brand-primary) 40%, transparent)" }}
                >
                  Max capacity: {experience.capacity}
                </p>
              )}
            </div>
          )}

          {/* Notes */}
          {showNotes && (
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: "var(--brand-primary)" }}
              >
                Special Requests / Notes
              </label>
              <textarea
                value={guestNotes}
                onChange={(e) => setGuestNotes(e.target.value)}
                rows={3}
                placeholder="Any preferences or special requests..."
                className="w-full px-4 py-3 rounded-xl border text-sm resize-none"
                style={inputStyle}
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600 mt-4 text-center">{error}</p>}

        {/* Submit */}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!guestName.trim() || loading}
          className="w-full mt-6 py-3 rounded-full text-sm font-semibold transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
          style={{
            backgroundColor: "var(--brand-accent)",
            color: "var(--brand-secondary)",
            minHeight: "44px",
          }}
        >
          {loading ? <Loader2 className="size-4 mx-auto animate-spin" /> : "Submit Request"}
        </button>

        <p
          className="text-xs text-center mt-3"
          style={{
            color: "color-mix(in oklch, var(--brand-primary) 40%, transparent)",
          }}
        >
          Your request will be sent to the hotel team
        </p>
        </div>
      </main>
    </>
  );
}
