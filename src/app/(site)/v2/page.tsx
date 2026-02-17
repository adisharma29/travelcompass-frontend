import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { V2HeroSection } from "@/components/site/v2/V2HeroSection";
import { V2ManifestoSection } from "@/components/site/v2/V2ManifestoSection";
import { V2Marquee } from "@/components/site/v2/V2Marquee";
import { V2BentoGrid } from "@/components/site/v2/V2BentoGrid";
import { V2ExperienceScroller } from "@/components/site/v2/V2ExperienceScroller";
import { V2VideoBreak } from "@/components/site/v2/V2VideoBreak";
import { V2EthosSection } from "@/components/site/v2/V2EthosSection";
import { V2TestimonialsSection } from "@/components/site/v2/V2TestimonialsSection";
import { V2SocialMosaic } from "@/components/site/v2/V2SocialMosaic";
import { V2FilmGrain } from "@/components/site/v2/V2FilmGrain";

export const metadata: Metadata = {
  title: "Refuje | Wonder Again",
  description:
    "Refuje crafts offbeat Himalayan journeys — cycling, stargazing, orchard feasts and more in the Indian Himalayas.",
};

const R2 = "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev";

const experiences = [
  {
    slug: "sangla-holi",
    title: "Holi in Sangla Valley",
    location: "Sangla Valley, Kinnaur",
    description:
      "A multi-day, community-led celebration. Walk village processions, witness Phag Mela, and stay rooted in local tradition.",
    image: `${R2}/images/site/home/sangla-holi.jpg`,
  },
  {
    slug: "the-calm-circuit",
    title: "The Calm Circuit",
    location: "Shimla",
    description:
      "Ease into mountain calmness on this gentle forest loop on premium pedal-assisted e-bikes.",
    image: `${R2}/images/site/home/calm-circuit.png`,
  },
  {
    slug: "ride-into-the-stillness",
    title: "Ride into the Stillness",
    location: "Shimla",
    description:
      "A supported 50 KM ride through peaceful mountain villages, ancient Deodar forests, and rural landscapes.",
    image: `${R2}/images/site/home/ride-into-stillness.png`,
  },
  {
    slug: "sundowner-in-apple-orchard",
    title: "Sundowner in Apple Orchard",
    location: "Telangi, Near Kalpa",
    description:
      "Watch the sun set behind the Kinner Kailash range from a secluded apple orchard in the Himalayas.",
    image: `${R2}/images/site/experiences/sundowner.jpg`,
  },
];

const ethosItems = [
  {
    icon: `${R2}/images/site/shared/icons/location.png`,
    title: "Travel Slow",
    description:
      "Let the road unfold. Let silence speak. Let time stretch. We believe the journey matters more than the destination.",
    photo: `${R2}/images/site/about/mountain-sunrise.jpg`,
  },
  {
    icon: `${R2}/images/site/shared/icons/nature.png`,
    title: "Leave No Trace",
    description:
      "Be wild, not destructive. Every trail we ride, every camp we set — we leave it better than we found it.",
    photo: `${R2}/images/site/about/mossy-tree.jpg`,
  },
  {
    icon: `${R2}/images/site/shared/icons/growth.png`,
    title: "Go Local",
    description:
      "Don\u2019t just visit\u2014contribute. Respect culture. Share space. Every experience feeds back into the community.",
    photo: `${R2}/images/site/about/tent-stars.jpg`,
  },
  {
    icon: `${R2}/images/site/shared/icons/starry-sky.png`,
    title: "Comfort Is Overrated",
    description:
      "We do scratched knees and starry skies. The best stories come from stepping outside your comfort zone.",
    photo: `${R2}/images/site/life/sunset-women.jpg`,
  },
];

const testimonials = [
  {
    author: "Jitender Jagta",
    text: "Amazing! Perfect place to be. Looking forward with excitement and anticipation. Go for it folks.",
  },
  {
    author: "Arpit Verma",
    text: "Away from the fast paced, noise, and pollution free cities, Refuje is the best place to find a refuge nowadays.",
  },
  {
    author: "Divya Tharangzak",
    text: "Telangi Kanda is a beautiful, calm and serene place \u2014 perfect to unwind and escape the noise of everyday life. Peaceful, relaxing and truly refreshing.",
  },
  {
    author: "Ishikha Agarwal",
    text: "We visited Telangi Kanda and the scenery was breathtaking. The sundowner was remarkable. Highly recommend for peaceful mountain time with loved ones.",
  },
  {
    author: "Chander S. Chauhan",
    text: "At 55, I recently did a cycling activity with Refuje and it was wonderful. Beautiful route, comfortable pace, and great support from the team.",
  },
];

const mosaicImages = [
  `${R2}/images/site/experiences/ride-into-stillness/gallery-1.jpg`,
  `${R2}/images/site/experiences/calm-circuit/gallery-2.jpg`,
  `${R2}/images/site/experiences/sundowner/gallery-3.jpg`,
  `${R2}/images/site/experiences/sangla-holi/gallery-1.jpg`,
  `${R2}/images/site/experiences/ride-into-stillness/gallery-5.jpg`,
  `${R2}/images/site/experiences/calm-circuit/gallery-4.jpg`,
  `${R2}/images/site/experiences/sundowner/gallery-1.jpg`,
  `${R2}/images/site/experiences/ride-into-stillness/gallery-8.jpg`,
];

export default function HomePageV2() {
  return (
    <>
      {/* Preload hero poster for fast LCP */}
      <link
        rel="preconnect"
        href="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev"
      />
      <link
        rel="preload"
        as="image"
        type="image/webp"
        href={`${R2}/images/site/home/hero-desktop-poster.webp`}
      />

      {/* 1. Cinematic Hero */}
      <V2HeroSection />

      {/* 2. Sticky Manifesto */}
      <V2ManifestoSection />

      {/* 3. Marquee Strip */}
      <V2Marquee />

      {/* 4. Photography Bento Grid */}
      <V2BentoGrid />

      {/* 5. Horizontal Scroll Experiences */}
      <V2ExperienceScroller experiences={experiences} />

      {/* 6. Video Break */}
      <V2VideoBreak />

      {/* 7. Ethos / Philosophy */}
      <V2EthosSection items={ethosItems} />

      {/* 8. Testimonials */}
      <V2TestimonialsSection testimonials={testimonials} />

      {/* 9. Social Mosaic */}
      <V2SocialMosaic
        images={mosaicImages}
        profileUrl="https://instagram.com/refuje.travel"
      />

      {/* 10. Final CTA */}
      <section className="relative flex h-[80vh] items-center justify-center overflow-hidden md:h-[90vh]">
        <Image
          src={`${R2}/images/site/about/tent-stars.jpg`}
          alt="Camping under the Himalayan stars"
          fill
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#434431]/55" />
        <V2FilmGrain opacity={0.04} />
        <div className="relative z-10 px-6 text-center">
          <p className="mb-4 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.3em] text-[#C9B29D] md:mb-6 md:text-[12px]">
            Begin Your Journey
          </p>
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[32px] leading-[1.1] text-[#FFE9CF] md:text-[56px]">
            Your Himalayan Story
            <br />
            Begins Here
          </h2>
          <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[15px] text-[#C9B29D]/80 md:mt-6 md:text-[18px]">
            Experiences from &#8377;2,500
          </p>
          <Link
            href="/experiences"
            className="mt-6 inline-block rounded-sm bg-[#A56014] px-8 py-3.5 font-[family-name:var(--font-brinnan)] text-[13px] uppercase tracking-[0.14em] text-[#FFE9CF] transition-colors hover:bg-[#8a5010] md:mt-8 md:px-10 md:py-4 md:text-[15px]"
          >
            Explore Experiences
          </Link>
        </div>
      </section>
    </>
  );
}
