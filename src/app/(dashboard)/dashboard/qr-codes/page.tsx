"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getQRCodes,
  getDepartments,
  createQRCode,
  deleteQRCode,
} from "@/lib/concierge-api";
import type { QRCode, Department } from "@/lib/concierge-types";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
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
  Download,
  Trash2,
  ExternalLink,
  Users,
} from "lucide-react";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

const PLACEMENTS = [
  "LOBBY",
  "ROOM",
  "RESTAURANT",
  "SPA",
  "POOL",
  "BAR",
  "GYM",
  "GARDEN",
  "OTHER",
] as const;

export default function QRCodesPage() {
  const { activeHotelSlug } = useAuth();
  const [codes, setCodes] = useState<QRCode[]>([]);
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
      const [q, d] = await Promise.all([
        getQRCodes(slug),
        getDepartments(slug),
      ]);
      if (slugRef.current !== slug) return;
      setCodes(q);
      setDepartments(d);
    } catch {
      if (slugRef.current !== slug) return;
      setError("Failed to load QR codes");
    } finally {
      if (slugRef.current === slug) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [activeHotelSlug, fetchData]);

  if (!activeHotelSlug) return null;

  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">QR Codes</h1>
        <div className="ml-auto">
          <CreateQRDialog
            hotelSlug={activeHotelSlug}
            departments={departments}
            onCreated={fetchData}
          />
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {loading ? (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <Skeleton className="h-40 w-40 mx-auto mb-4" />
                  <Skeleton className="h-4 w-32 mx-auto" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : codes.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-muted-foreground">
            <p className="text-sm">No QR codes yet</p>
            <p className="text-xs mt-1">Create one to get started</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {codes.map((qr) => (
              <QRCard
                key={qr.id}
                qr={qr}
                departments={departments}
                hotelSlug={activeHotelSlug}
                onDeleted={fetchData}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function QRCard({
  qr,
  departments,
  hotelSlug,
  onDeleted,
}: {
  qr: QRCode;
  departments: Department[];
  hotelSlug: string;
  onDeleted: () => void;
}) {
  const [deleting, setDeleting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const dept = departments.find((d) => d.id === qr.department);

  async function handleDelete() {
    setDeleting(true);
    try {
      await deleteQRCode(hotelSlug, qr.id);
      onDeleted();
    } finally {
      setDeleting(false);
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-base">{qr.label}</CardTitle>
            <CardDescription className="mt-1">
              <Badge variant="outline" className="text-[10px]">
                {qr.placement}
              </Badge>
              {dept && (
                <span className="ml-2 text-xs">{dept.name}</span>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Users className="size-3" />
            {qr.stay_count}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        {qr.qr_image && (
          <div className="flex justify-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={qr.qr_image}
              alt={`QR code for ${qr.label}`}
              className="w-40 h-40 rounded border"
            />
          </div>
        )}
        <div className="flex items-center gap-1 text-xs text-muted-foreground truncate">
          <ExternalLink className="size-3 shrink-0" />
          <span className="truncate">{qr.target_url}</span>
        </div>
        <div className="flex gap-2">
          {qr.qr_image && (
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              asChild
            >
              <a href={qr.qr_image} download={`qr-${qr.label}.png`}>
                <Download className="size-3.5 mr-1" /> Download
              </a>
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowDeleteConfirm(true)}
            disabled={deleting}
            className="text-destructive hover:text-destructive"
          >
            {deleting ? <Loader2 className="size-3.5 animate-spin" /> : <Trash2 className="size-3.5" />}
          </Button>
        </div>
      </CardContent>
      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title="Delete QR code?"
        description={`The QR code "${qr.label}" will be permanently deleted. This cannot be undone.`}
        confirmLabel="Delete"
        variant="destructive"
        onConfirm={handleDelete}
      />
    </Card>
  );
}

function CreateQRDialog({
  hotelSlug,
  departments,
  onCreated,
}: {
  hotelSlug: string;
  departments: Department[];
  onCreated: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    label: "",
    placement: "LOBBY" as string,
    department: null as number | null,
  });

  function reset() {
    setForm({ label: "", placement: "LOBBY", department: null });
    setError(null);
  }

  async function handleCreate() {
    setSaving(true);
    setError(null);
    try {
      await createQRCode(hotelSlug, {
        label: form.label,
        placement: form.placement,
        department: form.department ?? undefined,
      });
      setOpen(false);
      reset();
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create QR code");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <Plus className="size-4 mr-1.5" /> New QR Code
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create QR Code</DialogTitle>
          <DialogDescription>
            Generate a new QR code for guest check-in
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
            <Label htmlFor="qr-label">Label</Label>
            <Input
              id="qr-label"
              value={form.label}
              onChange={(e) => setForm({ ...form, label: e.target.value })}
              placeholder="e.g. Lobby Kiosk, Room 201"
            />
          </div>
          <div className="space-y-2">
            <Label>Placement</Label>
            <Select
              value={form.placement}
              onValueChange={(v) => setForm({ ...form, placement: v })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PLACEMENTS.map((p) => (
                  <SelectItem key={p} value={p}>
                    {p.charAt(0) + p.slice(1).toLowerCase()}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Department (optional)</Label>
            <Select
              value={form.department?.toString() ?? "none"}
              onValueChange={(v) => setForm({ ...form, department: v === "none" ? null : Number(v) })}
            >
              <SelectTrigger>
                <SelectValue placeholder="None" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={saving || !form.label}>
            {saving && <Loader2 className="size-4 animate-spin mr-1.5" />}
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
