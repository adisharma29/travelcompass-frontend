import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Experiences | Slow Travel in the Himalayas",
  description:
    "Offbeat experiences and activities in the Indian Himalayas: cycling, ebiking, forest bathing, stargazing, orchard tastings and more.",
};

const topCategories = [
  "All",
  "Camping",
  "Cycling",
  "Culture",
  "Stargazing",
  "Hiking",
  "Wildlife",
  "Photography",
];

const experiences = [
  {
    slug: "ride-into-the-stillness",
    title: "A ride through the terrain",
    location: "Kalpa",
    duration: "Half day",
    price: "Rs 1000",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/ride-into-stillness.png",
    description:
      "Ride to its gateway on an e-bike, then hike through ancient trails where nature and tradition exist in rhythm.",
  },
  {
    slug: "the-calm-circuit",
    title: "A night under the cosmos",
    location: "Spiti",
    duration: "One night",
    price: "Rs 1000",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/calm-circuit.png",
    description:
      "Step away from the ordinary and go stargazing under vast, unpolluted skies above 4000m.",
  },
  {
    slug: "sundowner-in-apple-orchard",
    title: "A sacred day in the orchards",
    location: "Kalpa",
    duration: "Half day",
    price: "Rs 1000",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/sundowner.jpg",
    description:
      "A slow orchard trail, local tastes, and stories from the hills in one unhurried mountain day.",
  },
  {
    slug: "ride-into-the-stillness",
    title: "A ride through the terrain",
    location: "Kalpa",
    duration: "Half day",
    price: "Rs 1000",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/ride-into-stillness.png",
    description:
      "Ride to its gateway on an e-bike, then hike through ancient trails where nature and tradition exist in rhythm.",
  },
  {
    slug: "the-calm-circuit",
    title: "A night under the cosmos",
    location: "Spiti",
    duration: "One night",
    price: "Rs 1000",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/calm-circuit.png",
    description:
      "Step away from the ordinary and go stargazing under vast, unpolluted skies above 4000m.",
  },
  {
    slug: "sundowner-in-apple-orchard",
    title: "A sacred day in the orchards",
    location: "Kalpa",
    duration: "Half day",
    price: "Rs 1000",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/sundowner.jpg",
    description:
      "A slow orchard trail, local tastes, and stories from the hills in one unhurried mountain day.",
  },
];

export default function ExperiencesPage() {
  return (
    <>
      <section className="relative h-[430px] overflow-hidden md:h-[600px]">
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/hero.jpg"
          alt="Experiences"
          fill
          priority
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-black/35" />

        <div className="absolute inset-0 flex items-end justify-center pb-10 md:pb-16">
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[34px] uppercase tracking-[0.12em] text-[#f6ebda] md:text-[62px]">
            Experiences
          </h1>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-4 py-5 md:px-10 md:py-10">
        <div className="mx-auto max-w-[1272px]">
          <div className="grid grid-cols-4 gap-y-3 text-center md:grid-cols-8 md:gap-2">
            {topCategories.map((category) => (
              <div key={category} className="space-y-1.5 md:space-y-2">
                <span className="mx-auto block h-4 w-4 rounded-full border border-[#9f9a74] md:h-5 md:w-5" />
                <p className="font-[family-name:var(--font-brinnan)] text-[9px] uppercase tracking-[0.1em] text-[#5e5f45] md:text-[12px]">
                  {category}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-4 flex items-center justify-between gap-2 md:mt-6">
            <div className="flex flex-wrap gap-2">
              {["Duration", "Price", "Region", "Season"].map((filter) => (
                <button
                  key={filter}
                  type="button"
                  className="bg-[#6f7350] px-3 py-1.5 font-[family-name:var(--font-brinnan)] text-[9px] uppercase tracking-[0.11em] text-[#f6ebda] md:px-5 md:py-2 md:text-[11px]"
                >
                  {filter}
                </button>
              ))}
            </div>
            <button
              type="button"
              className="bg-[#d9c3af] px-3 py-1.5 font-[family-name:var(--font-brinnan)] text-[9px] uppercase tracking-[0.11em] text-[#64543f] md:px-5 md:py-2 md:text-[11px]"
            >
              Sort by
            </button>
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-4 pb-10 pt-2 md:px-10 md:pb-16 md:pt-4">
        <div className="mx-auto max-w-[1272px]">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8">
            {experiences.map((experience, index) => (
              <Link
                key={`${experience.slug}-${index}`}
                href={`/experience/${experience.slug}`}
                className="group block bg-[#f8f5ef]"
              >
                <div className="relative h-[210px] overflow-hidden md:h-[260px]">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="space-y-1.5 px-4 pb-5 pt-4 md:px-5 md:pb-6 md:pt-5">
                  <div className="flex items-center justify-between">
                    <p className="font-[family-name:var(--font-brinnan)] text-[9px] uppercase tracking-[0.1em] text-[#6f7055] md:text-[10px]">
                      {experience.location}
                    </p>
                    <p className="font-[family-name:var(--font-brinnan)] text-[9px] text-[#434431] md:text-[10px]">
                      {experience.price}
                    </p>
                  </div>
                  <h3 className="font-[family-name:var(--font-biorhyme)] text-[28px] leading-[1.06] text-[#434431] md:text-[36px]">
                    {experience.title}
                  </h3>
                  <p className="font-[family-name:var(--font-brinnan)] text-[9px] uppercase tracking-[0.1em] text-[#6f7055] md:text-[10px]">
                    {experience.duration}
                  </p>
                  <p className="line-clamp-3 font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.55] text-[#5f5f4c] md:text-[12px]">
                    {experience.description}
                  </p>
                  <span className="inline-block bg-[#b26214] px-3 py-1.5 font-[family-name:var(--font-brinnan)] text-[9px] uppercase tracking-[0.11em] text-[#f8e9d5] md:text-[10px]">
                    View More
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-6 text-center font-[family-name:var(--font-brinnan)] text-[10px] text-[#66674d] md:mt-8 md:text-[12px]">
            1 &nbsp;&nbsp; 2 &nbsp;&nbsp; 3 &nbsp;&nbsp; Next
          </div>
        </div>
      </section>
    </>
  );
}
