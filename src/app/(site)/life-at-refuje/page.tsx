import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Life At Refuje | Crafting Authentic Travel Experiences",
  description:
    "Discover how Refuje empowers communities, preserves heritage, and crafts mindful adventures in the Himalayas.",
};

const pillars = [
  {
    title: "Empowering Local Communities",
    description: "Educate & empower local entrepreneurs. Build resilient micro-economies.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/empowering-communities.jpg",
  },
  {
    title: "Preserving Cultural Heritage",
    description:
      "Preserve, respect and celebrate the traditions of the regions we serve.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/cultural-heritage.jpg",
  },
  {
    title: "Supporting Conservation Efforts",
    description:
      "Disseminate sustainable practices & take lead in environmental conservation.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/conservation.jpg",
  },
  {
    title: "Building Connections",
    description:
      "Create meaningful bonds between travelers and the communities that host them.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/sunset-women.jpg",
  },
];

export default function LifeAtRefujePage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/hero.jpg"
          alt="Life at Refuje"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 px-5 md:px-10 max-w-[1400px] mx-auto">
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[30px] md:text-[36px] font-bold text-white tracking-[1px] uppercase">
            Life at Refuje
          </h1>
          <p className="mt-2 font-[family-name:var(--font-brinnan)] text-[20px] md:text-[24px] text-white/80 tracking-[2px] uppercase">
            Roots & Rituals
          </p>
        </div>
      </section>

      {/* Roots & Rituals */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] tracking-[2px] uppercase text-center mb-3">
          Roots & Rituals
        </h2>
        <h3 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] text-center mb-6">
          Community Connections
        </h3>
        <p className="font-[family-name:var(--font-brinnan)] text-[18px] md:text-[22px] font-bold text-[#434431] tracking-[2px] text-center mb-4">
          By the locals, for the world
        </p>
        <p className="font-[family-name:var(--font-brinnan)] text-[16px] text-[#434431] leading-relaxed text-center max-w-[700px] mx-auto tracking-[1px]">
          At Refuje, we believe that community is the secret sauce for authentic travel experiences.
          We act as a catalyst, connecting a global network of outdoor enthusiasts with empowered
          local community wardens. This collaboration enables us to craft &amp; deliver the most
          genuine and immersive experiences, while fostering a deeper appreciation for local cultures
          and environment.
        </p>
      </section>

      {/* Pillars */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] uppercase text-center mb-10">
          Our Commitment
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="overflow-hidden bg-[#FFE9CF]">
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={pillar.image}
                  alt={pillar.title}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                />
              </div>
              <div className="p-5">
                <h3 className="font-[family-name:var(--font-brinnan)] text-[20px] font-bold text-[#434431] tracking-[2px] mb-2">
                  {pillar.title}
                </h3>
                <p className="font-[family-name:var(--font-brinnan)] text-[12px] text-[#434431] leading-relaxed tracking-[1px]">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Behind the Experiences */}
      <section className="bg-[#434431] px-5 md:px-10 py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1 text-center md:text-left">
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[32px] font-bold text-[#FFE9CF] uppercase mb-3">
              Behind the Experiences
            </h2>
            <hr className="w-12 border-t-2 border-[#C9B29D] mb-4 mx-auto md:mx-0" />
            <h3 className="font-[family-name:var(--font-brinnan)] text-[18px] font-bold text-[#FFE9CF] tracking-[4px] mb-6">
              Crafting mindful adventures
            </h3>
            <p className="font-[family-name:var(--font-brinnan)] text-[16px] text-[#FFE9CF]/70 leading-relaxed tracking-[1px]">
              Every Refuje journey begins with a deep understanding of place thoughtfully designed and
              led by professionally trained local knowledge keepers. From scouting hidden trails to
              discovering authentic cultural interactions, we meticulously craft each element to create
              transformative experiences that flow with the natural rhythm of the place. Each journey
              represents months of relationship-building, careful planning and personal exploration by
              our team.
            </p>
          </div>
          <div className="relative w-full md:w-[400px] aspect-[4/3] overflow-hidden shrink-0">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/basecamp-stars.jpg"
              alt="Crafting mindful adventures"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </section>

      {/* Sustainable Practices */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[32px] font-bold text-[#434431] uppercase mb-3">
              Sustainable Practices
            </h2>
            <hr className="w-12 border-t-2 border-[#C9B29D] mb-4" />
            <h3 className="font-[family-name:var(--font-brinnan)] text-[18px] font-bold text-[#434431] tracking-[2px] mb-6">
              Treading lightly, Impacting Deeply
            </h3>
            <p className="font-[family-name:var(--font-brinnan)] text-[16px] text-[#434431] leading-relaxed tracking-[1px]">
              Sustainability isn&apos;t just a buzzword at Refuje &mdash; it&apos;s our operating
              system. We implement comprehensive waste management protocols on every expedition,
              source locally to minimize our carbon footprint, and train all team members in
              environmental stewardship.
            </p>
          </div>
          <div className="relative w-full md:w-[400px] aspect-square shrink-0">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/sustainable-graphic.png"
              alt="Sustainable practices"
              fill
              className="object-contain"
              sizes="(max-width: 768px) 100vw, 400px"
            />
          </div>
        </div>
      </section>

      {/* Base Camp */}
      <section className="relative overflow-hidden">
        <div className="relative h-[50vh] md:h-[60vh]">
          <Image
            src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/basecamp-stars.jpg"
            alt="Base camp under the stars"
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <div className="text-center px-5 max-w-[600px]">
              <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[32px] font-bold text-[#FFE9CF] uppercase mb-3">
                Base Camp Life
              </h2>
              <hr className="w-12 border-t-2 border-[#C9B29D] mx-auto mb-4" />
              <h3 className="font-[family-name:var(--font-brinnan)] text-[18px] font-bold text-white tracking-[2px] mb-4">
                Our Home
              </h3>
              <p className="font-[family-name:var(--font-brinnan)] text-[16px] text-white/80 leading-relaxed tracking-[1px]">
                Step into our mountain sanctuaries where adventure plans take shape and travelers
                become family. Our base camps serve as community hubs where stories are shared over
                steaming cups of chai, gear is meticulously prepared, and the boundary between guest
                and host dissolves. Experience our daily rhythm of morning meditation, communal meals
                prepared with local ingredients, and evening reflections under star-filled Himalayan
                skies.
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
