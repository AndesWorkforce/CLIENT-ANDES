"use client";

import { useEffect, useState } from "react";
import AdminHubDrawerFooter from "../../components/AdminHubDrawerFooter";
import AdminHubSideDrawer from "../../components/AdminHubSideDrawer";
import AdminHubTypeSelectStep from "../../components/AdminHubTypeSelectStep";
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

  return (
    <AdminHubSideDrawer
      open={open}
      onClose={onClose}
      title="Crear ítem"
      titleId="create-item-title"
      footer={
        <AdminHubDrawerFooter
          onCancel={onClose}
          primaryLabel={step === "select-type" ? "Siguiente" : "Crear movimiento"}
          onPrimary={step === "select-type" ? handleNext : handleCreate}
          primaryDisabled={step === "select-type" ? !canGoNext : !isFormComplete}
        />
      }
    >
      {step === "select-type" ? (
        <AdminHubTypeSelectStep
          title="Seleccionar tipo de movimiento"
          options={MOVEMENT_OPTIONS}
          selectedId={selectedType}
          onSelect={setSelectedType}
        />
      ) : (
        selectedType && (
          <CreateInvoiceItemForm
            movementType={selectedType}
            formData={formData}
            onChange={setFormData}
          />
        )
      )}
    </AdminHubSideDrawer>
  );
}
