"use server";

import { createServerAxios } from "@/services/axios.server";

export interface FinalizedEmployee {
  procesoId: string;
  nombreCompleto: string;
  puestoTrabajo: string;
  ofertaSalarial: number;
  monedaSalario: string;
  fechaInicioLabores?: string | null;
  fechaContratacion?: string | null;
  candidato: {
    id: string;
    nombre: string;
    apellido: string;
    correo: string;
    telefono?: string | null;
  };
  propuesta?: {
    id: string;
    titulo: string;
    descripcion?: string | null;
  };
}

export async function getFinalizedEmployees(
  page: number = 1,
  limit: number = 50,
  search?: string
): Promise<{
  success: boolean;
  data?: { empleados: FinalizedEmployee[] };
  error?: string;
}> {
  try {
    const axios = await createServerAxios();
    const params: Record<string, string | number> = { page, limit };
    if (search) params.search = search;
    const res = await axios.get("/admin/contratacion/empleados-activos", {
      params,
      headers: {
        "Cache-Control": "no-store",
      },
    });
    const data = res.data?.empleados ? res.data : { empleados: [] };
    return { success: true, data };
  } catch (error: any) {
    const status = error?.response?.status;
    const message =
      error?.response?.data?.message || error?.message || "Request failed";
    return {
      success: false,
      error: `HTTP ${status || ""} - ${String(message)}`,
    };
  }
}
