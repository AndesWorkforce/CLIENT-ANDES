"use server";

import { createServerAxios } from "@/services/axios.server";
import { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ApiResponse {
  success: boolean;
  message?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  error?: any;
}

interface CreateApplicantData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  contrasena?: string;
  clasificacionGlobal?: string;
  notasClasificacionGlobal?: string;
}

export async function updateCandidateStatus(
  candidateId: string,
  status: string,
  notes?: string
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    // Verificar que tenemos un ID de candidato válido
    if (!candidateId) {
      console.error("Error: No se proporcionó ID de candidato");
      return {
        success: false,
        message: "Error: ID de candidato no válido",
      };
    }

    // Asegurar que API_URL termine con /
    const baseUrl = API_URL?.endsWith("/") ? API_URL : `${API_URL}/`;
    const endpoint = `${baseUrl}usuarios/${candidateId}/clasificacion`;

    console.log("Enviando petición a:", endpoint);
    console.log("Datos:", {
      clasificacionGlobal: status.toUpperCase(),
      ...(notes && { notasClasificacionGlobal: notes }),
    });

    const response = await axios.patch(endpoint, {
      clasificacionGlobal: status.toUpperCase(),
      ...(notes && { notasClasificacionGlobal: notes }),
    });

    console.log("Respuesta:", response.status, response.data);

    return {
      success: true,
      message: "Status actualizado exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("Error updating candidate status:", error);

    if (error instanceof AxiosError) {
      // Mostrar detalles más específicos sobre el error
      console.error("Detalles del error:", {
        url: error.config?.url,
        method: error.config?.method,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
      });

      const errorMessage =
        error.response?.data?.message ||
        `Error al actualizar el status del candidato: ${error.response?.status} ${error.response?.statusText}`;

      return {
        success: false,
        message: errorMessage,
        error: error.response?.data,
      };
    }

    return {
      success: false,
      message: `Error al actualizar el status del candidato: ${error}`,
      error: error,
    };
  }
}

export async function createApplicant(
  applicantData: CreateApplicantData
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.post("auth/register", applicantData);

    if (response.status === 201 || response.status === 200) {
      return {
        success: true,
        message: "Postulante creado exitosamente",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error al crear el postulante",
        error: response.data.error,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating applicant:", error.response || error);

    // Capturar mensaje de error específico si está disponible
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error desconocido al crear el postulante";

    return {
      success: false,
      message: "Error al crear el postulante",
      error: errorMessage,
    };
  }
}

export async function removeCandidate(
  candidateId: string
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.delete(`${API_URL}usuarios/${candidateId}`);

    return {
      success: true,
      message: "Candidato eliminado exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("Error eliminando candidato:", error);

    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || "Error al eliminar el candidato";

      return {
        success: false,
        message: errorMessage,
        error: error.response?.data,
      };
    }

    return {
      success: false,
      message: "Error al eliminar el candidato",
      error: error,
    };
  }
}

export async function activateCandidate(
  candidateId: string
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(
      `${API_URL}usuarios/${candidateId}/activar`
    );

    return {
      success: true,
      message: "Candidato activado exitosamente",
      data: response.data,
    };
  } catch (error) {
    console.error("Error activando candidato:", error);

    if (error instanceof AxiosError) {
      const errorMessage =
        error.response?.data?.message || "Error al activar el candidato";

      return {
        success: false,
        message: errorMessage,
        error: error.response?.data,
      };
    }

    return {
      success: false,
      message: "Error al activar el candidato",
      error: error,
    };
  }
}
