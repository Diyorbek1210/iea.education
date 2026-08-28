import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

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

export type NewNotification = Omit<AppNotification, "id" | "date" | "read">;

function loadNotifications(): AppNotification[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(NOTIF_KEY) || "[]");
  } catch {
    return [];
  }
}

interface NotificationsState {
  notifications: AppNotification[];
}

const initialState: NotificationsState = {
  notifications: loadNotifications(),
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification(state, action: PayloadAction<NewNotification>) {
      const notif: AppNotification = {
        ...action.payload,
        id: crypto.randomUUID(),
        date: new Date().toISOString(),
        read: false,
      };
      state.notifications = [notif, ...state.notifications].slice(0, 50);
      if (typeof window !== "undefined") {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(state.notifications));
      }
    },
    markAsRead(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.map((n) =>
        n.id === action.payload ? { ...n, read: true } : n,
      );
      if (typeof window !== "undefined") {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(state.notifications));
      }
    },
    markAllRead(state) {
      state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
      if (typeof window !== "undefined") {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(state.notifications));
      }
    },
    clearAll(state) {
      state.notifications = [];
      if (typeof window !== "undefined") {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(state.notifications));
      }
    },
    removeNotification(state, action: PayloadAction<string>) {
      state.notifications = state.notifications.filter((n) => n.id !== action.payload);
      if (typeof window !== "undefined") {
        localStorage.setItem(NOTIF_KEY, JSON.stringify(state.notifications));
      }
    },
  },
});

export const { addNotification, markAsRead, markAllRead, clearAll, removeNotification } =
  notificationsSlice.actions;
export default notificationsSlice.reducer;
