"use client";

import { useGuest } from "@/context/GuestContext";
import { Instagram, Facebook, Twitter } from "lucide-react";

export function GuestFooter() {
  const { hotel } = useGuest();

  const socialLinks = [
    { url: hotel.instagram_url, icon: Instagram, label: "Instagram" },
    { url: hotel.facebook_url, icon: Facebook, label: "Facebook" },
    { url: hotel.twitter_url, icon: Twitter, label: "Twitter" },
  ].filter((l) => l.url);

  const legalLinks = [
    { url: hotel.terms_url, label: "Terms" },
    { url: hotel.privacy_url, label: "Privacy" },
  ].filter((l) => l.url);

  return (
    <footer className="border-t border-black/5 px-5 py-8 mt-auto">
      <div className="max-w-6xl mx-auto lg:flex lg:items-center lg:justify-between lg:gap-6">
        {/* Footer text */}
        {hotel.footer_text && (
          <p
            className="text-sm text-center lg:text-left lg:flex-1 mb-4 lg:mb-0"
            style={{
              fontFamily: "var(--brand-body-font)",
              color: "color-mix(in oklch, var(--brand-primary) 60%, transparent)",
            }}
          >
            {hotel.footer_text}
          </p>
        )}

        {/* Social icons */}
        {socialLinks.length > 0 && (
          <div className="flex justify-center gap-4 mb-4 lg:mb-0">
            {socialLinks.map(({ url, icon: Icon, label }) => (
              <a
                key={label}
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="inline-flex items-center justify-center size-10 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
                style={{
                  color: "var(--brand-primary)",
                  backgroundColor: "color-mix(in oklch, var(--brand-primary) 8%, transparent)",
                }}
              >
                <Icon className="size-4" />
              </a>
            ))}
          </div>
        )}

        {/* Legal links + Powered by */}
        <div className="lg:text-right">
          {legalLinks.length > 0 && (
            <div className="flex justify-center lg:justify-end gap-4 text-xs">
              {legalLinks.map(({ url, label }) => (
                <a
                  key={label}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline-offset-2 hover:underline rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-accent)] focus-visible:ring-offset-2"
                  style={{
                    color: "color-mix(in oklch, var(--brand-primary) 50%, transparent)",
                  }}
                >
                  {label}
                </a>
              ))}
            </div>
          )}

          <p className="text-center lg:text-right text-[10px] mt-6 lg:mt-2 opacity-30">
            Powered by Refuje
          </p>
        </div>
      </div>
    </footer>
  );
}
