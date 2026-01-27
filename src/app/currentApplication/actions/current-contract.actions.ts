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

export async function uploadMonthlyProof(
  contratoId: string,
  month: string,
  year: number,
  file: File
): Promise<{
  success: boolean;
  data?: { id: string; file: string };
  error?: string;
}> {
  try {
    const axios = await createServerAxios();

    // Detectar tipo de archivo y subir como PDF o Imagen
    const mime = (file as any).type ? String((file as any).type) : "";
    const name = (file as any).name ? String((file as any).name) : "";
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const isPdf = mime === "application/pdf" || ext === "pdf";
    const isImage =
      mime.startsWith("image/") ||
      ["jpg", "jpeg", "png", "webp", "gif", "heic"].includes(ext);

    let fileUrl: string = "";
    if (isPdf) {
      const formData = new FormData();
      formData.append("pdf", file);
      const fileResponse = await axios.post("/files/upload/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      fileUrl = fileResponse.data;
    } else if (isImage) {
      const typeSlug = (() => {
        if (mime.startsWith("image/")) return mime.split("/")[1].toLowerCase();
        if (ext === "jpg") return "jpeg";
        return ext || "jpeg";
      })();
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "monthly-proofs");
      const fileResponse = await axios.post(
        `/files/upload/image/${typeSlug}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );
      fileUrl = fileResponse.data;
    } else {
      return {
        success: false,
        error: "Tipo de archivo no soportado. Sube un PDF o una imagen.",
      };
    }

    // Crear cadena añoMes en formato YYYY-MM (mes con 2 dígitos)
    const monthIndex = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(month);

    const paddedMonth = String(monthIndex + 1).padStart(2, "0");
    const añoMes = `${year}-${paddedMonth}`;

    const evaluationResponse = await axios.post(
      `/users/contratos/${contratoId}/evaluaciones-mensuales`,
      {
        añoMes,
        documentoSubido: fileUrl,
        fechaSubidaDocumento: new Date().toISOString(),
      }
    );

    // ✅ CORREGIDO: Acceder correctamente a la respuesta del backend
    // El backend devuelve { success: true, data: { id: "...", ... } }
    const responseData = evaluationResponse.data?.data || evaluationResponse.data;
    
    return {
      success: true,
      data: {
        id: responseData?.id,
        file: fileUrl,
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error uploading monthly proof:", error);

    return {
      success: false,
      error: error.response?.data?.message || "Error al subir el archivo",
    };
  }
}

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
