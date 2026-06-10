"use client";

import type { PayrollVariableDrawerType } from "../data/mock-payroll-variables";
import PayrollVariableContextFields from "./PayrollVariableContextFields";
import PayrollVariableFormSection from "./PayrollVariableFormSection";
import OvertimeDetailFields from "./OvertimeDetailFields";
import AdminHubFormField from "../../components/AdminHubFormField";
import type { CreatePayrollVariableFormData } from "./payroll-variable-form-types";

interface CreatePayrollVariableFormProps {
  variableType: PayrollVariableDrawerType;
  formData: CreatePayrollVariableFormData;
  onChange: (data: CreatePayrollVariableFormData) => void;
}

export type { CreatePayrollVariableFormData } from "./payroll-variable-form-types";
export {
  emptyPayrollVariableForm,
  isPayrollVariableFormComplete,
} from "./payroll-variable-form-types";

export default function CreatePayrollVariableForm({
  variableType,
  formData,
  onChange,
}: CreatePayrollVariableFormProps) {
  function patchDescription(descripcion: string) {
    onChange({ ...formData, descripcion });
  }

  function patch(partial: Partial<CreatePayrollVariableFormData>) {
    onChange({ ...formData, ...partial });
  }

  return (
    <div className="flex w-full max-w-[636px] flex-col gap-6">
      <PayrollVariableFormSection title="Contexto">
        <PayrollVariableContextFields
          variant={variableType}
          formData={formData}
          onChange={onChange}
        />
      </PayrollVariableFormSection>

      {variableType === "overtime" && (
        <PayrollVariableFormSection title="Detalle">
          <OvertimeDetailFields
            unidad={formData.duracion}
            cantidad={formData.cantidad}
            onUnidadChange={(duracion) => patch({ duracion })}
            onCantidadChange={(cantidad) => patch({ cantidad })}
          />
        </PayrollVariableFormSection>
      )}

      <PayrollVariableFormSection title="Ingresos Adicionales">
        <AdminHubFormField
          type="input"
          label="Descripción"
          value={formData.descripcion}
          onChange={patchDescription}
          placeholder="Justificación"
        />
      </PayrollVariableFormSection>
    </div>
  );
}
