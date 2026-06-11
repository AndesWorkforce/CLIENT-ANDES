"use client";

import { useEffect, useMemo, useState } from "react";
import AdminHubDrawerFooter from "../../components/AdminHubDrawerFooter";
import AdminHubSideDrawer from "../../components/AdminHubSideDrawer";
import AdminHubTypeSelectStep from "../../components/AdminHubTypeSelectStep";
import { getContractorsByClient } from "../../nominas/data/mock-contractors";
import CreateAdditionalItemForm, {
  type CreateAdditionalFormData,
  isAdditionalFormComplete,
} from "./CreateAdditionalItemForm";
import CreateInvoiceItemForm, {
  type CreateItemFormData,
  isCreateItemFormComplete,
} from "./CreateInvoiceItemForm";
import type { InvoiceAdditionalFee, InvoiceLineItem } from "../data/mock-invoice-details";

export type MovementType = "customer-charges" | "customer-credits" | "adicionales";

type DrawerStep = "select-type" | "form";

const MOVEMENT_OPTIONS: { id: MovementType; label: string }[] = [
  { id: "customer-charges", label: "Cargos al cliente" },
  { id: "customer-credits", label: "Créditos al cliente" },
  { id: "adicionales", label: "Adicionales" },
];

const EMPTY_FORM: CreateItemFormData = {
  tipo: "",
  descripcion: "",
  monto: "",
  moneda: "",
};

const EMPTY_ADDITIONAL_FORM: CreateAdditionalFormData = {
  contratista: "",
  descripcion: "",
  monto: "",
};

const TYPE_LABELS: Record<string, string> = {
  "team-building": "Team Building",
  nomina: "Nómina",
  bono: "Bono",
  tarifa: "Tarifa",
  deduccion: "Deducción",
  correccion: "Corrección",
  equipamiento: "Equipamiento",
  capacitacion: "Capacitación",
  viaje: "Viaje",
  overtime: "Overtime",
};

interface CreateInvoiceItemDrawerProps {
  open: boolean;
  client: string;
  onClose: () => void;
  onItemCreated: (item: InvoiceLineItem, movementType: MovementType) => void;
  onAdditionalFeeCreated: (fee: InvoiceAdditionalFee) => void;
}

export default function CreateInvoiceItemDrawer({
  open,
  client,
  onClose,
  onItemCreated,
  onAdditionalFeeCreated,
}: CreateInvoiceItemDrawerProps) {
  const [step, setStep] = useState<DrawerStep>("select-type");
  const [selectedType, setSelectedType] = useState<MovementType | null>(null);
  const [formData, setFormData] = useState<CreateItemFormData>(EMPTY_FORM);
  const [additionalFormData, setAdditionalFormData] =
    useState<CreateAdditionalFormData>(EMPTY_ADDITIONAL_FORM);

  const { contractorOptions, contractorPositionMap } = useMemo(() => {
    const contractors = getContractorsByClient(client);
    const positionMap = new Map<string, string>();

    if (contractors.length > 0) {
      const options = contractors.map(({ contractorName, contract }) => {
        positionMap.set(contractorName, contract.position);
        return { value: contractorName, label: contractorName };
      });
      return { contractorOptions: options, contractorPositionMap: positionMap };
    }

    const fallbacks = [
      { name: "Juan Perez", position: "Intake Specialist" },
      { name: "Laura Sanchez", position: "Intake Specialist" },
      { name: "Maria Dominguez", position: "Project Coordinator" },
      { name: "Martin Diaz", position: "Welcome Call" },
    ];

    fallbacks.forEach(({ name, position }) => positionMap.set(name, position));

    return {
      contractorOptions: fallbacks.map(({ name }) => ({ value: name, label: name })),
      contractorPositionMap: positionMap,
    };
  }, [client]);

  useEffect(() => {
    if (!open) {
      setStep("select-type");
      setSelectedType(null);
      setFormData(EMPTY_FORM);
      setAdditionalFormData(EMPTY_ADDITIONAL_FORM);
    }
  }, [open]);

  const canGoNext = selectedType !== null;
  const isFormComplete =
    selectedType === "adicionales"
      ? isAdditionalFormComplete(additionalFormData)
      : isCreateItemFormComplete(formData);

  function handleNext() {
    if (step === "select-type" && selectedType) {
      setFormData(EMPTY_FORM);
      setAdditionalFormData(EMPTY_ADDITIONAL_FORM);
      setStep("form");
    }
  }

  function formatTipoLabel(tipo: string): string {
    return TYPE_LABELS[tipo] ?? tipo.charAt(0).toUpperCase() + tipo.slice(1);
  }

  function buildLineItem(
    tipo: string,
    contractor: string,
    description: string,
    monto: string,
    moneda: string,
    isCredit: boolean
  ): InvoiceLineItem {
    const rawAmount = monto.replace(/[^\d]/g, "");
    const numericAmount = parseInt(rawAmount, 10) || 0;
    const baseAmount = `$${numericAmount.toLocaleString("es-ES")}`;

    return {
      id: `new-${Date.now()}`,
      date: new Date()
        .toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        })
        .replace(/\//g, "."),
      type: formatTipoLabel(tipo),
      contractor,
      description,
      amount: isCredit ? `-${baseAmount}` : baseAmount,
      currency: moneda,
      amountIsNegative: isCredit,
      status: "Pendiente",
      createdBy: "Violeta Q",
    };
  }

  function handleCreate() {
    if (!selectedType || !isFormComplete) return;

    if (selectedType === "adicionales") {
      const rawAmount = additionalFormData.monto.replace(/[^\d]/g, "");
      const numericAmount = parseInt(rawAmount, 10) || 0;

      const newFee: InvoiceAdditionalFee = {
        id: `new-${Date.now()}`,
        date: new Date()
          .toLocaleDateString("es-ES", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          })
          .replace(/\//g, "."),
        contractor: additionalFormData.contratista,
        position:
          contractorPositionMap.get(additionalFormData.contratista) ?? "—",
        description: additionalFormData.descripcion,
        amount: `$${numericAmount.toLocaleString("es-ES")}`,
        status: "Pendiente",
        createdBy: "Violeta Q",
      };
      onAdditionalFeeCreated(newFee);
    } else {
      const isCredit = selectedType === "customer-credits";
      const newItem = buildLineItem(
        formData.tipo,
        "",
        formData.descripcion,
        formData.monto,
        formData.moneda,
        isCredit
      );
      onItemCreated(newItem, selectedType);
    }

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
      ) : selectedType === "adicionales" ? (
        <CreateAdditionalItemForm
          formData={additionalFormData}
          onChange={setAdditionalFormData}
          contractorOptions={contractorOptions}
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
