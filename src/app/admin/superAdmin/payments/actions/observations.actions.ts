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

export async function updateBonusAndHolidays(
  procesoContratacionId: string,
  discretionaryBonusType: string | null,
  paidHolidays: boolean | null
): Promise<
  ApiResponse<{
    id: string;
    discretionaryBonusType: string | null;
    paidHolidays: boolean | null;
  }>
> {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(
      `/admin/monthly-payments/contracts/${procesoContratacionId}/bonus-holidays`,
      {
        discretionaryBonusType,
        paidHolidays,
      }
    );

    revalidatePath("/admin/superAdmin/payments");

    return {
      success: true,
      message: "Bonus and holidays updated successfully",
      data: response.data,
    };
  } catch (error: any) {
    console.error("Error updating bonus/holidays:", error);
    return {
      success: false,
      error:
        error.response?.data?.message ||
        "Failed to update discretionary bonus / holidays",
    };
  }
}

export async function enableBulkPayments(
  evaluacionIds: string[],
  procesoContratacionIds?: string[]
): Promise<ApiResponse<EnableBulkPaymentsResponse>> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(`/admin/evaluaciones/habilitar-pagos`, {
      evaluacionIds,
      procesoContratacionIds: procesoContratacionIds || [],
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

// Obtener inboxes del usuario (paginado)
export async function getUserInboxes(
  usuarioId: string,
  limit = 10
): Promise<ApiResponse<Array<any>>> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(`/users/${usuarioId}/inboxes`, {
      params: { limit },
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching user inboxes:", error);
    return { success: false, error: "Failed to fetch user inboxes" };
  }
}

// Obtener presencia de inbox en lote para procesos en un año-mes
export async function getInboxesPresenceBulk(
  procesoContratacionIds: string[],
  anioMes?: string
): Promise<
  ApiResponse<
    Array<{ id: string; procesoContratacionId: string; añoMes: string }>
  >
> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(`/admin/inboxes/presence`, {
      procesoContratacionIds,
      anioMes,
    });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error fetching inbox presence in bulk:", error);
    return { success: false, error: "Failed to fetch inbox presence" };
  }
}
