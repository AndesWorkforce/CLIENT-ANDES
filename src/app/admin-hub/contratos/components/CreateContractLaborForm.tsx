"use client";

import { useEffect } from "react";
import { Info } from "lucide-react";
import AdminHubDatePicker from "../../components/AdminHubDatePicker";
import AdminHubFormField from "../../components/AdminHubFormField";
import AdminHubSelect from "../../components/AdminHubSelect";
import {
  CLIENT_OPTIONS,
  DISCRETIONARY_BONUS_OPTIONS,
  HR_RATE_HOLIDAYS_OPTIONS,
  POSITION_OPTIONS,
  YES_NO_OPTIONS,
} from "../data/mock-contract-form-options";
import {
  PART_TIME_LOCKED_LABOR_VALUES,
  type ContractCreationType,
  type CreateContractFormData,
} from "../data/contract-creation-types";
import ContractFormSection from "./ContractFormSection";

interface CreateContractLaborFormProps {
  formData: CreateContractFormData;
  onChange: (data: CreateContractFormData) => void;
  contractType: ContractCreationType;
}

function InfoSelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  disabled = false,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  disabled?: boolean;
}) {
  return (
    <div className="relative w-full pt-2">
      <label className="absolute left-3 top-0 z-10 flex items-center gap-1 bg-white px-1 text-[14px] leading-[1.3] tracking-[0.28px] text-[#525252]">
        {label}*
        <Info size={14} className="text-[#707070]" aria-hidden />
      </label>
      <AdminHubSelect
        value={value}
        onChange={onChange}
        options={options}
        placeholder={placeholder}
        variant="form"
        disabled={disabled}
      />
    </div>
  );
}

export default function CreateContractLaborForm({
  formData,
  onChange,
  contractType,
}: CreateContractLaborFormProps) {
  const isPartTime = contractType === "part-time";

  function patch(partial: Partial<CreateContractFormData>) {
    onChange({ ...formData, ...partial });
  }

  useEffect(() => {
    if (!isPartTime) return;

    const { paidHolidays, discretionaryBonus, ipbBonus } = PART_TIME_LOCKED_LABOR_VALUES;
    if (
      formData.paidHolidays === paidHolidays &&
      formData.discretionaryBonus === discretionaryBonus &&
      formData.ipbBonus === ipbBonus
    ) {
      return;
    }

    patch({
      paidHolidays,
      discretionaryBonus,
      ipbBonus,
    });
  }, [
    isPartTime,
    formData.paidHolidays,
    formData.discretionaryBonus,
    formData.ipbBonus,
    formData,
    onChange,
  ]);

  return (
    <ContractFormSection title="Información Laboral">
      <AdminHubDatePicker
        label="Fecha de inicio del contrato"
        required
        value={formData.fechaInicioContrato}
        onChange={(fechaInicioContrato) => patch({ fechaInicioContrato })}
        placeholder="03.03.2026"
      />
      <AdminHubFormField
        type="select"
        label="Posición"
        value={formData.posicion}
        onChange={(posicion) => patch({ posicion })}
        options={POSITION_OPTIONS}
        placeholder="Diseñador UX UI"
      />
      <AdminHubFormField
        type="select"
        label="Cliente"
        value={formData.cliente}
        onChange={(cliente) => patch({ cliente })}
        options={CLIENT_OPTIONS}
        placeholder="ADDS"
      />
      <AdminHubFormField
        type="input"
        label="Salario"
        value={formData.salario}
        onChange={(salario) => patch({ salario })}
        placeholder="$1000"
        inputMode="decimal"
      />
      <InfoSelectField
        label="HR Rate Holidays"
        value={formData.hrRateHolidays}
        onChange={(hrRateHolidays) => patch({ hrRateHolidays })}
        options={HR_RATE_HOLIDAYS_OPTIONS}
        placeholder="2.00"
      />
      <AdminHubFormField
        type="select"
        label="Paid Holidays"
        value={formData.paidHolidays}
        onChange={(paidHolidays) => patch({ paidHolidays })}
        options={YES_NO_OPTIONS}
        placeholder="Si"
        readOnly={isPartTime}
      />
      <InfoSelectField
        label="Discretionary Bonus"
        value={formData.discretionaryBonus}
        onChange={(discretionaryBonus) =>
          patch({
            discretionaryBonus: discretionaryBonus as CreateContractFormData["discretionaryBonus"],
          })
        }
        options={DISCRETIONARY_BONUS_OPTIONS}
        placeholder="Media vez al mes de Diciembre"
        disabled={isPartTime}
      />
      <AdminHubFormField
        type="select"
        label="IPB Bonus"
        value={formData.ipbBonus}
        onChange={(ipbBonus) => patch({ ipbBonus })}
        options={YES_NO_OPTIONS}
        placeholder="Si"
        readOnly={isPartTime}
      />
    </ContractFormSection>
  );
}
