"use server";

import { createServerAxios } from "@/services/axios.server";
import {
  EstadoPostulacion,
  ApiResponse,
} from "../types/application-status.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Actualiza el estado de una postulación
 * @param postulacionId ID de la postulación
 * @param candidatoId ID del candidato
 * @param nuevoEstado Nuevo estado de la postulación
 * @param notasInternas Notas internas (opcional)
 * @returns Respuesta de la API
 */
export async function updateApplicationStatus(
  postulacionId: string,
  candidatoId: string,
  nuevoEstado: EstadoPostulacion,
  notasInternas?: string
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    console.log("🔄 Actualizando estado de postulación:", {
      postulacionId,
      candidatoId,
      nuevoEstado,
      notasInternas,
    });

    const baseUrl = API_URL?.endsWith("/") ? API_URL : `${API_URL}/`;
    const endpoint = `${baseUrl}admin/postulaciones/${postulacionId}/candidate/${candidatoId}/status`;

    const requestData = {
      estadoPostulacion: nuevoEstado,
      ...(notasInternas && { notasInternas }),
    };

    console.log("🚀 Enviando petición a:", endpoint);
    console.log("📦 Datos enviados:", requestData);

    const response = await axios.patch(endpoint, requestData);

    console.log("✅ Respuesta del servidor:", response.data);

    return {
      success: true,
      message: "Estado de postulación actualizado exitosamente",
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ Error al actualizar estado:", error.response || error);

    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.message ||
      "Error desconocido al actualizar el estado";

    return {
      success: false,
      message: "Error al actualizar el estado de postulación",
      error: errorMessage,
    };
  }
}
