"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getDepartments,
  getExperience,
  createExperience,
  updateExperience,
  uploadExperienceImage,
  deleteExperienceImage,
  reorderExperienceImages,
} from "@/lib/concierge-api";
import type {
  ContentStatus,
  Department,
  ExperienceCategory,
  ExperienceImage,
} from "@/lib/concierge-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Save,
  Trash2,
  X,
  GripVertical,
  Upload,
} from "lucide-react";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ImageUploadArea } from "@/components/dashboard/ImageUploadArea";
import { SortableList } from "@/components/dashboard/SortableList";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useLocalDraft } from "@/hooks/use-local-draft";

const CATEGORIES: ExperienceCategory[] = [
  "DINING",
  "SPA",
  "ACTIVITY",
  "TOUR",
  "TRANSPORT",
  "OTHER",
];

interface ExpFormData {
  department: number | null;
  name: string;
  description: string;
  category: ExperienceCategory;
  price_display: string;
  timing: string;
  duration: string;
  capacity: string;
  highlights: string[];
  status: ContentStatus;
}

const EMPTY_FORM: ExpFormData = {
  department: null,
  name: "",
  description: "",
  category: "ACTIVITY",
  price_display: "",
  timing: "",
  duration: "",
  capacity: "",
  highlights: [],
  status: "DRAFT",
};

interface ExperienceEditorProps {
  deptSlug: string;
  /** Experience ID to edit. Omit for create mode. */
  expId?: number;
}

export function ExperienceEditor({ deptSlug, expId }: ExperienceEditorProps) {
  const isEdit = !!expId;
  const router = useRouter();
  const { activeHotelSlug } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [serverData, setServerData] = useState<ExpFormData | null>(null);
  const [highlightInput, setHighlightInput] = useState("");

  // Gallery state (edit mode only)
  const [gallery, setGallery] = useState<ExperienceImage[]>([]);
  const [uploading, setUploading] = useState(false);

  const draftKey = `exp:${activeHotelSlug}:${deptSlug}:${expId || "new"}`;
  const {
    data: form,
    setData: setForm,
    hasDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
    lastSaved: draftLastSaved,
  } = useLocalDraft<ExpFormData>(draftKey, EMPTY_FORM);

  const isDirty = useMemo(() => {
    if (!serverData && !isEdit) {
      return form.name.trim() !== "" || form.description.trim() !== "" || photo !== null;
    }
    if (!serverData) return false;
    return (
      form.name !== serverData.name ||
      form.description !== serverData.description ||
      form.category !== serverData.category ||
      form.price_display !== serverData.price_display ||
      form.timing !== serverData.timing ||
      form.duration !== serverData.duration ||
      form.capacity !== serverData.capacity ||
      form.status !== serverData.status ||
      JSON.stringify(form.highlights) !== JSON.stringify(serverData.highlights) ||
      photo !== null ||
      coverImage !== null
    );
  }, [form, serverData, photo, coverImage, isEdit]);

  const { guardNavigation, confirmDialogProps } = useUnsavedChanges(isDirty);

  const backUrl = "/dashboard/experiences";

  // Fetch data
  useEffect(() => {
    if (!activeHotelSlug) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const depts = await getDepartments(activeHotelSlug!);
        if (cancelled) return;
        setDepartments(depts);

        const dept = depts.find((d) => d.slug === deptSlug);
        if (!dept) {
          setError("Department not found");
          setLoading(false);
          return;
        }

        if (isEdit && expId) {
          const exp = await getExperience(activeHotelSlug!, deptSlug, expId);
          if (cancelled) return;
          const data: ExpFormData = {
            department: exp.department,
            name: exp.name,
            description: exp.description,
            category: exp.category,
            price_display: exp.price_display,
            timing: exp.timing,
            duration: exp.duration,
            capacity: exp.capacity ?? "",
            highlights: exp.highlights ?? [],
            status: exp.status,
          };
          setServerData(data);
          setExistingPhotoUrl(exp.photo);
          setExistingCoverUrl(exp.cover_image);
          setGallery(
            [...(exp.gallery_images ?? [])].sort(
              (a, b) => a.display_order - b.display_order
            )
          );
          if (!hasDraft) {
            setForm(data);
          }
        } else {
          // Create mode — pre-select department
          if (!hasDraft) {
            setForm({ ...EMPTY_FORM, department: dept.id });
          }
        }
      } catch {
        if (!cancelled) setError("Failed to load data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeHotelSlug, deptSlug, expId, isEdit]);

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
    fd.append("status", form.status);
    if (form.department) fd.append("department", String(form.department));
    if (photo) fd.append("photo", photo);
    if (coverImage) fd.append("cover_image", coverImage);
    return fd;
  }

  async function handleSave() {
    if (!activeHotelSlug) return;

    const dept = departments.find((d) => d.id === form.department);
    if (!dept) {
      setError("Please select a department");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      if (isEdit && expId) {
        await updateExperience(
          activeHotelSlug,
          dept.slug,
          expId,
          buildFormData()
        );
        clearDraft();
        router.push(backUrl);
      } else {
        const created = await createExperience(
          activeHotelSlug,
          dept.slug,
          buildFormData()
        );
        clearDraft();
        // Redirect to edit mode so gallery management is available
        router.push(
          `/dashboard/departments/${dept.slug}/experiences/${created.id}/edit`
        );
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save experience"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    guardNavigation(() => router.push(backUrl));
  }

  function handleDiscardDraft() {
    discardDraft();
    setPhoto(null);
    setCoverImage(null);
    if (serverData) {
      setForm(serverData);
    } else {
      // Create mode — restore with pre-selected department
      const dept = departments.find((d) => d.slug === deptSlug);
      setForm({ ...EMPTY_FORM, department: dept?.id ?? null });
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
    if (!activeHotelSlug || !expId) return;
    setUploading(true);
    try {
      for (const file of Array.from(files)) {
        const fd = new FormData();
        fd.append("image", file);
        const img = await uploadExperienceImage(
          activeHotelSlug,
          deptSlug,
          expId,
          fd
        );
        setGallery((prev) => [...prev, img]);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to upload image"
      );
    } finally {
      setUploading(false);
    }
  }

  async function handleGalleryDelete(imgId: number) {
    if (!activeHotelSlug) return;
    try {
      await deleteExperienceImage(activeHotelSlug, deptSlug, imgId);
      setGallery((prev) => prev.filter((img) => img.id !== imgId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete image"
      );
    }
  }

  async function handleGalleryReorder(reordered: ExperienceImage[]) {
    if (!activeHotelSlug || !expId) return;
    const prev = [...gallery];
    setGallery(reordered);
    try {
      await reorderExperienceImages(
        activeHotelSlug,
        deptSlug,
        expId,
        reordered.map((img) => img.id)
      );
    } catch {
      setGallery(prev);
    }
  }

  if (!activeHotelSlug) return null;

  if (loading) {
    return (
      <div className="flex flex-col">
        <EditorHeader
          title="Loading..."
          onBack={() => router.push(backUrl)}
          saving={false}
          canSave={false}
          onSave={() => {}}
        />
        <div className="flex-1 p-4 md:p-6 max-w-2xl space-y-4">
          <Skeleton className="h-32 w-full rounded-lg" />
          <Skeleton className="h-48 w-full rounded-lg" />
          <Skeleton className="h-32 w-full rounded-lg" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <EditorHeader
        title={isEdit ? "Edit Experience" : "New Experience"}
        onBack={handleBack}
        saving={saving}
        canSave={!!form.name.trim() && !!form.department}
        onSave={handleSave}
        draftLastSaved={draftLastSaved}
      />

      <div className="flex-1 p-4 md:p-6 max-w-2xl space-y-4">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {hasDraft && (
          <Alert>
            <AlertDescription className="flex items-center justify-between">
              <span>You have an unsaved draft. Restore it?</span>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={handleDiscardDraft}>
                  Discard
                </Button>
                <Button size="sm" onClick={restoreDraft}>
                  Restore
                </Button>
              </div>
            </AlertDescription>
          </Alert>
        )}

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Basic Info</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
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
                placeholder="e.g. Swedish Massage, Dinner Buffet"
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
                  placeholder="e.g. ₹2,500 / person"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Description</CardTitle>
          </CardHeader>
          <CardContent>
            <RichTextEditor
              content={form.description}
              onChange={(html) => setForm({ ...form, description: html })}
              placeholder="Describe this experience..."
            />
          </CardContent>
        </Card>

        {/* Details */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="exp-timing">Timing</Label>
                <Input
                  id="exp-timing"
                  value={form.timing}
                  onChange={(e) =>
                    setForm({ ...form, timing: e.target.value })
                  }
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
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Photo</Label>
                <ImageUploadArea
                  value={photo}
                  existingUrl={existingPhotoUrl}
                  onChange={setPhoto}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <ImageUploadArea
                  value={coverImage}
                  existingUrl={existingCoverUrl}
                  onChange={setCoverImage}
                />
              </div>
            </div>

            {/* Gallery Images (edit mode only) */}
            {isEdit && expId && (
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

            {!isEdit && (
              <p className="text-xs text-muted-foreground">
                Save the experience first to manage gallery images.
              </p>
            )}
          </CardContent>
        </Card>

        {/* Highlights */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Highlights</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
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
              <Button type="button" variant="outline" size="sm" onClick={addHighlight}>
                Add
              </Button>
            </div>
            {form.highlights.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {form.highlights.map((h, i) => (
                  <Badge key={i} variant="secondary" className="gap-1">
                    {h}
                    <button onClick={() => removeHighlight(i)} className="ml-0.5">
                      <X className="size-3" />
                    </button>
                  </Badge>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select
                value={form.status}
                onValueChange={(v) =>
                  setForm({ ...form, status: v as ContentStatus })
                }
              >
                <SelectTrigger className="w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="DRAFT">Draft</SelectItem>
                  <SelectItem value="PUBLISHED">Published</SelectItem>
                  <SelectItem value="UNPUBLISHED">Unpublished</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Only published experiences are visible to guests
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog {...confirmDialogProps} />
    </div>
  );
}

// ---- Sticky Header ----

function EditorHeader({
  title,
  onBack,
  saving,
  canSave,
  onSave,
  draftLastSaved,
}: {
  title: string;
  onBack: () => void;
  saving: boolean;
  canSave: boolean;
  onSave: () => void;
  draftLastSaved?: Date | null;
}) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
      <Button variant="ghost" size="icon" onClick={onBack}>
        <ArrowLeft className="size-4" />
      </Button>
      <h1 className="text-lg font-semibold">{title}</h1>
      {draftLastSaved && (
        <span className="text-xs text-muted-foreground ml-2">
          Draft saved {draftLastSaved.toLocaleTimeString()}
        </span>
      )}
      <div className="ml-auto">
        <Button onClick={onSave} disabled={saving || !canSave}>
          {saving ? (
            <Loader2 className="size-4 animate-spin mr-1.5" />
          ) : (
            <Save className="size-4 mr-1.5" />
          )}
          Save
        </Button>
      </div>
    </header>
  );
}
