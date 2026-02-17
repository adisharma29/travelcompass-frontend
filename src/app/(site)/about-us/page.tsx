import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "About Refuje | Luxe Travel Experiences in Himalayas",
  description:
    "At Refuje, we craft authentic, sustainable travel experiences that reconnect you with the simple, forgotten joys of life.",
};

const teamMembers = [
  {
    name: "Rajesh Thakur",
    role: "The Bold Monk",
    image:
      "https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/471ea7e5-6a8f-4726-a9e5-7144556aaaab.webp?resize=300%2C300&ssl=1",
    bio: "Kullu-Shimla kid turned Himalayan fixer. Rajesh spent years building hostels and homestays with local families, chefs, and curious travelers - stays that felt personal, not packaged. He believes tourism should humanize, not extract. Now he's building Refuje to help people rediscover wonder in outdoors.",
  },
  {
    name: "Ajay Negi",
    role: "The OG Local",
    image:
      "https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/395c1209-c0f9-4692-9599-187d5e2e8c87.webp?resize=300%2C300&ssl=1",
    bio: "Kinnauri boy who came back home after IIM Calcutta! Ajay spent his early years co-creating with village partners - proof that \"local\" is the experience and building across Himachal and Ladakh. Belief system: locals first, always. In Refuje, he's building a platform with local communities for shared growth.",
  },
] as const;

const sectionTitleClass =
  "font-[family-name:var(--font-biorhyme)] text-[22px] font-bold uppercase tracking-[0.06em] text-[#434431] md:text-[38px]";

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-[#1d1d17]">
        <div className="relative h-[100svh] md:h-[100svh]">
          <Image
            src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/DSCF1071-2.jpg?fit=2048%2C1365&ssl=1"
            alt="About Refuje"
            fill
            priority
            unoptimized
            className="hidden object-cover md:block"
            sizes="100vw"
          />
          <Image
            src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/DSCF1071-2-1-e1763404418831.jpg?fit=890%2C1280&ssl=1"
            alt="About Refuje"
            fill
            priority
            unoptimized
            className="object-cover md:hidden"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/58 via-black/36 to-black/18" />
          <div className="absolute inset-0 flex flex-col items-center justify-end px-4 pb-20 text-center md:pb-11">
            <h1 className="font-[family-name:var(--font-biorhyme)] text-[32px] font-bold uppercase tracking-[0.09em] text-[#f6ebda] md:text-[36px] md:tracking-[0.07em] lg:text-[40px]">
              About Us
            </h1>
            <p className="mt-1 font-[family-name:var(--font-brinnan)] text-[12px] uppercase tracking-[0.15em] text-[#f6ebda]/95 md:mt-2 md:text-[12px]">
              Who We Are
            </p>
            <a
              href="#about-intro"
              aria-label="Scroll to about introduction"
              className="mt-4 block w-fit text-[#f6ebda] transition-colors hover:text-white md:mt-4"
            >
              <svg
                className="h-6 w-6 md:h-7 md:w-7"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
                aria-hidden="true"
              >
                <path d="M19 9l-7 7-7-7" />
              </svg>
            </a>
          </div>
        </div>
      </section>

      <section id="about-intro" className="bg-[#efe7dd] px-5 py-12 text-center md:px-10 md:py-20">
        <div className="mx-auto max-w-[1120px]">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] leading-[1.38] text-[#434431] md:text-[38px] md:leading-[1.3]">
            At Refuje, we craft authentic, sustainable travel experiences that reconnect you
            with the simple, forgotten joys of life.
          </h2>
          <div className="mx-auto mt-5 h-px w-44 bg-[#c7baa9] md:mt-7 md:w-72" />
          <p className="mx-auto mt-5 max-w-[1000px] font-[family-name:var(--font-brinnan)] text-[14px] leading-[1.7] text-[#5a5b45] md:mt-7 md:text-[15px] md:leading-[1.75]">
            Our curated, unhurried journeys blend nature, adventure, culture, and
            mindfulness - offering a &apos;Refuje&apos; from everyday life and nurturing a deeper
            sense of wonder and connection.
          </p>
          <Link
            href="/life-at-refuje"
            className="mt-7 inline-flex items-center justify-center border border-[#a45e1a] bg-[#b26214] px-6 py-2.5 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.14em] text-[#f8e9d5] transition-colors hover:bg-[#9a530f] md:mt-8 md:px-8 md:py-3 md:text-[17px]"
          >
            Life @Refuje
          </Link>
        </div>
      </section>

      <section className="bg-[#efe7dd]">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid md:grid-cols-2">
            <div className="relative order-1 h-[300px] md:h-[560px]">
              <Image
                src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/refuje-10.jpg?fit=1536%2C2048&ssl=1"
                alt="Vision"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
            <div className="order-2 flex items-center justify-center bg-[#c9b29d] px-8 py-14 text-center md:px-20">
              <div className="max-w-[440px]">
                <h3 className="font-[family-name:var(--font-biorhyme)] text-[34px] font-bold uppercase tracking-[0.07em] text-[#f4e7d6] md:text-[38px]">
                  Vision
                </h3>
                <div className="mx-auto mt-4 h-px w-24 bg-[#ece0d2]/80 md:mt-5" />
                <p className="mt-5 font-[family-name:var(--font-brinnan)] text-[13px] leading-[1.75] text-[#5f4e3f] md:text-[15px] md:leading-[1.8]">
                  Revolutionizing the great Indian outdoors by fostering a vibrant,
                  responsible community of outdoors lovers and local wardens.
                </p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2">
            <div className="order-2 flex items-center justify-center bg-[#c9b29d] px-8 py-14 text-center md:order-1 md:px-20">
              <div className="max-w-[460px]">
                <h3 className="font-[family-name:var(--font-biorhyme)] text-[34px] font-bold uppercase tracking-[0.07em] text-[#f4e7d6] md:text-[38px]">
                  Mission
                </h3>
                <div className="mx-auto mt-4 h-px w-24 bg-[#ece0d2]/80 md:mt-5" />
                <p className="mt-5 font-[family-name:var(--font-brinnan)] text-[13px] leading-[1.75] text-[#5f4e3f] md:text-[15px] md:leading-[1.8]">
                  To empower local communities by co-creating authentic, sustainable, and
                  world-class travel experiences in India. From adventure and cultural
                  immersion to wellness and pure fun, we aim to redefine travel through
                  meaningful connections, and unforgettable journeys.
                </p>
              </div>
            </div>
            <div className="relative order-1 h-[300px] md:order-2 md:h-[560px]">
              <Image
                src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/refuje-15-e1763402452377.jpg?fit=1310%2C1310&ssl=1"
                alt="Mission"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="relative h-[210px] overflow-hidden md:h-[300px]">
        <Image
          src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/XT051752.jpg?fit=2048%2C1152&ssl=1"
          alt="Mountain landscape"
          fill
          unoptimized
          className="object-cover"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-[#2e3d53]/45" />
        <div className="absolute inset-0 flex items-center justify-center px-6 text-center">
          <p className="max-w-[840px] font-[family-name:var(--font-biorhyme)] text-[18px] italic leading-[1.4] text-[#f6ebda] md:text-[24px]">
            &ldquo;The real voyage of discovery consists not in seeking new landscapes, but in
            having new eyes&rdquo;
          </p>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 py-12 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1040px] text-center">
          <h2 className={sectionTitleClass}>Meet Our Team</h2>
          <div className="mx-auto mt-4 max-w-[930px] space-y-4 font-[family-name:var(--font-brinnan)] text-[14px] leading-[1.8] text-[#5e5f45] md:mt-6 md:text-[16px] md:leading-[1.86]">
            <p>
              We&apos;re a bunch of travel enthusiasts who&apos;ve spent years exploring the globe
              and boardrooms alike. Some locals while others city rats, we share a love for
              adventure, nature, and all the thrills and spills that come with it.
            </p>
            <p>
              After dominating the youth travel scene in India for over a decade, we decided
              to join forces again and shake things up with Refuje. Our mission? To bring
              ridiculously cool, world-class travel experiences to our beloved India.
            </p>
            <p>
              We want to make travel sustainable, professional, fun, and empowering for
              everyone involved - locals and travelers alike. So, join us on this wild
              adventure and let&apos;s change the face of travel together.
            </p>
          </div>

          <div className="mx-auto mt-24 grid max-w-[980px] gap-14 md:mt-28 md:grid-cols-2 md:gap-10">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="relative rounded-[6px] border border-white/25 bg-[#7b8056] px-6 pb-8 pt-[90px] text-center shadow-[0_12px_24px_rgba(54,57,35,0.22)] md:px-8 md:pb-10 md:pt-[100px]"
              >
                <div className="absolute left-1/2 top-0 h-[120px] w-[120px] -translate-x-1/2 -translate-y-[40%] md:h-[140px] md:w-[140px] md:-translate-y-[40%]">
                  <div className="absolute inset-0 rounded-full bg-[#be7228]" />
                  <div className="absolute inset-[8px] overflow-hidden rounded-full border-[4px] border-[#f1e6d8]">
                    <Image
                      src={member.image}
                      alt={member.name}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="140px"
                    />
                  </div>
                </div>

                <Image
                  src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/07/shoe.png?fit=97%2C97&ssl=1"
                  alt=""
                  aria-hidden="true"
                  width={38}
                  height={30}
                  unoptimized
                  className="absolute right-5 top-5 opacity-90 md:right-7 md:top-6"
                />

                <h3 className="font-[family-name:var(--font-biorhyme)] text-[28px] font-bold uppercase tracking-[0.03em] text-[#f6ebda] md:text-[30px]">
                  {member.name}
                </h3>
                <p className="mt-1 font-[family-name:var(--font-brinnan)] text-[12px] uppercase tracking-[0.12em] text-[#ebe0d2] md:text-[13px]">
                  {member.role}
                </p>
                <p className="mx-auto mt-5 max-w-[360px] font-[family-name:var(--font-brinnan)] text-[13px] leading-[1.75] text-[#ece4d8] md:text-[14px] md:leading-[1.82]">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 pb-16 pt-4 text-center md:px-10 md:pb-24 md:pt-8">
        <div className="mx-auto max-w-[980px]">
          <h2 className={sectionTitleClass}>Join Our Journey</h2>
          <p className="mt-3 font-[family-name:var(--font-biorhyme)] text-[16px] italic text-[#545641] md:text-[22px]">
            Become part of our story
          </p>
          <div className="mx-auto mt-5 h-px w-24 bg-[#bda995]" />
          <p className="mx-auto mt-6 max-w-[900px] font-[family-name:var(--font-brinnan)] text-[14px] leading-[1.8] text-[#5e5f45] md:text-[16px] md:leading-[1.86]">
            The Refuje family is always growing. Whether you&apos;re an experienced mountain
            guide with local knowledge, a sustainability champion, or simply someone whose
            heart beats faster at the thought of meaningful adventure, we invite you to
            explore how your unique gifts might contribute to our mission. Discover current
            opportunities, partnership possibilities, and ways to support our community
            initiatives - because the most beautiful paths are those we walk together.
          </p>
          <a
            href="https://form.typeform.com/to/ejBRMwW6"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center justify-center border border-[#a45e1a] bg-[#b26214] px-7 py-2.5 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.14em] text-[#f8e9d5] transition-colors hover:bg-[#9a530f] md:px-10 md:py-3 md:text-[13px]"
          >
            EMAIL US
          </a>
        </div>
      </section>
    </>
  );
}
