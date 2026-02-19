"use client";

import { useState } from "react";
import Link from "next/link";
import type { SetupFlags } from "@/lib/concierge-types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Circle, ChevronRight } from "lucide-react";

interface ChecklistItem {
  key: keyof SetupFlags;
  label: string;
  href: string;
}

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    key: "settings_configured",
    label: "Configure hotel settings",
    href: "/dashboard/settings",
  },
  {
    key: "has_departments",
    label: "Create your first department",
    href: "/dashboard/departments/new",
  },
  {
    key: "has_experiences",
    label: "Add experiences to a department",
    href: "/dashboard/experiences",
  },
  {
    key: "has_photos",
    label: "Upload photos for departments or experiences",
    href: "/dashboard/departments",
  },
  {
    key: "has_team",
    label: "Invite at least one team member",
    href: "/dashboard/team",
  },
  {
    key: "has_qr_codes",
    label: "Generate a QR code",
    href: "/dashboard/qr-codes",
  },
  {
    key: "has_published",
    label: "Publish a department",
    href: "/dashboard/departments",
  },
];

interface SetupChecklistProps {
  setup: SetupFlags;
  hotelSlug: string;
}

function isDismissedForHotel(slug: string): boolean {
  try {
    return localStorage.getItem(`checklist_dismissed:${slug}`) === "true";
  } catch {
    return false;
  }
}

export function SetupChecklist({ setup, hotelSlug }: SetupChecklistProps) {
  const [dismissed, setDismissed] = useState(() => isDismissedForHotel(hotelSlug));

  // Recompute when hotel changes (React-endorsed "set state during render" pattern)
  const [prevSlug, setPrevSlug] = useState(hotelSlug);
  if (hotelSlug !== prevSlug) {
    setPrevSlug(hotelSlug);
    setDismissed(isDismissedForHotel(hotelSlug));
  }

  if (dismissed) return null;

  const completedCount = CHECKLIST_ITEMS.filter((item) => setup[item.key]).length;
  const totalCount = CHECKLIST_ITEMS.length;

  // All done — don't show
  if (completedCount === totalCount) return null;

  function handleDismiss() {
    setDismissed(true);
    try {
      localStorage.setItem(`checklist_dismissed:${hotelSlug}`, "true");
    } catch {
      // localStorage unavailable
    }
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">
            Get your hotel ready
          </CardTitle>
          <span className="text-sm text-muted-foreground">
            {completedCount}/{totalCount} done
          </span>
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {CHECKLIST_ITEMS.map((item) => {
          const done = setup[item.key];
          return (
            <Link
              key={item.key}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors ${
                done
                  ? "text-muted-foreground"
                  : "hover:bg-accent"
              }`}
            >
              {done ? (
                <Check className="size-4 text-green-500 shrink-0" />
              ) : (
                <Circle className="size-4 text-muted-foreground/50 shrink-0" />
              )}
              <span className={done ? "line-through" : ""}>
                {item.label}
              </span>
              {!done && (
                <ChevronRight className="size-4 ml-auto text-muted-foreground shrink-0" />
              )}
            </Link>
          );
        })}
        <div className="pt-2">
          <Button
            variant="ghost"
            size="sm"
            className="text-xs text-muted-foreground"
            onClick={handleDismiss}
          >
            Dismiss checklist
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
