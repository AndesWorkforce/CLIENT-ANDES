"use client";

import AdminHubDatePicker from "../../components/AdminHubDatePicker";
import { useAdminHubI18n } from "../../i18n";

interface PayrollPeriodFieldProps {
  value: string;
  onChange: (value: string) => void;
}

export default function PayrollPeriodField({ value, onChange }: PayrollPeriodFieldProps) {
  const { t } = useAdminHubI18n();
  return (
    <AdminHubDatePicker
      label={t("nominas.period")}
      value={value}
      onChange={onChange}
      placeholder="03.03.2026"
    />
  );
}
