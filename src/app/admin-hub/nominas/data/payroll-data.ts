import { MOCK_CONTRACTORS } from "./mock-contractors";
import {
  MOCK_PAYROLL_VARIABLES,
  type PayrollVariable,
  type PayrollVariableStatus,
} from "./mock-payroll-variables";

export interface PayrollRow {
  id: string;
  contractorId: string;
  contractorName: string;
  contractId: string;
  position: string;
  client: string;
  period: string;
  baseSalary: number;
  variableAmount: number;
  totalAmount: number;
  status: PayrollVariableStatus;
}

export const NOMINA_MONTH_OPTIONS = [
  "Marzo del 2025",
  "Abril del 2025",
  "Mayo del 2025",
  "Junio del 2025",
  "Julio del 2025",
  "Agosto del 2025",
  "Septiembre del 2025",
  "Octubre del 2025",
  "Noviembre del 2025",
  "Diciembre del 2025",
  "Marzo del 2026",
  "Abril del 2026",
  "Mayo del 2026",
];

export function monthOptionToPeriod(monthOption: string): string {
  return monthOption.replace(" del ", " ");
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
  if (amount === 0) return "+$0";
  if (amount > 0) return `+$${amount.toLocaleString("es-ES")}`;
  return `-$${Math.abs(amount).toLocaleString("es-ES")}`;
}

export function formatMoney(amount: number): string {
  return `$${amount.toLocaleString("es-ES")}`;
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
  if (related.length === 0) return "Pendiente";
  return related.every((v) => v.status === "Pendiente") ? "Pendiente" : "Pendiente";
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

      rows.push({
        id: `${contractor.id}-${contract.id}`,
        contractorId: contractor.id,
        contractorName: contractor.name,
        contractId: contract.id,
        position: contract.position,
        client: contract.client,
        period,
        baseSalary,
        variableAmount,
        totalAmount: baseSalary + variableAmount,
        status: resolveStatus(contractor.name, contract.client, variables),
      });
    }
  }

  return rows;
}
