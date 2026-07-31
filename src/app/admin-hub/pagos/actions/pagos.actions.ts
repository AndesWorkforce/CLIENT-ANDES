"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";
import { formatMoney } from "../../nominas/data/payroll-calculations";
import { monthOptionToPeriod } from "../../nominas/data/payroll-data";
import { apiPeriodoToDisplay, displayPeriodToApiPeriod, NOMINA_MONTH_NAMES } from "./pagos.utils";
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

type BackendEstado = "BORRADOR" | "EMITIDA" | "PAGADA" | "ANULADA";

export interface PagosCliente {
  id: string;
  nombre: string;
  activo: boolean;
}

export interface GetPagosClientesResult extends ApiResponse {
  data?: PagosCliente[];
  total?: number;
}

/**
 * Lista clientes desde la tabla Empresa (GET /companies → prisma.empresa).
 */
export async function getPagosClientes(params?: {
  search?: string;
  limit?: number;
  offset?: number;
}): Promise<GetPagosClientesResult> {
  const axios = await createServerAxios();

  try {
    const limit = params?.limit ?? 500;
    const offset = params?.offset ?? 0;
    const search = params?.search?.trim() ?? "";

    const response = await axios.get("companies", {
      params: {
        limit,
        offset,
        ...(search ? { search } : {}),
      },
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener clientes",
        data: [],
        total: 0,
      };
    }

    const companies = Array.isArray(response.data?.companies)
      ? response.data.companies
      : [];

    const data: PagosCliente[] = companies
      .filter(
        (company: { id?: string; nombre?: string; activo?: boolean }) =>
          Boolean(company?.id) && Boolean(company?.nombre),
      )
      .map((company: { id: string; nombre: string; activo?: boolean }) => ({
        id: company.id,
        nombre: company.nombre,
        activo: company.activo !== false,
      }));

    return {
      success: true,
      message: "Clientes obtenidos correctamente",
      data,
      total: typeof response.data?.total === "number" ? response.data.total : data.length,
    };
  } catch (error) {
    console.error("[PAGOS] Error al obtener clientes:", error);
    return {
      success: false,
      message: "Error al obtener clientes",
      data: [],
      total: 0,
    };
  }
}

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
    empresaId: item.empresaId,
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
    empresaId: payload.empresaId,
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

function extractSnapshotId(payload: unknown): string | null {
  if (!payload || typeof payload !== "object") return null;
  const root = payload as Record<string, unknown>;
  if (typeof root.id === "string") return root.id;
  const nested = root.data;
  if (nested && typeof nested === "object" && typeof (nested as { id?: unknown }).id === "string") {
    return (nested as { id: string }).id;
  }
  return null;
}

export interface EnsureInvoiceSnapshotResult extends ApiResponse {
  data?: { id: string };
}

/**
 * Obtiene el snapshot de factura de una Empresa+periodo.
 * Si no existe, lo genera (BORRADOR) y devuelve su id.
 */
export async function ensureInvoiceSnapshot(
  empresaId: string,
  period: string,
): Promise<EnsureInvoiceSnapshotResult> {
  const axios = await createServerAxios();

  try {
    const apiPeriod = displayPeriodToApiPeriod(period);

    try {
      const existing = await axios.get(
        `billing-summary/facturacion/${empresaId}/${apiPeriod}/snapshot`,
        { headers: { "Cache-Control": "no-store" } },
      );
      const existingId = extractSnapshotId(existing.data);
      if (existingId) {
        return {
          success: true,
          message: "Snapshot encontrado",
          data: { id: existingId },
        };
      }
    } catch (error: unknown) {
      const status = (error as { response?: { status?: number } })?.response?.status;
      if (status && status !== 404) {
        throw error;
      }
    }

    const created = await axios.post(
      `billing-summary/facturacion/${empresaId}/${apiPeriod}/snapshot`,
      {},
      { headers: { "Cache-Control": "no-store" } },
    );
    const createdId = extractSnapshotId(created.data);
    if (!createdId) {
      return {
        success: false,
        message: "No se pudo obtener el id del snapshot generado",
      };
    }

    return {
      success: true,
      message: "Snapshot generado correctamente",
      data: { id: createdId },
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 409) {
      return {
        success: false,
        message: "La factura ya está emitida o pagada y no puede regenerarse",
      };
    }

    console.error("[PAGOS] Error al asegurar snapshot:", error);
    return {
      success: false,
      message: "Error al preparar la factura del cliente",
    };
  }
}

export type EstadoSnapshot = "BORRADOR" | "EMITIDA" | "PAGADA" | "ANULADA";

/**
 * Genera o regenera el snapshot de una factura
 */
export async function generateInvoiceSnapshot(
  empresaId: string,
  period: string
): Promise<ApiResponse> {
  const axios = await createServerAxios();

  try {
    const apiPeriod = displayPeriodToApiPeriod(period);
    
    const response = await axios.post(
      `billing-summary/facturacion/${empresaId}/${apiPeriod}/snapshot`,
      {},
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

    if (response.status !== 201 && response.status !== 200) {
      return {
        success: false,
        message: "Error al generar el snapshot de la factura",
      };
    }

    return {
      success: true,
      message: "Snapshot generado correctamente",
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    
    if (status === 409) {
      return {
        success: false,
        message: "La factura ya está emitida o pagada y no puede regenerarse",
      };
    }

    console.error("[PAGOS] Error al generar snapshot:", error);
    return {
      success: false,
      message: "Error al generar el snapshot de la factura",
    };
  }
}

/**
 * Actualiza el estado de una factura
 */
export async function updateInvoiceStatus(
  empresaId: string,
  period: string,
  estado: EstadoSnapshot
): Promise<ApiResponse> {
  const axios = await createServerAxios();

  try {
    const apiPeriod = displayPeriodToApiPeriod(period);
    
    const response = await axios.patch(
      `billing-summary/facturacion/${empresaId}/${apiPeriod}/snapshot/estado`,
      { estado },
      {
        headers: {
          "Cache-Control": "no-store",
        },
      }
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al actualizar el estado de la factura",
      };
    }

    return {
      success: true,
      message: "Estado de la factura actualizado correctamente",
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    
    if (status === 404) {
      return {
        success: false,
        message: "Factura no encontrada",
      };
    }
    
    if (status === 409) {
      return {
        success: false,
        message: "Transición de estado no permitida",
      };
    }

    console.error("[PAGOS] Error al actualizar estado:", error);
    return {
      success: false,
      message: "Error al actualizar el estado de la factura",
    };
  }
}

/**
 * Emite una factura (genera snapshot + cambia estado a EMITIDA)
 */
export async function emitInvoice(
  empresaId: string,
  period: string
): Promise<ApiResponse> {
  // Primero generar/actualizar el snapshot
  const snapshotResult = await generateInvoiceSnapshot(empresaId, period);
  
  if (!snapshotResult.success) {
    return snapshotResult;
  }

  // Luego cambiar el estado a EMITIDA
  return updateInvoiceStatus(empresaId, period, "EMITIDA");
}

/**
 * Marca una factura como pagada
 */
export async function markInvoiceAsPaid(
  empresaId: string,
  period: string
): Promise<ApiResponse> {
  return updateInvoiceStatus(empresaId, period, "PAGADA");
}

/**
 * Anula una factura
 */
export async function cancelInvoice(
  empresaId: string,
  period: string
): Promise<ApiResponse> {
  return updateInvoiceStatus(empresaId, period, "ANULADA");
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER CHARGES
// ─────────────────────────────────────────────────────────────────────────────

export type TipoCargoCliente = "EQUIPO" | "TEAM_BUILDING" | "CAPACITACION" | "OTRO";
export type EstadoCargoCliente = "PENDIENTE" | "APROBADO" | "ANULADO";

export interface CustomerCharge {
  id: string;
  empresaId: string;
  procesoContratacionId?: string | null;
  tipo: TipoCargoCliente;
  monto: number;
  moneda: string;
  fecha: string;
  periodo?: string | null;
  descripcion?: string | null;
  notas?: string | null;
  metodoPago?: string | null;
  afectaNomina: boolean;
  comprobantes?: unknown;
  detalles?: string | null;
  estado: EstadoCargoCliente;
  creadoPorId: string;
  creadoEn: string;
  aprobadoPorId?: string | null;
  aprobadoEn?: string | null;
  notasAprobacion?: string | null;
  empresa?: {
    id: string;
    nombre: string;
  };
  procesoContratacion?: {
    id: string;
    nombreCompleto: string;
    puestoTrabajo: string;
  } | null;
}

export interface CreateCustomerChargeDto {
  empresaId: string;
  procesoContratacionId?: string;
  tipo: TipoCargoCliente;
  monto: number;
  moneda?: string;
  fecha: string;
  periodo?: string;
  descripcion?: string;
  notas?: string;
  metodoPago?: string;
  afectaNomina?: boolean;
  comprobantes?: unknown;
  detalles?: string;
}

export interface UpdateCustomerChargeDto {
  monto?: number;
  tipo?: TipoCargoCliente;
  fecha?: string;
  periodo?: string;
  descripcion?: string;
  notas?: string;
  metodoPago?: string;
  afectaNomina?: boolean;
  comprobantes?: unknown;
  detalles?: string;
}

export interface ApproveCustomerChargeDto {
  notasAprobacion?: string;
}

/**
 * Crea un nuevo cargo al cliente
 */
export async function createCustomerCharge(
  data: CreateCustomerChargeDto
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(
      "/admin-hub/customer-charges",
      data
    );
    // Backend devuelve { data: {...}, meta: {...} }
    return {
      success: true,
      message: "Cargo creado exitosamente",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("[CUSTOMER-CHARGES] Error al crear cargo:", error);
    return {
      success: false,
      message: error.response?.data?.meta?.message || error.response?.data?.message || "Error al crear el cargo",
    };
  }
}

/**
 * Obtiene la lista de cargos con filtros opcionales
 */
export async function getCustomerCharges(filters?: {
  empresaId?: string;
  procesoContratacionId?: string;
  periodo?: string;
  estado?: EstadoCargoCliente;
  tipo?: TipoCargoCliente;
}): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const params = new URLSearchParams();
    
    if (filters?.empresaId) params.append("empresaId", filters.empresaId);
    if (filters?.procesoContratacionId) params.append("procesoContratacionId", filters.procesoContratacionId);
    if (filters?.periodo) params.append("periodo", filters.periodo);
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.tipo) params.append("tipo", filters.tipo);

    const response = await axios.get<ApiResponse>(
      `/admin-hub/customer-charges?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error("[CUSTOMER-CHARGES] Error al obtener cargos:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener los cargos",
    };
  }
}

/**
 * Obtiene el detalle de un cargo específico
 */
export async function getCustomerCharge(
  id: string
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get<ApiResponse>(
      `/admin-hub/customer-charges/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error("[CUSTOMER-CHARGES] Error al obtener cargo:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener el cargo",
    };
  }
}

/**
 * Actualiza un cargo (solo si está PENDIENTE)
 */
export async function updateCustomerCharge(
  id: string,
  data: UpdateCustomerChargeDto
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(
      `/admin-hub/customer-charges/${id}`,
      data
    );
    // Backend devuelve { data: {...}, meta: {...} }
    return {
      success: true,
      message: "Cargo actualizado exitosamente",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("[CUSTOMER-CHARGES] Error al actualizar cargo:", error);
    return {
      success: false,
      message: error.response?.data?.meta?.message || error.response?.data?.message || "Error al actualizar el cargo",
    };
  }
}

/**
 * Aprueba un cargo (PENDIENTE → APROBADO)
 */
export async function approveCustomerCharge(
  id: string,
  data?: ApproveCustomerChargeDto
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(
      `/admin-hub/customer-charges/${id}/aprobar`,
      data || {}
    );
    // Backend devuelve { data: {...}, meta: {...} }
    // Lo transformamos a { success: true, message: string, data: {...} }
    return {
      success: true,
      message: "Cargo aprobado exitosamente",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("[CUSTOMER-CHARGES] Error al aprobar cargo:", error);
    return {
      success: false,
      message: error.response?.data?.meta?.message || error.response?.data?.message || "Error al aprobar el cargo",
    };
  }
}

/**
 * Anula un cargo (PENDIENTE/APROBADO → ANULADO)
 */
export async function cancelCustomerCharge(
  id: string
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(
      `/admin-hub/customer-charges/${id}/anular`,
      {}
    );
    // Backend devuelve { data: {...}, meta: {...} }
    return {
      success: true,
      message: "Cargo anulado exitosamente",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("[CUSTOMER-CHARGES] Error al anular cargo:", error);
    return {
      success: false,
      message: error.response?.data?.meta?.message || error.response?.data?.message || "Error al anular el cargo",
    };
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// CUSTOMER CREDITS
// ─────────────────────────────────────────────────────────────────────────────

export type TipoAjusteFactura = "CREDIT" | "CHARGE";
export type EstadoAjusteFactura = "PENDING" | "PROJECTED" | "APPROVED";
export type CategoriaAjusteFactura = "RENUNCIA" | "DEDUCCION_DIAS_LIBRES" | "AUSENCIA" | "AJUSTE_MANUAL";

export interface CustomerCredit {
  id: string;
  empresaId: string;
  procesoContratacionId?: string | null;
  periodo: string;
  tipo: TipoAjusteFactura;
  monto: number;
  categoria?: CategoriaAjusteFactura | null;
  motivo?: string | null;
  referencia?: string | null;
  fecha?: string | null;
  estado: EstadoAjusteFactura;
  creadoPorId: string;
  creadoEn: string;
  aprobadoPorId?: string | null;
  aprobadoEn?: string | null;
  notasAprobacion?: string | null;
  empresa?: {
    id: string;
    nombre: string;
  };
  procesoContratacion?: {
    id: string;
    nombreCompleto: string;
    puestoTrabajo: string;
  } | null;
}

export interface CreateCustomerCreditDto {
  empresaId: string;
  procesoContratacionId?: string;
  periodo: string;
  tipo: TipoAjusteFactura;
  monto: number;
  categoria?: CategoriaAjusteFactura;
  motivo?: string;
  referencia?: string;
  fecha?: string;
}

export interface UpdateCustomerCreditDto {
  monto?: number;
  motivo?: string;
  referencia?: string;
  fecha?: string;
}

export interface ApproveCustomerCreditDto {
  notasAprobacion?: string;
}

/**
 * Crea un nuevo crédito al cliente
 */
export async function createCustomerCredit(
  data: CreateCustomerCreditDto
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(
      "/admin-hub/customer-credits",
      data
    );
    // Backend devuelve { data: {...}, meta: {...} }
    return {
      success: true,
      message: "Crédito creado exitosamente",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("[CUSTOMER-CREDITS] Error al crear crédito:", error);
    return {
      success: false,
      message: error.response?.data?.meta?.message || error.response?.data?.message || "Error al crear el crédito",
    };
  }
}

/**
 * Obtiene la lista de créditos con filtros opcionales
 */
export async function getCustomerCredits(filters?: {
  empresaId?: string;
  procesoContratacionId?: string;
  periodo?: string;
  estado?: EstadoAjusteFactura;
  tipo?: TipoAjusteFactura;
  categoria?: CategoriaAjusteFactura;
}): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const params = new URLSearchParams();
    
    if (filters?.empresaId) params.append("empresaId", filters.empresaId);
    if (filters?.procesoContratacionId) params.append("procesoContratacionId", filters.procesoContratacionId);
    if (filters?.periodo) params.append("periodo", filters.periodo);
    if (filters?.estado) params.append("estado", filters.estado);
    if (filters?.tipo) params.append("tipo", filters.tipo);
    if (filters?.categoria) params.append("categoria", filters.categoria);

    const response = await axios.get<ApiResponse>(
      `/admin-hub/customer-credits?${params.toString()}`
    );
    return response.data;
  } catch (error: any) {
    console.error("[CUSTOMER-CREDITS] Error al obtener créditos:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener los créditos",
    };
  }
}

/**
 * Obtiene el detalle de un crédito específico
 */
export async function getCustomerCredit(
  id: string
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get<ApiResponse>(
      `/admin-hub/customer-credits/${id}`
    );
    return response.data;
  } catch (error: any) {
    console.error("[CUSTOMER-CREDITS] Error al obtener crédito:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al obtener el crédito",
    };
  }
}

/**
 * Actualiza un crédito (solo si está PENDING)
 */
export async function updateCustomerCredit(
  id: string,
  data: UpdateCustomerCreditDto
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(
      `/admin-hub/customer-credits/${id}`,
      data
    );
    // Backend devuelve { data: {...}, meta: {...} }
    return {
      success: true,
      message: "Crédito actualizado exitosamente",
      data: response.data.data,
    };
  } catch (error: any) {
    console.error("[CUSTOMER-CREDITS] Error al actualizar crédito:", error);
    return {
      success: false,
      message: error.response?.data?.meta?.message || error.response?.data?.message || "Error al actualizar el crédito",
    };
  }
}

/**
 * Aprueba un crédito (PENDING → APPROVED)
 */
export async function approveCustomerCredit(
  id: string,
  data?: ApproveCustomerCreditDto
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.post(
      `/admin-hub/customer-credits/${id}/aprobar`,
      data || {}
    );
    return {
      success: true,
      message: "Crédito aprobado exitosamente",
      data: response.data,
    };
  } catch (error: any) {
    console.error("[CUSTOMER-CREDITS] Error al aprobar crédito:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error al aprobar el crédito",
    };
  }
}
