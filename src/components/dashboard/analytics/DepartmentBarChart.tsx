"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import type { DepartmentAnalytics } from "@/lib/analytics-types";
import {
  Bar,
  BarChart,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

interface DepartmentBarChartProps {
  data: DepartmentAnalytics[];
}

export function DepartmentBarChart({ data }: DepartmentBarChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>By Department</CardTitle>
          <CardDescription>No department data</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>By Department</CardTitle>
        <CardDescription>Request volume per department</CardDescription>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(200, data.length * 48)}>
          <BarChart data={data} layout="vertical" margin={{ left: 8 }}>
            <XAxis
              type="number"
              allowDecimals={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            />
            <YAxis
              type="category"
              dataKey="name"
              tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
              width={100}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "var(--card)",
                border: "1px solid var(--border)",
                borderRadius: "8px",
                fontSize: "13px",
              }}
              formatter={(value, name) => {
                const label = name === "requests" ? "Total" : "Confirmed";
                return [value, label];
              }}
            />
            <Legend
              wrapperStyle={{ fontSize: "12px" }}
              formatter={(value) =>
                value === "requests" ? "Total Requests" : "Confirmed"
              }
            />
            <Bar
              dataKey="requests"
              name="requests"
              fill="var(--chart-1)"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
            <Bar
              dataKey="confirmed"
              name="confirmed"
              fill="var(--chart-2)"
              radius={[0, 4, 4, 0]}
              barSize={20}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
