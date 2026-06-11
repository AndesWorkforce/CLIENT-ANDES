"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { OVERTIME_UNIT_OPTIONS } from "./payroll-variable-form-types";

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
  return (
    <div className="flex flex-col gap-[10px] sm:flex-row">
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="select"
          label="Unidad"
          value={unidad}
          onChange={onUnidadChange}
          options={OVERTIME_UNIT_OPTIONS}
          placeholder="Horas/Minutos"
        />
      </div>
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="input"
          label="Cantidad"
          value={cantidad}
          onChange={onCantidadChange}
          placeholder="1"
          inputMode="numeric"
        />
      </div>
    </div>
  );
}
