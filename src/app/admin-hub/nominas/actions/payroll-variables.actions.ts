"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";
import { getContratos, type ContratoListItem } from "../../contratos/actions/contratos.actions";
import type { CreatePayrollVariableFormData } from "../components/payroll-variable-form-types";
import type { PayrollVariableDrawerType } from "../data/mock-payroll-variables";
import type { PayrollVariable } from "../data/mock-payroll-variables";
import type { PayrollVariableDetail } from "../data/mock-variable-detail";
import { formDataToCreateNominaVariablePayload } from "../lib/payroll-variable-form.mapper";
import {
  mapNominaVariableDetailToPayrollVariable,
  mapNominaVariableDetailToPayrollVariableDetail,
  mapNominaVariableListItemToPayrollVariable,
  type NominaVariableDetailApi,
  type NominaVariableListItemApi,
} from "../lib/payroll-variable-api.types";

export interface GetNominaVariablesParams {
  periodo?: string;
  categoria?: string;
  search?: string;
  cliente?: string;
}

export interface GetNominaVariablesResult extends ApiResponse {
  data?: PayrollVariable[];
}

export interface SubmitNominaVariableResult extends ApiResponse {
  data?: PayrollVariable;
  detail?: PayrollVariableDetail;
}

export interface GetNominaVariableResult extends ApiResponse {
  data?: PayrollVariableDetail;
}

function unwrapPayload<T>(response: { data?: unknown }): T {
  const payload = response.data;
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

export async function getContratosForVariables(): Promise<{
  success: boolean;
  data: ContratoListItem[];
  message: string;
}> {
  const result = await getContratos({ page: 1, limit: 500, estado: "Activo" });
  return {
    success: result.success,
    data: result.data ?? [],
    message: result.message ?? "",
  };
}

export async function getNominaVariables(
  params: GetNominaVariablesParams = {},
): Promise<GetNominaVariablesResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.get("admin-hub/nominas/variables", {
      params: {
        ...(params.periodo ? { periodo: params.periodo } : {}),
        ...(params.categoria && params.categoria !== "todos"
          ? { categoria: params.categoria }
          : {}),
        ...(params.search?.trim() ? { search: params.search.trim() } : {}),
        ...(params.cliente?.trim() ? { cliente: params.cliente.trim() } : {}),
      },
      headers: { "Cache-Control": "no-store" },
    });

    const items = unwrapPayload<NominaVariableListItemApi[]>(response);
    const data = Array.isArray(items)
      ? items.map(mapNominaVariableListItemToPayrollVariable)
      : [];

    return {
      success: true,
      message: "Variables obtenidas correctamente",
      data,
    };
  } catch (error) {
    console.error("[NOMINA-VARIABLES] Error al listar:", error);
    return { success: false, message: "Error al obtener variables de nómina" };
  }
}

export async function submitNominaVariable(
  drawerType: PayrollVariableDrawerType,
  formData: CreatePayrollVariableFormData,
): Promise<SubmitNominaVariableResult> {
  const axios = await createServerAxios();
  const payload = formDataToCreateNominaVariablePayload(drawerType, formData);

  try {
    const response = await axios.post("admin-hub/nominas/variables", payload);
    const detail = unwrapPayload<NominaVariableDetailApi>(response);

    return {
      success: true,
      message: "Variable creada correctamente",
      data: mapNominaVariableDetailToPayrollVariable(detail),
      detail: mapNominaVariableDetailToPayrollVariableDetail(detail),
    };
  } catch (error) {
    console.error("[NOMINA-VARIABLES] Error al crear:", error);
    return { success: false, message: "Error al crear la variable de nómina" };
  }
}

export async function getNominaVariable(
  ref: string,
): Promise<GetNominaVariableResult> {
  const axios = await createServerAxios();
  const encodedRef = encodeURIComponent(ref);

  try {
    const response = await axios.get(`admin-hub/nominas/variables/${encodedRef}`, {
      headers: { "Cache-Control": "no-store" },
    });
    const detail = unwrapPayload<NominaVariableDetailApi>(response);

    return {
      success: true,
      message: "Variable obtenida correctamente",
      data: mapNominaVariableDetailToPayrollVariableDetail(detail),
    };
  } catch (error) {
    console.error("[NOMINA-VARIABLES] Error al obtener detalle:", error);
    return { success: false, message: "Variable no encontrada" };
  }
}

function extractErrorMessage(error: unknown, fallback: string): string {
  const message = (
    error as { response?: { data?: { message?: string | string[] } } }
  ).response?.data?.message;
  if (Array.isArray(message)) return message.join(", ");
  if (typeof message === "string" && message.trim()) return message;
  return fallback;
}

export async function approveNominaVariable(
  ref: string,
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  const encodedRef = encodeURIComponent(ref);

  try {
    await axios.post(`admin-hub/nominas/variables/${encodedRef}/aprobar`);
    return { success: true, message: "Variable aprobada correctamente" };
  } catch (error) {
    console.error("[NOMINA-VARIABLES] Error al aprobar:", error);
    return {
      success: false,
      message: extractErrorMessage(error, "No se pudo aprobar la variable"),
    };
  }
}

export interface ApproveNominaVariablesBulkResult extends ApiResponse {
  approved?: number;
  skipped?: number;
  failed?: number;
}

export async function approveNominaVariablesBulk(
  refs: string[],
): Promise<ApproveNominaVariablesBulkResult> {
  if (refs.length === 0) {
    return {
      success: true,
      message: "No hay variables pendientes para aprobar",
      approved: 0,
      skipped: 0,
      failed: 0,
    };
  }

  let approved = 0;
  let failed = 0;

  for (const ref of refs) {
    const result = await approveNominaVariable(ref);
    if (result.success) approved += 1;
    else failed += 1;
  }

  return {
    success: failed === 0,
    message:
      failed === 0
        ? `${approved} variable(s) aprobada(s)`
        : `${approved} aprobada(s), ${failed} con error`,
    approved,
    skipped: 0,
    failed,
  };
}

export async function rejectNominaVariable(
  ref: string,
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  const encodedRef = encodeURIComponent(ref);

  try {
    await axios.post(`admin-hub/nominas/variables/${encodedRef}/rechazar`);
    return { success: true, message: "Variable rechazada correctamente" };
  } catch (error) {
    console.error("[NOMINA-VARIABLES] Error al rechazar:", error);
    return {
      success: false,
      message: extractErrorMessage(error, "No se pudo rechazar la variable"),
    };
  }
}

export async function deleteNominaVariable(
  ref: string,
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  const encodedRef = encodeURIComponent(ref);

  try {
    await axios.delete(`admin-hub/nominas/variables/${encodedRef}`);
    return { success: true, message: "Variable eliminada correctamente" };
  } catch (error) {
    console.error("[NOMINA-VARIABLES] Error al eliminar:", error);
    return {
      success: false,
      message: extractErrorMessage(error, "No se pudo eliminar la variable"),
    };
  }
}
