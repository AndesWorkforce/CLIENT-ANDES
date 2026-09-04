"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";

const PERIODO_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface PtoDia {
  diaLibreId: string;
  fechaInicio: string;
  fechaFin: string;
  modo: "por_dias_laborables" | "por_horas";
  diasLaborables: number;
  horasAusencia: number | null;
  tarifaAplicada: number;
  montoNomina: number;
  notas: string | null;
}

export interface PtoContratista {
  procesoContratacionId: string;
  nombreCompleto: string;
  puestoTrabajo: string;
  empresaNombre: string;
  paisFacturacion: string;
  totalDiasLaborables: number;
  totalHorasAusencia: number;
  totalDescuentoNomina: number;
  totalDescuentoFactura: number;
  dias: PtoDia[];
}

export interface PtosReport {
  periodo: string;
  cantidadContratistas: number;
  totalDiasLaborables: number;
  totalHorasAusencia: number;
  totalDescuentoNomina: number;
  totalDescuentoFactura: number;
  contratistas: PtoContratista[];
}

export interface GetPtosReportResult extends ApiResponse {
  data?: PtosReport;
}

/**
 * Reporte de PTOs aplicados en un período, agrupado por contratista.
 * Muestra el impacto tanto en la nómina del contratista como en la factura al cliente.
 */
export async function getPtosReport(params: {
  periodo: string;
  empresaId?: string;
  search?: string;
}): Promise<GetPtosReportResult> {
  if (!PERIODO_REGEX.test(params.periodo?.trim() ?? "")) {
    return { success: false, message: "El período debe tener formato YYYY-MM" };
  }

  const axios = await createServerAxios();

  try {
    const response = await axios.get("days-off/reporte-ptos", {
      params: {
        periodo: params.periodo.trim(),
        ...(params.empresaId ? { empresaId: params.empresaId } : {}),
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
      },
      headers: { "Cache-Control": "no-store" },
    });

    const payload = response.data?.data ?? response.data;
    if (!payload) {
      return { success: false, message: "Respuesta vacía del reporte de PTOs" };
    }

    return {
      success: true,
      message: "Reporte obtenido correctamente",
      data: payload as PtosReport,
    };
  } catch (error: unknown) {
    console.error("[PTOS] Error al obtener el reporte:", error);
    return { success: false, message: "Error al obtener el reporte de PTOs" };
  }
}
