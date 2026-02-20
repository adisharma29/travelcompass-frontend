"use client";

import type { ReactNode } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import { NotificationBell } from "./NotificationBell";

interface Props {
  title: string;
  children?: ReactNode;
}

export function DashboardHeader({ title, children }: Props) {
  return (
    <header className="sticky top-0 z-10 flex h-14 items-center gap-2 border-b bg-background px-4">
      <SidebarTrigger />
      <Separator orientation="vertical" className="h-4" />
      <h1 className="text-lg font-semibold">{title}</h1>
      <div className="ml-auto flex items-center gap-3">
        {children}
        <NotificationBell />
      </div>
    </header>
  );
}
