export enum TipoAlerta {
  NOMINA_PENDIENTE = "NOMINA_PENDIENTE",
  VARIABLE_INGRESO_PENDIENTE = "VARIABLE_INGRESO_PENDIENTE",
  DEDUCCION_PENDIENTE = "DEDUCCION_PENDIENTE",
  FACTURA_PENDIENTE = "FACTURA_PENDIENTE",
  HORAS_EXTRA_PENDIENTE = "HORAS_EXTRA_PENDIENTE",
  DIAS_LIBRES_PENDIENTE = "DIAS_LIBRES_PENDIENTE",
  OTRO = "OTRO",
}

export enum EstadoAlerta {
  PENDIENTE = "PENDIENTE",
  REVISADO = "REVISADO",
  RESUELTO = "RESUELTO",
  ANULADO = "ANULADO",
}

export enum PrioridadAlerta {
  BAJA = "BAJA",
  MEDIA = "MEDIA",
  ALTA = "ALTA",
  CRITICA = "CRITICA",
}

export interface Alerta {
  id: string;
  tipo: TipoAlerta;
  estado: EstadoAlerta;
  prioridad: PrioridadAlerta;
  titulo: string;
  descripcion?: string;
  empresaId?: string;
  procesoContratacionId?: string;
  nominaId?: string;
  incomeVariableId?: string;
  deduccionId?: string;
  metadata?: Record<string, unknown>;
  creadoEn: string;
  actualizadoEn?: string;
  resueltaEn?: string;
  creadoPorId?: string;
  resueltoPorId?: string;
  empresa?: {
    id: string;
    nombre: string;
  };
  procesoContratacion?: {
    id: string;
    nombreCompleto: string;
    puestoTrabajo: string;
  };
  nomina?: {
    id: string;
    periodo: string;
    estado: string;
  };
  incomeVariable?: {
    id: string;
    categoria: string;
    monto: number;
    nota: string;
  };
  deduccion?: {
    id: string;
    monto: number;
    notas?: string;
  };
}

export interface AlertsStats {
  tipo: TipoAlerta;
  total: number;
}

// Legacy types for backward compatibility (deprecated)
export type AvisoTipo = "Nomina" | "Contrato" | "Pago" | "General";
export type AvisoEstado = "Pendiente" | "Revisado" | "Cerrado";

export interface Aviso {
  id: string;
  tipo: AvisoTipo;
  estado: AvisoEstado;
  descripcion: string;
  url?: string;
}
