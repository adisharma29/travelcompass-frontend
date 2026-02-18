"use client";

import { SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default function DepartmentsPage() {
  return (
    <div className="flex flex-col">
      <header className="flex h-14 items-center gap-2 border-b px-4">
        <SidebarTrigger />
        <Separator orientation="vertical" className="h-4" />
        <h1 className="text-lg font-semibold">Departments</h1>
      </header>
      <div className="flex-1 flex items-center justify-center p-8">
        <p className="text-muted-foreground">Departments CRUD — coming in Phase 3</p>
      </div>
    </div>
  );
}
