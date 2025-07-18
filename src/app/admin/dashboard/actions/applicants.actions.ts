"use server";

import { createServerAxios } from "@/services/axios.server";
import { sendRemovalNotification } from "./sendEmail.actions";

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
      // Enviar notificaciones de eliminación a los candidatos afectados
      if (response.data.details && response.data.details.removedApplications) {
        for (const application of response.data.details.removedApplications) {
          try {
            await sendRemovalNotification(
              application.candidateName,
              application.candidateEmail,
              application.offerName,
              "Your application has been removed from this position by the administrator."
            );
          } catch (emailError) {
            console.warn(
              `Failed to send removal notification to ${application.candidateEmail}:`,
              emailError
            );
          }
        }
      } else {
        console.warn(
          "No removedApplications data received from backend - notifications not sent"
        );
      }

      return {
        success: true,
        message: response.data.message || "Applications removed successfully",
        data: response.data.details,
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
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(
      `applications/${postulationId}/interview-preference`,
      { preferenciaEntrevista }
    );

    if (response.status === 200) {
      return {
        success: true,
        message: "Preferencia de entrevista actualizada exitosamente",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error al actualizar preferencia",
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
      error.response?.data?.message ||
      "Error al actualizar preferencia de entrevista";
    return {
      success: false,
      message: "Error updating interview preference",
      error: errorMessage,
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
        message: "Postulación desactivada exitosamente",
        data: response.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error al desactivar postulación",
        error: response.data.error,
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error deactivating application:", error.response || error);

    const errorMessage =
      error.response?.data?.message || "Error al desactivar postulación";
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
        message: "Postulaciones obtenidas exitosamente",
        data: response.data.data,
      };
    } else {
      return {
        success: false,
        message: response.data.message || "Error al obtener postulaciones",
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
      error.response?.data?.message || "Error al obtener postulaciones";
    return {
      success: false,
      message: "Error getting candidate applications",
      error: errorMessage,
    };
  }
}
