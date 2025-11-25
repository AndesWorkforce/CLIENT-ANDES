"use client";

import { Bell } from "lucide-react";
import { useEffect } from "react";
import { useAppNotificationsStore } from "@/store/app-notifications.store";

export default function NotificationsBell() {
  const { unread, toggle, refreshUnread, fetchLatest } =
    useAppNotificationsStore();

  useEffect(() => {
    refreshUnread();
    // pequeño polling liviano cada 60s
    const id = setInterval(() => refreshUnread(), 60000);
    return () => clearInterval(id);
  }, [refreshUnread]);

  const openSidebar = async () => {
    await fetchLatest();
    toggle(true);
  };

  return (
    <button
      onClick={openSidebar}
      className="relative inline-flex items-center justify-center w-9 h-9 rounded-full hover:bg-gray-100 cursor-pointer"
      aria-label="Notifications"
      title="Notifications"
    >
      <Bell className="w-5 h-5 text-[#0097B2]" />
      {unread > 0 && (
        <span className="absolute -top-0.5 -right-0.5 bg-red-600 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
          {unread > 99 ? "99+" : unread}
        </span>
      )}
    </button>
  );
}
