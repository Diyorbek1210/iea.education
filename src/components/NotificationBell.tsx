import { useState, useRef, useEffect } from "react";
import { Link } from "@tanstack/react-router";
import { Bell, Check, CheckCheck, Trash2, Flame, Trophy, Calendar, Target, Info } from "lucide-react";
import { useNotifications, type AppNotification } from "@/lib/useNotifications";
import { cn } from "@/lib/utils";

const TYPE_ICONS: Record<AppNotification["type"], typeof Bell> = {
  streak: Flame,
  badge: Trophy,
  exam: Calendar,
  reminder: Target,
  milestone: Trophy,
  info: Info,
};

const TYPE_COLORS: Record<AppNotification["type"], string> = {
  streak: "text-orange-500",
  badge: "text-yellow-500",
  exam: "text-blue-500",
  reminder: "text-purple-500",
  milestone: "text-green-500",
  info: "text-muted-foreground",
};

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function NotificationBell() {
  const { notifications, unreadCount, markAsRead, markAllRead, removeNotification } =
    useNotifications();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="relative rounded-xl border border-border p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
        aria-label={`Notifications${unreadCount > 0 ? ` (${unreadCount} unread)` : ""}`}
      >
        <Bell className="h-4 w-4" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-2xl border border-border bg-card shadow-2xl overflow-hidden">
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <h3 className="text-sm font-bold text-foreground">Notifications</h3>
            {unreadCount > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-xs text-primary hover:text-primary/80"
              >
                <CheckCheck className="h-3 w-3" /> Mark all read
              </button>
            )}
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="py-8 text-center">
                <Bell className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">No notifications yet</p>
              </div>
            ) : (
              notifications.slice(0, 20).map((n) => {
                const Icon = TYPE_ICONS[n.type];
                return (
                  <div
                    key={n.id}
                    className={cn(
                      "flex items-start gap-3 border-b border-border px-4 py-3 transition-colors",
                      !n.read && "bg-accent/30",
                    )}
                  >
                    <div className={cn("mt-0.5 shrink-0", TYPE_COLORS[n.type])}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className={cn("text-sm font-semibold", !n.read ? "text-foreground" : "text-muted-foreground")}>
                          {n.title}
                        </p>
                        <span className="shrink-0 text-[10px] text-muted-foreground">{timeAgo(n.date)}</span>
                      </div>
                      <p className="mt-0.5 text-xs text-muted-foreground line-clamp-2">{n.message}</p>
                      <div className="mt-1 flex items-center gap-2">
                        {!n.read && (
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="flex items-center gap-1 text-[10px] text-primary hover:text-primary/80"
                          >
                            <Check className="h-3 w-3" /> Mark read
                          </button>
                        )}
                        <button
                          onClick={() => removeNotification(n.id)}
                          className="flex items-center gap-1 text-[10px] text-muted-foreground hover:text-destructive"
                        >
                          <Trash2 className="h-3 w-3" /> Remove
                        </button>
                        {n.actionUrl && (
                          <Link
                            to={n.actionUrl}
                            onClick={() => setOpen(false)}
                            className="text-[10px] text-primary hover:text-primary/80"
                          >
                            View →
                          </Link>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {notifications.length > 0 && (
            <div className="border-t border-border px-4 py-2">
              <Link
                to="/notifications"
                onClick={() => setOpen(false)}
                className="block text-center text-xs font-semibold text-primary hover:text-primary/80"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
