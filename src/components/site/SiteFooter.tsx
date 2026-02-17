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
    <footer className="bg-[#7f805d] px-5 py-12 text-[#fff2df] md:px-10 md:py-20">
      <div className="mx-auto max-w-[1272px]">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-16">
          <div className="relative">
            <h3 className="mb-4 font-[family-name:var(--font-brinnan)] text-[22px] uppercase tracking-[0.08em] text-[#fff6ea] md:mb-5 md:font-[family-name:var(--font-biorhyme)] md:text-[32px] md:leading-[1.05] md:tracking-[0.06em]">
              Quick Links
            </h3>
            <ul className="space-y-2.5 md:space-y-3">
              {quickLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-brinnan)] text-[14px] font-medium leading-[1.45] text-[#fff2df] transition-colors hover:text-white md:text-[19px] md:leading-[1.5]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <ul className="mt-6 space-y-2.5 md:mt-8 md:space-y-3">
              {policyLinks.map((link) => (
                <li key={`${link.href}-${link.label}`}>
                  <Link
                    href={link.href}
                    className="font-[family-name:var(--font-brinnan)] text-[14px] font-medium leading-[1.45] text-[#fff2df] transition-colors hover:text-white md:text-[19px] md:leading-[1.5]"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>

            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/footer-logo.png"
              alt="Refuje"
              width={298}
              height={298}
              quality={100}
              unoptimized
              sizes="104px"
              className="absolute right-4 top-3 h-auto w-[104px] md:hidden"
            />
          </div>

          <div className="order-3 md:order-none">
            <h3 className="mb-4 font-[family-name:var(--font-brinnan)] text-[22px] uppercase tracking-[0.08em] text-[#fff6ea] md:mb-5 md:font-[family-name:var(--font-biorhyme)] md:text-[32px] md:leading-[1.05] md:tracking-[0.06em]">
              Contact Us
            </h3>
            <p className="mb-3 font-[family-name:var(--font-brinnan)] text-[14px] font-medium leading-[1.45] text-[#fff2df] md:mb-4 md:text-[18px] md:leading-[1.52]">
              Refuje Experiences Private Limited
            </p>
            <address className="mb-4 not-italic font-[family-name:var(--font-brinnan)] text-[14px] leading-[1.5] text-[#fff2df] md:mb-6 md:text-[18px] md:leading-[1.62]">
              Address: G+1 Rear Unit, Chauhan Enclave, Apple Garden,
              <br />
              Near SSB training centre, Kasumpti,
              <br />
              Shimla, HP
            </address>
            <p className="font-[family-name:var(--font-brinnan)] text-[14px] font-medium leading-[1.45] text-[#fff2df] md:text-[18px] md:leading-[1.52]">
              Phone:{" "}
              <a href="tel:+917807740707" className="hover:text-white">
                +91-7807740707
              </a>
            </p>
            <p className="mt-1 font-[family-name:var(--font-brinnan)] text-[14px] font-medium leading-[1.45] text-[#fff2df] md:text-[18px] md:leading-[1.52]">
              Email:{" "}
              <a href="mailto:myrefuje@gmail.com" className="hover:text-[#FFE9CF]">
                myrefuje@gmail.com
              </a>
            </p>
            <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[13px] leading-[1.4] text-[#f7ecd9] md:mt-6 md:text-[16px] md:tracking-[0.01em]">
              Refuje&copy;2026 All Rights Reserved
            </p>
          </div>

          <div className="order-2 flex flex-col justify-between md:order-none md:items-end">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/footer-logo.png"
              alt="Refuje"
              width={298}
              height={298}
              quality={100}
              unoptimized
              sizes="(min-width: 768px) 190px, 0px"
              className="ml-auto hidden h-auto w-[120px] md:block md:w-[190px]"
            />
            <div className="mt-2 md:mt-10 md:text-right">
              <p className="mb-2 font-[family-name:var(--font-brinnan)] text-[14px] uppercase tracking-[0.12em] text-[#fff6ea] md:hidden">
                Follow Us On
              </p>
              <p className="hidden font-[family-name:var(--font-biorhyme)] uppercase tracking-[0.08em] text-[#fff6ea] md:block md:text-[24px]">
                Follow Us On
              </p>
              <div className="flex items-center gap-3 md:mt-3 md:gap-4 md:justify-end">
                <a
                  href="https://instagram.com/refuje.travel"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="text-[#f6ebda] transition-colors hover:text-white"
                >
                  <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3.5" y="3.5" width="17" height="17" rx="5" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" />
                  </svg>
                </a>
                <a
                  href="https://www.youtube.com/@RefujeOfficial"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="text-[#f6ebda] transition-colors hover:text-white"
                >
                  <svg className="h-6 w-6 md:h-7 md:w-7" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M21 8.5c0-1.4-1.1-2.5-2.5-2.5H5.5C4.1 6 3 7.1 3 8.5v7c0 1.4 1.1 2.5 2.5 2.5h13c1.4 0 2.5-1.1 2.5-2.5v-7Z"
                      fill="currentColor"
                    />
                    <path d="m10 10 5 2-5 2v-4Z" fill="#7f805d" />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
