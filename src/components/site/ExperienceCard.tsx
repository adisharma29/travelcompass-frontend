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
      <div className="overflow-hidden bg-white border-b border-x border-[#C9B29D]/30">
        <div className="relative h-[300px] md:h-[400px] overflow-hidden">
          <Image
            src={image}
            alt={title}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
        <div className="p-6 flex flex-col justify-between min-h-[320px]">
          <div>
            <p className="font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] font-bold text-[#434431] tracking-[6px] uppercase mb-3">
              {location}
            </p>
            <div className="flex items-start justify-between gap-3 mb-2">
              <h3 className="font-[family-name:var(--font-biorhyme)] text-[24px] font-bold text-[#434431] leading-[1.1] tracking-[2px]">
                {title}
              </h3>
              <span className="font-[family-name:var(--font-biorhyme)] text-[14px] font-bold text-[#434431] shrink-0 mt-1">
                {price}
              </span>
            </div>
            <div className="flex items-center gap-1.5 font-[family-name:var(--font-brinnan)] text-[14px] text-[#434431] tracking-[2px] mb-3">
              <svg className="w-4 h-4 text-[#434431]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <circle cx="12" cy="12" r="10" />
                <path d="M12 6v6l4 2" />
              </svg>
              <span>{duration}</span>
            </div>
            <p className="font-[family-name:var(--font-brinnan)] text-[10px] text-[#434431] leading-[14px] tracking-[0.5px] mb-4 line-clamp-3">
              {description}
            </p>
          </div>
          <span className="inline-block w-fit font-[family-name:var(--font-brinnan)] text-[14px] font-bold text-white bg-[#A85600] px-5 py-2 hover:bg-[#8F4900] transition-colors tracking-[1px] uppercase">
            View More
          </span>
        </div>
      </div>
    </Link>
  );
}
