// Tipos para TypeScript
export interface Job {
  id: string;
  titulo: string;
  descripcion: string;
  requerimientos: string;
  activo: boolean;
  reutilizable: boolean;
  departamento: string | null;
  seniority: string | null;
  modalidad: string | null;
  creadaPorId: string;
  fechaCreacion: string;
  fechaActualizacion: string;
  actualizadoPorId: string | null;
  estado: string;
  creadaPor: {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
  };
  datosExtra: {
    empresa: string;
    categoria?: string;
    nivel?: string;
    modalidad?: string;
    tipoContrato?: string;
    rangoSalarial?: string;
    responsabilidades: string[];
    requisitos: string[];
    habilidades?: string[];
    salario?: string;
  };
  // Campos adicionales para compatibilidad con el código existente
  company?: string; // Para mantener compatibilidad, podemos mapear empresa a company
}
