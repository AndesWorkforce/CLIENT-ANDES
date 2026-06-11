"use client";

import AdminHubFormField from "../../components/AdminHubFormField";

export const ADDITIONAL_FEE_TYPE = "Additional Fee";

export interface CreateAdditionalFormData {
  contratista: string;
  descripcion: string;
  monto: string;
}

interface CreateAdditionalItemFormProps {
  formData: CreateAdditionalFormData;
  onChange: (data: CreateAdditionalFormData) => void;
  contractorOptions: { value: string; label: string }[];
}

export function isAdditionalFormComplete(data: CreateAdditionalFormData): boolean {
  return Boolean(data.contratista && data.descripcion.trim() && data.monto.trim());
}

export default function CreateAdditionalItemForm({
  formData,
  onChange,
  contractorOptions,
}: CreateAdditionalItemFormProps) {
  function updateField<K extends keyof CreateAdditionalFormData>(
    key: K,
    value: CreateAdditionalFormData[K]
  ) {
    onChange({ ...formData, [key]: value });
  }

  return (
    <div className="w-full max-w-[636px] rounded-[8px] border border-[#EFEFEF] bg-white p-[30px]">
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[18px] font-bold leading-[1.3] text-black">
          Información General
        </h3>

        <div className="rounded-[8px] border border-[#EFEFEF] bg-[#F8F8F8] px-4 py-3">
          <p className="text-[12px] font-medium text-[#525252]">Tipo</p>
          <p className="text-[14px] text-[#343434]">{ADDITIONAL_FEE_TYPE}</p>
        </div>

        <AdminHubFormField
          type="select"
          label="Contratista"
          value={formData.contratista}
          onChange={(v) => updateField("contratista", v)}
          options={contractorOptions}
          placeholder="Seleccionar contratista"
        />

        <AdminHubFormField
          type="input"
          label="Descripción"
          value={formData.descripcion}
          onChange={(v) => updateField("descripcion", v)}
          placeholder="Nuevo Puesto"
        />

        <AdminHubFormField
          type="input"
          label="Monto"
          value={formData.monto}
          onChange={(v) => updateField("monto", v)}
          placeholder="$350"
        />
      </div>
    </div>
  );
}
