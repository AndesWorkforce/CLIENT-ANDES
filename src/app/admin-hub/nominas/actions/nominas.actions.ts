"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";
import type {
  PayrollInvoiceStatus,
  PayrollProofStatus,
  PayrollRow,
} from "../data/payroll-data";
import type { PayrollVariableStatus } from "../data/mock-payroll-variables";
import type {
  NominaDetailApiResponse,
  PayrollDetail,
  PayrollPayslipDocument,
} from "../types/nomina-detail.types";

export interface NominaListItem {
  procesoContratacionId: string;
  usuarioId: string;
  nombreCompleto: string;
  puestoTrabajo: string;
  empresaNombre: string;
  periodo: string;
  periodoAnioMes: string;
  totalAmount: number;
  invoice: Exclude<PayrollInvoiceStatus, null>;
  proof: Exclude<PayrollProofStatus, null>;
  estado: PayrollVariableStatus;
  paisNombre: string;
  inboxId?: string | null;
  evaluacionId?: string | null;
  proofUrl?: string | null;
}

export interface NominasPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetNominasParams {
  periodo: string;
  page?: number;
  limit?: number;
  search?: string;
  cliente?: string;
  estado?: PayrollVariableStatus;
}

export interface GetNominasResult extends ApiResponse {
  data?: PayrollRow[];
  pagination?: NominasPagination;
}

function normalizePagination(
  pagination?: Partial<NominasPagination>,
  fallbackPage = 1,
  fallbackLimit = 20,
): NominasPagination {
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

function mapNominaListItemToPayrollRow(item: NominaListItem): PayrollRow {
  return {
    id: item.procesoContratacionId,
    contractorId: item.usuarioId,
    contractId: item.procesoContratacionId,
    contractorName: item.nombreCompleto,
    position: item.puestoTrabajo,
    client: item.empresaNombre,
    period: item.periodo,
    periodoAnioMes: item.periodoAnioMes,
    baseSalary: item.totalAmount,
    clientPrice: 0,
    variableAmount: 0,
    totalAmount: item.totalAmount,
    invoice: item.invoice,
    proof: item.proof,
    status: item.estado,
  };
}

export async function getNominas(
  params: GetNominasParams,
): Promise<GetNominasResult> {
  const axios = await createServerAxios();
  const periodo = params.periodo?.trim();

  if (!periodo || !/^\d{4}-(0[1-9]|1[0-2])$/.test(periodo)) {
    return {
      success: false,
      message: "El período debe tener formato YYYY-MM",
    };
  }

  try {
    const response = await axios.get("admin-hub/nominas", {
      params: {
        periodo,
        page: params.page ?? 1,
        limit: params.limit ?? 20,
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.cliente?.trim() ? { cliente: params.cliente.trim() } : {}),
        ...(params.estado ? { estado: params.estado } : {}),
      },
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener nóminas",
      };
    }

    const payload = response.data;
    const items = Array.isArray(payload?.data)
      ? (payload.data as NominaListItem[]).map(mapNominaListItemToPayrollRow)
      : [];
    const pagination = normalizePagination(
      payload?.meta?.pagination,
      params.page ?? 1,
      params.limit ?? 20,
    );

    return {
      success: true,
      message: "Nóminas obtenidas correctamente",
      data: items,
      pagination,
    };
  } catch (error) {
    console.error("[NOMINAS] Error al obtener nóminas:", error);
    return {
      success: false,
      message: "Error al obtener nóminas",
    };
  }
}

export interface ApproveNominasBulkResultItem {
  procesoContratacionId: string;
  success: boolean;
  message: string;
}

export interface ApproveNominasBulkResult extends ApiResponse {
  results?: ApproveNominasBulkResultItem[];
}

export async function approveNominasBulk(params: {
  periodo: string;
  procesoContratacionIds: string[];
}): Promise<ApproveNominasBulkResult> {
  const axios = await createServerAxios();
  const periodo = params.periodo?.trim();

  if (!periodo || !/^\d{4}-(0[1-9]|1[0-2])$/.test(periodo)) {
    return {
      success: false,
      message: "El período debe tener formato YYYY-MM",
    };
  }

  if (!params.procesoContratacionIds.length) {
    return {
      success: false,
      message: "Selecciona al menos una nómina",
    };
  }

  try {
    const response = await axios.post("admin-hub/nominas/aprobar-masivo", {
      periodo,
      procesoContratacionIds: params.procesoContratacionIds,
    });

    const payload = response.data?.data ?? response.data;
    const results = Array.isArray(payload?.results)
      ? (payload.results as ApproveNominasBulkResultItem[])
      : [];

    const failed = results.filter((item) => !item.success).length;
    const approved = results.length - failed;

    return {
      success: failed === 0,
      message:
        failed === 0
          ? `${approved} nómina(s) aprobada(s)`
          : `${approved} aprobada(s), ${failed} con error`,
      results,
    };
  } catch (error) {
    console.error("[NOMINAS] Error al aprobar masivo:", error);
    const message = (
      error as { response?: { data?: { message?: string | string[] } } }
    ).response?.data?.message;
    return {
      success: false,
      message: Array.isArray(message)
        ? message.join(", ")
        : typeof message === "string" && message.trim()
          ? message
          : "Error al aprobar nóminas",
    };
  }
}

function mapNominaDetailToPayrollDetail(detail: NominaDetailApiResponse): PayrollDetail {
  return {
    id: detail.id,
    contractorId: detail.usuarioId,
    contractId: detail.id,
    contractorName: detail.nombreCompleto,
    client: detail.empresaNombre,
    position: detail.puestoTrabajo,
    country: detail.paisNombre,
    contractStartDate: detail.fechaInicioContrato,
    contractEndDate: detail.fechaFinContrato,
    contactEmail: detail.correo,
    period: detail.periodo,
    periodoAnioMes: detail.periodoAnioMes,
    status: detail.estado,
    notes: detail.notes,
    baseSalary: detail.ofertaSalarial,
    tipoJornada: detail.tipoJornada ?? null,
    esHourly: detail.esHourly ?? detail.tipoJornada === "HOURLY_TIME",
    horasTrabajadas:
      detail.horasTrabajadas != null ? Number(detail.horasTrabajadas) : null,
    tarifaHoraria:
      detail.tarifaHoraria != null
        ? Number(detail.tarifaHoraria)
        : detail.tipoJornada === "HOURLY_TIME"
          ? Number(detail.ofertaSalarial)
          : null,
    earnings: detail.earnings,
    deductions: detail.deductions,
    totalEarnings: detail.totalEarnings,
    totalVariableEarnings: detail.totalVariableEarnings,
    totalDeductions: detail.totalDeductions,
    totalAmount: detail.totalAmount,
    nominaId: detail.nominaId ?? null,
    desprendible: detail.desprendible ?? null,
    variables: detail.variables.map((variable) => ({
      id: variable.id,
      date: "",
      contractor: detail.nombreCompleto,
      client: detail.empresaNombre,
      type:
        variable.type === "Overtime"
          ? "Overtime"
          : variable.type === "Holiday"
            ? "Holiday"
            : variable.type === "Deducción"
              ? "Deducción"
              : "Income Variable",
      category: variable.category as
        | "overtimes"
        | "holidays"
        | "deducciones"
        | "incomeVariables",
      description: variable.description,
      amount: variable.amount,
      status: variable.status,
      createdBy: "",
      period: detail.periodo,
      applyDate: "",
    })),
  };
}

export interface GetNominaByIdResult extends ApiResponse {
  data?: PayrollDetail;
}

export async function getNominaById(
  procesoContratacionId: string,
  periodo: string,
): Promise<GetNominaByIdResult> {
  const axios = await createServerAxios();
  const periodoNormalized = periodo?.trim();

  if (!periodoNormalized || !/^\d{4}-(0[1-9]|1[0-2])$/.test(periodoNormalized)) {
    return {
      success: false,
      message: "El período debe tener formato YYYY-MM",
    };
  }

  try {
    const response = await axios.get(
      `admin-hub/nominas/${procesoContratacionId}`,
      {
        params: { periodo: periodoNormalized },
        headers: {
          "Cache-Control": "no-store",
        },
      },
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener el detalle de nómina",
      };
    }

    const payload = response.data?.data ?? response.data;
    if (!payload) {
      return {
        success: false,
        message: "Detalle de nómina no encontrado",
      };
    }

    return {
      success: true,
      message: "Detalle de nómina obtenido correctamente",
      data: mapNominaDetailToPayrollDetail(payload as NominaDetailApiResponse),
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      return {
        success: false,
        message: "Detalle de nómina no encontrado",
      };
    }

    console.error("[NOMINAS] Error al obtener detalle:", error);
    return {
      success: false,
      message: "Error al obtener el detalle de nómina",
    };
  }
}

export interface SaveHorasTrabajadasResult extends ApiResponse {
  data?: PayrollDetail;
}

export async function saveHorasTrabajadas(
  procesoContratacionId: string,
  periodo: string,
  horasTrabajadas: number,
): Promise<SaveHorasTrabajadasResult> {
  const axios = await createServerAxios();

  if (!periodo?.trim() || !/^\d{4}-(0[1-9]|1[0-2])$/.test(periodo.trim())) {
    return {
      success: false,
      message: "El período debe tener formato YYYY-MM",
    };
  }

  if (!Number.isFinite(horasTrabajadas) || horasTrabajadas < 0) {
    return {
      success: false,
      message: "Las horas trabajadas deben ser un número mayor o igual a 0",
    };
  }

  try {
    const response = await axios.patch(
      `admin-hub/nominas/${procesoContratacionId}/horas`,
      {
        periodo: periodo.trim(),
        horasTrabajadas,
      },
    );

    if (response.status !== 200 && response.status !== 201) {
      return {
        success: false,
        message: "Error al guardar horas trabajadas",
      };
    }

    const payload = response.data?.data ?? response.data;
    if (!payload) {
      return {
        success: false,
        message: "Respuesta vacía al guardar horas",
      };
    }

    return {
      success: true,
      message: "Horas trabajadas guardadas",
      data: mapNominaDetailToPayrollDetail(payload as NominaDetailApiResponse),
    };
  } catch (error: unknown) {
    const message =
      (error as { response?: { data?: { message?: string } } })?.response?.data
        ?.message ?? "Error al guardar horas trabajadas";
    console.error("[NOMINAS] Error al guardar horas:", error);
    return {
      success: false,
      message: typeof message === "string" ? message : "Error al guardar horas trabajadas",
    };
  }
}

const PERIODO_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface EmitPayrollResult extends ApiResponse {
  data?: PayrollPayslipDocument;
}

/**
 * Emite la nómina del período (APROBADA → EMITIDA) y genera el desprendible de
 * pago en PDF. El backend valida el estado y que no se emita dos veces.
 */
export async function emitPayroll(
  procesoContratacionId: string,
  periodo: string,
): Promise<EmitPayrollResult> {
  if (!PERIODO_REGEX.test(periodo?.trim() ?? "")) {
    return { success: false, message: "El período debe tener formato YYYY-MM" };
  }

  const axios = await createServerAxios();

  try {
    const response = await axios.post(
      `admin-hub/nominas/${procesoContratacionId}/emitir`,
      {},
      {
        params: { periodo: periodo.trim() },
        headers: { "Cache-Control": "no-store" },
      },
    );

    const payload = response.data?.data ?? response.data;
    if (!payload?.numeroDocumento) {
      return { success: false, message: "Respuesta vacía al emitir la nómina" };
    }

    return {
      success: true,
      message: `Nómina emitida — desprendible ${payload.numeroDocumento}`,
      data: {
        numeroDocumento: payload.numeroDocumento,
        pdfUrl: payload.pdfUrl,
        emitidoEn: payload.emitidoEn,
      },
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    const apiMessage = (
      error as { response?: { data?: { message?: string } } }
    )?.response?.data?.message;

    if (status === 409) {
      return {
        success: false,
        message: apiMessage ?? "La nómina ya fue emitida y no puede volver a emitirse",
      };
    }
    if (status === 400) {
      return {
        success: false,
        message: apiMessage ?? "Solo se puede emitir una nómina aprobada",
      };
    }
    if (status === 404) {
      return {
        success: false,
        message: apiMessage ?? "No existe nómina del período para este contrato",
      };
    }

    console.error("[NOMINAS] Error al emitir nómina:", error);
    return { success: false, message: "Error al emitir la nómina" };
  }
}

export interface DownloadPayslipResult extends ApiResponse {
  data?: { filename: string; base64: string };
}

/**
 * Descarga el PDF del desprendible emitido. Se devuelve en base64 porque la
 * server action no puede transmitir un stream binario al cliente.
 */
export async function downloadPayslip(
  procesoContratacionId: string,
  periodo: string,
): Promise<DownloadPayslipResult> {
  if (!PERIODO_REGEX.test(periodo?.trim() ?? "")) {
    return { success: false, message: "El período debe tener formato YYYY-MM" };
  }

  const axios = await createServerAxios();

  try {
    const response = await axios.get(
      `admin-hub/nominas/${procesoContratacionId}/desprendible/descargar`,
      {
        params: { periodo: periodo.trim() },
        responseType: "arraybuffer",
        headers: { "Cache-Control": "no-store" },
      },
    );

    const disposition = String(response.headers?.["content-disposition"] ?? "");
    const filename =
      /filename="?([^"]+)"?/.exec(disposition)?.[1] ?? "desprendible.pdf";

    return {
      success: true,
      message: "Desprendible descargado",
      data: {
        filename,
        base64: Buffer.from(response.data as ArrayBuffer).toString("base64"),
      },
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      return {
        success: false,
        message: "La nómina todavía no fue emitida",
      };
    }

    console.error("[NOMINAS] Error al descargar desprendible:", error);
    return { success: false, message: "Error al descargar el desprendible" };
  }
}
