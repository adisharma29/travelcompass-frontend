"use client";

import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { useGuest } from "@/context/GuestContext";
import { CheckCircle, Clock } from "lucide-react";
import { GuestFooter } from "@/components/guest/GuestFooter";

export default function ConfirmationPage() {
  const searchParams = useSearchParams();
  const { hotel } = useGuest();

  const publicId = searchParams.get("id") ?? "";
  const expName = searchParams.get("exp") ?? null;

  return (
    <div className="min-h-dvh flex flex-col">
      <main className="flex-1 flex flex-col items-center justify-center px-5 py-12">
        <div className="md:p-8 md:rounded-3xl md:border md:border-black/5 md:shadow-sm md:max-w-md md:w-full flex flex-col items-center">
        {/* Success icon */}
        <div
          className="size-16 rounded-full flex items-center justify-center mb-6"
          style={{
            backgroundColor: "color-mix(in oklch, var(--brand-accent) 10%, transparent)",
          }}
        >
          <CheckCircle
            className="size-8"
            style={{ color: "var(--brand-accent)" }}
          />
        </div>

        <h1
          className="text-2xl font-bold text-center mb-3"
          style={{
            fontFamily: "var(--brand-heading-font)",
            color: "var(--brand-primary)",
          }}
        >
          Request Received
        </h1>

        <p
          className="text-sm text-center max-w-xs mb-8"
          style={{
            color: "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
          }}
        >
          {expName
            ? `Your request for "${expName}" has been sent to the hotel team.`
            : "Your request has been sent to the hotel team."}
        </p>

        {/* Info cards */}
        <div className="w-full max-w-sm space-y-3 mb-8">
          {/* Expected response */}
          <div
            className="flex items-start gap-3 p-4 rounded-2xl"
            style={{
              backgroundColor: "color-mix(in oklch, var(--brand-primary) 4%, transparent)",
            }}
          >
            <Clock
              className="size-5 mt-0.5 flex-shrink-0"
              style={{ color: "var(--brand-accent)" }}
            />
            <div>
              <p
                className="text-sm font-medium"
                style={{ color: "var(--brand-primary)" }}
              >
                Expected response
              </p>
              <p
                className="text-xs mt-0.5"
                style={{
                  color: "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
                }}
              >
                The hotel team will get back to you shortly
              </p>
            </div>
          </div>

          {/* Request ID */}
          {publicId && (
            <div
              className="flex items-center justify-between p-4 rounded-2xl"
              style={{
                backgroundColor: "color-mix(in oklch, var(--brand-primary) 4%, transparent)",
              }}
            >
              <span
                className="text-xs"
                style={{
                  color: "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
                }}
              >
                Request ID
              </span>
              <span
                className="text-xs font-mono font-medium"
                style={{ color: "var(--brand-primary)" }}
              >
                {publicId}
              </span>
            </div>
          )}
        </div>

        {/* CTAs */}
        <div className="w-full max-w-sm space-y-3">
          <Link
            href={`/h/${hotel.slug}/requests`}
            className="block w-full py-3 rounded-full text-sm font-semibold text-center transition-opacity active:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
            style={{
              backgroundColor: "var(--brand-accent)",
              color: "var(--brand-secondary)",
              minHeight: "44px",
              lineHeight: "44px",
            }}
          >
            View My Requests
          </Link>
          <Link
            href={`/h/${hotel.slug}`}
            className="block text-sm text-center py-2 underline-offset-2 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
            style={{
              color: "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
            }}
          >
            Browse More Experiences
          </Link>
        </div>
        </div>
      </main>

      <GuestFooter />
    </div>
  );
}
