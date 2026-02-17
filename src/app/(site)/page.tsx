import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ImageGallery } from "@/components/site/ImageGallery";
import { TestimonialsCarousel } from "@/components/site/TestimonialsCarousel";
import { HeroVideo } from "@/components/site/HeroVideo";

export const metadata: Metadata = {
  title: "Refuje | Luxe Offbeat Travel Experiences",
  description:
    "Refuje offers luxury offbeat travel experiences and adventures in the Indian Himalayas: cycling, ebiking, stargazing, orchard food tastings and more.",
};

const INSTAGRAM_PROFILE_URL = "https://instagram.com/refuje.travel";

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
    author: "Jitender Jagta",
    initial: "J",
    text: "Amazing !!!! Perfect place to be. Looking forward with excitement and anticipation. Go for it folks",
  },
  {
    author: "Arpit Verma",
    initial: "A",
    text: "Away from the fast paced, noise, and pollution free cities, Refuje is the best place to find a refuge nowadays.",
  },
  {
    author: "Divya Tharangzak",
    initial: "D",
    text: "Telangi kanda is a beautiful, calm and serene place - perfect to unwind and escape the noise of everyday life. It's peaceful, relaxing and truly refreshing.\n\nIf you want to relax and recharge, then this experience is absolutely for you.",
  },
  {
    author: "Ishikha Agarwal",
    initial: "I",
    text: "We visited Telangi Kanda and breathtaking scenery and a serene atmosphere make this mountainous destination a must-visit. The snow-capped peaks create a stunning backdrop for nature lovers and photographers alike. The tranquility of the surroundings is perfect for those seeking a peaceful escape from city life. They also gave us binoculars, allowing us to gaze at the mountains. The sundowner was remarkable. Highly recommend for people who want to spend quality and peaceful time with their loved ones.",
  },
  {
    author: "Chander S. Chauhan",
    initial: "C",
    text: "I'm 55 years old and recently did a cycling activity with Refuje, and it was an absolutely amazing experience. The staff was extremely professional, friendly, and supportive throughout. The electric pedal-assist cycles made the ride smooth and effortless, and I was able to enjoy the entire route comfortably and confidently. Everything was perfectly organized, and I truly had a delightful time. Highly recommended!",
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
    description: "Don't just visit-contribute. Respect culture. Share space.",
  },
  {
    icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/starry-sky.png",
    title: "Stay A Little Wild",
    description: "Great stories begin with a little adventure.",
  },
];

const fallbackSocialPhotos = [
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-1.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-2.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-3.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/ride-into-stillness/gallery-4.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/calm-circuit/gallery-1.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/calm-circuit/gallery-2.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/sundowner/gallery-1.jpg",
  "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/experiences/sundowner/gallery-2.jpg",
];

type InstagramApiMedia = {
  id: string;
  caption?: string;
  media_type: "IMAGE" | "VIDEO" | "CAROUSEL_ALBUM";
  media_url?: string;
  thumbnail_url?: string;
  permalink?: string;
};

type InstagramApiResponse = {
  data?: InstagramApiMedia[];
};

type SocialFeedItem = {
  id: string;
  imageUrl: string;
  permalink: string;
  alt: string;
};

function getFallbackSocialFeed(): SocialFeedItem[] {
  return fallbackSocialPhotos.slice(0, 4).map((imageUrl, index) => ({
    id: `fallback-${index + 1}`,
    imageUrl,
    permalink: INSTAGRAM_PROFILE_URL,
    alt: `Instagram post ${index + 1}`,
  }));
}

async function getInstagramFeed(limit = 4): Promise<SocialFeedItem[]> {
  const maxItems = Math.min(Math.max(limit, 2), 4);

  const mapGraphFeed = (payload: InstagramApiResponse): SocialFeedItem[] =>
    (payload.data ?? [])
      .map((post): SocialFeedItem | null => {
        const imageUrl = post.media_type === "VIDEO" ? post.thumbnail_url : post.media_url;
        if (!imageUrl || !post.permalink) return null;

        const alt = post.caption?.replace(/\s+/g, " ").trim() || "Instagram post";
        return {
          id: post.id,
          imageUrl,
          permalink: post.permalink,
          alt: alt.slice(0, 120),
        };
      })
      .filter((post): post is SocialFeedItem => Boolean(post))
      .slice(0, maxItems);

  const accessToken = process.env.INSTAGRAM_ACCESS_TOKEN?.trim();
  if (accessToken) {
    const graphEndpoint = new URL("https://graph.instagram.com/me/media");
    graphEndpoint.searchParams.set(
      "fields",
      "id,caption,media_type,media_url,thumbnail_url,permalink,timestamp"
    );
    graphEndpoint.searchParams.set("limit", String(maxItems));
    graphEndpoint.searchParams.set("access_token", accessToken);

    try {
      const response = await fetch(graphEndpoint.toString(), { next: { revalidate: 300 } });
      if (response.ok) {
        const payload = (await response.json()) as InstagramApiResponse;
        const graphFeed = mapGraphFeed(payload);
        if (graphFeed.length >= 2) return graphFeed;
      } else {
        console.error(`Instagram Graph API fetch failed: ${response.status}`);
      }
    } catch (error) {
      console.error("Instagram Graph API fetch error:", error);
    }
  }

  return getFallbackSocialFeed();
}

export default async function HomePage() {
  const leadCategory = categories[0];
  const sideCategories = categories.slice(1);
  const instagramFeed = await getInstagramFeed(4);
  const socialFeed = instagramFeed;

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
        href="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/hero-desktop-poster.webp"
      />

      <section className="relative h-[100svh] overflow-hidden bg-[#2f3032]">
        <HeroVideo
          src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/videos/site/home/hero-desktop.mp4"
          poster="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/hero-desktop-poster.webp"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/45" />
        <a
          href="#intro"
          aria-label="Scroll to introduction"
          className="absolute bottom-6 left-1/2 z-10 -translate-x-1/2 text-white/80 transition-colors hover:text-white md:bottom-10"
        >
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path d="M19 9l-7 7-7-7" />
          </svg>
        </a>
      </section>

      <section id="intro" className="bg-[#efe7dd] px-5 py-10 text-center md:px-10 md:py-20">
        <div className="mx-auto max-w-[1272px]">
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[26px] font-bold uppercase tracking-[0.1em] text-[#434431] md:text-[38px] md:tracking-[0.08em]">
            Luxury Offbeat Travel
          </h1>
          <p className="mx-auto mt-4 max-w-[980px] font-[family-name:var(--font-brinnan)] text-[14px] leading-[1.6] tracking-[0.01em] text-[#5e5f45] md:text-[21px]">
            Discover authentic experiences and activities in the Himalayas through mindful
            adventures that reconnect you with nature and yourself.
          </p>
          <Link
            href="/about-us"
            className="mt-5 inline-block border border-[#a45e1a] bg-[#b26214] px-5 py-2 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.14em] text-[#f8e9d5] transition-colors hover:bg-[#9a530f] md:mt-8 md:px-8 md:py-3 md:text-[17px]"
          >
            Explore More
          </Link>
        </div>
      </section>

      <section id="experiences" className="bg-[#efe7dd] px-5 py-8 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1272px]">
          <h2 className="text-center font-[family-name:var(--font-biorhyme)] text-[20px] font-bold uppercase tracking-[0.12em] text-[#434431] md:text-[40px] md:tracking-[0.08em]">
            Experiences
          </h2>
          <p className="mx-auto mt-3 max-w-[1020px] text-center font-[family-name:var(--font-brinnan)] text-[13px] leading-[1.55] tracking-[0.01em] text-[#5e5f45] md:mt-6 md:text-[20px]">
            Lie beneath starlit skies, taste local food, pluck fresh apples, discover silk
            route tales from locals, or meander through mountain countryside on an ebike to
            rediscover simple joys in the wilderness.
          </p>
          <div className="mt-4 text-center md:mt-8">
            <Link
              href="/experiences"
              className="inline-block border border-[#a45e1a] bg-[#b26214] px-4 py-2 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.14em] text-[#f8e9d5] transition-colors hover:bg-[#9a530f] md:px-8 md:py-3 md:text-[17px]"
            >
              Explore All Experiences
            </Link>
          </div>

          <div className="mt-5 space-y-2 md:hidden">
            <Link
              href={leadCategory.href}
              className="group relative block h-[344px] overflow-hidden"
            >
              <Image
                src={leadCategory.image}
                alt={leadCategory.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="100vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[#222428]/72 px-4 py-3">
                <h3 className="font-[family-name:var(--font-biorhyme)] text-[32px] font-bold uppercase tracking-[0.1em] text-white">
                  {leadCategory.title}
                </h3>
                <span className="mt-1 inline-block font-[family-name:var(--font-brinnan)] text-[12px] uppercase tracking-[0.12em] text-[#e5ddd2] underline underline-offset-2">
                  Explore More
                </span>
              </div>
            </Link>

            <div className="-mx-5 flex snap-x snap-mandatory gap-2 overflow-x-auto px-5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {sideCategories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group relative block h-[208px] min-w-[44.5vw] snap-start overflow-hidden"
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="45vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[#222428]/60 px-2.5 py-2">
                    <h3 className="font-[family-name:var(--font-biorhyme)] text-[17px] font-bold uppercase leading-[1.05] tracking-[0.06em] text-white">
                      {category.title}
                    </h3>
                    <span className="mt-1 inline-block font-[family-name:var(--font-brinnan)] text-[10px] uppercase tracking-[0.12em] text-[#e5ddd2] underline underline-offset-2">
                      {category.comingSoon ? "Coming Soon" : "Explore More"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="mt-10 hidden grid-cols-[1.15fr_1fr] gap-4 md:grid">
            <Link
              href={leadCategory.href}
              className="group relative block h-[696px] overflow-hidden"
            >
              <Image
                src={leadCategory.image}
                alt={leadCategory.title}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
                sizes="40vw"
              />
              <div className="absolute inset-x-0 bottom-0 bg-[#222428]/86 px-8 py-5">
                <h3 className="font-[family-name:var(--font-biorhyme)] text-[40px] font-bold uppercase tracking-[0.1em] text-white">
                  {leadCategory.title}
                </h3>
                <span className="mt-3 inline-block font-[family-name:var(--font-brinnan)] text-[17px] uppercase tracking-[0.14em] text-[#e5ddd2] underline underline-offset-2">
                  Explore More
                </span>
              </div>
            </Link>

            <div className="grid grid-cols-2 gap-4">
              {sideCategories.map((category) => (
                <Link
                  key={category.title}
                  href={category.href}
                  className="group relative block h-[340px] overflow-hidden"
                >
                  <Image
                    src={category.image}
                    alt={category.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="20vw"
                  />
                  <div className="absolute inset-x-0 bottom-0 bg-[#222428]/86 px-5 py-3">
                    <h3 className="font-[family-name:var(--font-biorhyme)] text-[22px] font-bold uppercase tracking-[0.07em] text-white">
                      {category.title}
                    </h3>
                    <span className="mt-1 inline-block font-[family-name:var(--font-brinnan)] text-[13px] uppercase tracking-[0.12em] text-[#e5ddd2] underline underline-offset-2">
                      {category.comingSoon ? "Coming Soon" : "Explore More"}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="signature" className="bg-[#efe7dd] px-5 py-8 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1272px]">
          <h2 className="text-center font-[family-name:var(--font-biorhyme)] text-[20px] font-bold uppercase tracking-[0.12em] text-[#434431] md:text-[40px] md:tracking-[0.08em]">
            Signature Experiences
          </h2>
          <div className="-mx-5 mt-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden md:mx-0 md:mt-10 md:grid md:grid-cols-3 md:gap-8 md:overflow-visible md:px-0 md:pb-0">
            {signatureExperiences.map((experience) => (
              <Link
                key={experience.slug}
                href={`/experience/${experience.slug}`}
                className="group flex min-w-[84vw] flex-col overflow-hidden bg-[#f8f5ef] md:min-w-0"
              >
                <div className="relative h-[210px] md:h-[420px]">
                  <Image
                    src={experience.image}
                    alt={experience.title}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 84vw, 32vw"
                  />
                </div>
                <div className="flex flex-1 flex-col space-y-2 px-4 pb-5 pt-4 md:space-y-2 md:px-6 md:pb-8 md:pt-6">
                  <p className="font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.12em] text-[#6f7055] md:text-[13px]">
                    {experience.location}
                  </p>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3 md:min-h-[4.2rem]">
                    <h3 className="font-[family-name:var(--font-biorhyme)] text-[24px] font-bold leading-[1.08] text-[#434431] md:text-[30px] md:leading-[1.1]">
                      {experience.title}
                    </h3>
                    <div className="w-[88px] shrink-0 text-right md:w-[110px]">
                      <p className="font-[family-name:var(--font-brinnan)] text-[12px] leading-[1.15] text-[#434431] md:text-[14px]">
                        {experience.price.replace(/onwards?/i, "").trim()}
                      </p>
                      <p className="font-[family-name:var(--font-brinnan)] text-[11px] text-[#7d7f59] md:text-[13px]">
                        onwards
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.11em] text-[#6f7055] md:text-[13px]">
                    {experience.duration}
                  </p>
                  <p className="line-clamp-3 min-h-[3.3rem] font-[family-name:var(--font-brinnan)] text-[13px] leading-[1.45] text-[#5f5f4c] md:min-h-[2.8rem] md:text-[14px] md:leading-[1.6]">
                    {experience.description}
                  </p>
                  <span className="mt-auto inline-block self-start bg-[#b26214] px-4 py-2 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.1em] text-[#f7e8d4] md:px-4 md:py-2 md:text-[13px]">
                    View More
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 pb-2 pt-8 text-center md:px-10 md:pb-4 md:pt-20">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold uppercase tracking-[0.12em] text-[#434431] md:text-[40px] md:tracking-[0.08em]">
          Video Gallery
        </h2>
      </section>

      <section className="relative h-[257px] overflow-hidden bg-[#4d4e53] md:h-[600px]">
        <video
          controls
          playsInline
          preload="metadata"
          className="h-full w-full object-cover"
        >
          <source
            src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/videos/site/home/midpage.mp4"
            type="video/mp4"
          />
        </video>
      </section>

      <section className="bg-[#efe7dd] px-5 py-8 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1272px] rounded-[24px] border border-[#d8ccb8] bg-[linear-gradient(180deg,#f4ece0_0%,#efe7dd_100%)] p-5 md:rounded-[36px] md:p-10">
          <h2 className="text-center font-[family-name:var(--font-biorhyme)] text-[20px] font-bold uppercase tracking-[0.12em] text-[#434431] md:text-[40px] md:tracking-[0.08em]">
            The Refuje Way
          </h2>
          <p className="mt-1 text-center font-[family-name:var(--font-biorhyme)] text-[16px] text-[#5b5c45] md:mt-2 md:text-[34px]">
            Our Ethos, Your Compass
          </p>
          <p className="mx-auto mt-3 max-w-[840px] text-center font-[family-name:var(--font-brinnan)] text-[13px] leading-[1.5] text-[#686a52] md:mt-4 md:text-[17px] md:leading-[1.65]">
            These are not just values on paper. They define how we design every route, every pause,
            and every interaction in the mountains.
          </p>

          <div className="mt-6 grid grid-cols-2 gap-3 md:mt-10 md:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {ethosItems.map((item, i) => (
              <article
                key={item.title}
                className={`relative flex flex-col items-center rounded-[16px] px-3.5 py-4 text-center text-[#f6ebda] shadow-[0_10px_24px_rgba(67,68,49,0.18)] md:min-h-[250px] md:rounded-[24px] md:px-6 md:py-7 ${
                  i % 2 === 0 ? "bg-[#727a50] lg:-translate-y-3" : "bg-[#616944] lg:translate-y-3"
                }`}
              >
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={96}
                  height={96}
                  className="h-12 w-12 object-contain md:h-20 md:w-20 md:rounded-full md:bg-[#6f7450] md:p-3.5"
                />
                <hr className="my-2 border-white/25 md:my-4" />
                <h3 className="text-center font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.1em] md:text-[18px] md:tracking-[0.06em]">
                  {item.title}
                </h3>
                <p className="mt-1.5 line-clamp-3 text-center font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.4] text-[#f1e8d7] md:mt-3 md:text-[15px] md:leading-[1.5]">
                  {item.description}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 py-8 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1272px]">
          <h2 className="text-center font-[family-name:var(--font-biorhyme)] text-[20px] font-bold uppercase tracking-[0.12em] text-[#434431] md:text-[40px] md:tracking-[0.08em]">
            Gallery
          </h2>
          <div className="mt-4 md:mt-8">
            <ImageGallery />
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 py-8 md:px-10 md:py-20">
        <div className="mx-auto max-w-[1272px]">
          <h2 className="text-center font-[family-name:var(--font-biorhyme)] text-[20px] font-bold uppercase tracking-[0.12em] text-[#434431] md:text-[40px] md:tracking-[0.08em]">
            Testimonials
          </h2>
          <p className="mt-1 text-center font-[family-name:var(--font-biorhyme)] text-[14px] text-[#5b5c45] md:mt-3 md:text-[30px]">
            Hear what our explorers have to say!
          </p>

          <div className="mt-4 md:mt-10">
            <TestimonialsCarousel testimonials={testimonials} />
          </div>
        </div>
      </section>

      <section className="bg-[#efe7dd] py-5 text-center md:py-14">
        <p className="font-[family-name:var(--font-brinnan)] text-[12px] uppercase tracking-[0.16em] text-[#5d5d48] md:text-[20px]">
          Follow Us On
        </p>
        <a
          href={INSTAGRAM_PROFILE_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1 inline-block font-[family-name:var(--font-biorhyme)] text-[26px] font-bold text-[#434431] transition-colors hover:text-[#a45e1a] md:mt-2 md:text-[40px]"
        >
          @refuje.travel
        </a>
        <div className="mt-3 md:mt-5">
          <a
            href={INSTAGRAM_PROFILE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block border border-[#a45e1a] bg-[#b26214] px-5 py-2 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.14em] text-[#f8e9d5] transition-colors hover:bg-[#9a530f] md:px-7 md:py-2.5 md:text-[14px]"
          >
            Follow
          </a>
        </div>
      </section>

      <section className="bg-[#efe7dd] px-5 pb-8 md:px-10 md:pb-16">
        <div className="mx-auto grid max-w-[1272px] grid-cols-2 gap-2 md:grid-cols-4 md:gap-4">
          {socialFeed.map((post, index) => (
            <a
              key={post.id}
              href={post.permalink}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative block aspect-square overflow-hidden bg-[#bcbcbc]"
            >
              <Image
                src={post.imageUrl}
                alt={post.alt || `Instagram post ${index + 1}`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 768px) 25vw, 22vw"
              />
              <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/20" />
            </a>
          ))}
        </div>
      </section>
    </>
  );
}
