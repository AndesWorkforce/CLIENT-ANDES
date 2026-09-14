"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { OVERTIME_UNIT_OPTIONS } from "./payroll-variable-form-types";
import { useAdminHubI18n } from "../../i18n";

interface OvertimeDetailFieldsProps {
  unidad: string;
  cantidad: string;
  onUnidadChange: (value: string) => void;
  onCantidadChange: (value: string) => void;
}

export default function OvertimeDetailFields({
  unidad,
  cantidad,
  onUnidadChange,
  onCantidadChange,
}: OvertimeDetailFieldsProps) {
  const { t } = useAdminHubI18n();
  return (
    <div className="flex flex-col gap-[10px] sm:flex-row">
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="select"
          label={t("nominas.unit")}
          value={unidad}
          onChange={onUnidadChange}
          options={OVERTIME_UNIT_OPTIONS.map((option) => ({
            value: option.value,
            label: option.value === "horas" ? t("nominas.hours") : t("nominas.minutes"),
          }))}
          placeholder={t("nominas.hoursMinutes")}
        />
      </div>
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="input"
          label={t("nominas.quantity")}
          value={cantidad}
          onChange={onCantidadChange}
          placeholder="1"
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
