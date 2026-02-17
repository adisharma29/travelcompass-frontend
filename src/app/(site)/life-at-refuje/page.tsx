import type { Metadata } from "next";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Life At Refuje | Crafting Authentic Travel Experiences",
  description:
    "Discover how Refuje empowers communities, preserves heritage, and crafts mindful adventures in the Himalayas.",
};

const commitments = [
  {
    title: "Empowering Local Communities",
    description: "Educate & empower local entrepreneurs. Build resilient micro-economies",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/empowering-communities.jpg",
  },
  {
    title: "Preserving Cultural Heritage",
    description: "Preserve, respect and celebrate the traditions of the regions we serve",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/cultural-heritage.jpg",
  },
  {
    title: "Supporting Conservation Efforts",
    description: "Disseminate sustainable practices & take lead in environmental conservation",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/conservation.jpg",
  },
] as const;

const storySections = [
  {
    title: "Behind The Experiences",
    kicker: "Crafting mindful adventures",
    description:
      "Every Refuje journey begins with a deep understanding of place thoughtfully designed and led by professionally trained local knowledge keepers. From scouting hidden trails to discovering authentic cultural interactions, we meticulously craft each element to create transformative experiences that flow with the natural rhythm of the place. Each journey represents months of relationship-building, careful planning and personal exploration by our team.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/ride-into-stillness.png",
    reverse: true,
  },
  {
    title: "Sustainable Practices",
    kicker: "Treading lightly, Impacting Deeply",
    description:
      "Sustainability isn't just a buzzword at Refuje it's our operating system. We implement comprehensive waste management protocols on every expedition, source locally to minimize our carbon footprint, and train all team members in environmental stewardship.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/about/mossy-tree.jpg",
    reverse: false,
  },
  {
    title: "Base Camp Life",
    kicker: "Our home",
    description:
      "Step into our mountain sanctuaries where adventure plans take shape and travelers become family. Our base camps serve as community hubs where stories are shared over steaming cups of chai, gear is meticulously prepared, and the boundary between guest and host dissolves. Experience our daily rhythm of morning meditation, communal meals prepared with local ingredients, and evening reflections under star-filled Himalayan skies.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/sunset-women.jpg",
    reverse: true,
  },
] as const;

const sectionTitleClass =
  "font-[family-name:var(--font-biorhyme)] text-[22px] font-bold uppercase tracking-[0.06em] text-[#434431] md:text-[38px]";

export default function LifeAtRefujePage() {
  return (
    <>
      <section className="relative h-[100svh] overflow-hidden bg-[#1d1d17] md:h-[100svh]">
        <Image
          src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/DSCF1810.jpg?fit=2048%2C1365&ssl=1"
          alt="Life at Refuje"
          fill
          priority
          unoptimized
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/36 to-black/18" />
        <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-20 text-center md:pb-11">
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[32px] font-bold uppercase tracking-[0.09em] text-[#f6ebda] md:text-[36px] md:tracking-[0.07em] lg:text-[40px]">
            Life At Refuje
          </h1>
          <p className="mt-1 font-[family-name:var(--font-brinnan)] text-[12px] uppercase tracking-[0.15em] text-[#f6ebda]/95 md:mt-2 md:text-[12px]">
            Roots & Rituals
          </p>
          <a
            href="#life-intro"
            aria-label="Scroll to life at refuje introduction"
            className="mt-4 block w-fit text-[#f6ebda] transition-colors hover:text-white md:mt-4"
          >
            <svg className="h-6 w-6 md:h-7 md:w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </a>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 pb-8 pt-6 md:px-10 md:pb-12 md:pt-10">
        <div className="mx-auto max-w-[1320px]">
          <div className="relative h-[220px] overflow-hidden border border-[#d4c8ba] md:h-[460px]">
            <Image
              src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/07/refuje-60.jpg?fit=2048%2C1152&ssl=1"
              alt="Life at Refuje film preview"
              fill
              unoptimized
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/20" />
            <button
              type="button"
              aria-label="Play"
              className="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/85 bg-black/30 text-white transition-colors hover:bg-black/45 md:h-14 md:w-14"
            >
              <svg className="ml-0.5 h-4 w-4 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section id="life-intro" className="bg-[#efe7dd] px-5 pb-10 pt-2 text-center md:px-10 md:pb-14">
        <div className="mx-auto max-w-[1000px]">
          <h2 className={sectionTitleClass}>Community Connections</h2>
          <p className="mt-1 font-[family-name:var(--font-biorhyme)] text-[16px] text-[#5e5f45] md:text-[22px]">
            By the locals, for the world
          </p>
          <p className="mx-auto mt-4 max-w-[920px] font-[family-name:var(--font-brinnan)] text-[12px] leading-[1.75] text-[#5e5f45] md:mt-5 md:text-[15px] md:leading-[1.82]">
            At Refuje, we believe that community is the secret sauce for authentic travel
            experiences. We act as a catalyst, connecting a global network of outdoor
            enthusiasts with empowered local community wardens. This collaboration enables us
            to craft &amp; deliver the most genuine and immersive experiences, while fostering a
            deeper appreciation for local cultures and environment.
          </p>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 pb-12 md:px-10 md:pb-16">
        <div className="mx-auto max-w-[1320px]">
          <h3 className="text-center font-[family-name:var(--font-biorhyme)] text-[22px] font-bold uppercase tracking-[0.06em] text-[#434431] md:text-[38px]">
            Our Commitment
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-5 md:mt-7 md:grid-cols-3 md:gap-6">
            {commitments.map((item) => (
              <article
                key={item.title}
                className="overflow-hidden border border-[#ddd2c6] bg-[#f8f3eb]"
              >
                <div className="relative aspect-square">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    unoptimized
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="px-5 pb-5 pt-4 text-center md:px-6 md:pb-6 md:pt-5">
                  <h4 className="font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.1em] text-[#434431] md:text-[12px]">
                    {item.title}
                  </h4>
                  <p className="mt-2.5 font-[family-name:var(--font-brinnan)] text-[12px] leading-[1.68] text-[#5e5f45] md:text-[13px] md:leading-[1.72]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {storySections.map((section) => (
        <section key={section.title} className="bg-[#efe7dd]">
          <div className="mx-auto grid max-w-[1520px] border-t border-[#ddd2c5] md:grid-cols-2">
            <div
              className={`relative h-[280px] md:min-h-[620px] ${section.reverse ? "md:order-2" : "md:order-1"}`}
            >
              <Image
                src={section.image}
                alt={section.title}
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div
              className={`flex items-center bg-[#f2eae1] px-7 py-10 text-center md:min-h-[620px] md:px-14 md:py-14 md:text-left lg:px-16 lg:py-16 ${
                section.reverse ? "md:order-1" : "md:order-2"
              }`}
            >
              <div className="mx-auto max-w-[520px]">
                <h3 className="font-[family-name:var(--font-biorhyme)] text-[21px] font-bold uppercase tracking-[0.06em] text-[#434431] md:text-[32px] md:leading-[1.06]">
                  {section.title}
                </h3>
                <p className="mt-2 font-[family-name:var(--font-biorhyme)] text-[15px] text-[#5e5f45] md:text-[21px]">
                  {section.kicker}
                </p>
                <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[12px] leading-[1.75] text-[#5e5f45] md:mt-5 md:text-[15px] md:leading-[1.82]">
                  {section.description}
                </p>
              </div>
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
