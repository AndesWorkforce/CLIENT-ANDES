"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { DURATION_OPTIONS } from "./payroll-variable-form-types";
import type { CreatePayrollVariableFormData } from "./payroll-variable-form-types";
import { getContextBaseSalary } from "./PayrollVariableContextFields";

interface PayrollVariablePaymentBaseFieldsProps {
  formData: CreatePayrollVariableFormData;
  onChange: (data: CreatePayrollVariableFormData) => void;
}

export default function PayrollVariablePaymentBaseFields({
  formData,
  onChange,
}: PayrollVariablePaymentBaseFieldsProps) {
  const baseSalary = getContextBaseSalary(formData.contractorId, formData.contractId);

  function patch(partial: Partial<CreatePayrollVariableFormData>) {
    onChange({ ...formData, ...partial });
  }

  return (
    <div className="flex flex-col gap-[10px] sm:flex-row">
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="input"
          label="Sueldo Base"
          value={baseSalary}
          onChange={() => undefined}
          placeholder="Monto"
          readOnly
        />
      </div>
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="select"
          label="Duración"
          value={formData.duracion}
          onChange={(v) => patch({ duracion: v })}
          options={DURATION_OPTIONS}
          placeholder="Hora"
        />
      </div>
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="input"
          label="Cantidad"
          value={formData.cantidad}
          onChange={(v) => patch({ cantidad: v })}
          placeholder="1"
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
