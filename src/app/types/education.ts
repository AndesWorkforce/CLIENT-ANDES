export interface Education {
  id?: string;
  institucion: string;
  titulo: string;
  añoInicio: string;
  añoFin?: string | null;
  esActual?: boolean;
  usuarioId?: string;
}
