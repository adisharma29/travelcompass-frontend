"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getDepartments,
  deleteDepartment,
  reorderDepartments,
} from "@/lib/concierge-api";
import type { Department } from "@/lib/concierge-types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
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
} from "lucide-react";
import { SortableList, type DragHandleProps, type MoveActions } from "@/components/dashboard/SortableList";
import { HtmlContent } from "@/components/dashboard/HtmlContent";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

export default function DepartmentsPage() {
  const { activeHotelSlug } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const slugRef = useRef(activeHotelSlug);
  slugRef.current = activeHotelSlug;

  const fetchData = useCallback(async () => {
    const slug = slugRef.current;
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const d = await getDepartments(slug);
      if (slugRef.current !== slug) return;
      setDepartments(d.sort((a, b) => a.display_order - b.display_order));
    } catch {
      if (slugRef.current !== slug) return;
      setError("Failed to load departments");
    } finally {
      if (slugRef.current === slug) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeHotelSlug, fetchData]);

  const handleReorder = useCallback(
    async (reordered: Department[]) => {
      if (!activeHotelSlug) return;
      setDepartments(reordered);
      try {
        await reorderDepartments(
          activeHotelSlug,
          reordered.map((d) => d.id),
        );
      } catch {
        fetchData();
      }
    },
    [activeHotelSlug, fetchData],
  );

  if (!activeHotelSlug) return null;

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">Departments</h1>
        <div className="ml-auto">
          <Button size="sm" asChild>
            <Link href="/dashboard/departments/new">
              <Plus className="size-4 mr-1.5" /> New Department
            </Link>
          </Button>
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 max-w-4xl">
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
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-sm">No departments yet</p>
            <p className="text-xs mt-1">Create one to get started</p>
          </div>
        ) : (
          <div className="space-y-3">
            <SortableList
              items={departments}
              onReorder={handleReorder}
              renderItem={(dept, dragHandle, moveActions) => (
                <DeptCard
                  dept={dept}
                  hotelSlug={activeHotelSlug}
                  onDeleted={fetchData}
                  dragHandle={dragHandle}
                  moveActions={moveActions}
                />
              )}
            />
          </div>
        )}
      </div>
    </div>
  );
}

function DeptCard({
  dept,
  hotelSlug,
  onDeleted,
  dragHandle,
  moveActions,
}: {
  dept: Department;
  hotelSlug: string;
  onDeleted: () => void;
  dragHandle: DragHandleProps;
  moveActions: MoveActions;
}) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDepartment(hotelSlug, dept.slug);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  const scheduleStr =
    dept.schedule?.default
      ?.map(([s, e]) => `${s}\u2013${e}`)
      .join(", ") ?? "Always open";

  const statusBadge =
    dept.status === "PUBLISHED" ? null : (
      <Badge variant={dept.status === "DRAFT" ? "outline" : "secondary"}>
        {dept.status === "DRAFT" ? "Draft" : "Unpublished"}
      </Badge>
    );

  return (
    <Card className={dept.status !== "PUBLISHED" ? "opacity-60" : ""}>
      <CardContent className="flex items-center gap-4 p-4">
        <div className="flex flex-col items-center gap-0.5 shrink-0">
          <button
            type="button"
            ref={dragHandle.ref}
            className="cursor-grab touch-none text-muted-foreground hover:text-foreground hidden md:block"
            {...dragHandle.listeners}
            {...dragHandle.attributes}
          >
            <GripVertical className="size-4" />
          </button>
          <button
            type="button"
            className="md:hidden text-muted-foreground hover:text-foreground disabled:opacity-30"
            disabled={!moveActions.onMoveUp}
            onClick={moveActions.onMoveUp ?? undefined}
          >
            <ChevronUp className="size-4" />
          </button>
          <button
            type="button"
            className="md:hidden text-muted-foreground hover:text-foreground disabled:opacity-30"
            disabled={!moveActions.onMoveDown}
            onClick={moveActions.onMoveDown ?? undefined}
          >
            <ChevronDown className="size-4" />
          </button>
        </div>
        {dept.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={dept.photo}
            alt={dept.name}
            className="size-12 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-lg shrink-0">
            {dept.icon || dept.name.charAt(0)}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{dept.name}</span>
            {statusBadge}
            {dept.is_ops && <Badge variant="secondary">Ops</Badge>}
          </div>
          {dept.description ? (
            <HtmlContent
              html={dept.description}
              className="text-xs text-muted-foreground line-clamp-2 mt-0.5 [&_*]:!m-0 [&_*]:!p-0"
            />
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">
              No description
            </p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>{dept.experiences.length} experiences</span>
            <span>{scheduleStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="size-8" asChild>
            <Link href={`/dashboard/departments/${dept.slug}/edit`}>
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
      </CardContent>
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={`Delete "${dept.name}"?`}
        description={`This will also delete all ${dept.experiences.length} experience${dept.experiences.length === 1 ? "" : "s"} in this department. This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </Card>
  );
}
