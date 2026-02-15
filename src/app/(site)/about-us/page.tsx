import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Refuje | Luxe Travel Experiences in Himalayas",
  description:
    "At Refuje, we craft authentic, sustainable travel experiences that reconnect you with the simple, forgotten joys of life.",
};

const team = [
  {
    name: "Rajesh Thakur",
    alias: "The Bold Monk",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/about/team-rajesh.webp",
    badge: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/about/badge-rajesh.png",
    bio: "Kullu\u2013Shimla kid turned Himalayan fixer. Rajesh spent years building hostels and homestays with local families, chefs, and curious travelers\u2014stays that felt personal, not packaged. He believes tourism should humanize, not extract. Now he\u2019s building Refuje to help people rediscover wonder in outdoors.",
  },
  {
    name: "Ajay Negi",
    alias: "The OG Local",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/about/team-ajay.webp",
    badge: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/about/badge-ajay.png",
    bio: "Kinnauri boy who came back home after IIM Calcutta! Ajay spent his early years co-creating with village partners\u2014proof that \u2018local\u2019 is the experience and building across Himachal and Ladakh. Belief system: locals first, always. In Refuje, he\u2019s building a platform with local communities for shared growth.",
  },
];

export default function AboutPage() {
  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        <Image
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/about/hero.jpg"
          alt="About Refuje"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 px-5 md:px-10 max-w-[1400px] mx-auto">
          <p className="font-[family-name:var(--font-brinnan)] text-[14px] text-white/70 tracking-[2px] uppercase mb-3">
            About Us
          </p>
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[30px] md:text-[40px] font-bold text-white leading-tight max-w-[700px]">
            Crafting authentic, sustainable travel experiences
          </h1>
          <p className="mt-3 font-[family-name:var(--font-brinnan)] text-[18px] md:text-[24px] text-white/80 tracking-[2px] uppercase">
            Who We Are
          </p>
        </div>
      </section>

      {/* Tagline */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto text-center">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[18px] md:text-[22px] text-[#434431] leading-relaxed max-w-[700px] mx-auto font-extrabold tracking-[1px]">
          At Refuje, we craft authentic, sustainable travel experiences that reconnect you with the
          simple, forgotten joys of life.
        </h2>
        <hr className="w-16 border-t-2 border-[#C9B29D] mx-auto my-6" />
        <p className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-[#434431] leading-relaxed max-w-[700px] mx-auto tracking-[1px]">
          Our curated, unhurried journeys blend nature, adventure,
          culture, and mindfulness &mdash; offering a &lsquo;Refuje&rsquo; from everyday life and
          nurturing a deeper sense of wonder and connection.
        </p>
        <Link
          href="/life-at-refuje"
          className="inline-block mt-6 font-[family-name:var(--font-brinnan)] text-[18px] md:text-[22px] font-bold text-[#FFE9CF] bg-[#BA6000] px-8 py-3 rounded-sm hover:bg-[#A05000] transition-colors tracking-[1px] uppercase"
        >
          Life @Refuje
        </Link>
      </section>

      {/* Vision & Mission - Alternating full-width rows */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto space-y-16">
        {/* Vision */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-12">
          <div className="flex-1">
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[36px] md:text-[48px] font-bold text-[#434431] tracking-[2px] uppercase mb-4">
              Vision
            </h2>
            <hr className="w-12 border-t-2 border-[#C9B29D] mb-4" />
            <p className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-[#434431] leading-relaxed tracking-[1px]">
              Revolutionizing the great Indian outdoors by fostering a vibrant, responsible community
              of outdoors lovers and local wardens.
            </p>
          </div>
          <div className="relative w-full md:w-[480px] aspect-[4/3] overflow-hidden shrink-0">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/about/tent-stars.jpg"
              alt="Camping under stars"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        </div>

        {/* Mission */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-12">
          <div className="flex-1">
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[36px] md:text-[48px] font-bold text-[#434431] tracking-[2px] uppercase mb-4">
              Mission
            </h2>
            <hr className="w-12 border-t-2 border-[#C9B29D] mb-4" />
            <p className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-[#434431] leading-relaxed tracking-[1px]">
              To empower local communities by co-creating authentic, sustainable, and world-class
              travel experiences in India. From adventure and cultural immersion to wellness and pure
              fun, we aim to redefine travel through meaningful connections, and unforgettable
              journeys.
            </p>
          </div>
          <div className="relative w-full md:w-[480px] aspect-[4/3] overflow-hidden shrink-0">
            <Image
              src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/about/mossy-tree.jpg"
              alt="Nature connection"
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 480px"
            />
          </div>
        </div>
      </section>

      {/* Team - Cream background */}
      <section className="bg-[#FFE9CF] px-5 md:px-10 py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] tracking-[2px] uppercase text-center mb-3">
            Meet Our Team
          </h2>
          <div className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-[#434431] text-center max-w-[600px] mx-auto mb-12 tracking-[1px] leading-relaxed space-y-4">
            <p>
              We&apos;re a bunch of travel enthusiasts who&apos;ve spent years exploring the globe
              and boardrooms alike. Some locals while others city rats, we share a love for
              adventure, nature, and all the thrills and spills that come with it.
            </p>
            <p>
              After dominating the youth travel scene in India for over a decade, we decided to join
              forces again and shake things up with Refuje. Our mission? To bring ridiculously cool,
              world-class travel experiences to our beloved India.
            </p>
            <p>
              We want to make travel sustainable, professional, fun, and empowering for everyone
              involved&mdash;locals and travelers alike. So, join us on this wild adventure and
              let&apos;s change the face of travel together!
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-[900px] mx-auto">
            {team.map((member) => (
              <div key={member.name} className="bg-[#434431] p-6 text-center">
                <div className="relative w-[120px] h-[120px] mx-auto mb-4 rounded-full overflow-hidden">
                  <Image
                    src={member.image}
                    alt={member.name}
                    fill
                    className="object-cover"
                    sizes="120px"
                  />
                </div>
                <Image
                  src={member.badge}
                  alt=""
                  width={40}
                  height={40}
                  className="mx-auto mb-3"
                />
                <h3 className="font-[family-name:var(--font-biorhyme)] text-[20px] md:text-[24px] font-bold text-[#FFF4E8] tracking-[0.6px]">
                  {member.name}
                </h3>
                <p className="font-[family-name:var(--font-brinnan)] text-[10px] text-[#FFF4E8] tracking-[2px] mb-3">
                  &ldquo;{member.alias}&rdquo;
                </p>
                <p className="font-[family-name:var(--font-brinnan)] text-[11px] text-[#FFF4E8] leading-relaxed tracking-[0.5px]">
                  {member.bio}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 md:px-10 py-12 md:py-20 text-center max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[28px] md:text-[38px] font-bold text-[#434431] mb-3">
          Join Our Journey
        </h2>
        <p className="font-[family-name:var(--font-brinnan)] text-[24px] md:text-[32px] font-bold text-[#434431] mb-4">
          Become part of our story
        </p>
        <hr className="w-16 border-t-2 border-[#C9B29D] mx-auto mb-6" />
        <p className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-[#434431] max-w-[600px] mx-auto mb-8 leading-relaxed tracking-[1px]">
          The Refuje family is always growing. Whether you&apos;re an experienced mountain guide with
          local knowledge, a sustainability champion, or simply someone whose heart beats faster at
          the thought of meaningful adventure, we invite you to explore how your unique gifts might
          contribute to our mission. Discover current opportunities, partnership possibilities, and
          ways to support our community initiatives &mdash; because the most beautiful paths are
          those we walk together.
        </p>
        <a
          href="https://form.typeform.com/to/ejBRMwW6"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block font-[family-name:var(--font-brinnan)] text-[18px] md:text-[22px] font-bold text-[#FFE9CF] bg-[#BA6000] px-8 py-3 rounded-sm hover:bg-[#A05000] transition-colors tracking-[1px] uppercase"
        >
          Email Us
        </a>
      </section>
    </>
  );
}
