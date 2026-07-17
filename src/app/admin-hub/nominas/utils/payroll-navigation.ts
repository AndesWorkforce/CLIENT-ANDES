import type { PayrollRow } from "../data/payroll-data";

export function payrollRowToDetailPath(row: PayrollRow): string {
  const params = new URLSearchParams({ periodo: row.periodoAnioMes });
  return `/admin-hub/nominas/${row.id}?${params.toString()}`;
}
