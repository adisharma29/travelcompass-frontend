"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  LayoutDashboard,
  Inbox,
  Building2,
  Sparkles,
  Users,
  QrCode,
  Settings,
  LogOut,
  ChevronsUpDown,
  Check,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import type { Role } from "@/lib/concierge-types";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  /** Minimum role required. undefined = all roles */
  minRole?: Role;
}

const NAV_ITEMS: NavItem[] = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Requests", href: "/dashboard/requests", icon: Inbox },
  {
    label: "Departments",
    href: "/dashboard/departments",
    icon: Building2,
    minRole: "ADMIN",
  },
  {
    label: "Experiences",
    href: "/dashboard/experiences",
    icon: Sparkles,
    minRole: "ADMIN",
  },
  {
    label: "Team",
    href: "/dashboard/team",
    icon: Users,
    minRole: "ADMIN",
  },
  {
    label: "QR Codes",
    href: "/dashboard/qr-codes",
    icon: QrCode,
    minRole: "ADMIN",
  },
  {
    label: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    minRole: "SUPERADMIN",
  },
];

const ROLE_RANK: Record<Role, number> = {
  STAFF: 0,
  ADMIN: 1,
  SUPERADMIN: 2,
};

function hasAccess(userRole: Role | null, minRole?: Role): boolean {
  if (!minRole) return true;
  if (!userRole) return false;
  return ROLE_RANK[userRole] >= ROLE_RANK[minRole];
}

export function DashboardSidebar() {
  const pathname = usePathname();
  const {
    user,
    memberships,
    activeHotelSlug,
    activeMembership,
    role,
    setActiveHotel,
    logout,
  } = useAuth();

  const visibleNav = NAV_ITEMS.filter((item) => hasAccess(role, item.minRole));
  const initials = user
    ? `${user.first_name?.[0] ?? ""}${user.last_name?.[0] ?? ""}`.toUpperCase() ||
      user.email[0].toUpperCase()
    : "?";

  return (
    <Sidebar>
      {/* Hotel picker */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground text-xs font-bold">
                    {activeMembership?.hotel.name[0] ?? "H"}
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold truncate">
                      {activeMembership?.hotel.name ?? "Select hotel"}
                    </span>
                    <span className="text-xs text-muted-foreground capitalize">
                      {role?.toLowerCase() ?? "—"}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width]"
                align="start"
              >
                {memberships.map((m) => (
                  <DropdownMenuItem
                    key={m.id}
                    onClick={() => setActiveHotel(m.hotel.slug)}
                  >
                    {m.hotel.name}
                    {m.hotel.slug === activeHotelSlug && (
                      <Check className="ml-auto size-4" />
                    )}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Navigation */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {visibleNav.map((item) => {
                const active =
                  pathname === item.href ||
                  (item.href !== "/dashboard" &&
                    pathname.startsWith(item.href));
                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton asChild isActive={active}>
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User menu */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton size="lg">
                  <Avatar className="size-8">
                    <AvatarFallback className="bg-muted text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-medium truncate">
                      {user?.first_name} {user?.last_name}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </span>
                  </div>
                  <ChevronsUpDown className="ml-auto size-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width]"
                align="start"
                side="top"
              >
                <DropdownMenuItem
                  onClick={logout}
                  className="text-destructive focus:text-destructive"
                >
                  <LogOut className="mr-2 size-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
