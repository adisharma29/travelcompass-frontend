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
    bio: "Kullu-Shimla kid turned Himalayan fixer. Rajesh spent years building hostels and homestays with local families, chefs, and curious travelers - stays that felt personal, not packaged. He believes tourism should humanize, not extract. Now he is building Refuje to help people rediscover wonder in outdoors.",
  },
  {
    name: "Ajay Negi",
    role: "The OG Local",
    image:
      "https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/395c1209-c0f9-4692-9599-187d5e2e8c87.webp?resize=300%2C300&ssl=1",
    bio: "Kinnauri boy who came back home after IIM Calcutta. Ajay spent his early years co-creating with village partners - proof that local is the experience - and building across Himachal and Ladakh. Belief system: locals first, always. In Refuje, he is building a platform with local communities for shared growth.",
  },
] as const;

export default function AboutPage() {
  return (
    <>
      <section className="relative overflow-hidden bg-black">
        <div className="relative h-[360px] md:h-[560px]">
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
          <div className="absolute inset-0 bg-black/45" />
          <div className="absolute inset-x-0 bottom-6 flex flex-col items-center px-4 text-center md:bottom-10">
            <h1 className="font-[family-name:var(--font-biorhyme)] text-[30px] uppercase tracking-[0.08em] text-[#f6ebda] md:text-[62px] md:tracking-[0.1em]">
              About Us
            </h1>
            <svg
              className="mt-3 h-5 w-5 text-[#f6ebda] md:mt-4 md:h-6 md:w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
              aria-hidden="true"
            >
              <path d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 py-9 text-center md:px-10 md:py-16">
        <div className="mx-auto max-w-[980px]">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[18px] leading-[1.55] text-[#434431] md:text-[31px] md:leading-[1.35]">
            At Refuje, we craft authentic, sustainable travel experiences that reconnect you
            with the simple, forgotten joys of life.
          </h2>
          <p className="mx-auto mt-4 max-w-[860px] font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.7] text-[#5a5b45] md:mt-5 md:text-[14px] md:leading-[1.75]">
            Our curated, unhurried journeys blend nature, adventure, culture, and
            mindfulness - offering a &quot;Refuje&quot; from everyday life and nurturing a deeper
            sense of wonder and connection.
          </p>
          <Link
            href="/life-at-refuje"
            className="mt-6 inline-flex items-center justify-center bg-[#b26214] px-5 py-2 font-[family-name:var(--font-brinnan)] text-[10px] uppercase tracking-[0.12em] text-[#f8e9d5] transition-colors hover:bg-[#9a530f] md:mt-7 md:px-8 md:py-2.5 md:text-[11px]"
          >
            Life @Refuje
          </Link>
        </div>
      </section>

      <section className="bg-[#efe7dd]">
        <div className="grid md:grid-cols-2">
          <div className="relative h-[260px] md:h-[520px]">
            <Image
              src="https://i0.wp.com/refuje.com/wp-content/uploads/2025/11/refuje-10.jpg?fit=1536%2C2048&ssl=1"
              alt="Vision"
              fill
              unoptimized
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
          <div className="flex items-center justify-center bg-[#c9b29d] px-8 py-12 text-center md:px-16">
            <div className="max-w-[420px]">
              <h3 className="font-[family-name:var(--font-biorhyme)] text-[34px] uppercase tracking-[0.06em] text-[#f4e7d6] md:text-[55px]">
                Vision
              </h3>
              <div className="mx-auto mt-3 h-px w-20 bg-[#ece0d2]/80 md:mt-4" />
              <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.75] text-[#5f4e3f] md:text-[13px] md:leading-[1.8]">
                Revolutionizing the great Indian outdoors by fostering a vibrant,
                responsible community of outdoors lovers and local wardens.
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2">
          <div className="flex items-center justify-center bg-[#c9b29d] px-8 py-12 text-center md:order-1 md:px-16">
            <div className="max-w-[430px]">
              <h3 className="font-[family-name:var(--font-biorhyme)] text-[34px] uppercase tracking-[0.06em] text-[#f4e7d6] md:text-[55px]">
                Mission
              </h3>
              <div className="mx-auto mt-3 h-px w-20 bg-[#ece0d2]/80 md:mt-4" />
              <p className="mt-4 font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.75] text-[#5f4e3f] md:text-[13px] md:leading-[1.8]">
                To empower local communities by co-creating authentic, sustainable, and
                world-class travel experiences in India. From adventure and cultural
                immersion to wellness and pure fun, we aim to redefine travel through
                meaningful connections, and unforgettable journeys.
              </p>
            </div>
          </div>
          <div className="relative h-[260px] md:order-2 md:h-[520px]">
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
      </section>

      <section className="relative h-[170px] overflow-hidden md:h-[260px]">
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
          <p className="max-w-[780px] font-[family-name:var(--font-biorhyme)] text-[15px] italic leading-[1.45] text-[#f6ebda] md:text-[29px]">
            &ldquo;The real voyage of discovery consists not in seeking new landscapes, but in
            having new eyes&rdquo;
          </p>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 py-10 md:px-10 md:py-16">
        <div className="mx-auto max-w-[980px] text-center">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[27px] uppercase tracking-[0.08em] text-[#434431] md:text-[44px]">
            Meet Our Team
          </h2>
          <div className="mx-auto mt-3 max-w-[900px] space-y-3 font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.75] text-[#5e5f45] md:mt-5 md:text-[13px] md:leading-[1.85]">
            <p>
              We are a bunch of travel enthusiasts who have spent years exploring the globe
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
              adventure and let us change the face of travel together.
            </p>
          </div>

          <div className="mx-auto mt-12 grid max-w-[920px] gap-12 md:grid-cols-2 md:gap-10">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="relative bg-[#7b8056] px-5 pb-7 pt-[84px] text-center md:px-8 md:pb-10 md:pt-[96px]"
              >
                <div className="absolute left-1/2 top-0 h-[114px] w-[114px] -translate-x-1/2 -translate-y-1/2 md:h-[134px] md:w-[134px]">
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

                <h3 className="font-[family-name:var(--font-biorhyme)] text-[29px] uppercase tracking-[0.02em] text-[#f6ebda] md:text-[36px]">
                  {member.name}
                </h3>
                <p className="mt-1 font-[family-name:var(--font-brinnan)] text-[10px] uppercase tracking-[0.11em] text-[#ebe0d2] md:text-[11px]">
                  {member.role}
                </p>
                <p className="mx-auto mt-4 max-w-[340px] font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.75] text-[#ece4d8] md:text-[12px] md:leading-[1.85]">
                  {member.bio}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 pb-14 pt-4 text-center md:px-10 md:pb-20 md:pt-8">
        <div className="mx-auto max-w-[940px]">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[27px] uppercase tracking-[0.08em] text-[#434431] md:text-[44px]">
            Join Our Journey
          </h2>
          <p className="mt-2 font-[family-name:var(--font-biorhyme)] text-[15px] italic text-[#545641] md:text-[22px]">
            Become part of our story
          </p>
          <div className="mx-auto mt-4 h-px w-24 bg-[#bda995]" />
          <p className="mx-auto mt-5 max-w-[860px] font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.75] text-[#5e5f45] md:text-[13px] md:leading-[1.85]">
            The Refuje family is always growing. Whether you are an experienced mountain
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
            className="mt-7 inline-flex items-center justify-center bg-[#b26214] px-6 py-2 font-[family-name:var(--font-brinnan)] text-[10px] uppercase tracking-[0.12em] text-[#f8e9d5] transition-colors hover:bg-[#9a530f] md:px-9 md:py-2.5 md:text-[11px]"
          >
            Email Us
          </a>
        </div>
      </section>
    </>
  );
}
