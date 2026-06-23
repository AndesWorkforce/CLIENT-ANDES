"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

interface AdminHubSideDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  headerExtra?: ReactNode;
  titleId?: string;
  children: ReactNode;
  footer: ReactNode;
}

export default function AdminHubSideDrawer({
  open,
  onClose,
  title,
  subtitle,
  headerExtra,
  titleId = "admin-hub-drawer-title",
  children,
  footer,
}: AdminHubSideDrawerProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex justify-end"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
    >
      <button
        type="button"
        aria-label="Cerrar panel"
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <aside className="relative z-10 flex h-full w-full max-w-[694px] flex-col bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.12)] sm:w-1/2 sm:min-w-[400px]">
        <header className="shrink-0 border-b border-[#C8C8C8] bg-white px-8 pt-[30px] pb-6">
          <div className="flex flex-col items-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-[#707070] hover:text-[#343434] transition-colors"
            >
              <X size={21} strokeWidth={1.75} />
            </button>
            <div className="flex w-full flex-col gap-2.5">
              <h2 id={titleId} className="text-[24px] font-bold leading-[1.3] text-[#343434]">
                {title}
              </h2>
              {subtitle && (
                <p className="text-[16px] leading-[1.3] text-[#343434]">{subtitle}</p>
              )}
              {headerExtra}
            </div>
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto bg-[#F8F8F8] px-7 pt-[34px] pb-8 sm:pl-7 sm:pr-[30px]">
          {children}
        </div>

        {footer}
      </aside>
    </div>,
    document.body
  );
}
