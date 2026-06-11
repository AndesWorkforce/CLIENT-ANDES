"use client";

import AdminHubFormField from "../../components/AdminHubFormField";
import { INCOME_VARIABLE_CATEGORY_OPTIONS } from "../data/income-variable-categories";
import {
  parseSignedAmountInput,
  sanitizeSignedAmountInput,
} from "../lib/parse-signed-amount";

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
  return (
    <div className="flex flex-col gap-[10px] sm:flex-row">
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="select"
          label="Categoría"
          value={category}
          onChange={onCategoryChange}
          options={INCOME_VARIABLE_CATEGORY_OPTIONS}
          placeholder="Seleccionar"
        />
      </div>
      <div className="min-w-0 flex-1">
        <AdminHubFormField
          type="input"
          label="Monto"
          value={amount}
          onChange={(v) => onAmountChange(sanitizeSignedAmountInput(v))}
          placeholder="Ej: 200 suma, -200 resta"
          inputMode="text"
        />
      </div>
    </div>
  );
}

export { parseSignedAmountInput };
