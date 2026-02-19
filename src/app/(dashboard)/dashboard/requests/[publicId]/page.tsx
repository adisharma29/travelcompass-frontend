"use client";

import { use, useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getRequestByPublicId,
  acknowledgeRequest,
  updateRequest,
  addRequestNote,
  takeOwnership,
} from "@/lib/concierge-api";
import { useSSERefetch } from "@/context/SSEContext";
import type {
  ServiceRequest,
  RequestStatus,
  RequestActivity,
} from "@/lib/concierge-types";
import { VALID_TRANSITIONS, TERMINAL_STATUSES } from "@/lib/concierge-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Eye,
  Hand,
  Loader2,
  MessageSquarePlus,
  XCircle,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { toast } from "sonner";

// ----- Status display maps -----

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

// ----- Confirmation reason enum maps -----

const STATUS_TO_REASONS: Record<string, string[]> = {
  CONFIRMED: ["WALK_IN"],
  NOT_AVAILABLE: ["SOLD_OUT", "MAINTENANCE", "SEASONAL"],
  NO_SHOW: ["GUEST_UNREACHABLE"],
  ALREADY_BOOKED_OFFLINE: ["WALK_IN"],
};

const REASON_LABEL: Record<string, string> = {
  WALK_IN: "Walk-in",
  SOLD_OUT: "Sold Out",
  MAINTENANCE: "Under Maintenance",
  SEASONAL: "Seasonal Closure",
  GUEST_UNREACHABLE: "Guest Unreachable",
};

// ----- Activity timeline labels -----

const ACTIVITY_LABEL: Record<string, string> = {
  CREATED: "Created",
  ACKNOWLEDGED: "Acknowledged",
  CONFIRMED: "Confirmed",
  NOT_AVAILABLE: "Marked Not Available",
  NO_SHOW: "Marked No-Show",
  ALREADY_BOOKED_OFFLINE: "Marked Booked Offline",
  NOTE_ADDED: "Note Added",
  OWNERSHIP_TAKEN: "Took Ownership",
  STATUS_CHANGED: "Status Changed",
  EXPIRED: "Expired",
};

// ===== Main component =====

export default function RequestDetailPage({
  params,
}: {
  params: Promise<{ publicId: string }>;
}) {
  const { publicId } = use(params);
  const { user } = useAuth();

  const [request, setRequest] = useState<(ServiceRequest & { hotel_slug: string }) | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Track hotel_slug + numeric id from the fetched request for mutations
  const hotelSlugRef = useRef("");
  const requestIdRef = useRef(0);

  async function fetchRequest() {
    try {
      const data = await getRequestByPublicId(publicId);
      hotelSlugRef.current = data.hotel_slug;
      requestIdRef.current = data.id;
      setRequest(data);
      setError(null);
    } catch {
      setError("Failed to load request");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchRequest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [publicId]);

  // Refresh on SSE events
  useSSERefetch(() => {
    if (hotelSlugRef.current) fetchRequest();
  });

  if (loading) {
    return (
      <div className="flex flex-col">
        <DashboardHeader title="Request Detail" />
        <div className="p-4 md:p-6 space-y-4 max-w-3xl">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-40 w-full" />
          <Skeleton className="h-60 w-full" />
        </div>
      </div>
    );
  }

  if (error || !request) {
    return (
      <div className="flex flex-col">
        <DashboardHeader title="Request Detail" />
        <div className="p-4 md:p-6 max-w-3xl">
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error ?? "Request not found"}</AlertDescription>
          </Alert>
          <Button variant="outline" className="mt-4" asChild>
            <Link href="/dashboard/requests">
              <ArrowLeft className="size-4 mr-1.5" />
              Back to Requests
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  const hotelSlug = hotelSlugRef.current;
  const requestId = requestIdRef.current;
  const isTerminal = TERMINAL_STATUSES.includes(request.status);
  const isAssignedToMe = user != null && request.assigned_to_id === user.id;

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Request Detail">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/dashboard/requests">
            <ArrowLeft className="size-4 mr-1.5" />
            Back
          </Link>
        </Button>
      </DashboardHeader>

      <div className="flex-1 p-4 md:p-6 max-w-3xl space-y-6">
        {/* Header */}
        <div className="space-y-1">
          <div className="flex items-center gap-3 flex-wrap">
            <Badge
              variant={STATUS_VARIANT[request.status] ?? "outline"}
              className="text-sm"
            >
              {STATUS_LABEL[request.status] ?? request.status}
            </Badge>
            <span className="font-mono text-sm text-muted-foreground">
              #{request.public_id.slice(0, 8)}
            </span>
            {request.after_hours && (
              <Badge variant="outline" className="text-xs">
                After Hours
              </Badge>
            )}
          </div>
          <div className="text-sm text-muted-foreground space-y-0.5">
            <div>
              <span className="font-medium text-foreground">{request.department_name}</span>
              {request.experience_name && ` — ${request.experience_name}`}
            </div>
            <div>
              {request.guest_name}
              {request.room_number && ` · Room ${request.room_number}`}
            </div>
            {request.assigned_to_name && (
              <div className="text-xs">
                Assigned to: <span className="font-medium">{request.assigned_to_name}</span>
              </div>
            )}
          </div>
        </div>

        {/* Details card */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid gap-3 text-sm sm:grid-cols-2">
              <DetailField label="Type" value={request.request_type} />
              <DetailField label="Guests" value={request.guest_count?.toString() ?? "—"} />
              <DetailField label="Date" value={request.guest_date ?? "—"} />
              <DetailField label="Time" value={request.guest_time ?? "—"} />
              <DetailField
                label="Created"
                value={formatDateTime(request.created_at)}
              />
              <DetailField
                label="Due By"
                value={request.response_due_at ? formatDateTime(request.response_due_at) : "—"}
              />
            </div>
            {request.guest_notes && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Guest Notes
                </span>
                <p className="text-sm whitespace-pre-wrap mt-0.5">
                  {request.guest_notes}
                </p>
              </div>
            )}
            {request.confirmation_reason && (
              <div>
                <span className="text-xs font-medium text-muted-foreground">
                  Confirmation Reason
                </span>
                <p className="text-sm mt-0.5">
                  {REASON_LABEL[request.confirmation_reason] ?? request.confirmation_reason}
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Staff notes */}
        <StaffNotesEditor
          hotelSlug={hotelSlug}
          requestId={requestId}
          initialNotes={request.staff_notes}
          disabled={isTerminal}
        />

        {/* Actions */}
        {!isTerminal && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <TransitionActions
                hotelSlug={hotelSlug}
                requestId={requestId}
                currentStatus={request.status}
                onUpdated={fetchRequest}
              />
              <div className="flex items-center gap-2 flex-wrap pt-2 border-t">
                <AddNoteButton
                  hotelSlug={hotelSlug}
                  requestId={requestId}
                  onAdded={fetchRequest}
                />
                {!isAssignedToMe && (
                  <TakeOwnershipButton
                    hotelSlug={hotelSlug}
                    requestId={requestId}
                    onUpdated={fetchRequest}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Activity Timeline */}
        {request.activities.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Activity Timeline</CardTitle>
              <CardDescription>
                {request.activities.length} event{request.activities.length !== 1 && "s"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ActivityTimeline activities={request.activities} />
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}

// ===== Sub-components =====

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-xs font-medium text-muted-foreground">{label}</span>
      <div>{value}</div>
    </div>
  );
}

function StaffNotesEditor({
  hotelSlug,
  requestId,
  initialNotes,
  disabled,
}: {
  hotelSlug: string;
  requestId: number;
  initialNotes: string;
  disabled: boolean;
}) {
  const [notes, setNotes] = useState(initialNotes);
  const [savedBaseline, setSavedBaseline] = useState(initialNotes);
  const [saving, setSaving] = useState(false);
  const isDirty = notes !== savedBaseline;

  // Sync when server data changes (SSE refresh / other staff edit).
  // If user has no local edits, update the visible text too.
  // If user has local edits, only move the baseline so isDirty stays correct.
  useEffect(() => {
    setSavedBaseline((prev) => {
      if (prev === initialNotes) return prev; // no server change
      setNotes((localNotes) => localNotes === prev ? initialNotes : localNotes);
      return initialNotes;
    });
  }, [initialNotes]);

  async function handleSave() {
    setSaving(true);
    try {
      await updateRequest(hotelSlug, requestId, { staff_notes: notes });
      setSavedBaseline(notes);
      toast.success("Staff notes saved");
    } catch (err) {
      toast.error("Failed to save notes", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Staff Notes</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Internal notes visible to staff only..."
          rows={3}
          disabled={disabled}
        />
        {isDirty && (
          <div className="flex justify-end">
            <Button size="sm" onClick={handleSave} disabled={saving}>
              {saving && <Loader2 className="size-3 animate-spin mr-1.5" />}
              Save Notes
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function TransitionActions({
  hotelSlug,
  requestId,
  currentStatus,
  onUpdated,
}: {
  hotelSlug: string;
  requestId: number;
  currentStatus: RequestStatus;
  onUpdated: () => void;
}) {
  const transitions = VALID_TRANSITIONS[currentStatus] ?? [];
  const [updating, setUpdating] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<RequestStatus | null>(null);
  const [selectedReason, setSelectedReason] = useState("");

  const reasonOptions = pendingStatus ? STATUS_TO_REASONS[pendingStatus] ?? [] : [];

  async function handleAction(status: RequestStatus) {
    const reasons = STATUS_TO_REASONS[status];
    if (reasons && reasons.length > 0) {
      setPendingStatus(status);
      setSelectedReason("");
      return;
    }
    await executeAction(status);
  }

  async function executeAction(status: RequestStatus, reason?: string) {
    setUpdating(true);
    try {
      if (status === "ACKNOWLEDGED") {
        await acknowledgeRequest(hotelSlug, requestId);
      } else {
        await updateRequest(hotelSlug, requestId, {
          status,
          ...(reason ? { confirmation_reason: reason } : {}),
        });
      }
      setPendingStatus(null);
      onUpdated();
    } catch (err) {
      toast.error("Action failed", {
        description: err instanceof Error ? err.message : "Could not update request",
      });
    } finally {
      setUpdating(false);
    }
  }

  if (transitions.length === 0) return null;

  return (
    <>
      <div className="flex items-center gap-2 flex-wrap">
        {transitions.map((t) => (
          <Button
            key={t}
            variant={t === "CONFIRMED" ? "default" : "outline"}
            size="sm"
            disabled={updating}
            onClick={() => handleAction(t)}
          >
            {updating ? (
              <Loader2 className="size-3 animate-spin mr-1.5" />
            ) : (
              <StatusIcon status={t} />
            )}
            {ACTION_LABEL[t] ?? STATUS_LABEL[t]}
          </Button>
        ))}
      </div>

      {/* Confirmation reason dialog */}
      <Dialog open={!!pendingStatus} onOpenChange={(open) => !open && setPendingStatus(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {pendingStatus && (ACTION_LABEL[pendingStatus] ?? STATUS_LABEL[pendingStatus])}
            </DialogTitle>
            <DialogDescription>
              Optionally select a reason for this status change.
            </DialogDescription>
          </DialogHeader>
          <Select value={selectedReason} onValueChange={setSelectedReason}>
            <SelectTrigger>
              <SelectValue placeholder="No reason (optional)" />
            </SelectTrigger>
            <SelectContent>
              {reasonOptions.map((r) => (
                <SelectItem key={r} value={r}>
                  {REASON_LABEL[r] ?? r}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPendingStatus(null)}>
              Cancel
            </Button>
            <Button
              onClick={() => pendingStatus && executeAction(pendingStatus, selectedReason || undefined)}
              disabled={updating}
            >
              {updating && <Loader2 className="size-3 animate-spin mr-1.5" />}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function AddNoteButton({
  hotelSlug,
  requestId,
  onAdded,
}: {
  hotelSlug: string;
  requestId: number;
  onAdded: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [note, setNote] = useState("");
  const [saving, setSaving] = useState(false);

  async function handleSubmit() {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await addRequestNote(hotelSlug, requestId, note.trim());
      setNote("");
      setOpen(false);
      onAdded();
      toast.success("Note added");
    } catch (err) {
      toast.error("Failed to add note", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Button variant="outline" size="sm" onClick={() => setOpen(true)}>
        <MessageSquarePlus className="size-3.5 mr-1.5" />
        Add Note
      </Button>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Activity Note</DialogTitle>
            <DialogDescription>
              This note will appear in the activity timeline.
            </DialogDescription>
          </DialogHeader>
          <Textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="e.g. Guest confirmed via WhatsApp..."
            rows={3}
          />
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={saving || !note.trim()}>
              {saving && <Loader2 className="size-3 animate-spin mr-1.5" />}
              Add Note
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function TakeOwnershipButton({
  hotelSlug,
  requestId,
  onUpdated,
}: {
  hotelSlug: string;
  requestId: number;
  onUpdated: () => void;
}) {
  const [taking, setTaking] = useState(false);

  async function handleTake() {
    setTaking(true);
    try {
      await takeOwnership(hotelSlug, requestId);
      onUpdated();
      toast.success("Ownership taken");
    } catch (err) {
      toast.error("Failed to take ownership", {
        description: err instanceof Error ? err.message : "Please try again",
      });
    } finally {
      setTaking(false);
    }
  }

  return (
    <Button variant="outline" size="sm" onClick={handleTake} disabled={taking}>
      {taking ? (
        <Loader2 className="size-3.5 animate-spin mr-1.5" />
      ) : (
        <Hand className="size-3.5 mr-1.5" />
      )}
      Take Ownership
    </Button>
  );
}

function ActivityTimeline({ activities }: { activities: RequestActivity[] }) {
  return (
    <div className="relative pl-6">
      {/* Vertical line — centered on the 7px dots at left 0px → center at 3px */}
      <div className="absolute left-[3px] top-2 bottom-2 w-px bg-border" />
      <div className="space-y-4">
        {activities.map((activity, i) => (
          <div key={i} className="relative">
            {/* Dot */}
            <div className="absolute -left-6 top-1.5 size-[7px] rounded-full bg-primary ring-2 ring-background" />
            <div>
              <div className="flex items-baseline gap-2 flex-wrap">
                <span className="text-sm font-medium">
                  {ACTIVITY_LABEL[activity.action] ?? activity.action}
                </span>
                <time className="text-xs text-muted-foreground">
                  {formatDateTime(activity.created_at)}
                </time>
              </div>
              {activity.actor_name && (
                <p className="text-xs text-muted-foreground mt-0.5">
                  by {activity.actor_name}
                </p>
              )}
              {activity.details && Object.keys(activity.details).length > 0 && (
                <ActivityDetails details={activity.details} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityDetails({ details }: { details: Record<string, unknown> }) {
  const statusFrom = details.status_from as string | undefined;
  const statusTo = details.status_to as string | undefined;
  const noteLength = details.note_length as number | undefined;

  if (!statusFrom && !statusTo && !noteLength) return null;

  return (
    <div className="mt-1 text-xs text-muted-foreground space-y-0.5">
      {statusFrom && statusTo && (
        <p>
          {STATUS_LABEL[statusFrom] ?? statusFrom}
          {" \u2192 "}
          {STATUS_LABEL[statusTo] ?? statusTo}
        </p>
      )}
      {noteLength != null && (
        <p>{noteLength} character{noteLength !== 1 ? "s" : ""}</p>
      )}
    </div>
  );
}

function StatusIcon({ status }: { status: RequestStatus }) {
  const cls = "size-3.5 mr-1.5";
  switch (status) {
    case "ACKNOWLEDGED":
      return <Eye className={cls} />;
    case "CONFIRMED":
      return <CheckCircle2 className={cls} />;
    case "NOT_AVAILABLE":
    case "NO_SHOW":
    case "ALREADY_BOOKED_OFFLINE":
      return <XCircle className={cls} />;
    default:
      return <Clock className={cls} />;
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
