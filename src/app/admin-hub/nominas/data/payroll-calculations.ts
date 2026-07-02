/** Días laborables base del período de nómina (regulares + holidays = este total). */
export const PAYROLL_WORKING_DAYS_PER_MONTH = 20;

export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("es-ES")}`;
}

/** Tarifa diaria derivada del sueldo base mensual. */
export function getPayrollDailyRate(baseSalary: number): number {
  return Math.round(baseSalary / PAYROLL_WORKING_DAYS_PER_MONTH);
}

/** Monto del sueldo base asignado a días regulares del período. */
export function getRegularDaysPayAmount(baseSalary: number): number {
  return baseSalary;
}

/** Formato desprendible: cantidad + monto (ej. "18 — $3200"). */
export function formatPaymentLineQuantityWithAmount(
  quantity: number,
  amount: number
): string {
  return `${quantity} — ${formatMoney(amount)}`;
}
