"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getHotelSettings, updateHotelSettings } from "@/lib/concierge-api";
import type { HotelSettings } from "@/lib/concierge-types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

const FALLBACK_CHANNELS = [
  { value: "NONE", label: "None" },
  { value: "EMAIL", label: "Email" },
  { value: "SMS", label: "SMS" },
  { value: "EMAIL_SMS", label: "Email + SMS" },
] as const;

export default function SettingsPage() {
  const { activeHotelSlug } = useAuth();
  const [settings, setSettings] = useState<HotelSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const slugRef = useRef(activeHotelSlug);
  slugRef.current = activeHotelSlug;

  // Editable form state
  const [form, setForm] = useState<HotelSettings | null>(null);

  const fetchSettings = useCallback(async () => {
    const slug = slugRef.current;
    if (!slug) return;
    setLoading(true);
    setError(null);
    try {
      const s = await getHotelSettings(slug);
      if (slugRef.current !== slug) return;
      setSettings(s);
      setForm(s);
    } catch {
      if (slugRef.current !== slug) return;
      setError("Failed to load settings");
    } finally {
      if (slugRef.current === slug) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSettings();
  }, [activeHotelSlug, fetchSettings]);

  async function handleSave() {
    const slug = slugRef.current;
    if (!slug || !form) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const updated = await updateHotelSettings(slug, form);
      if (slugRef.current !== slug) return;
      setSettings(updated);
      setForm(updated);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (slugRef.current !== slug) return;
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      if (slugRef.current === slug) setSaving(false);
    }
  }

  const dirty = form && settings && JSON.stringify(form) !== JSON.stringify(settings);

  if (!activeHotelSlug) return null;

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">Settings</h1>
        <div className="ml-auto flex items-center gap-2">
          {success && (
            <span className="flex items-center gap-1 text-xs text-green-600">
              <CheckCircle2 className="size-3.5" /> Saved
            </span>
          )}
          <Button size="sm" disabled={!dirty || saving} onClick={handleSave}>
            {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
            <span className="ml-1.5">Save</span>
          </Button>
        </div>
      </header>

      <div className="flex-1 space-y-6 p-4 md:p-6 max-w-3xl">
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <SettingsSkeleton />
        ) : form ? (
          <>
            {/* Timezone */}
            <Card>
              <CardHeader>
                <CardTitle>General</CardTitle>
                <CardDescription>Timezone and basic configuration</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input
                    id="timezone"
                    value={form.timezone}
                    onChange={(e) => setForm({ ...form, timezone: e.target.value })}
                    placeholder="e.g. Asia/Kolkata"
                  />
                  <p className="text-xs text-muted-foreground">
                    IANA timezone (e.g. Asia/Kolkata, Europe/London)
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Room Number Validation */}
            <Card>
              <CardHeader>
                <CardTitle>Room Numbers</CardTitle>
                <CardDescription>Validation rules for guest room numbers</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="room-pattern">Pattern (regex)</Label>
                  <Input
                    id="room-pattern"
                    value={form.room_number_pattern}
                    onChange={(e) => setForm({ ...form, room_number_pattern: e.target.value })}
                    placeholder="^\d{3,4}$"
                    className="font-mono text-sm"
                  />
                  <p className="text-xs text-muted-foreground">
                    Regex to validate room numbers (e.g. ^\d{"{3,4}"}$)
                  </p>
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="room-min">Minimum</Label>
                    <Input
                      id="room-min"
                      type="number"
                      value={form.room_number_min ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          room_number_min: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="e.g. 100"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="room-max">Maximum</Label>
                    <Input
                      id="room-max"
                      type="number"
                      value={form.room_number_max ?? ""}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          room_number_max: e.target.value ? Number(e.target.value) : null,
                        })
                      }
                      placeholder="e.g. 9999"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="blocked-rooms">Blocked Room Numbers</Label>
                  <Input
                    id="blocked-rooms"
                    value={form.blocked_room_numbers.join(", ")}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        blocked_room_numbers: e.target.value
                          .split(",")
                          .map((s) => s.trim())
                          .filter(Boolean),
                      })
                    }
                    placeholder="0, 00, 000, 999"
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of room numbers to block
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Kiosk */}
            <Card>
              <CardHeader>
                <CardTitle>Front Desk</CardTitle>
                <CardDescription>Kiosk and front desk settings</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Require Front Desk Kiosk</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Guests must scan QR at front desk to access services
                    </p>
                  </div>
                  <Switch
                    checked={form.require_frontdesk_kiosk}
                    onCheckedChange={(v) => setForm({ ...form, require_frontdesk_kiosk: v })}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Escalation */}
            <Card>
              <CardHeader>
                <CardTitle>Escalation</CardTitle>
                <CardDescription>Automatic escalation for unhandled requests</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Escalation</Label>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Auto-escalate requests that exceed SLA timers
                    </p>
                  </div>
                  <Switch
                    checked={form.escalation_enabled}
                    onCheckedChange={(v) => setForm({ ...form, escalation_enabled: v })}
                  />
                </div>

                {form.escalation_enabled && (
                  <>
                    <Separator />
                    <div className="space-y-2">
                      <Label>Fallback Channel</Label>
                      <Select
                        value={form.escalation_fallback_channel}
                        onValueChange={(v) =>
                          setForm({
                            ...form,
                            escalation_fallback_channel: v as HotelSettings["escalation_fallback_channel"],
                          })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {FALLBACK_CHANNELS.map((ch) => (
                            <SelectItem key={ch.value} value={ch.value}>
                              {ch.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-2">
                        <Label htmlFor="oncall-email">On-Call Email</Label>
                        <Input
                          id="oncall-email"
                          type="email"
                          value={form.oncall_email ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, oncall_email: e.target.value || null })
                          }
                          placeholder="duty@hotel.com"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="oncall-phone">On-Call Phone</Label>
                        <Input
                          id="oncall-phone"
                          type="tel"
                          value={form.oncall_phone ?? ""}
                          onChange={(e) =>
                            setForm({ ...form, oncall_phone: e.target.value || null })
                          }
                          placeholder="+91..."
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="tier-minutes">Escalation Tier Minutes</Label>
                      <Input
                        id="tier-minutes"
                        value={form.escalation_tier_minutes?.join(", ") ?? ""}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            escalation_tier_minutes: e.target.value
                              ? e.target.value
                                  .split(",")
                                  .map((s) => Number(s.trim()))
                                  .filter((n) => !isNaN(n) && n > 0)
                              : null,
                          })
                        }
                        placeholder="15, 30, 60"
                      />
                      <p className="text-xs text-muted-foreground">
                        Comma-separated minutes for each escalation tier (e.g. 15, 30, 60)
                      </p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          </>
        ) : null}
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-5 w-32" />
            <Skeleton className="h-4 w-48" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
