export interface DocumentoPostulacion {
  id: string;
  // Agregar otros campos según sea necesario
}

export interface Propuesta {
  titulo: string;
  // Agregar otros campos según sea necesario
}

export interface ProcesoContratacion {
  id: string;
  // Agregar otros campos según sea necesario
}

export interface Postulacion {
  id: string;
  propuestaId: string;
  candidatoId: string;
  fechaPostulacion: string;
  estadoPostulacion: string;
  fechaEtapa1: string | null;
  fechaEtapa2: string | null;
  fechaEtapa3: string | null;
  notasInternas: string | null;
  fechaActualizacion: string;
  actualizadoPorId: string;
  estado: string;
  cv: string | null;
  documentosPostulacion: DocumentoPostulacion[];
  activo: boolean;
  bloqueada: boolean;
  bloqueadaPor: string | null;
  propuesta: Propuesta;
  procesosContratacion: ProcesoContratacion[];
}

export interface LastRelevantPostulacion {
  id: string;
  estado: string;
  titulo: string;
  fecha: string;
}

export interface Applicant {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  pais?: string;
  activo?: boolean;
  clasificacionGlobal?: string;
  favorite?: boolean;
  postulaciones?: Postulacion[];
  lastRelevantPostulacion?: LastRelevantPostulacion;
}

// Interface más simple para casos donde no necesitas todos los datos
export interface ApplicantBasic {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  lastRelevantPostulacion?: {
    id: string;
    titulo: string;
    estado: string;
    fecha?: string;
  };
}
