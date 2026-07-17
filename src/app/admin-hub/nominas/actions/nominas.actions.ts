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
    earnings: detail.earnings,
    deductions: detail.deductions,
    totalEarnings: detail.totalEarnings,
    totalVariableEarnings: detail.totalVariableEarnings,
    totalDeductions: detail.totalDeductions,
    totalAmount: detail.totalAmount,
    nominaId: detail.nominaId ?? null,
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
