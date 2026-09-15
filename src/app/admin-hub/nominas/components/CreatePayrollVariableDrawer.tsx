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
import { t } from "../../i18n";

type DrawerStep = "select-type" | "form";

/** Orden según Figma: Income Variables → Overtime → Holidays → Deductions */
const DRAWER_TYPE_TAB_KEYS: Record<PayrollVariableDrawerType, string> = {
  overtime: "nominas.tabs.overtimes",
  holidays: "nominas.tabs.holidays",
  deducciones: "nominas.tabs.deductions",
  incomeVariables: "nominas.tabs.incomeVariables",
};

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
      addNotification(result.message || t("nominas.createError"), "error");
      return;
    }

    onVariableCreated(result.data);
    onClose();
  }

  return (
    <AdminHubSideDrawer
      open={open}
      onClose={onClose}
      title={t("nominas.createVariable")}
      subtitle={
        selectedType && step === "form"
          ? t(DRAWER_TYPE_TAB_KEYS[selectedType])
          : undefined
      }
      titleId="create-payroll-variable-title"
      footer={
        <AdminHubDrawerFooter
          onCancel={onClose}
          primaryLabel={
            step === "select-type" ? t("nominas.next") : t("nominas.createVariable")
          }
          onPrimary={step === "select-type" ? handleNext : handleCreate}
          primaryDisabled={
            step === "select-type" ? !canGoNext : !isFormComplete || submitting
          }
        />
      }
    >
      {step === "select-type" ? (
        <AdminHubTypeSelectStep
          title={t("nominas.selectVariableType")}
          options={(
            [
              { id: "incomeVariables" as const, key: "nominas.tabs.incomeVariables" },
              { id: "overtime" as const, key: "nominas.types.Overtime" },
              { id: "holidays" as const, key: "nominas.tabs.holidays" },
              { id: "deducciones" as const, key: "nominas.tabs.deductions" },
            ] as const
          ).map((option) => ({
            id: option.id,
            label: t(option.key),
          }))}
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
