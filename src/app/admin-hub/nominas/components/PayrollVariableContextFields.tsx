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
import { t, ADMIN_HUB_DATE_LOCALE } from "../../i18n";

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
  const dateLocale = ADMIN_HUB_DATE_LOCALE;
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
    label: formatHolidayLabel(h, dateLocale),
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
    ? t("nominas.selectContractor")
    : holidaysLoading
      ? t("nominas.loadingHolidays")
      : holidayOptions.length > 0
        ? t("nominas.searchHoliday")
        : t("nominas.noHolidaysFor", { country: holidayCountryCode });

  return (
    <>
      <AdminHubFormField
        type="select"
        label={t("nominas.contractor")}
        value={formData.contractorId}
        onChange={handleContractorChange}
        options={contractorOptions}
        placeholder={loading ? t("common.loading") : t("nominas.searchByName")}
        readOnly={loading}
        searchable
      />

      <div className="flex flex-col gap-[10px] sm:flex-row">
        <div className="w-full sm:w-[222px] shrink-0">
          <AdminHubFormField
            type="select"
            label={t("personas.contractId")}
            value={formData.contractId}
            onChange={handleContractChange}
            options={contractOptions}
            placeholder={t("nominas.searchContract")}
            readOnly={!formData.contractorId || loading}
            searchable
          />
        </div>
        <div className="min-w-0 flex-1">
          <AdminHubFormField
            type="input"
            label={t("nominas.position")}
            value={contract?.puestoTrabajo ?? ""}
            onChange={() => undefined}
            placeholder={t("nominas.role")}
            readOnly
          />
        </div>
      </div>

      <AdminHubFormField
        type="input"
        label={t("nominas.client")}
        value={contract?.empresaNombre ?? ""}
        onChange={() => undefined}
        placeholder={t("nominas.company")}
        readOnly
      />

      {showDeductionFields && (
        <>
          <AdminHubFormField
            type="select"
            label={t("nominas.type")}
            value={formData.deductionTipo}
            onChange={handleDeductionTipoChange}
            options={DEDUCTION_TYPE_OPTIONS.map((option) => ({
              value: option.value,
              label:
                option.value === "Ausencia"
                  ? t("nominas.absence")
                  : t("nominas.other"),
            }))}
            placeholder={t("nominas.absence")}
          />

          {isDeductionAusencia && (
            <div className="flex flex-col gap-[10px] sm:flex-row">
              <div className="min-w-0 flex-1">
                <AdminHubDatePicker
                  label={t("dates.from")}
                  value={formData.desde}
                  onChange={(desde) => {
                    const next: Partial<CreatePayrollVariableFormData> = { desde };
                    if (formData.hasta && desde > formData.hasta) {
                      next.hasta = desde;
                    }
                    patch(next);
                  }}
                  placeholder={t("dates.date")}
                  maxDate={todayIso}
                />
              </div>
              <div className="min-w-0 flex-1">
                <AdminHubDatePicker
                  label={t("dates.to")}
                  value={formData.hasta}
                  onChange={(hasta) => {
                    const next: Partial<CreatePayrollVariableFormData> = { hasta };
                    if (formData.desde && hasta < formData.desde) {
                      next.hasta = formData.desde;
                    }
                    patch(next);
                  }}
                  placeholder={t("nominas.dateIfApplicable")}
                  required={false}
                  minDate={formData.desde || undefined}
                />
              </div>
            </div>
          )}

          {isDeductionAusencia && (
            <div className="flex flex-col gap-3 rounded-[8px] border border-[#EFEFEF] bg-[#FAFAFA] px-4 py-3">
              <label className="flex cursor-pointer items-start gap-2.5">
                <input
                  type="checkbox"
                  checked={formData.descuentaPto}
                  onChange={(event) =>
                    patch({ descuentaPto: event.target.checked })
                  }
                  className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#0097B2]"
                />
                <span className="flex flex-col">
                  <span className="text-[14px] font-medium leading-[1.3] text-[#343434]">
                    {t("nominas.ptoCoverAbsence")}
                  </span>
                  <span className="pt-0.5 text-[12px] leading-[1.35] text-[#858585]">
                    {t("nominas.ptoCoverAbsenceHint")}
                  </span>
                </span>
              </label>

              {/* Qué hacer si el saldo no alcanza. El reparto exacto lo resuelve
                  el backend al aprobar, contra el saldo de ese momento. */}
              {formData.descuentaPto && (
                <div className="flex flex-col gap-2 border-t border-[#EFEFEF] pt-3">
                  <span className="text-[12px] font-semibold uppercase leading-[1.3] tracking-[0.4px] text-[#707070]">
                    {t("nominas.ptoNotEnoughTitle")}
                  </span>
                  {[
                    {
                      value: false,
                      label: t("nominas.ptoSplitWithMoney"),
                      hint: t("nominas.ptoSplitWithMoneyHint"),
                    },
                    {
                      value: true,
                      label: t("nominas.ptoAllowNegative"),
                      hint: t("nominas.ptoAllowNegativeHint"),
                    },
                  ].map((option) => (
                    <label
                      key={String(option.value)}
                      className="flex cursor-pointer items-start gap-2.5"
                    >
                      <input
                        type="radio"
                        name="permitePtoNegativo"
                        checked={formData.permitePtoNegativo === option.value}
                        onChange={() =>
                          patch({ permitePtoNegativo: option.value })
                        }
                        className="mt-0.5 size-4 shrink-0 cursor-pointer accent-[#0097B2]"
                      />
                      <span className="flex flex-col">
                        <span className="text-[13px] leading-[1.3] text-[#343434]">
                          {option.label}
                        </span>
                        <span className="pt-0.5 text-[12px] leading-[1.35] text-[#858585]">
                          {option.hint}
                        </span>
                      </span>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          {isDeductionOther && (
            <AdminHubFormField
              type="input"
              label={t("nominas.amount")}
              value={formData.montoContexto}
              onChange={(v) => patch({ montoContexto: sanitizeDeductionMontoInput(v) })}
              placeholder={t("nominas.amount")}
              inputMode="numeric"
            />
          )}
        </>
      )}

      {showOvertimeFecha && (
        <AdminHubDatePicker
          label={t("dates.date")}
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
          label={t("nominas.holidayDay")}
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
