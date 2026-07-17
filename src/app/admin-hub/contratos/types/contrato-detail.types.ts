export type DiscretionaryBonusType =
  | "NONE"
  | "HALF_MONTH_ONCE_DECEMBER"
  | "FULL_MONTH_ONCE_DECEMBER"
  | "FULL_MONTH_TWICE_JUNE_DECEMBER";

export type ContractApprovalStatus = "Pendiente" | "Aprobada";

export type ContractPayrollVariableCategory =
  | "overtimes"
  | "holidays"
  | "deducciones"
  | "incomeVariables";

export interface ContractChangeLog {
  id: string;
  descripcion: string;
  fecha: string;
}

export interface ContractPayrollHistoryRow {
  id: string;
  periodo: string;
  totalPagado: number;
  estado: ContractApprovalStatus;
}

export interface ContractPayrollVariableRow {
  id: string;
  periodo: string;
  tipo: string;
  impacto: number;
  descripcion: string;
  estado: ContractApprovalStatus;
  categoria: ContractPayrollVariableCategory;
}

export interface ContratoDetail {
  id: string;
  usuarioId: string;
  nombreCompleto: string;
  puestoTrabajo: string;
  empresaNombre: string;
  activo: boolean;
  codigoContrato: string;
  correo: string;
  telefono: string;
  documentoIdentidad: string;
  fechaNacimiento: string;
  paisCodigo: string | null;
  paisNombre: string;
  estadoResidencia: string;
  ciudadResidencia: string;
  direccionResidencia: string;
  fechaInicioContrato: string;
  fechaUltimaModificacionContrato: string;
  ofertaSalarial: number;
  monedaSalario: string;
  tarifaHrNacional: number;
  discretionaryBonusType: DiscretionaryBonusType | null;
  bonusLabel: string;
  paisFacturacionNombre: string;
  metodoPago: string;
  dollarTag: string | null;
  bancoNombre: string | null;
  numeroCuentaBancaria: string | null;
  bancoFacturacionNombre: string | null;
  numeroCuentaFacturacion: string | null;
  historialNomina: ContractPayrollHistoryRow[];
  variablesNomina: ContractPayrollVariableRow[];
  historialCambios: ContractChangeLog[];
}
