import type { DeductionTipo } from "../data/deduction-types";
import type { PayrollVariable, PayrollVariableStatus } from "../data/mock-payroll-variables";
import type { PayrollVariableDetail } from "../data/mock-variable-detail";
import type { CreatePayrollVariableFormData } from "../components/payroll-variable-form-types";

/** Discriminador de persistencia en backend. */
export type DeductionVariableKind = "ausencia" | "deduccion";

/** ID compuesto para rutas y listado unificado: `ausencia:{uuid}` | `deduccion:{uuid}`. */
export type DeductionVariableRef = `${DeductionVariableKind}:${string}`;

export interface DeductionVariableContractContext {
  procesoContratacionId: string;
  usuarioId: string;
  nombreCompleto: string;
  puestoTrabajo: string;
  empresaNombre: string;
  ofertaSalarial: number;
}

export interface CreateDiaLibreApiPayload {
  procesoContratacionId: string;
  fechaInicio: string;
  fechaFin: string;
  cantidadDias: number;
  notas?: string;
  mediaJornada?: boolean;
  horasAusencia?: number;
  generaCreditoCliente?: boolean;
}

export interface CreateDeductionApiPayload {
  procesoContratacionId: string;
  fechaEfectiva: string;
  monto: number;
  notas: string;
  usuarioId?: string;
}

export interface UpdateDiaLibreApiPayload {
  fechaInicio?: string;
  fechaFin?: string;
  cantidadDias?: number;
  notas?: string;
  mediaJornada?: boolean;
  horasAusencia?: number;
  generaCreditoCliente?: boolean;
}

export interface DiaLibreApiRecord {
  id: string;
  procesoContratacionId: string;
  usuarioId: string;
  fechaSolicitud: string;
  fechaInicio: string;
  fechaFin: string;
  cantidadDias: number;
  mediaJornada: boolean;
  horasAusencia: number | null;
  notas: string | null;
  generaCreditoCliente: boolean;
  lineaNomina?: { id: string; nominaId: string } | null;
}

export interface DeduccionApiRecord {
  id: string;
  procesoContratacionId: string;
  usuarioId: string;
  fechaEfectiva: string;
  monto: number | string;
  notas: string | null;
  lineaNomina?: { id: string; nominaId: string } | null;
}

export interface DiaLibrePreviewApiRecord {
  diaLibreId: string;
  procesoContratacionId: string;
  basicPay: number;
  montoDescuento: number;
}

export interface SubmitDeductionVariableResult {
  success: boolean;
  message: string;
  ref?: DeductionVariableRef;
  kind?: DeductionVariableKind;
  variable?: PayrollVariable;
}

export interface GetDeductionVariableResult {
  success: boolean;
  message: string;
  ref?: DeductionVariableRef;
  kind?: DeductionVariableKind;
  detail?: PayrollVariableDetail;
  formData?: CreatePayrollVariableFormData;
  editable?: boolean;
}

export interface UpdateDeductionVariableResult {
  success: boolean;
  message: string;
  ref?: DeductionVariableRef;
  detail?: PayrollVariableDetail;
  formData?: CreatePayrollVariableFormData;
}

export function isDeductionTipo(value: string): value is DeductionTipo {
  return value === "Ausencia" || value === "Other";
}

export function resolveDeductionKindFromForm(
  formData: Pick<CreatePayrollVariableFormData, "deductionTipo">,
): DeductionVariableKind {
  return formData.deductionTipo === "Ausencia" ? "ausencia" : "deduccion";
}
