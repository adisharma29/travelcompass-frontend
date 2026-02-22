"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import {
  getDepartments,
  getEvent,
  createEvent,
  updateEvent,
} from "@/lib/concierge-api";
import type {
  ContentStatus,
  Department,
  Experience,
  ExperienceCategory,
  RecurrenceRule,
} from "@/lib/concierge-types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
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
  X,
} from "lucide-react";
import { RichTextEditor } from "@/components/dashboard/RichTextEditor";
import { ImageUploadArea } from "@/components/dashboard/ImageUploadArea";
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

const WEEKDAYS = [
  { key: "MON", label: "Mon" },
  { key: "TUE", label: "Tue" },
  { key: "WED", label: "Wed" },
  { key: "THU", label: "Thu" },
  { key: "FRI", label: "Fri" },
  { key: "SAT", label: "Sat" },
  { key: "SUN", label: "Sun" },
];

interface EventFormData {
  name: string;
  description: string;
  category: ExperienceCategory;
  price_display: string;
  highlights: string[];
  event_start: string;
  event_end: string;
  is_all_day: boolean;
  is_recurring: boolean;
  recurrence_freq: "daily" | "weekly" | "monthly";
  recurrence_interval: number;
  recurrence_days: string[];
  recurrence_until: string;
  booking_opens_hours: string;
  booking_closes_hours: string;
  department: number | null;
  experience: number | null;
  is_featured: boolean;
  auto_expire: boolean;
  status: ContentStatus;
}

const EMPTY_FORM: EventFormData = {
  name: "",
  description: "",
  category: "OTHER",
  price_display: "",
  highlights: [],
  event_start: "",
  event_end: "",
  is_all_day: false,
  is_recurring: false,
  recurrence_freq: "weekly",
  recurrence_interval: 1,
  recurrence_days: [],
  recurrence_until: "",
  booking_opens_hours: "",
  booking_closes_hours: "",
  department: null,
  experience: null,
  is_featured: false,
  auto_expire: true,
  status: "DRAFT",
};

interface EventEditorProps {
  eventId?: number;
}

export function EventEditor({ eventId }: EventEditorProps) {
  const isEdit = !!eventId;
  const router = useRouter();
  const { activeHotelSlug } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [photo, setPhoto] = useState<File | null>(null);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [existingPhotoUrl, setExistingPhotoUrl] = useState<string | null>(null);
  const [existingCoverUrl, setExistingCoverUrl] = useState<string | null>(null);
  const [photoCleared, setPhotoCleared] = useState(false);
  const [coverCleared, setCoverCleared] = useState(false);

  const handlePhotoChange = (file: File | null) => {
    if (file) {
      setPhoto(file);
      setPhotoCleared(false);
    } else {
      setPhoto(null);
      if (existingPhotoUrl) {
        setExistingPhotoUrl(null);
        setPhotoCleared(true);
      }
    }
  };

  const handleCoverChange = (file: File | null) => {
    if (file) {
      setCoverImage(file);
      setCoverCleared(false);
    } else {
      setCoverImage(null);
      if (existingCoverUrl) {
        setExistingCoverUrl(null);
        setCoverCleared(true);
      }
    }
  };
  const [serverData, setServerData] = useState<EventFormData | null>(null);
  const [highlightInput, setHighlightInput] = useState("");

  const draftKey = `event:${activeHotelSlug}:${eventId || "new"}`;
  const {
    data: form,
    setData: setForm,
    hasDraft,
    restoreDraft,
    discardDraft,
    clearDraft,
    setBaseline,
    lastSaved: draftLastSaved,
  } = useLocalDraft<EventFormData>(draftKey, EMPTY_FORM);

  const isDirty = useMemo(() => {
    if (!serverData && !isEdit) {
      return (
        form.name.trim() !== "" ||
        form.description.trim() !== "" ||
        photo !== null
      );
    }
    if (!serverData) return false;
    return (
      form.name !== serverData.name ||
      form.description !== serverData.description ||
      form.category !== serverData.category ||
      form.price_display !== serverData.price_display ||
      form.event_start !== serverData.event_start ||
      form.event_end !== serverData.event_end ||
      form.is_all_day !== serverData.is_all_day ||
      form.is_recurring !== serverData.is_recurring ||
      form.recurrence_freq !== serverData.recurrence_freq ||
      form.recurrence_interval !== serverData.recurrence_interval ||
      form.recurrence_until !== serverData.recurrence_until ||
      form.booking_opens_hours !== serverData.booking_opens_hours ||
      form.booking_closes_hours !== serverData.booking_closes_hours ||
      form.department !== serverData.department ||
      form.experience !== serverData.experience ||
      form.is_featured !== serverData.is_featured ||
      form.auto_expire !== serverData.auto_expire ||
      form.status !== serverData.status ||
      JSON.stringify(form.highlights) !==
        JSON.stringify(serverData.highlights) ||
      JSON.stringify(form.recurrence_days) !==
        JSON.stringify(serverData.recurrence_days) ||
      photo !== null ||
      coverImage !== null ||
      photoCleared ||
      coverCleared
    );
  }, [form, serverData, photo, coverImage, photoCleared, coverCleared, isEdit]);

  const { guardNavigation, confirmDialogProps } = useUnsavedChanges(isDirty);

  const backUrl = "/dashboard/events";

  useEffect(() => {
    if (!activeHotelSlug) return;
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError(null);
      try {
        const depts = await getDepartments(activeHotelSlug!);
        if (cancelled) return;
        const nonOps = depts.filter((d) => !d.is_ops);
        setDepartments(nonOps);
        // Flatten experiences from departments for the experience picker
        setExperiences(nonOps.flatMap((d) => d.experiences ?? []));

        if (isEdit && eventId) {
          const evt = await getEvent(activeHotelSlug!, eventId);
          if (cancelled) return;
          const rule = evt.recurrence_rule as RecurrenceRule | null;
          const data: EventFormData = {
            name: evt.name,
            description: evt.description,
            category: evt.category,
            price_display: evt.price_display,
            highlights: evt.highlights ?? [],
            event_start: evt.event_start
              ? toDatetimeLocal(evt.event_start)
              : "",
            event_end: evt.event_end ? toDatetimeLocal(evt.event_end) : "",
            is_all_day: evt.is_all_day,
            is_recurring: evt.is_recurring,
            recurrence_freq: rule?.freq ?? "weekly",
            recurrence_interval: rule?.interval ?? 1,
            recurrence_days: rule?.days ?? [],
            recurrence_until: rule?.until ?? "",
            booking_opens_hours: evt.booking_opens_hours != null ? String(evt.booking_opens_hours) : "",
            booking_closes_hours: evt.booking_closes_hours != null ? String(evt.booking_closes_hours) : "",
            department: evt.department,
            experience: evt.experience,
            is_featured: evt.is_featured,
            auto_expire: evt.auto_expire,
            status: evt.status,
          };
          setServerData(data);
          setExistingPhotoUrl(evt.photo);
          setExistingCoverUrl(evt.cover_image);
          // Mark server data as baseline so auto-save doesn't treat it as a draft
          const cleared = setBaseline(data);
          if (!hasDraft || cleared) {
            setForm(data);
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
  }, [activeHotelSlug, eventId, isEdit]);

  function buildPayload(): FormData | Record<string, unknown> {
    const hasFiles = photo || coverImage || photoCleared || coverCleared;
    if (hasFiles) {
      const fd = new FormData();
      fd.append("name", form.name);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("price_display", form.price_display);
      fd.append("highlights", JSON.stringify(form.highlights));
      fd.append("event_start", toISO(form.event_start));
      if (form.event_end) fd.append("event_end", toISO(form.event_end));
      else fd.append("event_end", "");
      fd.append("is_all_day", form.is_all_day ? "true" : "false");
      fd.append("is_recurring", form.is_recurring ? "true" : "false");
      if (form.is_recurring) {
        fd.append("recurrence_rule", JSON.stringify(buildRecurrenceRule()));
      } else {
        fd.append("recurrence_rule", JSON.stringify(null));
      }
      fd.append("booking_opens_hours", form.booking_opens_hours);
      fd.append("booking_closes_hours", form.booking_closes_hours);
      if (form.department) fd.append("department", String(form.department));
      else fd.append("department", "");
      if (form.experience) fd.append("experience", String(form.experience));
      else fd.append("experience", "");
      fd.append("is_featured", form.is_featured ? "true" : "false");
      fd.append("auto_expire", form.auto_expire ? "true" : "false");
      fd.append("status", form.status);
      if (photo) fd.append("photo", photo);
      else if (photoCleared) fd.append("photo_clear", "true");
      if (coverImage) fd.append("cover_image", coverImage);
      else if (coverCleared) fd.append("cover_image_clear", "true");
      return fd;
    }

    return {
      name: form.name,
      description: form.description,
      category: form.category,
      price_display: form.price_display,
      highlights: form.highlights,
      event_start: toISO(form.event_start),
      event_end: form.event_end ? toISO(form.event_end) : null,
      is_all_day: form.is_all_day,
      is_recurring: form.is_recurring,
      recurrence_rule: form.is_recurring ? buildRecurrenceRule() : null,
      booking_opens_hours: form.booking_opens_hours !== "" ? Number(form.booking_opens_hours) : null,
      booking_closes_hours: form.booking_closes_hours !== "" ? Number(form.booking_closes_hours) : null,
      department: form.department,
      experience: form.experience,
      is_featured: form.is_featured,
      auto_expire: form.auto_expire,
      status: form.status,
    };
  }

  function buildRecurrenceRule(): RecurrenceRule {
    const rule: RecurrenceRule = {
      freq: form.recurrence_freq,
    };
    if (form.recurrence_interval > 1) {
      rule.interval = form.recurrence_interval;
    }
    if (form.recurrence_freq === "weekly" && form.recurrence_days.length > 0) {
      rule.days = form.recurrence_days;
    }
    if (form.recurrence_until) {
      rule.until = form.recurrence_until;
    }
    return rule;
  }

  async function handleSave() {
    if (!activeHotelSlug) return;
    if (!form.name.trim()) {
      setError("Name is required");
      return;
    }
    if (!form.event_start) {
      setError("Event start date/time is required");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      const payload = buildPayload();
      if (isEdit && eventId) {
        await updateEvent(activeHotelSlug, eventId, payload);
      } else {
        await createEvent(activeHotelSlug, payload);
      }
      clearDraft();
      router.push(backUrl);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
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
    setPhotoCleared(false);
    setCoverCleared(false);
    if (serverData) {
      setForm(serverData);
    } else {
      setForm(EMPTY_FORM);
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
        title={isEdit ? "Edit Event" : "New Event"}
        onBack={handleBack}
        saving={saving}
        canSave={
          !!form.name.trim() &&
          !!form.event_start &&
          !(
            form.booking_opens_hours !== "" &&
            form.booking_closes_hours !== "" &&
            Number(form.booking_opens_hours) > 0 &&
            Number(form.booking_closes_hours) > 0 &&
            Number(form.booking_opens_hours) < Number(form.booking_closes_hours)
          )
        }
        onSave={handleSave}
        draftLastSaved={draftLastSaved}
        missingFields={[
          ...(!form.name.trim() ? ["name"] : []),
          ...(!form.event_start ? ["start date"] : []),
        ]}
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
                <Button
                  size="sm"
                  variant="outline"
                  onClick={handleDiscardDraft}
                >
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
              <Label htmlFor="event-name">Name</Label>
              <Input
                id="event-name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Saturday Live Music, Spa Package"
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
                <Label htmlFor="event-price">Price Display</Label>
                <Input
                  id="event-price"
                  value={form.price_display}
                  onChange={(e) =>
                    setForm({ ...form, price_display: e.target.value })
                  }
                  placeholder="e.g. Free, ₹500 / person"
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
              placeholder="Describe this event..."
            />
          </CardContent>
        </Card>

        {/* Scheduling */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Scheduling</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                id="all-day"
                checked={form.is_all_day}
                onCheckedChange={(v) => setForm({ ...form, is_all_day: v })}
              />
              <Label htmlFor="all-day">All-day event</Label>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="event-start">
                  Start {form.is_all_day ? "Date" : "Date & Time"}
                </Label>
                <Input
                  id="event-start"
                  type={form.is_all_day ? "date" : "datetime-local"}
                  value={
                    form.is_all_day
                      ? form.event_start.split("T")[0]
                      : form.event_start
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      event_start: form.is_all_day
                        ? e.target.value + "T00:00"
                        : e.target.value,
                    })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="event-end">
                  End {form.is_all_day ? "Date" : "Date & Time"}{" "}
                  <span className="text-muted-foreground">(optional)</span>
                </Label>
                <Input
                  id="event-end"
                  type={form.is_all_day ? "date" : "datetime-local"}
                  value={
                    form.is_all_day
                      ? (form.event_end?.split("T")[0] ?? "")
                      : form.event_end
                  }
                  onChange={(e) =>
                    setForm({
                      ...form,
                      event_end: form.is_all_day
                        ? e.target.value
                          ? e.target.value + "T23:59"
                          : ""
                        : e.target.value,
                    })
                  }
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recurrence */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Recurrence</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Switch
                id="recurring"
                checked={form.is_recurring}
                onCheckedChange={(v) => setForm({ ...form, is_recurring: v })}
              />
              <Label htmlFor="recurring">Repeating event</Label>
            </div>
            {form.is_recurring && (
              <div className="space-y-4 pl-0.5">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm">Every</span>
                  <Input
                    type="number"
                    min={1}
                    value={form.recurrence_interval}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        recurrence_interval: Math.max(
                          1,
                          parseInt(e.target.value) || 1,
                        ),
                      })
                    }
                    className="w-16"
                  />
                  <Select
                    value={form.recurrence_freq}
                    onValueChange={(v) =>
                      setForm({
                        ...form,
                        recurrence_freq: v as "daily" | "weekly" | "monthly",
                      })
                    }
                  >
                    <SelectTrigger className="w-28">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="daily">
                        day{form.recurrence_interval > 1 ? "s" : ""}
                      </SelectItem>
                      <SelectItem value="weekly">
                        week{form.recurrence_interval > 1 ? "s" : ""}
                      </SelectItem>
                      <SelectItem value="monthly">
                        month{form.recurrence_interval > 1 ? "s" : ""}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                {form.recurrence_freq === "weekly" && (
                  <div className="space-y-2">
                    <Label>On days</Label>
                    <div className="flex flex-wrap gap-2">
                      {WEEKDAYS.map((day) => {
                        const active = form.recurrence_days.includes(day.key);
                        return (
                          <button
                            key={day.key}
                            type="button"
                            onClick={() =>
                              setForm((f) => ({
                                ...f,
                                recurrence_days: active
                                  ? f.recurrence_days.filter(
                                      (d) => d !== day.key,
                                    )
                                  : [...f.recurrence_days, day.key],
                              }))
                            }
                            className={`rounded-md px-3 py-1.5 text-xs font-medium border transition-colors ${
                              active
                                ? "bg-primary text-primary-foreground border-primary"
                                : "bg-background text-muted-foreground border-border hover:border-muted-foreground"
                            }`}
                          >
                            {day.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="recurrence-until">
                    Until{" "}
                    <span className="text-muted-foreground">(optional)</span>
                  </Label>
                  <Input
                    id="recurrence-until"
                    type="date"
                    value={form.recurrence_until}
                    onChange={(e) =>
                      setForm({ ...form, recurrence_until: e.target.value })
                    }
                    className="w-48"
                  />
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Booking Window */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Window</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="booking-opens">Bookings open</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="booking-opens"
                    type="number"
                    min={0}
                    max={8760}
                    value={form.booking_opens_hours}
                    onChange={(e) =>
                      setForm({ ...form, booking_opens_hours: e.target.value })
                    }
                    placeholder="Hotel default"
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    hours before start
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave blank to use hotel default. 0 = always open.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="booking-closes">Bookings close</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="booking-closes"
                    type="number"
                    min={0}
                    max={720}
                    value={form.booking_closes_hours}
                    onChange={(e) =>
                      setForm({ ...form, booking_closes_hours: e.target.value })
                    }
                    placeholder="Hotel default"
                    className="w-24"
                  />
                  <span className="text-sm text-muted-foreground">
                    hours before start
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Leave blank to use hotel default. 0 = no cutoff.
                </p>
              </div>
            </div>
            {form.booking_opens_hours !== "" &&
              form.booking_closes_hours !== "" &&
              Number(form.booking_opens_hours) > 0 &&
              Number(form.booking_closes_hours) > 0 &&
              Number(form.booking_opens_hours) < Number(form.booking_closes_hours) && (
                <Alert variant="destructive">
                  <AlertCircle className="size-4" />
                  <AlertDescription>
                    Opens must be greater than or equal to closes (e.g. opens
                    48h before, closes 2h before).
                  </AlertDescription>
                </Alert>
              )}
            {form.booking_opens_hours !== "" &&
              form.booking_closes_hours !== "" &&
              Number(form.booking_opens_hours) > 0 &&
              Number(form.booking_closes_hours) >= 0 &&
              form.event_start &&
              (() => {
                const opens = Number(form.booking_opens_hours);
                const closes = Number(form.booking_closes_hours);
                if (opens > 0 && closes >= 0 && opens >= closes) {
                  const start = new Date(form.event_start);
                  if (!isNaN(start.getTime())) {
                    const opensAt = new Date(start.getTime() - opens * 3600000);
                    const closesAt = new Date(start.getTime() - closes * 3600000);
                    const fmt = (d: Date) =>
                      d.toLocaleString(undefined, {
                        month: "short",
                        day: "numeric",
                        hour: "numeric",
                        minute: "2-digit",
                      });
                    return (
                      <p className="text-xs text-muted-foreground">
                        Bookings accepted from {fmt(opensAt)} until{" "}
                        {fmt(closesAt)}
                      </p>
                    );
                  }
                }
                return null;
              })()}
          </CardContent>
        </Card>

        {/* Linking */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Routing</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Department</Label>
              <Select
                value={form.department?.toString() ?? "none"}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    department: v === "none" ? null : Number(v),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Hotel default" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None (hotel default)</SelectItem>
                  {departments.map((d) => (
                    <SelectItem key={d.id} value={d.id.toString()}>
                      {d.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Determines where requests are routed. If blank, uses the
                hotel&apos;s fallback department.
              </p>
            </div>
            <div className="space-y-2">
              <Label>Linked Experience</Label>
              <Select
                value={form.experience?.toString() ?? "none"}
                onValueChange={(v) =>
                  setForm({
                    ...form,
                    experience: v === "none" ? null : Number(v),
                  })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="None" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {experiences.map((exp) => (
                    <SelectItem key={exp.id} value={exp.id.toString()}>
                      {exp.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">
                Optionally link to an existing experience. Guests will see
                this connection on the event detail page.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Images */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Images</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label>Photo</Label>
                <ImageUploadArea
                  value={photo}
                  existingUrl={existingPhotoUrl}
                  onChange={handlePhotoChange}
                />
              </div>
              <div className="space-y-2">
                <Label>Cover Image</Label>
                <ImageUploadArea
                  value={coverImage}
                  existingUrl={existingCoverUrl}
                  onChange={handleCoverChange}
                />
              </div>
            </div>
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
              <div className="flex flex-wrap gap-1.5">
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
          </CardContent>
        </Card>

        {/* Visibility */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visibility</CardTitle>
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
                Only published events are visible to guests
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="featured"
                checked={form.is_featured}
                onCheckedChange={(v) => setForm({ ...form, is_featured: v })}
              />
              <Label htmlFor="featured">Featured event</Label>
              <span className="text-xs text-muted-foreground">
                (shown on landing page)
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="auto-expire"
                checked={form.auto_expire}
                onCheckedChange={(v) => setForm({ ...form, auto_expire: v })}
              />
              <Label htmlFor="auto-expire">Auto-expire</Label>
              <span className="text-xs text-muted-foreground">
                (unpublish after event ends)
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      <ConfirmDialog {...confirmDialogProps} />
    </div>
  );
}

// ---- Helpers ----

/** Convert ISO datetime string to datetime-local input value */
function toDatetimeLocal(iso: string): string {
  const d = new Date(iso);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

/** Convert datetime-local value back to ISO string */
function toISO(datetimeLocal: string): string {
  if (!datetimeLocal) return "";
  return new Date(datetimeLocal).toISOString();
}

// ---- Sticky Header ----

function EditorHeader({
  title,
  onBack,
  saving,
  canSave,
  onSave,
  draftLastSaved,
  missingFields,
}: {
  title: string;
  onBack: () => void;
  saving: boolean;
  canSave: boolean;
  onSave: () => void;
  draftLastSaved?: Date | null;
  missingFields?: string[];
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
      <div className="ml-auto flex items-center gap-2">
        {!canSave && !saving && missingFields && missingFields.length > 0 && (
          <span className="text-xs text-muted-foreground hidden sm:inline">
            Set {missingFields.join(" & ")} to save
          </span>
        )}
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
