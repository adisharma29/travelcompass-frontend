import type { Metadata } from "next";
import Image from "next/image";
import { ExperienceCard } from "@/components/site/ExperienceCard";

export const metadata: Metadata = {
  title: "Experiences | Slow Travel in the Himalayas",
  description:
    "Offbeat experiences and activities in the Indian Himalayas: cycling, ebiking, forest bathing, stargazing, orchard tastings and more.",
};

const experiences = [
  {
    slug: "sangla-holi",
    title: "Holi in Sangla Valley",
    location: "Sangla Valley",
    duration: "5 days / 4 nights",
    price: "₹29,333 onwards",
    description:
      "Experience Holi in Sangla Valley as a multi-day, community-led celebration. Walk village processions, witness Phag Mela, and stay rooted in local tradition.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/sangla-holi.jpg",
  },
  {
    slug: "the-calm-circuit",
    title: "The Calm Circuit",
    location: "Shimla",
    duration: "3–4 hrs",
    price: "₹2,500 onwards",
    description:
      "Ease into the calmness of the mountains on this gentle forest loop on premium pedal assisted mountain e-bikes.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/calm-circuit.png",
  },
  {
    slug: "ride-into-the-stillness",
    title: "Ride into the Stillness",
    location: "Shimla",
    duration: "4-5 hrs",
    price: "₹4,000 onwards",
    description:
      "Supported 50 KM out and back through Shimla\u2019s peaceful mountain villages, ancient Deodar forests, and authentic rural landscapes.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/ride-into-stillness.png",
  },
  {
    slug: "brunch-in-apple-orchard",
    title: "The Slow Brunch",
    location: "Telangi Near Kalpa",
    duration: "3-5 hrs",
    price: "₹1,500 onwards",
    description:
      "Drift into an unhurried orchard morning. Wander among apple trees, savour a chef-curated Himachali brunch made with seasonal produce, sip slow brews, and linger on hammocks and rugs \u2014 no rush, just dappled light and mountain air.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/slow-brunch.jpg",
  },
  {
    slug: "sundowner-in-apple-orchard",
    title: "Sundowner in Apple Orchard",
    location: "Telangi Near Kalpa",
    duration: "3-5 hrs",
    price: "₹1,500 onwards",
    description:
      "An exclusive golden-hour gathering in our private apple orchard \u2014 part tasting, part reflection, part pure calm. Limited seats, open skies, and the warmth of a mountain fire.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/sundowner.jpg",
  },
];

const filters = [
  "All",
  "Camping",
  "Culinary Culture",
  "Cycling",
  "Expeditions",
  "Hiking",
  "Local Life",
  "Photography",
  "Riding & Driving",
  "Slow & Chill",
  "Solace",
  "Stargazing",
  "Wildlife",
];

export default function ExperiencesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[40vh] md:h-[60vh] overflow-hidden">
        {/* Desktop hero image */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/hero.jpg"
          alt="Offbeat experiences in the Himalayas"
          fill
          priority
          className="hidden md:block object-cover"
        />
        {/* Mobile hero image */}
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/hero-mobile.png"
          alt="Offbeat experiences in the Himalayas"
          fill
          priority
          className="md:hidden object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 px-5 md:px-10 max-w-[1400px] mx-auto">
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[30px] md:text-[46px] font-bold text-white tracking-[2px] uppercase">
            Offbeat Experiences
            <br />
            and Activities
          </h1>
        </div>
      </section>

      {/* Filters */}
      <section className="px-5 md:px-10 py-6 max-w-[1400px] mx-auto">
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {filters.map((f) => (
            <button
              key={f}
              className={`shrink-0 font-[family-name:var(--font-brinnan)] text-[12px] tracking-[1px] px-4 py-2 rounded-full border transition-colors ${
                f === "All"
                  ? "bg-[#BA6000] text-white border-[#BA6000]"
                  : "bg-transparent text-[#434431] border-[#C9B29D] hover:bg-[#C9B29D]/30"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </section>

      {/* Experience Grid */}
      <section className="px-5 md:px-10 py-8 md:py-16 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {experiences.map((exp) => (
            <ExperienceCard key={exp.slug} {...exp} />
          ))}
        </div>
      </section>
    </>
  );
}
