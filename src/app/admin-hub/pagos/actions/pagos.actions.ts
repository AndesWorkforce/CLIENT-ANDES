"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";
import { formatMoney } from "../../nominas/data/payroll-calculations";
import { monthOptionToPeriod } from "../../nominas/data/payroll-data";
import type { Invoice, InvoiceStatus } from "../types/invoice.types";
import type {
  InvoiceAdditionalFee,
  InvoiceDetail,
  InvoiceLineItem,
  InvoiceLineItemStatus,
  InvoicePayrollEntry,
  InvoicePayrollStatus,
  InvoiceSection,
} from "../types/invoice-detail.types";

const NOMINA_MONTH_NAMES = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
] as const;

type BackendEstado = "BORRADOR" | "EMITIDA" | "PAGADA" | "ANULADA";

export interface FacturaApiItem {
  id: string;
  empresaId: string;
  client: string;
  periodo: string;
  totalFacturar: number;
  estado: BackendEstado;
}

export interface FacturasPagination {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface GetFacturasParams {
  monthOption: string;
  page?: number;
  limit?: number;
  search?: string;
  cliente?: string;
  estado?: InvoiceStatus;
  montoMin?: number;
  montoMax?: number;
}

export interface GetFacturasResult extends ApiResponse {
  data?: Invoice[];
  pagination?: FacturasPagination;
}

type BackendLineStatus = InvoiceLineItemStatus;
type BackendPayrollStatus = InvoicePayrollStatus;

export interface FacturaDetalleApiItem {
  id: string;
  empresaId: string;
  client: string;
  periodo: string;
  estado: BackendEstado;
  country: string;
  issueDate: string | null;
  dueDate: string | null;
  contactName: string | null;
  contactEmail: string | null;
  contactPhone: string | null;
  grandTotal: number;
  payrollSubtotal: number;
  additionalFeesSubtotal: number;
  payrollEntries: Array<{
    id: string;
    contractorName: string;
    position: string;
    contractStartDate: string | null;
    clientPrice: number;
    status: BackendPayrollStatus;
  }>;
  additionalFees: Array<{
    id: string;
    date: string;
    contractor: string;
    position: string;
    description: string;
    amount: number;
    status: BackendLineStatus;
    createdBy: string;
  }>;
  sections: Array<{
    id: string;
    title: string;
    tabKey: "customer-charges" | "customer-credits";
    items: Array<{
      id: string;
      date: string;
      type: string;
      contractor: string;
      description: string;
      amount: number;
      currency?: string;
      amountIsNegative?: boolean;
      status: BackendLineStatus;
      createdBy: string;
    }>;
    subtotal: number;
    subtotalIsNegative?: boolean;
  }>;
}

export interface GetInvoiceDetailResult extends ApiResponse {
  data?: InvoiceDetail;
}

function monthOptionToApiParams(monthOption: string): { anio: number; mes: number } {
  const period = monthOptionToPeriod(monthOption);
  const [monthName, yearStr] = period.split(" ");
  const mes = NOMINA_MONTH_NAMES.indexOf(monthName as (typeof NOMINA_MONTH_NAMES)[number]) + 1;

  if (mes <= 0 || !yearStr) {
    throw new Error(`Periodo inválido: ${monthOption}`);
  }

  return { anio: parseInt(yearStr, 10), mes };
}

function apiPeriodoToDisplay(periodo: string): string {
  const [year, monthStr] = periodo.split("-");
  const monthIndex = parseInt(monthStr, 10) - 1;

  if (monthIndex < 0 || monthIndex >= NOMINA_MONTH_NAMES.length) {
    return periodo;
  }

  return `${NOMINA_MONTH_NAMES[monthIndex]} ${year}`;
}

function mapEstadoToUi(estado: BackendEstado): InvoiceStatus {
  switch (estado) {
    case "PAGADA":
      return "Pagado";
    case "ANULADA":
      return "Vencido";
    case "BORRADOR":
    case "EMITIDA":
    default:
      return "Pendiente";
  }
}

function mapApiFactura(item: FacturaApiItem): Invoice {
  return {
    id: item.id,
    clientId: item.empresaId.slice(0, 8),
    client: item.client,
    period: apiPeriodoToDisplay(item.periodo),
    totalAmount: formatMoney(item.totalFacturar),
    status: mapEstadoToUi(item.estado),
  };
}

function formatSignedAmount(value: number, isNegative?: boolean): string {
  const formatted = formatMoney(Math.abs(value));
  if (isNegative || value < 0) {
    return formatted.startsWith("-") ? formatted : `-${formatted}`;
  }
  return formatted;
}

function mapApiLineItem(item: FacturaDetalleApiItem["sections"][number]["items"][number]): InvoiceLineItem {
  return {
    id: item.id,
    date: item.date,
    type: item.type,
    contractor: item.contractor,
    description: item.description,
    amount: formatSignedAmount(item.amount, item.amountIsNegative),
    currency: item.currency,
    amountIsNegative: item.amountIsNegative,
    status: item.status,
    createdBy: item.createdBy,
  };
}

function mapApiInvoiceDetail(payload: FacturaDetalleApiItem): InvoiceDetail {
  const sections: InvoiceSection[] = payload.sections.map((section) => ({
    id: section.id,
    title: section.title,
    tabKey: section.tabKey,
    items: section.items.map(mapApiLineItem),
    subtotal: formatSignedAmount(section.subtotal, section.subtotalIsNegative),
    subtotalIsNegative: section.subtotalIsNegative,
  }));

  const payrollEntries: InvoicePayrollEntry[] = payload.payrollEntries.map((entry) => ({
    id: entry.id,
    contractorName: entry.contractorName,
    position: entry.position,
    contractStartDate: entry.contractStartDate ?? "—",
    clientPrice: entry.clientPrice,
    status: entry.status,
  }));

  const additionalFees: InvoiceAdditionalFee[] = payload.additionalFees.map((fee) => ({
    id: fee.id,
    date: fee.date,
    contractor: fee.contractor,
    position: fee.position,
    description: fee.description,
    amount: formatMoney(fee.amount),
    status: fee.status,
    createdBy: fee.createdBy,
  }));

  return {
    id: payload.id,
    clientId: payload.empresaId.slice(0, 8),
    client: payload.client,
    period: apiPeriodoToDisplay(payload.periodo),
    totalAmount: formatMoney(payload.grandTotal),
    status: mapEstadoToUi(payload.estado),
    country: payload.country || "—",
    issueDate: payload.issueDate ?? "—",
    dueDate: payload.dueDate ?? "—",
    contactName: payload.contactName ?? "—",
    contactEmail: payload.contactEmail ?? "—",
    contactPhone: payload.contactPhone ?? "—",
    grandTotal: formatMoney(payload.grandTotal),
    payrollEntries,
    payrollSubtotal: formatMoney(payload.payrollSubtotal),
    additionalFees,
    additionalFeesSubtotal: formatMoney(payload.additionalFeesSubtotal),
    sections,
  };
}

function normalizePagination(
  pagination?: Partial<FacturasPagination>,
  fallbackPage = 1,
  fallbackLimit = 100,
): FacturasPagination {
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

export async function getFacturas(
  params: GetFacturasParams,
): Promise<GetFacturasResult> {
  const axios = await createServerAxios();

  try {
    const { anio, mes } = monthOptionToApiParams(params.monthOption);

    const response = await axios.get("admin-hub/facturas", {
      params: {
        anio,
        mes,
        page: params.page ?? 1,
        limit: params.limit ?? 100,
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.cliente?.trim() ? { cliente: params.cliente.trim() } : {}),
        ...(params.estado ? { estado: params.estado } : {}),
        ...(params.montoMin !== undefined ? { montoMin: params.montoMin } : {}),
        ...(params.montoMax !== undefined ? { montoMax: params.montoMax } : {}),
      },
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener facturas",
      };
    }

    const payload = response.data;
    const items = Array.isArray(payload?.data) ? payload.data : [];
    const pagination = normalizePagination(
      payload?.meta?.pagination,
      params.page ?? 1,
      params.limit ?? 100,
    );

    return {
      success: true,
      message: "Facturas obtenidas correctamente",
      data: items.map((item: FacturaApiItem) => mapApiFactura(item)),
      pagination,
    };
  } catch (error) {
    console.error("[PAGOS] Error al obtener facturas:", error);
    return {
      success: false,
      message: "Error al obtener facturas",
    };
  }
}

export async function getInvoiceDetail(
  invoiceId: string,
): Promise<GetInvoiceDetailResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.get(`admin-hub/facturas/${invoiceId}`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200 || !response.data?.data) {
      return {
        success: false,
        message: "Error al obtener el detalle de la factura",
      };
    }

    return {
      success: true,
      message: "Detalle de factura obtenido correctamente",
      data: mapApiInvoiceDetail(response.data.data as FacturaDetalleApiItem),
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      return {
        success: false,
        message: "Factura no encontrada",
      };
    }

    console.error("[PAGOS] Error al obtener detalle de factura:", error);
    return {
      success: false,
      message: "Error al obtener el detalle de la factura",
    };
  }
}
