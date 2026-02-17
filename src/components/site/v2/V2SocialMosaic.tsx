import Image from "next/image";

interface V2SocialMosaicProps {
  images: string[];
  profileUrl: string;
}

export function V2SocialMosaic({ images, profileUrl }: V2SocialMosaicProps) {
  return (
    <section
      className="px-6 py-16 md:px-10 md:py-24"
      style={{
        background: "linear-gradient(to bottom, #434431 0%, #7C7B55 100%)",
      }}
    >
      <div className="mx-auto max-w-[1272px]">
        <p className="text-center font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.25em] text-[#C9B29D]/60 md:text-[12px]">
          Follow the Journey
        </p>
        <p className="mt-2 text-center">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="font-[family-name:var(--font-biorhyme)] text-[28px] text-[#FFE9CF] transition-colors hover:text-white md:text-[40px]"
          >
            @refuje.travel
          </a>
        </p>

        <div
          className="mt-10 md:mt-14"
          style={{
            columnCount: 2,
            columnGap: "12px",
          }}
        >
          {images.map((src, i) => {
            const isOdd = i % 3 === 0;
            return (
              <a
                key={i}
                href={profileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group mb-3 block overflow-hidden md:mb-4"
                style={{ breakInside: "avoid" }}
              >
                <div className="relative overflow-hidden rounded-sm" style={{ aspectRatio: isOdd ? "3/4" : "4/3" }}>
                  <Image
                    src={src}
                    alt={`Gallery photo ${i + 1}`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 transition-colors group-hover:bg-black/15" />
                </div>
              </a>
            );
          })}
        </div>

        <div className="mt-10 text-center md:mt-14">
          <a
            href={profileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-block rounded-sm bg-[#A56014] px-8 py-3 font-[family-name:var(--font-brinnan)] text-[13px] uppercase tracking-[0.14em] text-[#FFE9CF] transition-colors hover:bg-[#8a5010] md:text-[14px]"
          >
            Follow Us
          </a>
        </div>
      </div>
    </section>
  );
}
