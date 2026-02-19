"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { Bell } from "lucide-react";
import {
  getNotifications,
  getUnreadNotificationCount,
  markNotificationsRead,
} from "@/lib/concierge-api";
import type { Notification } from "@/lib/concierge-types";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const POLL_INTERVAL = 30_000;

type Tab = "unread" | "all";

export function NotificationBell() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<Tab>("unread");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchUnreadCount = useCallback(async () => {
    try {
      const count = await getUnreadNotificationCount();
      setUnreadCount(count);
    } catch {
      // non-critical
    }
  }, []);

  // Poll unread count on mount + every 30s
  useEffect(() => {
    (async () => {
      try {
        const count = await getUnreadNotificationCount();
        setUnreadCount(count);
      } catch {
        // non-critical
      }
    })();
    timerRef.current = setInterval(fetchUnreadCount, POLL_INTERVAL);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [fetchUnreadCount]);

  // Listen for SSE-triggered refresh
  useEffect(() => {
    function handleRefresh() {
      fetchUnreadCount();
    }
    window.addEventListener("notifications:refresh", handleRefresh);
    return () =>
      window.removeEventListener("notifications:refresh", handleRefresh);
  }, [fetchUnreadCount]);

  // Fetch notifications when popover opens or tab changes
  const fetchVersionRef = useRef(0);
  useEffect(() => {
    if (!open) return;
    const version = ++fetchVersionRef.current;
    (async () => {
      try {
        const { results, count } = await getNotifications(tab);
        if (version !== fetchVersionRef.current) return; // stale
        setNotifications(results);
        setTotalCount(count);
      } catch {
        // non-critical
      }
    })();
  }, [open, tab]);

  async function handleMarkAllRead() {
    try {
      await markNotificationsRead([]);
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true })),
      );
      setUnreadCount(0);
      // If on unread tab, clear the list since they're all read now
      if (tab === "unread") {
        setNotifications([]);
        setTotalCount(0);
      }
    } catch {
      // Silently fail
    }
  }

  function handleNotificationClick(notification: Notification) {
    if (!notification.is_read) {
      markNotificationsRead([notification.id])
        .then(() => {
          setNotifications((prev) =>
            tab === "unread"
              ? prev.filter((n) => n.id !== notification.id)
              : prev.map((n) =>
                  n.id === notification.id ? { ...n, is_read: true } : n,
                ),
          );
          setUnreadCount((c) => Math.max(0, c - 1));
          if (tab === "unread") {
            setTotalCount((c) => Math.max(0, c - 1));
          }
        })
        .catch(() => {
          // non-critical — notification stays visually unread
        });
    }

    if (notification.request_public_id) {
      setOpen(false);
      router.push(`/dashboard/requests/${notification.request_public_id}`);
    }
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="ghost" size="icon" className="relative h-8 w-8">
          <Bell className="size-4" />
          {unreadCount > 0 && (
            <Badge
              variant="destructive"
              className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full p-0 text-[10px]"
            >
              {unreadCount > 99 ? "99+" : unreadCount}
            </Badge>
          )}
          <span className="sr-only">Notifications</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-80 p-0">
        {/* Header with tabs */}
        <div className="flex items-center justify-between px-4 py-3">
          <div className="flex items-center gap-2">
            <TabButton active={tab === "unread"} onClick={() => setTab("unread")}>
              Unread{unreadCount > 0 ? ` (${unreadCount})` : ""}
            </TabButton>
            <TabButton active={tab === "all"} onClick={() => setTab("all")}>
              All
            </TabButton>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
              onClick={handleMarkAllRead}
            >
              Mark all read
            </Button>
          )}
        </div>
        <Separator />
        <ScrollArea className="max-h-96">
          {notifications.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {tab === "unread" ? "All caught up!" : "No notifications yet"}
            </p>
          ) : (
            <div className="divide-y">
              {notifications.map((n) => (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  className="flex w-full gap-3 px-4 py-3 text-left transition-colors hover:bg-muted/50"
                >
                  <div className="mt-1.5 shrink-0">
                    {!n.is_read ? (
                      <div className="size-2 rounded-full bg-primary" />
                    ) : (
                      <div className="size-2" />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p
                      className={`truncate text-sm ${!n.is_read ? "font-medium" : ""}`}
                    >
                      {n.title}
                    </p>
                    <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                      {n.body}
                    </p>
                    <time className="mt-1 block text-[10px] text-muted-foreground">
                      {formatRelative(n.created_at)}
                    </time>
                  </div>
                </button>
              ))}
              {totalCount > notifications.length && (
                <p className="py-2 text-center text-xs text-muted-foreground">
                  {totalCount - notifications.length} more not shown
                </p>
              )}
            </div>
          )}
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-sm font-medium transition-colors ${
        active
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground"
      }`}
    >
      {children}
    </button>
  );
}

function formatRelative(iso: string): string {
  const now = Date.now();
  const then = new Date(iso).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}
