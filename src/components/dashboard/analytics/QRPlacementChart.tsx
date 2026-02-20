"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { QRPlacementStats } from "@/lib/analytics-types";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface QRPlacementChartProps {
  data: QRPlacementStats[];
}

function formatPlacement(placement: string): string {
  return placement.charAt(0) + placement.slice(1).toLowerCase();
}

export function QRPlacementChart({ data }: QRPlacementChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>QR Performance by Placement</CardTitle>
          <CardDescription>No QR scan data in this period</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const formatted = data.map((d) => ({
    ...d,
    label: formatPlacement(d.placement),
  }));

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>QR Performance by Placement</CardTitle>
        <CardDescription>
          Sessions from QR scans and request conversion by location
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer
          width="100%"
          height={Math.max(180, formatted.length * 52)}
        >
          <BarChart data={formatted} layout="vertical" margin={{ left: 0, right: 8 }}>
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              type="category"
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              width={70}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value, name) => {
                const label =
                  name === "sessions"
                    ? "Total Sessions"
                    : "Sessions with Requests";
                return [value, label];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) =>
                value === "sessions"
                  ? "Total Sessions"
                  : "With Requests"
              }
            />
            <Bar
              dataKey="sessions"
              name="sessions"
              fill="var(--chart-3)"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            <Bar
              dataKey="with_requests"
              name="with_requests"
              fill="var(--chart-4)"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
