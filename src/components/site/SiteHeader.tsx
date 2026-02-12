"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";

const navLinks = [
  { href: "/", label: "Home" },
  { href: "/experiences", label: "EXPERIENCES" },
  { href: "/about-us", label: "ABOUT US" },
  { href: "/life-at-refuje", label: "LIFE AT REFUJE" },
  { href: "/contact-us", label: "CONTACT US" },
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
          scrolled ? "bg-[#FFF4E8]/95 backdrop-blur-sm" : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex items-center justify-between px-5 py-4 md:px-10 md:py-5 max-w-[1400px]">
          {/* Hamburger toggle (left) */}
          <button
            className="shrink-0 flex flex-col gap-[6px] p-2 -ml-2"
            onClick={() => setOpen(true)}
            aria-label="Open menu"
          >
            <span className={`block w-6 h-[2px] transition-colors ${scrolled ? "bg-[#434431]" : "bg-white"}`} />
            <span className={`block w-6 h-[2px] transition-colors ${scrolled ? "bg-[#434431]" : "bg-white"}`} />
            <span className={`block w-6 h-[2px] transition-colors ${scrolled ? "bg-[#434431]" : "bg-white"}`} />
          </button>

          {/* Logo (center) */}
          <Link href="/" className="absolute left-1/2 -translate-x-1/2">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/logo.png"
              alt="Refuje"
              width={275}
              height={275}
              className="w-[50px] h-auto md:w-[65px]"
              priority
            />
          </Link>

          {/* Book button (right) */}
          <Link
            href="/experiences"
            className="font-[family-name:var(--font-brinnan)] text-[13px] md:text-[14px] font-bold text-white bg-[#32373c] px-5 py-2 md:px-6 md:py-2.5 hover:bg-[#1a1a1a] transition-colors tracking-[1px]"
          >
            Book
          </Link>
        </div>
      </header>

      {/* Flyout overlay */}
      <div
        className={`fixed inset-0 z-[60] bg-black/40 transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Flyout menu (slides from left) */}
      <nav
        className={`fixed top-0 left-0 z-[70] h-full w-[320px] md:w-[500px] bg-[#FFF4E8] transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Close button */}
        <button
          className="absolute top-5 right-5 p-2"
          onClick={() => setOpen(false)}
          aria-label="Close menu"
        >
          <svg
            className="w-6 h-6 text-[#434431]"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Nav links */}
        <div className="pt-20 px-10 md:px-12">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setOpen(false)}
              className="block py-5 md:py-6 font-[family-name:var(--font-brinnan)] text-[16px] md:text-[18px] font-normal text-[#434431] tracking-[2px] border-b border-[#C9B29D]/30 hover:text-[#A56014] transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}
