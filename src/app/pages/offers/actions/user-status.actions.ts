"use server";

import { createServerAxios } from "@/services/axios.server";

export interface UserContractStatus {
  hasActiveContract: boolean;
  contractDetails?: {
    id: string;
    estadoContratacion: string;
    puestoTrabajo: string;
    activo: boolean;
  };
}

/**
 * Verifica si el usuario tiene un contrato activo
 */
export async function checkUserContractStatus(): Promise<{
  success: boolean;
  data?: UserContractStatus;
  error?: string;
}> {
  try {
    const axios = await createServerAxios();

    const response = await axios.get("/users/current-contract");

    const { id, estadoContratacion, puestoTrabajo, activo } = response.data;

    console.log(
      `[checkUserContractStatus] Contrato recibido | id=${id} | estadoContratacion=${estadoContratacion} | activo=${activo} | hasActiveContract=true`,
    );

    return {
      success: true,
      data: {
        hasActiveContract: true,
        contractDetails: {
          id,
          estadoContratacion,
          puestoTrabajo,
          activo,
        },
      },
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Si devuelve 404, significa que no tiene contrato activo
    if (error.response?.status === 404) {
      console.log(
        `[checkUserContractStatus] 404 recibido de /users/current-contract → hasActiveContract=false`,
      );
      return {
        success: true,
        data: {
          hasActiveContract: false,
        },
      };
    }

    console.error("Error checking user contract status:", error);

    return {
      success: false,
      error: "Error al verificar el estado del contrato del usuario",
    };
  }
}
