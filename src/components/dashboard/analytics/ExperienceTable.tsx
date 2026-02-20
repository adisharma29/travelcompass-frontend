"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ExperienceAnalytics } from "@/lib/analytics-types";

interface ExperienceTableProps {
  data: ExperienceAnalytics[];
}

function conversionColor(pct: number): string {
  if (pct >= 50) return "text-emerald-600";
  if (pct >= 25) return "text-amber-600";
  return "text-muted-foreground";
}

export function ExperienceTable({ data }: ExperienceTableProps) {
  if (data.length === 0) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>Top Experiences</CardTitle>
          <CardDescription>No experience requests in this period</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const maxRequests = Math.max(...data.map((d) => d.requests));

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Top Experiences</CardTitle>
        <CardDescription>Ranked by request volume</CardDescription>
      </CardHeader>
      <CardContent>
        {/* Mobile: stacked cards */}
        <div className="flex flex-col gap-3 sm:hidden">
          {data.map((exp) => (
            <div
              key={`${exp.department}-${exp.name}`}
              className="rounded-lg border p-3"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{exp.name}</p>
                  <p className="text-xs text-muted-foreground">{exp.department}</p>
                </div>
                <span
                  className={`shrink-0 text-sm font-semibold ${conversionColor(exp.conversion_pct)}`}
                >
                  {exp.conversion_pct}%
                </span>
              </div>
              {/* Progress bar */}
              <div className="mt-2 h-1.5 w-full rounded-full bg-muted">
                <div
                  className="h-full rounded-full bg-primary/60"
                  style={{
                    width: `${maxRequests > 0 ? (exp.requests / maxRequests) * 100 : 0}%`,
                  }}
                />
              </div>
              <div className="mt-1.5 flex gap-3 text-xs text-muted-foreground">
                <span>
                  <span className="font-medium text-foreground">{exp.requests}</span> requests
                </span>
                <span>
                  <span className="font-medium text-foreground">{exp.confirmed}</span> confirmed
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Desktop: table */}
        <div className="hidden sm:block overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Experience</TableHead>
                <TableHead>Department</TableHead>
                <TableHead className="text-right">Requests</TableHead>
                <TableHead className="text-right">Confirmed</TableHead>
                <TableHead className="text-right">Conv.</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((exp) => (
                <TableRow key={`${exp.department}-${exp.name}`}>
                  <TableCell>
                    <div className="font-medium">{exp.name}</div>
                    <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                      <div
                        className="h-full rounded-full bg-primary/60"
                        style={{
                          width: `${maxRequests > 0 ? (exp.requests / maxRequests) * 100 : 0}%`,
                        }}
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {exp.department}
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    {exp.requests}
                  </TableCell>
                  <TableCell className="text-right">{exp.confirmed}</TableCell>
                  <TableCell className="text-right">
                    <span className={conversionColor(exp.conversion_pct)}>
                      {exp.conversion_pct}%
                    </span>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}
