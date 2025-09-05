"use server";

import { createServerAxios } from "@/services/axios.server";
import { GetContractsResponse } from "../interfaces/contracts.interface";

export async function getContracts(
  page: number,
  limit: number,
  searchQuery: string
): Promise<GetContractsResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get("/users/postulantes-con-contrato", {
      params: {
        page,
        limit,
        search: searchQuery,
      },
      headers: {
        "Cache-Control":
          "no-store, no-cache, must-revalidate, proxy-revalidate",
        Pragma: "no-cache",
        Expires: "0",
      },
    });

    const { total, resultados } = response.data;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const transformedResults = resultados.map((r: any) => ({
      ...r.procesoContratacion,
      documentosLeidos: r.procesoContratacion.documentosLeidos || [],
      paymentHistory: [],
    }));

    return {
      success: true,
      data: {
        resultados: transformedResults,
        total,
      },
      totalPages: Math.ceil(total / limit),
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching contracts:", error);
    return {
      success: false,
      data: {
        resultados: [],
        total: 0,
      },
      totalPages: 1,
    };
  }
}

export async function getEvaluacionesMensuales(contratoId: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(
      `/users/contratos/${contratoId}/evaluaciones-mensuales`
    );

    return {
      success: true,
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error fetching monthly evaluations:", error);
    return {
      success: false,
      message:
        error.response?.data?.message ||
        "Error al obtener evaluaciones mensuales",
    };
  }
}

export async function createEvaluacionMensual(
  contratoId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  evaluacionData: any
) {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(
      `/users/contratos/${contratoId}/evaluaciones-mensuales`,
      evaluacionData
    );

    return {
      success: true,
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error creating monthly evaluation:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error al crear evaluación mensual",
    };
  }
}

export async function updateRevisionEvaluacion(
  evaluacionId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  revisionData: any
) {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(
      `/users/evaluaciones-mensuales/${evaluacionId}/revision`,
      revisionData
    );

    return {
      success: true,
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error updating evaluation revision:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al actualizar revisión",
    };
  }
}

interface FinalizarContratoData {
  motivo?: string;
  observaciones?: string;
}

export const finalizarContrato = async (
  procesoId: string,
  data: FinalizarContratoData
) => {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(
      `/admin/contratacion/${procesoId}/finalizar`,
      data
    );

    // El backend responde con HTTP 200 y estructura: { data: { success: true, ... }, meta: { ... } }
    if (response.status === 200) {
      return {
        success: true,
        message:
          response.data?.data?.message || "Contract terminated successfully",
        data: response.data?.data || response.data,
      };
    } else {
      throw new Error(
        response.data?.data?.message ||
          response.data?.message ||
          "Error finalizing contract"
      );
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ [finalizarContrato] Error:", {
      procesoId,
      error: error.response?.data || error.message,
      status: error.response?.status,
    });

    throw new Error(
      error.response?.data?.message ||
        error.message ||
        "Error finalizing contract"
    );
  }
};

// Nueva función para cargar contrato final al S3
export const uploadFinalContract = async (
  procesoId: string,
  file: File
): Promise<{ success: boolean; message: string; contractUrl?: string }> => {
  const axios = await createServerAxios();
  try {
    const formData = new FormData();
    formData.append("contrato", file);

    const response = await axios.post(
      `/admin/contratacion/${procesoId}/upload-contrato-final`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    if (response.status === 200 || response.status === 201) {
      return {
        success: true,
        message: "Contract uploaded successfully",
        contractUrl:
          response.data?.data?.contractUrl || response.data?.contractUrl,
      };
    } else {
      throw new Error("Error uploading contract");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ [uploadFinalContract] Error:", {
      procesoId,
      error: error.response?.data || error.message,
      status: error.response?.status,
    });

    return {
      success: false,
      message:
        error.response?.data?.message ||
        error.message ||
        "Error uploading contract",
    };
  }
};

export async function cancelarContrato(
  procesoId: string,
  cancelacionData: {
    motivo: string;
    observaciones?: string;
  }
): Promise<{ success: boolean; message: string; data?: unknown }> {
  try {
    const axios = await createServerAxios();

    console.log("🚫 [cancelarContrato] Starting cancellation:", {
      procesoId,
      motivo: cancelacionData.motivo,
    });

    const response = await axios.post(
      `/admin/contratos/${procesoId}/cancelar`,
      cancelacionData
    );

    console.log("✅ [cancelarContrato] Success:", {
      status: response.status,
      data: response.data,
    });

    if (response.status === 200) {
      return {
        success: true,
        message: response.data?.message || "Contract cancelled successfully",
        data: response.data,
      };
    } else {
      throw new Error(response.data?.message || "Error cancelling contract");
    }
  } catch (error: unknown) {
    console.error("❌ [cancelarContrato] Error:", {
      procesoId,
      error: error instanceof Error ? error.message : "Unknown error",
      status:
        error && typeof error === "object" && "response" in error
          ? (error as { response?: { status?: number } }).response?.status
          : undefined,
    });

    throw new Error(
      error && typeof error === "object" && "response" in error
        ? (error as { response?: { data?: { message?: string } } }).response
            ?.data?.message ||
          (error instanceof Error ? error.message : "Unknown error") ||
          "Error cancelling contract"
        : error instanceof Error
        ? error.message
        : "Error cancelling contract"
    );
  }
}
