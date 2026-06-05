export type AvisoTipo = "Nomina" | "Contrato" | "Pago" | "General";

export type AvisoEstado = "Pendiente" | "Revisado" | "Cerrado";

export interface Aviso {
  id: string;
  tipo: AvisoTipo;
  estado: AvisoEstado;
  descripcion: string;
  url?: string;
}
