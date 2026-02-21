"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import { getEvents, deleteEvent, reorderEvents } from "@/lib/concierge-api";
import type { HotelEvent } from "@/lib/concierge-types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Star,
  CalendarDays,
  Repeat,
} from "lucide-react";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import {
  SortableList,
  type DragHandleProps,
  type MoveActions,
} from "@/components/dashboard/SortableList";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { toast } from "sonner";

type FilterTab = "all" | "published" | "draft" | "expired";

function isExpired(event: HotelEvent): boolean {
  return (
    event.status === "UNPUBLISHED" &&
    event.auto_expire &&
    !!event.event_end &&
    new Date(event.event_end) < new Date()
  );
}

function formatEventDate(event: HotelEvent): string {
  const start = new Date(event.event_start);
  const opts: Intl.DateTimeFormatOptions = {
    month: "short",
    day: "numeric",
    hour: event.is_all_day ? undefined : "numeric",
    minute: event.is_all_day ? undefined : "2-digit",
  };
  let str = start.toLocaleDateString("en-US", opts);
  if (event.event_end) {
    const end = new Date(event.event_end);
    str += ` \u2013 ${end.toLocaleDateString("en-US", opts)}`;
  }
  return str;
}

export default function EventsPage() {
  const { activeHotelSlug, role } = useAuth();
  const [events, setEvents] = useState<HotelEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterTab>("all");
  const slugRef = useRef(activeHotelSlug);
  slugRef.current = activeHotelSlug;

  const canManage = role === "ADMIN" || role === "SUPERADMIN";

  const fetchData = useCallback(async () => {
    const slug = slugRef.current;
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getEvents(slug);
      if (slugRef.current !== slug) return;
      setEvents(data.sort((a, b) => a.display_order - b.display_order));
    } catch {
      if (slugRef.current !== slug) return;
      setError("Failed to load events");
    } finally {
      if (slugRef.current === slug) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeHotelSlug, fetchData]);

  const handleReorder = useCallback(
    async (reordered: HotelEvent[]) => {
      if (!activeHotelSlug) return;
      setEvents(reordered);
      try {
        await reorderEvents(
          activeHotelSlug,
          reordered.map((e) => e.id),
        );
      } catch {
        fetchData();
      }
    },
    [activeHotelSlug, fetchData],
  );

  const filtered = events.filter((e) => {
    switch (filter) {
      case "published":
        return e.status === "PUBLISHED";
      case "draft":
        return e.status === "DRAFT";
      case "expired":
        return isExpired(e);
      default:
        return true;
    }
  });

  if (!activeHotelSlug) return null;

  const TABS: { key: FilterTab; label: string }[] = [
    { key: "all", label: "All" },
    { key: "published", label: "Published" },
    { key: "draft", label: "Draft" },
    { key: "expired", label: "Expired" },
  ];

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Events">
        {canManage && (
          <Button size="sm" asChild>
            <Link href="/dashboard/events/new">
              <Plus className="size-4 mr-1.5" /> New Event
            </Link>
          </Button>
        )}
      </DashboardHeader>

      <div className="flex-1 p-4 md:p-6 max-w-4xl">
        {/* Filter tabs */}
        <div className="flex gap-1 mb-4">
          {TABS.map((tab) => (
            <Button
              key={tab.key}
              variant={filter === tab.key ? "default" : "ghost"}
              size="sm"
              onClick={() => setFilter(tab.key)}
            >
              {tab.label}
            </Button>
          ))}
        </div>

        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-lg" />
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <CalendarDays className="size-8 mb-2 opacity-40" />
            <p className="text-sm">
              {filter === "all" ? "No events yet" : `No ${filter} events`}
            </p>
            {filter === "all" && canManage && (
              <p className="text-xs mt-1">Create one to get started</p>
            )}
          </div>
        ) : canManage && filter === "all" ? (
          <div className="space-y-4 md:space-y-3">
            <SortableList
              items={filtered}
              onReorder={handleReorder}
              renderItem={(event, dragHandle, moveActions) => (
                <EventCard
                  event={event}
                  hotelSlug={activeHotelSlug}
                  onDeleted={fetchData}
                  canManage={canManage}
                  dragHandle={dragHandle}
                  moveActions={moveActions}
                />
              )}
            />
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((event) => (
              <EventCard
                key={event.id}
                event={event}
                hotelSlug={activeHotelSlug}
                onDeleted={fetchData}
                canManage={canManage}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function EventCard({
  event,
  hotelSlug,
  onDeleted,
  canManage,
  dragHandle,
  moveActions,
}: {
  event: HotelEvent;
  hotelSlug: string;
  onDeleted: () => void;
  canManage: boolean;
  dragHandle?: DragHandleProps;
  moveActions?: MoveActions;
}) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteEvent(hotelSlug, event.id);
      onDeleted();
    } catch (err) {
      toast.error("Delete failed", {
        description:
          err instanceof Error ? err.message : "Could not delete event",
      });
    } finally {
      setDeleting(false);
    }
  }

  const dateStr = formatEventDate(event);
  const expired = isExpired(event);

  const statusBadge =
    event.status === "PUBLISHED" && !expired ? null : (
      <Badge
        variant={
          expired ? "destructive" : event.status === "DRAFT" ? "outline" : "secondary"
        }
      >
        {expired ? "Expired" : event.status === "DRAFT" ? "Draft" : "Unpublished"}
      </Badge>
    );

  return (
    <Card
      className={`overflow-hidden py-0 md:py-6 ${
        event.status !== "PUBLISHED" || expired ? "opacity-60" : ""
      }`}
    >
      {/* Mobile layout */}
      <div className="md:hidden">
        {event.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.photo}
            alt={event.name}
            className="h-36 w-full object-cover"
          />
        ) : (
          <div className="flex h-28 items-center justify-center bg-muted text-3xl text-muted-foreground">
            <CalendarDays className="size-8 opacity-40" />
          </div>
        )}
        <CardContent className="p-4">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-1.5">
                <h3 className="font-semibold">{event.name}</h3>
                {statusBadge}
                {event.is_featured && (
                  <Star className="size-3.5 text-amber-500 fill-amber-500" />
                )}
                {event.is_recurring && (
                  <Badge variant="outline" className="text-xs gap-1 px-1.5">
                    <Repeat className="size-3" /> Recurring
                  </Badge>
                )}
              </div>
              <p className="mt-1 text-sm text-muted-foreground">{dateStr}</p>
            </div>
            {canManage && (
              <div className="flex items-center gap-0.5 shrink-0">
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-8"
                  asChild
                >
                  <Link href={`/dashboard/events/${event.id}/edit`}>
                    <Pencil className="size-4" />
                  </Link>
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={deleting}
                  className="text-destructive hover:text-destructive size-8"
                >
                  {deleting ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            )}
          </div>
          <div className="mt-2 flex items-center justify-between">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
              <span>
                {event.category.charAt(0) +
                  event.category.slice(1).toLowerCase()}
              </span>
              {event.price_display && <span>{event.price_display}</span>}
            </div>
            {canManage && moveActions && (
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  disabled={!moveActions.onMoveUp}
                  onClick={moveActions.onMoveUp ?? undefined}
                >
                  <ChevronUp className="size-4" />
                </button>
                <button
                  type="button"
                  className="rounded p-1 text-muted-foreground hover:text-foreground disabled:opacity-30"
                  disabled={!moveActions.onMoveDown}
                  onClick={moveActions.onMoveDown ?? undefined}
                >
                  <ChevronDown className="size-4" />
                </button>
              </div>
            )}
          </div>
        </CardContent>
      </div>

      {/* Desktop layout */}
      <CardContent className="hidden md:flex items-center gap-4 p-4">
        {canManage && dragHandle && (
          <button
            type="button"
            ref={dragHandle.ref}
            className="cursor-grab touch-none text-muted-foreground hover:text-foreground shrink-0"
            {...dragHandle.listeners}
            {...dragHandle.attributes}
          >
            <GripVertical className="size-4" />
          </button>
        )}
        {event.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={event.photo}
            alt={event.name}
            className="size-12 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="size-12 rounded-lg bg-muted flex items-center justify-center shrink-0">
            <CalendarDays className="size-5 text-muted-foreground" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{event.name}</span>
            {statusBadge}
            {event.is_featured && (
              <Star className="size-3.5 text-amber-500 fill-amber-500" />
            )}
            {event.is_recurring && (
              <Badge variant="outline" className="text-xs gap-1 px-1.5">
                <Repeat className="size-3" /> Recurring
              </Badge>
            )}
          </div>
          <p className="text-xs text-muted-foreground mt-0.5">{dateStr}</p>
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>
              {event.category.charAt(0) +
                event.category.slice(1).toLowerCase()}
            </span>
            {event.price_display && <span>{event.price_display}</span>}
          </div>
        </div>
        {canManage && (
          <div className="flex items-center gap-1 shrink-0">
            <Button variant="ghost" size="icon" className="size-8" asChild>
              <Link href={`/dashboard/events/${event.id}/edit`}>
                <Pencil className="size-3.5" />
              </Link>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={deleting}
              className="text-destructive hover:text-destructive size-8"
            >
              {deleting ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Trash2 className="size-3.5" />
              )}
            </Button>
          </div>
        )}
      </CardContent>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={`Delete "${event.name}"?`}
        description="This event will be permanently deleted. This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </Card>
  );
}
