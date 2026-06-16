import {
  findContract,
  findContractor,
  MOCK_CONTRACTORS,
} from "./mock-contractors";
import {
  formatMoney,
  getPayrollVariables,
  type PayrollRow,
} from "./payroll-data";
import type { PayrollVariable, PayrollVariableStatus } from "./mock-payroll-variables";

export interface PayrollDetailPaymentLine {
  id?: string;
  label: string;
  /** Monto formateado mostrado junto al label. */
  value: string;
}

export interface PayrollDetail {
  id: string;
  contractorId: string;
  contractId: string;
  contractorName: string;
  client: string;
  position: string;
  country: string;
  contractStartDate: string;
  contractEndDate: string;
  contactEmail: string;
  period: string;
  status: PayrollVariableStatus;
  notes: string;
  baseSalary: number;
  earnings: PayrollDetailPaymentLine[];
  deductions: PayrollDetailPaymentLine[];
  totalEarnings: number;
  totalVariableEarnings: number;
  totalDeductions: number;
  totalAmount: number;
  variables: PayrollVariable[];
}

export function parsePayrollId(
  payrollId: string
): { contractorId: string; contractId: string } | null {
  for (const contractor of MOCK_CONTRACTORS) {
    const prefix = `${contractor.id}-`;
    if (!payrollId.startsWith(prefix)) continue;

    const contractId = payrollId.slice(prefix.length);
    const contract = contractor.contracts.find((item) => item.id === contractId);
    if (contract) {
      return { contractorId: contractor.id, contractId };
    }
  }

  return null;
}

function addOneYearToDisplayDate(date: string): string {
  const parts = date.split(".");
  if (parts.length !== 3) return date;

  const year = Number(parts[2]);
  if (Number.isNaN(year)) return date;

  return `${parts[0]}.${parts[1]}.${String(year + 1).padStart(2, "0")}`;
}

function mockContactEmail(name: string): string {
  const normalized = name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, ".");

  return `${normalized}@email.com`;
}

function variableLineLabel(variable: PayrollVariable): string {
  if (variable.type === "Income Variable") {
    return variable.incomeCategory ?? "Income Variable";
  }

  if (variable.type === "Deducción" && variable.deductionTipo) {
    return variable.deductionTipo;
  }

  if (variable.type === "Holiday") {
    return "Holidays";
  }

  return variable.type;
}

function buildPaymentLines(
  variables: PayrollVariable[],
  baseSalary: number
): Pick<
  PayrollDetail,
  | "earnings"
  | "deductions"
  | "totalEarnings"
  | "totalVariableEarnings"
  | "totalDeductions"
  | "totalAmount"
> {
  const positiveVariables = variables.filter((variable) => variable.amount > 0);
  const negativeVariables = variables.filter((variable) => variable.amount < 0);

  const totalVariableEarnings = positiveVariables.reduce(
    (sum, variable) => sum + variable.amount,
    0
  );

  const totalDeductions = negativeVariables.reduce(
    (sum, variable) => sum + Math.abs(variable.amount),
    0
  );

  const totalEarnings = baseSalary + totalVariableEarnings;
  const totalAmount = totalEarnings - totalDeductions;

  const earnings: PayrollDetailPaymentLine[] = [
    { id: "base-salary", label: "Sueldo Base", value: formatMoney(baseSalary) },
    ...positiveVariables.map((variable) => ({
      id: variable.id,
      label: variable.description
        ? `${variableLineLabel(variable)} — ${variable.description}`
        : variableLineLabel(variable),
      value: formatMoney(variable.amount),
    })),
  ];

  const deductions: PayrollDetailPaymentLine[] = negativeVariables.map((variable) => ({
    id: variable.id,
    label: variable.description
      ? `${variableLineLabel(variable)} — ${variable.description}`
      : variableLineLabel(variable),
    value: formatMoney(Math.abs(variable.amount)),
  }));

  return {
    earnings,
    deductions,
    totalEarnings,
    totalVariableEarnings,
    totalDeductions,
    totalAmount,
  };
}

function resolveStatus(variables: PayrollVariable[]): PayrollVariableStatus {
  if (variables.length === 0) return "Pendiente";
  if (variables.every((variable) => variable.status === "Aprobado")) return "Aprobado";
  if (variables.some((variable) => variable.status === "Rechazado")) return "Rechazado";
  return "Pendiente";
}

export function getPayrollDetail(
  payrollId: string,
  period: string
): PayrollDetail | null {
  const parsed = parsePayrollId(payrollId);
  if (!parsed) return null;

  const contractor = findContractor(parsed.contractorId);
  const contract = findContract(parsed.contractorId, parsed.contractId);
  if (!contractor || !contract) return null;

  const relatedVariables = getPayrollVariables().filter(
    (variable) =>
      variable.contractor === contractor.name &&
      variable.client === contract.client &&
      variable.period === period
  );

  const payment = buildPaymentLines(relatedVariables, contract.baseSalary);

  return {
    id: payrollId,
    contractorId: parsed.contractorId,
    contractId: parsed.contractId,
    contractorName: contractor.name,
    client: contract.client,
    position: contract.position,
    country: contractor.countryName,
    contractStartDate: contract.contractStartDate,
    contractEndDate: addOneYearToDisplayDate(contract.contractStartDate),
    contactEmail: mockContactEmail(contractor.name),
    period,
    status: resolveStatus(relatedVariables),
    notes: "",
    baseSalary: contract.baseSalary,
    variables: relatedVariables,
    ...payment,
  };
}

export function payrollRowToDetailPath(row: PayrollRow): string {
  const params = new URLSearchParams({ period: row.period });
  return `/admin-hub/nominas/${row.id}?${params.toString()}`;
}
