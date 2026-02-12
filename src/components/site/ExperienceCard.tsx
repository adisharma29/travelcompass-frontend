import Image from "next/image";
import Link from "next/link";

interface ExperienceCardProps {
  slug: string;
  title: string;
  location: string;
  duration: string;
  price: string;
  description: string;
  image: string;
}

export function ExperienceCard({
  slug,
  title,
  location,
  duration,
  price,
  description,
  image,
}: ExperienceCardProps) {
  return (
    <Link href={`/experience/${slug}`} className="group block">
      <div className="rounded-[15px] overflow-hidden bg-[#FFF4E8] border border-[#C9B29D]/20">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          <div className="absolute top-3 left-3 bg-[#434431]/80 text-[#FFE9CF] px-3 py-1 rounded-full">
            <span className="font-[family-name:var(--font-brinnan)] text-[11px] tracking-[1px] uppercase">
              {location}
            </span>
          </div>
        </div>
        <div className="p-5">
          <h3 className="font-[family-name:var(--font-biorhyme)] text-[18px] font-bold text-[#434431] mb-2">
            {title}
          </h3>
          <p className="font-[family-name:var(--font-brinnan)] text-[13px] text-[#7C7B55] leading-relaxed mb-3 line-clamp-2">
            {description}
          </p>
          <div className="flex items-center gap-4 font-[family-name:var(--font-brinnan)] text-[12px] text-[#434431] tracking-[0.5px]">
            <span>{duration}</span>
            <span className="text-[#C9B29D]">|</span>
            <span className="font-bold">{price}</span>
          </div>
          <span className="inline-block mt-4 font-[family-name:var(--font-brinnan)] text-[13px] font-bold text-white bg-[#BA6000] px-5 py-2 rounded-sm group-hover:bg-[#A05000] transition-colors tracking-[1px]">
            View More
          </span>
        </div>
      </div>
    </Link>
  );
}
