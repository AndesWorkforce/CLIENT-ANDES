"use client";

import AdminHubDatePicker from "../../components/AdminHubDatePicker";

interface PayrollPeriodFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PayrollPeriodField({ value, onChange }: PayrollPeriodFieldProps) {
  return (
    <AdminHubDatePicker
      label="Período"
      value={value}
      onChange={onChange}
      placeholder="03.03.2026"
    />
  );
}
