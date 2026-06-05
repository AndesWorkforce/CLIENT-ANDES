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
  success: "",
  error: "border-l-4 border-red-500",
  info: "border-l-4 border-blue-500",
  warning: "border-l-4 border-yellow-500",
};

const toastIcons: Record<
  NotificationType,
  { icon: React.ReactNode; color: string }
> = {
  success: { icon: <CheckCircle size={34} strokeWidth={2} />, color: "#2D6A4F" },
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
  }, [removeNotification, notifications]);

  if (notifications.length === 0) return null;

  return (
    <div
      className={`fixed z-[150] flex flex-col gap-2 ${positionClasses[position]}`}
    >
      {notifications.map((notification) => {
        const isSuccess = notification.type === "success";
        const isCompact = notification.variant === "compact" && isSuccess;

        return (
          <div
            key={notification.id}
            className={`
              relative flex items-start justify-between
              ${
                isCompact
                  ? "w-[min(360px,calc(100vw-2rem))] rounded-[8px] bg-white px-[14px] pt-[15px] pb-[11px] shadow-[0px_2px_5px_rgba(112,112,112,0.17)]"
                  : isSuccess
                    ? "w-[min(538px,calc(100vw-2rem))] rounded-[11px] bg-white px-5 pt-[21px] pb-[15px] shadow-[0px_3px_7px_rgba(112,112,112,0.17)]"
                    : "rounded-lg border-l-4 bg-[#FCFEFF] px-6 py-4 shadow-lg"
              }
              ${toastStyles[notification.type]}
              ${
                exitingNotifications.includes(notification.id)
                  ? positionToAnimation[position].exit
                  : positionToAnimation[position].enter
              }
            `}
          >
            <div
              className={`flex items-start ${
                isCompact ? "gap-[17px] pr-6" : isSuccess ? "gap-6 pr-11" : "gap-3"
              }`}
            >
              <span
                className="shrink-0"
                style={{ color: toastIcons[notification.type].color }}
              >
                {isCompact ? (
                  <CheckCircle size={24} strokeWidth={2} className="text-[#2D6A4F]" />
                ) : (
                  toastIcons[notification.type].icon
                )}
              </span>
              <p
                className={
                  isCompact
                    ? "text-[14px] font-bold leading-[1.3] text-[#343434]"
                    : isSuccess
                      ? "text-[17.6px] font-bold leading-[1.3] text-[#343434]"
                      : "text-sm font-medium text-gray-700"
                }
              >
                {notification.message}
              </p>
            </div>
            <button
              type="button"
              onClick={() => handleRemoveNotification(notification.id)}
              className={`cursor-pointer shrink-0 rounded-full transition-colors ${
                isCompact
                  ? "absolute right-[14px] top-[15px] p-0 text-[#707070] hover:text-[#343434]"
                  : isSuccess
                    ? "absolute right-[15px] top-[15px] p-0 text-[#707070] hover:text-[#343434]"
                    : "ml-4 p-1 hover:bg-gray-100"
              }`}
              aria-label="Cerrar notificación"
            >
              <XIcon
                size={isCompact ? 18 : isSuccess ? 29 : 16}
                className={isCompact || isSuccess ? "" : "text-gray-400 hover:text-gray-600"}
              />
            </button>
          </div>
        );
      })}
    </div>
  );
}
