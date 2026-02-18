"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getDashboardStats, getRequests } from "@/lib/concierge-api";
import { useRequestStream } from "@/hooks/use-request-stream";
import type {
  DashboardStats,
  ServiceRequestListItem,
} from "@/lib/concierge-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Inbox,
  Clock,
  CheckCircle2,
  TrendingUp,
  Wifi,
  WifiOff,
} from "lucide-react";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREATED: "destructive",
  ACKNOWLEDGED: "default",
  CONFIRMED: "secondary",
  NOT_AVAILABLE: "outline",
  NO_SHOW: "outline",
  ALREADY_BOOKED_OFFLINE: "outline",
  EXPIRED: "outline",
};

export default function DashboardHomePage() {
  const { activeHotelSlug } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [requests, setRequests] = useState<ServiceRequestListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Track current hotel so SSE refetches can detect staleness
  const activeSlugRef = useRef(activeHotelSlug);
  useEffect(() => { activeSlugRef.current = activeHotelSlug; }, [activeHotelSlug]);

  // Reset state and refetch when hotel changes; abort stale requests (#5)
  useEffect(() => {
    if (!activeHotelSlug) return;

    const controller = new AbortController();
    setStats(null);
    setRequests([]);
    setLoading(true);

    (async () => {
      try {
        const [s, r] = await Promise.all([
          getDashboardStats(activeHotelSlug, controller.signal),
          getRequests(activeHotelSlug, new URLSearchParams({ limit: "10" }), controller.signal),
        ]);
        setStats(s);
        setRequests(r);
      } catch {
        if (controller.signal.aborted) return;
        setStats(null);
        setRequests([]);
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    })();

    return () => controller.abort();
  }, [activeHotelSlug]);

  // Re-fetch on SSE events — drop results if hotel changed mid-flight
  const refetch = useCallback(async () => {
    const slug = activeHotelSlug;
    if (!slug) return;
    try {
      const [s, r] = await Promise.all([
        getDashboardStats(slug),
        getRequests(slug, new URLSearchParams({ limit: "10" })),
      ]);
      if (activeSlugRef.current !== slug) return;
      setStats(s);
      setRequests(r);
    } catch {
      // Swallow — stale SSE refetch failure is not critical
    }
  }, [activeHotelSlug]);

  const handleSSE = useCallback(
    () => {
      refetch();
    },
    [refetch],
  );

  const { connected } = useRequestStream({
    hotelSlug: activeHotelSlug,
    onEvent: handleSSE,
  });

  if (!activeHotelSlug) {
    return (
      <div className="flex h-full items-center justify-center p-8">
        <p className="text-muted-foreground">
          No hotel selected. Please select a hotel from the sidebar.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">Dashboard</h1>
        <div className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground">
          {connected ? (
            <>
              <Wifi className="size-3.5 text-green-500" />
              Live
            </>
          ) : (
            <>
              <WifiOff className="size-3.5" />
              Connecting...
            </>
          )}
        </div>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {/* Stats cards */}
        {loading ? (
          <StatsSkeletons />
        ) : stats ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <StatCard
              title="Total Requests"
              value={stats.total_requests}
              icon={Inbox}
            />
            <StatCard
              title="Pending"
              value={stats.pending}
              icon={Clock}
              highlight={stats.pending > 0}
            />
            <StatCard
              title="Confirmed"
              value={stats.confirmed}
              icon={CheckCircle2}
            />
            <StatCard
              title="Conversion"
              value={`${Math.round(stats.conversion_rate)}%`}
              icon={TrendingUp}
            />
          </div>
        ) : null}

        {/* Department breakdown */}
        {stats && stats.by_department.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>By Department</CardTitle>
              <CardDescription>Request distribution</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.by_department.map((d) => {
                  const pct =
                    stats.total_requests > 0
                      ? Math.round((d.count / stats.total_requests) * 100)
                      : 0;
                  return (
                    <div key={d.name} className="space-y-1">
                      <div className="flex items-center justify-between text-sm">
                        <span>{d.name}</span>
                        <span className="text-muted-foreground">
                          {d.count} ({pct}%)
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Recent requests */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Requests</CardTitle>
            <CardDescription>Latest guest requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No requests yet
              </p>
            ) : (
              <div className="space-y-2">
                {requests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm truncate">
                          {req.guest_name}
                        </span>
                        <Badge
                          variant={STATUS_VARIANT[req.status] ?? "outline"}
                          className="text-[10px]"
                        >
                          {req.status.replace(/_/g, " ")}
                        </Badge>
                      </div>
                      <p className="text-xs text-muted-foreground truncate">
                        {req.department_name}
                        {req.experience_name && ` — ${req.experience_name}`}
                        {req.room_number && ` · Room ${req.room_number}`}
                      </p>
                    </div>
                    <time className="text-xs text-muted-foreground whitespace-nowrap">
                      {formatRelative(req.created_at)}
                    </time>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatCard({
  title,
  value,
  icon: Icon,
  highlight,
}: {
  title: string;
  value: number | string;
  icon: React.ComponentType<{ className?: string }>;
  highlight?: boolean;
}) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <Icon className="size-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div
          className={`text-2xl font-bold ${highlight ? "text-destructive" : ""}`}
        >
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

function StatsSkeletons() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader className="pb-2">
            <Skeleton className="h-4 w-24" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-8 w-16" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
