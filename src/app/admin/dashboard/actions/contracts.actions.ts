"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

export interface ContractData {
  nombreCompleto: string;
  correoElectronico: string;
  cedula: string;
  telefono: string;
  direccionCompleta: string;
  puestoTrabajo: string;
  descripcionServicios: string;
  ofertaSalarial: string;
  salarioProbatorio: string;
  monedaSalario: string;
  fechaInicioLabores: string;
  fechaEjecucion: string;
  nombreBanco: string;
  numeroCuenta: string;
}

export interface SendContractPayload {
  nombreCompleto: string;
  puestoTrabajo: string;
  ofertaSalarial: number;
  monedaSalario: string;
  fechaInicioLabores: Date;
  archivoBase64: string;
  nombreArchivo: string;
  urlRedirect: string;
}

export async function sendContractToSignWell(
  postulacionId: string,
  contractPayload: SendContractPayload
) {
  const axios = await createServerAxios();

  try {
    if (!postulacionId) {
      return {
        success: false,
        message: "Application ID is required",
      };
    }

    const requestUrl = `admin/contratacion/${postulacionId}/iniciar-con-signwell`;

    const response = await axios.post(requestUrl, contractPayload);

    if (response.status !== 200 && response.status !== 201) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          response.data.message || ""
        }`,
      };
    }

    const responseData = response.data;

    // Revalidate paths that might show contract status
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/dashboard/postulants");
    revalidatePath("/admin/dashboard/contracts");

    return {
      success: true,
      message: "Contract sent successfully through SignWell",
      data: responseData,
      signingUrls: responseData.data?.signingUrls || [],
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Contracts] Error in sendContractToSignWell:", error);

    // Handle specific error cases
    if (error.response?.status === 400) {
      return {
        success: false,
        message: error.response.data?.message || "Invalid request data",
      };
    }

    if (error.response?.status === 404) {
      return {
        success: false,
        message: "Application not found",
      };
    }

    if (error.response?.status === 409) {
      return {
        success: false,
        message: "Contract already exists for this application",
      };
    }

    return {
      success: false,
      message: `Error sending contract: ${error.message || error}`,
    };
  }
}

export async function getContractStatus(postulacionId: string) {
  const axios = await createServerAxios();

  try {
    if (!postulacionId) {
      return {
        success: false,
        message: "Application ID is required",
      };
    }

    const requestUrl = `admin/contratacion/${postulacionId}/estado`;

    const response = await axios.get(requestUrl);

    if (response.status !== 200) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}`,
      };
    }

    return {
      success: true,
      message: "Contract status retrieved successfully",
      data: response.data,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Contracts] Error in getContractStatus:", error);

    if (error.response?.status === 404) {
      return {
        success: false,
        message: "Contract not found",
      };
    }

    return {
      success: false,
      message: `Error getting contract status: ${error.message || error}`,
    };
  }
}
