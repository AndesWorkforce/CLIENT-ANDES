import { create } from "zustand";

export type NotificationType = "success" | "error" | "info" | "warning";

export type NotificationVariant = "default" | "compact";

export interface Notification {
  id: string;
  message: string;
  type: NotificationType;
  variant?: NotificationVariant;
}

interface NotificationStore {
  notifications: Notification[];
  addNotification: (
    message: string,
    type: NotificationType,
    variant?: NotificationVariant
  ) => void;
  removeNotification: (id: string) => void;
}

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  addNotification: (
    message: string,
    type: NotificationType,
    variant: NotificationVariant = "default"
  ) => {
    const id = Math.random().toString(36).substring(2, 9);
    set((state) => ({
      notifications: [
        ...state.notifications,
        {
          id,
          message,
          type,
          variant,
        },
      ],
    }));

    setTimeout(() => {
      set((state) => ({
        notifications: state.notifications.filter((n) => n.id !== id),
      }));
    }, 5000);
  },
  removeNotification: (id: string) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
}));
