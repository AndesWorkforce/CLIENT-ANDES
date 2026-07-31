"use client";

import { useEffect, useMemo, useState } from "react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubDrawerFooter from "../../components/AdminHubDrawerFooter";
import AdminHubSideDrawer from "../../components/AdminHubSideDrawer";
import AdminHubTypeSelectStep from "../../components/AdminHubTypeSelectStep";
import {
  createCustomerCharge,
  type TipoCargoCliente,
  createCustomerCredit,
  type CategoriaAjusteFactura,
} from "../actions/pagos.actions";
import { displayPeriodToApiPeriod } from "../actions/pagos.utils";
import type { InvoicePayrollEntry } from "../types/invoice-detail.types";
import CreateAdditionalItemForm, {
  type CreateAdditionalFormData,
  isAdditionalFormComplete,
} from "./CreateAdditionalItemForm";
import CreateInvoiceItemForm, {
  type CreateItemFormData,
  isCreateItemFormComplete,
} from "./CreateInvoiceItemForm";
import type { InvoiceAdditionalFee, InvoiceLineItem } from "../types/invoice-detail.types";

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
  empresaId: string;
  periodo: string;
  payrollEntries?: InvoicePayrollEntry[];
  onClose: () => void;
  onItemCreated: (item: InvoiceLineItem, movementType: MovementType) => void;
  onAdditionalFeeCreated: (fee: InvoiceAdditionalFee) => void;
  onChargeCreated?: () => void;
}

export default function CreateInvoiceItemDrawer({
  open,
  client: _client,
  empresaId,
  periodo,
  payrollEntries = [],
  onClose,
  onItemCreated,
  onAdditionalFeeCreated,
  onChargeCreated,
}: CreateInvoiceItemDrawerProps) {
  const [step, setStep] = useState<DrawerStep>("select-type");
  const [selectedType, setSelectedType] = useState<MovementType | null>(null);
  const [formData, setFormData] = useState<CreateItemFormData>(EMPTY_FORM);
  const [additionalFormData, setAdditionalFormData] =
    useState<CreateAdditionalFormData>(EMPTY_ADDITIONAL_FORM);
  const [isCreating, setIsCreating] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const { contractorOptions, contractorPositionMap } = useMemo(() => {
    const positionMap = new Map<string, string>();
    const options = payrollEntries.map((entry) => {
      positionMap.set(entry.contractorName, entry.position);
      return { value: entry.contractorName, label: entry.contractorName };
    });

    return { contractorOptions: options, contractorPositionMap: positionMap };
  }, [payrollEntries]);

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
    const rawAmount = monto.replace(/[^\d.]/g, "");
    const numericAmount = parseFloat(rawAmount) || 0;
    const baseAmount = `$${numericAmount.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;

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

  async function handleCreate() {
    if (!selectedType || !isFormComplete || isCreating) return;

    if (selectedType === "adicionales") {
      const rawAmount = additionalFormData.monto.replace(/[^\d.]/g, "");
      const numericAmount = parseFloat(rawAmount) || 0;

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
        amount: `$${numericAmount.toLocaleString("en-US", {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}`,
        status: "Pendiente",
        createdBy: "Violeta Q",
      };
      onAdditionalFeeCreated(newFee);
      onClose();
      return;
    }

    if (selectedType === "customer-charges") {
      setIsCreating(true);
      try {
        const rawAmount = formData.monto.replace(/[^\d.]/g, "");
        const numericAmount = parseFloat(rawAmount) || 0;

        const tipoMap: Record<string, TipoCargoCliente> = {
          "team-building": "TEAM_BUILDING",
          equipamiento: "EQUIPO",
          capacitacion: "CAPACITACION",
        };

        const tipo = tipoMap[formData.tipo] || "OTRO";
        const apiPeriodo = displayPeriodToApiPeriod(periodo);

        const result = await createCustomerCharge({
          empresaId,
          tipo,
          monto: numericAmount,
          moneda: formData.moneda || "USD",
          fecha: new Date().toISOString().split("T")[0],
          periodo: apiPeriodo,
          descripcion: formData.descripcion,
        });

        if (result.success) {
          addNotification("Cargo creado exitosamente", "success");
          onChargeCreated?.();
          onClose();
        } else {
          addNotification(result.message || "Error al crear el cargo", "error");
        }
      } catch (error) {
        addNotification("Error inesperado al crear el cargo", "error");
      } finally {
        setIsCreating(false);
      }
      return;
    }

    if (selectedType === "customer-credits") {
      setIsCreating(true);
      try {
        const rawAmount = formData.monto.replace(/[^\d.]/g, "");
        const numericAmount = parseFloat(rawAmount) || 0;

        const categoriaMap: Record<string, CategoriaAjusteFactura> = {
          renuncia: "RENUNCIA",
          "deduccion-dias": "DEDUCCION_DIAS_LIBRES",
          ausencia: "AUSENCIA",
          ajuste: "AJUSTE_MANUAL",
        };

        const categoria = categoriaMap[formData.tipo] || "AJUSTE_MANUAL";
        const apiPeriodo = displayPeriodToApiPeriod(periodo);

        const result = await createCustomerCredit({
          empresaId,
          periodo: apiPeriodo,
          tipo: "CREDIT",
          monto: numericAmount,
          categoria,
          motivo: formData.descripcion,
          fecha: new Date().toISOString().split("T")[0],
        });

        if (result.success) {
          addNotification("Crédito creado exitosamente", "success");
          onChargeCreated?.();
          onClose();
        } else {
          addNotification(result.message || "Error al crear el crédito", "error");
        }
      } catch (error) {
        addNotification("Error inesperado al crear el crédito", "error");
      } finally {
        setIsCreating(false);
      }
      return;
    }
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
          primaryLabel={
            step === "select-type"
              ? "Siguiente"
              : isCreating
              ? "Creando..."
              : "Crear movimiento"
          }
          onPrimary={step === "select-type" ? handleNext : handleCreate}
          primaryDisabled={
            step === "select-type" ? !canGoNext : !isFormComplete || isCreating
          }
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
