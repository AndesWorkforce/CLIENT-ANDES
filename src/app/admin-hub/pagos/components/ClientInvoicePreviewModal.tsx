"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import type { InvoiceDetail } from "../types/invoice-detail.types";
import ClientInvoicePreview from "./ClientInvoicePreview";
import { t } from "../../i18n";

interface ClientInvoicePreviewModalProps {
  open: boolean;
  onClose: () => void;
  invoice: InvoiceDetail | null;
  isLoading?: boolean;
  error?: string | null;
}

export default function ClientInvoicePreviewModal({
  open,
  onClose,
  invoice,
  isLoading = false,
  error = null,
}: ClientInvoicePreviewModalProps) {
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
      aria-labelledby="client-invoice-preview-modal-title"
    >
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      <div className="relative z-10 flex max-h-[calc(100vh-48px)] w-full max-w-[900px] flex-col overflow-hidden rounded-[12px] bg-white shadow-[0px_4px_24px_rgba(0,0,0,0.16)]">
        <div className="flex shrink-0 items-center justify-between border-b border-[#EFEFEF] px-5 py-4">
          <h2
            id="client-invoice-preview-modal-title"
            className="text-[18px] font-bold leading-[1.3] text-black"
          >
            {invoice?.numeroFactura ?? t("pagos.invoiceNumber")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("common.close")}
            className="rounded p-1 text-[#707070] transition-colors hover:bg-[#F8F8F8] hover:text-[#343434]"
          >
            <X size={20} strokeWidth={1.75} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-auto bg-[#F4F5F7] p-4 sm:p-6">
          {isLoading ? (
            <div className="mx-auto h-[1000px] w-[794px] animate-pulse rounded-2xl bg-white/70" />
          ) : error ? (
            <div className="rounded-[8px] border border-[#F5C2C7] bg-[#FDF2F3] px-5 py-4 text-[14px] text-[#B02A37]">
              {error}
            </div>
          ) : invoice ? (
            <ClientInvoicePreview invoice={invoice} />
          ) : null}
        </div>
      </div>
    </div>,
    document.body
  );
}
