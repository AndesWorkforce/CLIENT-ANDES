import { MOCK_CONTRACTORS } from "./mock-contractors";
import {
  MOCK_PAYROLL_VARIABLES,
  type PayrollVariable,
  type PayrollVariableStatus,
} from "./mock-payroll-variables";
export {
  formatMoney,
  formatPaymentLineQuantityWithAmount,
  getPayrollDailyRate,
  getRegularDaysPayAmount,
  PAYROLL_WORKING_DAYS_PER_MONTH,
} from "./payroll-calculations";

export type PayrollInvoiceStatus = "Generado" | "Pendiente" | "Faltan datos" | null;
export type PayrollProofStatus = "Cargado" | "Pendiente" | "Not req." | null;

export interface PayrollRow {
  id: string;
  contractorId: string;
  contractorName: string;
  contractId: string;
  position: string;
  client: string;
  period: string;
  periodoAnioMes: string;
  baseSalary: number;
  clientPrice: number;
  variableAmount: number;
  totalAmount: number;
  invoice: PayrollInvoiceStatus;
  proof: PayrollProofStatus;
  status: PayrollVariableStatus;
}

const NOMINA_MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

/** Formato del selector: "Marzo del 2026" */
export function formatNominaMonthOption(year: number, monthIndex: number): string {
  return `${NOMINA_MONTH_NAMES[monthIndex]} del ${year}`;
}

/**
 * Mes-año desde el actual hacia atrás, un mes por opción.
 * Ejemplo en junio 2026: Junio del 2026, Mayo del 2026, Abril del 2026, ...
 */
export function buildNominaMonthOptions(monthsBack = 36): string[] {
  const options: string[] = [];
  const now = new Date();
  let year = now.getFullYear();
  let month = now.getMonth();

  for (let i = 0; i < monthsBack; i++) {
    options.push(formatNominaMonthOption(year, month));
    month -= 1;
    if (month < 0) {
      month = 11;
      year -= 1;
    }
  }

  return options;
}

export function getCurrentNominaMonthOption(): string {
  const now = new Date();
  return formatNominaMonthOption(now.getFullYear(), now.getMonth());
}

/** @deprecated Preferir `buildNominaMonthOptions()` para lista actualizada */
export const NOMINA_MONTH_OPTIONS = buildNominaMonthOptions();

export function monthOptionToPeriod(monthOption: string): string {
  return monthOption.replace(" del ", " ");
}

/** Convierte selector "Marzo del 2026" → "2026-03" para la API */
export function nominaMonthOptionToAnioMes(monthOption: string): string {
  const trimmed = monthOption.trim();
  const normalized = /^(\d{4})-(\d{1,2})$/.exec(trimmed);
  if (normalized) {
    const year = normalized[1];
    const month = Number(normalized[2]);
    if (month >= 1 && month <= 12) {
      return `${year}-${String(month).padStart(2, "0")}`;
    }
  }

  const match = /^(.+?)\s+del\s+(\d{4})$/.exec(trimmed);
  if (!match) {
    return trimmed;
  }

  const [, monthName, year] = match;
  const monthIndex = NOMINA_MONTH_NAMES.findIndex(
    (name) => name.toLowerCase() === monthName.trim().toLowerCase(),
  );

  if (monthIndex < 0) {
    return trimmed;
  }

  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

export function isValidAnioMes(value: string): boolean {
  return /^\d{4}-(0[1-9]|1[0-2])$/.test(value.trim());
}

/** Convierte "Marzo 2026" o selector "Marzo del 2026" → YYYY-MM */
export function displayPeriodToAnioMes(period: string): string {
  const trimmed = period.trim();
  if (isValidAnioMes(trimmed)) {
    return trimmed;
  }

  const fromSelector = nominaMonthOptionToAnioMes(trimmed);
  if (isValidAnioMes(fromSelector)) {
    return fromSelector;
  }

  const match = /^(.+?)\s+(\d{4})$/.exec(trimmed);
  if (!match) {
    return trimmed;
  }

  const [, monthName, year] = match;
  const monthIndex = NOMINA_MONTH_NAMES.findIndex(
    (name) => name.toLowerCase() === monthName.trim().toLowerCase(),
  );

  if (monthIndex < 0) {
    return trimmed;
  }

  return `${year}-${String(monthIndex + 1).padStart(2, "0")}`;
}

/** Convierte ISO (YYYY-MM-DD) al formato del selector de nóminas */
export function isoDateToNominaMonthOption(isoDate: string): string | null {
  if (!isoDate) return null;

  const date = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(date.getTime())) return null;

  return formatNominaMonthOption(date.getFullYear(), date.getMonth());
}

let payrollVariables: PayrollVariable[] = [...MOCK_PAYROLL_VARIABLES];

export function getPayrollVariables(): PayrollVariable[] {
  return payrollVariables;
}

export function setPayrollVariables(variables: PayrollVariable[]): void {
  payrollVariables = variables;
}

export function addPayrollVariable(variable: PayrollVariable): void {
  payrollVariables = [variable, ...payrollVariables];
}

export function updatePayrollVariableStatus(
  id: string,
  status: PayrollVariableStatus
): void {
  payrollVariables = payrollVariables.map((variable) =>
    variable.id === id ? { ...variable, status } : variable
  );
}

export function removePayrollVariable(id: string): void {
  payrollVariables = payrollVariables.filter((variable) => variable.id !== id);
}

export function formatVariableColumn(amount: number): string {
  if (amount === 0) return "+$0.00";
  const formatted = Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  if (amount > 0) return `+$${formatted}`;
  return `-$${formatted}`;
}

function sumVariables(contractorName: string, client: string, variables: PayrollVariable[]): number {
  return variables
    .filter((v) => v.contractor === contractorName && v.client === client)
    .reduce((sum, v) => sum + v.amount, 0);
}

function resolveStatus(
  contractorName: string,
  client: string,
  variables: PayrollVariable[]
): PayrollVariableStatus {
  const related = variables.filter(
    (v) => v.contractor === contractorName && v.client === client
  );
  
  // Si no hay variables, la nómina base está aprobada
  if (related.length === 0) return "Aprobado";
  
  // Si alguna variable está rechazada, la nómina está rechazada
  if (related.some((v) => v.status === "Rechazado")) return "Rechazado";
  
  // Si todas las variables están aprobadas, la nómina está aprobada
  if (related.every((v) => v.status === "Aprobado")) return "Aprobado";
  
  // Si hay alguna variable pendiente, la nómina está pendiente
  return "Pendiente";
}

export function buildPayrollRows(
  period: string,
  variables: PayrollVariable[] = payrollVariables
): PayrollRow[] {
  const rows: PayrollRow[] = [];

  for (const contractor of MOCK_CONTRACTORS) {
    for (const contract of contractor.contracts) {
      const variableAmount = sumVariables(contractor.name, contract.client, variables);
      const baseSalary = contract.baseSalary;
      const clientPrice = contract.clientPrice;

      rows.push({
        id: `${contractor.id}-${contract.id}`,
        contractorId: contractor.id,
        contractorName: contractor.name,
        contractId: contract.id,
        position: contract.position,
        client: contract.client,
        period,
        periodoAnioMes: displayPeriodToAnioMes(period),
        baseSalary,
        clientPrice,
        variableAmount,
        totalAmount: clientPrice + variableAmount,
        invoice: null,
        proof: null,
        status: resolveStatus(contractor.name, contract.client, variables),
      });
    }
  }

  return rows;
}
