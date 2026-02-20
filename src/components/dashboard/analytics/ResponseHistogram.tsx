"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { ResponseTimeBucket } from "@/lib/analytics-types";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface ResponseHistogramProps {
  data: ResponseTimeBucket[];
}

export function ResponseHistogram({ data }: ResponseHistogramProps) {
  const hasData = data.some((b) => b.count > 0);

  if (!hasData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Response Time Distribution</CardTitle>
          <CardDescription>No acknowledged requests in this period</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Response Time Distribution</CardTitle>
        <CardDescription>Time from request to first acknowledgement</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={data}>
            <XAxis
              dataKey="label"
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
            />
            <YAxis
              allowDecimals={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              width={40}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value, _name, props) => {
                const pct = (props.payload as ResponseTimeBucket).pct;
                return [`${value} (${pct}%)`, "Requests"];
              }}
            />
            <Bar dataKey="count" fill="var(--chart-1)" radius={[4, 4, 0, 0]} barSize={40} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
