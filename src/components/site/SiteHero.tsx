import Image from "next/image";

interface SiteHeroProps {
  title: string;
  subtitle?: string;
  showChevron?: boolean;
  className?: string;
}

export function SiteHero({
  title,
  subtitle,
  showChevron = true,
  className = "",
}: SiteHeroProps) {
  return (
    <section
      className={`relative flex flex-col items-center justify-center bg-[#C9B29D] min-h-[50vh] md:min-h-[60vh] px-5 ${className}`}
    >
      {/* White REFUJE logo */}
      <Image
        src="https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev/images/site/shared/logo.png"
        alt="Refuje"
        width={140}
        height={50}
        className="mb-6 brightness-0 invert"
      />

      {/* Title */}
      <h1 className="font-[family-name:var(--font-brinnan)] text-[28px] md:text-[42px] font-bold text-white tracking-[3px] uppercase text-center leading-tight">
        {title}
      </h1>

      {/* Optional subtitle */}
      {subtitle && (
        <p className="mt-3 font-[family-name:var(--font-brinnan)] text-[14px] md:text-[16px] text-white/80 tracking-[2px] uppercase text-center">
          {subtitle}
        </p>
      )}

      {/* Decorative line */}
      <hr className="mt-6 w-[60px] border-t border-white/60" />

      {/* Down chevron */}
      {showChevron && (
        <span className="mt-4 text-white/60 text-[20px]">&#9660;</span>
      )}
    </section>
  );
}
