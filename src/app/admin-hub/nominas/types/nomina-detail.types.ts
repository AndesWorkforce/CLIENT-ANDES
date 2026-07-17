import type { PayrollVariable, PayrollVariableStatus } from "../data/mock-payroll-variables";

export interface PayrollDetailPaymentLine {
  id?: string;
  label: string;
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
  periodoAnioMes: string;
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
  nominaId?: string | null;
}

export interface NominaDetailApiResponse {
  id: string;
  usuarioId: string;
  nombreCompleto: string;
  empresaNombre: string;
  puestoTrabajo: string;
  paisNombre: string;
  correo: string;
  fechaInicioContrato: string;
  fechaFinContrato: string;
  periodo: string;
  periodoAnioMes: string;
  estado: PayrollVariableStatus;
  ofertaSalarial: number;
  earnings: PayrollDetailPaymentLine[];
  deductions: PayrollDetailPaymentLine[];
  totalEarnings: number;
  totalVariableEarnings: number;
  totalDeductions: number;
  totalAmount: number;
  variables: Array<{
    id: string;
    type: string;
    category: string;
    description: string;
    amount: number;
    status: PayrollVariableStatus;
  }>;
  notes: string;
  nominaId?: string | null;
}
