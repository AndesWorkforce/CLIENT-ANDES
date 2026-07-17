"use server";

import { revalidatePath } from "next/cache";
import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";
import type { JornadaLaboral } from "../data/mock-contracts";
import type { ContractStatusLabel } from "../data/contract-display";
import type { ContratoDetail } from "../types/contrato-detail.types";

export interface ContratoListItem {
  id: string;
  usuarioId: string;
  nombreCompleto: string;
  puestoTrabajo: string;
  empresaNombre: string;
  tipoJornada: JornadaLaboral | null;
  paisCodigo: string | null;
  paisFacturacionCodigo: string | null;
  paisNombre: string;
  metodoPago: string;
  activo: boolean;
}

export interface ContratosPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetContratosParams {
  page?: number;
  limit?: number;
  search?: string;
  cliente?: string;
  pais?: string;
  puesto?: string;
  tipoJornada?: JornadaLaboral;
  estado?: ContractStatusLabel;
}

export interface GetContratosResult extends ApiResponse {
  data?: ContratoListItem[];
  pagination?: ContratosPagination;
}

export interface GetContratoByIdResult extends ApiResponse {
  data?: ContratoDetail;
}

export interface UpdateContratoInput {
  nombreCompleto?: string;
  correo?: string;
  telefono?: string;
  documentoIdentidad?: string;
  fechaNacimiento?: string;
  paisNombre?: string;
  paisCodigo?: string;
  estadoResidencia?: string;
  ciudadResidencia?: string;
  direccionResidencia?: string;
  ofertaSalarial?: number;
  monedaSalario?: string;
  paisFacturacion?: string;
  metodoPago?: string;
  dollarTag?: string | null;
  bancoNombre?: string | null;
  numeroCuentaBancaria?: string | null;
  numeroCuentaFacturacion?: string | null;
}

export interface UpdateContratoResult extends ApiResponse {
  data?: ContratoDetail;
}

function extractErrorMessage(error: unknown): string {
  if (
    typeof error === "object" &&
    error !== null &&
    "response" in error &&
    typeof (error as { response?: { data?: { message?: string | string[] } } }).response?.data
      ?.message !== "undefined"
  ) {
    const message = (error as { response?: { data?: { message?: string | string[] } } }).response
      ?.data?.message;
    if (Array.isArray(message)) {
      return message.join(". ");
    }
    if (typeof message === "string" && message.trim()) {
      return message;
    }
  }

  return "Error al procesar la solicitud";
}

function normalizePagination(
  pagination?: Partial<ContratosPagination>,
  fallbackPage = 1,
  fallbackLimit = 20,
): ContratosPagination {
  const total = pagination?.total ?? 0;
  const page = pagination?.page ?? fallbackPage;
  const limit = pagination?.limit ?? fallbackLimit;
  const totalPages = pagination?.totalPages ?? (limit > 0 ? Math.ceil(total / limit) : 0);

  return {
    total,
    page,
    limit,
    totalPages,
    hasPreviousPage: pagination?.hasPreviousPage ?? page > 1,
    hasNextPage: pagination?.hasNextPage ?? page < totalPages,
  };
}

export async function getContratos(
  params: GetContratosParams = {},
): Promise<GetContratosResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.get("admin-hub/contratos", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.cliente?.trim() ? { cliente: params.cliente.trim() } : {}),
        ...(params.pais?.trim() ? { pais: params.pais.trim() } : {}),
        ...(params.puesto?.trim() ? { puesto: params.puesto.trim() } : {}),
        ...(params.tipoJornada ? { tipoJornada: params.tipoJornada } : {}),
        ...(params.estado ? { estado: params.estado } : {}),
      },
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener contratos",
      };
    }

    const payload = response.data;
    const items = Array.isArray(payload?.data) ? payload.data : [];
    const pagination = normalizePagination(
      payload?.meta?.pagination,
      params.page ?? 1,
      params.limit ?? 20,
    );

    return {
      success: true,
      message: "Contratos obtenidos correctamente",
      data: items,
      pagination,
    };
  } catch (error) {
    console.error("[CONTRATOS] Error al obtener contratos:", error);
    return {
      success: false,
      message: "Error al obtener contratos",
    };
  }
}

export async function getContratoById(
  contractId: string,
): Promise<GetContratoByIdResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.get(`admin-hub/contratos/${contractId}`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200 || !response.data?.data) {
      return {
        success: false,
        message: "Error al obtener el detalle del contrato",
      };
    }

    return {
      success: true,
      message: "Contrato obtenido correctamente",
      data: response.data.data as ContratoDetail,
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      return {
        success: false,
        message: "Contrato no encontrado",
      };
    }

    console.error("[CONTRATOS] Error al obtener detalle:", error);
    return {
      success: false,
      message: "Error al obtener el detalle del contrato",
    };
  }
}

export async function updateContrato(
  contractId: string,
  input: UpdateContratoInput,
): Promise<UpdateContratoResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.patch(`admin-hub/contratos/${contractId}`, input);

    if (response.status !== 200 || !response.data?.data) {
      return {
        success: false,
        message: "Error al actualizar el contrato",
      };
    }

    revalidatePath(`/admin-hub/contratos/${contractId}`);
    revalidatePath("/admin-hub/contratos");

    return {
      success: true,
      message: "Contrato actualizado correctamente",
      data: response.data.data as ContratoDetail,
    };
  } catch (error: unknown) {
    console.error("[CONTRATOS] Error al actualizar contrato:", error);
    return {
      success: false,
      message: extractErrorMessage(error),
    };
  }
}
