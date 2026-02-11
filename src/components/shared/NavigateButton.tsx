"use client";

import { useApp } from "@/context/AppContext";

interface NavigateButtonProps {
  experienceCode: string;
  experienceName: string;
  fullWidth?: boolean;
}

export function NavigateButton({
  experienceName,
  fullWidth,
}: NavigateButtonProps) {
  const { geojsonRef, experiences } = useApp();

  function handleClick() {
    const geojson = geojsonRef.current;
    let coord: number[] | null = null;

    if (geojson) {
      const lineFeature = geojson.features.find(
        (f) =>
          f.properties.name === experienceName &&
          f.geometry.type === "LineString"
      );
      if (lineFeature) {
        coord = (lineFeature.geometry.coordinates as number[][])[0];
      } else {
        const pointFeature = geojson.features.find(
          (f) =>
            f.properties.name === experienceName &&
            f.geometry.type === "Point"
        );
        if (pointFeature) {
          coord = pointFeature.geometry.coordinates as number[];
        }
      }
    }

    if (!coord) {
      const exp = experiences.find((e) => e.name === experienceName);
      if (exp) return; // No coordinates available
    }

    if (coord) {
      const lat = coord[1];
      const lng = coord[0];
      window.open(
        `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`,
        "_blank",
        "noopener,noreferrer"
      );
    }
  }

  if (fullWidth) {
    return (
      <button
        className="flex items-center justify-center gap-2 w-full my-6 px-5 py-3.5 bg-text text-bg border-none rounded-xl font-sans text-[15px] font-semibold cursor-pointer transition-opacity duration-200 active:opacity-85"
        onClick={handleClick}
      >
        <svg
          className="w-[18px] h-[18px] shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
          <circle cx="12" cy="10" r="3" />
        </svg>
        Navigate to start point
      </button>
    );
  }

  return (
    <button
      className="flex items-center justify-center w-10 h-10 border-none bg-accent/10 rounded-full cursor-pointer tap-highlight-none shrink-0 active:bg-accent/20"
      onClick={handleClick}
    >
      <svg
        className="w-5 h-5 text-accent"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 22l10-6 10 6L12 2z" />
      </svg>
    </button>
  );
}
