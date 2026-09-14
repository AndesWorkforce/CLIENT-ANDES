"use client";

import { useEffect, useMemo } from "react";
import { createPortal } from "react-dom";
import { CircleAlert, X } from "lucide-react";
import { useAdminHubI18n } from "../../i18n";

export type InvoiceEmitModalVariant = "cannot-emit" | "confirm-emit";

interface InvoiceEmitModalProps {
  open: boolean;
  variant: InvoiceEmitModalVariant;
  onClose: () => void;
  onPrimaryAction: () => void;
  isLoading?: boolean;
}

export default function InvoiceEmitModal({
  open,
  variant,
  onClose,
  onPrimaryAction,
  isLoading = false,
}: InvoiceEmitModalProps) {
  const { t } = useAdminHubI18n();
  const content = useMemo(() => {
    if (variant === "cannot-emit") {
      return {
        title: t("pagos.emitBlocked"),
        description: t("pagos.emitChargesPending"),
        primaryLabel: t("pagos.backToInvoice"),
      };
    }
    return {
      title: t("pagos.emitInvoice"),
      description: t("pagos.emitConfirm"),
      primaryLabel: t("common.emit"),
    };
  }, [t, variant]);

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
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="invoice-emit-modal-title"
    >
      <button
        type="button"
        aria-label={t("common.close")}
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      <div className="relative z-10 w-full max-w-[432px] rounded-[12px] bg-white p-[22px] shadow-[0px_4px_24px_rgba(0,0,0,0.12)]">
        <div className="flex w-full max-w-[388px] flex-col gap-8">
          <div className="flex w-full flex-col gap-3">
            <div className="flex w-full items-start justify-between">
              <div className="flex size-[45px] shrink-0 items-center justify-center rounded-[22.5px] bg-[#DFFAFF] p-[10px]">
                <CircleAlert size={26} className="text-[#0097B2]" strokeWidth={1.75} />
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label={t("common.close")}
                className="text-[#707070] transition-colors hover:text-[#343434]"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex flex-col gap-[13px]">
              <h2
                id="invoice-emit-modal-title"
                className="text-[18px] font-bold leading-[1.3] text-[#343434]"
              >
                {content.title}
              </h2>
              <p className="text-[14px] font-normal leading-[1.3] tracking-[0.28px] text-[#707070]">
                {content.description}
              </p>
            </div>
          </div>

          <div className="flex w-full gap-[15px]">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="inline-flex h-11 w-[133px] shrink-0 items-center justify-center rounded-[8px] border border-[#C8C8C8] bg-white px-[22px] text-[14px] leading-5 text-[#707070] transition-colors hover:bg-[#F8F8F8] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {t("common.cancel")}
            </button>
            <button
              type="button"
              onClick={onPrimaryAction}
              disabled={isLoading}
              className="inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] leading-5 text-white transition-colors hover:bg-[#008099] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t("pagos.processing") : content.primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
