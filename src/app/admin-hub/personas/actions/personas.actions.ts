"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/interfaces/api.interface";
import type {
  ContractorPersonaProfile,
  PersonaDetail,
  PersonaStatus,
} from "../types/persona-detail.types";

export interface PersonaContrato {
  id: string;
  position: string;
  client: string;
  clientId: string | null;
  baseSalary: number;
  clientPrice: number | null;
  contractStartDate: string | null;
  activo: boolean;
}

export interface PersonaListItem {
  id: string;
  name: string;
  countryCode: string | null;
  countryName: string;
  status: PersonaStatus;
  contracts: PersonaContrato[];
}

export interface PersonasPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetPersonasParams {
  page?: number;
  limit?: number;
  search?: string;
  pais?: string;
  cliente?: string;
  puesto?: string;
  estado?: PersonaStatus;
}

export interface GetPersonasResult extends ApiResponse {
  data?: PersonaListItem[];
  pagination?: PersonasPagination;
}

export interface GetPersonaByIdResult extends ApiResponse {
  data?: PersonaDetail;
}

export interface UpdatePersonaInput {
  name?: string;
  personalEmail?: string;
  workEmail?: string;
  phone?: string;
  documentNumber?: string;
  birthDate?: string;
  nationality?: string;
  country?: string;
  state?: string;
  city?: string;
  street?: string;
  streetNumber?: string;
  postalCode?: string;
  contractType?: string;
  contractStartDate?: string;
  position?: string;
  baseSalary?: number;
  currency?: string;
  billingCountry?: string;
  paymentMethod?: string;
  dollarTag?: string;
  personalBank?: string;
  personalAccountNumber?: string;
  billingBankName?: string;
  billingAccountNumber?: string;
  status?: PersonaStatus;
  howDidYouHear?: string;
  wasReferred?: "Si" | "No";
  referredBy?: string;
  notes?: string;
  ipbBalance?: string;
}

export interface UpdatePersonaResult extends ApiResponse {
  data?: PersonaDetail;
}

function normalizePagination(
  pagination?: Partial<PersonasPagination>,
  fallbackPage = 1,
  fallbackLimit = 20,
): PersonasPagination {
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

function mapApiPersonaDetail(payload: {
  id: string;
  name: string;
  countryName: string;
  contractCode: string;
  primaryContract: PersonaContrato;
  profile: ContractorPersonaProfile;
}): PersonaDetail {
  return {
    id: payload.id,
    name: payload.name,
    countryName: payload.countryName,
    contractCode: payload.contractCode,
    primaryContract: {
      id: payload.primaryContract.id,
      position: payload.primaryContract.position,
      client: payload.primaryContract.client,
      baseSalary: payload.primaryContract.baseSalary,
      clientPrice: payload.primaryContract.clientPrice ?? 0,
      contractStartDate: payload.primaryContract.contractStartDate ?? "",
    },
    profile: payload.profile,
  };
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

export async function getPersonas(
  params: GetPersonasParams = {},
): Promise<GetPersonasResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.get("admin-hub/personas", {
      params: {
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.pais?.trim() ? { pais: params.pais.trim() } : {}),
        ...(params.cliente?.trim() ? { cliente: params.cliente.trim() } : {}),
        ...(params.puesto?.trim() ? { puesto: params.puesto.trim() } : {}),
        ...(params.estado ? { estado: params.estado } : {}),
      },
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener contratistas",
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
      message: "Contratistas obtenidos correctamente",
      data: items,
      pagination,
    };
  } catch (error) {
    console.error("[PERSONAS] Error al obtener contratistas:", error);
    return {
      success: false,
      message: "Error al obtener contratistas",
    };
  }
}

export async function getPersonaById(personaId: string): Promise<GetPersonaByIdResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.get(`admin-hub/personas/${personaId}`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200 || !response.data?.data) {
      return {
        success: false,
        message: "Error al obtener el detalle del contratista",
      };
    }

    return {
      success: true,
      message: "Contratista obtenido correctamente",
      data: mapApiPersonaDetail(response.data.data),
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      return {
        success: false,
        message: "Contratista no encontrado",
      };
    }

    console.error("[PERSONAS] Error al obtener detalle:", error);
    return {
      success: false,
      message: extractErrorMessage(error),
    };
  }
}

export async function updatePersona(
  personaId: string,
  input: UpdatePersonaInput,
): Promise<UpdatePersonaResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.patch(`admin-hub/personas/${personaId}`, input);

    if (response.status !== 200 || !response.data?.data) {
      return {
        success: false,
        message: "Error al actualizar el contratista",
      };
    }

    revalidatePath(`/admin-hub/personas/${personaId}`);
    revalidatePath("/admin-hub/personas");

    return {
      success: true,
      message: "Contratista actualizado correctamente",
      data: mapApiPersonaDetail(response.data.data),
    };
  } catch (error: unknown) {
    console.error("[PERSONAS] Error al actualizar contratista:", error);
    return {
      success: false,
      message: extractErrorMessage(error),
    };
  }
}
