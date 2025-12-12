export enum EstadoContratacion {
  PENDIENTE_DOCUMENTOS = "PENDIENTE_DOCUMENTOS",
  DOCUMENTOS_EN_LECTURA = "DOCUMENTOS_EN_LECTURA",
  DOCUMENTOS_COMPLETADOS = "DOCUMENTOS_COMPLETADOS",
  PENDIENTE_FIRMA = "PENDIENTE_FIRMA",
  PENDIENTE_FIRMA_CANDIDATO = "PENDIENTE_FIRMA_CANDIDATO",
  PENDIENTE_FIRMA_PROVEEDOR = "PENDIENTE_FIRMA_PROVEEDOR",
  FIRMADO = "FIRMADO",
  FIRMADO_CANDIDATO = "FIRMADO_CANDIDATO",
  FIRMADO_COMPLETO = "FIRMADO_COMPLETO",
  LECTURA_DOCS_COMPLETA = "LECTURA_DOCS_COMPLETA",
  CONTRATO_FINALIZADO = "CONTRATO_FINALIZADO",
  CANCELADO = "CANCELADO",
  EXPIRADO = "EXPIRADO",
}

export interface PaymentRecord {
  month: string;
  year: number;
  status: "paid" | "pending" | "rejected";
  evaluationStatus: "approved" | "rejected" | "pending";
  amount: number;
  currency: string;
  paymentDate?: Date;
}

export interface EvaluacionPagoMensual {
  id: string;
  procesoContratacionId: string;
  añoMes: string; // "2024-01", "2024-02", etc.
  pagoHabilitado: boolean;
  motivoEvaluacion?: string;
  documentoSubido?: string; // Path del documento subido
  fechaSubidaDocumento?: Date;
  documentoRevisado: boolean;
  fechaRevision?: Date;
  observacionesRevision?: string; // Comentarios de la revisión
  evaluadoPorId?: string;
  fechaEvaluacion: Date;
  fechaActualizacion: Date;
}

export interface DocumentoLeido {
  id: string;
  procesoContratacionId: string;
  seccionDocumento:
    | "introduccion"
    | "politicas"
    | "beneficios"
    | "contrato"
    | "reglamento";
  completamenteLeido: boolean;
  terminosAceptados: boolean;
  fechaAceptacion: string | null;
  fechaInicio: string;
  fechaUltimaUpdate: string;
}

export interface Anexo {
  id: string;
  titulo: string;
  descripcion?: string;
  archivoFirmadoUrl?: string;
  estado: string;
  createdAt: string;
}

export interface ProcesoContratacion {
  id: string;
  postulacionId: string;
  estadoContratacion: EstadoContratacion;
  fechaInicio: Date;
  fechaFinalizacion?: Date | null;
  nombreCompleto: string;
  correo: string;
  puestoTrabajo: string;
  ofertaSalarial: number;
  monedaSalario: string;
  fechaInicioLabores?: Date | null;
  signWellDocumentId?: string | null;
  signWellUrlCandidato?: string | null;
  signWellUrlProveedor?: string | null;
  signWellDownloadUrl?: string | null;
  documentoFirmado?: string | null;
  fechaFirmaCandidato?: Date | null;
  fechaFirmaProveedor?: Date | null;
  fechaFirma?: Date | null;
  activo: boolean;
  anexos?: Anexo[];

  // Información del cliente
  clienteNombre?: string;
  clienteId?: string;

  // Estados de lectura de documentos
  introduccionLeido: boolean;
  introduccionFechaLeido?: Date | null;
  politicasLeido: boolean;
  politicasFechaLeido?: Date | null;
  beneficiosLeido: boolean;
  beneficiosFechaLeido?: Date | null;
  contratoLeido: boolean;
  contratoFechaLeido?: Date | null;
  reglamentoLeido: boolean;
  reglamentoFechaLeido?: Date | null;

  // Estado general de lectura
  documentReadPercentage: number;
  readCompleted: boolean;

  // Campos adicionales para el frontend
  ultimaEvaluacion?: Date | null;
  estadoEvaluacion?: "pending" | "approved" | "rejected";
  salarioPagado: boolean;
  paymentHistory: PaymentRecord[];
  documentosLeidos: DocumentoLeido[];
  evaluacionesPago: EvaluacionPagoMensual[];

  // URL del contrato final cargado al S3
  contratoFinalUrl?: string | null;

  // Campo para rastrear si ya se envió el contrato al provider
  enviadoAlProveedor: boolean;
  fechaEnvioAlProveedor?: Date | null;
  enviadoPorUsuarioId?: string | null; // ID del admin que lo envió

  // Campos calculados para gestión de pagos mensuales
  documentoSubidoEsteMes: boolean;
  fechaUltimoDocumento: string | null;
  urlDocumentoMesActual: string | null;
  evaluacionMensualId: string | null;
  observacionesRevision: string | null;
  documentoRevisado: boolean;

  // Campos para el mes anterior
  mesAnteriorAprobado: boolean;
  evaluacionMesAnteriorId: string | null;
}

export interface GetContractsResponse {
  success: boolean;
  data: {
    resultados: ProcesoContratacion[];
    total: number;
  };
  totalPages: number;
}
