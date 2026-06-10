import type { PayrollVariableDrawerType } from "../data/mock-payroll-variables";
import { getTodayIso } from "../lib/today-iso";

export interface CreatePayrollVariableFormData {
  contractorId: string;
  contractId: string;
  desde: string;
  hasta: string;
  montoContexto: string;
  incomeCategory: string;
  deductionTipo: string;
  holidayId: string;
  duracion: string;
  cantidad: string;
  descripcion: string;
}

export const OVERTIME_UNIT_OPTIONS = [
  { value: "horas", label: "Horas" },
  { value: "minutos", label: "Minutos" },
];

export const TYPE_SUBTITLES: Record<PayrollVariableDrawerType, string> = {
  overtime: "Overtime",
  holidays: "Holidays",
  deducciones: "Deductions",
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
    deductionTipo: "",
    holidayId: "",
    duracion: "",
    cantidad: "1",
    descripcion: "",
  };
}

function isDeductionFormComplete(data: CreatePayrollVariableFormData): boolean {
  if (!data.deductionTipo) return false;

  if (data.deductionTipo === "Ausencia") {
    if (!data.desde || !data.hasta) return false;
    const today = getTodayIso();
    if (data.desde > today) return false;
    if (data.hasta < data.desde) return false;
    return true;
  }

  if (data.deductionTipo === "Other") {
    return Boolean(data.montoContexto.trim());
  }

  return false;
}

export function isPayrollVariableFormComplete(
  type: PayrollVariableDrawerType,
  data: CreatePayrollVariableFormData
): boolean {
  const base = Boolean(data.contractorId && data.contractId && data.descripcion.trim());

  switch (type) {
    case "overtime":
      return (
        base &&
        Boolean(data.desde && data.duracion && data.cantidad.trim())
      );
    case "holidays":
      return base && Boolean(data.holidayId);
    case "deducciones":
      return base && isDeductionFormComplete(data);
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
