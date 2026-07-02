"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { PayrollDetail } from "../data/mock-payroll-detail";
import PayrollPayslipPreview from "./PayrollPayslipPreview";

interface PayrollPayslipPreviewModalProps {
  open: boolean;
  onClose: () => void;
  detail: PayrollDetail;
}

export default function PayrollPayslipPreviewModal({
  open,
  onClose,
  detail,
}: PayrollPayslipPreviewModalProps) {
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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payroll-preview-modal-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[calc(100vh-48px)] w-full max-w-[1040px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_4px_24px_rgba(0,0,0,0.16)]">
        <div className="flex shrink-0 items-center justify-between border-b border-[#EFEFEF] px-5 py-4">
          <h2
            id="payroll-preview-modal-title"
            className="text-[18px] font-bold leading-[1.3] text-black"
          >
            Previsualización del desprendible
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="rounded p-1 text-[#707070] transition-colors hover:bg-[#F8F8F8] hover:text-[#343434]"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto p-4 sm:p-6">
          <PayrollPayslipPreview detail={detail} />
        </div>
      </div>
    </div>,
    document.body
  );
}
