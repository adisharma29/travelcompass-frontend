"use client";

import { useEffect, useState } from "react";
import { useApp } from "@/context/AppContext";

interface ElevationData {
  elevations: number[];
  minElev: number;
  maxElev: number;
  totalGain: number;
  totalLoss: number;
  color: string;
}

interface ElevationChartProps {
  experienceName: string;
}

export function ElevationChart({ experienceName }: ElevationChartProps) {
  const { mapRef, geojsonRef } = useApp();
  const [data, setData] = useState<ElevationData | null>(null);

  useEffect(() => {
    const map = mapRef.current;
    const geojson = geojsonRef.current;
    if (!map || !geojson) return;

    const feature = geojson.features.find(
      (f) => f.properties.name === experienceName && f.geometry.type === "LineString"
    );
    if (!feature) return;

    const featureColor = feature.properties.color || "#1D4ED8";

    const coords = feature.geometry.coordinates as number[][];

    // Wait for terrain to be ready
    const timer = setTimeout(() => {
      // Sample points
      const maxPoints = 50;
      const step = Math.max(1, Math.floor(coords.length / maxPoints));
      const sampled: number[][] = [];
      for (let i = 0; i < coords.length; i += step) {
        sampled.push(coords[i]);
      }
      if (sampled[sampled.length - 1] !== coords[coords.length - 1]) {
        sampled.push(coords[coords.length - 1]);
      }

      const elevations: number[] = [];
      let terrainAvailable = false;

      try {
        for (const coord of sampled) {
          const elev = map.queryTerrainElevation(
            { lng: coord[0], lat: coord[1] },
            { exaggerated: false }
          );
          if (elev !== null && elev !== undefined) {
            elevations.push(elev);
            terrainAvailable = true;
          } else {
            elevations.push(0);
          }
        }
      } catch {
        return;
      }

      if (!terrainAvailable || elevations.length < 2) return;

      const minElev = Math.min(...elevations);
      const maxElev = Math.max(...elevations);
      let totalGain = 0;
      let totalLoss = 0;
      for (let i = 1; i < elevations.length; i++) {
        const diff = elevations[i] - elevations[i - 1];
        if (diff > 0) totalGain += diff;
        else totalLoss += Math.abs(diff);
      }

      setData({ elevations, minElev, maxElev, totalGain, totalLoss, color: featureColor });
    }, 1000);

    return () => clearTimeout(timer);
  }, [experienceName, mapRef, geojsonRef]);

  if (!data) return null;

  const { elevations, minElev, maxElev, totalGain, totalLoss, color } = data;
  const width = 280;
  const height = 80;
  const padding = 5;
  const xScale = (width - padding * 2) / (elevations.length - 1);
  const elevRange = maxElev - minElev || 1;
  const yScale = (height - padding * 2) / elevRange;

  let pathD = `M ${padding} ${height - padding - (elevations[0] - minElev) * yScale}`;
  for (let i = 1; i < elevations.length; i++) {
    const x = padding + i * xScale;
    const y = height - padding - (elevations[i] - minElev) * yScale;
    pathD += ` L ${x} ${y}`;
  }

  const areaD = `${pathD} L ${width - padding} ${height - padding} L ${padding} ${height - padding} Z`;

  return (
    <div className="mb-6">
      <div className="text-[11px] font-semibold uppercase tracking-[0.5px] text-brand-accent mb-2.5">
        Elevation Profile
      </div>
      <div className="bg-bg-card rounded-xl p-4 min-h-[120px]">
        <svg
          className="w-full h-[100px] block"
          viewBox={`0 0 ${width} ${height}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id={`elevGrad-${experienceName.replace(/\s/g, "")}`}
              x1="0%"
              y1="0%"
              x2="0%"
              y2="100%"
            >
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <path
            d={areaD}
            fill={`url(#elevGrad-${experienceName.replace(/\s/g, "")})`}
          />
          <path
            d={pathD}
            fill="none"
            stroke={color}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="flex justify-between mt-3 text-[11px] text-text-secondary">
          <div className="text-center">
            <div className="text-[13px] font-semibold text-text">
              {Math.round(minElev)}m
            </div>
            <div>Min</div>
          </div>
          <div className="text-center">
            <div className="text-[13px] font-semibold text-text">
              {Math.round(maxElev)}m
            </div>
            <div>Max</div>
          </div>
          <div className="text-center">
            <div className="text-[13px] font-semibold text-text">
              +{Math.round(totalGain)}m
            </div>
            <div>Gain</div>
          </div>
          <div className="text-center">
            <div className="text-[13px] font-semibold text-text">
              -{Math.round(totalLoss)}m
            </div>
            <div>Loss</div>
          </div>
        </div>
      </div>
    </div>
  );
}
