export interface CreadorOffer {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
}

// Interfaz para el candidato
export interface Candidato {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono: string;
  fotoPerfil: string | null;
  videoPresentacion: string | null;
}

// Interfaz para documentos de postulación
export interface DocumentoPostulacion {
  id: string;
  nombre: string;
  url: string;
  tipo: string;
}

// Estado de la postulación
export type EstadoPostulacion =
  | "PENDIENTE"
  | "ACEPTADO"
  | "RECHAZADO"
  | "EN_PROCESO";

// Interfaz para las postulaciones
export interface Postulacion {
  id: string;
  activo: boolean;
  propuestaId: string;
  candidatoId: string;
  fechaPostulacion: string;
  estadoPostulacion: EstadoPostulacion;
  fechaEtapa1: string | null;
  fechaEtapa2: string | null;
  fechaEtapa3: string | null;
  notasInternas: string | null;
  fechaActualizacion: string;
  actualizadoPorId: string | null;
  estado: string;
  cv: string | null;
  documentosPostulacion: DocumentoPostulacion[];
  candidato: Candidato;
}

// Interfaz básica para una oferta
export interface Offer {
  id?: string;
  titulo: string;
  descripcion: string; // HTML para el nuevo editor o JSON stringificado del editor anterior
  requerimientos?: string; // OBSOLETO: Mantenido por compatibilidad, usar descripción para todo el contenido
  estado: OfferStatus;
  empresa?: string;
  ubicacion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  fechaPublicacion?: string;
  userId?: string;

  // Campos adicionales de la API
  activo?: boolean;
  reutilizable?: boolean;
  departamento?: string | null;
  seniority?: string | null;
  modalidad?: string | null;
  creadaPorId?: string;
  actualizadoPorId?: string | null;
  creadaPor?: CreadorOffer;
  postulaciones?: Postulacion[]; // Actualizado con el tipo correcto
  _count?: {
    postulaciones: number;
  };
  postulacionesCount?: number;
}

// Estados posibles de una oferta
export type OfferStatus =
  | "borrador"
  | "publicado"
  | "cerrado"
  | "eliminado"
  | "pausado";

// Interfaz para usar con el editor (con valores ya parseados)
export interface OfferWithContent {
  id?: string;
  titulo: string;
  descripcion: string; // Contenido HTML para el editor
  requerimientos?: string; // OBSOLETO: Mantenido por compatibilidad
  estado: OfferStatus;
  empresa?: string;
  ubicacion?: string;
  fechaCreacion?: string;
  fechaActualizacion?: string;
  fechaPublicacion?: string;
  userId?: string;
}

// Interfaces para la respuesta de la API
export interface OfferResponse {
  data: Offer[];
  meta: ApiMeta;
}

export interface ApiMeta {
  status: number;
  message: string;
  timestamp: string;
  path: string;
  pagination: PaginationMeta;
}

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

// Interfaz para crear una nueva oferta
export interface CreateOfferDto {
  titulo: string;
  descripcion: string;
  requerimientos: string;
  estado: OfferStatus;
}

// Interfaz para respuesta de operaciones
export interface ApiResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

// Funciones helper para convertir entre tipos
export const parseOfferContent = (offer: Offer): OfferWithContent => {
  if (!offer) {
    return {
      id: undefined,
      titulo: "",
      descripcion: "",
      estado: "borrador",
    };
  }

  let descripcionHTML = "";
  if (offer.descripcion && typeof offer.descripcion === "string") {
    // Si empieza con '{' intentamos parsear como JSON, si no, lo dejamos como HTML
    if (offer.descripcion.trim().startsWith("{")) {
      try {
        const parsed = JSON.parse(offer.descripcion);
        if (parsed && typeof parsed === "object") {
          // Aquí puedes convertir el objeto a HTML si lo necesitas
          descripcionHTML = "<p>Content migrated from previous format</p>";
        }
      } catch {
        // Si falla el parseo, asumimos que es HTML
        descripcionHTML = offer.descripcion;
      }
    } else {
      // Ya es HTML
      descripcionHTML = offer.descripcion;
    }
  }

  const parsed: OfferWithContent = {
    ...offer,
    descripcion: descripcionHTML,
    requerimientos: offer.requerimientos || "",
  };

  return parsed;
};

export const stringifyOfferContent = (offer: Offer): Offer => {
  // In the new format, the description is already a string HTML,
  // so we don't need any special conversion
  return { ...offer };
};
