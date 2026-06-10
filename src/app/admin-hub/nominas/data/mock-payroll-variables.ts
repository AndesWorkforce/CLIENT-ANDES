import type { IncomeVariableCategory } from "./income-variable-categories";
import type { DeductionTipo } from "./deduction-types";

export type PayrollVariableType =
  | "Overtime"
  | "Deducción"
  | "Income Variable"
  | "Ausencia"
  | "Holiday";

export type PayrollVariableCategory =
  | "todos"
  | "ausencias"
  | "overtimes"
  | "holidays"
  | "deducciones"
  | "incomeVariables";

export type PayrollVariableStatus = "Pendiente" | "Aprobado" | "Rechazado";

export type PayrollVariableDrawerType =
  | "overtime"
  | "holidays"
  | "deducciones"
  | "incomeVariables";

export interface PayrollVariable {
  id: string;
  date: string;
  contractor: string;
  client: string;
  type: PayrollVariableType;
  category: Exclude<PayrollVariableCategory, "todos">;
  description: string;
  amount: number;
  status: PayrollVariableStatus;
  createdBy: string;
  /** Período de nómina (ej. Marzo 2026) */
  period: string;
  /** Fecha a aplicar DD.MM.YYYY */
  applyDate: string;
  incomeCategory?: IncomeVariableCategory;
  /** Tipo dentro de Deductions (ej. Ausencia) */
  deductionTipo?: DeductionTipo;
}

export const PAYROLL_VARIABLE_TABS: {
  key: PayrollVariableCategory;
  label: string;
}[] = [
  { key: "todos", label: "Todos" },
  { key: "ausencias", label: "Ausencias" },
  { key: "overtimes", label: "Overtimes" },
  { key: "holidays", label: "Holidays" },
  { key: "deducciones", label: "Deducciones" },
  { key: "incomeVariables", label: "Income Variables" },
];

export const MOCK_PAYROLL_VARIABLES: PayrollVariable[] = [
  {
    id: "pv-1",
    date: "03.21.26",
    contractor: "Juan Perez",
    client: "BK",
    type: "Overtime",
    category: "overtimes",
    description: "Problema Tecnico",
    amount: 50,
    status: "Pendiente",
    createdBy: "Violeta Q",
    period: "Marzo 2026",
    applyDate: "03.03.2026",
  },
  {
    id: "pv-2",
    date: "03.21.26",
    contractor: "Ana Gomez",
    client: "BK",
    type: "Ausencia",
    category: "deducciones",
    description: "Ausencia injustificada",
    amount: -50,
    status: "Pendiente",
    createdBy: "Violeta Q",
    deductionTipo: "Ausencia",
    period: "Marzo 2026",
    applyDate: "03.05.2026",
  },
  {
    id: "pv-3",
    date: "03.21.26",
    contractor: "Luis Lee",
    client: "Rocket",
    type: "Deducción",
    category: "deducciones",
    description: "Problema personal",
    amount: -100,
    status: "Pendiente",
    createdBy: "Violeta Q",
    period: "Marzo 2026",
    applyDate: "03.10.2026",
  },
  {
    id: "pv-9",
    date: "03.21.26",
    contractor: "Ana Gomez",
    client: "BK",
    type: "Income Variable",
    category: "incomeVariables",
    description: "Bono desempeño",
    amount: 200,
    status: "Pendiente",
    createdBy: "Violeta Q",
    incomeCategory: "Bonus",
    period: "Marzo 2026",
    applyDate: "03.03.2026",
  },
  {
    id: "pv-10",
    date: "03.21.26",
    contractor: "Luis Lee",
    client: "Rocket",
    type: "Income Variable",
    category: "incomeVariables",
    description: "Ajuste manual",
    amount: -200,
    status: "Pendiente",
    createdBy: "Violeta Q",
    incomeCategory: "Other",
    period: "Marzo 2026",
    applyDate: "03.15.2026",
  },
  {
    id: "pv-4",
    date: "03.21.26",
    contractor: "Martin Diaz",
    client: "Rocket",
    type: "Overtime",
    category: "overtimes",
    description: "Remplazo",
    amount: 100,
    status: "Pendiente",
    createdBy: "Violeta Q",
    period: "Marzo 2026",
    applyDate: "03.08.2026",
  },
  {
    id: "pv-5",
    date: "03.21.26",
    contractor: "María Rodriguez",
    client: "Port",
    type: "Overtime",
    category: "overtimes",
    description: "Soporte",
    amount: 50,
    status: "Pendiente",
    createdBy: "Violeta Q",
    period: "Marzo 2026",
    applyDate: "03.12.2026",
  },
  {
    id: "pv-6",
    date: "03.21.26",
    contractor: "Sol Martin",
    client: "Ve",
    type: "Overtime",
    category: "overtimes",
    description: "Soporte",
    amount: 50,
    status: "Pendiente",
    createdBy: "Violeta Q",
    period: "Marzo 2026",
    applyDate: "03.18.2026",
  },
  {
    id: "pv-7",
    date: "03.20.26",
    contractor: "Carla Ruiz",
    client: "Port",
    type: "Ausencia",
    category: "ausencias",
    description: "Licencia médica",
    amount: -50,
    status: "Pendiente",
    createdBy: "Violeta Q",
    period: "Marzo 2026",
    applyDate: "03.20.2026",
  },
  {
    id: "pv-8",
    date: "03.19.26",
    contractor: "Pedro Soto",
    client: "BK",
    type: "Holiday",
    category: "holidays",
    description: "Feriado nacional",
    amount: 100,
    status: "Pendiente",
    createdBy: "Violeta Q",
    period: "Marzo 2026",
    applyDate: "03.19.2026",
  },
];

export function formatPayrollAmount(amount: number): string {
  const prefix = amount < 0 ? "-$" : "$";
  return `${prefix}${Math.abs(amount)}`;
}
