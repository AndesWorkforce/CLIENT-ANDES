"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/auth.store";
import AdminHubDrawerFooter from "../../components/AdminHubDrawerFooter";
import AdminHubSideDrawer from "../../components/AdminHubSideDrawer";
import AdminHubTypeSelectStep from "../../components/AdminHubTypeSelectStep";
import { findContract, findContractor } from "../data/mock-contractors";
import { findHoliday } from "../data/mock-holidays";
import type { IncomeVariableCategory } from "../data/income-variable-categories";
import type {
  PayrollVariable,
  PayrollVariableCategory,
  PayrollVariableDrawerType,
  PayrollVariableType,
} from "../data/mock-payroll-variables";
import CreatePayrollVariableForm, {
  emptyPayrollVariableForm,
  isPayrollVariableFormComplete,
  type CreatePayrollVariableFormData,
} from "./CreatePayrollVariableForm";
import { parseDeductionAmount } from "./DeductionAmountField";
import { parseSignedAmountInput } from "./IncomeVariableAmountField";
import { formatDisplayDate, TYPE_SUBTITLES } from "./payroll-variable-form-types";

type DrawerStep = "select-type" | "form";

const VARIABLE_TYPE_OPTIONS: { id: PayrollVariableDrawerType; label: string }[] = [
  { id: "ausencia", label: "Ausencia" },
  { id: "overtime", label: "Overtime" },
  { id: "holidays", label: "Holidays" },
  { id: "deducciones", label: "Deducciones" },
  { id: "incomeVariables", label: "Income Variables" },
];

type PayrollVariableItemCategory = Exclude<PayrollVariableCategory, "todos">;

const TYPE_META: Record<
  PayrollVariableDrawerType,
  { type: PayrollVariableType; category: PayrollVariableItemCategory }
> = {
  ausencia: { type: "Ausencia", category: "ausencias" },
  overtime: { type: "Overtime", category: "overtimes" },
  holidays: { type: "Holiday", category: "holidays" },
  deducciones: { type: "Deducción", category: "deducciones" },
  incomeVariables: { type: "Income Variable", category: "incomeVariables" },
};

interface CreatePayrollVariableDrawerProps {
  open: boolean;
  onClose: () => void;
  onVariableCreated: (variable: PayrollVariable) => void;
}

function computeAmount(
  type: PayrollVariableDrawerType,
  formData: CreatePayrollVariableFormData
): number {
  const contract = findContract(formData.contractorId, formData.contractId);
  const hourlyRate = contract ? contract.baseSalary / 160 : 0;
  const quantity = parseFloat(formData.cantidad.replace(",", ".")) || 1;

  switch (type) {
    case "deducciones":
      return parseDeductionAmount(formData.montoContexto);
    case "incomeVariables":
      return parseSignedAmountInput(formData.montoContexto);
    case "holidays": {
      const dailyRate = contract ? contract.baseSalary / 22 : 0;
      return Math.round(dailyRate);
    }
    case "overtime": {
      const hours =
        formData.duracion === "minutos" ? quantity / 60 : quantity;
      return Math.round(hourlyRate * hours);
    }
    case "ausencia": {
      const days =
        formData.desde && formData.hasta
          ? Math.max(
              1,
              Math.ceil(
                (new Date(formData.hasta).getTime() - new Date(formData.desde).getTime()) /
                  (1000 * 60 * 60 * 24)
              ) + 1
            )
          : quantity;
      const dailyRate = contract ? contract.baseSalary / 22 : 0;
      return -Math.round(dailyRate * days);
    }
    default:
      return 0;
  }
}

function buildDescription(
  type: PayrollVariableDrawerType,
  formData: CreatePayrollVariableFormData
): string {
  if (formData.descripcion.trim()) return formData.descripcion.trim();

  if (type === "holidays") {
    const holiday = findHoliday(formData.holidayId);
    return holiday?.nombre ?? "Feriado";
  }

  return formData.descripcion.trim() || "—";
}

function resolveDisplayDate(
  type: PayrollVariableDrawerType,
  formData: CreatePayrollVariableFormData
): string {
  if (type === "holidays") {
    const holiday = findHoliday(formData.holidayId);
    if (holiday?.fecha) return formatDisplayDate(holiday.fecha);
    if (holiday) {
      const year = new Date().getFullYear();
      return formatDisplayDate(
        `${year}-${String(holiday.mes).padStart(2, "0")}-${String(holiday.dia).padStart(2, "0")}`
      );
    }
  }

  if (formData.desde) return formatDisplayDate(formData.desde);
  return formatDisplayDate(new Date().toISOString().slice(0, 10));
}

function formatCreatedBy(nombre?: string, apellido?: string): string {
  if (!nombre) return "Administrador";
  const initial = apellido?.trim()?.[0];
  return initial ? `${nombre} ${initial}` : nombre;
}

export default function CreatePayrollVariableDrawer({
  open,
  onClose,
  onVariableCreated,
}: CreatePayrollVariableDrawerProps) {
  const { user } = useAuthStore();
  const [step, setStep] = useState<DrawerStep>("select-type");
  const [selectedType, setSelectedType] = useState<PayrollVariableDrawerType | null>(null);
  const [formData, setFormData] = useState<CreatePayrollVariableFormData>(emptyPayrollVariableForm);

  useEffect(() => {
    if (!open) {
      setStep("select-type");
      setSelectedType(null);
      setFormData(emptyPayrollVariableForm());
    }
  }, [open]);

  const canGoNext = selectedType !== null;
  const isFormComplete =
    selectedType !== null && isPayrollVariableFormComplete(selectedType, formData);

  function handleNext() {
    if (step === "select-type" && selectedType) {
      setFormData(emptyPayrollVariableForm());
      setStep("form");
    }
  }

  function handleCreate() {
    if (!selectedType || !isFormComplete) return;

    const contractor = findContractor(formData.contractorId);
    const contract = findContract(formData.contractorId, formData.contractId);
    if (!contractor || !contract) return;

    const meta = TYPE_META[selectedType];

    const newVariable: PayrollVariable = {
      id: `pv-${Date.now()}`,
      date: resolveDisplayDate(selectedType, formData),
      contractor: contractor.name,
      client: contract.client,
      type: meta.type,
      category: meta.category,
      description: buildDescription(selectedType, formData),
      amount: computeAmount(selectedType, formData),
      status: "Pendiente",
      createdBy: formatCreatedBy(user?.nombre, user?.apellido),
      ...(selectedType === "incomeVariables" && formData.incomeCategory
        ? {
            incomeCategory: formData.incomeCategory as IncomeVariableCategory,
          }
        : {}),
    };

    onVariableCreated(newVariable);
    onClose();
  }

  return (
    <AdminHubSideDrawer
      open={open}
      onClose={onClose}
      title="Crear variable de nómina"
      subtitle={selectedType && step === "form" ? TYPE_SUBTITLES[selectedType] : undefined}
      titleId="create-payroll-variable-title"
      footer={
        <AdminHubDrawerFooter
          onCancel={onClose}
          primaryLabel={step === "select-type" ? "Siguiente" : "Crear variable"}
          onPrimary={step === "select-type" ? handleNext : handleCreate}
          primaryDisabled={step === "select-type" ? !canGoNext : !isFormComplete}
        />
      }
    >
      {step === "select-type" ? (
        <AdminHubTypeSelectStep
          title="Seleccionar tipo de variable"
          options={VARIABLE_TYPE_OPTIONS}
          selectedId={selectedType}
          onSelect={setSelectedType}
        />
      ) : (
        selectedType && (
          <CreatePayrollVariableForm
            variableType={selectedType}
            formData={formData}
            onChange={setFormData}
          />
        )
      )}
    </AdminHubSideDrawer>
  );
}
