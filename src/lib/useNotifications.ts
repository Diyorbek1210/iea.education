import { useState, useEffect, useCallback } from "react";

export interface AppNotification {
  id: string;
  type: "streak" | "badge" | "exam" | "reminder" | "milestone" | "info";
  title: string;
  message: string;
  date: string;
  read: boolean;
  actionUrl?: string;
}

const NOTIF_KEY = "iea_notifications";

function load(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
  } catch {
    return [];
  }
}

function save(notifs: AppNotification[]) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NOTIF_KEY, JSON.stringify(notifs));
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<AppNotification[]>(load);

  useEffect(() => {
    save(notifications);
  }, [notifications]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (n: Omit<AppNotification, "id" | "date" | "read">) => {
      const notif: AppNotification = {
        ...n,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        read: false,
      };
      setNotifications((prev) => [notif, ...prev].slice(0, 50));
    },
    [],
  );

  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  }, []);

  const markAllRead = useCallback(() => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  }, []);

  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  return {
    notifications,
    unreadCount,
    addNotification,
    markAsRead,
    markAllRead,
    clearAll,
    removeNotification,
  };
}
