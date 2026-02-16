"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/experiences", label: "Experiences" },
  { href: "/about-us", label: "About Us" },
  { href: "/life-at-refuje", label: "Life At Refuje" },
  { href: "/contact-us", label: "Contact Us" },
];

export function SiteHeader() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 50);
    }
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent body scroll when flyout is open
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-colors duration-300 ${
          scrolled ? "bg-[#efe7dd]/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-[1400px] items-center justify-between px-5 py-5 md:px-10 md:py-8">
          <button
            className="shrink-0 p-1.5 -ml-1.5"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className={`block h-[2px] w-6 transition-colors ${scrolled ? "bg-[#434431]" : "bg-white"}`} />
            <span className={`mt-[6px] block h-[2px] w-6 transition-colors ${scrolled ? "bg-[#434431]" : "bg-white"}`} />
            <span className={`mt-[6px] block h-[2px] w-6 transition-colors ${scrolled ? "bg-[#434431]" : "bg-white"}`} />
          </button>

          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/logo.png"
              alt="Refuje"
              width={275}
              height={275}
              className={`h-auto w-[62px] transition-[filter] duration-300 md:w-[86px] ${
                scrolled ? "brightness-0 opacity-85" : ""
              }`}
              priority
            />
          </Link>

          <Link
            href="/experiences"
            className="border border-[#a45e1a] bg-[#b26214] px-3 py-1.5 font-[family-name:var(--font-brinnan)] text-[10px] uppercase tracking-[0.14em] text-[#f8e9d5] transition-colors hover:bg-[#9a530f] md:px-5 md:py-2.5 md:text-[13px]"
          >
            Book
          </Link>
        </div>
      </header>

      {/* Flyout menu (full-screen state from design) */}
      <div
        className={`fixed inset-0 z-[70] flex transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full pointer-events-none"
        }`}
      >
        <div className="absolute inset-0">
          <Image
            src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/basecamp-stars.jpg"
            alt="Menu background"
            fill
            className="object-cover md:hidden"
            sizes="(max-width: 767px) 100vw, 0px"
            priority
          />
          <Image
            src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/hero.jpg"
            alt="Menu background"
            fill
            className="hidden object-cover md:block"
            sizes="(min-width: 768px) 100vw, 0px"
            priority
          />
          <div className="absolute inset-0 bg-[#1f2318]/45 md:bg-[#1f2318]/30" />
        </div>

        <nav className="relative h-full w-[84vw] max-w-[330px] overflow-y-auto border-r border-[#a5a989]/26 bg-[rgba(134,138,104,0.62)] shadow-[12px_0_36px_rgba(17,20,14,0.45)] backdrop-blur-[2px] md:w-[31vw] md:max-w-[430px] md:bg-[rgba(134,138,104,0.78)]">
          <div className="flex h-full flex-col pl-8 pr-6 pb-8 pt-6 md:px-12 md:pb-14 md:pt-10">
            <div className="flex justify-end">
              <button onClick={() => setOpen(false)} aria-label="Close menu" className="p-1.5">
                <svg
                  className="h-8 w-8 text-[#f3eadb] md:h-12 md:w-12"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mt-10 flex flex-col gap-14 md:mt-12 md:gap-9">
              {navLinks.map((link) => (
                <Link
                  key={`${link.href}-${link.label}`}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="group inline-flex w-fit items-center font-[family-name:var(--font-brinnan)] text-[14px] uppercase tracking-[0.035em] text-[#f5ebdb] transition-colors hover:text-white md:text-[28px]"
                >
                  <span>{link.label}</span>
                  <span className="ml-1.5 text-[16px] leading-none transition-transform duration-200 group-hover:translate-x-1 md:ml-3 md:text-[28px]">
                    &gt;
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div
          className="relative flex-1"
          onClick={() => setOpen(false)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter" || e.key === " ") setOpen(false);
          }}
          aria-label="Close menu"
        />
      </div>
    </>
  );
}
