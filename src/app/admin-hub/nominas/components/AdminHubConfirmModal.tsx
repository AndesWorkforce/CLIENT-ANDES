"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CircleAlert, X } from "lucide-react";

interface AdminHubConfirmModalProps {
  open: boolean;
  title: string;
  children: ReactNode;
  cancelLabel?: string;
  confirmLabel: string;
  confirmLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

/**
 * Modal de confirmación (warning) alineado al diseño Figma Admin Hub.
 * Mantiene título/cuerpo/botones como props para no alterar copy de cada flujo.
 */
export default function AdminHubConfirmModal({
  open,
  title,
  children,
  cancelLabel = "Cancelar",
  confirmLabel,
  confirmLoading = false,
  onClose,
  onConfirm,
}: AdminHubConfirmModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape" && !confirmLoading) onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = "";
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose, confirmLoading]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-hub-confirm-modal-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/40"
        onClick={() => {
          if (!confirmLoading) onClose();
        }}
      />

      <div className="relative z-10 w-full max-w-[432px] rounded-[12px] bg-white p-[22px] shadow-[0px_4px_24px_rgba(0,0,0,0.12)]">
        <div className="flex w-full flex-col gap-8">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-start justify-between">
              <div className="flex size-[45px] shrink-0 items-center justify-center rounded-[22.5px] bg-[#DFFAFF] p-[10px]">
                <CircleAlert
                  size={26}
                  className="text-[#0097B2]"
                  strokeWidth={1.75}
                />
              </div>
              <button
                type="button"
                onClick={onClose}
                disabled={confirmLoading}
                aria-label="Cerrar"
                className="text-[#707070] transition-colors hover:text-[#343434] disabled:opacity-50"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex flex-col gap-[13px]">
              <h2
                id="admin-hub-confirm-modal-title"
                className="text-[18px] font-bold leading-[1.3] text-[#343434]"
              >
                {title}
              </h2>
              <div className="text-[14px] font-normal leading-[1.3] tracking-[0.28px] text-[#707070]">
                {children}
              </div>
            </div>
          </div>

          <div className="flex w-full gap-[15px]">
            <button
              type="button"
              onClick={onClose}
              disabled={confirmLoading}
              className="inline-flex h-11 w-[133px] shrink-0 items-center justify-center rounded-[8px] border border-[#C8C8C8] bg-white px-[22px] text-[14px] font-medium leading-[1.2] text-[#707070] transition-colors hover:bg-[#F8F8F8] disabled:opacity-50"
            >
              {cancelLabel}
            </button>
            <button
              type="button"
              onClick={onConfirm}
              disabled={confirmLoading}
              className="inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] font-medium leading-[1.2] text-white transition-colors hover:bg-[#008099] disabled:opacity-50"
            >
              {confirmLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  );
}
