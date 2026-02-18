"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getDepartments,
  createExperience,
  updateExperience,
  deleteExperience,
  reorderExperiences,
  uploadExperienceImage,
  deleteExperienceImage,
  reorderExperienceImages,
} from "@/lib/concierge-api";
import type {
  Department,
  Experience,
  ExperienceCategory,
  ExperienceImage,
} from "@/lib/concierge-types";
import type { DragHandleProps } from "@/components/dashboard/SortableList";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  X,
  GripVertical,
  Upload,
} from "lucide-react";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { SortableList } from "@/components/dashboard/SortableList";
import { ImageUploadArea } from "@/components/dashboard/ImageUploadArea";
import { HtmlContent } from "@/components/dashboard/HtmlContent";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

const CATEGORIES: ExperienceCategory[] = [
  "DINING",
  "SPA",
  "ACTIVITY",
  "TOUR",
  "TRANSPORT",
  "OTHER",
];

interface ExpForm {
  department: number | null;
  name: string;
  description: string;
  category: ExperienceCategory;
  price_display: string;
  timing: string;
  duration: string;
  capacity: string;
  highlights: string[];
  is_active: boolean;
  photo: File | null;
  cover_image: File | null;
}

const EMPTY_FORM: ExpForm = {
  department: null,
  name: "",
  description: "",
  category: "ACTIVITY",
  price_display: "",
  timing: "",
  duration: "",
  capacity: "",
  highlights: [],
  is_active: true,
  photo: null,
  cover_image: null,
};

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
      // Optimistic update
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

  const allExperiences = departments.flatMap((d) => d.experiences);

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">Experiences</h1>
        <div className="ml-auto">
          <ExpDialog
            hotelSlug={activeHotelSlug}
            departments={departments}
            onSaved={fetchData}
          />
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
          <div className="space-y-6">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-20 w-full rounded-lg" />
                <Skeleton className="h-20 w-full rounded-lg" />
              </div>
            ))}
          </div>
        ) : allExperiences.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-sm">No experiences yet</p>
            <p className="text-xs mt-1">
              Create departments first, then add experiences
            </p>
          </div>
        ) : (
          <div className="space-y-8">
            {departments
              .filter((d) => d.experiences.length > 0)
              .map((dept) => {
                const sorted = [...dept.experiences].sort(
                  (a, b) => a.display_order - b.display_order,
                );
                return (
                  <div key={dept.id}>
                    <h2 className="text-sm font-semibold text-muted-foreground mb-3">
                      {dept.name} ({dept.experiences.length})
                    </h2>
                    <div className="space-y-2">
                      <SortableList
                        items={sorted}
                        onReorder={(reordered) =>
                          handleReorder(dept, reordered)
                        }
                        renderItem={(exp, dragHandle) => (
                          <ExpCard
                            exp={exp}
                            dept={dept}
                            hotelSlug={activeHotelSlug}
                            departments={departments}
                            onUpdated={fetchData}
                            dragHandle={dragHandle}
                          />
                        )}
                      />
                    </div>
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
  departments,
  onUpdated,
  dragHandle,
}: {
  exp: Experience;
  dept: Department;
  hotelSlug: string;
  departments: Department[];
  onUpdated: () => void;
  dragHandle: DragHandleProps;
}) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteExperience(hotelSlug, dept.slug, exp.id);
      onUpdated();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card className={!exp.is_active ? "opacity-60" : ""}>
      <CardContent className="flex items-center gap-4 p-4">
        <button
          type="button"
          ref={dragHandle.ref}
          className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
          {...dragHandle.listeners}
          {...dragHandle.attributes}
        >
          <GripVertical className="size-4" />
        </button>
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
            {!exp.is_active && <Badge variant="outline">Inactive</Badge>}
          </div>
          {exp.description ? (
            <HtmlContent
              html={exp.description}
              className="text-xs text-muted-foreground line-clamp-2 mt-0.5 [&_*]:!m-0 [&_*]:!p-0"
            />
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">No description</p>
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
          <ExpDialog
            hotelSlug={hotelSlug}
            departments={departments}
            existing={exp}
            existingDeptSlug={dept.slug}
            onSaved={onUpdated}
          />
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

function ExpDialog({
  hotelSlug,
  departments,
  existing,
  existingDeptSlug,
  onSaved,
}: {
  hotelSlug: string;
  departments: Department[];
  existing?: Experience;
  existingDeptSlug?: string;
  onSaved: () => void;
}) {
  const isEdit = !!existing;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ExpForm>(EMPTY_FORM);
  const [highlightInput, setHighlightInput] = useState("");

  // Gallery state (edit mode only)
  const [gallery, setGallery] = useState<ExperienceImage[]>([]);
  const [uploading, setUploading] = useState(false);

  function initForm() {
    if (existing) {
      const dept = departments.find((d) => d.slug === existingDeptSlug);
      setForm({
        department: dept?.id ?? null,
        name: existing.name,
        description: existing.description,
        category: existing.category,
        price_display: existing.price_display,
        timing: existing.timing,
        duration: existing.duration,
        capacity: existing.capacity ?? "",
        highlights: existing.highlights ?? [],
        is_active: existing.is_active,
        photo: null,
        cover_image: null,
      });
      setGallery(
        [...(existing.gallery_images ?? [])].sort(
          (a, b) => a.display_order - b.display_order,
        ),
      );
    } else {
      setForm({ ...EMPTY_FORM, department: departments[0]?.id ?? null });
      setGallery([]);
    }
    setHighlightInput("");
    setError(null);
  }

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("category", form.category);
    fd.append("price_display", form.price_display);
    fd.append("timing", form.timing);
    fd.append("duration", form.duration);
    fd.append("capacity", form.capacity);
    fd.append("highlights", JSON.stringify(form.highlights));
    fd.append("is_active", form.is_active ? "true" : "false");
    if (form.department) fd.append("department", String(form.department));
    if (form.photo) fd.append("photo", form.photo);
    if (form.cover_image) fd.append("cover_image", form.cover_image);
    return fd;
  }

  async function handleSave() {
    const dept = departments.find((d) => d.id === form.department);
    if (!dept) {
      setError("Please select a department");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (isEdit && existing) {
        await updateExperience(
          hotelSlug,
          dept.slug,
          existing.id,
          buildFormData(),
        );
      } else {
        await createExperience(hotelSlug, dept.slug, buildFormData());
      }
      setOpen(false);
      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save experience",
      );
    } finally {
      setSaving(false);
    }
  }

  function addHighlight() {
    const trimmed = highlightInput.trim();
    if (!trimmed || form.highlights.includes(trimmed)) return;
    setForm((f) => ({ ...f, highlights: [...f.highlights, trimmed] }));
    setHighlightInput("");
  }

  function removeHighlight(idx: number) {
    setForm((f) => ({
      ...f,
      highlights: f.highlights.filter((_, i) => i !== idx),
    }));
  }

  // Gallery handlers
  async function handleGalleryUpload(files: FileList) {
    if (!existing || !existingDeptSlug) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("image", file);
        const img = await uploadExperienceImage(
          hotelSlug,
          existingDeptSlug,
          existing.id,
          fd,
        );
        setGallery((prev) => [...prev, img]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload image",
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryDelete(imgId: number) {
    if (!existingDeptSlug) return;
    try {
      await deleteExperienceImage(hotelSlug, existingDeptSlug, imgId);
      setGallery((prev) => prev.filter((img) => img.id !== imgId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete image",
      );
    }
  }

  async function handleGalleryReorder(reordered: ExperienceImage[]) {
    if (!existing || !existingDeptSlug) return;
    setGallery(reordered);
    try {
      await reorderExperienceImages(
        hotelSlug,
        existingDeptSlug,
        existing.id,
        reordered.map((img) => img.id),
      );
    } catch {
      // Revert on error
      setGallery(
        [...(existing.gallery_images ?? [])].sort(
          (a, b) => a.display_order - b.display_order,
        ),
      );
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v);
        if (v) initForm();
      }}
    >
      <DialogTrigger asChild>
        {isEdit ? (
          <Button variant="ghost" size="icon" className="size-8">
            <Pencil className="size-3.5" />
          </Button>
        ) : (
          <Button size="sm">
            <Plus className="size-4 mr-1.5" /> New Experience
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Experience" : "New Experience"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update experience details" : "Add a new experience"}
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Department</Label>
            <Select
              value={form.department?.toString() ?? ""}
              onValueChange={(v) =>
                setForm({ ...form, department: Number(v) })
              }
              disabled={isEdit}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select department" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="exp-name">Name</Label>
            <Input
              id="exp-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <RichTextEditor
              content={form.description}
              onChange={(html) => setForm({ ...form, description: html })}
              placeholder="Describe this experience..."
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Category</Label>
              <Select
                value={form.category}
                onValueChange={(v) =>
                  setForm({ ...form, category: v as ExperienceCategory })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c}>
                      {c.charAt(0) + c.slice(1).toLowerCase()}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-price">Price Display</Label>
              <Input
                id="exp-price"
                value={form.price_display}
                onChange={(e) =>
                  setForm({ ...form, price_display: e.target.value })
                }
                placeholder="e.g. \u20B92,500 / person"
              />
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="exp-timing">Timing</Label>
              <Input
                id="exp-timing"
                value={form.timing}
                onChange={(e) => setForm({ ...form, timing: e.target.value })}
                placeholder="10 AM - 5 PM"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-duration">Duration</Label>
              <Input
                id="exp-duration"
                value={form.duration}
                onChange={(e) =>
                  setForm({ ...form, duration: e.target.value })
                }
                placeholder="2 hours"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="exp-capacity">Capacity</Label>
              <Input
                id="exp-capacity"
                value={form.capacity}
                onChange={(e) =>
                  setForm({ ...form, capacity: e.target.value })
                }
                placeholder="2-4 guests"
              />
            </div>
          </div>

          {/* Photo & Cover */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label>Photo</Label>
              <ImageUploadArea
                value={form.photo}
                existingUrl={existing?.photo}
                onChange={(file) => setForm({ ...form, photo: file })}
              />
            </div>
            <div className="space-y-2">
              <Label>Cover Image</Label>
              <ImageUploadArea
                value={form.cover_image}
                existingUrl={existing?.cover_image}
                onChange={(file) => setForm({ ...form, cover_image: file })}
              />
            </div>
          </div>

          {/* Gallery Images (edit mode only) */}
          {isEdit && existing && (
            <div className="space-y-2">
              <Label>Gallery Images</Label>
              <p className="text-xs text-muted-foreground">
                Additional photos shown in the experience detail page. Drag to
                reorder.
              </p>
              {gallery.length > 0 && (
                <SortableList
                  items={gallery}
                  onReorder={handleGalleryReorder}
                  renderItem={(img, dragHandle) => (
                    <div className="flex items-center gap-2 rounded-md border p-2 bg-background mb-1">
                      <button
                        type="button"
                        ref={dragHandle.ref}
                        className="cursor-grab touch-none text-muted-foreground hover:text-foreground"
                        {...dragHandle.listeners}
                        {...dragHandle.attributes}
                      >
                        <GripVertical className="size-3.5" />
                      </button>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img.image}
                        alt={img.alt_text || "Gallery image"}
                        className="h-12 w-16 rounded object-cover"
                      />
                      <span className="flex-1 text-xs text-muted-foreground truncate">
                        {img.alt_text || `Image #${img.id}`}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="size-7 text-destructive hover:text-destructive"
                        onClick={() => handleGalleryDelete(img.id)}
                      >
                        <Trash2 className="size-3" />
                      </Button>
                    </div>
                  )}
                />
              )}
              <label className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed p-3 text-sm text-muted-foreground hover:border-muted-foreground/50 transition-colors">
                {uploading ? (
                  <Loader2 className="size-4 animate-spin" />
                ) : (
                  <Upload className="size-4" />
                )}
                {uploading ? "Uploading..." : "Add gallery images"}
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  disabled={uploading}
                  onChange={(e) => {
                    if (e.target.files?.length) {
                      handleGalleryUpload(e.target.files);
                      e.target.value = "";
                    }
                  }}
                />
              </label>
            </div>
          )}

          {/* Highlights */}
          <div className="space-y-2">
            <Label>Highlights</Label>
            <p className="text-xs text-muted-foreground">
              Key selling points displayed as bullet points to guests
            </p>
            <div className="flex gap-2">
              <Input
                value={highlightInput}
                onChange={(e) => setHighlightInput(e.target.value)}
                placeholder="Add a highlight..."
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    addHighlight();
                  }
                }}
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addHighlight}
              >
                Add
              </Button>
            </div>
            {form.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-2">
                {form.highlights.map((h, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {h}
                    <button
                      onClick={() => removeHighlight(i)}
                      className="ml-0.5"
                    >
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </div>

          <div className="flex items-center justify-between">
            <Label>Active</Label>
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm({ ...form, is_active: v })}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            disabled={saving || !form.name || !form.department}
          >
            {saving && <Loader2 className="size-4 animate-spin mr-1.5" />}
            {isEdit ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
