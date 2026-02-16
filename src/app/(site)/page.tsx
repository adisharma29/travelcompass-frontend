import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExperienceCard } from "@/components/site/ExperienceCard";
import { ImageGallery } from "@/components/site/ImageGallery";
import { TestimonialsCarousel } from "@/components/site/TestimonialsCarousel";
import { LazyVideo } from "@/components/site/LazyVideo";

export const metadata: Metadata = {
  title: "Refuje | Luxe Offbeat Travel Experiences",
  description:
    "Refuje offers luxury offbeat travel experiences and adventures in the Indian Himalayas: cycling, ebiking, stargazing, orchard food tastings and more.",
};

const categories = [
  {
    title: "E-Biking",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/ebiking.jpg",
    href: "/experiences?experience-type=cycling",
  },
  {
    title: "Forest Bathing",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/forest-bathing-full.jpg",
    href: "/experiences?experience-type=solace",
  },
  {
    title: "Rhythms of the Valley",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/rhythms-full.jpg",
    href: "/experiences?experience-type=slowchill",
  },
  {
    title: "Exploring Tantra",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/exploring-tantra-full.jpg",
    href: "/experiences?experience-type=expeditions",
    comingSoon: true,
  },
  {
    title: "Celestial Slumber",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/celestial-slumber-full.jpg",
    href: "/experiences?experience-type=stargazing",
    comingSoon: true,
  },
];

const signatureExperiences = [
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
    duration: "3 – 4 Hrs",
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
    price: "Rs 4000 onwards",
    description:
      "Supported 50 KM out and back through Shimla\u2019s peaceful mountain villages, ancient Deodar forests, and authentic rural landscapes.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/ride-into-stillness.png",
  },
];

const testimonials = [
  {
    text: "Amazing !!!! Perfect place to be. Looking forward with excitement and anticipation. Go for it folks",
    author: "Jitender Jagta",
    location: "",
  },
  {
    text: "Away from the fast paced, noise, and pollution free cities, Refuje is the best place to find a refuge nowadays.",
    author: "Arpit Verma",
    location: "",
  },
  {
    text: "Telangi kanda is a beautiful, calm and serene place \u2013 perfect to unwind and escape the noise of everyday life. The snow-capped peaks create a stunning backdrop for nature lovers and photographers alike. The tranquility of the surroundings is perfect for those seeking a peaceful escape from the hustle and bustle of city life.",
    author: "Divya Tharangzak",
    location: "",
  },
  {
    text: "We visited telangi kandae and breathtaking scenery. The sundowner we saw at that place was remarkable! Highly recommend for people who want to spend time in the silence of the mountains and spend some quality and peaceful time with their loved ones.",
    author: "ishikha agarwal",
    location: "",
  },
  {
    text: "I\u2019m 55 years old and recently did a cycling activity with Refuje \u2013 and it was absolutely wonderful. The route was beautiful, the pace was comfortable, and the team made sure I felt supported the whole way. Highly recommended!",
    author: "Chander Singh Chauhan",
    location: "",
  },
];

const ethosItems = [
  {
    icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/location.png",
    title: "Travel Slow",
    description: "Let the road unfold. Let silence speak. Let time stretch.",
  },
  {
    icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/nature.png",
    title: "Leave No Trace",
    description: "Be wild, Not destructive",
  },
  {
    icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/growth.png",
    title: "Go Local",
    description: "Don\u2019t just visit\u2014contribute. Respect culture. Share space.",
  },
  {
    icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/starry-sky.png",
    title: "Stay a Little Wild",
    description: "Great stories begin with a little adventure.",
  },
];

export default function HomePage() {
  return (
    <>
      {/* Preload hero poster images for fast LCP */}
      <link
        rel="preconnect"
        href="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev"
      />
      <link
        rel="preload"
        as="image"
        type="image/webp"
        href="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/hero-mobile-poster.webp"
        media="(max-width: 767px)"
      />
      <link
        rel="preload"
        as="image"
        type="image/webp"
        href="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/hero-desktop-poster.webp"
        media="(min-width: 768px)"
      />

      {/* Hero with background video */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        {/* Desktop video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/hero-desktop-poster.webp"
          preload="auto"
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
          {...{ fetchPriority: "high" }}
        >
          <source
            src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/videos/site/home/hero-desktop.mp4"
            type="video/mp4"
          />
        </video>
        {/* Mobile video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          poster="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/hero-mobile-poster.webp"
          preload="auto"
          className="md:hidden absolute inset-0 w-full h-full object-cover"
          {...{ fetchPriority: "high" }}
        >
          <source
            src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/videos/site/home/hero-mobile.mp4"
            type="video/mp4"
          />
        </video>
        {/* Scroll-down chevron */}
        <a href="#intro" aria-label="Scroll to introduction" className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 text-white/80 hover:text-white transition-colors animate-bounce">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </section>

      {/* Intro Section */}
      <section id="intro" className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto text-center">
        <h1 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#333333] text-center uppercase">
          Luxury Offbeat Travel
        </h1>
        <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[18px] md:text-[22px] text-[#434431] max-w-[600px] mx-auto leading-relaxed tracking-[1px]">
          Discover authentic experiences and activities in the Himalayas through mindful adventures
          that reconnect you with nature and yourself.
        </p>
        <Link
          href="/about-us"
          className="inline-block mt-6 font-[family-name:var(--font-brinnan)] text-[18px] md:text-[22px] font-bold text-[#434431] hover:text-[#BA6000] transition-colors tracking-[2px] uppercase"
        >
          Explore More
        </Link>
      </section>

      {/* Experiences Section */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] uppercase text-center mb-4">
          Experiences
        </h2>
        <p className="font-[family-name:var(--font-brinnan)] text-[18px] md:text-[22px] text-[#434431] leading-relaxed text-center max-w-[700px] mx-auto mb-10 tracking-[1px]">
          Lie beneath starlit skies, taste local food, pluck fresh apples, discover silk route tales
          from locals, or meander through mountain countryside on an ebike to rediscover simple joys
          in the wilderness.
        </p>

        {/* Experience category bento grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 md:grid-rows-2 gap-x-[6px] gap-y-[10px] md:gap-5">
          {categories.map((cat, i) => (
            <Link
              key={cat.title}
              href={cat.comingSoon ? "#" : cat.href}
              className={`group relative overflow-hidden block ${
                i === 0
                  ? "col-span-2 md:col-span-2 md:row-span-2 aspect-[335/400] md:aspect-auto md:h-full"
                  : "aspect-[165/250] md:aspect-square"
              }`}
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes={i === 0 ? "(max-width: 768px) 100vw, 50vw" : "(max-width: 768px) 50vw, 25vw"}
              />
              <div className={`absolute bottom-0 left-0 right-0 bg-black/80 ${
                i === 0 ? "p-4 md:p-5" : "px-2 py-1.5 md:p-5"
              }`}>
                <h3 className={`font-[family-name:var(--font-biorhyme)] font-bold text-white uppercase ${
                  i === 0 ? "text-[24px] md:text-[35px] tracking-[4px]" : "text-[12px] md:text-[23px] tracking-[1px]"
                }`}>
                  {cat.title}
                </h3>
                {cat.comingSoon ? (
                  <span className={`inline-block font-[family-name:var(--font-brinnan)] text-[8px] md:text-[15px] text-white tracking-[1px] uppercase underline underline-offset-4 ${
                    i === 0 ? "mt-2" : "mt-1 md:mt-2"
                  }`}>
                    Coming Soon
                  </span>
                ) : (
                  <span className={`inline-block font-[family-name:var(--font-brinnan)] text-[8px] md:text-[15px] text-white tracking-[1px] uppercase underline underline-offset-4 ${
                    i === 0 ? "mt-2" : "mt-1 md:mt-2"
                  }`}>
                    Explore More
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>

        <div className="text-center mt-8">
          <Link
            href="/experiences"
            className="inline-block font-[family-name:var(--font-brinnan)] text-[12px] md:text-[22px] font-bold text-white bg-[#9E5200] px-6 py-2.5 md:px-8 md:py-3 hover:bg-[#874600] transition-colors tracking-[1px] uppercase"
          >
            Explore All Experiences
          </Link>
        </div>
      </section>

      {/* Signature Experiences */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] uppercase text-center mb-8 md:mb-12">
          Signature Experiences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signatureExperiences.map((exp) => (
            <ExperienceCard key={exp.slug} {...exp} />
          ))}
        </div>
      </section>

      {/* Video Section — lazy-loaded to avoid downloading ~6MB below the fold */}
      <section className="relative w-full overflow-hidden">
        {/* Desktop video */}
        <LazyVideo
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/videos/site/home/midpage.mp4"
          className="hidden md:block w-full"
          controls
        />
        {/* Mobile video */}
        <LazyVideo
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/videos/site/home/midpage.mp4"
          className="md:hidden w-full"
          controls
        />
      </section>

      {/* The Refuje Way */}
      <section className="px-5 md:px-10 py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] uppercase text-center mb-3">
            The Refuje Way
          </h2>
          <p className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[32px] font-medium text-[#434431] text-center mb-10">
            Our Ethos, Your Compass
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {ethosItems.map((item, i) => (
              <div
                key={item.title}
                className={`${
                  i % 2 === 0 ? "bg-[#5E5D40]" : "bg-[#434431]"
                } rounded-[60px] py-10 px-5 text-center flex flex-col items-center`}
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={134}
                  height={134}
                  className="mb-5"
                />
                <hr className="w-full border-t border-white/20 mb-4" />
                <h3 className="font-[family-name:var(--font-brinnan)] text-[12px] md:text-[20px] font-bold text-[#FFE9CF] tracking-[2px] mb-2 uppercase">
                  {item.title}
                </h3>
                <p className="font-[family-name:var(--font-brinnan)] text-[10px] md:text-[16px] text-[#E1D5C8] tracking-[0.5px] leading-[1.6]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Gallery */}
      <section className="bg-[#FFE9CF] px-5 md:px-10 py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] uppercase text-center mb-8">
            Video Gallery
          </h2>
          <ImageGallery />
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] uppercase text-center mb-3">
          Testimonials
        </h2>
        <p className="font-[family-name:var(--font-biorhyme)] text-[22px] md:text-[28px] font-medium text-[#434431] text-center mb-10">
          Hear what our explorers have to say!
        </p>
        <TestimonialsCarousel testimonials={testimonials} />
      </section>

      {/* Follow Us */}
      <section className="py-10 md:py-16 text-center">
        <p className="font-[family-name:var(--font-brinnan)] text-[18px] md:text-[22px] font-bold text-[#434431] tracking-[2px] uppercase mb-2">
          Follow Us On
        </p>
        <a
          href="https://instagram.com/refuje.travel"
          target="_blank"
          rel="noopener noreferrer"
          className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] hover:text-[#BA6000] transition-colors tracking-[1px]"
        >
          @refuje.travel
        </a>
      </section>

      {/* Instagram Feed */}
      <section className="px-5 md:px-10 pb-12 md:pb-20 max-w-[1400px] mx-auto">
        <div className="overflow-hidden bg-[#C9B29D] p-4">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-[#434431] flex items-center justify-center">
              <Image
                src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/logo.png"
                alt="Refuje"
                width={20}
                height={20}
                className="brightness-0 invert"
              />
            </div>
            <span className="font-[family-name:var(--font-brinnan)] text-[13px] text-[#434431] tracking-[0.5px]">
              @refuje.travel
            </span>
            <a
              href="https://instagram.com/refuje.travel"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto font-[family-name:var(--font-brinnan)] text-[12px] font-bold text-white bg-[#A56014] px-4 py-1.5 rounded-[3px] hover:bg-[#8A4F10] transition-colors tracking-[0.5px]"
            >
              Follow
            </a>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {[
              "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/sundowner/gallery-1.jpg",
              "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-3.jpg",
              "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/calm-circuit/gallery-1.jpg",
              "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/slow-brunch/gallery-1.jpg",
            ].map((src, i) => (
              <a
                key={i}
                href="https://instagram.com/refuje.travel"
                target="_blank"
                rel="noopener noreferrer"
                className="relative aspect-square overflow-hidden group"
              >
                <Image
                  src={src}
                  alt="Instagram post"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                  sizes="50vw"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                  <svg className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M7.8 2h8.4C19.4 2 22 4.6 22 7.8v8.4a5.8 5.8 0 0 1-5.8 5.8H7.8C4.6 22 2 19.4 2 16.2V7.8A5.8 5.8 0 0 1 7.8 2m-.2 2A3.6 3.6 0 0 0 4 7.6v8.8C4 18.39 5.61 20 7.6 20h8.8a3.6 3.6 0 0 0 3.6-3.6V7.6C20 5.61 18.39 4 16.4 4H7.6m9.65 1.5a1.25 1.25 0 0 1 1.25 1.25A1.25 1.25 0 0 1 17.25 8 1.25 1.25 0 0 1 16 6.75a1.25 1.25 0 0 1 1.25-1.25M12 7a5 5 0 0 1 5 5 5 5 0 0 1-5 5 5 5 0 0 1-5-5 5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3 3 3 0 0 0 3 3 3 3 0 0 0 3-3 3 3 0 0 0-3-3z" />
                  </svg>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
