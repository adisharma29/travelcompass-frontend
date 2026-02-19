"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import Link from "next/link";
import { useAuth } from "@/context/AuthContext";
import {
  getDepartments,
  deleteExperience,
  reorderExperiences,
} from "@/lib/concierge-api";
import type { Department, Experience } from "@/lib/concierge-types";
import type { DragHandleProps, MoveActions } from "@/components/dashboard/SortableList";
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
import { SortableList } from "@/components/dashboard/SortableList";
import { HtmlContent } from "@/components/dashboard/HtmlContent";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

export default function ExperiencesPage() {
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
      setDepartments(d);
    } catch {
      if (slugRef.current !== slug) return;
      setError("Failed to load data");
    } finally {
      if (slugRef.current === slug) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeHotelSlug, fetchData]);

  const handleReorder = useCallback(
    async (dept: Department, reordered: Experience[]) => {
      if (!activeHotelSlug) return;
      setDepartments((prev) =>
        prev.map((d) =>
          d.id === dept.id ? { ...d, experiences: reordered } : d,
        ),
      );
      try {
        await reorderExperiences(
          activeHotelSlug,
          dept.slug,
          reordered.map((e) => e.id),
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
        <h1 className="text-lg font-semibold">Experiences</h1>
      </header>

      <div className="flex-1 p-4 md:p-6 max-w-4xl">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : departments.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-sm">No departments yet</p>
            <p className="text-xs mt-1">
              Create departments first, then add experiences
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {departments.map((dept) => {
                const sorted = [...dept.experiences].sort(
                  (a, b) => a.display_order - b.display_order,
                );
                return (
                  <div key={dept.id}>
                    <div className="flex items-center justify-between mb-3">
                      <h2 className="text-sm font-semibold text-muted-foreground">
                        {dept.name} ({dept.experiences.length})
                      </h2>
                      <Button size="sm" variant="outline" asChild>
                        <Link
                          href={`/dashboard/departments/${dept.slug}/experiences/new`}
                        >
                          <Plus className="size-3.5 mr-1" /> Add
                        </Link>
                      </Button>
                    </div>
                    {sorted.length > 0 ? (
                      <div className="space-y-2">
                        <SortableList
                          items={sorted}
                          onReorder={(reordered) =>
                            handleReorder(dept, reordered)
                          }
                          renderItem={(exp, dragHandle, moveActions) => (
                            <ExpCard
                              exp={exp}
                              dept={dept}
                              hotelSlug={activeHotelSlug}
                              onDeleted={fetchData}
                              dragHandle={dragHandle}
                              moveActions={moveActions}
                            />
                          )}
                        />
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground py-4 text-center border rounded-lg">
                        No experiences in this department
                      </p>
                    )}
                  </div>
                );
              })}
          </div>
        )}
      </div>
    </div>
  );
}

function ExpCard({
  exp,
  dept,
  hotelSlug,
  onDeleted,
  dragHandle,
  moveActions,
}: {
  exp: Experience;
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
      await deleteExperience(hotelSlug, dept.slug, exp.id);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  const statusBadge =
    exp.status === "PUBLISHED" ? null : (
      <Badge variant={exp.status === "DRAFT" ? "outline" : "secondary"}>
        {exp.status === "DRAFT" ? "Draft" : "Unpublished"}
      </Badge>
    );

  return (
    <Card className={exp.status !== "PUBLISHED" ? "opacity-60" : ""}>
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
        {exp.photo ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exp.photo}
            alt={exp.name}
            className="size-12 rounded-lg object-cover shrink-0"
          />
        ) : (
          <div className="size-12 rounded-lg bg-muted flex items-center justify-center text-xs text-muted-foreground shrink-0">
            No img
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className="font-medium text-sm">{exp.name}</span>
            <Badge variant="outline" className="text-[10px]">
              {exp.category}
            </Badge>
            {statusBadge}
          </div>
          {exp.description ? (
            <HtmlContent
              html={exp.description}
              className="text-xs text-muted-foreground line-clamp-2 mt-0.5 [&_*]:!m-0 [&_*]:!p-0"
            />
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">
              No description
            </p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            {exp.price_display && <span>{exp.price_display}</span>}
            {exp.duration && <span>{exp.duration}</span>}
            {exp.timing && <span>{exp.timing}</span>}
            {exp.gallery_images?.length > 0 && (
              <span>{exp.gallery_images.length} gallery images</span>
            )}
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <Button variant="ghost" size="icon" className="size-8" asChild>
            <Link
              href={`/dashboard/departments/${dept.slug}/experiences/${exp.id}/edit`}
            >
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
        title={`Delete "${exp.name}"?`}
        description="This cannot be undone."
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </Card>
  );
}
