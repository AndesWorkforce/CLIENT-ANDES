"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T;
}

interface EnableBulkPaymentsResponse {
  evaluacionesActualizadas: number;
  evaluaciones: Array<{
    id: string;
    añoMes: string;
    candidato: string;
    email: string;
  }>;
}

export const updateObservations = async (
  evaluacionId: string,
  observaciones: string
) => {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(
      `/admin/evaluaciones-mensuales/${evaluacionId}/observaciones`,
      { observaciones }
    );

    return {
      success: true,
      data: response.data,
      message: "Observations updated successfully",
    };
  } catch (error) {
    console.error("Error updating observations:", error);
    return {
      success: false,
      error: "Failed to update observations",
    };
  }
};

export async function enableBulkPayments(
  evaluacionIds: string[]
): Promise<ApiResponse<EnableBulkPaymentsResponse>> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(`/admin/evaluaciones/habilitar-pagos`, {
      evaluacionIds,
    });

    revalidatePath("/admin/superAdmin/payments");
    return {
      success: true,
      message: "Payments enabled successfully",
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error enabling payments:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Error al habilitar pagos",
    };
  }
}

export async function resetToPending(
  procesoContratacionId: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<ApiResponse<any>> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(
      `/admin/evaluaciones/${procesoContratacionId}/reset`
    );

    revalidatePath("/admin/superAdmin/payments");
    return {
      success: true,
      message: "Evaluación reseteada exitosamente",
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error resetting evaluation:", error);
    return {
      success: false,
      error: error.response?.data?.message || "Error al resetear evaluación",
    };
  }
}
