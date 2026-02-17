import { LazyVideo } from "@/components/site/LazyVideo";

const R2 = "https://pub-076e9945ca564bacabf26969ce8f8e9c.r2.dev";

export function V2VideoBreak() {
  return (
    <section className="bg-[#FFE9CF] px-6 py-16 md:px-10 md:py-24">
      <div className="mx-auto max-w-[1100px]">
        <div className="mb-8 text-center md:mb-12">
          <p className="mb-3 font-[family-name:var(--font-brinnan)] text-[11px] uppercase tracking-[0.25em] text-[#A56014] md:text-[12px]">
            In Motion
          </p>
          <p className="font-[family-name:var(--font-biorhyme)] text-[24px] italic leading-[1.3] text-[#434431] md:text-[36px]">
            &ldquo;Let the road unfold.&rdquo;
          </p>
        </div>
        <div className="overflow-hidden rounded-sm bg-[#434431] p-3 md:p-10">
          <LazyVideo
            src={`${R2}/videos/site/home/midpage.mp4`}
            className="aspect-video w-full rounded-sm object-cover"
          />
        </div>
      </div>
    </section>
  );
}
