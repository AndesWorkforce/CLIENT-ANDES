"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import CreateInvoiceItemForm, {
  type CreateItemFormData,
  isCreateItemFormComplete,
} from "./CreateInvoiceItemForm";
import type { InvoiceLineItem } from "../data/mock-invoice-details";

export type MovementType = "customer-charges" | "customer-credits";

type DrawerStep = "select-type" | "form";

const MOVEMENT_OPTIONS: { id: MovementType; label: string }[] = [
  { id: "customer-charges", label: "Customer Charges" },
  { id: "customer-credits", label: "Customer Credits" },
];

const EMPTY_FORM: CreateItemFormData = {
  tipo: "",
  descripcion: "",
  monto: "",
  moneda: "",
};

interface CreateInvoiceItemDrawerProps {
  open: boolean;
  onClose: () => void;
  onItemCreated: (item: InvoiceLineItem, movementType: MovementType) => void;
}

export default function CreateInvoiceItemDrawer({
  open,
  onClose,
  onItemCreated,
}: CreateInvoiceItemDrawerProps) {
  const [step, setStep] = useState<DrawerStep>("select-type");
  const [selectedType, setSelectedType] = useState<MovementType | null>(null);
  const [formData, setFormData] = useState<CreateItemFormData>(EMPTY_FORM);

  useEffect(() => {
    if (!open) {
      setStep("select-type");
      setSelectedType(null);
      setFormData(EMPTY_FORM);
    }
  }, [open]);

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

  const canGoNext = selectedType !== null;
  const isFormComplete = isCreateItemFormComplete(formData);

  function handleNext() {
    if (step === "select-type" && selectedType) {
      setFormData(EMPTY_FORM);
      setStep("form");
    }
  }

  function handleCreate() {
    if (!selectedType || !isFormComplete) return;

    const tipoLabel =
      formData.tipo === "team-building"
        ? "Team Building"
        : formData.tipo.charAt(0).toUpperCase() + formData.tipo.slice(1);

    const isCredit = selectedType === "customer-credits";
    const rawAmount = formData.monto.replace(/[^\d]/g, "");
    const numericAmount = parseInt(rawAmount, 10) || 0;
    const baseAmount = `$${numericAmount.toLocaleString("es-ES")}`;
    const formattedAmount = isCredit ? `-${baseAmount}` : baseAmount;

    const newItem: InvoiceLineItem = {
      id: `new-${Date.now()}`,
      date: new Date().toLocaleDateString("es-ES", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }).replace(/\//g, "."),
      type: tipoLabel,
      description: formData.descripcion,
      amount: formattedAmount,
      amountIsNegative: isCredit,
      status: "Pendiente",
      createdBy: "Violeta Q",
    };

    onItemCreated(newItem, selectedType);
    onClose();
  }

  return createPortal(
    <div className="fixed inset-0 z-[100] flex justify-end" role="dialog" aria-modal="true" aria-labelledby="create-item-title">
      <button
        type="button"
        aria-label="Cerrar panel"
        className="absolute inset-y-0 right-0 left-[210px] bg-black/40 xl:left-[280px]"
        onClick={onClose}
      />

      <aside className="relative flex h-full w-full max-w-[694px] flex-col bg-white shadow-[-8px_0_32px_rgba(0,0,0,0.12)] sm:w-1/2 sm:min-w-[400px]">
        <header className="shrink-0 border-b border-[#C8C8C8] bg-white px-8 pt-[30px] pb-6">
          <div className="flex flex-col items-end gap-6">
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-[#707070] hover:text-[#343434] transition-colors"
            >
              <X size={21} strokeWidth={1.75} />
            </button>
            <h2 id="create-item-title" className="w-full text-[24px] font-bold leading-[1.3] text-[#343434]">
              Crear ítem
            </h2>
          </div>
        </header>

        <div className="flex flex-1 flex-col overflow-y-auto bg-[#F8F8F8] px-7 pt-9 pb-8 sm:px-10 sm:pt-14">
          {step === "select-type" ? (
            <div className="flex w-full max-w-[624px] flex-col gap-[37px]">
              <h3 className="text-[22px] font-bold leading-[1.3] text-[#525252]">
                Seleccionar tipo de movimiento
              </h3>
              <div className="flex flex-col gap-4">
                {MOVEMENT_OPTIONS.map((option) => {
                  const isSelected = selectedType === option.id;
                  return (
                    <button
                      key={option.id}
                      type="button"
                      onClick={() => setSelectedType(option.id)}
                      className={`flex h-[76px] w-full items-center rounded-[8px] border border-[#EFEFEF] bg-white px-6 text-left shadow-[0px_2px_2px_rgba(202,202,202,0.25)] transition-colors ${
                        isSelected ? "ring-1 ring-[#0097B2]" : "hover:border-[#C8C8C8]"
                      }`}
                    >
                      <span className="text-[18px] font-bold leading-[1.3] text-[#343434]">
                        {option.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            selectedType && (
              <CreateInvoiceItemForm
                movementType={selectedType}
                formData={formData}
                onChange={setFormData}
              />
            )
          )}
        </div>

        <footer className="shrink-0 border-t border-[#C8C8C8] bg-[#F8F8F8] px-8 py-7">
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex h-9 items-center justify-center rounded-[8px] border border-[#858585] bg-white px-[22px] text-[14px] text-[#858585] leading-5 hover:bg-white transition-colors"
            >
              Cancelar
            </button>

            {step === "select-type" ? (
              <button
                type="button"
                disabled={!canGoNext}
                onClick={handleNext}
                className={`inline-flex h-9 items-center justify-center rounded-[8px] px-[22px] text-[14px] leading-5 transition-colors ${
                  canGoNext
                    ? "bg-[#0097B2] text-white hover:bg-[#008099]"
                    : "cursor-not-allowed bg-[#C8C8C8] text-[#707070]"
                }`}
              >
                Siguiente
              </button>
            ) : (
              <button
                type="button"
                disabled={!isFormComplete}
                onClick={handleCreate}
                className={`inline-flex h-9 items-center justify-center rounded-[8px] px-[22px] text-[14px] leading-5 transition-colors ${
                  isFormComplete
                    ? "bg-[#0097B2] text-white hover:bg-[#008099]"
                    : "cursor-not-allowed bg-[#C8C8C8] text-[#707070]"
                }`}
              >
                Crear movimiento
              </button>
            )}
          </div>
        </footer>
      </aside>
    </div>,
    document.body
  );
}
