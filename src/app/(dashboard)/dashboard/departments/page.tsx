"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getDepartments,
  createDepartment,
  updateDepartment,
  deleteDepartment,
  reorderDepartments,
} from "@/lib/concierge-api";
import type { Department, DepartmentSchedule } from "@/lib/concierge-types";
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
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Plus,
  Loader2,
  AlertCircle,
  Pencil,
  Trash2,
  GripVertical,
} from "lucide-react";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { SortableList, type DragHandleProps } from "@/components/dashboard/SortableList";
import { ImageUploadArea } from "@/components/dashboard/ImageUploadArea";
import { TimezoneCombobox } from "@/components/dashboard/TimezoneCombobox";
import { HtmlContent } from "@/components/dashboard/HtmlContent";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

const DAYS = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"] as const;

const DEFAULT_SCHEDULE: DepartmentSchedule = {
  timezone: "Asia/Kolkata",
  default: [["09:00", "22:00"]],
};

interface DeptForm {
  name: string;
  description: string;
  icon: string;
  is_active: boolean;
  is_ops: boolean;
  schedule: DepartmentSchedule;
  photo: File | null;
}

const EMPTY_FORM: DeptForm = {
  name: "",
  description: "",
  icon: "",
  is_active: true,
  is_ops: false,
  schedule: DEFAULT_SCHEDULE,
  photo: null,
};

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
      if (slugRef.current !== slug) return; // stale
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
          <DeptDialog hotelSlug={activeHotelSlug} onSaved={fetchData} />
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
              renderItem={(dept, dragHandle) => (
                <DeptCard
                  dept={dept}
                  hotelSlug={activeHotelSlug}
                  onUpdated={fetchData}
                  dragHandle={dragHandle}
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
  onUpdated,
  dragHandle,
}: {
  dept: Department;
  hotelSlug: string;
  onUpdated: () => void;
  dragHandle: DragHandleProps;
}) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteDepartment(hotelSlug, dept.slug);
      onUpdated();
    } finally {
      setDeleting(false);
    }
  }

  const scheduleStr =
    dept.schedule?.default
      ?.map(([s, e]) => `${s}\u2013${e}`)
      .join(", ") ?? "Always open";

  return (
    <Card className={!dept.is_active ? "opacity-60" : ""}>
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
            {!dept.is_active && <Badge variant="outline">Inactive</Badge>}
            {dept.is_ops && <Badge variant="secondary">Ops</Badge>}
          </div>
          {dept.description ? (
            <HtmlContent
              html={dept.description}
              className="text-xs text-muted-foreground line-clamp-2 mt-0.5 [&_*]:!m-0 [&_*]:!p-0"
            />
          ) : (
            <p className="text-xs text-muted-foreground mt-0.5">No description</p>
          )}
          <div className="flex items-center gap-3 mt-1 text-xs text-muted-foreground">
            <span>{dept.experiences.length} experiences</span>
            <span>{scheduleStr}</span>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <DeptDialog
            hotelSlug={hotelSlug}
            existing={dept}
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
        title={`Delete "${dept.name}"?`}
        description={`This will also delete all ${dept.experiences.length} experience${dept.experiences.length === 1 ? "" : "s"} in this department. This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </Card>
  );
}

function DeptDialog({
  hotelSlug,
  existing,
  onSaved,
}: {
  hotelSlug: string;
  existing?: Department;
  onSaved: () => void;
}) {
  const isEdit = !!existing;
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<DeptForm>(EMPTY_FORM);

  function initForm() {
    if (existing) {
      setForm({
        name: existing.name,
        description: existing.description,
        icon: existing.icon ?? "",
        is_active: existing.is_active,
        is_ops: existing.is_ops,
        schedule: existing.schedule ?? DEFAULT_SCHEDULE,
        photo: null,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }

  function buildFormData(): FormData {
    const fd = new FormData();
    fd.append("name", form.name);
    fd.append("description", form.description);
    fd.append("icon", form.icon);
    fd.append("is_active", form.is_active ? "true" : "false");
    fd.append("is_ops", form.is_ops ? "true" : "false");
    fd.append("schedule", JSON.stringify(form.schedule));
    if (form.photo) fd.append("photo", form.photo);
    return fd;
  }

  async function handleSave() {
    setSaving(true);
    setError(null);
    try {
      if (isEdit) {
        await updateDepartment(hotelSlug, existing.slug, buildFormData());
      } else {
        await createDepartment(hotelSlug, buildFormData());
      }
      setOpen(false);
      onSaved();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save department",
      );
    } finally {
      setSaving(false);
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
            <Plus className="size-4 mr-1.5" /> New Department
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? "Edit Department" : "New Department"}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? "Update department details" : "Create a new department"}
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
            <Label htmlFor="dept-name">Name</Label>
            <Input
              id="dept-name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Description</Label>
            <RichTextEditor
              content={form.description}
              onChange={(html) => setForm({ ...form, description: html })}
              placeholder="Describe this department..."
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="dept-icon">Icon</Label>
            <Input
              id="dept-icon"
              value={form.icon}
              onChange={(e) => setForm({ ...form, icon: e.target.value })}
              placeholder="e.g. utensils, spa"
            />
          </div>
          <div className="space-y-2">
            <Label>Photo</Label>
            <ImageUploadArea
              value={form.photo}
              existingUrl={existing?.photo}
              onChange={(file) => setForm({ ...form, photo: file })}
            />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Active</Label>
              <p className="text-xs text-muted-foreground">
                Visible to guests
              </p>
            </div>
            <Switch
              checked={form.is_active}
              onCheckedChange={(v) => setForm({ ...form, is_active: v })}
            />
          </div>
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

          <Separator />
          <ScheduleEditor
            schedule={form.schedule}
            onChange={(s) => setForm({ ...form, schedule: s })}
          />
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={saving || !form.name}>
            {saving && <Loader2 className="size-4 animate-spin mr-1.5" />}
            {isEdit ? "Save" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

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
      <Label>Schedule</Label>
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
                    <span className="text-xs text-muted-foreground">\u2013</span>
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
