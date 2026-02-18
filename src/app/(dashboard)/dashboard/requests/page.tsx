"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getRequests,
  acknowledgeRequest,
  updateRequest,
} from "@/lib/concierge-api";
import { useRequestStream } from "@/hooks/use-request-stream";
import type {
  ServiceRequestListItem,
  RequestStatus,
} from "@/lib/concierge-types";
import { VALID_TRANSITIONS, TERMINAL_STATUSES } from "@/lib/concierge-types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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
  Clock,
  XCircle,
  Eye,
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

const STATUS_LABEL: Record<string, string> = {
  CREATED: "New",
  ACKNOWLEDGED: "Acknowledged",
  CONFIRMED: "Confirmed",
  NOT_AVAILABLE: "Not Available",
  NO_SHOW: "No Show",
  ALREADY_BOOKED_OFFLINE: "Booked Offline",
  EXPIRED: "Expired",
};

type FilterStatus = "ALL" | "OPEN" | RequestStatus;

export default function RequestsPage() {
  const { activeHotelSlug } = useAuth();
  const [requests, setRequests] = useState<ServiceRequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterStatus>("OPEN");
  const slugRef = useRef(activeHotelSlug);
  slugRef.current = activeHotelSlug;

  const fetchData = useCallback(async () => {
    const slug = slugRef.current;
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const r = await getRequests(
        slug,
        new URLSearchParams({ limit: "100" }),
      );
      if (slugRef.current !== slug) return;
      setRequests(r);
    } catch {
      if (slugRef.current !== slug) return;
      setError("Failed to load requests");
    } finally {
      if (slugRef.current === slug) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeHotelSlug, fetchData]);

  // Live updates
  const { connected } = useRequestStream({
    hotelSlug: activeHotelSlug,
    onEvent: fetchData,
  });

  const filtered = requests.filter((r) => {
    if (filter === "ALL") return true;
    if (filter === "OPEN") return !TERMINAL_STATUSES.includes(r.status);
    return r.status === filter;
  });

  const openCount = requests.filter(
    (r) => !TERMINAL_STATUSES.includes(r.status),
  ).length;

  if (!activeHotelSlug) return null;

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">Requests</h1>
        {openCount > 0 && (
          <Badge variant="destructive" className="ml-1">
            {openCount}
          </Badge>
        )}
        <div className="ml-auto flex items-center gap-3">
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
            <SelectTrigger className="w-[160px] h-8 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="OPEN">Open ({openCount})</SelectItem>
              <SelectItem value="ALL">All ({requests.length})</SelectItem>
              <SelectItem value="CREATED">New</SelectItem>
              <SelectItem value="ACKNOWLEDGED">Acknowledged</SelectItem>
              <SelectItem value="CONFIRMED">Confirmed</SelectItem>
              <SelectItem value="NOT_AVAILABLE">Not Available</SelectItem>
              <SelectItem value="NO_SHOW">No Show</SelectItem>
              <SelectItem value="ALREADY_BOOKED_OFFLINE">Booked Offline</SelectItem>
              <SelectItem value="EXPIRED">Expired</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </header>

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
              {filter === "ALL"
                ? `All Requests (${filtered.length})`
                : filter === "OPEN"
                  ? `Open Requests (${filtered.length})`
                  : `${STATUS_LABEL[filter]} (${filtered.length})`}
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
            ) : filtered.length === 0 ? (
              <p className="py-12 text-center text-sm text-muted-foreground">
                No requests found
              </p>
            ) : (
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
                  {filtered.map((req) => (
                    <RequestRow
                      key={req.id}
                      req={req}
                      hotelSlug={activeHotelSlug}
                      onUpdated={fetchData}
                    />
                  ))}
                </TableBody>
              </Table>
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
}: {
  req: ServiceRequestListItem;
  hotelSlug: string;
  onUpdated: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [expanded, setExpanded] = useState(false);
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
    } finally {
      setUpdating(false);
    }
  }

  return (
    <>
      <TableRow
        className="cursor-pointer"
        onClick={() => setExpanded(!expanded)}
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
                <span className="ml-1">{STATUS_LABEL[t]}</span>
              </Button>
            ))}
          </div>
        </TableCell>
      </TableRow>
      {expanded && (
        <TableRow>
          <TableCell colSpan={6} className="bg-muted/30">
            <div className="grid gap-3 py-2 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Type
                </span>
                <div>{req.request_type}</div>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Guests
                </span>
                <div>{req.guest_count ?? "—"}</div>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Created
                </span>
                <div>{formatDateTime(req.created_at)}</div>
              </div>
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Due By
                </span>
                <div>
                  {req.response_due_at
                    ? formatDateTime(req.response_due_at)
                    : "—"}
                </div>
              </div>
              {req.guest_notes && (
                <div className="sm:col-span-2 lg:col-span-4">
                  <span className="text-xs font-medium text-muted-foreground">
                    Guest Notes
                  </span>
                  <div className="whitespace-pre-wrap">{req.guest_notes}</div>
                </div>
              )}
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
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
