export const HISTORIAL_MODULOS = ["NOMINA", "FACTURA", "VARIABLE"] as const;
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
  NOMINA: "Nómina",
  FACTURA: "Factura",
  VARIABLE: "Variable",
};

export const HISTORIAL_ACCION_LABEL: Record<HistorialAccion, string> = {
  CREAR: "Creación",
  ACTUALIZAR: "Actualización",
  APROBAR: "Aprobación",
  RECHAZAR: "Rechazo",
  EMITIR: "Emisión",
  ANULAR: "Anulación",
  ELIMINAR: "Eliminación",
};
