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

    return {
      success: true,
      data: apiData,
    };
  } catch (error) {
    console.error("Error al obtener postulaciones:", error);
    throw error;
  }
}
