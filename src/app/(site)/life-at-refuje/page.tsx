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
    description: "Educate and empower local entrepreneurs while building resilient mountain economies.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/empowering-communities.jpg",
  },
  {
    title: "Preserving Cultural Heritage",
    description: "Preserve, respect, and celebrate the traditions of the regions we operate in.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/cultural-heritage.jpg",
  },
  {
    title: "Supporting Conservation",
    description: "Adopt sustainable practices and support long-term environmental conservation.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/conservation.jpg",
  },
];

export default function LifeAtRefujePage() {
  return (
    <>
      <section className="relative h-[420px] overflow-hidden md:h-[560px]">
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/hero.jpg"
          alt="Life at Refuje"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/45" />
        <div className="absolute inset-0 flex items-end justify-center pb-8 md:pb-12">
          <div className="text-center">
            <h1 className="font-[family-name:var(--font-biorhyme)] text-[30px] uppercase tracking-[0.1em] text-[#f6ebda] md:text-[54px]">
              Life At Refuje
            </h1>
            <svg className="mx-auto mt-4 h-6 w-6 text-[#f6ebda]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 py-8 md:px-10 md:py-12">
        <div className="mx-auto max-w-[1272px]">
          <div className="relative h-[170px] overflow-hidden md:h-[320px]">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/basecamp-stars.jpg"
              alt="Video preview"
              fill
              className="object-cover"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-black/15" />
            <button
              type="button"
              aria-label="Play"
              className="absolute left-1/2 top-1/2 flex h-8 w-8 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border border-white/80 bg-black/30 text-white md:h-14 md:w-14"
            >
              <svg className="ml-0.5 h-3.5 w-3.5 md:h-6 md:w-6" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 pb-8 pt-1 text-center md:px-10 md:pb-12">
        <div className="mx-auto max-w-[980px]">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[26px] uppercase tracking-[0.08em] text-[#434431] md:text-[40px]">
            Community Connections
          </h2>
          <p className="mt-1 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.12em] text-[#5e5f45] md:text-[13px]">
            By the locals, for the world
          </p>
          <p className="mx-auto mt-4 max-w-[840px] font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.75] text-[#5e5f45] md:text-[14px]">
            At Refuje, we believe community is the secret sauce of authentic travel. We connect a
            global network of outdoor enthusiasts with empowered local community wardens to design
            deeply immersive experiences.
          </p>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 pb-10 md:px-10 md:pb-14">
        <div className="mx-auto max-w-[1272px]">
          <h3 className="text-center font-[family-name:var(--font-biorhyme)] text-[24px] text-[#434431] md:text-[38px]">
            Our Commitment
          </h3>
          <div className="mt-5 grid grid-cols-1 gap-5 md:mt-7 md:grid-cols-3 md:gap-6">
            {commitments.map((item) => (
              <article key={item.title} className="bg-[#f8f5ef]">
                <div className="relative h-[170px] md:h-[210px]">
                  <Image
                    src={item.image}
                    alt={item.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="px-4 pb-4 pt-3 text-center md:px-5 md:pb-5">
                  <h4 className="font-[family-name:var(--font-brinnan)] text-[10px] uppercase tracking-[0.1em] text-[#434431] md:text-[12px]">
                    {item.title}
                  </h4>
                  <p className="mt-2 font-[family-name:var(--font-brinnan)] text-[10px] leading-[1.65] text-[#5e5f45] md:text-[11px]">
                    {item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd]">
        <div className="grid md:grid-cols-2">
          <div className="relative h-[210px] md:h-[360px]">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/ride-into-stillness.png"
              alt="Behind the experiences"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="bg-[#efe7dd] px-7 py-10 text-center md:px-16 md:text-left">
            <h3 className="font-[family-name:var(--font-biorhyme)] text-[35px] uppercase tracking-[0.08em] text-[#434431] md:text-[52px]">
              Behind The Experiences
            </h3>
            <p className="mt-1 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.12em] text-[#5e5f45] md:text-[13px]">
              Crafting mindful adventures
            </p>
            <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.75] text-[#5e5f45] md:text-[13px]">
              Every Refuje journey starts with deep local understanding. From scouting routes to
              building cultural interactions, we craft each element with local experts to ensure the
              experience is both meaningful and responsible.
            </p>
          </div>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="bg-[#efe7dd] px-7 py-10 text-center md:px-16 md:text-left md:order-1">
            <h3 className="font-[family-name:var(--font-biorhyme)] text-[35px] uppercase tracking-[0.08em] text-[#434431] md:text-[52px]">
              Sustainable Practices
            </h3>
            <p className="mt-1 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.12em] text-[#5e5f45] md:text-[13px]">
              Treading lightly, impacting deeply
            </p>
            <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.75] text-[#5e5f45] md:text-[13px]">
              Sustainability is our operating system. We implement waste protocols, source locally,
              and design low-impact itineraries so mountain travel supports people and place.
            </p>
          </div>
          <div className="relative h-[210px] md:h-[360px] md:order-2">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/about/mossy-tree.jpg"
              alt="Sustainable practices"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="relative h-[210px] md:h-[360px]">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/life/sunset-women.jpg"
              alt="Base camp life"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="bg-[#efe7dd] px-7 py-10 text-center md:px-16 md:text-left">
            <h3 className="font-[family-name:var(--font-biorhyme)] text-[35px] uppercase tracking-[0.08em] text-[#434431] md:text-[52px]">
              Base Camp Life
            </h3>
            <p className="mt-1 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.12em] text-[#5e5f45] md:text-[13px]">
              Our home
            </p>
            <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.75] text-[#5e5f45] md:text-[13px]">
              Step into our mountain sanctuaries where stories are shared, routes are planned, and
              guests become part of the local rhythm.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
