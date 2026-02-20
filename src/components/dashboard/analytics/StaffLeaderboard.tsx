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
import type { StaffLeaderboardEntry } from "@/lib/analytics-types";

interface StaffLeaderboardProps {
  data: StaffLeaderboardEntry[];
}

export function StaffLeaderboard({ data }: StaffLeaderboardProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Staff Leaderboard</CardTitle>
          <CardDescription>No staff activity in this period</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>Staff Leaderboard</CardTitle>
        <CardDescription>Ranked by requests handled</CardDescription>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Handled</TableHead>
              <TableHead className="text-right hidden sm:table-cell">
                Avg Response
              </TableHead>
              <TableHead className="text-right">Confirmed</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((staff) => (
              <TableRow key={staff.name}>
                <TableCell className="font-medium">{staff.name}</TableCell>
                <TableCell className="text-right">{staff.handled}</TableCell>
                <TableCell className="text-right hidden sm:table-cell">
                  {staff.avg_response_min != null
                    ? `${staff.avg_response_min} min`
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  {staff.confirmed}
                  <span className="text-muted-foreground text-xs ml-1">
                    ({staff.confirmed_pct}%)
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
