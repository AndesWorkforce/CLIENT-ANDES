"use server";

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
  data?: CountryConfig | null;
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
  const axiosError = error as {
    code?: string;
    message?: string;
    response?: { data?: { message?: string | string[]; meta?: { message?: string } } };
  };
  const message =
    axiosError?.response?.data?.message ?? axiosError?.response?.data?.meta?.message;

  if (Array.isArray(message)) return message.join(". ");
  if (typeof message === "string" && message.trim()) return message;
  if (axiosError?.code === "ECONNABORTED") return "The request timed out. Please try again.";
  return fallback;
}

const COUNTRY_REQUEST_TIMEOUT_MS = 20_000;

export async function getCountries(): Promise<CountriesResult> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get("countries", {
      headers: { "Cache-Control": "no-store" },
      timeout: COUNTRY_REQUEST_TIMEOUT_MS,
    });
    const payload = Array.isArray(response.data?.data) ? response.data.data : [];

    return {
      success: true,
      data: payload.map((country: Record<string, unknown>) => mapCountry(country)),
    };
  } catch (error) {
    console.error(
      "[COUNTRIES] Error al obtener países:",
      getErrorMessage(error, "No se pudieron cargar los países."),
    );
    return {
      success: false,
      message: getErrorMessage(error, "No se pudieron cargar los países."),
    };
  }
}

export async function createCountry(input: CreateCountryConfigInput): Promise<CountryResult> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(
      "countries",
      {
        codigo: input.codigo.trim().toUpperCase(),
        nombre: input.nombre.trim(),
        activo: input.activo,
        tarifaHrNacional: input.tarifaHrNacional,
        diasLaboralesMes: input.diasLaboralesMes,
        tarifaFestivo: input.tarifaFestivo,
        tarifaOTDiaSemana: input.tarifaOTDiaSemana,
        tarifaOTSabado: input.tarifaOTSabado,
        tarifaOTDomingo: input.tarifaOTDomingo,
      },
      { timeout: COUNTRY_REQUEST_TIMEOUT_MS },
    );
    const created = response.data?.data;

    return {
      success: true,
      message: "País creado correctamente.",
      data: created ? mapCountry(created) : null,
    };
  } catch (error) {
    console.error(
      "[COUNTRIES] Error al crear país:",
      getErrorMessage(error, "No se pudo crear el país."),
    );
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
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(
      `countries/${encodeURIComponent(codigo)}`,
      {
        ...input,
        ...(input.nombre !== undefined ? { nombre: input.nombre.trim() } : {}),
      },
      { timeout: COUNTRY_REQUEST_TIMEOUT_MS },
    );
    const updated = response.data?.data;

    return {
      success: true,
      message: "País actualizado correctamente.",
      data: updated ? mapCountry(updated) : null,
    };
  } catch (error) {
    console.error(
      "[COUNTRIES] Error al actualizar país:",
      getErrorMessage(error, "No se pudo actualizar el país."),
    );
    return {
      success: false,
      message: getErrorMessage(error, "No se pudo actualizar el país."),
    };
  }
}
