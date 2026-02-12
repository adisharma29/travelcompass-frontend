import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us | Refuje",
  description:
    "Get in touch with Refuje for luxury offbeat travel experiences in the Indian Himalayas.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {/* Desktop hero image */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/contact/hero-desktop.png"
          alt="Contact Refuje"
          fill
          priority
          className="hidden md:block object-cover"
        />
        {/* Mobile hero image */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/contact/hero-mobile.png"
          alt="Contact Refuje"
          fill
          priority
          className="md:hidden object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-[family-name:var(--font-brinnan)] text-[28px] md:text-[40px] font-bold text-white tracking-[3px] uppercase">
            Contact Us
          </h1>
        </div>
      </section>

      {/* Contact Info */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <div className="max-w-[700px] mx-auto space-y-8">
          <div>
            <h2 className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] tracking-[2px] uppercase mb-3">
              Refuje Experiences Private Limited
            </h2>
            <address className="not-italic font-[family-name:var(--font-brinnan)] text-[15px] text-[#7C7B55] leading-relaxed tracking-[0.5px]">
              G+1 Rear Unit, Chauhan Enclave, Apple Garden,
              <br />
              Near SSB training centre, Kasumpti,
              <br />
              Shimla, Himachal Pradesh 171002
            </address>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] tracking-[2px] uppercase mb-3">
              Phone
            </h2>
            <a
              href="tel:+917807740707"
              className="font-[family-name:var(--font-brinnan)] text-[15px] text-[#A56014] hover:text-[#BA6000] tracking-[0.5px]"
            >
              +91-7807740707
            </a>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] tracking-[2px] uppercase mb-3">
              Email
            </h2>
            <a
              href="mailto:myrefuje@gmail.com"
              className="font-[family-name:var(--font-brinnan)] text-[15px] text-[#A56014] hover:text-[#BA6000] tracking-[0.5px]"
            >
              myrefuje@gmail.com
            </a>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] tracking-[2px] uppercase mb-3">
              Hours
            </h2>
            <p className="font-[family-name:var(--font-brinnan)] text-[15px] text-[#7C7B55] tracking-[0.5px]">
              Monday &ndash; Sunday, 9:00 AM &ndash; 5:00 PM IST
            </p>
          </div>

          <div>
            <h2 className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] tracking-[2px] uppercase mb-3">
              Social
            </h2>
            <div className="flex gap-4">
              <a
                href="https://instagram.com/refuje.travel"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#A56014] hover:text-[#BA6000] tracking-[0.5px]"
              >
                Instagram
              </a>
              <a
                href="https://www.youtube.com/@RefujeOfficial"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#A56014] hover:text-[#BA6000] tracking-[0.5px]"
              >
                YouTube
              </a>
              <a
                href="https://wa.me/917807740707"
                target="_blank"
                rel="noopener noreferrer"
                className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#A56014] hover:text-[#BA6000] tracking-[0.5px]"
              >
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
