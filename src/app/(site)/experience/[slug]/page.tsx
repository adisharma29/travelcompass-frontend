import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { getExperience, getAllExperienceSlugs } from "@/data/experiences";
import { ExperienceGallery } from "./ExperienceGallery";
import { ExperienceFaqs } from "./ExperienceFaqs";
import { ExperienceItinerary } from "./ExperienceItinerary";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  return getAllExperienceSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const exp = getExperience(slug);
  if (!exp) return { title: "Experience Not Found" };
  return {
    title: `${exp.title} | ${exp.location}`,
    description: exp.about.slice(0, 160),
  };
}

export default async function ExperienceDetailPage({ params }: Props) {
  const { slug } = await params;
  const exp = getExperience(slug);
  if (!exp) notFound();

  const specItems = [
    { label: "Location", value: exp.specs.location, icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/specs/location-pin.png" },
    exp.specs.distance ? { label: "Distance", value: exp.specs.distance, icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/specs/distance.png" } : null,
    { label: "Price", value: exp.specs.price, icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/specs/price.png" },
    { label: "Duration", value: exp.specs.duration, icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/specs/duration.png" },
    exp.specs.difficulty ? { label: "Difficulty", value: exp.specs.difficulty, icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/specs/difficulty.png" } : null,
    { label: "Group Size", value: exp.specs.groupSize, icon: "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/specs/group-size.png" },
  ].filter(Boolean) as { label: string; value: string; icon: string }[];

  return (
    <>
      {/* Hero */}
      <section className="relative h-[50vh] md:h-[70vh] overflow-hidden">
        {/* Desktop hero image */}
        <Image
          src={exp.heroImage}
          alt={exp.title}
          fill
          priority
          className={exp.heroMobileImage ? "hidden md:block object-cover" : "object-cover"}
        />
        {/* Mobile hero image */}
        {exp.heroMobileImage && (
          <Image
            src={exp.heroMobileImage}
            alt={exp.title}
            fill
            priority
            className="md:hidden object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-12 left-0 right-0 px-5 md:px-10 max-w-[1400px] mx-auto">
          <p className="font-[family-name:var(--font-brinnan)] text-[13px] text-white/70 tracking-[2px] uppercase mb-2">
            {exp.location}
          </p>
          <h1 className="font-[family-name:var(--font-biorhyme)] text-[30px] md:text-[46px] font-bold text-white leading-tight">
            {exp.title}
          </h1>
          <a
            href="#book"
            className="inline-block mt-4 font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-white bg-[#BA6000] px-8 py-3 rounded-sm hover:bg-[#A05000] transition-colors tracking-[1px]"
          >
            Book Now
          </a>
        </div>
      </section>

      {/* Specs */}
      <section className="px-5 md:px-10 py-8 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
          {specItems.map((spec) => (
            <div key={spec.label} className="text-center">
              <Image
                src={spec.icon}
                alt={spec.label}
                width={36}
                height={36}
                className="mx-auto mb-2"
              />
              <p className="font-[family-name:var(--font-brinnan)] text-[11px] text-[#7C7B55] tracking-[1px] uppercase">
                {spec.label}
              </p>
              <p className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] tracking-[0.5px]">
                {spec.value}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section className="px-5 md:px-10 py-8 md:py-12 max-w-[1400px] mx-auto">
        <h2 className="font-[family-name:var(--font-biorhyme)] text-[22px] md:text-[28px] font-bold text-[#434431] tracking-[2px] mb-4">
          About the Experience
        </h2>
        <p className="font-[family-name:var(--font-brinnan)] text-[15px] text-[#434431] leading-relaxed tracking-[0.5px] max-w-[700px]">
          {exp.about}
        </p>

        <h3 className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431] tracking-[1px] uppercase mt-8 mb-3">
          Who Is It For?
        </h3>
        <ul className="space-y-2">
          {exp.targetAudience.map((item) => (
            <li
              key={item}
              className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#7C7B55] tracking-[0.5px] flex items-start gap-2"
            >
              <span className="text-[#A56014] mt-0.5">&#x2022;</span>
              {item}
            </li>
          ))}
        </ul>
      </section>

      {/* Highlights */}
      <section className="px-5 md:px-10 py-8 md:py-12 bg-[#434431]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[22px] md:text-[28px] font-bold text-[#FFE9CF] tracking-[2px] mb-6">
            Highlights
          </h2>
          <ul className="space-y-3">
            {exp.highlights.map((item) => (
              <li
                key={item}
                className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-white tracking-[0.5px] flex items-start gap-3"
              >
                <span className="text-[#BA6000] mt-1 shrink-0 text-lg">&#x2022;</span>
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Itinerary */}
      <section className="px-5 md:px-10 py-8 md:py-12 bg-[#FFF4E8]">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[22px] md:text-[28px] font-bold text-[#434431] tracking-[2px] mb-6">
            Itinerary
          </h2>
          <ExperienceItinerary items={exp.itinerary} />
        </div>
      </section>

      {/* Inclusions / Exclusions */}
      <section className="px-5 md:px-10 py-8 md:py-12 bg-[#434431]">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#FFE9CF] tracking-[2px] mb-4">
              Inclusions
            </h2>
            <ul className="space-y-2">
              {exp.inclusions.map((item) => (
                <li
                  key={item}
                  className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#FFE9CF]/80 tracking-[0.5px] flex items-start gap-2"
                >
                  <span className="text-green-400 mt-0.5">&#x2713;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#FFE9CF] tracking-[2px] mb-4">
              Exclusions
            </h2>
            <ul className="space-y-2">
              {exp.exclusions.map((item) => (
                <li
                  key={item}
                  className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#FFE9CF]/80 tracking-[0.5px] flex items-start gap-2"
                >
                  <span className="text-red-400 mt-0.5">&#x2717;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* What to Bring / Not to Bring */}
      <section className="px-5 md:px-10 py-8 md:py-12 max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[2px] mb-4">
              What to Bring
            </h2>
            <ul className="space-y-2">
              {exp.whatToBring.map((item) => (
                <li
                  key={item}
                  className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#7C7B55] tracking-[0.5px] flex items-start gap-2"
                >
                  <span className="text-[#A56014] mt-0.5">&#x2022;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[20px] font-bold text-[#434431] tracking-[2px] mb-4">
              Not to Bring
            </h2>
            <ul className="space-y-2">
              {exp.notToBring.map((item) => (
                <li
                  key={item}
                  className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#7C7B55] tracking-[0.5px] flex items-start gap-2"
                >
                  <span className="text-red-500 mt-0.5">&#x2717;</span>
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* Gallery */}
      {exp.gallery.length > 0 && (
        <section className="py-8 md:py-12">
          <div className="max-w-[1400px] mx-auto px-5 md:px-10">
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[22px] md:text-[28px] font-bold text-[#434431] tracking-[2px] mb-6">
              Gallery
            </h2>
          </div>
          <ExperienceGallery images={exp.gallery} title={exp.title} />
        </section>
      )}

      {/* FAQs */}
      {exp.faqs.length > 0 && (
        <section className="px-5 md:px-10 py-8 md:py-12 max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[22px] md:text-[28px] font-bold text-[#434431] tracking-[2px] mb-6">
            Frequently Asked Questions
          </h2>
          <ExperienceFaqs faqs={exp.faqs} />
        </section>
      )}

      {/* Testimonials */}
      {exp.testimonials.length > 0 && (
        <section className="bg-[#FFF4E8] px-5 md:px-10 py-8 md:py-12">
          <div className="max-w-[1400px] mx-auto">
            <h2 className="font-[family-name:var(--font-biorhyme)] text-[22px] md:text-[28px] font-bold text-[#434431] tracking-[2px] mb-6">
              Testimonials
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {exp.testimonials.map((t, i) => (
                <div key={i} className="bg-white p-6 border border-[#C9B29D]/20">
                  <div className="flex items-center gap-3 mb-4">
                    <Image
                      src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/icons/google-g.png"
                      alt="Google Review"
                      width={24}
                      height={24}
                    />
                    <div>
                      <p className="font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-[#434431]">
                        {t.author}
                      </p>
                      <p className="font-[family-name:var(--font-brinnan)] text-[12px] text-[#7C7B55]">
                        {t.location}
                      </p>
                    </div>
                  </div>
                  <p className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#434431] leading-relaxed tracking-[0.5px]">
                    &ldquo;{t.text}&rdquo;
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Related */}
      {exp.relatedExperiences.length > 0 && (
        <section className="px-5 md:px-10 py-8 md:py-12 max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[22px] md:text-[28px] font-bold text-[#434431] tracking-[2px] mb-6">
            You May Also Like
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {exp.relatedExperiences.map((rel) => (
              <Link
                key={rel.slug}
                href={`/experience/${rel.slug}`}
                className="group block overflow-hidden bg-[#FFF4E8] border border-[#C9B29D]/20"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={rel.image}
                    alt={rel.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="p-4">
                  <p className="font-[family-name:var(--font-brinnan)] text-[11px] text-[#7C7B55] tracking-[1px] uppercase">
                    {rel.location}
                  </p>
                  <h3 className="font-[family-name:var(--font-biorhyme)] text-[16px] font-bold text-[#434431] mt-1">
                    {rel.title}
                  </h3>
                  <div className="flex items-center gap-3 mt-2 font-[family-name:var(--font-brinnan)] text-[12px] text-[#434431] tracking-[0.5px]">
                    <span>{rel.duration}</span>
                    <span className="text-[#C9B29D]">|</span>
                    <span className="font-bold">{rel.price}</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Book CTA */}
      <section id="book" className="bg-[#434431] px-5 md:px-10 py-12 md:py-16 text-center">
        <div className="max-w-[1400px] mx-auto">
          <h2 className="font-[family-name:var(--font-biorhyme)] text-[24px] md:text-[30px] font-bold text-[#FFE9CF] mb-3">
            Ready to Experience {exp.title}?
          </h2>
          <p className="font-[family-name:var(--font-brinnan)] text-[14px] text-[#FFE9CF]/70 mb-6 tracking-[0.5px]">
            {exp.specs.price} &middot; {exp.specs.duration}
          </p>
          <a
            href={`https://wa.me/917807740707?text=Hi, I'd like to book ${exp.title}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-white bg-[#BA6000] px-8 py-3 rounded-sm hover:bg-[#A05000] transition-colors tracking-[1px]"
          >
            Book via WhatsApp
          </a>
        </div>
      </section>
    </>
  );
}
