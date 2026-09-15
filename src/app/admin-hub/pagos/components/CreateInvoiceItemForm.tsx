"use client";

import type { MovementType } from "./CreateInvoiceItemDrawer";
import AdminHubFormField from "../../components/AdminHubFormField";
import { t } from "../../i18n";
import {
  INVOICE_ITEM_CURRENCY,
  isCreateItemFormComplete,
  type CreateItemFormData,
} from "./invoice-item-currency";

export {
  INVOICE_ITEM_CURRENCY,
  isCreateItemFormComplete,
  type CreateItemFormData,
};

interface CreateInvoiceItemFormProps {
  movementType: MovementType;
  formData: CreateItemFormData;
  onChange: (data: CreateItemFormData) => void;
}

const CHARGE_TYPE_VALUES = [
  { value: "team-building", labelKey: "pagos.itemTypes.teamBuilding" },
  { value: "nomina", labelKey: "pagos.itemTypes.payroll" },
  { value: "bono", labelKey: "pagos.itemTypes.bonus" },
  { value: "tarifa", labelKey: "pagos.itemTypes.fee" },
] as const;

const CREDIT_TYPE_VALUES = [
  { value: "renuncia", labelKey: "pagos.itemTypes.resignation" },
  { value: "deduccion-dias", labelKey: "pagos.itemTypes.dayDeduction" },
  { value: "ausencia", labelKey: "pagos.itemTypes.absence" },
  { value: "ajuste", labelKey: "pagos.itemTypes.manualAdjust" },
] as const;

export default function CreateInvoiceItemForm({
  movementType,
  formData,
  onChange,
}: CreateInvoiceItemFormProps) {
  const tipoOptions = (
    movementType === "customer-charges" ? CHARGE_TYPE_VALUES : CREDIT_TYPE_VALUES
  ).map((option) => ({ value: option.value, label: t(option.labelKey) }));

  function updateField<K extends keyof CreateItemFormData>(key: K, value: CreateItemFormData[K]) {
    onChange({ ...formData, [key]: value });
  }

  return (
    <div className="w-full max-w-[636px] rounded-[12px] border border-[#EFEFEF] bg-white p-[30px]">
      <div className="flex flex-col gap-[10px]">
        <h3 className="text-[18px] font-bold leading-[1.3] text-black">{t("personas.generalInfo")}</h3>

        <AdminHubFormField
          type="select"
          label={t("nominas.type")}
          value={formData.tipo}
          onChange={(v) => updateField("tipo", v)}
          options={tipoOptions}
          placeholder={t("pagos.selectType")}
        />

        <AdminHubFormField
          type="input"
          label={t("pagos.description")}
          value={formData.descripcion}
          onChange={(v) => updateField("descripcion", v)}
          placeholder={t("pagos.itemDescriptionPlaceholder")}
        />

        <div className="flex flex-col gap-[10px] sm:flex-row">
          <div className="min-w-0 flex-1 sm:max-w-[350px]">
            <AdminHubFormField
              type="input"
              label={t("nominas.amount")}
              value={formData.monto}
              onChange={(v) => updateField("monto", v)}
              placeholder="$0"
            />
          </div>
          <div className="w-full sm:w-[222px] shrink-0">
            <AdminHubFormField
              type="input"
              label={t("personas.currency")}
              value={INVOICE_ITEM_CURRENCY}
              onChange={() => undefined}
              readOnly
            />
          </div>
        </div>
      </div>
    </div>
  );
}
