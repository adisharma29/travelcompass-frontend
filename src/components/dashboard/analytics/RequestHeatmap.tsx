"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { HeatmapData } from "@/lib/analytics-types";

interface RequestHeatmapProps {
  data: HeatmapData;
}

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const HOURS = Array.from({ length: 24 }, (_, i) => i);
const DISPLAY_HOURS = [6, 8, 10, 12, 14, 16, 18, 20, 22];

function getIntensity(count: number, max: number): string {
  if (count === 0) return "bg-muted";
  if (max === 0) return "bg-muted";
  const ratio = count / max;
  if (ratio <= 0.25) return "bg-chart-1/30";
  if (ratio <= 0.5) return "bg-chart-1/50";
  if (ratio <= 0.75) return "bg-chart-1/70";
  return "bg-chart-1/90";
}

export function RequestHeatmap({ data }: RequestHeatmapProps) {
  const max = Math.max(...data.flat());
  const total = data.flat().reduce((a, b) => a + b, 0);

  if (total === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Request Heatmap</CardTitle>
          <CardDescription>No requests in this period</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Request Heatmap</CardTitle>
        <CardDescription>Day of week vs hour of day</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Hour labels */}
        <div className="flex items-center ml-8 sm:ml-10 mb-1">
          {HOURS.map((h) => (
            <div
              key={h}
              className="flex-1 text-center text-[9px] sm:text-[10px] text-muted-foreground"
            >
              {DISPLAY_HOURS.includes(h)
                ? `${h.toString().padStart(2, "0")}`
                : ""}
            </div>
          ))}
        </div>

        {/* Grid rows */}
        {DAYS.map((day, dayIdx) => (
          <div key={day} className="flex items-center gap-0.5 sm:gap-1 mb-0.5 sm:mb-1">
            <div className="w-7 sm:w-9 text-right text-[10px] sm:text-xs text-muted-foreground pr-0.5 sm:pr-1">
              {day}
            </div>
            <div className="flex flex-1 gap-px">
              {HOURS.map((hour) => {
                const count = data[dayIdx]?.[hour] ?? 0;
                return (
                  <div
                    key={hour}
                    className={`flex-1 aspect-square rounded-[1px] sm:rounded-sm ${getIntensity(count, max)} transition-colors`}
                    title={`${day} ${hour}:00 — ${count} request${count !== 1 ? "s" : ""}`}
                  />
                );
              })}
            </div>
          </div>
        ))}

        {/* Legend */}
        <div className="flex items-center justify-end gap-2 mt-3 text-[10px] text-muted-foreground">
          <span>Less</span>
          <div className="flex gap-px">
            <div className="size-3 rounded-sm bg-muted" />
            <div className="size-3 rounded-sm bg-chart-1/30" />
            <div className="size-3 rounded-sm bg-chart-1/50" />
            <div className="size-3 rounded-sm bg-chart-1/70" />
            <div className="size-3 rounded-sm bg-chart-1/90" />
          </div>
          <span>More</span>
        </div>
      </CardContent>
    </Card>
  );
}
