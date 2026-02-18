"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { fetchExperienceDetail } from "@/lib/api";
import type { ExperienceDetail } from "@/lib/types";
import { BackButton } from "../shared/BackButton";
import { ShareButton } from "../shared/ShareButton";
import { NavigateButton } from "../shared/NavigateButton";
import { ImageCarousel } from "../experience/ImageCarousel";
import { BreakdownSection } from "../experience/BreakdownSection";
import { ElevationChart } from "../experience/ElevationChart";
import { NearbyPlaces } from "../experience/NearbyPlaces";
import { slugify } from "@/lib/utils";

/** Normalize a field that can be a string, string[], or null into string[] */
function toLines(val: unknown): string[] {
  if (Array.isArray(val)) return val.filter((v) => typeof v === "string" && v);
  if (typeof val === "string") return val.split("\n").filter(Boolean);
  return [];
}

export function ExperienceView() {
  const { state, dispatch, destination, experiences, detailCache } = useApp();
  const [detail, setDetail] = useState<ExperienceDetail | null>(null);
  const [loading, setLoading] = useState(false);

  const expCode = state.currentExperienceCode;
  const expListItem = experiences.find((e) => e.code === expCode);
  const mood = destination.moods.find(
    (m) => m.slug === state.currentMoodSlug
  );

  useEffect(() => {
    if (!expCode) return;

    let stale = false;

    (async () => {
      // Check cache
      const cached = detailCache.current.get(expCode);
      if (cached) {
        setDetail(cached);
        return;
      }

      setLoading(true);
      try {
        const d = await fetchExperienceDetail(destination.slug, expCode);
        if (stale) return;
        detailCache.current.set(expCode, d);
        setDetail(d);
      } catch (err) {
        if (!stale) console.error(err);
      } finally {
        if (!stale) setLoading(false);
      }
    })();

    return () => {
      stale = true;
      setDetail(null);
    };
  }, [expCode, destination.slug, detailCache]);

  if (!expListItem) return null;

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center gap-3 px-5 py-4 border-b border-brand-accent/12 sticky top-0 bg-bg z-10">
        <BackButton onClick={() => dispatch({ type: "GO_BACK" })} />
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-lg text-text leading-tight truncate">
            {expListItem.display_name || expListItem.name}
          </h1>
          <p className="text-[13px] text-text-secondary mt-0.5">
            {mood?.name}
          </p>
        </div>
        <NavigateButton
          experienceCode={expCode!}
          experienceName={expListItem.name}
        />
        <ShareButton
          title={expListItem.display_name || expListItem.name}
          text={`Check out "${expListItem.display_name || expListItem.name}" on Field Guide ${destination.name}`}
          hash={`/experience/${slugify(expListItem.name)}`}
        />
      </div>

      {/* Content */}
      <div className="pb-[calc(20px+env(safe-area-inset-bottom,0px))]">
        {loading && (
          <div className="flex items-center justify-center py-12">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-brand-accent border-t-transparent" />
          </div>
        )}

        {detail && (
          <>
            {/* Image carousel */}
            {detail.images.length > 0 && (
              <ImageCarousel images={detail.images} name={detail.name} />
            )}

            <div className="px-5 py-5">
              {/* About */}
              {detail.about && (
                <Section title="About">
                  {toLines(detail.about).map((p, i) => (
                    <p key={i} className="text-sm text-text leading-[1.65] mb-3 last:mb-0">
                      {p}
                    </p>
                  ))}
                </Section>
              )}

              {/* What you get */}
              {detail.what_you_get && (
                <Section title="What you get">
                  <ul className="list-none p-0 m-0">
                    {toLines(detail.what_you_get).map((item, i) => (
                      <li
                        key={i}
                        className="relative pl-4 mb-2 text-sm text-text leading-[1.65] last:mb-0 before:content-[''] before:absolute before:left-0 before:top-[9px] before:w-1.5 before:h-1.5 before:rounded-full before:bg-text-secondary"
                      >
                        {item}
                      </li>
                    ))}
                  </ul>
                </Section>
              )}

              {/* Why we chose this */}
              {detail.why_we_chose_this && (
                <Section title="Why we chose this">
                  <p className="text-sm text-text leading-[1.65]">
                    {detail.why_we_chose_this}
                  </p>
                </Section>
              )}

              {/* The Golden Way */}
              {detail.golden_way && (
                <Section title="The Golden Way">
                  <p className="text-sm text-text leading-[1.65]">
                    {detail.golden_way}
                  </p>
                </Section>
              )}

              {/* Breakdown */}
              {detail.breakdown && (
                <BreakdownSection breakdown={detail.breakdown} />
              )}

              {/* Elevation chart */}
              <ElevationChart experienceName={expListItem.name} />

              {/* Navigate button */}
              <NavigateButton
                experienceCode={expCode!}
                experienceName={expListItem.name}
                fullWidth
              />

              {/* Nearby places */}
              <NearbyPlaces />
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-brand-accent mb-2.5">
        {title}
      </div>
      <div>{children}</div>
    </div>
  );
}
