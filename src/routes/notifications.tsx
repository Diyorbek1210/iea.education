import { createFileRoute } from "@tanstack/react-router";
import { Bell, CheckCheck, Trash2, Flame, Trophy, Calendar, Target, Info } from "lucide-react";

import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { Button } from "@/components/ui/button";
import { useNotifications, type AppNotification } from "@/lib/useNotifications";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/notifications")({
  head: () => ({
    meta: [
      { title: "Notifications — IEA" },
      { name: "description", content: "View your notifications and reminders." },
      {}
    ]
  }),
  component: NotificationsPage,
});

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

function NotificationsPage() {
  const { notifications, unreadCount, markAsRead, markAllRead, clearAll, removeNotification } =
    useNotifications();

  return (
    <DashboardShell title="Notifications" subtitle={`${unreadCount} unread`}>
      <div className="space-y-4">
        {notifications.length > 0 && (
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <Button onClick={markAllRead} variant="soft" size="pill">
                <CheckCheck className="mr-2 h-4 w-4" /> Mark all read
              </Button>
            )}
            <Button onClick={clearAll} variant="ghost" size="pill">
              <Trash2 className="mr-2 h-4 w-4" /> Clear all
            </Button>
          </div>
        )}

        {notifications.length === 0 ? (
          <div className="rounded-3xl bg-card p-12 text-center shadow-card">
            <Bell className="mx-auto h-12 w-12 text-muted-foreground/30" />
            <h3 className="mt-4 text-lg font-bold text-foreground">All caught up!</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              You'll see notifications about streaks, badges, exam reminders, and more here.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {notifications.map((n) => {
              const Icon = TYPE_ICONS[n.type];
              return (
                <div
                  key={n.id}
                  className={cn(
                    "flex items-start gap-4 rounded-2xl border border-border p-4 transition-all",
                    !n.read ? "bg-accent/30 shadow-card" : "bg-card",
                  )}
                >
                  <div className={cn("mt-0.5 shrink-0", TYPE_COLORS[n.type])}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <p className={cn("font-bold", !n.read ? "text-foreground" : "text-muted-foreground")}>
                        {n.title}
                      </p>
                      <span className="shrink-0 text-xs text-muted-foreground">{timeAgo(n.date)}</span>
                    </div>
                    <p className="mt-1 text-sm text-muted-foreground">{n.message}</p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    {!n.read && (
                      <button
                        onClick={() => markAsRead(n.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                        title="Mark as read"
                      >
                        <CheckCheck className="h-4 w-4" />
                      </button>
                    )}
                    <button
                      onClick={() => removeNotification(n.id)}
                      className="rounded-lg p-1.5 text-muted-foreground hover:bg-destructive/10 hover:text-destructive"
                      title="Remove"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardShell>
  );
}
