import { create } from "zustand";
import {
  getLatestNotifications,
  getUnreadNotificationsCount,
  markNotificationAsRead,
  markAllNotificationsAsRead,
} from "@/app/admin/dashboard/actions/notifications.actions";

export type AppNotification = {
  id: string;
  titulo: string;
  mensaje: string;
  tipo: string;
  leida: boolean;
  fechaCreacion: string;
  postulacionId?: string | null;
  datos?: string | null;
};

type State = {
  items: AppNotification[];
  unread: number;
  open: boolean;
  loading: boolean;
  limit: number;
};

type Actions = {
  toggle: (open?: boolean) => void;
  fetchLatest: (limit?: number) => Promise<void>;
  refreshUnread: () => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
};

export const useAppNotificationsStore = create<State & Actions>((set, get) => ({
  items: [],
  unread: 0,
  open: false,
  loading: false,
  limit: 7,

  toggle: (open) => set((s) => ({ open: open !== undefined ? open : !s.open })),

  fetchLatest: async (limit) => {
    const lim = limit ?? get().limit;
    set({ loading: true });
    try {
      const res = await getLatestNotifications(lim);
      if (res?.success) {
        const { items, unreadCount } = res.data || {};
        set({ items: items || [], unread: unreadCount || 0 });
      } else if (res?.error?.statusCode === 401) {
        // Token expirado, disparar evento para desloguear
        console.warn("[NotificationsStore] 401 detectado en fetchLatest");
        window.dispatchEvent(new CustomEvent("unauthorized"));
      }
    } catch (e) {
      // swallow to avoid UI crash
      console.error("fetchLatest notifications failed", e);
    } finally {
      set({ loading: false });
    }
  },

  refreshUnread: async () => {
    try {
      const res = await getUnreadNotificationsCount();
      if (res?.success) {
        set({ unread: res.data?.unread ?? 0 });
      } else if (res?.error?.statusCode === 401) {
        // Token expirado, disparar evento para desloguear
        console.warn("[NotificationsStore] 401 detectado en refreshUnread");
        window.dispatchEvent(new CustomEvent("unauthorized"));
      }
    } catch (e) {
      console.error("refreshUnread failed", e);
    }
  },

  markAsRead: async (id: string) => {
    try {
      const res = await markNotificationAsRead(id);
      if (res?.success) {
        set((s) => ({
          items: s.items.map((n) => (n.id === id ? { ...n, leida: true } : n)),
          unread: Math.max(0, s.unread - 1),
        }));
      }
    } catch (e) {
      console.error("markAsRead failed", e);
    }
  },
  markAllAsRead: async () => {
    try {
      const res = await markAllNotificationsAsRead();
      if (res?.success) {
        set((s) => ({
          items: s.items.map((n) => ({ ...n, leida: true })),
          unread: 0,
        }));
      }
    } catch (e) {
      console.error("markAllAsRead failed", e);
    }
  },
}));
