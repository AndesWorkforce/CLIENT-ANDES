import { getPayrollVariables } from "../../nominas/data/payroll-data";
import type { PayrollVariable } from "../../nominas/data/mock-payroll-variables";
import { getMetodoPagoDisplay, getPaisDisplay } from "./contract-display";
import {
  findMockContract,
  type MockProcesoContratacion,
} from "./mock-contracts";

/** Alineado con `DiscretionaryBonusType` en Prisma. */
export type DiscretionaryBonusType =
  | "NONE"
  | "HALF_MONTH_ONCE_DECEMBER"
  | "FULL_MONTH_ONCE_DECEMBER"
  | "FULL_MONTH_TWICE_JUNE_DECEMBER";

export interface ContractChangeLog {
  id: string;
  descripcion: string;
  fecha: string;
}

export interface ContractPayrollHistoryRow {
  id: string;
  periodo: string;
  totalPagado: number;
  estado: "Pendiente" | "Aprobada";
}

export interface ContractPayrollVariableRow {
  id: string;
  periodo: string;
  tipo: string;
  impacto: number;
  descripcion: string;
  estado: "Pendiente" | "Aprobada";
  categoria: PayrollVariable["category"];
}

export interface ContractDetail extends MockProcesoContratacion {
  codigoContrato: string;
  fechaInicioContrato: string;
  fechaUltimaModificacionContrato: string;
  telefono: string;
  documentoIdentidad: string;
  fechaNacimiento: string;
  estadoResidencia: string;
  ciudadResidencia: string;
  direccionResidencia: string;
  tarifaHrNacional: number;
  discretionaryBonusType: DiscretionaryBonusType;
  bonusLabel: string;
  dollarTag: string | null;
  numeroCuentaFacturacion: string | null;
  bancoFacturacionNombre: string | null;
  historialCambios: ContractChangeLog[];
  historialNomina: ContractPayrollHistoryRow[];
  variablesNomina: ContractPayrollVariableRow[];
}

function generateCodigoContrato(id: string): string {
  const num =
    id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) % 900000 + 100000;
  return `AD-${num}`;
}

function getTodayIsoDate(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function mapVariableStatus(status: PayrollVariable["status"]): "Pendiente" | "Aprobada" {
  return status === "Aprobado" ? "Aprobada" : "Pendiente";
}

function buildPayrollHistory(
  contract: MockProcesoContratacion,
  variables: PayrollVariable[]
): ContractPayrollHistoryRow[] {
  const byPeriod = new Map<string, { total: number; hasPending: boolean }>();

  for (const variable of variables) {
    const current = byPeriod.get(variable.period) ?? { total: contract.ofertaSalarial, hasPending: false };
    current.total += variable.amount;
    if (variable.status !== "Aprobado") current.hasPending = true;
    byPeriod.set(variable.period, current);
  }

  if (byPeriod.size === 0) {
    return [
      {
        id: "nh-1",
        periodo: "Mayo 2026",
        totalPagado: contract.clientPrice ?? contract.ofertaSalarial,
        estado: "Pendiente",
      },
      {
        id: "nh-2",
        periodo: "Abril 2026",
        totalPagado: contract.clientPrice ?? contract.ofertaSalarial,
        estado: "Aprobada",
      },
      {
        id: "nh-3",
        periodo: "Marzo 2026",
        totalPagado: contract.clientPrice ?? contract.ofertaSalarial,
        estado: "Aprobada",
      },
    ];
  }

  return Array.from(byPeriod.entries())
    .map(([periodo, data], index) => ({
      id: `nh-${index + 1}`,
      periodo,
      totalPagado: Math.max(0, data.total),
      estado: data.hasPending ? ("Pendiente" as const) : ("Aprobada" as const),
    }))
    .slice(0, 6);
}

function mapVariableCategory(
  variable: PayrollVariable
): ContractPayrollVariableRow["categoria"] {
  if (variable.type === "Ausencia") {
    return "deducciones";
  }
  return variable.category;
}

function buildVariablesRows(variables: PayrollVariable[]): ContractPayrollVariableRow[] {
  if (variables.length === 0) {
    return [
      {
        id: "cv-1",
        periodo: "Abril 2026",
        tipo: "Overtime",
        impacto: 100,
        descripcion: "Horas Extra",
        estado: "Aprobada",
        categoria: "overtimes",
      },
      {
        id: "cv-2",
        periodo: "Marzo 2026",
        tipo: "Ausencia",
        impacto: -50,
        descripcion: "Tramite",
        estado: "Aprobada",
        categoria: "deducciones",
      },
      {
        id: "cv-3",
        periodo: "Febrero 2026",
        tipo: "Ausencia",
        impacto: -50,
        descripcion: "Tramite",
        estado: "Aprobada",
        categoria: "deducciones",
      },
    ];
  }

  return variables.slice(0, 8).map((variable) => ({
    id: variable.id,
    periodo: variable.period,
    tipo: variable.type,
    impacto: variable.amount,
    descripcion: variable.description,
    estado: mapVariableStatus(variable.status),
    categoria: mapVariableCategory(variable),
  }));
}

function enrichUsuarioFields(contract: MockProcesoContratacion) {
  const isJuanPerez = contract.nombreCompleto === "Juan Perez";

  const residenceByCountry: Record<
    string,
    { estadoResidencia: string; ciudadResidencia: string; direccionResidencia: string }
  > = {
    AR: {
      estadoResidencia: "Buenos Aires",
      ciudadResidencia: "CABA",
      direccionResidencia: "Gorriti 1256, CABA, ARG",
    },
    CO: {
      estadoResidencia: "Cundinamarca",
      ciudadResidencia: "Bogotá",
      direccionResidencia: "Calle 85 #12-40, Bogotá, COL",
    },
    MX: {
      estadoResidencia: "CDMX",
      ciudadResidencia: "Ciudad de México",
      direccionResidencia: "Av. Reforma 222, CDMX, MEX",
    },
  };

  const residence = residenceByCountry[contract.paisCodigo] ?? residenceByCountry.AR;

  return {
    telefono: isJuanPerez ? "+54 011 1586 6464" : "+54 11 4000 1234",
    documentoIdentidad: isJuanPerez ? "38.335.339" : "30.112.445",
    fechaNacimiento: isJuanPerez ? "1996-03-03" : "1992-08-15",
    correo: isJuanPerez ? "jperez@teamandes.com" : contract.correo,
    correoEmpresa: isJuanPerez ? "jperez@bk.com" : contract.correoEmpresa,
    ...residence,
    bancoNombre: contract.bancoNombre ?? (contract.usaDollarApp ? null : "Galicia"),
    numeroCuentaBancaria: contract.numeroCuentaBancaria?.replace(/\*/g, "") ?? "56325478",
    bancoFacturacionNombre: contract.usaDollarApp ? "Dolar App" : "Lean",
    numeroCuentaFacturacion: "45653585",
    dollarTag: null as string | null,
    tarifaHrNacional: 2.0,
    discretionaryBonusType: "HALF_MONTH_ONCE_DECEMBER" as DiscretionaryBonusType,
    bonusLabel: "Cumpleaños",
  };
}

function buildChangeHistory(contract: MockProcesoContratacion): ContractChangeLog[] {
  return [
    {
      id: "cl-1",
      descripcion: `María cambió el salario de $${contract.ofertaSalarial} a $${Math.max(
        200,
        contract.ofertaSalarial - 800
      )}`,
      fecha: "12 Mar 2026",
    },
    {
      id: "cl-2",
      descripcion: `María actualizó el método de pago a ${getMetodoPagoDisplay(contract)}`,
      fecha: "05 Mar 2026",
    },
    {
      id: "cl-3",
      descripcion: `María actualizó el país de facturación a ${getPaisDisplay(
        contract.paisCodigo,
        contract.paisFacturacion
      )}`,
      fecha: "28 Feb 2026",
    },
  ];
}

export function getContractDetail(contractId: string): ContractDetail | null {
  const contract = findMockContract(contractId);
  if (!contract) return null;

  const usuario = enrichUsuarioFields(contract);
  const relatedVariables = getPayrollVariables().filter(
    (variable) =>
      variable.contractor === contract.nombreCompleto &&
      variable.client === contract.empresaNombre
  );

  return {
    ...contract,
    ...usuario,
    codigoContrato: generateCodigoContrato(contract.id),
    fechaInicioContrato: getTodayIsoDate(),
    fechaUltimaModificacionContrato: getTodayIsoDate(),
    historialCambios: buildChangeHistory(contract),
    historialNomina: buildPayrollHistory(contract, relatedVariables),
    variablesNomina: buildVariablesRows(relatedVariables),
  };
}

export function contractToDetailPath(contract: Pick<MockProcesoContratacion, "id">): string {
  return `/admin-hub/contratos/${contract.id}`;
}
