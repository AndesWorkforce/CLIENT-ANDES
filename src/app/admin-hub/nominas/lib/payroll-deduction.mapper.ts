import type { CreatePayrollVariableFormData } from "../components/payroll-variable-form-types";
import type { DeductionTipo } from "../data/deduction-types";
import type { PayrollVariable, PayrollVariableStatus } from "../data/mock-payroll-variables";
import type { PayrollVariableDetail } from "../data/mock-variable-detail";
import { parseDeductionMonto } from "./deduction-monto";
import {
  formatApplyDateFromIso,
  formatPayrollPeriodFromIso,
} from "./payroll-apply-date";
import { formatDisplayDate } from "../components/payroll-variable-form-types";
import type {
  CreateDeductionApiPayload,
  CreateDiaLibreApiPayload,
  DeduccionApiRecord,
  DeductionVariableContractContext,
  DeductionVariableKind,
  DeductionVariableRef,
  DiaLibreApiRecord,
  DiaLibrePreviewApiRecord,
  UpdateDiaLibreApiPayload,
} from "../types/payroll-deduction.types";

const ISO_DATE = /^\d{4}-\d{2}-\d{2}$/;

export function encodeDeductionVariableRef(
  kind: DeductionVariableKind,
  id: string,
): DeductionVariableRef {
  return `${kind}:${id}`;
}

export function decodeDeductionVariableRef(
  ref: string,
): { kind: DeductionVariableKind; id: string } | null {
  const separator = ref.indexOf(":");
  if (separator <= 0) return null;

  const kind = ref.slice(0, separator) as DeductionVariableKind;
  const id = ref.slice(separator + 1);

  if ((kind !== "ausencia" && kind !== "deduccion") || !id) {
    return null;
  }

  return { kind, id };
}

export function computeInclusiveCalendarDays(desde: string, hasta: string): number {
  const start = new Date(`${desde}T00:00:00`);
  const end = new Date(`${hasta}T00:00:00`);
  const diffMs = end.getTime() - start.getTime();
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
  return Math.max(1, days);
}

function toIsoDate(value: string | Date): string {
  if (typeof value === "string") {
    if (ISO_DATE.test(value)) return value;
    return value.slice(0, 10);
  }
  return value.toISOString().slice(0, 10);
}

function toNumber(value: number | string): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function resolveDeductionStatus(
  lineaNomina?: { id: string } | null,
): PayrollVariableStatus {
  return lineaNomina ? "Emitido" : "Aprobado";
}

export function buildCreateDiaLibrePayload(
  formData: CreatePayrollVariableFormData,
): CreateDiaLibreApiPayload {
  return {
    procesoContratacionId: formData.contractId,
    fechaInicio: formData.desde,
    fechaFin: formData.hasta,
    cantidadDias: computeInclusiveCalendarDays(formData.desde, formData.hasta),
    notas: formData.descripcion.trim() || undefined,
  };
}

export function buildCreateDeductionPayload(
  formData: CreatePayrollVariableFormData,
): CreateDeductionApiPayload {
  return {
    procesoContratacionId: formData.contractId,
    fechaEfectiva: formData.periodo,
    monto: parseDeductionMonto(formData.montoContexto),
    notas: formData.descripcion.trim(),
    usuarioId: formData.contractorId || undefined,
  };
}

export function buildUpdateDiaLibrePayload(
  formData: CreatePayrollVariableFormData,
): UpdateDiaLibreApiPayload {
  return {
    fechaInicio: formData.desde,
    fechaFin: formData.hasta,
    cantidadDias: computeInclusiveCalendarDays(formData.desde, formData.hasta),
    notas: formData.descripcion.trim() || undefined,
  };
}

export function mapDiaLibreToFormData(
  row: DiaLibreApiRecord,
  context: DeductionVariableContractContext,
): CreatePayrollVariableFormData {
  const fechaInicio = toIsoDate(row.fechaInicio);
  return {
    contractorId: context.usuarioId,
    contractId: context.procesoContratacionId,
    desde: fechaInicio,
    hasta: toIsoDate(row.fechaFin),
    montoContexto: "",
    incomeCategory: "",
    deductionTipo: "Ausencia",
    holidayId: "",
    duracion: "",
    cantidad: String(row.cantidadDias),
    descripcion: row.notas?.trim() ?? "",
    periodo: fechaInicio,
  };
}

export function mapDeduccionToFormData(
  row: DeduccionApiRecord,
  context: DeductionVariableContractContext,
): CreatePayrollVariableFormData {
  const fechaEfectiva = toIsoDate(row.fechaEfectiva);
  const monto = Math.abs(toNumber(row.monto));

  return {
    contractorId: context.usuarioId,
    contractId: context.procesoContratacionId,
    desde: "",
    hasta: "",
    montoContexto: monto > 0 ? String(monto) : "",
    incomeCategory: "",
    deductionTipo: "Other",
    holidayId: "",
    duracion: "",
    cantidad: "1",
    descripcion: row.notas?.trim() ?? "",
    periodo: fechaEfectiva,
  };
}

export function mapDiaLibreToPayrollVariable(
  row: DiaLibreApiRecord,
  context: DeductionVariableContractContext,
  monto: number,
): PayrollVariable {
  const fechaInicio = toIsoDate(row.fechaInicio);
  const fechaCreacion = toIsoDate(row.fechaSolicitud);

  return {
    id: encodeDeductionVariableRef("ausencia", row.id),
    date: formatDisplayDate(fechaCreacion),
    contractor: context.nombreCompleto,
    client: context.empresaNombre,
    type: "Ausencia",
    category: "deducciones",
    description: row.notas?.trim() || "Ausencia",
    amount: monto,
    status: resolveDeductionStatus(row.lineaNomina),
    createdBy: "—",
    period: formatPayrollPeriodFromIso(fechaInicio),
    applyDate: formatApplyDateFromIso(fechaInicio),
    deductionTipo: "Ausencia",
  };
}

export function mapDeduccionToPayrollVariable(
  row: DeduccionApiRecord,
  context: DeductionVariableContractContext,
): PayrollVariable {
  const fechaEfectiva = toIsoDate(row.fechaEfectiva);
  const monto = toNumber(row.monto);

  return {
    id: encodeDeductionVariableRef("deduccion", row.id),
    date: formatDisplayDate(fechaEfectiva),
    contractor: context.nombreCompleto,
    client: context.empresaNombre,
    type: "Deducción",
    category: "deducciones",
    description: row.notas?.trim() || "Deducción",
    amount: monto <= 0 ? monto : -Math.abs(monto),
    status: resolveDeductionStatus(row.lineaNomina),
    createdBy: "—",
    period: formatPayrollPeriodFromIso(fechaEfectiva),
    applyDate: formatApplyDateFromIso(fechaEfectiva),
    deductionTipo: "Other",
  };
}

export function mapDiaLibreToPayrollVariableDetail(
  row: DiaLibreApiRecord,
  context: DeductionVariableContractContext,
  monto: number,
): PayrollVariableDetail {
  const fechaInicio = toIsoDate(row.fechaInicio);
  const fechaFin = toIsoDate(row.fechaFin);

  return {
    id: encodeDeductionVariableRef("ausencia", row.id),
    type: "Ausencia",
    contratista: context.nombreCompleto,
    idContrato: context.procesoContratacionId,
    puesto: context.puestoTrabajo,
    cliente: context.empresaNombre,
    desde: formatApplyDateFromIso(fechaInicio),
    hasta: formatApplyDateFromIso(fechaFin),
    estado: resolveDeductionStatus(row.lineaNomina),
    creadoPor: "—",
    fechaCreacion: formatDisplayDate(toIsoDate(row.fechaSolicitud)),
    sueldoBase: context.ofertaSalarial,
    duracion: 20,
    cantidad: row.cantidadDias,
    monto,
    descripcion: row.notas?.trim() || "Ausencia",
    deductionTipo: "Ausencia" as DeductionTipo,
  };
}

export function mapDeduccionToPayrollVariableDetail(
  row: DeduccionApiRecord,
  context: DeductionVariableContractContext,
): PayrollVariableDetail {
  const fechaEfectiva = toIsoDate(row.fechaEfectiva);
  const monto = toNumber(row.monto);
  const normalized = monto <= 0 ? monto : -Math.abs(monto);

  return {
    id: encodeDeductionVariableRef("deduccion", row.id),
    type: "Deducción",
    contratista: context.nombreCompleto,
    idContrato: context.procesoContratacionId,
    puesto: context.puestoTrabajo,
    cliente: context.empresaNombre,
    desde: formatApplyDateFromIso(fechaEfectiva),
    hasta: formatApplyDateFromIso(fechaEfectiva),
    estado: resolveDeductionStatus(row.lineaNomina),
    creadoPor: "—",
    fechaCreacion: formatDisplayDate(fechaEfectiva),
    sueldoBase: context.ofertaSalarial,
    duracion: 20,
    cantidad: 1,
    monto: normalized,
    descripcion: row.notas?.trim() || "Deducción",
    deductionTipo: "Other",
  };
}

export function normalizeDiaLibreApiRecord(raw: Record<string, unknown>): DiaLibreApiRecord {
  return {
    id: String(raw.id),
    procesoContratacionId: String(raw.procesoContratacionId),
    usuarioId: String(raw.usuarioId),
    fechaSolicitud: String(raw.fechaSolicitud),
    fechaInicio: String(raw.fechaInicio),
    fechaFin: String(raw.fechaFin),
    cantidadDias: Number(raw.cantidadDias),
    mediaJornada: Boolean(raw.mediaJornada),
    horasAusencia:
      raw.horasAusencia == null ? null : Number(raw.horasAusencia),
    notas: raw.notas == null ? null : String(raw.notas),
    generaCreditoCliente: Boolean(raw.generaCreditoCliente),
    lineaNomina:
      raw.lineaNomina && typeof raw.lineaNomina === "object"
        ? (raw.lineaNomina as DiaLibreApiRecord["lineaNomina"])
        : null,
  };
}

export function normalizeDeduccionApiRecord(raw: Record<string, unknown>): DeduccionApiRecord {
  return {
    id: String(raw.id),
    procesoContratacionId: String(raw.procesoContratacionId),
    usuarioId: String(raw.usuarioId),
    fechaEfectiva: String(raw.fechaEfectiva),
    monto: raw.monto as number | string,
    notas: raw.notas == null ? null : String(raw.notas),
    lineaNomina:
      raw.lineaNomina && typeof raw.lineaNomina === "object"
        ? (raw.lineaNomina as DeduccionApiRecord["lineaNomina"])
        : null,
  };
}

export function normalizeDiaLibrePreview(
  raw: Record<string, unknown>,
): DiaLibrePreviewApiRecord {
  return {
    diaLibreId: String(raw.diaLibreId),
    procesoContratacionId: String(raw.procesoContratacionId),
    basicPay: Number(raw.basicPay),
    montoDescuento: Number(raw.montoDescuento),
  };
}

export function contractContextFromContratoDetail(detail: {
  id: string;
  usuarioId: string;
  nombreCompleto: string;
  puestoTrabajo: string;
  empresaNombre: string;
  ofertaSalarial: number;
}): DeductionVariableContractContext {
  return {
    procesoContratacionId: detail.id,
    usuarioId: detail.usuarioId,
    nombreCompleto: detail.nombreCompleto,
    puestoTrabajo: detail.puestoTrabajo,
    empresaNombre: detail.empresaNombre,
    ofertaSalarial: detail.ofertaSalarial,
  };
}
