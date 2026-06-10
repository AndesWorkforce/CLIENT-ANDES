"use client";

import AdminHubDatePicker from "../../components/AdminHubDatePicker";
import AdminHubFormField from "../../components/AdminHubFormField";
import {
  findContract,
  findContractor,
  MOCK_CONTRACTORS,
} from "../data/mock-contractors";
import { DEDUCTION_TYPE_OPTIONS } from "../data/deduction-types";
import { formatHolidayLabel, getHolidaysByCountry } from "../data/mock-holidays";
import { sanitizeDeductionMontoInput } from "../lib/deduction-monto";
import { getTodayIso } from "../lib/today-iso";
import IncomeVariableAmountField from "./IncomeVariableAmountField";
import type { CreatePayrollVariableFormData } from "./payroll-variable-form-types";

export type ContextFieldsVariant =
  | "overtime"
  | "holidays"
  | "deducciones"
  | "incomeVariables";

interface PayrollVariableContextFieldsProps {
  variant: ContextFieldsVariant;
  formData: CreatePayrollVariableFormData;
  onChange: (data: CreatePayrollVariableFormData) => void;
}

export default function PayrollVariableContextFields({
  variant,
  formData,
  onChange,
}: PayrollVariableContextFieldsProps) {
  const contractor = findContractor(formData.contractorId);
  const contract = findContract(formData.contractorId, formData.contractId);
  const showDeductionFields = variant === "deducciones";
  const isDeductionAusencia = showDeductionFields && formData.deductionTipo === "Ausencia";
  const isDeductionOther = showDeductionFields && formData.deductionTipo === "Other";
  const showOvertimeFecha = variant === "overtime";
  const showIncomeMonto = variant === "incomeVariables";
  const showHoliday = variant === "holidays";
  const todayIso = getTodayIso();

  const contractorOptions = MOCK_CONTRACTORS.map((c) => ({
    value: c.id,
    label: c.name,
  }));

  const contractOptions =
    contractor?.contracts.map((c) => ({
      value: c.id,
      label: c.id,
    })) ?? [];

  const holidayOptions = contractor
    ? getHolidaysByCountry(contractor.countryCode).map((h) => ({
        value: h.id,
        label: formatHolidayLabel(h),
      }))
    : [];

  function patch(partial: Partial<CreatePayrollVariableFormData>) {
    onChange({ ...formData, ...partial });
  }

  function handleContractorChange(contractorId: string) {
    const selected = findContractor(contractorId);
    const defaultContract = selected?.contracts.length === 1 ? selected.contracts[0].id : "";
    patch({
      contractorId,
      contractId: defaultContract,
      holidayId: "",
    });
  }

  function handleContractChange(contractId: string) {
    patch({ contractId, holidayId: "" });
  }

  function handleDeductionTipoChange(deductionTipo: string) {
    patch({
      deductionTipo,
      desde: "",
      hasta: "",
      montoContexto: "",
    });
  }

  return (
    <>
      <AdminHubFormField
        type="select"
        label="Contratista"
        value={formData.contractorId}
        onChange={handleContractorChange}
        options={contractorOptions}
        placeholder="Nombre"
      />

      <div className="flex flex-col gap-[10px] sm:flex-row">
        <div className="w-full sm:w-[222px] shrink-0">
          <AdminHubFormField
            type="select"
            label="ID Contrato"
            value={formData.contractId}
            onChange={handleContractChange}
            options={contractOptions}
            placeholder="Codigo"
            readOnly={!formData.contractorId}
          />
        </div>
        <div className="min-w-0 flex-1">
          <AdminHubFormField
            type="input"
            label="Puesto"
            value={contract?.position ?? ""}
            onChange={() => undefined}
            placeholder="Rol"
            readOnly
          />
        </div>
      </div>

      <AdminHubFormField
        type="input"
        label="Cliente"
        value={contract?.client ?? ""}
        onChange={() => undefined}
        placeholder="Empresa"
        readOnly
      />

      {showDeductionFields && (
        <>
          <AdminHubFormField
            type="select"
            label="Tipo"
            value={formData.deductionTipo}
            onChange={handleDeductionTipoChange}
            options={[...DEDUCTION_TYPE_OPTIONS]}
            placeholder="Ausencia"
          />

          {isDeductionAusencia && (
            <div className="flex flex-col gap-[10px] sm:flex-row">
              <div className="min-w-0 flex-1">
                <AdminHubDatePicker
                  label="Desde"
                  value={formData.desde}
                  onChange={(desde) => {
                    const next: Partial<CreatePayrollVariableFormData> = { desde };
                    if (formData.hasta && desde > formData.hasta) {
                      next.hasta = desde;
                    }
                    patch(next);
                  }}
                  placeholder="Fecha"
                  maxDate={todayIso}
                />
              </div>
              <div className="min-w-0 flex-1">
                <AdminHubDatePicker
                  label="Hasta"
                  value={formData.hasta}
                  onChange={(hasta) => {
                    const next: Partial<CreatePayrollVariableFormData> = { hasta };
                    if (formData.desde && hasta < formData.desde) {
                      next.hasta = formData.desde;
                    }
                    patch(next);
                  }}
                  placeholder="Fecha si corresponde"
                  required={false}
                  minDate={formData.desde || undefined}
                />
              </div>
            </div>
          )}

          {isDeductionOther && (
            <AdminHubFormField
              type="input"
              label="Monto"
              value={formData.montoContexto}
              onChange={(v) => patch({ montoContexto: sanitizeDeductionMontoInput(v) })}
              placeholder="Monto"
              inputMode="numeric"
            />
          )}
        </>
      )}

      {showOvertimeFecha && (
        <AdminHubDatePicker
          label="Fecha"
          value={formData.desde}
          onChange={(desde) => patch({ desde })}
          placeholder="03.03.2026"
          required={false}
        />
      )}

      {showIncomeMonto && (
        <IncomeVariableAmountField
          category={formData.incomeCategory}
          amount={formData.montoContexto}
          onCategoryChange={(incomeCategory) => patch({ incomeCategory })}
          onAmountChange={(montoContexto) => patch({ montoContexto })}
        />
      )}

      {showHoliday && (
        <AdminHubFormField
          type="select"
          label="Día feriado"
          value={formData.holidayId}
          onChange={(v) => patch({ holidayId: v })}
          options={holidayOptions}
          placeholder={
            contractor
              ? holidayOptions.length > 0
                ? "Seleccionar feriado"
                : `Sin feriados para ${contractor.countryName}`
              : "Seleccione un contratista"
          }
          readOnly={!contractor || holidayOptions.length === 0}
        />
      )}
    </>
  );
}
