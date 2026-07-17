"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";
import type { PayrollHolidayOption } from "../lib/payroll-holidays";

export interface GetHolidaysByCountryCodeResult extends ApiResponse {
  data?: PayrollHolidayOption[];
}

function unwrapPayload<T>(response: { data?: unknown }): T {
  const payload = response.data;
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

function mapHoliday(raw: Record<string, unknown>): PayrollHolidayOption {
  const fechaRaw = raw.fecha;
  let fecha: string | null = null;
  if (typeof fechaRaw === "string" && fechaRaw.trim()) {
    fecha = fechaRaw.slice(0, 10);
  } else if (fechaRaw instanceof Date) {
    fecha = fechaRaw.toISOString().slice(0, 10);
  }

  return {
    id: String(raw.id ?? ""),
    nombre: String(raw.nombre ?? ""),
    codigoPais: String(raw.codigoPais ?? ""),
    pais: String(raw.pais ?? ""),
    dia: Number(raw.dia) || 1,
    mes: Number(raw.mes) || 1,
    fecha,
    activo: Boolean(raw.activo),
  };
}

export async function getHolidaysByCountryCode(
  codigoPais: string,
): Promise<GetHolidaysByCountryCodeResult> {
  const code = codigoPais?.trim();
  if (!code) {
    return { success: false, message: "Código de país requerido", data: [] };
  }

  const axios = await createServerAxios();

  try {
    const response = await axios.get(
      `holidays/by-country-code/${encodeURIComponent(code)}`,
      { headers: { "Cache-Control": "no-store" } },
    );

    const items = unwrapPayload<Record<string, unknown>[]>(response);
    const data = Array.isArray(items) ? items.map(mapHoliday).filter((h) => h.id) : [];

    return {
      success: true,
      message: "Feriados obtenidos correctamente",
      data,
    };
  } catch (error) {
    console.error("[PAYROLL-HOLIDAYS] Error al listar por país:", error);
    return {
      success: false,
      message: "Error al obtener feriados del país",
      data: [],
    };
  }
}
