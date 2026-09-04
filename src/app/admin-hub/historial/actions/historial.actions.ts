"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";
import type { HistorialItem, HistorialModulo } from "../types/historial.types";

export interface HistorialPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetHistorialParams {
  page?: number;
  limit?: number;
  modulo?: HistorialModulo | "";
  usuario?: string;
  desde?: string;
  hasta?: string;
}

export interface GetHistorialResult extends ApiResponse {
  data?: HistorialItem[];
  pagination?: HistorialPagination;
}

function normalizePagination(
  pagination?: Partial<HistorialPagination>,
  fallbackPage = 1,
  fallbackLimit = 20,
): HistorialPagination {
  const total = pagination?.total ?? 0;
  const page = pagination?.page ?? fallbackPage;
  const limit = pagination?.limit ?? fallbackLimit;
  const totalPages =
    pagination?.totalPages ?? (limit > 0 ? Math.ceil(total / limit) : 0);

  return {
    total,
    page,
    limit,
    totalPages,
    hasPreviousPage: pagination?.hasPreviousPage ?? page > 1,
    hasNextPage: pagination?.hasNextPage ?? page < totalPages,
  };
}

export async function getHistorial(
  params: GetHistorialParams = {},
): Promise<GetHistorialResult> {
  const axios = await createServerAxios();
  const page = params.page ?? 1;
  const limit = params.limit ?? 20;

  try {
    const response = await axios.get("admin-hub/historial", {
      params: {
        page,
        limit,
        ...(params.modulo ? { modulo: params.modulo } : {}),
        ...(params.usuario?.trim() ? { usuario: params.usuario.trim() } : {}),
        ...(params.desde ? { desde: params.desde } : {}),
        ...(params.hasta ? { hasta: params.hasta } : {}),
      },
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener el historial",
      };
    }

    const payload = response.data;
    const items = Array.isArray(payload?.data)
      ? (payload.data as HistorialItem[])
      : [];

    return {
      success: true,
      message: "Historial obtenido correctamente",
      data: items,
      pagination: normalizePagination(payload?.meta?.pagination, page, limit),
    };
  } catch (error) {
    console.error("[HISTORIAL] Error al obtener historial:", error);
    return {
      success: false,
      message: "No se pudo cargar el historial de acciones",
    };
  }
}
