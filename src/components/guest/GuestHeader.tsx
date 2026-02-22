"use client";

import { Fragment } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ChevronRight } from "lucide-react";

export function GuestHeader({
  title,
  backHref,
  breadcrumbs,
}: {
  title: string;
  backHref?: string;
  breadcrumbs?: { label: string; href?: string }[];
}) {
  const router = useRouter();

  return (
    <header
      className="sticky top-0 z-30 h-12 backdrop-blur-xl border-b border-black/5"
      style={{
        backgroundColor: "color-mix(in oklch, var(--brand-secondary) 90%, transparent)",
      }}
    >
      <div className="max-w-6xl mx-auto h-full flex items-center gap-3 px-4">
        {/* Mobile: back arrow + title */}
        <div className="flex md:hidden items-center gap-3 min-w-0">
          <button
            type="button"
            onClick={() => (backHref ? router.push(backHref) : router.back())}
            className="flex items-center justify-center size-11 -ml-2 rounded-full transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
            style={{ color: "var(--brand-primary)" }}
            aria-label="Go back"
          >
            <ArrowLeft className="size-5" />
          </button>
          <h1
            className="text-sm font-semibold truncate"
            style={{
              fontFamily: "var(--brand-body-font)",
              color: "var(--brand-primary)",
            }}
          >
            {title}
          </h1>
        </div>

        {/* Desktop: breadcrumbs or back+title */}
        <div className="hidden md:flex items-center gap-2 min-w-0">
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav className="flex items-center gap-1.5 text-sm min-w-0">
              {breadcrumbs.map((crumb, i) => (
                <Fragment key={i}>
                  {i > 0 && (
                    <ChevronRight
                      className="size-3.5 flex-shrink-0"
                      style={{ color: "color-mix(in oklch, var(--brand-primary) 30%, transparent)" }}
                    />
                  )}
                  {crumb.href ? (
                    <Link
                      href={crumb.href}
                      className="hover:underline underline-offset-2 truncate focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2 rounded"
                      style={{
                        color: "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
                        fontFamily: "var(--brand-body-font)",
                      }}
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span
                      className="font-semibold truncate"
                      style={{
                        color: "var(--brand-primary)",
                        fontFamily: "var(--brand-body-font)",
                      }}
                    >
                      {crumb.label}
                    </span>
                  )}
                </Fragment>
              ))}
            </nav>
          ) : (
            <>
              <button
                type="button"
                onClick={() => (backHref ? router.push(backHref) : router.back())}
                className="flex items-center justify-center size-11 -ml-2 rounded-full transition-colors active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
                style={{ color: "var(--brand-primary)" }}
                aria-label="Go back"
              >
                <ArrowLeft className="size-5" />
              </button>
              <h1
                className="text-sm font-semibold truncate"
                style={{
                  fontFamily: "var(--brand-body-font)",
                  color: "var(--brand-primary)",
                }}
              >
                {title}
              </h1>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
