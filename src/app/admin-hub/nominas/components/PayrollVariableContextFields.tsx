"use client";

import AdminHubDatePicker from "../../components/AdminHubDatePicker";
import AdminHubFormField from "../../components/AdminHubFormField";
import { DEDUCTION_TYPE_OPTIONS } from "../data/deduction-types";
import { sanitizeDeductionMontoInput } from "../lib/deduction-monto";
import {
  formatHolidayLabel,
  holidayFechaIso,
} from "../lib/payroll-holidays";
import { getTodayIso } from "../lib/today-iso";
import { usePayrollContractOptions } from "../hooks/usePayrollContractOptions";
import { usePayrollHolidaysByCountry } from "../hooks/usePayrollHolidaysByCountry";
import IncomeVariableAmountField from "./IncomeVariableAmountField";
import PayrollPeriodField from "./PayrollPeriodField";
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
  const {
    contractorOptions,
    getContractsForContractor,
    getContract,
    loading,
  } = usePayrollContractOptions();

  const contract = getContract(formData.contractorId, formData.contractId);
  const showDeductionFields = variant === "deducciones";
  const isDeductionAusencia = showDeductionFields && formData.deductionTipo === "Ausencia";
  const isDeductionOther = showDeductionFields && formData.deductionTipo === "Other";
  const showOvertimeFecha = variant === "overtime";
  const showIncomeMonto = variant === "incomeVariables";
  const showHoliday = variant === "holidays";
  const todayIso = getTodayIso();

  const { holidays, loading: holidaysLoading } = usePayrollHolidaysByCountry(
    showHoliday
      ? contract?.paisFacturacionCodigo || contract?.paisCodigo
      : null,
  );

  const holidayOptions = holidays.map((h) => ({
    value: h.id,
    label: formatHolidayLabel(h),
  }));

  function patch(partial: Partial<CreatePayrollVariableFormData>) {
    onChange({ ...formData, ...partial });
  }

  function handleContractorChange(contractorId: string) {
    const contractsForUser = getContractsForContractor(contractorId);
    const defaultContract =
      contractsForUser.length === 1 ? contractsForUser[0].procesoContratacionId : "";
    patch({
      contractorId,
      contractId: defaultContract,
      holidayId: "",
      desde: "",
    });
  }

  function handleContractChange(contractId: string) {
    patch({ contractId, holidayId: "", desde: "" });
  }

  function handleHolidayChange(holidayId: string) {
    const holiday = holidays.find((item) => item.id === holidayId);
    patch({
      holidayId,
      desde: holiday ? holidayFechaIso(holiday) : "",
      ...(holiday && !formData.descripcion.trim()
        ? { descripcion: holiday.nombre }
        : {}),
    });
  }

  function handleDeductionTipoChange(deductionTipo: string) {
    patch({
      deductionTipo,
      desde: "",
      hasta: "",
      montoContexto: "",
    });
  }

  const contractOptions = getContractsForContractor(formData.contractorId).map((item) => ({
    value: item.procesoContratacionId,
    label: item.procesoContratacionId,
  }));

  const holidayCountryCode =
    contract?.paisFacturacionCodigo?.trim() || contract?.paisCodigo?.trim() || null;

  const holidayPlaceholder = !holidayCountryCode
    ? "Seleccione un contratista"
    : holidaysLoading
      ? "Cargando feriados..."
      : holidayOptions.length > 0
        ? "Buscar feriado"
        : `Sin feriados para ${holidayCountryCode}`;

  return (
    <>
      <AdminHubFormField
        type="select"
        label="Contratista"
        value={formData.contractorId}
        onChange={handleContractorChange}
        options={contractorOptions}
        placeholder={loading ? "Cargando..." : "Buscar por nombre"}
        readOnly={loading}
        searchable
      />

      <div className="flex flex-col gap-[10px] sm:flex-row">
        <div className="w-full sm:w-[222px] shrink-0">
          <AdminHubFormField
            type="select"
            label="ID Contrato"
            value={formData.contractId}
            onChange={handleContractChange}
            options={contractOptions}
            placeholder="Buscar contrato"
            readOnly={!formData.contractorId || loading}
            searchable
          />
        </div>
        <div className="min-w-0 flex-1">
          <AdminHubFormField
            type="input"
            label="Puesto"
            value={contract?.puestoTrabajo ?? ""}
            onChange={() => undefined}
            placeholder="Rol"
            readOnly
          />
        </div>
      </div>

      <AdminHubFormField
        type="input"
        label="Cliente"
        value={contract?.empresaNombre ?? ""}
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
          onChange={handleHolidayChange}
          options={holidayOptions}
          placeholder={holidayPlaceholder}
          readOnly={!holidayCountryCode || holidaysLoading || holidayOptions.length === 0}
          searchable={holidayOptions.length > 0}
        />
      )}

      <PayrollPeriodField
        value={formData.periodo}
        onChange={(periodo) => patch({ periodo })}
      />
    </>
  );
}
