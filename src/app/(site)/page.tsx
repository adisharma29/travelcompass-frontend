import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ExperienceCard } from "@/components/site/ExperienceCard";

export const metadata: Metadata = {
  title: "Refuje | Luxe Offbeat Travel Experiences",
  description:
    "Refuje offers luxury offbeat travel experiences and adventures in the Indian Himalayas: cycling, ebiking, stargazing, orchard food tastings and more.",
};

const categories = [
  {
    title: "E-Biking",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/ebiking.jpg",
    href: "/experiences",
  },
  {
    title: "Forest Bathing",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/forest-bathing-full.jpg",
    href: "/experiences",
  },
  {
    title: "Rhythms of the Valley",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/rhythms-full.jpg",
    href: "/experiences",
  },
  {
    title: "Exploring Tantra",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/exploring-tantra-full.jpg",
    href: "/experiences",
    comingSoon: true,
  },
  {
    title: "Celestial Slumber",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/celestial-slumber-full.jpg",
    href: "/experiences",
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
      "Community-led Holi celebration with village processions, bonfires and traditional feasts.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/sangla-holi.jpg",
  },
  {
    slug: "the-calm-circuit",
    title: "The Calm Circuit",
    location: "Shimla",
    duration: "3–4 hrs",
    price: "₹2,500 onwards",
    description: "E-bike forest loop through reserved Deodar forests to a hidden British-era reservoir.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/calm-circuit.png",
  },
  {
    slug: "ride-into-the-stillness",
    title: "Ride into the Stillness",
    location: "Shimla",
    duration: "4-5 hrs",
    price: "₹4,000 onwards",
    description: "50km supported cycling through mountain villages, orchards and pine forests.",
    image: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/home/ride-into-stillness.png",
  },
];

const testimonials = [
  {
    text: "I\u2019ve been to Shimla many times, but this cycling experience showed me a side of the mountains I had never seen. Riding through the Deodar forest felt magical, the trails were gentle, and the only sounds were birds and the wind in the trees.",
    author: "Sneha",
    location: "Mumbai",
  },
  {
    text: "It was a magical experience looking at the high mountains at the golden sunset hour. The bonfire kept us warm and the wine was delicious!",
    author: "Shivani",
    location: "Bangalore",
  },
  {
    text: "This didn\u2019t feel like attending a festival. It felt like being allowed into something that already existed. There were moments where we just walked, waited, and watched \u2014 and those ended up staying with me the longest.",
    author: "Sita",
    location: "Chennai",
  },
  {
    text: "Loved the quiet\u2014no speakers, no influencer-style setup. Just trees, shade, good food and birds singing. Staff is attentive without hovering.",
    author: "Rohan",
    location: "Delhi",
  },
  {
    text: "We did this cycling trip as a family and absolutely loved it. Everyone enjoyed the mix of smooth roads and soft gravel tracks, and the guides kept everyone comfortable throughout.",
    author: "Aarav",
    location: "Chandigarh",
  },
  {
    text: "Solo traveller review: I read for most of it and no one rushed me. Staff checked on me for coffee while I was reading in my quiet corner and later served a sumptuous, simple meal.",
    author: "Geetika",
    location: "Noida",
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
    description: "Be wild, not destructive",
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
      {/* Hero with background video */}
      <section className="relative h-[70vh] md:h-[85vh] overflow-hidden">
        {/* Desktop video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="hidden md:block absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://videos.files.wordpress.com/E0g7YQtP/img_8726.mp4"
            type="video/mp4"
          />
        </video>
        {/* Mobile video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="md:hidden absolute inset-0 w-full h-full object-cover"
        >
          <source
            src="https://videos.files.wordpress.com/Pj5hwX1j/img_8746.mp4"
            type="video/mp4"
          />
        </video>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 px-5 md:px-10 max-w-[1400px] mx-auto">
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[36px] md:text-[50px] font-bold text-white leading-tight tracking-[2px]">
            Luxury Offbeat Travel
          </h1>
          <p className="mt-3 font-[family-name:var(--font-brinnan)] text-[16px] md:text-[18px] text-white/90 max-w-[600px] leading-relaxed tracking-[1px]">
            Discover authentic experiences and activities in the Himalayas through mindful adventures
            that reconnect you with nature and yourself.
          </p>
          <Link
            href="/about-us"
            className="inline-block mt-5 font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] bg-[#FFE9CF] px-8 py-3 rounded-sm hover:bg-white transition-colors tracking-[1px] uppercase"
          >
            Explore More
          </Link>
        </div>
      </section>

      {/* Experiences Section */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[36px] font-bold text-[#434431] tracking-[2px] uppercase text-center mb-4">
          Experiences
        </h2>
        <p className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-[#434431] leading-relaxed text-center max-w-[700px] mx-auto mb-10 tracking-[0.5px]">
          Lie beneath starlit skies, taste local food, pluck fresh apples, discover silk route tales
          from locals, or meander through mountain countryside on an ebike to rediscover simple joys
          in the wilderness.
        </p>

        {/* Experience category cards grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
          {categories.map((cat) => (
            <Link
              key={cat.title}
              href={cat.comingSoon ? "#" : cat.href}
              className="group relative aspect-[3/4] md:aspect-[4/5] rounded-[15px] overflow-hidden block"
            >
              <Image
                src={cat.image}
                alt={cat.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 768px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6">
                <h3 className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[18px] font-bold text-white tracking-[1px] uppercase">
                  {cat.title}
                </h3>
                {cat.comingSoon ? (
                  <span className="inline-block mt-2 font-[family-name:var(--font-brinnan)] text-[11px] text-white/70 tracking-[1px] uppercase">
                    Coming Soon
                  </span>
                ) : (
                  <span className="inline-block mt-2 font-[family-name:var(--font-brinnan)] text-[12px] text-[#FFE9CF] tracking-[1px] uppercase group-hover:underline">
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
            className="inline-block font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] border-2 border-[#434431] px-8 py-3 rounded-sm hover:bg-[#434431] hover:text-[#FFE9CF] transition-colors tracking-[1px] uppercase"
          >
            Explore All Experiences
          </Link>
        </div>
      </section>

      {/* Signature Experiences */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[36px] font-bold text-[#434431] tracking-[2px] uppercase text-center mb-8 md:mb-12">
          Signature Experiences
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {signatureExperiences.map((exp) => (
            <ExperienceCard key={exp.slug} {...exp} />
          ))}
        </div>
      </section>

      {/* The Refuje Way */}
      <section className="bg-[#434431] px-5 md:px-10 py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[36px] font-bold text-[#FFE9CF] tracking-[2px] uppercase text-center mb-3">
            The Refuje Way
          </h2>
          <p className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#FFE9CF]/70 text-center mb-10 tracking-[1px]">
            Our Ethos, Your Compass
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
            {ethosItems.map((item) => (
              <div key={item.title} className="text-center">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={50}
                  height={50}
                  className="mx-auto mb-4"
                />
                <h3 className="font-[family-name:var(--font-brinnan)] text-[15px] font-bold text-[#FFE9CF] tracking-[1px] mb-2 uppercase">
                  {item.title}
                </h3>
                <p className="font-[family-name:var(--font-brinnan)] text-[13px] text-[#FFE9CF]/60 tracking-[0.5px]">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Video Section */}
      <section className="relative w-full overflow-hidden">
        {/* Desktop video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          controls
          className="hidden md:block w-full"
          controlsList="nodownload"
        >
          <source
            src="https://videos.files.wordpress.com/AoaKe7z9/img_8773.mp4"
            type="video/mp4"
          />
        </video>
        {/* Mobile video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          controls
          className="md:hidden w-full"
          controlsList="nodownload"
        >
          <source
            src="https://videos.files.wordpress.com/AoaKe7z9/img_8773.mp4"
            type="video/mp4"
          />
        </video>
      </section>

      {/* Video Gallery */}
      <section className="bg-[#FFF4E8] px-5 md:px-10 py-12 md:py-20">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[36px] font-bold text-[#434431] tracking-[2px] text-center mb-8">
            Video Gallery
          </h2>
          <div className="relative w-full aspect-video max-w-[900px] mx-auto rounded-[15px] overflow-hidden">
            <iframe
              src="https://www.youtube.com/embed/0jHtyF_rCqU?rel=0&controls=1"
              title="Refuje Video"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              className="absolute inset-0 w-full h-full"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="px-5 md:px-10 py-12 md:py-20 max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[36px] font-bold text-[#434431] tracking-[2px] uppercase text-center mb-3">
          Testimonials
        </h2>
        <p className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-[#434431] text-center mb-10 tracking-[0.5px]">
          Hear what our explorers have to say!
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          {testimonials.map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-[15px] p-6 shadow-sm flex flex-col"
            >
              <p className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#434431] leading-relaxed tracking-[0.5px] flex-1">
                &ldquo;{t.text}&rdquo;
              </p>
              <div className="mt-4 pt-4 border-t border-[#C9B29D]/30">
                <p className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] tracking-[0.5px]">
                  {t.author}
                </p>
                <p className="font-[family-name:var(--font-brinnan)] text-[12px] text-[#7C7B55] tracking-[0.5px]">
                  {t.location}
                </p>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center">
          <a
            href="https://instagram.com/refuje.travel"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-white bg-[#434431] px-8 py-3 rounded-sm hover:bg-[#333] transition-colors tracking-[1px]"
          >
            Follow Us on @refuje.travel
          </a>
        </div>
      </section>
    </>
  );
}
