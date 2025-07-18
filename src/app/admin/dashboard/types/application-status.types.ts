export type EstadoPostulacion =
  | "PENDIENTE"
  | "EN_EVALUACION"
  | "PRIMERA_ENTREVISTA_REALIZADA"
  | "EN_EVALUACION_CLIENTE"
  | "SEGUNDA_ENTREVISTA_REALIZADA"
  | "FINALISTA"
  | "ACEPTADA"
  | "RECHAZADA";

export const STATUS_TRANSLATIONS: Record<EstadoPostulacion, string> = {
  PENDIENTE: "Available",
  EN_EVALUACION: "First Interview",
  PRIMERA_ENTREVISTA_REALIZADA: "First Interview Completed",
  EN_EVALUACION_CLIENTE: "Second Interview",
  SEGUNDA_ENTREVISTA_REALIZADA: "Second Interview Completed",
  FINALISTA: "Finalist",
  ACEPTADA: "Hired",
  RECHAZADA: "Terminated",
};

export const AVAILABLE_STATUSES: EstadoPostulacion[] = [
  "PENDIENTE",
  "EN_EVALUACION",
  "PRIMERA_ENTREVISTA_REALIZADA",
  "EN_EVALUACION_CLIENTE",
  "SEGUNDA_ENTREVISTA_REALIZADA",
  "FINALISTA",
  "ACEPTADA",
  "RECHAZADA",
];

export interface ApiResponse {
  success: boolean;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}
