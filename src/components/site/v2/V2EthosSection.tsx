"use client";

import Image from "next/image";
import { useScrollProgress } from "./useScrollProgress";

interface EthosItem {
  icon: string;
  title: string;
  description: string;
  photo: string;
}

interface V2EthosSectionProps {
  items: EthosItem[];
}

function EthosRow({ item, index }: { item: EthosItem; index: number }) {
  const { ref, progress } = useScrollProgress();
  const reversed = index % 2 !== 0;

  // Parallax: image moves slower than scroll (creates depth)
  const parallaxY = (progress - 0.5) * -40;
  // Fade + slide in
  const enterProgress = Math.min(1, Math.max(0, (progress - 0.1) * 2.5));

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`flex flex-col md:flex-row ${reversed ? "md:flex-row-reverse" : ""}`}
      style={{
        opacity: enterProgress,
        willChange: "opacity",
      }}
    >
      {/* Photo side — consistent aspect ratio with parallax */}
      <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto md:h-[520px] md:w-[60%]">
        <Image
          src={item.photo}
          alt={item.title}
          fill
          className="object-cover"
          style={{
            transform: `translateY(${parallaxY}px) scale(1.1)`,
            willChange: "transform",
          }}
          sizes="(max-width: 768px) 100vw, 60vw"
        />
      </div>

      {/* Text side */}
      <div
        className="flex flex-col justify-center bg-[#434431] px-8 py-10 md:w-[40%] md:px-14 md:py-16"
        style={{
          transform: `translateY(${(1 - enterProgress) * 20}px)`,
          willChange: "transform",
        }}
      >
        <Image
          src={item.icon}
          alt=""
          width={40}
          height={40}
          className="mb-4 brightness-0 invert md:mb-6"
        />
        <h3 className="font-[family-name:var(--font-biorhyme)] text-[26px] leading-[1.15] text-[#FFE9CF] md:text-[34px]">
          {item.title}
        </h3>
        <p className="mt-3 font-[family-name:var(--font-brinnan)] text-[14px] leading-[1.7] text-[#C9B29D] md:mt-5 md:text-[16px]">
          {item.description}
        </p>
      </div>
    </div>
  );
}

export function V2EthosSection({ items }: V2EthosSectionProps) {
  return (
    <section className="bg-[#FFE9CF]">
      <div className="px-6 pb-4 pt-16 text-center md:px-10 md:pb-8 md:pt-24">
        <p className="mb-3 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.25em] text-[#A56014] md:text-[12px]">
          Our Philosophy
        </p>
        <h2 className="mx-auto max-w-[1272px] font-[family-name:var(--font-biorhyme)] text-[32px] leading-[1.1] text-[#434431] md:text-[44px]">
          The Refuje Way
        </h2>
      </div>
      <div className="flex flex-col">
        {items.map((item, i) => (
          <EthosRow key={item.title} item={item} index={i} />
        ))}
      </div>
    </section>
  );
}
