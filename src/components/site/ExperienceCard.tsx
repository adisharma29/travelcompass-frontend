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
  const cleanPrice = price.replace(/onwards?/i, "").trim();

  return (
    <Link href={`/experience/${slug}`} className="group flex h-full flex-col overflow-hidden bg-[#f8f5ef]">
      <div className="relative h-[260px] overflow-hidden md:h-[420px]">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 48vw, 32vw"
        />
      </div>

      <div className="flex flex-1 flex-col space-y-2 px-4 pb-5 pt-4 md:space-y-3 md:px-6 md:pb-8 md:pt-6">
        <p className="font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.12em] text-[#6f7055] md:text-[13px]">
          {location}
        </p>

        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
          <h3 className="min-h-[48px] font-[family-name:var(--font-biorhyme)] text-[22px] leading-[1.1] text-[#434431] md:min-h-[66px] md:text-[30px]">
            {title}
          </h3>
          <div className="w-[92px] shrink-0 text-right md:w-[110px]">
            <p className="font-[family-name:var(--font-brinnan)] text-[11px] leading-[1.1] text-[#434431] md:text-[14px]">
              {cleanPrice}
            </p>
            <p className="font-[family-name:var(--font-brinnan)] text-[10px] leading-[1.2] text-[#7d7f59] md:text-[13px]">
              onwards
            </p>
          </div>
        </div>

        <p className="font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.11em] text-[#6f7055] md:text-[13px]">
          {duration}
        </p>

        <p className="line-clamp-3 min-h-[56px] font-[family-name:var(--font-brinnan)] text-[12px] leading-[1.55] text-[#5f5f4c] md:min-h-[67px] md:text-[14px] md:leading-[1.6]">
          {description}
        </p>

        <span className="mt-auto inline-block w-fit bg-[#b26214] px-4 py-2 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.12em] text-[#f7e8d4] transition-colors group-hover:bg-[#9a530f] md:text-[13px]">
          View More
        </span>
      </div>
    </Link>
  );
}
