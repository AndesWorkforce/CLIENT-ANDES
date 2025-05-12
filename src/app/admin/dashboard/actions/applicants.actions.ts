"use server";

import { createServerAxios } from "@/services/axios.server";

interface CreateApplicantData {
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  contrasena: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
  error?: string;
}

/**
 * Crea un nuevo postulante desde el panel de administración
 * @param applicantData Datos del postulante a crear
 * @returns Respuesta de la API
 */
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

export async function candidateValidationProfile(candidateId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(
      `applications/validate-candidate/${candidateId}`
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error fetching profile status",
      };
    }

    const data = await response.data;

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error fetching profile status:", error);
    return {
      success: false,
      message: "Error fetching profile status",
    };
  }
}
