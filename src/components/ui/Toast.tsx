"use client";

import { useEffect, useState } from "react";
import {
  XIcon,
  CheckCircle,
  AlertCircle,
  Info,
  AlertTriangle,
} from "lucide-react";
import {
  useNotificationStore,
  type NotificationType,
} from "@/store/notifications.store";

type Position = "top-right" | "top-left" | "bottom-right" | "bottom-left";

interface ToastProps {
  position?: Position;
}

const positionClasses: Record<Position, string> = {
  "top-right": "top-4 right-4",
  "top-left": "top-4 left-4",
  "bottom-right": "bottom-4 right-4",
  "bottom-left": "bottom-4 left-4",
};

const positionToAnimation: Record<Position, { enter: string; exit: string }> = {
  "top-right": {
    enter: "animate-slide-in-right",
    exit: "animate-slide-out-right",
  },
  "top-left": {
    enter: "animate-slide-in-left",
    exit: "animate-slide-out-left",
  },
  "bottom-right": {
    enter: "animate-slide-in-right",
    exit: "animate-slide-out-right",
  },
  "bottom-left": {
    enter: "animate-slide-in-left",
    exit: "animate-slide-out-left",
  },
};

const toastStyles: Record<NotificationType, string> = {
  success: "border-[#0097B2]",
  error: "border-red-500",
  info: "border-blue-500",
  warning: "border-yellow-500",
};

const toastIcons: Record<
  NotificationType,
  { icon: React.ReactNode; color: string }
> = {
  success: { icon: <CheckCircle size={20} />, color: "#0097B2" },
  error: { icon: <AlertCircle size={20} />, color: "#EF4444" },
  info: { icon: <Info size={20} />, color: "#3B82F6" },
  warning: { icon: <AlertTriangle size={20} />, color: "#F59E0B" },
};

export function Toast({ position = "top-right" }: ToastProps = {}) {
  const { notifications, removeNotification } = useNotificationStore();
  const [exitingNotifications, setExitingNotifications] = useState<string[]>(
    []
  );

  const handleRemoveNotification = (id: string) => {
    setExitingNotifications((prev) => [...prev, id]);
    setTimeout(() => {
      removeNotification(id);
      setExitingNotifications((prev) =>
        prev.filter((notifId) => notifId !== id)
      );
    }, 500); // Ajustado a la duración de la animación de entrada
  };

  useEffect(() => {
    return () => {
      notifications.forEach((notification) => {
        removeNotification(notification.id);
      });
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <div
      className={`fixed z-50 flex flex-col gap-2 ${positionClasses[position]}`}
    >
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`
            flex items-center justify-between
            rounded-lg px-6 py-4
            shadow-lg
            border-l-4
            bg-[#FCFEFF]
            ${toastStyles[notification.type]}
            ${
              exitingNotifications.includes(notification.id)
                ? positionToAnimation[position].exit
                : positionToAnimation[position].enter
            }
          `}
        >
          <div className="flex items-center gap-3">
            <span style={{ color: toastIcons[notification.type].color }}>
              {toastIcons[notification.type].icon}
            </span>
            <p className="text-sm font-medium text-gray-700">
              {notification.message}
            </p>
          </div>
          <button
            onClick={() => handleRemoveNotification(notification.id)}
            className="cursor-pointer ml-4 rounded-full p-1 hover:bg-gray-100 transition-colors"
          >
            <XIcon size={16} className="text-gray-400 hover:text-gray-600" />
          </button>
        </div>
      ))}
    </div>
  );
}
