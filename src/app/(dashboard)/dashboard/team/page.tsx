"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  getMembers,
  getDepartments,
  inviteMember,
  updateMember,
} from "@/lib/concierge-api";
import type { HotelMembership, Department, Role } from "@/lib/concierge-types";
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
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Loader2, AlertCircle } from "lucide-react";
import { ConfirmDialog } from "@/components/dashboard/ConfirmDialog";

const ROLE_VARIANT: Record<string, "default" | "secondary" | "outline"> = {
  SUPERADMIN: "default",
  ADMIN: "secondary",
  STAFF: "outline",
};

export default function TeamPage() {
  const { activeHotelSlug, role: myRole, activeMembership } = useAuth();
  const [members, setMembers] = useState<HotelMembership[]>([]);
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
      const [m, d] = await Promise.all([
        getMembers(slug),
        getDepartments(slug),
      ]);
      if (slugRef.current !== slug) return;
      setMembers(m);
      setDepartments(d);
    } catch {
      if (slugRef.current !== slug) return;
      setError("Failed to load team data");
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
        <h1 className="text-lg font-semibold">Team</h1>
        <div className="ml-auto">
          {myRole === "SUPERADMIN" && (
            <InviteDialog
              hotelSlug={activeHotelSlug}
              departments={departments}
              onInvited={fetchData}
            />
          )}
        </div>
      </header>

      <div className="flex-1 p-4 md:p-6 max-w-5xl">
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Members ({members.length})</CardTitle>
            <CardDescription>Manage team members and their roles</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full" />
                ))}
              </div>
            ) : members.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted-foreground">
                No team members yet
              </p>
            ) : (
              <>
                {/* Desktop table */}
                <div className="hidden md:block">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Contact</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead>Department</TableHead>
                        <TableHead>Status</TableHead>
                        {myRole === "SUPERADMIN" && <TableHead className="w-[100px]">Actions</TableHead>}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {members.map((m) => (
                        <MemberRow
                          key={m.id}
                          member={m}
                          departments={departments}
                          hotelSlug={activeHotelSlug}
                          canEdit={myRole === "SUPERADMIN"}
                          isSelf={m.id === activeMembership?.id}
                          onUpdated={fetchData}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
                {/* Mobile cards */}
                <div className="md:hidden space-y-3">
                  {members.map((m) => (
                    <MemberCard
                      key={m.id}
                      member={m}
                      departments={departments}
                      hotelSlug={activeHotelSlug}
                      canEdit={myRole === "SUPERADMIN"}
                      isSelf={m.id === activeMembership?.id}
                      onUpdated={fetchData}
                    />
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function MemberRow({
  member,
  departments,
  hotelSlug,
  canEdit,
  isSelf,
  onUpdated,
}: {
  member: HotelMembership;
  departments: Department[];
  hotelSlug: string;
  canEdit: boolean;
  isSelf: boolean;
  onUpdated: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [pendingStaffDept, setPendingStaffDept] = useState<number | null>(null);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const dept = departments.find((d) => d.id === member.department);

  async function handleRoleChange(role: string) {
    if (role === "STAFF" && !member.department) {
      setShowDeptPicker(true);
      return;
    }
    setUpdating(true);
    try {
      await updateMember(hotelSlug, member.id, { role });
      onUpdated();
    } finally {
      setUpdating(false);
    }
  }

  async function handleConfirmStaffRole() {
    if (!pendingStaffDept) return;
    setUpdating(true);
    try {
      await updateMember(hotelSlug, member.id, { role: "STAFF", department: pendingStaffDept });
      setShowDeptPicker(false);
      setPendingStaffDept(null);
      onUpdated();
    } finally {
      setUpdating(false);
    }
  }

  async function handleToggleActive() {
    setUpdating(true);
    try {
      await updateMember(hotelSlug, member.id, { is_active: !member.is_active });
      onUpdated();
    } finally {
      setUpdating(false);
    }
  }

  const memberName = member.first_name || member.email;

  return (
    <>
      <TableRow className={!member.is_active ? "opacity-50" : ""}>
        <TableCell>
          <div className="font-medium text-sm">
            {member.first_name} {member.last_name}
            {isSelf && (
              <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
            )}
          </div>
        </TableCell>
        <TableCell>
          <div className="text-sm">{member.email}</div>
          <div className="text-xs text-muted-foreground">{member.phone}</div>
        </TableCell>
        <TableCell>
          {canEdit && !isSelf ? (
            <Select
              value={member.role}
              onValueChange={handleRoleChange}
              disabled={updating}
            >
              <SelectTrigger className="w-[130px] h-8 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant={ROLE_VARIANT[member.role] ?? "outline"}>
              {member.role}
            </Badge>
          )}
        </TableCell>
        <TableCell className="text-sm text-muted-foreground">
          {dept?.name ?? "—"}
        </TableCell>
        <TableCell>
          <Badge variant={member.is_active ? "default" : "outline"}>
            {member.is_active ? "Active" : "Inactive"}
          </Badge>
        </TableCell>
        {canEdit && (
          <TableCell>
            {isSelf ? (
              <span className="text-xs text-muted-foreground">—</span>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowToggleConfirm(true)}
                disabled={updating}
                className="text-xs"
              >
                {updating ? (
                  <Loader2 className="size-3 animate-spin" />
                ) : member.is_active ? (
                  "Deactivate"
                ) : (
                  "Activate"
                )}
              </Button>
            )}
          </TableCell>
        )}
      </TableRow>
      <ConfirmDialog
        open={showToggleConfirm}
        onOpenChange={setShowToggleConfirm}
        title={`${member.is_active ? "Deactivate" : "Activate"} ${memberName}?`}
        description={
          member.is_active
            ? `${memberName} will lose access to this hotel's dashboard.`
            : `${memberName} will regain access to this hotel's dashboard.`
        }
        confirmLabel={member.is_active ? "Deactivate" : "Activate"}
        variant={member.is_active ? "destructive" : "default"}
        onConfirm={handleToggleActive}
      />
      {showDeptPicker && (
        <TableRow>
          <TableCell colSpan={canEdit ? 6 : 5} className="bg-muted/30">
            <div className="flex items-center gap-3 py-1">
              <span className="text-sm text-muted-foreground">
                Select department for Staff role:
              </span>
              <Select
                value={pendingStaffDept?.toString() ?? ""}
                onValueChange={(v) => setPendingStaffDept(Number(v))}
              >
                <SelectTrigger className="w-[200px] h-8 text-xs">
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
              <Button
                size="sm"
                className="h-8 text-xs"
                disabled={!pendingStaffDept || updating}
                onClick={handleConfirmStaffRole}
              >
                {updating && <Loader2 className="size-3 animate-spin mr-1" />}
                Confirm
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 text-xs"
                onClick={() => { setShowDeptPicker(false); setPendingStaffDept(null); }}
              >
                Cancel
              </Button>
            </div>
          </TableCell>
        </TableRow>
      )}
    </>
  );
}

function MemberCard({
  member,
  departments,
  hotelSlug,
  canEdit,
  isSelf,
  onUpdated,
}: {
  member: HotelMembership;
  departments: Department[];
  hotelSlug: string;
  canEdit: boolean;
  isSelf: boolean;
  onUpdated: () => void;
}) {
  const [updating, setUpdating] = useState(false);
  const [showToggleConfirm, setShowToggleConfirm] = useState(false);
  const [pendingStaffDept, setPendingStaffDept] = useState<number | null>(null);
  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const dept = departments.find((d) => d.id === member.department);

  async function handleRoleChange(role: string) {
    if (role === "STAFF" && !member.department) {
      setShowDeptPicker(true);
      return;
    }
    setUpdating(true);
    try {
      await updateMember(hotelSlug, member.id, { role });
      onUpdated();
    } finally {
      setUpdating(false);
    }
  }

  async function handleConfirmStaffRole() {
    if (!pendingStaffDept) return;
    setUpdating(true);
    try {
      await updateMember(hotelSlug, member.id, { role: "STAFF", department: pendingStaffDept });
      setShowDeptPicker(false);
      setPendingStaffDept(null);
      onUpdated();
    } finally {
      setUpdating(false);
    }
  }

  async function handleToggleActive() {
    setUpdating(true);
    try {
      await updateMember(hotelSlug, member.id, { is_active: !member.is_active });
      onUpdated();
    } finally {
      setUpdating(false);
    }
  }

  const memberName = member.first_name || member.email;

  return (
    <>
      <div className={`rounded-lg border p-3 space-y-2 ${!member.is_active ? "opacity-50" : ""}`}>
        <div className="flex items-start justify-between">
          <div>
            <div className="font-medium text-sm">
              {member.first_name} {member.last_name}
              {isSelf && (
                <span className="ml-1.5 text-xs text-muted-foreground">(you)</span>
              )}
            </div>
            {member.email && (
              <div className="text-xs text-muted-foreground">{member.email}</div>
            )}
            {member.phone && (
              <div className="text-xs text-muted-foreground">{member.phone}</div>
            )}
          </div>
          <Badge variant={member.is_active ? "default" : "outline"}>
            {member.is_active ? "Active" : "Inactive"}
          </Badge>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          {canEdit && !isSelf ? (
            <Select
              value={member.role}
              onValueChange={handleRoleChange}
              disabled={updating}
            >
              <SelectTrigger className="w-[120px] h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              </SelectContent>
            </Select>
          ) : (
            <Badge variant={ROLE_VARIANT[member.role] ?? "outline"}>
              {member.role}
            </Badge>
          )}
          {dept && (
            <span className="text-xs text-muted-foreground">{dept.name}</span>
          )}
          {canEdit && !isSelf && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowToggleConfirm(true)}
              disabled={updating}
              className="text-xs h-7 ml-auto"
            >
              {updating ? (
                <Loader2 className="size-3 animate-spin" />
              ) : member.is_active ? (
                "Deactivate"
              ) : (
                "Activate"
              )}
            </Button>
          )}
        </div>
        {showDeptPicker && (
          <div className="flex items-center gap-2 flex-wrap pt-1 border-t">
            <span className="text-xs text-muted-foreground">Department:</span>
            <Select
              value={pendingStaffDept?.toString() ?? ""}
              onValueChange={(v) => setPendingStaffDept(Number(v))}
            >
              <SelectTrigger className="w-[160px] h-7 text-xs">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                {departments.map((d) => (
                  <SelectItem key={d.id} value={d.id.toString()}>
                    {d.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              size="sm"
              className="h-7 text-xs"
              disabled={!pendingStaffDept || updating}
              onClick={handleConfirmStaffRole}
            >
              {updating && <Loader2 className="size-3 animate-spin mr-1" />}
              OK
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-7 text-xs"
              onClick={() => { setShowDeptPicker(false); setPendingStaffDept(null); }}
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
      <ConfirmDialog
        open={showToggleConfirm}
        onOpenChange={setShowToggleConfirm}
        title={`${member.is_active ? "Deactivate" : "Activate"} ${memberName}?`}
        description={
          member.is_active
            ? `${memberName} will lose access to this hotel's dashboard.`
            : `${memberName} will regain access to this hotel's dashboard.`
        }
        confirmLabel={member.is_active ? "Deactivate" : "Activate"}
        variant={member.is_active ? "destructive" : "default"}
        onConfirm={handleToggleActive}
      />
    </>
  );
}

function InviteDialog({
  hotelSlug,
  departments,
  onInvited,
}: {
  hotelSlug: string;
  departments: Department[];
  onInvited: () => void;
}) {
  const [open, setOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    phone: "",
    first_name: "",
    last_name: "",
    role: "STAFF" as Role,
    department: null as number | null,
  });

  function reset() {
    setForm({ email: "", phone: "", first_name: "", last_name: "", role: "STAFF", department: null });
    setError(null);
  }

  async function handleInvite() {
    setSaving(true);
    setError(null);
    try {
      await inviteMember(hotelSlug, {
        ...(form.email ? { email: form.email } : {}),
        ...(form.phone ? { phone: form.phone } : {}),
        role: form.role,
        ...(form.role === "STAFF" && form.department
          ? { department: form.department }
          : {}),
      });
      setOpen(false);
      reset();
      onInvited();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to invite member");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) reset(); }}>
      <DialogTrigger asChild>
        <Button size="sm">
          <UserPlus className="size-4 mr-1.5" /> Invite
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Invite Team Member</DialogTitle>
          <DialogDescription>
            Send an invitation to join your hotel team
          </DialogDescription>
        </DialogHeader>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="size-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="inv-first">First Name</Label>
              <Input
                id="inv-first"
                value={form.first_name}
                onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-last">Last Name</Label>
              <Input
                id="inv-last"
                value={form.last_name}
                onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-email">Email</Label>
            <Input
              id="inv-email"
              type="email"
              placeholder="Email or phone required"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-phone">Phone</Label>
            <Input
              id="inv-phone"
              type="tel"
              placeholder="Email or phone required"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label>Role</Label>
            <Select
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v as Role })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="SUPERADMIN">Super Admin</SelectItem>
                <SelectItem value="ADMIN">Admin</SelectItem>
                <SelectItem value="STAFF">Staff</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {form.role === "STAFF" && (
            <div className="space-y-2">
              <Label>Department (required for Staff)</Label>
              <Select
                value={form.department?.toString() ?? ""}
                onValueChange={(v) => setForm({ ...form, department: v ? Number(v) : null })}
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
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleInvite}
            disabled={saving || (!form.email && !form.phone) || (form.role === "STAFF" && !form.department)}
          >
            {saving && <Loader2 className="size-4 animate-spin mr-1.5" />}
            Invite
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
