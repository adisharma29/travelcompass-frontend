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

export function ExperienceTable({ data }: ExperienceTableProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Top Experiences</CardTitle>
          <CardDescription>No experience requests in this period</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const maxRequests = Math.max(...data.map((d) => d.requests));

  return (
    <Card>
      <CardHeader>
        <CardTitle>Top Experiences</CardTitle>
        <CardDescription>Ranked by request volume</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Experience</TableHead>
              <TableHead className="hidden sm:table-cell">Department</TableHead>
              <TableHead className="text-right">Requests</TableHead>
              <TableHead className="text-right hidden sm:table-cell">Confirmed</TableHead>
              <TableHead className="text-right">Conv.</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((exp) => (
              <TableRow key={`${exp.department}-${exp.name}`}>
                <TableCell>
                  <div className="font-medium">{exp.name}</div>
                  <div className="sm:hidden text-xs text-muted-foreground">
                    {exp.department}
                  </div>
                  {/* Inline bar */}
                  <div className="mt-1 h-1.5 w-full rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary/60"
                      style={{
                        width: `${maxRequests > 0 ? (exp.requests / maxRequests) * 100 : 0}%`,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="hidden sm:table-cell text-muted-foreground">
                  {exp.department}
                </TableCell>
                <TableCell className="text-right font-medium">
                  {exp.requests}
                </TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  {exp.confirmed}
                </TableCell>
                <TableCell className="text-right">
                  <span
                    className={
                      exp.conversion_pct >= 50
                        ? "text-emerald-600"
                        : exp.conversion_pct >= 25
                          ? "text-amber-600"
                          : "text-muted-foreground"
                    }
                  >
                    {exp.conversion_pct}%
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
