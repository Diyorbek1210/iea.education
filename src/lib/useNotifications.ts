import { useCallback } from "react";

import { useAppDispatch, useAppSelector } from "@/store";
import {
  addNotification as addAction,
  clearAll as clearAllAction,
  markAllRead as markAllReadAction,
  markAsRead as markAsReadAction,
  removeNotification as removeAction,
  type AppNotification,
  type NewNotification,
} from "@/store/slices/notificationsSlice";

export type { AppNotification };

export function useNotifications() {
  const notifications = useAppSelector((s) => s.notifications.notifications);
  const dispatch = useAppDispatch();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const addNotification = useCallback(
    (n: NewNotification) => {
      dispatch(addAction(n));
    },
    [dispatch],
  );

  const markAsRead = useCallback((id: string) => dispatch(markAsReadAction(id)), [dispatch]);

  const markAllRead = useCallback(() => dispatch(markAllReadAction()), [dispatch]);

  const clearAll = useCallback(() => dispatch(clearAllAction()), [dispatch]);

  const removeNotification = useCallback((id: string) => dispatch(removeAction(id)), [dispatch]);

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
