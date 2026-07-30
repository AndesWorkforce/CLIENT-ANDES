"use client";

import type { MovementType } from "./CreateInvoiceItemDrawer";
import AdminHubFormField from "../../components/AdminHubFormField";

export interface CreateItemFormData {
  tipo: string;
  descripcion: string;
  monto: string;
  moneda: string;
}

interface CreateInvoiceItemFormProps {
  movementType: MovementType;
  formData: CreateItemFormData;
  onChange: (data: CreateItemFormData) => void;
}

const CHARGE_TYPES = [
  { value: "team-building", label: "Team Building" },
  { value: "nomina", label: "Nomina" },
  { value: "bono", label: "Bono" },
  { value: "tarifa", label: "Tarifa" },
];

const CREDIT_TYPES = [
  { value: "renuncia", label: "Renuncia" },
  { value: "deduccion-dias", label: "Deducción días libres" },
  { value: "ausencia", label: "Ausencia" },
  { value: "ajuste", label: "Ajuste manual" },
];

const CURRENCIES = [
  { value: "USD", label: "USD" },
  { value: "COP", label: "COP" },
  { value: "EUR", label: "EUR" },
];

export function isCreateItemFormComplete(data: CreateItemFormData): boolean {
  return Boolean(data.tipo && data.descripcion.trim() && data.monto.trim() && data.moneda);
}

export default function CreateInvoiceItemForm({
  movementType,
  formData,
  onChange,
}: CreateInvoiceItemFormProps) {
  const tipoOptions = movementType === "customer-charges" ? CHARGE_TYPES : CREDIT_TYPES;

  function updateField<K extends keyof CreateItemFormData>(key: K, value: CreateItemFormData[K]) {
    onChange({ ...formData, [key]: value });
  }

  return (
    <div className="w-full max-w-[636px] rounded-[12px] border border-[#EFEFEF] bg-white p-[30px]">
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[18px] font-bold leading-[1.3] text-black">Información General</h3>

        <AdminHubFormField
          type="select"
          label="Tipo"
          value={formData.tipo}
          onChange={(v) => updateField("tipo", v)}
          options={tipoOptions}
          placeholder="Seleccionar tipo"
        />

        <AdminHubFormField
          type="input"
          label="Descripción"
          value={formData.descripcion}
          onChange={(v) => updateField("descripcion", v)}
          placeholder="Descripción del ítem"
        />

        <div className="flex flex-col gap-[10px] sm:flex-row">
          <div className="min-w-0 flex-1 sm:max-w-[350px]">
            <AdminHubFormField
              type="input"
              label="Monto"
              value={formData.monto}
              onChange={(v) => updateField("monto", v)}
              placeholder="$0"
            />
          </div>
          <div className="w-full sm:w-[222px] shrink-0">
            <AdminHubFormField
              type="select"
              label="Moneda"
              value={formData.moneda}
              onChange={(v) => updateField("moneda", v)}
              options={CURRENCIES}
              placeholder="Moneda"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
