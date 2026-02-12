import type { Metadata } from "next";
import Image from "next/image";
import { FaqAccordions } from "./FaqAccordions";

export const metadata: Metadata = {
  title: "FAQs | Refuje",
  description: "Frequently asked questions about Refuje travel experiences.",
};

export default function FaqsPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[50vh] overflow-hidden">
        {/* Desktop hero image */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/policy/hero-desktop.png"
          alt="Frequently Asked Questions"
          fill
          priority
          className="hidden md:block object-cover"
        />
        {/* Mobile hero image */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/policy/hero-mobile.png"
          alt="Frequently Asked Questions"
          fill
          priority
          className="md:hidden object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <h1 className="font-[family-name:var(--font-brinnan)] text-[28px] md:text-[40px] font-bold text-white tracking-[3px] uppercase">
            Frequently Asked Questions
          </h1>
        </div>
      </section>

      {/* Content */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[800px] mx-auto">
        <FaqAccordions />
      </section>
    </>
  );
}
