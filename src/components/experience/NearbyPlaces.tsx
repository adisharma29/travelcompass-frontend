"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";
import { fetchNearbyPlaces } from "@/lib/api";
import type { NearbyPlace } from "@/lib/types";

export function NearbyPlaces() {
  const { state, destination } = useApp();
  const [places, setPlaces] = useState<NearbyPlace[]>([]);
  const [loading, setLoading] = useState(false);

  const expCode = state.currentExperienceCode;

  useEffect(() => {
    if (!expCode) {
      setPlaces([]);
      return;
    }

    setPlaces([]);
    setLoading(true);
    let stale = false;

    fetchNearbyPlaces(destination.slug, expCode)
      .then((data) => {
        if (!stale) setPlaces(data);
      })
      .catch((err) => {
        if (!stale) console.error(err);
      })
      .finally(() => {
        if (!stale) setLoading(false);
      });

    return () => { stale = true; };
  }, [expCode, destination.slug]);

  if (loading || places.length === 0) return null;

  const restaurants = places.filter((p) => p.place_type === "restaurant");
  const attractions = places.filter((p) => p.place_type !== "restaurant");

  return (
    <div className="mt-8">
      <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-accent mb-2.5">
        Nearby
      </div>

      {restaurants.length > 0 && (
        <div className="mt-1">
          <h4 className="text-[13px] font-semibold text-text mb-2 flex items-center gap-1.5 mt-0">
            <span>🍴</span> Restaurants ({restaurants.length})
          </h4>
          {restaurants.slice(0, 5).map((place) => (
            <NearbyItem key={place.google_place_id} place={place} type="restaurant" />
          ))}
        </div>
      )}

      {attractions.length > 0 && (
        <div>
          <h4 className="text-[13px] font-semibold text-text mb-2 flex items-center gap-1.5 mt-5">
            <span>🏛️</span> Attractions ({attractions.length})
          </h4>
          {attractions.slice(0, 5).map((place) => (
            <NearbyItem key={place.google_place_id} place={place} type="attraction" />
          ))}
        </div>
      )}
    </div>
  );
}

function NearbyItem({
  place,
  type,
}: {
  place: NearbyPlace;
  type: "restaurant" | "attraction";
}) {
  const dotColor = type === "restaurant" ? "bg-[#E07A3A]" : "bg-[#4A90D9]";

  return (
    <button
      className="flex items-center gap-2.5 py-2 border-b border-text/8 last:border-b-0 cursor-pointer tap-highlight-none active:opacity-70 w-full text-left"
      onClick={() => {
        if (place.lat != null && place.lng != null) {
          window.open(
            `https://www.google.com/maps/search/?api=1&query=${place.lat},${place.lng}&query_place_id=${place.google_place_id}`,
            "_blank",
            "noopener,noreferrer"
          );
        }
      }}
    >
      <div className={`w-2 h-2 rounded-full shrink-0 ${dotColor}`} />
      <div className="flex-1 min-w-0">
        <div className="text-[13px] font-medium text-text truncate">
          {place.name}
        </div>
        <div className="text-[11px] text-text-secondary mt-px">
          {place.primary_type || place.place_type}
        </div>
      </div>
      {place.rating > 0 && (
        <div className="text-[11px] text-accent font-medium shrink-0">
          {place.rating} ★
        </div>
      )}
    </button>
  );
}
