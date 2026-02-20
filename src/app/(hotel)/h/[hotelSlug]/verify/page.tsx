"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { flushSync } from "react-dom";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useGuest } from "@/context/GuestContext";
import { OTPInput } from "@/components/guest/OTPInput";
import { sendGuestOTP, verifyGuestOTP, updateGuestRoom } from "@/lib/guest-auth";
import type { AuthProfile } from "@/lib/concierge-types";
import { ArrowLeft, Loader2 } from "lucide-react";

type Step = "phone" | "code" | "room";

export default function VerifyPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { hotel, qrCode, setAuthState } = useGuest();

  const nextUrl = searchParams.get("next") ?? `/h/${hotel.slug}`;

  const [step, setStep] = useState<Step>("phone");
  const [phone, setPhone] = useState("");
  const [countryCode, setCountryCode] = useState("+91");
  const [code, setCode] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [stayId, setStayId] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  /** Preserve verified profile for use after room update */
  const verifiedUserRef = useRef<AuthProfile | null>(null);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setInterval(() => {
      setResendCooldown((c) => Math.max(0, c - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [resendCooldown]);

  // Auto-submit OTP when 6 digits entered
  useEffect(() => {
    if (code.replace(/ /g, "").length === 6 && step === "code" && !loading) {
      handleVerifyCode();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code]);

  const fullPhone = `${countryCode}${phone.replace(/\D/g, "")}`;

  const handleSendOTP = useCallback(async () => {
    if (!phone.trim()) return;
    setError("");
    setLoading(true);
    try {
      await sendGuestOTP(fullPhone, hotel.slug);
      setStep("code");
      setResendCooldown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send code");
    } finally {
      setLoading(false);
    }
  }, [phone, fullPhone, hotel.slug]);

  const handleVerifyCode = useCallback(async () => {
    const cleanCode = code.replace(/ /g, "");
    if (cleanCode.length !== 6) return;
    setError("");
    setLoading(true);
    try {
      const res = await verifyGuestOTP(fullPhone, cleanCode, hotel.slug, qrCode);
      // Backend returns flat AuthProfile fields + stay_id (guest) or no stay_id (staff)
      const { stay_id, stay_room_number, stay_expires_at, ...profile } = res;
      verifiedUserRef.current = profile;
      const expiresAt = stay_expires_at || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString();

      if (stay_id && stay_room_number) {
        // Returning guest with room already set — skip room step
        flushSync(() =>
          setAuthState(profile, {
            id: stay_id,
            hotel: hotel.id,
            room_number: stay_room_number,
            is_active: true,
            created_at: new Date().toISOString(),
            expires_at: expiresAt,
          }),
        );
        router.push(nextUrl);
      } else if (stay_id) {
        // New guest — ask for room number
        setStayId(stay_id);
        setAuthState(profile, {
          id: stay_id,
          hotel: hotel.id,
          room_number: "",
          is_active: true,
          created_at: new Date().toISOString(),
          expires_at: expiresAt,
        });
        setStep("room");
      } else {
        // Staff user or no stay — skip room step, redirect
        flushSync(() => setAuthState(profile, null));
        router.push(nextUrl);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid code");
      setCode("");
    } finally {
      setLoading(false);
    }
  }, [code, fullPhone, hotel.slug, hotel.id, qrCode, setAuthState, router, nextUrl]);

  const handleSubmitRoom = useCallback(async () => {
    if (!roomNumber.trim() || !stayId || !verifiedUserRef.current) return;
    setError("");
    setLoading(true);
    try {
      const stay = await updateGuestRoom(hotel.slug, stayId, roomNumber.trim());
      flushSync(() => setAuthState(verifiedUserRef.current, stay));
      router.push(nextUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid room number");
    } finally {
      setLoading(false);
    }
  }, [roomNumber, stayId, hotel.slug, nextUrl, router, setAuthState]);

  const handleResend = useCallback(async () => {
    if (resendCooldown > 0) return;
    setError("");
    setLoading(true);
    try {
      await sendGuestOTP(fullPhone, hotel.slug);
      setResendCooldown(30);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend");
    } finally {
      setLoading(false);
    }
  }, [resendCooldown, fullPhone, hotel.slug]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center px-5 py-8 md:py-12">
      <div className="w-full max-w-sm md:max-w-md md:p-8 md:rounded-3xl md:border md:border-black/5 md:shadow-sm">
      {/* Back button */}
      <button
        type="button"
        onClick={() => {
          if (step === "code") { setStep("phone"); setCode(""); setError(""); }
          else if (step === "room") { setStep("code"); setError(""); }
          else router.back();
        }}
        className="self-start mb-6 flex items-center gap-1 text-sm rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
        style={{ color: "var(--brand-primary)" }}
      >
        <ArrowLeft className="size-4" />
        Back
      </button>

      {/* Hotel logo */}
      {hotel.logo && (
        <div className="relative size-16 rounded-2xl overflow-hidden mb-6 mx-auto">
          <Image src={hotel.logo} alt={hotel.name} fill className="object-cover" />
        </div>
      )}

      {/* Step: Phone */}
      {step === "phone" && (
        <div className="w-full max-w-sm mx-auto">
          <h1
            className="text-xl font-bold text-center mb-2"
            style={{
              fontFamily: "var(--brand-heading-font)",
              color: "var(--brand-primary)",
            }}
          >
            Verify your identity
          </h1>
          <p
            className="text-sm text-center mb-6"
            style={{
              color: "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
            }}
          >
            Enter your phone number to continue
          </p>

          <div className="flex gap-2 mb-4">
            <select
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
              className="w-20 px-2 py-3 rounded-xl border text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
              style={{
                borderColor: "color-mix(in oklch, var(--brand-primary) 15%, transparent)",
                color: "var(--brand-primary)",
                backgroundColor: "color-mix(in oklch, var(--brand-primary) 3%, transparent)",
              }}
            >
              <option value="+91">+91</option>
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+971">+971</option>
            </select>
            <input
              type="tel"
              inputMode="numeric"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone number"
              className="flex-1 px-4 py-3 rounded-xl border text-sm"
              style={{
                borderColor: "color-mix(in oklch, var(--brand-primary) 15%, transparent)",
                color: "var(--brand-primary)",
                backgroundColor: "color-mix(in oklch, var(--brand-primary) 3%, transparent)",
              }}
              autoFocus
            />
          </div>

          {error && <p className="text-sm text-red-600 mb-3 text-center">{error}</p>}

          <button
            type="button"
            onClick={handleSendOTP}
            disabled={!phone.trim() || loading}
            className="w-full py-3 rounded-full text-sm font-semibold transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
            style={{
              backgroundColor: "var(--brand-accent)",
              color: "var(--brand-secondary)",
              minHeight: "44px",
            }}
          >
            {loading ? <Loader2 className="size-4 mx-auto animate-spin" /> : "Send Verification Code"}
          </button>

          {/* Legal */}
          {(hotel.terms_url || hotel.privacy_url) && (
            <p
              className="text-[11px] text-center mt-4"
              style={{
                color: "color-mix(in oklch, var(--brand-primary) 40%, transparent)",
              }}
            >
              By continuing you agree to our{" "}
              {hotel.terms_url && (
                <a href={hotel.terms_url} target="_blank" rel="noopener noreferrer" className="underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2">
                  Terms
                </a>
              )}
              {hotel.terms_url && hotel.privacy_url && " & "}
              {hotel.privacy_url && (
                <a href={hotel.privacy_url} target="_blank" rel="noopener noreferrer" className="underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2">
                  Privacy Policy
                </a>
              )}
            </p>
          )}
        </div>
      )}

      {/* Step: OTP Code */}
      {step === "code" && (
        <div className="w-full max-w-sm mx-auto">
          <h1
            className="text-xl font-bold text-center mb-2"
            style={{
              fontFamily: "var(--brand-heading-font)",
              color: "var(--brand-primary)",
            }}
          >
            Enter verification code
          </h1>
          <p
            className="text-sm text-center mb-6"
            style={{
              color: "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
            }}
          >
            Sent to {countryCode} {phone}
          </p>

          <OTPInput value={code} onChange={setCode} disabled={loading} />

          {error && <p className="text-sm text-red-600 mt-3 text-center">{error}</p>}

          <div className="mt-6 text-center">
            <p
              className="text-xs mb-1"
              style={{
                color: "color-mix(in oklch, var(--brand-primary) 40%, transparent)",
              }}
            >
              Didn&apos;t receive it?
            </p>
            <button
              type="button"
              onClick={handleResend}
              disabled={resendCooldown > 0 || loading}
              className="text-sm font-medium underline disabled:opacity-40 disabled:no-underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
              style={{ color: "var(--brand-accent)" }}
            >
              {resendCooldown > 0 ? `Resend code (0:${resendCooldown.toString().padStart(2, "0")})` : "Resend code"}
            </button>
          </div>

          <button
            type="button"
            onClick={handleVerifyCode}
            disabled={code.replace(/ /g, "").length !== 6 || loading}
            className="w-full mt-6 py-3 rounded-full text-sm font-semibold transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
            style={{
              backgroundColor: "var(--brand-accent)",
              color: "var(--brand-secondary)",
              minHeight: "44px",
            }}
          >
            {loading ? <Loader2 className="size-4 mx-auto animate-spin" /> : "Verify"}
          </button>
        </div>
      )}

      {/* Step: Room Number */}
      {step === "room" && (
        <div className="w-full max-w-sm mx-auto">
          <h1
            className="text-xl font-bold text-center mb-2"
            style={{
              fontFamily: "var(--brand-heading-font)",
              color: "var(--brand-primary)",
            }}
          >
            What&apos;s your room number?
          </h1>
          <p
            className="text-sm text-center mb-6"
            style={{
              color: "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
            }}
          >
            Ask at the front desk if you&apos;re unsure
          </p>

          <input
            type="text"
            inputMode="numeric"
            value={roomNumber}
            onChange={(e) => setRoomNumber(e.target.value)}
            placeholder="Room number"
            className="w-full px-4 py-4 rounded-xl border text-center text-2xl font-semibold mb-4"
            style={{
              borderColor: "color-mix(in oklch, var(--brand-primary) 15%, transparent)",
              color: "var(--brand-primary)",
              backgroundColor: "color-mix(in oklch, var(--brand-primary) 3%, transparent)",
            }}
            autoFocus
          />

          {error && <p className="text-sm text-red-600 mb-3 text-center">{error}</p>}

          <button
            type="button"
            onClick={handleSubmitRoom}
            disabled={!roomNumber.trim() || loading}
            className="w-full py-3 rounded-full text-sm font-semibold transition-opacity disabled:opacity-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
            style={{
              backgroundColor: "var(--brand-accent)",
              color: "var(--brand-secondary)",
              minHeight: "44px",
            }}
          >
            {loading ? <Loader2 className="size-4 mx-auto animate-spin" /> : "Continue"}
          </button>
        </div>
      )}
      </div>
    </div>
  );
}
