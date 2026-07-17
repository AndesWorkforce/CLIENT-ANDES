"use server";

import { createServerAxios } from "@/services/axios.server";
import { getContratoById } from "../../contratos/actions/contratos.actions";
import type { CreatePayrollVariableFormData } from "../components/payroll-variable-form-types";
import {
  buildCreateDeductionPayload,
  buildCreateDiaLibrePayload,
  buildUpdateDiaLibrePayload,
  contractContextFromContratoDetail,
  decodeDeductionVariableRef,
  encodeDeductionVariableRef,
  mapDeduccionToFormData,
  mapDeduccionToPayrollVariable,
  mapDeduccionToPayrollVariableDetail,
  mapDiaLibreToFormData,
  mapDiaLibreToPayrollVariable,
  mapDiaLibreToPayrollVariableDetail,
  normalizeDeduccionApiRecord,
  normalizeDiaLibreApiRecord,
  normalizeDiaLibrePreview,
} from "../lib/payroll-deduction.mapper";
import type {
  DeductionVariableContractContext,
  DeductionVariableRef,
  GetDeductionVariableResult,
  SubmitDeductionVariableResult,
  UpdateDeductionVariableResult,
} from "../types/payroll-deduction.types";
import { resolveDeductionKindFromForm } from "../types/payroll-deduction.types";

function unwrapPayload<T>(response: { data?: unknown }): T {
  const payload = response.data;
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}

async function loadContractContext(
  procesoContratacionId: string,
): Promise<DeductionVariableContractContext | null> {
  const result = await getContratoById(procesoContratacionId);
  if (!result.success || !result.data) {
    return null;
  }

  return contractContextFromContratoDetail({
    id: result.data.id,
    usuarioId: result.data.usuarioId,
    nombreCompleto: result.data.nombreCompleto,
    puestoTrabajo: result.data.puestoTrabajo,
    empresaNombre: result.data.empresaNombre,
    ofertaSalarial: result.data.ofertaSalarial,
  });
}

async function fetchDiaLibrePreviewMonto(
  axios: Awaited<ReturnType<typeof createServerAxios>>,
  diaLibreId: string,
): Promise<number> {
  const response = await axios.get(
    `days-off/dia-libre/${diaLibreId}/descuento-preview`,
    { headers: { "Cache-Control": "no-store" } },
  );
  const preview = normalizeDiaLibrePreview(
    unwrapPayload<Record<string, unknown>>(response),
  );
  return preview.montoDescuento;
}

async function fetchDiaLibreById(
  axios: Awaited<ReturnType<typeof createServerAxios>>,
  diaLibreId: string,
  procesoContratacionId: string,
): Promise<ReturnType<typeof normalizeDiaLibreApiRecord> | null> {
  const response = await axios.get(
    `days-off/contrato/${procesoContratacionId}/dias-libre`,
    { headers: { "Cache-Control": "no-store" } },
  );
  const rows = unwrapPayload<Record<string, unknown>[]>(response);
  if (!Array.isArray(rows)) return null;

  const row = rows.find((item) => String(item.id) === diaLibreId);
  return row ? normalizeDiaLibreApiRecord(row) : null;
}

/**
 * Crea una variable de deducciones según `deductionTipo` del formulario:
 * - Ausencia → POST days-off/dia-libre
 * - Other    → POST deductions
 */
export async function submitDeductionVariable(
  formData: CreatePayrollVariableFormData,
): Promise<SubmitDeductionVariableResult> {
  const axios = await createServerAxios();
  const kind = resolveDeductionKindFromForm(formData);

  if (!formData.contractId?.trim()) {
    return { success: false, message: "Debe seleccionar un contrato" };
  }

  const context = await loadContractContext(formData.contractId);
  if (!context) {
    return { success: false, message: "Contrato no encontrado" };
  }

  try {
    if (kind === "ausencia") {
      const payload = buildCreateDiaLibrePayload(formData);
      const response = await axios.post("days-off/dia-libre", payload);
      const row = normalizeDiaLibreApiRecord(
        unwrapPayload<Record<string, unknown>>(response),
      );
      const monto = await fetchDiaLibrePreviewMonto(axios, row.id);
      const ref = encodeDeductionVariableRef("ausencia", row.id);

      return {
        success: true,
        message: "Ausencia registrada correctamente",
        ref,
        kind,
        variable: mapDiaLibreToPayrollVariable(row, context, monto),
      };
    }

    const payload = buildCreateDeductionPayload(formData);
    const response = await axios.post("deductions", payload);
    const row = normalizeDeduccionApiRecord(
      unwrapPayload<Record<string, unknown>>(response),
    );
    const ref = encodeDeductionVariableRef("deduccion", row.id);

    return {
      success: true,
      message: "Deducción registrada correctamente",
      ref,
      kind,
      variable: mapDeduccionToPayrollVariable(row, context),
    };
  } catch (error) {
    console.error("[PAYROLL-DEDUCTION] Error al crear variable:", error);
    return {
      success: false,
      message:
        kind === "ausencia"
          ? "Error al registrar la ausencia"
          : "Error al registrar la deducción",
    };
  }
}

/**
 * Carga detalle + formData para edición a partir de un ref compuesto.
 */
export async function getDeductionVariable(
  ref: DeductionVariableRef | string,
): Promise<GetDeductionVariableResult> {
  const decoded = decodeDeductionVariableRef(ref);
  if (!decoded) {
    return { success: false, message: "Identificador de variable inválido" };
  }

  const axios = await createServerAxios();

  try {
    if (decoded.kind === "deduccion") {
      const response = await axios.get(`deductions/${decoded.id}`, {
        headers: { "Cache-Control": "no-store" },
      });
      const row = normalizeDeduccionApiRecord(
        unwrapPayload<Record<string, unknown>>(response),
      );
      const context = await loadContractContext(row.procesoContratacionId);
      if (!context) {
        return { success: false, message: "Contrato no encontrado" };
      }

      const encodedRef = encodeDeductionVariableRef("deduccion", row.id);
      return {
        success: true,
        message: "Deducción obtenida correctamente",
        ref: encodedRef,
        kind: "deduccion",
        detail: mapDeduccionToPayrollVariableDetail(row, context),
        formData: mapDeduccionToFormData(row, context),
        editable: !row.lineaNomina,
      };
    }

    const previewResponse = await axios.get(
      `days-off/dia-libre/${decoded.id}/descuento-preview`,
      { headers: { "Cache-Control": "no-store" } },
    );
    const preview = normalizeDiaLibrePreview(
      unwrapPayload<Record<string, unknown>>(previewResponse),
    );
    const row = await fetchDiaLibreById(
      axios,
      decoded.id,
      preview.procesoContratacionId,
    );
    if (!row) {
      return { success: false, message: "Ausencia no encontrada" };
    }

    const context = await loadContractContext(row.procesoContratacionId);
    if (!context) {
      return { success: false, message: "Contrato no encontrado" };
    }

    const encodedRef = encodeDeductionVariableRef("ausencia", row.id);
    return {
      success: true,
      message: "Ausencia obtenida correctamente",
      ref: encodedRef,
      kind: "ausencia",
      detail: mapDiaLibreToPayrollVariableDetail(
        row,
        context,
        preview.montoDescuento,
      ),
      formData: mapDiaLibreToFormData(row, context),
      editable: !row.lineaNomina,
    };
  } catch (error) {
    console.error("[PAYROLL-DEDUCTION] Error al obtener variable:", error);
    return { success: false, message: "Variable de deducción no encontrada" };
  }
}

/**
 * Actualiza una variable de deducciones.
 * Solo soporta ausencias (`DiaLibre`). Las deducciones fijas no tienen PATCH en backend.
 */
export async function updateDeductionVariable(
  ref: DeductionVariableRef | string,
  formData: CreatePayrollVariableFormData,
): Promise<UpdateDeductionVariableResult> {
  const decoded = decodeDeductionVariableRef(ref);
  if (!decoded) {
    return { success: false, message: "Identificador de variable inválido" };
  }

  if (decoded.kind === "deduccion") {
    return {
      success: false,
      message:
        "Las deducciones fijas no admiten edición. Elimine y vuelva a crear el registro.",
    };
  }

  const axios = await createServerAxios();

  try {
    const payload = buildUpdateDiaLibrePayload(formData);
    const response = await axios.patch(
      `days-off/dia-libre/${decoded.id}`,
      payload,
    );
    const row = normalizeDiaLibreApiRecord(
      unwrapPayload<Record<string, unknown>>(response),
    );
    const context = await loadContractContext(row.procesoContratacionId);
    if (!context) {
      return { success: false, message: "Contrato no encontrado" };
    }

    const monto = await fetchDiaLibrePreviewMonto(axios, row.id);
    const encodedRef = encodeDeductionVariableRef("ausencia", row.id);

    return {
      success: true,
      message: "Ausencia actualizada correctamente",
      ref: encodedRef,
      detail: mapDiaLibreToPayrollVariableDetail(row, context, monto),
      formData: mapDiaLibreToFormData(row, context),
    };
  } catch (error) {
    console.error("[PAYROLL-DEDUCTION] Error al actualizar ausencia:", error);
    return { success: false, message: "Error al actualizar la ausencia" };
  }
}

/**
 * Elimina una deducción o ausencia si aún no está incluida en nómina.
 */
export async function deleteDeductionVariable(
  ref: DeductionVariableRef | string,
): Promise<{ success: boolean; message: string }> {
  const decoded = decodeDeductionVariableRef(ref);
  if (!decoded) {
    return { success: false, message: "Identificador de variable inválido" };
  }

  const axios = await createServerAxios();

  try {
    if (decoded.kind === "deduccion") {
      await axios.delete(`deductions/${decoded.id}`);
      return { success: true, message: "Deducción eliminada correctamente" };
    }

    await axios.delete(`days-off/dia-libre/${decoded.id}`);
    return { success: true, message: "Ausencia eliminada correctamente" };
  } catch (error) {
    console.error("[PAYROLL-DEDUCTION] Error al eliminar variable:", error);
    return {
      success: false,
      message:
        decoded.kind === "ausencia"
          ? "No se pudo eliminar la ausencia"
          : "No se pudo eliminar la deducción",
    };
  }
}
