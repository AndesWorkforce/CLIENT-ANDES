"use server";

import { createServerAxios } from "@/services/axios.server";

export interface User {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
}

export interface JobProposal {
  id: string;
  titulo: string;
  descripcion: string;
  estado: string;
  departamento: string | null;
  seniority: string | null;
  modalidad: string | null;
  creadaPor: User;
}

export interface ApplicationDocument {
  id: string;
  nombre: string;
  url: string;
}

export interface ApiApplication {
  id: string;
  activo: boolean;
  propuestaId: string;
  candidatoId: string;
  fechaPostulacion: string;
  estadoPostulacion: string;
  fechaEtapa1: string | null;
  fechaEtapa2: string | null;
  fechaEtapa3: string | null;
  notasInternas: string | null;
  fechaActualizacion: string;
  actualizadoPorId: string | null;
  estado: string;
  cv: string | null;
  documentosPostulacion: ApplicationDocument[];
  propuesta: JobProposal;
  disponibilidadEntrevista?: string | null;
  disponibilidadEntrevista2?: string | null;
  disponibilidadEntrevista3?: string | null;
  fechaEntrevistaConfirmada?: string | null;
}

export interface Application {
  id: string;
  title?: string;
  company?: string;
  publicationDate?: string;
  applicationDate?: string;
  stage?: string;
  status: string;
  estadoPostulacion: string;
  propuesta: {
    titulo: string;
    descripcion: string;
  };
  documentosPostulacion?: ApplicationDocument[];
  disponibilidadEntrevista?: string | null;
  disponibilidadEntrevista2?: string | null;
  disponibilidadEntrevista3?: string | null;
  fechaEntrevistaConfirmada?: string | null;
}

interface PaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export interface ApiResponse {
  items: Application[];
  pagination: PaginationInfo;
}

export async function getMyApplications(page: number = 1, limit: number = 10) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(
      `applications/my-postulaciones?page=${page}&limit=${limit}`
    );

    if (response.status !== 200) {
      throw new Error("Error al obtener las postulaciones");
    }

    const apiData = response.data;

    const applications: Application[] = apiData.items.map(
      (apiApp: ApiApplication) => ({
        id: apiApp.id,
        applicationDate: apiApp.fechaPostulacion,
        estadoPostulacion: apiApp.estadoPostulacion,
        propuesta: {
          titulo: apiApp.propuesta.titulo,
          descripcion: apiApp.propuesta.descripcion,
        },
        documentosPostulacion: apiApp.documentosPostulacion,
        procesosContratacion: apiApp.estadoPostulacion,
        activo: apiApp.activo,
        disponibilidadEntrevista: apiApp.disponibilidadEntrevista || null,
        disponibilidadEntrevista2: apiApp.disponibilidadEntrevista2 || null,
        disponibilidadEntrevista3: apiApp.disponibilidadEntrevista3 || null,
        fechaEntrevistaConfirmada: apiApp.fechaEntrevistaConfirmada || null,
      })
    );

    return {
      success: true,
      data: {
        items: applications,
        pagination: apiData.pagination,
      },
    };
  } catch (error) {
    console.error("Error al obtener postulaciones:", error);
    throw error;
  }
}

export async function removeMyApplication(applicationId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.delete(`admin/postulaciones/${applicationId}`);

    if (response.status !== 200) {
      throw new Error("Error al eliminar la postulación");
    }

    return {
      success: true,
      message: response.data.message || "Application removed successfully",
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error al eliminar postulación:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Error removing application",
    };
  }
}
