"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

interface ApiResponse {
  success: boolean;
  message: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  data?: any;
}

export async function hireApplicant(
  postulationId: string
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(`applications/${postulationId}/status`, {
      estadoPostulacion: "ACEPTADA",
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      };
    }

    revalidatePath("/companies/dashboard");

    return {
      success: true,
      message: "Candidato contratado exitosamente",
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Companies] Error hiring applicant:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al contratar candidato",
    };
  }
}

export async function rejectApplicant(
  postulationId: string
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(`applications/${postulationId}/status`, {
      estadoPostulacion: "RECHAZADA",
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      };
    }

    revalidatePath("/companies/dashboard");

    return {
      success: true,
      message: "Candidato rechazado exitosamente",
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Companies] Error rejecting applicant:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al rechazar candidato",
    };
  }
}
