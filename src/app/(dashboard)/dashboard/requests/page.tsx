"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getRequestsPaginated,
  acknowledgeRequest,
  updateRequest,
} from "@/lib/concierge-api";
import { useSSE, useSSERefetch } from "@/context/SSEContext";
import type {
  ServiceRequestListItem,
  RequestStatus,
} from "@/lib/concierge-types";
import { VALID_TRANSITIONS } from "@/lib/concierge-types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  XCircle,
  Eye,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";

const STATUS_VARIANT: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  CREATED: "destructive",
  ACKNOWLEDGED: "default",
  CONFIRMED: "secondary",
  NOT_AVAILABLE: "outline",
  NO_SHOW: "outline",
  ALREADY_BOOKED_OFFLINE: "outline",
  EXPIRED: "outline",
};

const STATUS_LABEL: Record<string, string> = {
  CREATED: "New",
  ACKNOWLEDGED: "Acknowledged",
  CONFIRMED: "Confirmed",
  NOT_AVAILABLE: "Not Available",
  NO_SHOW: "No Show",
  ALREADY_BOOKED_OFFLINE: "Booked Offline",
  EXPIRED: "Expired",
};

const ACTION_LABEL: Record<string, string> = {
  ACKNOWLEDGED: "Acknowledge",
  CONFIRMED: "Confirm",
  NOT_AVAILABLE: "Mark Unavailable",
  NO_SHOW: "Mark No-Show",
  ALREADY_BOOKED_OFFLINE: "Mark Booked Offline",
};

type FilterStatus = "ALL" | "OPEN" | RequestStatus;

// Non-terminal statuses to send as ?status= params for the "OPEN" filter
const OPEN_STATUSES: RequestStatus[] = ["CREATED", "ACKNOWLEDGED"];

export default function RequestsPage() {
  const router = useRouter();
  const { activeHotelSlug } = useAuth();
  const [requests, setRequests] = useState<ServiceRequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("OPEN");
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [hasPrev, setHasPrev] = useState(false);
  const [totalCount, setTotalCount] = useState(0);

  // Build server-side query params from filter + page
  function buildParams(pageNum: number, statusFilter: FilterStatus): URLSearchParams {
    const params = new URLSearchParams();
    params.set("page", String(pageNum));
    if (statusFilter === "OPEN") {
      for (const s of OPEN_STATUSES) params.append("status", s);
    } else if (statusFilter !== "ALL") {
      params.set("status", statusFilter);
    }
    return params;
  }

  const slugRef = useRef(activeHotelSlug);
  slugRef.current = activeHotelSlug;

  // Monotonic fetch ID — only the latest fetch's response applies state.
  // Protects against both effect-triggered and SSE-triggered stale responses.
  const fetchIdRef = useRef(0);

  const fetchData = useCallback(async (
    pageNum: number,
    statusFilter: FilterStatus,
    signal?: AbortSignal,
  ) => {
    const slug = slugRef.current;
    if (!slug) return;
    const id = ++fetchIdRef.current;
    setLoading(true);
    setError(null);
    try {
      const r = await getRequestsPaginated(slug, buildParams(pageNum, statusFilter), signal);
      if (fetchIdRef.current !== id) return;
      setRequests(r.results);
      setTotalCount(r.count);
      setHasNext(r.hasNext);
      setHasPrev(r.hasPrev);
    } catch {
      if (fetchIdRef.current !== id) return;
      setError("Failed to load requests");
    } finally {
      if (fetchIdRef.current === id) setLoading(false);
    }
  }, []);

  // Re-fetch when hotel, filter, or page changes.
  // AbortController cancels the network request; fetchId guards state writes.
  useEffect(() => {
    const controller = new AbortController();
    fetchData(page, filter, controller.signal);
    return () => controller.abort();
  }, [activeHotelSlug, page, filter, fetchData]);

  // Reset page to 1 when hotel or filter changes
  const prevSlugRef = useRef(activeHotelSlug);
  const prevFilterRef = useRef(filter);
  useEffect(() => {
    if (prevSlugRef.current !== activeHotelSlug || prevFilterRef.current !== filter) {
      prevSlugRef.current = activeHotelSlug;
      prevFilterRef.current = filter;
      setPage(1);
    }
  }, [activeHotelSlug, filter]);

  // Live updates via centralized SSE — fetchId guard covers these too
  const { connected } = useSSE();
  useSSERefetch(() => fetchData(page, filter));

  if (!activeHotelSlug) return null;

  const filterLabel =
    filter === "ALL"
      ? "All Requests"
      : filter === "OPEN"
        ? "Open Requests"
        : STATUS_LABEL[filter] ?? filter;

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Requests">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
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
        <Select
          value={filter}
          onValueChange={(v) => setFilter(v as FilterStatus)}
        >
          <SelectTrigger className="w-full sm:w-[160px] h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OPEN">Open</SelectItem>
            <SelectItem value="ALL">All</SelectItem>
            <SelectItem value="CREATED">New</SelectItem>
            <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
            <SelectItem value="CONFIRMED">Confirmed</SelectItem>
            <SelectItem value="NOT_AVAILABLE">Not Available</SelectItem>
            <SelectItem value="NO_SHOW">No Show</SelectItem>
            <SelectItem value="ALREADY_BOOKED_OFFLINE">Booked Offline</SelectItem>
            <SelectItem value="EXPIRED">Expired</SelectItem>
          </SelectContent>
        </Select>
      </DashboardHeader>

      <div className="flex-1 p-4 md:p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>
              {filterLabel} ({totalCount})
            </CardTitle>
            <CardDescription>Guest service requests</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Skeleton key={i} className="h-14 w-full" />
                ))}
              </div>
            ) : requests.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No requests found
              </p>
            ) : (
              <>
                {/* Mobile card view */}
                <div className="md:hidden space-y-3">
                  {requests.map((req) => (
                    <MobileRequestCard
                      key={req.id}
                      req={req}
                      hotelSlug={activeHotelSlug}
                      onUpdated={() => fetchData(page, filter)}
                      onNavigate={() => router.push(`/dashboard/requests/${req.public_id}`)}
                    />
                  ))}
                </div>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-[100px]">ID</TableHead>
                        <TableHead>Guest</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Date / Time</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead className="w-[200px]">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {requests.map((req) => (
                        <RequestRow
                          key={req.id}
                          req={req}
                          hotelSlug={activeHotelSlug}
                          onUpdated={() => fetchData(page, filter)}
                          onNavigate={() => router.push(`/dashboard/requests/${req.public_id}`)}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </>
            )}
            {/* Pagination */}
            {(hasPrev || hasNext) && !loading && (
              <div className="flex flex-wrap items-center justify-between gap-2 pt-4 border-t mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page - 1)}
                  disabled={!hasPrev}
                >
                  <ChevronLeft className="size-4 mr-1" />
                  Previous
                </Button>
                <span className="text-xs text-muted-foreground order-last sm:order-none w-full sm:w-auto text-center">
                  Page {page} · {totalCount} total
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setPage(page + 1)}
                  disabled={!hasNext}
                >
                  Next
                  <ChevronRight className="size-4 ml-1" />
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function RequestRow({
  req,
  hotelSlug,
  onUpdated,
  onNavigate,
}: {
  req: ServiceRequestListItem;
  hotelSlug: string;
  onUpdated: () => void;
  onNavigate: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const transitions = VALID_TRANSITIONS[req.status] ?? [];

  async function handleAction(status: RequestStatus) {
    setUpdating(true);
    try {
      if (status === "ACKNOWLEDGED") {
        await acknowledgeRequest(hotelSlug, req.id);
      } else {
        await updateRequest(hotelSlug, req.id, { status });
      }
      onUpdated();
    } catch (err) {
      toast.error("Action failed", {
        description: err instanceof Error ? err.message : "Could not update request",
      });
    } finally {
      setUpdating(false);
    }
  }

  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={onNavigate}
      >
        <TableCell className="font-mono text-xs">
          {req.public_id}
        </TableCell>
        <TableCell>
          <div className="font-medium text-sm">{req.guest_name}</div>
          {req.room_number && (
            <div className="text-xs text-muted-foreground">
              Room {req.room_number}
            </div>
          )}
        </TableCell>
        <TableCell>
          <div className="text-sm">{req.department_name}</div>
          {req.experience_name && (
            <div className="text-xs text-muted-foreground">
              {req.experience_name}
            </div>
          )}
          {req.event_name && (
            <div className="text-xs text-muted-foreground">
              Event: {req.event_name}
            </div>
          )}
        </TableCell>
        <TableCell className="text-xs text-muted-foreground">
          <div>{req.guest_date ?? "—"}</div>
          <div>{req.guest_time ?? ""}</div>
        </TableCell>
        <TableCell>
          <Badge variant={STATUS_VARIANT[req.status] ?? "outline"}>
            {STATUS_LABEL[req.status] ?? req.status}
          </Badge>
          {req.after_hours && (
            <Badge variant="outline" className="ml-1 text-[10px]">
              After Hours
            </Badge>
          )}
        </TableCell>
        <TableCell onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center gap-1 flex-wrap">
            {transitions.map((t) => (
              <Button
                key={t}
                variant={t === "CONFIRMED" ? "default" : "outline"}
                size="sm"
                className="text-xs h-7"
                disabled={updating}
                onClick={() => handleAction(t)}
              >
                {updating ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : (
                  <StatusIcon status={t} />
                )}
                <span className="ml-1">{ACTION_LABEL[t] ?? STATUS_LABEL[t]}</span>
              </Button>
            ))}
          </div>
        </TableCell>
      </TableRow>
    </>
  );
}

function MobileRequestCard({
  req,
  hotelSlug,
  onUpdated,
  onNavigate,
}: {
  req: ServiceRequestListItem;
  hotelSlug: string;
  onUpdated: () => void;
  onNavigate: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const transitions = VALID_TRANSITIONS[req.status] ?? [];

  async function handleAction(status: RequestStatus) {
    setUpdating(true);
    try {
      if (status === "ACKNOWLEDGED") {
        await acknowledgeRequest(hotelSlug, req.id);
      } else {
        await updateRequest(hotelSlug, req.id, { status });
      }
      onUpdated();
    } catch (err) {
      toast.error("Action failed", {
        description: err instanceof Error ? err.message : "Could not update request",
      });
    } finally {
      setUpdating(false);
    }
  }

  return (
    <div className="rounded-lg border p-3 space-y-2 cursor-pointer" onClick={onNavigate}>
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <div className="font-medium text-sm truncate">
            {req.department_name}
            {req.experience_name && (
              <span className="text-muted-foreground font-normal"> — {req.experience_name}</span>
            )}
          </div>
          {req.event_name && (
            <div className="text-xs text-muted-foreground">
              Event: {req.event_name}
            </div>
          )}
          <div className="text-xs text-muted-foreground mt-0.5">
            {req.guest_name}
            {req.room_number && ` · Room ${req.room_number}`}
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[req.status] ?? "outline"} className="shrink-0">
          {STATUS_LABEL[req.status] ?? req.status}
        </Badge>
      </div>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{formatDateTime(req.created_at)}</span>
        {req.after_hours && (
          <Badge variant="outline" className="text-[10px]">After Hours</Badge>
        )}
      </div>
      {transitions.length > 0 && (
        <div className="flex items-center gap-1 flex-wrap pt-1 border-t" onClick={(e) => e.stopPropagation()}>
          {transitions.map((t) => (
            <Button
              key={t}
              variant={t === "CONFIRMED" ? "default" : "outline"}
              size="sm"
              className="text-xs h-7"
              disabled={updating}
              onClick={() => handleAction(t)}
            >
              {updating ? (
                <Loader2 className="size-3 animate-spin" />
              ) : (
                <StatusIcon status={t} />
              )}
              <span className="ml-1">{ACTION_LABEL[t] ?? STATUS_LABEL[t]}</span>
            </Button>
          ))}
        </div>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: RequestStatus }) {
  switch (status) {
    case "ACKNOWLEDGED":
      return <Eye className="size-3" />;
    case "CONFIRMED":
      return <CheckCircle2 className="size-3" />;
    case "NOT_AVAILABLE":
    case "NO_SHOW":
    case "ALREADY_BOOKED_OFFLINE":
      return <XCircle className="size-3" />;
    default:
      return <Clock className="size-3" />;
  }
}

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleString("en-IN", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}
