import type { PayrollVariable, PayrollVariableStatus } from "../data/mock-payroll-variables";
import type { PayrollVariableDetail } from "../data/mock-variable-detail";
import { formatDisplayDate } from "../components/payroll-variable-form-types";
import { formatApplyDateFromIso, formatPayrollPeriodFromIso } from "./payroll-apply-date";
import type { DeductionTipo } from "../data/deduction-types";
import type { IncomeVariableCategory } from "../data/income-variable-categories";

export interface NominaVariableListItemApi {
  id: string;
  kind: string;
  procesoContratacionId: string;
  usuarioId: string;
  nombreCompleto: string;
  empresaNombre: string;
  tipo: string;
  categoria: string;
  descripcion: string;
  monto: number;
  estado: PayrollVariableStatus;
  periodo: string;
  periodoAnioMes: string;
  fechaCreacion: string;
  fechaAplicar: string;
  creadoPorNombre?: string | null;
  incomeCategoria?: string | null;
  deductionSubtipo?: "Ausencia" | "Other" | null;
}

export interface NominaVariableDetailApi extends NominaVariableListItemApi {
  puestoTrabajo: string;
  ofertaSalarial: number;
  fechaAplicarDesde: string;
  fechaAplicarHasta: string;
  horas?: number | null;
  cantidadDias?: number | null;
  editable: boolean;
}

export function mapIncomeCategoryLabelToEnum(label: IncomeVariableCategory): string {
  switch (label) {
    case "Bonus":
    case "Referral":
      return "BONUS";
    case "Reimbursement":
      return "REIMBURSEMENT";
    case "Invoice Expense":
      return "INVOICE_EXPENSE";
    case "Other":
    default:
      return "OTHER";
  }
}

export function mapNominaVariableListItemToPayrollVariable(
  item: NominaVariableListItemApi,
): PayrollVariable {
  const type =
    item.tipo === "Overtime"
      ? "Overtime"
      : item.tipo === "Holiday"
        ? "Holiday"
        : item.tipo === "Ausencia"
          ? "Ausencia"
          : item.tipo === "Deducción"
            ? "Deducción"
            : "Income Variable";

  return {
    id: item.id,
    date: formatDisplayDate(item.fechaCreacion),
    contractor: item.nombreCompleto,
    client: item.empresaNombre,
    type,
    category: item.categoria as PayrollVariable["category"],
    description: item.descripcion,
    amount: item.monto,
    status: item.estado,
    createdBy: item.creadoPorNombre?.trim() || "—",
    period: item.periodo,
    applyDate: formatApplyDateFromIso(item.fechaAplicar),
    ...(item.incomeCategoria
      ? { incomeCategory: item.incomeCategoria as IncomeVariableCategory }
      : {}),
    ...(item.deductionSubtipo
      ? { deductionTipo: item.deductionSubtipo as DeductionTipo }
      : {}),
  };
}

export function mapNominaVariableDetailToPayrollVariable(
  detail: NominaVariableDetailApi,
): PayrollVariable {
  const categoria =
    detail.kind === "overtime"
      ? "overtimes"
      : detail.kind === "holiday"
        ? "holidays"
        : detail.kind === "income-variable"
          ? "incomeVariables"
          : "deducciones";

  return mapNominaVariableListItemToPayrollVariable({
    id: detail.id,
    kind: detail.kind,
    procesoContratacionId: detail.procesoContratacionId,
    usuarioId: detail.usuarioId,
    nombreCompleto: detail.nombreCompleto,
    empresaNombre: detail.empresaNombre,
    tipo: detail.tipo,
    categoria,
    descripcion: detail.descripcion,
    monto: detail.monto,
    estado: detail.estado,
    periodo: detail.periodo,
    periodoAnioMes: detail.periodoAnioMes,
    fechaCreacion: detail.fechaCreacion,
    fechaAplicar: detail.fechaAplicarDesde,
    creadoPorNombre: detail.creadoPorNombre,
    incomeCategoria: detail.incomeCategoria,
    deductionSubtipo: detail.deductionSubtipo,
  });
}

export function mapNominaVariableDetailToPayrollVariableDetail(
  detail: NominaVariableDetailApi,
): PayrollVariableDetail {
  const type =
    detail.tipo === "Overtime"
      ? "Overtime"
      : detail.tipo === "Holiday"
        ? "Holiday"
        : detail.tipo === "Ausencia"
          ? "Ausencia"
          : detail.tipo === "Deducción"
            ? "Deducción"
            : "Income Variable";

  // Divisor de días laborables del mes (admin-hub). No confundir con horas/día (8).
  const duracionDiasMes = 20;

  return {
    id: detail.id,
    type,
    contratista: detail.nombreCompleto,
    idContrato: detail.procesoContratacionId,
    puesto: detail.puestoTrabajo,
    cliente: detail.empresaNombre,
    desde: formatApplyDateFromIso(detail.fechaAplicarDesde),
    hasta: formatApplyDateFromIso(detail.fechaAplicarHasta),
    estado: detail.estado,
    creadoPor: detail.creadoPorNombre?.trim() || "—",
    fechaCreacion: formatDisplayDate(detail.fechaCreacion),
    sueldoBase: detail.ofertaSalarial,
    duracion: type === "Overtime" ? 8 : duracionDiasMes,
    cantidad: detail.cantidadDias ?? detail.horas ?? 1,
    monto: detail.monto,
    descripcion: detail.descripcion,
    ...(detail.incomeCategoria
      ? { incomeCategory: detail.incomeCategoria as IncomeVariableCategory }
      : {}),
    ...(detail.deductionSubtipo
      ? { deductionTipo: detail.deductionSubtipo as DeductionTipo }
      : {}),
  };
}

export function mapNominaVariableDetailToPeriodDisplay(detail: NominaVariableDetailApi): string {
  return formatPayrollPeriodFromIso(detail.fechaAplicarDesde);
}
