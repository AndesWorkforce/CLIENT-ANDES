import type { PayrollVariableDrawerType } from "../data/mock-payroll-variables";

export interface CreatePayrollVariableFormData {
  contractorId: string;
  contractId: string;
  desde: string;
  hasta: string;
  montoContexto: string;
  incomeCategory: string;
  holidayId: string;
  duracion: string;
  cantidad: string;
  descripcion: string;
}

export const DURATION_OPTIONS = [
  { value: "horas", label: "Horas" },
  { value: "minutos", label: "Minutos" },
];

export const TYPE_SUBTITLES: Record<PayrollVariableDrawerType, string> = {
  ausencia: "Ausencia",
  overtime: "Overtime",
  holidays: "Holidays",
  deducciones: "Deducciones",
  incomeVariables: "Income Variables",
};

export function emptyPayrollVariableForm(): CreatePayrollVariableFormData {
  return {
    contractorId: "",
    contractId: "",
    desde: "",
    hasta: "",
    montoContexto: "",
    incomeCategory: "",
    holidayId: "",
    duracion: "",
    cantidad: "1",
    descripcion: "",
  };
}

export function isPayrollVariableFormComplete(
  type: PayrollVariableDrawerType,
  data: CreatePayrollVariableFormData
): boolean {
  const base = Boolean(data.contractorId && data.contractId && data.descripcion.trim());

  switch (type) {
    case "ausencia":
      return base && Boolean(data.desde);
    case "overtime":
      return base && Boolean(data.duracion && data.cantidad.trim());
    case "holidays":
      return base && Boolean(data.holidayId);
    case "deducciones":
    case "incomeVariables":
      return (
        base && Boolean(data.montoContexto.trim() && data.incomeCategory.trim())
      );
    default:
      return false;
  }
}

export function formatDisplayDate(isoDate: string): string {
  if (!isoDate) return "";
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}.${m}.${y.slice(-2)}`;
}
