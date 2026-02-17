"use client";

const words = [
  "Wonder",
  "Presence",
  "Stillness",
  "Mountain",
  "Soul",
  "Journey",
  "Himalaya",
  "Slow",
];

const separator = "\u2009\u00b7\u2009";

// Double the content for seamless loop
function MarqueeTrack({ reverse }: { reverse?: boolean }) {
  const content = words.join(separator) + separator;
  return (
    <div
      className="flex shrink-0 items-center gap-0 whitespace-nowrap"
      style={{
        animation: `marqueeScroll ${reverse ? "40s" : "35s"} linear infinite ${reverse ? "reverse" : ""}`,
      }}
    >
      <span className="font-[family-name:var(--font-biorhyme)] text-[40px] uppercase tracking-[0.15em] md:text-[72px]">
        {content}
      </span>
      <span className="font-[family-name:var(--font-biorhyme)] text-[40px] uppercase tracking-[0.15em] md:text-[72px]">
        {content}
      </span>
    </div>
  );
}

export function V2Marquee() {
  return (
    <section className="overflow-hidden bg-[#434431] py-8 md:py-12">
      <div className="flex flex-col gap-4 md:gap-6">
        {/* First row — filled text */}
        <div className="flex overflow-hidden">
          <div className="flex text-[#FFE9CF]/10" style={{ width: "max-content" }}>
            <MarqueeTrack />
          </div>
        </div>
        {/* Second row — outline/stroke text, reversed */}
        <div className="flex overflow-hidden">
          <div
            className="flex"
            style={{
              width: "max-content",
              WebkitTextStroke: "1px rgba(255, 233, 207, 0.15)",
              color: "transparent",
            }}
          >
            <MarqueeTrack reverse />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </section>
  );
}
