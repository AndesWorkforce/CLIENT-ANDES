"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { INCOME_VARIABLE_CATEGORY_OPTIONS } from "../data/income-variable-categories";
import {
  parseSignedAmountInput,
  sanitizeSignedAmountInput,
} from "../lib/parse-signed-amount";
import { useAdminHubI18n } from "../../i18n";

interface IncomeVariableAmountFieldProps {
  category: string;
  amount: string;
  onCategoryChange: (value: string) => void;
  onAmountChange: (value: string) => void;
}

/** Categoría + monto en la misma fila (Income Variables). */
export default function IncomeVariableAmountField({
  category,
  amount,
  onCategoryChange,
  onAmountChange,
}: IncomeVariableAmountFieldProps) {
  const { t } = useAdminHubI18n();
  return (
    <div className="flex flex-col gap-[10px] sm:flex-row">
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="select"
          label={t("nominas.category")}
          value={category}
          onChange={onCategoryChange}
          options={INCOME_VARIABLE_CATEGORY_OPTIONS.map((option) => ({
            value: option.value,
            label: t(`nominas.incomeCategories.${option.value}`),
          }))}
          placeholder={t("common.select")}
        />
      </div>
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="input"
          label={t("nominas.amount")}
          value={amount}
          onChange={(v) => onAmountChange(sanitizeSignedAmountInput(v))}
          placeholder={t("nominas.amountExample")}
          inputMode="text"
        />
      </div>
    </div>
  );
}

export { parseSignedAmountInput };
