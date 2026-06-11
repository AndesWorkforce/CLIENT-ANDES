import type { CreatePayrollVariableFormData } from "../components/payroll-variable-form-types";
import { getTodayIso } from "./today-iso";

/** Fecha a aplicar: DD.MM.YYYY */
export function formatApplyDateFromIso(isoDate: string): string {
  const [y, m, d] = isoDate.split("-");
  if (!y || !m || !d) return isoDate;
  return `${d}.${m}.${y}`;
}

/** ISO → etiqueta de período (ej. Marzo 2026) */
export function formatPayrollPeriodFromIso(isoDate: string): string {
  const match = isoDate.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return isoDate;

  const [, year, month, day] = match;
  const date = new Date(Number(year), Number(month) - 1, Number(day));
  const raw = date.toLocaleDateString("es-ES", { month: "long", year: "numeric" });
  return raw.charAt(0).toUpperCase() + raw.slice(1).replace(" de ", " ");
}

export function resolveApplyDate(formData: CreatePayrollVariableFormData): string {
  if (formData.periodo) {
    return formatApplyDateFromIso(formData.periodo);
  }
  return formatApplyDateFromIso(getTodayIso());
}

/** Para ordenar DD.MM.YYYY */
export function applyDateToSortable(applyDate: string): string {
  const parts = applyDate.split(".");
  if (parts.length !== 3) return applyDate;
  const [d, m, y] = parts;
  return `${y}-${m}-${d}`;
}
