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
import { useAdminHubI18n } from "../../i18n";
import CreateAdditionalItemForm, {
  type CreateAdditionalFormData,
  isAdditionalFormComplete,
} from "./CreateAdditionalItemForm";
import CreateInvoiceItemForm, {
  type CreateItemFormData,
  isCreateItemFormComplete,
  INVOICE_ITEM_CURRENCY,
} from "./CreateInvoiceItemForm";
import type { InvoiceAdditionalFee, InvoiceLineItem } from "../types/invoice-detail.types";

export type MovementType = "customer-charges" | "customer-credits" | "adicionales";

type DrawerStep = "select-type" | "form";

const MOVEMENT_TYPE_KEYS: Record<MovementType, string> = {
  "customer-charges": "pagos.sections.customerCharges",
  "customer-credits": "pagos.sections.customerCredits",
  adicionales: "pagos.sections.additional",
};

const ITEM_TYPE_KEYS: Record<string, string> = {
  "team-building": "pagos.itemTypes.teamBuilding",
  nomina: "pagos.itemTypes.payroll",
  bono: "pagos.itemTypes.bonus",
  tarifa: "pagos.itemTypes.fee",
  deduccion: "pagos.itemTypes.deduction",
  correccion: "pagos.itemTypes.correction",
  equipamiento: "pagos.itemTypes.equipment",
  capacitacion: "pagos.itemTypes.training",
  renuncia: "pagos.itemTypes.resignation",
  "deduccion-dias": "pagos.itemTypes.dayDeduction",
  ausencia: "pagos.itemTypes.absence",
  ajuste: "pagos.itemTypes.manualAdjust",
};

const EMPTY_FORM: CreateItemFormData = {
  tipo: "",
  descripcion: "",
  monto: "",
};

const EMPTY_ADDITIONAL_FORM: CreateAdditionalFormData = {
  contratista: "",
  descripcion: "",
  monto: "",
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
  const { t, dateLocale } = useAdminHubI18n();
  const [step, setStep] = useState<DrawerStep>("select-type");
  const [selectedType, setSelectedType] = useState<MovementType | null>(null);
  const [formData, setFormData] = useState<CreateItemFormData>(EMPTY_FORM);
  const [additionalFormData, setAdditionalFormData] =
    useState<CreateAdditionalFormData>(EMPTY_ADDITIONAL_FORM);
  const [isCreating, setIsCreating] = useState(false);
  const addNotification = useNotificationStore((state) => state.addNotification);

  const movementOptions = useMemo(
    () =>
      (Object.keys(MOVEMENT_TYPE_KEYS) as MovementType[]).map((id) => ({
        id,
        label: t(MOVEMENT_TYPE_KEYS[id]),
      })),
    [t],
  );

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
    const key = ITEM_TYPE_KEYS[tipo];
    if (key) return t(key);
    if (tipo === "overtime") return t("nominas.types.Overtime");
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  }

  function formatItemDate(): string {
    return new Date()
      .toLocaleDateString(dateLocale, {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      })
      .replace(/\//g, ".");
  }

  function buildLineItem(
    tipo: string,
    contractor: string,
    description: string,
    monto: string,
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
      date: formatItemDate(),
      type: formatTipoLabel(tipo),
      contractor,
      description,
      amount: isCredit ? `-${baseAmount}` : baseAmount,
      currency: INVOICE_ITEM_CURRENCY,
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
        date: formatItemDate(),
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
          fecha: new Date().toISOString().split("T")[0],
          periodo: apiPeriodo,
          descripcion: formData.descripcion,
        });

        if (result.success) {
          addNotification(t("pagos.toasts.chargeCreated"), "success");
          onChargeCreated?.();
          onClose();
        } else {
          addNotification(result.message || t("pagos.toasts.chargeCreateError"), "error");
        }
      } catch (error) {
        addNotification(t("pagos.toasts.chargeCreateUnexpected"), "error");
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
          addNotification(t("pagos.toasts.creditCreated"), "success");
          onChargeCreated?.();
          onClose();
        } else {
          addNotification(result.message || t("pagos.toasts.creditCreateError"), "error");
        }
      } catch (error) {
        addNotification(t("pagos.toasts.creditCreateUnexpected"), "error");
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
      title={t("pagos.createItem")}
      titleId="create-item-title"
      footer={
        <AdminHubDrawerFooter
          onCancel={onClose}
          primaryLabel={
            step === "select-type"
              ? t("nominas.next")
              : isCreating
              ? t("pagos.creating")
              : t("pagos.createMovement")
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
          title={t("pagos.selectMovementType")}
          options={movementOptions}
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
