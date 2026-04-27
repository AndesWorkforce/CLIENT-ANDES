"use server";

import { createServerAxios } from "@/services/axios.server";

export interface CurrentContractData {
  // Campos principales del proceso de contratación
  id: string;
  postulacionId: string;
  estadoContratacion: string;
  fechaInicio: string;
  fechaFinalizacion?: string | null;

  // Datos del contrato
  nombreCompleto: string;
  puestoTrabajo: string;
  ofertaSalarial: number;
  monedaSalario: string;
  fechaInicioLabores?: string | null;

  // Campos SignWell completos
  signWellDocumentId?: string | null;
  signWellUrlCandidato?: string | null;
  signWellUrlProveedor?: string | null;
  signWellDownloadUrl?: string | null;
  documentoFirmado?: string | null;
  fechaFirmaCandidato?: string | null;
  fechaFirmaProveedor?: string | null;
  fechaFirma?: string | null;

  // Estado del contrato
  activo: boolean;

  // Campos adicionales para el frontend (compatibilidad)
  jobPosition: string;
  company: string;
  startDate: string;
  finalSalary: number;
  salaryCurrency: string;
  contractStatus: "PENDING" | "SIGNED" | "REJECTED" | "EXPIRED";
  contractUrl?: string | null;
  signatureUrl?: string | null; // URL para firmar el contrato
  jobDescription?: string;
  instructions?: string[];
  contratoFinalUrl?: string | null;

  // Datos relacionados
  postulacion?: {
    id: string;
    propuestaId: string;
    candidatoId: string;
    estadoPostulacion: string;
    fechaPostulacion: string;
  };

  propuesta?: {
    id: string;
    titulo: string;
    descripcion: string;
    requerimientos?: string | null;
    departamento?: string | null;
    seniority?: string | null;
    pais?: string | null;
    modalidad?: string | null;
  };

  empresa?: {
    id: string;
    nombre: string;
    descripcion?: string | null;
  };

  discretionaryBonusType?: string | null;
  paidHolidays?: boolean | null;

  // Documentos leídos (desde la base de datos)
  documentosLeidos?: {
    id: string;
    procesoContratacionId: string;
    seccionDocumento: string;
    porcentajeLeido: number;
    completamenteLeido: boolean;
    terminosAceptados?: boolean;
    fechaAceptacion?: string | null;
    fechaInicio: string;
    fechaUltimaUpdate: string;
    tiempoTotalLectura: number;
  }[];

  monthlyProofs?: MonthlyProof[];

  pendingAnnexes?: {
    id: string;
    title: string;
    signUrl: string;
    signToken: string;
  }[];

  signedAnnexes?: {
    id: string;
    title: string;
    viewUrl: string;
    signedAt: string;
  }[];
}

export interface MonthlyProof {
  id: string;
  procesoContratacionId: string; // ✅ Agregado para soportar múltiples contratos
  month: string;
  year: number;
  file: string;
  fileName: string;
  uploadDate: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  observacionesRevision?: string;
}

// Interface para documentos leídos
export interface DocumentoLeido {
  seccionDocumento: string;
  porcentajeLeido: number;
  tiempoLectura: number;
  completamenteLeido: boolean;
  terminosAceptados?: boolean;
}

export interface EstadoDocumentosLeidos {
  documentos: DocumentoLeido[];
  todoCompletado: boolean;
}

export async function getCurrentContract(): Promise<{
  success: boolean;
  data?: CurrentContractData;
  error?: string;
}> {
  try {
    const axios = await createServerAxios();

    const response = await axios.get("/users/current-contract");

    return {
      success: true,
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching current contract:", error);

    if (error.response?.status === 404) {
      return {
        success: false,
        error: "No se encontró un proceso de contratación activo",
      };
    }

    if (error.response?.status === 401) {
      return {
        success: false,
        error: "No tienes autorización para acceder a esta información",
      };
    }

    return {
      success: false,
      error: "Error al obtener la información del contrato",
    };
  }
}

export async function getActiveContractsForUser(userId: string): Promise<{
  success: boolean;
  data?: CurrentContractData[];
  error?: string;
}> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(`/users/${userId}/active-contracts`);
    const data = response.data?.data || response.data;
    return { success: true, data };
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || "Request failed";
    return {
      success: false,
      error: `HTTP ${status || ""} - ${String(message)}`,
    };
  }
}

export async function getUserContractById(
  userId: string,
  contractId: string
): Promise<{
  success: boolean;
  data?: CurrentContractData;
  error?: string;
}> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(
      `/users/${userId}/contracts/${contractId}`
    );
    const data = response.data?.data || response.data;
    return { success: true, data };
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || "Request failed";
    return {
      success: false,
      error: `HTTP ${status || ""} - ${String(message)}`,
    };
  }
}

/**
 * Subida de monthly proofs: solo desde `uploadMonthlyProofFromClient` (axios al API).
 * No usar Server Action con File: el POST a la página queda limitado ~1MB por el runtime de actions.
 */

/**
 * Actualiza el estado de documentos leídos en la base de datos
 */
export async function actualizarDocumentosLeidos(
  procesoContratacionId: string,
  estadoDocumentos: EstadoDocumentosLeidos
): Promise<{
  success: boolean;
  data?: {
    procesoContratacionId: string;
    estadoContratacion: string;
    documentosActualizados: number;
    todoCompletado: boolean;
    message: string;
  };
  error?: string;
}> {
  try {
    const axios = await createServerAxios();

    const response = await axios.patch(
      `/admin/contratacion/${procesoContratacionId}/documentos-leidos`,
      estadoDocumentos
    );

    return {
      success: true,
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error actualizando documentos leídos:", error);
    if (error.response?.status === 404) {
      return {
        success: false,
        error: "Proceso de contratación no encontrado",
      };
    }

    if (error.response?.status === 401) {
      return {
        success: false,
        error: "No tienes autorización para actualizar estos documentos",
      };
    }

    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Error al actualizar el estado de los documentos",
    };
  }
}

/**
 * Obtiene los documentos leídos de un proceso de contratación
 */
export async function obtenerDocumentosLeidos(
  procesoContratacionId: string
): Promise<{
  success: boolean;
  data?: {
    id: string;
    seccionDocumento: string;
    completamenteLeido: boolean;
    terminosAceptados: boolean;
    tiempoTotalLectura: number;
  }[];
  error?: string;
}> {
  try {
    const axios = await createServerAxios();

    const response = await axios.get(
      `/admin/contratacion/${procesoContratacionId}`
    );

    if (response.data?.documentos?.detalles) {
      return {
        success: true,
        data: response.data.documentos.detalles,
      };
    }

    return {
      success: true,
      data: [],
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error obteniendo documentos leídos:", error);
    return {
      success: false,
      error: "Error al obtener documentos leídos",
    };
  }
}

/**
 * Actualiza el estado de un documento específico en el proceso de contratación
 */
export async function actualizarDocumentoEspecifico(
  procesoContratacionId: string,
  seccion: string,
  datos: {
    completamenteLeido: boolean;
    terminosAceptados: boolean;
  }
): Promise<{
  success: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}> {
  try {
    const axios = await createServerAxios();
    const url = `/admin/contratacion/${procesoContratacionId}/documento/${seccion}`;

    const response = await axios.patch(url, datos);

    return {
      success: true,
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error al actualizar documento:", error);
    return {
      success: false,
      error: error.message || "Error al actualizar el documento",
    };
  }
}
