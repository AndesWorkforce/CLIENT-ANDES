import type { CreatePayrollVariableFormData } from "../components/payroll-variable-form-types";
import type { PayrollVariableDrawerType } from "../data/mock-payroll-variables";
import { parseDeductionMonto } from "./deduction-monto";
import { parseSignedAmountInput } from "./parse-signed-amount";
import { mapIncomeCategoryLabelToEnum } from "./payroll-variable-api.types";
import type { IncomeVariableCategory } from "../data/income-variable-categories";
import { computeInclusiveCalendarDays } from "./payroll-deduction.mapper";

export type NominaVariableKindApi =
  | "overtime"
  | "holiday"
  | "ausencia"
  | "deduccion"
  | "income-variable";

export interface CreateNominaVariableApiPayload {
  kind: NominaVariableKindApi;
  procesoContratacionId: string;
  notas?: string;
  periodo?: string;
  fecha?: string;
  horas?: number;
  tipoDia?: "DIA_SEMANA" | "SABADO" | "DOMINGO";
  fechaInicio?: string;
  fechaFin?: string;
  cantidadDias?: number;
  monto?: number;
  categoria?: string;
  montoIngreso?: number;
  nota?: string;
}

function periodoAnioMesFromIso(isoDate: string): string {
  return isoDate.slice(0, 7);
}

function deriveTipoDiaFromFecha(fecha: string): "DIA_SEMANA" | "SABADO" | "DOMINGO" {
  const day = new Date(`${fecha}T12:00:00Z`).getUTCDay();
  if (day === 0) return "DOMINGO";
  if (day === 6) return "SABADO";
  return "DIA_SEMANA";
}

function deriveHorasFromForm(formData: CreatePayrollVariableFormData): number {
  const quantity = parseFloat(formData.cantidad.replace(",", ".")) || 1;
  return formData.duracion === "minutos" ? quantity / 60 : quantity;
}

export function formDataToCreateNominaVariablePayload(
  drawerType: PayrollVariableDrawerType,
  formData: CreatePayrollVariableFormData,
): CreateNominaVariableApiPayload {
  const base = {
    procesoContratacionId: formData.contractId,
    notas: formData.descripcion.trim() || undefined,
  };

  switch (drawerType) {
    case "overtime": {
      const fecha = formData.desde?.trim();
      const periodoSource = formData.periodo?.trim() || fecha || "";
      if (!periodoSource || !/^\d{4}-\d{2}/.test(periodoSource)) {
        throw new Error("Seleccioná un período válido para overtime");
      }
      const periodo = periodoAnioMesFromIso(periodoSource);
      const fechaIso =
        fecha && /^\d{4}-\d{2}-\d{2}$/.test(fecha) ? fecha : undefined;

      return {
        ...base,
        kind: "overtime",
        periodo,
        ...(fechaIso ? { fecha: fechaIso, tipoDia: deriveTipoDiaFromFecha(fechaIso) } : {}),
        horas: deriveHorasFromForm(formData),
      };
    }
    case "holidays": {
      const fecha = formData.desde?.trim();
      if (!fecha || !/^\d{4}-\d{2}-\d{2}$/.test(fecha)) {
        throw new Error("Seleccione un feriado válido del catálogo del país");
      }
      return {
        ...base,
        kind: "holiday",
        fecha,
        notas: base.notas,
      };
    }
    case "deducciones":
      if (formData.deductionTipo === "Ausencia") {
        return {
          ...base,
          kind: "ausencia",
          fechaInicio: formData.desde,
          fechaFin: formData.hasta,
          cantidadDias: computeInclusiveCalendarDays(formData.desde, formData.hasta),
        };
      }
      return {
        ...base,
        kind: "deduccion",
        fecha: formData.periodo,
        monto: parseDeductionMonto(formData.montoContexto),
        notas: base.notas || "Deducción",
      };
    case "incomeVariables":
      return {
        ...base,
        kind: "income-variable",
        periodo: periodoAnioMesFromIso(formData.periodo),
        categoria: mapIncomeCategoryLabelToEnum(
          formData.incomeCategory as IncomeVariableCategory,
        ),
        montoIngreso: parseSignedAmountInput(formData.montoContexto),
        nota: formData.descripcion.trim(),
      };
    default:
      throw new Error("Tipo de variable no soportado");
  }
}
