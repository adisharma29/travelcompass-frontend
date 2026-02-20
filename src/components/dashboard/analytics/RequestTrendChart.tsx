"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { RequestsOverTimeEntry } from "@/lib/analytics-types";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface RequestTrendChartProps {
  data: RequestsOverTimeEntry[];
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
}

export function RequestTrendChart({ data }: RequestTrendChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Requests Over Time</CardTitle>
          <CardDescription>No data for this period</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Requests Over Time</CardTitle>
        <CardDescription>Total vs confirmed requests</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
            <XAxis
              dataKey="date"
              tickFormatter={formatDate}
              className="text-xs"
              tick={{ fill: "var(--muted-foreground)" }}
              interval="preserveStartEnd"
            />
            <YAxis
              allowDecimals={false}
              className="text-xs"
              tick={{ fill: "var(--muted-foreground)" }}
              width={40}
            />
            <Tooltip
              labelFormatter={(label) => formatDate(String(label))}
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
            />
            <Legend wrapperStyle={{ fontSize: "12px" }} />
            <Line
              type="monotone"
              dataKey="total"
              name="Total"
              stroke="var(--chart-1)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
            <Line
              type="monotone"
              dataKey="confirmed"
              name="Confirmed"
              stroke="var(--chart-2)"
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
