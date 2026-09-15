export const HISTORIAL_MODULOS = [
  "NOMINA",
  "FACTURA",
  "VARIABLE",
  "CONTRATO",
  "PERSONA",
  "DEDUCCION",
  "CUSTOMER_CHARGE",
  "CUSTOMER_CREDIT",
  "ALERTA",
  "PAIS",
  "DIA_LIBRE",
] as const;
export const HISTORIAL_ACCIONES = [
  "CREAR",
  "ACTUALIZAR",
  "APROBAR",
  "RECHAZAR",
  "EMITIR",
  "ANULAR",
  "ELIMINAR",
] as const;

export type HistorialModulo = (typeof HISTORIAL_MODULOS)[number];
export type HistorialAccion = (typeof HISTORIAL_ACCIONES)[number];

export interface HistorialUsuario {
  id: string;
  nombre: string;
  correo?: string | null;
}

export interface HistorialItem {
  id: string;
  modulo: HistorialModulo;
  accion: HistorialAccion;
  entidadTipo: string;
  entidadId?: string | null;
  descripcion: string;
  cambios?: unknown;
  metadata?: unknown;
  createdAt: string;
  usuario?: HistorialUsuario | null;
}

export const HISTORIAL_MODULO_LABEL: Record<HistorialModulo, string> = {
  NOMINA: "Payroll",
  FACTURA: "Invoice",
  VARIABLE: "Variable",
  CONTRATO: "Contract",
  PERSONA: "Person",
  DEDUCCION: "Deduction",
  CUSTOMER_CHARGE: "Customer charge",
  CUSTOMER_CREDIT: "Customer credit",
  ALERTA: "Alert",
  PAIS: "Country",
  DIA_LIBRE: "Absence",
};

export const HISTORIAL_ACCION_LABEL: Record<HistorialAccion, string> = {
  CREAR: "Created",
  ACTUALIZAR: "Updated",
  APROBAR: "Approved",
  RECHAZAR: "Rejected",
  EMITIR: "Issued",
  ANULAR: "Voided",
  ELIMINAR: "Deleted",
};
