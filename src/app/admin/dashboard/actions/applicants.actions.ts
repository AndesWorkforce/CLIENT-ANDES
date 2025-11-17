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
        message: "Applicant created successfully",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error creating applicant",
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
      "Unknown error creating applicant";

    return {
      success: false,
      message: "Error creating applicant",
      error: errorMessage,
    };
  }
}

export async function candidateValidationProfile(candidateId: string) {
  const axios = await createServerAxios();

  if (!candidateId) {
    return {
      success: false,
      message: "Candidate ID is required",
    };
  }

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

/**
 * Elimina múltiples postulaciones desde el panel de administración
 * @param postulationIds Array de IDs de las postulaciones a eliminar
 * @returns Respuesta de la API
 */
export async function removeMultipleApplications(
  postulationIds: string[]
): Promise<ApiResponse> {
  const axios = await createServerAxios();

  try {
    if (!postulationIds || postulationIds.length === 0) {
      return {
        success: false,
        message: "No applications selected for removal",
        error: "postulationIds array is empty",
      };
    }

    const response = await axios.delete("admin/postulaciones", {
      data: { postulacionIds: postulationIds },
    });

    if (response.status === 200) {
      return {
        success: true,
        message: response.data.message || "Applications removed successfully",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error removing applications",
        error: response.data.error,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error removing applications:", error.response || error);

    // Capturar mensaje de error específico si está disponible
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Unknown error removing applications";

    return {
      success: false,
      message: "Error removing applications",
      error: errorMessage,
    };
  }
}

/**
 * Actualiza la preferencia de entrevista para una postulación
 * @param postulationId ID de la postulación
 * @param preferenciaEntrevista Si la empresa quiere entrevista o no
 * @returns Respuesta de la API
 */
export async function updateInterviewPreference(
  postulationId: string,
  preferenciaEntrevista: boolean
): Promise<ApiResponse> {
  console.log(
    `🔍 Sending: ${preferenciaEntrevista} (${typeof preferenciaEntrevista})`
  );

  const axios = await createServerAxios();
  try {
    const response = await axios.patch(
      `applications/${postulationId}/interview-preference`,
      { preferenciaEntrevista }
    );

    console.log(`✅ Backend response:`, response.data);

    if (response.status === 200) {
      return {
        success: true,
        message: "Interview preference updated successfully",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error updating preference",
        error: response.data.error,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "Error updating interview preference:",
      error.response || error
    );

    const errorMessage =
      error.response?.data?.message || "Error updating interview preference";
    return {
      success: false,
      message: "Error updating interview preference",
      error: errorMessage,
    };
  }
}

/**
 * Actualiza (o crea) la disponibilidad/fecha propuesta para la entrevista
 * y dispara la notificación en tiempo real en el backend.
 * @param postulationId ID de la postulación
 * @param availabilityISO Fecha/hora propuesta en formato ISO 8601
 */
export async function updateInterviewAvailability(
  postulationId: string,
  availabilityISO: string
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(
      `applications/${postulationId}/interview-availability`,
      {
        disponibilidadEntrevista: availabilityISO,
        notify: true,
      }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: "Interview availability saved successfully",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message:
          response.data?.message || "Error saving interview availability",
        error: response.data?.error,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "Error updating interview availability:",
      error.response || error
    );

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error saving interview availability";

    return {
      success: false,
      message: "Error updating interview availability",
      error: errorMessage,
    };
  }
}

/**
 * Obtiene la disponibilidad/fecha propuesta para la entrevista de una postulación
 * @param postulationId ID de la postulación
 */
export async function getInterviewAvailability(
  postulationId: string
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(
      `applications/${postulationId}/interview-availability`
    );

    if (response.status === 200) {
      return {
        success: true,
        message: "Interview availability retrieved",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message:
          response.data?.message || "Error retrieving interview availability",
        error: response.data?.error,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "Error getting interview availability:",
      error.response || error
    );
    return {
      success: false,
      message: "Error getting interview availability",
      error:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message,
    };
  }
}

/**
 * Desactiva una postulación específica
 * @param postulationId ID de la postulación a desactivar
 * @returns Respuesta de la API
 */
export async function deactivateApplication(
  postulationId: string
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(
      `applications/${postulationId}/deactivate`
    );

    if (response.status === 200) {
      return {
        success: true,
        message: "Application deactivated successfully",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error deactivating application",
        error: response.data.error,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deactivating application:", error.response || error);

    const errorMessage =
      error.response?.data?.message || "Error deactivating application";
    return {
      success: false,
      message: "Error deactivating application",
      error: errorMessage,
    };
  }
}

/**
 * Obtiene todas las postulaciones de un candidato específico
 * @param candidateId ID del candidato
 * @returns Respuesta de la API con las postulaciones
 */
export async function getCandidateApplications(
  candidateId: string
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(`users/${candidateId}/applications`);

    if (response.status === 200) {
      return {
        success: true,
        message: "Applications retrieved successfully",
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error retrieving applications",
        error: response.data.error,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(
      "Error getting candidate applications:",
      error.response || error
    );

    const errorMessage =
      error.response?.data?.message || "Error retrieving applications";
    return {
      success: false,
      message: "Error getting candidate applications",
      error: errorMessage,
    };
  }
}
