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
    console.log("🔄 [finalizarContrato] Iniciando finalización de contrato:", {
      procesoId,
      data,
    });

    const response = await axios.patch(
      `/admin/contratacion/${procesoId}/finalizar`,
      data
    );

    console.log("✅ [finalizarContrato] Respuesta exitosa del servidor:", {
      contractId: procesoId,
      success: response.data.success,
      message: response.data.message,
      procesoContratacion: response.data.procesoContratacion,
      postulacion: response.data.postulacion,
      candidato: response.data.candidato,
      propuesta: response.data.propuesta,
      status: response.status,
      statusText: response.statusText,
    });

    // Validar que la respuesta sea exitosa
    if (response.data.success) {
      console.log("✅ [finalizarContrato] Contrato finalizado exitosamente");
      return {
        success: true,
        message: "Contract terminated successfully",
        data: response.data,
      };
    } else {
      console.error(
        "❌ [finalizarContrato] Error en la respuesta:",
        response.data
      );
      throw new Error(response.data.message || "Error finalizing contract");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("❌ [finalizarContrato] Error finalizing contract:", {
      procesoId,
      data,
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
