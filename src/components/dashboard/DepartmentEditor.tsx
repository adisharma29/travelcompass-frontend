"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  createDepartment,
  getDepartment,
  updateDepartment,
} from "@/lib/concierge-api";
import type {
  ContentStatus,
  DepartmentSchedule,
} from "@/lib/concierge-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { ArrowLeft, AlertCircle, Loader2, Save } from "lucide-react";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ImageUploadArea } from "@/components/dashboard/ImageUploadArea";
import { TimezoneCombobox } from "@/components/dashboard/TimezoneCombobox";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";
import { useLocalDraft } from "@/hooks/use-local-draft";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

const DEFAULT_SCHEDULE: DepartmentSchedule = {
  timezone: "Asia/Kolkata",
  default: [["09:00", "22:00"]],
};

interface DeptFormData {
  name: string;
  description: string;
  is_ops: boolean;
  status: ContentStatus;
  schedule: DepartmentSchedule;
}

const EMPTY_FORM: DeptFormData = {
  name: "",
  description: "",
  is_ops: false,
  status: "DRAFT",
  schedule: DEFAULT_SCHEDULE,
};

interface DepartmentEditorProps {
  /** Slug of the department to edit. Omit for create mode. */
  deptSlug?: string;
}

export function DepartmentEditor({ deptSlug }: DepartmentEditorProps) {
  const isEdit = !!deptSlug;
  const router = useRouter();
  const { activeHotelSlug } = useAuth();
  const slugRef = useRef(activeHotelSlug);
  slugRef.current = activeHotelSlug;

  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [photo, setPhoto] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [icon, setIcon] = useState<File | null>(null);
  const [existingIconUrl, setExistingIconUrl] = useState<string | null>(null);
  const [iconCleared, setIconCleared] = useState(false);
  const [serverData, setServerData] = useState<DeptFormData | null>(null);

  const draftKey = `dept:${activeHotelSlug}:${deptSlug || "new"}`;
  const {
    data: form,
    setData: setForm,
    hasDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
    lastSaved: draftLastSaved,
  } = useLocalDraft<DeptFormData>(draftKey, EMPTY_FORM);

  // Track dirty state by comparing against server data
  const isDirty = useMemo(() => {
    if (!serverData && !isEdit) {
      // Create mode: dirty if any field has content
      return form.name.trim() !== "" || form.description.trim() !== "" || photo !== null || icon !== null;
    }
    if (!serverData) return false;
    return (
      form.name !== serverData.name ||
      form.description !== serverData.description ||
      form.is_ops !== serverData.is_ops ||
      form.status !== serverData.status ||
      JSON.stringify(form.schedule) !== JSON.stringify(serverData.schedule) ||
      photo !== null ||
      icon !== null ||
      iconCleared
    );
  }, [form, serverData, photo, icon, iconCleared, isEdit]);

  const { guardNavigation, confirmDialogProps } = useUnsavedChanges(isDirty);

  // Fetch department data for edit mode
  useEffect(() => {
    if (!isEdit || !activeHotelSlug || !deptSlug) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const dept = await getDepartment(activeHotelSlug!, deptSlug!);
        if (cancelled) return;
        const data: DeptFormData = {
          name: dept.name,
          description: dept.description,
          is_ops: dept.is_ops,
          status: dept.status,
          schedule: dept.schedule ?? DEFAULT_SCHEDULE,
        };
        setServerData(data);
        setExistingPhotoUrl(dept.photo);
        setExistingIconUrl(dept.icon || null);
        // Only set form if no draft to restore
        if (!hasDraft) {
          setForm(data);
        }
      } catch {
        if (!cancelled) setError("Failed to load department");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEdit, activeHotelSlug, deptSlug]);

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("is_ops", form.is_ops ? "true" : "false");
    fd.append("status", form.status);
    fd.append("schedule", JSON.stringify(form.schedule));
    if (photo) fd.append("photo", photo);
    if (icon) fd.append("icon", icon);
    else if (iconCleared) fd.append("icon_clear", "true");
    return fd;
  }

  async function handleSave() {
    if (!activeHotelSlug) return;
    setSaving(true);
    setError(null);
    try {
      if (isEdit && deptSlug) {
        await updateDepartment(activeHotelSlug, deptSlug, buildFormData());
      } else {
        await createDepartment(activeHotelSlug, buildFormData());
      }
      clearDraft();
      router.push("/dashboard/departments");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save department"
      );
    } finally {
      setSaving(false);
    }
  }

  function handleBack() {
    guardNavigation(() => router.push("/dashboard/departments"));
  }

  function handleDiscardDraft() {
    discardDraft();
    setPhoto(null);
    setIcon(null);
    setIconCleared(false);
    if (serverData) {
      setForm(serverData);
    }
  }

  if (!activeHotelSlug) return null;

  if (loading) {
    return (
      <div className="flex flex-col">
        <EditorHeader
          title="Loading..."
          onBack={() => router.push("/dashboard/departments")}
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
        title={isEdit ? "Edit Department" : "New Department"}
        onBack={handleBack}
        saving={saving}
        canSave={!!form.name.trim()}
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
              <Label htmlFor="dept-name">Name</Label>
              <Input
                id="dept-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Dining, Spa, Reception"
              />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <ImageUploadArea
                value={icon}
                existingUrl={iconCleared ? null : existingIconUrl}
                onChange={(file) => {
                  setIcon(file);
                  if (!file && existingIconUrl) setIconCleared(true);
                  if (file) setIconCleared(false);
                }}
              />
            </div>
            <div className="space-y-2">
              <Label>Photo</Label>
              <ImageUploadArea
                value={photo}
                existingUrl={existingPhotoUrl}
                onChange={setPhoto}
              />
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
              placeholder="Describe this department..."
            />
          </CardContent>
        </Card>

        {/* Schedule */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Schedule</CardTitle>
          </CardHeader>
          <CardContent>
            <ScheduleEditor
              schedule={form.schedule}
              onChange={(s) => setForm({ ...form, schedule: s })}
            />
          </CardContent>
        </Card>

        {/* Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Operations Department</Label>
                <p className="text-xs text-muted-foreground">
                  Internal ops (not guest-facing)
                </p>
              </div>
              <Switch
                checked={form.is_ops}
                onCheckedChange={(v) => setForm({ ...form, is_ops: v })}
              />
            </div>
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
                Only published departments are visible to guests
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

// ---- Schedule Editor (extracted from departments page) ----

function ScheduleEditor({
  schedule,
  onChange,
}: {
  schedule: DepartmentSchedule;
  onChange: (s: DepartmentSchedule) => void;
}) {
  const defaultSlot = schedule.default?.[0] ?? ["09:00", "22:00"];

  function setDefaultHours(start: string, end: string) {
    onChange({ ...schedule, default: [[start, end]] });
  }

  function toggleDayOverride(day: string) {
    const overrides = { ...(schedule.overrides ?? {}) };
    if (overrides[day]) {
      delete overrides[day];
    } else {
      overrides[day] = [[defaultSlot[0], defaultSlot[1]]];
    }
    onChange({ ...schedule, overrides });
  }

  function setDayHours(day: string, start: string, end: string) {
    const overrides = { ...(schedule.overrides ?? {}) };
    overrides[day] = [[start, end]];
    onChange({ ...schedule, overrides });
  }

  return (
    <div className="space-y-3">
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Timezone</Label>
        <TimezoneCombobox
          value={schedule.timezone}
          onChange={(tz) => onChange({ ...schedule, timezone: tz })}
        />
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Default Hours</Label>
        <div className="flex items-center gap-2">
          <Input
            type="time"
            value={defaultSlot[0]}
            onChange={(e) => setDefaultHours(e.target.value, defaultSlot[1])}
            className="w-auto"
          />
          <span className="text-sm text-muted-foreground">to</span>
          <Input
            type="time"
            value={defaultSlot[1]}
            onChange={(e) => setDefaultHours(defaultSlot[0], e.target.value)}
            className="w-auto"
          />
        </div>
      </div>
      <div className="space-y-2">
        <Label className="text-xs text-muted-foreground">Day Overrides</Label>
        <div className="flex flex-wrap gap-2">
          {DAYS.map((day) => {
            const override = schedule.overrides?.[day];
            const slot = override?.[0];
            return (
              <div key={day} className="flex items-center gap-1.5">
                <Button
                  type="button"
                  variant={override ? "default" : "outline"}
                  size="sm"
                  className="w-14 text-xs"
                  onClick={() => toggleDayOverride(day)}
                >
                  {day}
                </Button>
                {override && slot && (
                  <>
                    <Input
                      type="time"
                      value={slot[0]}
                      onChange={(e) =>
                        setDayHours(day, e.target.value, slot[1])
                      }
                      className="w-auto h-8 text-xs"
                    />
                    <span className="text-xs text-muted-foreground">
                      {"\u2013"}
                    </span>
                    <Input
                      type="time"
                      value={slot[1]}
                      onChange={(e) =>
                        setDayHours(day, slot[0], e.target.value)
                      }
                      className="w-auto h-8 text-xs"
                    />
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
