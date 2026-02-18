"use client";

import { type ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { DashboardSidebar } from "./DashboardSidebar";
import {
  SidebarProvider,
  SidebarInset,
} from "@/components/ui/sidebar";

export function DashboardShell({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { loading, user, memberships } = useAuth();

  // Guard: must be STAFF with at least one active membership (#4)
  const isStaff = user?.user_type === "STAFF" && memberships.length > 0;

  useEffect(() => {
    if (!loading && (!user || !isStaff)) {
      router.replace("/login");
    }
  }, [loading, user, isStaff, router]);

  if (loading) {
    return (
      <div className="flex h-dvh w-full items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user || !isStaff) return null;

  return (
    <SidebarProvider>
      <DashboardSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
