import Link from "next/link";
import Image from "next/image";

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/experiences", label: "Experiences" },
  { href: "/about-us", label: "About Us" },
  { href: "/life-at-refuje", label: "Life at Refuje" },
  { href: "/contact-us", label: "Contact Us" },
];

const policyLinks = [
  { href: "/privacy-policy", label: "Privacy Policy" },
  { href: "/faqs", label: "FAQs" },
  { href: "/terms-and-conditions", label: "T&C" },
  { href: "/cancellation-policy", label: "Cancellation Policy" },
];

export function SiteFooter() {
  return (
    <footer className="bg-[#434431] text-[#FFE9CF] px-5 py-12 md:px-10 md:py-16">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-16">
          {/* Logo + social */}
          <div>
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/footer-logo.png"
              alt="Refuje"
              width={120}
              height={50}
              className="mb-6"
            />
            <div className="flex gap-4 mt-4">
              <a
                href="https://instagram.com/refuje.travel"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFE9CF] hover:text-[#C9B29D] transition-colors"
                aria-label="Instagram"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                </svg>
              </a>
              <a
                href="https://www.youtube.com/@RefujeOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#FFE9CF] hover:text-[#C9B29D] transition-colors"
                aria-label="YouTube"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold tracking-[2px] uppercase mb-4">
              Quick Links
            </h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-brinnan)] text-[13px] text-[#FFE9CF]/80 hover:text-[#FFE9CF] transition-colors tracking-[0.5px]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact + policies */}
          <div>
            <h3 className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold tracking-[2px] uppercase mb-4">
              Contact
            </h3>
            <address className="not-italic font-[family-name:var(--font-brinnan)] text-[13px] text-[#FFE9CF]/80 leading-relaxed tracking-[0.5px] mb-6">
              G+1 Rear Unit, Chauhan Enclave, Apple Garden,
              <br />
              Near SSB training centre, Kasumpti,
              <br />
              Shimla, HP 171002
            </address>
            <p className="font-[family-name:var(--font-brinnan)] text-[13px] text-[#FFE9CF]/80 tracking-[0.5px]">
              <a href="tel:+917807740707" className="hover:text-[#FFE9CF]">
                +91-7807740707
              </a>
            </p>
            <p className="font-[family-name:var(--font-brinnan)] text-[13px] text-[#FFE9CF]/80 tracking-[0.5px] mt-1">
              <a href="mailto:myrefuje@gmail.com" className="hover:text-[#FFE9CF]">
                myrefuje@gmail.com
              </a>
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              {policyLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="font-[family-name:var(--font-brinnan)] text-[11px] text-[#FFE9CF]/60 hover:text-[#FFE9CF] transition-colors tracking-[0.5px]"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-[#FFE9CF]/10 text-center">
          <p className="font-[family-name:var(--font-brinnan)] text-[11px] text-[#FFE9CF]/40 tracking-[1px]">
            &copy; {new Date().getFullYear()} Refuje Experiences Private Limited. All rights
            reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
