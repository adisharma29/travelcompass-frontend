"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import type {
  DateRangeParams,
  DepartmentAnalytics,
  ExperienceAnalytics,
  HeatmapData,
  OverviewStats,
  QRPlacementStats,
  RequestsOverTimeEntry,
  ResponseTimesData,
} from "@/lib/analytics-types";
import {
  getAnalyticsOverview,
  getRequestsOverTime,
  getDepartmentAnalytics,
  getExperienceAnalytics,
  getResponseTimes,
  getHeatmapData,
  getQRPlacementStats,
} from "@/lib/analytics-api";
import { Inbox, CheckCircle2, Timer, TrendingUp } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle } from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { DateRangeSelector } from "@/components/dashboard/analytics/DateRangeSelector";
import { KPICard } from "@/components/dashboard/analytics/KPICard";
import { RequestTrendChart } from "@/components/dashboard/analytics/RequestTrendChart";
import { DepartmentBarChart } from "@/components/dashboard/analytics/DepartmentBarChart";
import { ExperienceTable } from "@/components/dashboard/analytics/ExperienceTable";
import { ResponseHistogram } from "@/components/dashboard/analytics/ResponseHistogram";
import { StaffLeaderboard } from "@/components/dashboard/analytics/StaffLeaderboard";
import { RequestHeatmap } from "@/components/dashboard/analytics/RequestHeatmap";
import { QRPlacementChart } from "@/components/dashboard/analytics/QRPlacementChart";

export default function AnalyticsPage() {
  const { activeHotelSlug, role } = useAuth();
  const [dateRange, setDateRange] = useState<DateRangeParams>({ range: "7d" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Overview tab data
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [requestsOverTime, setRequestsOverTime] = useState<RequestsOverTimeEntry[]>([]);
  const [departments, setDepartments] = useState<DepartmentAnalytics[]>([]);
  const [experiences, setExperiences] = useState<ExperienceAnalytics[]>([]);

  // Performance tab data
  const [responseTimes, setResponseTimes] = useState<ResponseTimesData | null>(null);
  const [heatmap, setHeatmap] = useState<HeatmapData>([]);
  const [qrPlacements, setQrPlacements] = useState<QRPlacementStats[]>([]);

  const activeSlugRef = useRef(activeHotelSlug);
  useEffect(() => {
    activeSlugRef.current = activeHotelSlug;
  }, [activeHotelSlug]);

  const isStaff = role === "STAFF";

  const fetchData = useCallback(
    async (signal?: AbortSignal) => {
      const slug = activeHotelSlug;
      if (!slug) return;

      setLoading(true);
      setError(null);
      setOverview(null);
      setRequestsOverTime([]);
      setDepartments([]);
      setExperiences([]);
      setResponseTimes(null);
      setHeatmap([]);
      setQrPlacements([]);

      try {
        // Fetch all endpoints in parallel
        const promises: Promise<unknown>[] = [
          getAnalyticsOverview(slug, dateRange, signal),
          getRequestsOverTime(slug, dateRange, signal),
          getExperienceAnalytics(slug, dateRange, signal),
          getResponseTimes(slug, dateRange, signal),
          getHeatmapData(slug, dateRange, signal),
        ];

        // STAFF doesn't get department breakdown or QR placement stats
        if (!isStaff) {
          promises.push(getDepartmentAnalytics(slug, dateRange, signal));
          promises.push(getQRPlacementStats(slug, dateRange, signal));
        }

        const results = await Promise.all(promises);

        // Guard against stale results
        if (activeSlugRef.current !== slug) return;

        setOverview(results[0] as OverviewStats);
        setRequestsOverTime(results[1] as RequestsOverTimeEntry[]);
        setExperiences(results[2] as ExperienceAnalytics[]);
        setResponseTimes(results[3] as ResponseTimesData);
        setHeatmap(results[4] as HeatmapData);
        if (!isStaff) {
          setDepartments(results[5] as DepartmentAnalytics[]);
          setQrPlacements(results[6] as QRPlacementStats[]);
        }
      } catch {
        if (signal?.aborted) return;
        setError("Failed to load analytics data");
      } finally {
        if (!signal?.aborted) setLoading(false);
      }
    },
    [activeHotelSlug, dateRange, isStaff],
  );

  useEffect(() => {
    const controller = new AbortController();
    fetchData(controller.signal);
    return () => controller.abort();
  }, [fetchData]);

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
      <DashboardHeader title="Analytics">
        <DateRangeSelector value={dateRange} onChange={setDateRange} />
      </DashboardHeader>

      <div className="flex-1 space-y-6 p-4 md:p-6">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Tabs defaultValue="overview">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
          </TabsList>

          {/* ===== OVERVIEW TAB ===== */}
          <TabsContent value="overview" className="space-y-6 mt-4">
            {loading ? (
              <OverviewSkeleton />
            ) : overview ? (
              <>
                {/* KPI cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Total Requests"
                    value={overview.total_requests}
                    trend={overview.trends.total_requests}
                    icon={Inbox}
                  />
                  <KPICard
                    title="Confirmed"
                    value={overview.confirmed}
                    trend={overview.trends.confirmed}
                    icon={CheckCircle2}
                  />
                  <KPICard
                    title="Avg Response"
                    value={
                      overview.avg_response_min != null
                        ? `${overview.avg_response_min}`
                        : "—"
                    }
                    suffix={overview.avg_response_min != null ? "min" : undefined}
                    trend={overview.trends.avg_response_min}
                    icon={Timer}
                    invertTrend
                  />
                  <KPICard
                    title="Conversion"
                    value={`${overview.conversion_rate}%`}
                    trend={overview.trends.conversion_rate}
                    icon={TrendingUp}
                  />
                </div>

                {/* Request trend chart */}
                <RequestTrendChart data={requestsOverTime} />

                {/* Department bar chart + Experience table */}
                <div className="grid gap-6 lg:grid-cols-2">
                  {!isStaff && <DepartmentBarChart data={departments} />}
                  <ExperienceTable data={experiences} />
                </div>

                {/* QR placement performance */}
                {!isStaff && <QRPlacementChart data={qrPlacements} />}
              </>
            ) : null}
          </TabsContent>

          {/* ===== PERFORMANCE TAB ===== */}
          <TabsContent value="performance" className="space-y-6 mt-4">
            {loading ? (
              <PerformanceSkeleton />
            ) : responseTimes ? (
              <>
                {/* Performance KPI cards */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <KPICard
                    title="Avg Acknowledge"
                    value={
                      overview?.avg_response_min != null
                        ? `${overview.avg_response_min}`
                        : "—"
                    }
                    suffix={overview?.avg_response_min != null ? "min" : undefined}
                    trend={overview?.trends.avg_response_min ?? null}
                    icon={Timer}
                    invertTrend
                  />
                  <KPICard
                    title="Total Acknowledged"
                    value={responseTimes.total_acknowledged}
                    trend={null}
                    icon={CheckCircle2}
                  />
                  <KPICard
                    title="Escalated"
                    value={overview?.escalated ?? 0}
                    trend={overview?.trends.escalated ?? null}
                    icon={AlertCircle}
                  />
                  <KPICard
                    title="Conversion"
                    value={overview ? `${overview.conversion_rate}%` : "—"}
                    trend={overview?.trends.conversion_rate ?? null}
                    icon={TrendingUp}
                  />
                </div>

                {/* Charts */}
                <div className="grid gap-6 lg:grid-cols-2">
                  <ResponseHistogram data={responseTimes.buckets} />
                  <StaffLeaderboard data={responseTimes.leaderboard} />
                </div>

                <RequestHeatmap data={heatmap} />
              </>
            ) : null}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function OverviewSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <div className="p-6 pt-0">
              <Skeleton className="h-8 w-16" />
              <Skeleton className="h-3 w-32 mt-2" />
            </div>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
        </CardHeader>
        <div className="p-6 pt-0">
          <Skeleton className="h-[300px] w-full" />
        </div>
      </Card>
    </>
  );
}

function PerformanceSkeleton() {
  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <div className="p-6 pt-0">
              <Skeleton className="h-8 w-16" />
            </div>
          </Card>
        ))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-48" />
          </CardHeader>
          <div className="p-6 pt-0">
            <Skeleton className="h-[260px] w-full" />
          </div>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-5 w-36" />
          </CardHeader>
          <div className="p-6 pt-0">
            <Skeleton className="h-[200px] w-full" />
          </div>
        </Card>
      </div>
    </>
  );
}
