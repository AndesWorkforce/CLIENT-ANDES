"use server";

import { revalidatePath } from "next/cache";
import { createServerAxios } from "@/services/axios.server";

export interface CountryConfig {
  codigo: string;
  nombre: string;
  activo: boolean;
  tarifaHrNacional: number;
  diasLaboralesMes: number;
  tarifaFestivo: number;
  tarifaOTDiaSemana: number;
  tarifaOTSabado: number;
  tarifaOTDomingo: number;
}

export interface CountryConfigInput {
  nombre: string;
  activo?: boolean;
  tarifaHrNacional: number;
  diasLaboralesMes: number;
  tarifaFestivo: number;
  tarifaOTDiaSemana: number;
  tarifaOTSabado: number;
  tarifaOTDomingo: number;
}

export interface CreateCountryConfigInput extends CountryConfigInput {
  codigo: string;
}

interface CountryResult {
  success: boolean;
  message?: string;
  data?: CountryConfig;
}

interface CountriesResult {
  success: boolean;
  message?: string;
  data?: CountryConfig[];
}

function mapCountry(payload: Record<string, unknown>): CountryConfig {
  return {
    codigo: String(payload.codigo ?? ""),
    nombre: String(payload.nombre ?? ""),
    activo: payload.activo !== false,
    tarifaHrNacional: Number(payload.tarifaHrNacional ?? 0),
    diasLaboralesMes: Number(payload.diasLaboralesMes ?? 20),
    tarifaFestivo: Number(payload.tarifaFestivo ?? 0),
    tarifaOTDiaSemana: Number(payload.tarifaOTDiaSemana ?? 0),
    tarifaOTSabado: Number(payload.tarifaOTSabado ?? 0),
    tarifaOTDomingo: Number(payload.tarifaOTDomingo ?? 0),
  };
}

function getErrorMessage(error: unknown, fallback: string): string {
  const message = (
    error as {
      response?: { data?: { message?: string | string[] } };
    }
  )?.response?.data?.message;

  if (Array.isArray(message)) return message.join(". ");
  return typeof message === "string" && message.trim() ? message : fallback;
}

export async function getCountries(): Promise<CountriesResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.get("countries", {
      headers: { "Cache-Control": "no-store" },
    });
    const payload = Array.isArray(response.data?.data) ? response.data.data : [];

    return {
      success: true,
      data: payload.map((country: Record<string, unknown>) => mapCountry(country)),
    };
  } catch (error) {
    console.error("[COUNTRIES] Error al obtener países:", error);
    return {
      success: false,
      message: getErrorMessage(error, "No se pudieron cargar los países."),
    };
  }
}

export async function createCountry(input: CreateCountryConfigInput): Promise<CountryResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.post("countries", {
      ...input,
      codigo: input.codigo.trim().toUpperCase(),
      nombre: input.nombre.trim(),
    });

    revalidatePath("/admin-hub/configuracion");
    return {
      success: true,
      message: "País creado correctamente.",
      data: response.data?.data ? mapCountry(response.data.data) : undefined,
    };
  } catch (error) {
    console.error("[COUNTRIES] Error al crear país:", error);
    return {
      success: false,
      message: getErrorMessage(error, "No se pudo crear el país."),
    };
  }
}

export async function updateCountry(
  codigo: string,
  input: Partial<CountryConfigInput>,
): Promise<CountryResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.patch(`countries/${encodeURIComponent(codigo)}`, {
      ...input,
      ...(input.nombre !== undefined ? { nombre: input.nombre.trim() } : {}),
    });

    revalidatePath("/admin-hub/configuracion");
    return {
      success: true,
      message: "País actualizado correctamente.",
      data: response.data?.data ? mapCountry(response.data.data) : undefined,
    };
  } catch (error) {
    console.error("[COUNTRIES] Error al actualizar país:", error);
    return {
      success: false,
      message: getErrorMessage(error, "No se pudo actualizar el país."),
    };
  }
}
