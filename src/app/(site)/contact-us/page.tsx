import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Contact Us | Refuje",
  description:
    "Get in touch with Refuje Experiences Private Limited in Shimla, Himachal Pradesh.",
};

export default function ContactPage() {
  return (
    <>
      <section className="relative h-[100svh] overflow-hidden bg-[#1d1d17]">
        <Image
          src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/07/Rectangle-3.png?fit=800%2C449&ssl=1"
          alt="Contact Us"
          fill
          priority
          unoptimized
          className="hidden object-cover md:block"
          sizes="100vw"
        />
        <Image
          src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/07/Rectangle-541.png?fit=414%2C814&ssl=1"
          alt="Contact Us"
          fill
          priority
          unoptimized
          className="object-cover md:hidden"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-black/35 to-black/52" />

        <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-20 text-center md:pb-12">
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[32px] font-bold uppercase tracking-[0.09em] text-[#f6ebda] md:text-[36px] md:tracking-[0.07em] lg:text-[40px]">
            Contact Us
          </h1>
          <a
            href="#contact-form"
            aria-label="Scroll to contact form"
            className="mt-2 block w-fit text-[#f6ebda] transition-colors hover:text-white md:mt-3"
          >
            <svg
              className="h-7 w-7 md:h-8 md:w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      <section id="contact-form" className="bg-[#efe7dd] px-5 pb-14 pt-10 md:px-10 md:pb-24 md:pt-16">
        <div className="mx-auto max-w-[1272px]">
          <div className="mx-auto max-w-[1120px] overflow-hidden rounded-[18px] border border-[#d9cec1] bg-white shadow-[0_12px_28px_rgba(76,62,45,0.08)] md:rounded-[24px]">
            <iframe
              src="https://form.typeform.com/to/ejBRMwW6?hide_headers=true&hide_footer=true&disable-auto-focus=true"
              title="Refuje Contact Form"
              className="h-[680px] w-full border-0 bg-white md:h-[860px]"
              allow="camera; microphone; autoplay; encrypted-media;"
              loading="lazy"
            />
          </div>
        </div>
      </section>
    </>
  );
}
