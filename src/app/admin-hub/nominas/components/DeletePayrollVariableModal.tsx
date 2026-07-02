"use client";

import { AlertTriangle, X } from "lucide-react";
import { useEffect } from "react";
import type { PayrollVariable } from "../data/mock-payroll-variables";

interface DeletePayrollVariableModalProps {
  variable: PayrollVariable | null;
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeletePayrollVariableModal({
  variable,
  open,
  onClose,
  onConfirm,
}: DeletePayrollVariableModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [open, onClose]);

  if (!open || !variable) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-[500px] rounded-[12px] bg-white p-8 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-[#858585] transition-colors hover:bg-[#F8F8F8] hover:text-[#343434]"
          aria-label="Cerrar"
        >
          <X size={20} />
        </button>

        <div className="flex flex-col gap-6">
          <div className="flex items-start gap-4">
            <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#FFF5F5]">
              <AlertTriangle size={24} className="text-[#E33434]" />
            </div>
            <div className="flex flex-col gap-2">
              <h2 className="text-[20px] font-bold leading-[1.3] text-black">
                Eliminar variable de nómina
              </h2>
              <p className="text-[14px] leading-[1.5] text-[#858585]">
                Esta acción no se puede deshacer. La variable será eliminada permanentemente.
              </p>
            </div>
          </div>

          <div className="rounded-[8px] border border-[#EFEFEF] bg-[#F8F8F8] p-4">
            <div className="flex flex-col gap-3">
              <div>
                <div className="text-[12px] font-medium text-[#858585]">Contratista</div>
                <div className="text-[14px] font-medium text-black">{variable.contractor}</div>
              </div>
              <div>
                <div className="text-[12px] font-medium text-[#858585]">Periodo de nómina</div>
                <div className="text-[14px] font-medium text-black">{variable.period}</div>
              </div>
              <div>
                <div className="text-[12px] font-medium text-[#858585]">Tipo</div>
                <div className="text-[14px] font-medium text-black">{variable.type}</div>
              </div>
            </div>
          </div>

          <div className="rounded-[8px] bg-[#FFF5F5] p-4">
            <div className="flex gap-3">
              <AlertTriangle size={18} className="mt-0.5 shrink-0 text-[#E33434]" />
              <div className="text-[14px] leading-[1.5] text-[#E33434]">
                <strong>Advertencia:</strong> Esta eliminación afectará los cálculos de la nómina
                y puede impactar los pagos y la facturación del periodo seleccionado.
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-10 items-center justify-center rounded-[8px] border border-[#C8C8C8] px-6 text-[14px] font-medium text-[#343434] transition-colors hover:bg-[#F8F8F8]"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="inline-flex h-10 items-center justify-center rounded-[8px] bg-[#E33434] px-6 text-[14px] font-medium text-white transition-colors hover:bg-[#C62828]"
            >
              Eliminar variable
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
