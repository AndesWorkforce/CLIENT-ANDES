// Modificar la importación de YooptaContentValue
// import { YooptaContentValue } from "@yoopta/editor";

// Interfaz para la información del usuario creador
export interface CreadorOffer {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
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
  postulaciones?: any[]; // Se puede crear una interfaz específica si se conoce la estructura
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
  data?: any;
}

// Funciones helper para convertir entre tipos
export const parseOfferContent = (offer: Offer): OfferWithContent => {
  if (!offer) {
    console.warn("Se intentó parsear una oferta vacía");
    return {
      id: undefined,
      titulo: "",
      descripcion: "",
      estado: "borrador",
    };
  }

  // Log para ver los datos que llegan
  console.log("[PARSE] Parseando offer:", {
    id: offer.id,
    titulo: offer.titulo,
    descripcion_tipo: typeof offer.descripcion,
    descripcion_muestra:
      typeof offer.descripcion === "string"
        ? offer.descripcion.substring(0, 50) + "..."
        : "no es string",
  });

  // Verificar si la descripción es un objeto JSON stringificado del editor anterior
  let descripcionHTML = "";
  if (offer.descripcion && typeof offer.descripcion === "string") {
    try {
      const parsed = JSON.parse(offer.descripcion);
      if (parsed && typeof parsed === "object") {
        // Esto es del formato antiguo, convertiríamos a HTML si es necesario
        // Por ahora simplemente indicamos que es contenido migrado
        descripcionHTML = "<p>Contenido migrado desde formato anterior</p>";
      } else {
        // Si no es un objeto JSON, asumimos que ya es HTML
        descripcionHTML = offer.descripcion;
      }
    } catch (e) {
      // Si no se puede parsear como JSON, asumimos que ya es HTML
      descripcionHTML = offer.descripcion;
    }
  }

  // Crear un nuevo objeto con los campos preparados
  const parsed: OfferWithContent = {
    ...offer,
    descripcion: descripcionHTML,
    requerimientos: offer.requerimientos || "",
  };

  // Log para verificar el resultado
  console.log("[PARSE] Resultado:", {
    id: parsed.id,
    titulo: parsed.titulo,
    descripcion_longitud: parsed.descripcion.length,
    descripcion_tipo: typeof parsed.descripcion,
  });

  return parsed;
};

export const stringifyOfferContent = (offer: Offer): Offer => {
  // En el nuevo formato, la descripción ya es un string HTML,
  // así que no necesitamos hacer ninguna conversión especial
  return { ...offer };
};
