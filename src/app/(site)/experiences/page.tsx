import type { Metadata } from "next";
import Image from "next/image";
import { ExperienceGrid } from "@/components/site/ExperienceGrid";

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
    types: ["culture", "local-life", "slowchill"],
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
    types: ["cycling", "photography", "ridingdriving"],
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
    types: ["cycling", "ridingdriving", "wildlife"],
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
    types: ["culinary", "culture", "local-life", "photography", "slowchill", "solace"],
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
    types: ["culinary", "culture", "local-life", "photography", "slowchill", "solace"],
  },
];

export default function ExperiencesPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-dvh overflow-hidden">
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
        <div className="absolute inset-x-0 bottom-[18px] flex flex-col items-center">
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[30px] md:text-[42px] font-bold text-white tracking-[1px] uppercase text-center">
            Offbeat Experiences
            <br />
            and Activities
          </h1>
          <a href="#experiences" className="mt-12 text-white" aria-label="Scroll to experiences">
            <svg className="w-[30px] h-[30px]" fill="currentColor" viewBox="0 0 448 512" xmlns="http://www.w3.org/2000/svg">
              <path d="M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z" />
            </svg>
          </a>
        </div>
      </section>

      <ExperienceGrid experiences={experiences} />
    </>
  );
}
