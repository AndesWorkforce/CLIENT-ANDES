"use client";

import { useEffect, useState } from "react";
import { useNotificationStore } from "@/store/notifications.store";
import AdminHubDrawerFooter from "../../components/AdminHubDrawerFooter";
import AdminHubSideDrawer from "../../components/AdminHubSideDrawer";
import AdminHubTypeSelectStep from "../../components/AdminHubTypeSelectStep";
import { submitNominaVariable } from "../actions/payroll-variables.actions";
import type {
  PayrollVariable,
  PayrollVariableDrawerType,
} from "../data/mock-payroll-variables";
import CreatePayrollVariableForm, {
  emptyPayrollVariableForm,
  isPayrollVariableFormComplete,
  type CreatePayrollVariableFormData,
} from "./CreatePayrollVariableForm";
import { TYPE_SUBTITLES } from "./payroll-variable-form-types";

type DrawerStep = "select-type" | "form";

/** Orden según Figma: Income Variables → Overtime → Holidays → Deductions */
const VARIABLE_TYPE_OPTIONS: { id: PayrollVariableDrawerType; label: string }[] = [
  { id: "incomeVariables", label: "Income Variables" },
  { id: "overtime", label: "Overtime" },
  { id: "holidays", label: "Holidays" },
  { id: "deducciones", label: "Deductions" },
];

interface CreatePayrollVariableDrawerProps {
  open: boolean;
  onClose: () => void;
  onVariableCreated: (variable: PayrollVariable) => void;
}

export default function CreatePayrollVariableDrawer({
  open,
  onClose,
  onVariableCreated,
}: CreatePayrollVariableDrawerProps) {
  const { addNotification } = useNotificationStore();
  const [step, setStep] = useState<DrawerStep>("select-type");
  const [selectedType, setSelectedType] = useState<PayrollVariableDrawerType | null>(null);
  const [formData, setFormData] = useState<CreatePayrollVariableFormData>(emptyPayrollVariableForm);
  const [submitting, setSubmitting] = useState(false);

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

  async function handleCreate() {
    if (!selectedType || !isFormComplete || submitting) return;

    setSubmitting(true);
    const result = await submitNominaVariable(selectedType, formData);
    setSubmitting(false);

    if (!result.success || !result.data) {
      addNotification(result.message || "Error al crear la variable", "error");
      return;
    }

    onVariableCreated(result.data);
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
          primaryDisabled={
            step === "select-type" ? !canGoNext : !isFormComplete || submitting
          }
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
