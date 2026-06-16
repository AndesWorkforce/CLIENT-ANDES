"use client";

import { useEffect } from "react";
import { createPortal } from "react-dom";
import { CircleAlert, X } from "lucide-react";

export type PayrollEmitModalVariant = "cannot-emit" | "confirm-emit";

const MODAL_CONTENT: Record<
  PayrollEmitModalVariant,
  { title: string; description: string; primaryLabel: string }
> = {
  "cannot-emit": {
    title: "No es posible emitir la nómina",
    description:
      "Todas las variables deben estar aprobadas antes de emitir la nómina.",
    primaryLabel: "Volver al detalle",
  },
  "confirm-emit": {
    title: "Emitir Nómina",
    description:
      "Una vez emitida, la nómina quedará registrada y no podrá modificarse.",
    primaryLabel: "Emitir",
  },
};

interface PayrollEmitModalProps {
  open: boolean;
  variant: PayrollEmitModalVariant;
  onClose: () => void;
  onPrimaryAction: () => void;
}

export default function PayrollEmitModal({
  open,
  variant,
  onClose,
  onPrimaryAction,
}: PayrollEmitModalProps) {
  const content = MODAL_CONTENT[variant];

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
      aria-labelledby="payroll-emit-modal-title"
    >
      <button
        type="button"
        aria-label="Cerrar"
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
                aria-label="Cerrar"
                className="text-[#707070] transition-colors hover:text-[#343434]"
              >
                <X size={18} strokeWidth={1.75} />
              </button>
            </div>

            <div className="flex flex-col gap-[13px]">
              <h2
                id="payroll-emit-modal-title"
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
              className="inline-flex h-11 w-[133px] shrink-0 items-center justify-center rounded-[8px] border border-[#C8C8C8] bg-white px-[22px] text-[14px] leading-5 text-[#707070] transition-colors hover:bg-[#F8F8F8]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onPrimaryAction}
              className="inline-flex h-11 min-w-0 flex-1 items-center justify-center rounded-[8px] bg-[#0097B2] px-[22px] text-[14px] leading-5 text-white transition-colors hover:bg-[#008099]"
            >
              {content.primaryLabel}
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
