"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import { getHotelSettings, updateHotelSettings } from "@/lib/concierge-api";
import type { HotelSettings } from "@/lib/concierge-types";
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
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { ImageUploadArea } from "@/components/dashboard/ImageUploadArea";
import { FontCombobox } from "@/components/dashboard/FontCombobox";
import { BrandPreview } from "@/components/dashboard/BrandPreview";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";
import { useUnsavedChanges } from "@/hooks/use-unsaved-changes";

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
  const [faviconFile, setFaviconFile] = useState<File | null>(null);
  const [ogImageFile, setOgImageFile] = useState<File | null>(null);
  const [removeFavicon, setRemoveFavicon] = useState(false);
  const [removeOgImage, setRemoveOgImage] = useState(false);

  const fetchSettings = useCallback(async () => {
    const slug = slugRef.current;
    if (!slug) return;
    setLoading(true);
    setError(null);
    setFaviconFile(null);
    setOgImageFile(null);
    setRemoveFavicon(false);
    setRemoveOgImage(false);
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

  const hasFileChanges =
    faviconFile !== null || ogImageFile !== null || removeFavicon || removeOgImage;

  async function handleSave() {
    const slug = slugRef.current;
    if (!slug || !form) return;
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      let updated: HotelSettings;
      if (hasFileChanges) {
        // Use FormData when files or image removals are involved
        const fd = new FormData();
        const JSON_FIELDS = new Set(["blocked_room_numbers", "escalation_tier_minutes"]);
        for (const [key, value] of Object.entries(form)) {
          if (key === "favicon" || key === "og_image") continue;
          if (JSON_FIELDS.has(key)) {
            fd.append(key, JSON.stringify(value));
            continue;
          }
          fd.append(key, value === null ? "" : String(value));
        }
        if (faviconFile) fd.append("favicon", faviconFile);
        else if (removeFavicon) fd.append("favicon_clear", "true");
        if (ogImageFile) fd.append("og_image", ogImageFile);
        else if (removeOgImage) fd.append("og_image_clear", "true");
        updated = await updateHotelSettings(slug, fd);
      } else {
        // JSON path: strip image URL fields — backend expects files, not strings
        const jsonData: Record<string, unknown> = {};
        for (const [key, value] of Object.entries(form)) {
          if (key === "favicon" || key === "og_image") continue;
          jsonData[key] = value;
        }
        if (removeFavicon) jsonData.favicon_clear = true;
        if (removeOgImage) jsonData.og_image_clear = true;
        updated = await updateHotelSettings(slug, jsonData as Partial<HotelSettings>);
      }
      if (slugRef.current !== slug) return;
      setSettings(updated);
      setForm(updated);
      setFaviconFile(null);
      setOgImageFile(null);
      setRemoveFavicon(false);
      setRemoveOgImage(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      if (slugRef.current !== slug) return;
      setError(err instanceof Error ? err.message : "Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  const dirty =
    (form && settings && JSON.stringify(form) !== JSON.stringify(settings)) ||
    hasFileChanges;

  const { confirmDialogProps } = useUnsavedChanges(!!dirty);

  if (!activeHotelSlug) return null;

  return (
    <div className="flex flex-col">
      <DashboardHeader title="Settings">
        {success && (
          <span className="flex items-center gap-1 text-xs text-green-600">
            <CheckCircle2 className="size-3.5" /> Saved
          </span>
        )}
        <Button
          size="sm"
          disabled={
            !dirty ||
            saving ||
            (form
              ? form.default_booking_opens_hours > 0 &&
                form.default_booking_closes_hours > 0 &&
                form.default_booking_opens_hours < form.default_booking_closes_hours
              : false)
          }
          onClick={handleSave}
        >
          {saving ? <Loader2 className="size-4 animate-spin" /> : <Save className="size-4" />}
          <span className="ml-1.5">Save</span>
        </Button>
      </DashboardHeader>

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
            {/* Branding */}
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>
                  Colors, fonts, and images for your guest-facing pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-3">
                  <ColorField
                    label="Primary"
                    value={form.primary_color}
                    onChange={(v) => setForm({ ...form, primary_color: v })}
                  />
                  <ColorField
                    label="Secondary"
                    value={form.secondary_color}
                    onChange={(v) => setForm({ ...form, secondary_color: v })}
                  />
                  <ColorField
                    label="Accent"
                    value={form.accent_color}
                    onChange={(v) => setForm({ ...form, accent_color: v })}
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Heading Font</Label>
                    <FontCombobox
                      variant="heading"
                      value={form.heading_font}
                      onChange={(v) => setForm({ ...form, heading_font: v })}
                      placeholder="Default (serif)"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Body Font</Label>
                    <FontCombobox
                      variant="body"
                      value={form.body_font}
                      onChange={(v) => setForm({ ...form, body_font: v })}
                      placeholder="Default (sans-serif)"
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Favicon</Label>
                    <ImageUploadArea
                      value={faviconFile}
                      existingUrl={removeFavicon ? null : form.favicon}
                      onChange={(f) => {
                        setFaviconFile(f);
                        if (f) setRemoveFavicon(false);
                        else if (form.favicon) setRemoveFavicon(true);
                      }}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>OG Image</Label>
                    <ImageUploadArea
                      value={ogImageFile}
                      existingUrl={removeOgImage ? null : form.og_image}
                      onChange={(f) => {
                        setOgImageFile(f);
                        if (f) setRemoveOgImage(false);
                        else if (form.og_image) setRemoveOgImage(true);
                      }}
                    />
                    <p className="text-xs text-muted-foreground">
                      Social sharing preview image (1200x630 recommended)
                    </p>
                  </div>
                </div>

                {/* Live preview */}
                <div className="space-y-2">
                  <Label className="text-xs text-muted-foreground">Preview</Label>
                  <BrandPreview
                    primaryColor={form.primary_color}
                    secondaryColor={form.secondary_color}
                    accentColor={form.accent_color}
                    headingFont={form.heading_font}
                    bodyFont={form.body_font}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Social Links */}
            <Card>
              <CardHeader>
                <CardTitle>Social Links</CardTitle>
                <CardDescription>
                  Displayed in the footer of your guest pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="instagram">Instagram</Label>
                    <Input
                      id="instagram"
                      value={form.instagram_url}
                      onChange={(e) => setForm({ ...form, instagram_url: e.target.value })}
                      placeholder="https://instagram.com/yourhotel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="facebook">Facebook</Label>
                    <Input
                      id="facebook"
                      value={form.facebook_url}
                      onChange={(e) => setForm({ ...form, facebook_url: e.target.value })}
                      placeholder="https://facebook.com/yourhotel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="twitter">Twitter / X</Label>
                    <Input
                      id="twitter"
                      value={form.twitter_url}
                      onChange={(e) => setForm({ ...form, twitter_url: e.target.value })}
                      placeholder="https://x.com/yourhotel"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number</Label>
                    <Input
                      id="whatsapp"
                      value={form.whatsapp_number}
                      onChange={(e) => setForm({ ...form, whatsapp_number: e.target.value })}
                      placeholder="+919876543210"
                    />
                    <p className="text-xs text-muted-foreground">
                      With country code
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Footer & Legal */}
            <Card>
              <CardHeader>
                <CardTitle>Footer & Legal</CardTitle>
                <CardDescription>
                  Footer tagline and links to legal pages
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="footer-text">Footer Text</Label>
                  <Input
                    id="footer-text"
                    value={form.footer_text}
                    onChange={(e) => setForm({ ...form, footer_text: e.target.value })}
                    placeholder="e.g. Crafted with care by The Grand Hotel"
                  />
                </div>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="terms-url">Terms & Conditions URL</Label>
                    <Input
                      id="terms-url"
                      value={form.terms_url}
                      onChange={(e) => setForm({ ...form, terms_url: e.target.value })}
                      placeholder="https://yourhotel.com/terms"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="privacy-url">Privacy Policy URL</Label>
                    <Input
                      id="privacy-url"
                      value={form.privacy_url}
                      onChange={(e) => setForm({ ...form, privacy_url: e.target.value })}
                      placeholder="https://yourhotel.com/privacy"
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* General */}
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

            {/* Booking Defaults */}
            <Card>
              <CardHeader>
                <CardTitle>Booking Defaults</CardTitle>
                <CardDescription>
                  Default booking window for events. Individual events can override these.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="booking-opens-default">Default booking opens</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="booking-opens-default"
                        type="number"
                        min={0}
                        value={form.default_booking_opens_hours}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            default_booking_opens_hours: Number(e.target.value) || 0,
                          })
                        }
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">hours</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      0 = bookings always open
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="booking-closes-default">Default booking closes</Label>
                    <div className="flex items-center gap-2">
                      <Input
                        id="booking-closes-default"
                        type="number"
                        min={0}
                        value={form.default_booking_closes_hours}
                        onChange={(e) =>
                          setForm({
                            ...form,
                            default_booking_closes_hours: Number(e.target.value) || 0,
                          })
                        }
                        className="w-24"
                      />
                      <span className="text-sm text-muted-foreground">hours</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      0 = no cutoff (accept until event starts)
                    </p>
                  </div>
                </div>
                {form.default_booking_opens_hours > 0 &&
                  form.default_booking_closes_hours > 0 &&
                  form.default_booking_opens_hours < form.default_booking_closes_hours && (
                    <p className="text-sm text-destructive">
                      Opens must be greater than or equal to closes.
                    </p>
                  )}
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
      <ConfirmDialog {...confirmDialogProps} />
    </div>
  );
}

// ---- Color field with picker + hex input ----

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-9 w-9 cursor-pointer rounded border p-0.5"
        />
        <Input
          value={value}
          onChange={(e) => {
            const v = e.target.value;
            if (/^#[0-9a-fA-F]{0,6}$/.test(v)) onChange(v);
          }}
          className="font-mono text-sm w-24"
          maxLength={7}
        />
      </div>
    </div>
  );
}

function SettingsSkeleton() {
  return (
    <div className="space-y-6">
      {Array.from({ length: 6 }).map((_, i) => (
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
