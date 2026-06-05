"use client";

import AdminHubFormField from "../../components/AdminHubFormField";

interface DeductionAmountFieldProps {
  value: string;
  onChange: (value: string) => void;
}

/** Monto de deducción: solo dígitos; el monto siempre se guarda como negativo. */
export function sanitizeDeductionAmountInput(value: string): string {
  return value.replace(/[^\d]/g, "");
}

export default function DeductionAmountField({
  value,
  onChange,
}: DeductionAmountFieldProps) {
  return (
    <AdminHubFormField
      type="input"
      label="Monto"
      value={value}
      onChange={(v) => onChange(sanitizeDeductionAmountInput(v))}
      placeholder="Monto"
      inputMode="numeric"
    />
  );
}

export function parseDeductionAmount(raw: string): number {
  const digits = raw.replace(/[^\d]/g, "");
  const value = parseInt(digits, 10) || 0;
  return -Math.abs(value);
}
