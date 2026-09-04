"use server";

import { createServerAxios } from "@/services/axios.server";
import { ApiResponse } from "@/interfaces/api.interface";

const PERIODO_REGEX = /^\d{4}-(0[1-9]|1[0-2])$/;

export interface MyPayslipLine {
  label: string;
  value: string;
}

export interface MyPayslipListItem {
  periodo: string;
  periodoDisplay: string;
  numeroDocumento: string;
  emitidoEn: string;
  estado: "EMITIDA" | "PAGADA";
  totalNetPay: string;
  puestoTrabajo: string;
  empresaNombre: string;
}

export interface MyPayslipDetail extends MyPayslipListItem {
  contractorName: string;
  position: string;
  country: string;
  startDate: string;
  endDate: string;
  monthlyPayment: string;
  earnings: MyPayslipLine[];
  deductions: MyPayslipLine[];
  totalEarnings: string;
  totalDeductions: string;
}

export interface GetMyPayslipsResult extends ApiResponse {
  data?: MyPayslipListItem[];
}

/**
 * Desprendibles de pago del contratista autenticado.
 *
 * El backend deriva el usuario del token: no se manda ningún id, así que no es
 * posible pedir los desprendibles de otra persona.
 */
export async function getMyPayslips(): Promise<GetMyPayslipsResult> {
  const axios = await createServerAxios();

  try {
    const response = await axios.get("payslips/me", {
      headers: { "Cache-Control": "no-store" },
    });

    const payload = response.data?.data ?? response.data;

    return {
      success: true,
      message: "Desprendibles obtenidos correctamente",
      data: Array.isArray(payload) ? (payload as MyPayslipListItem[]) : [],
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 401) {
      return { success: false, message: "Tu sesión expiró. Volvé a iniciar sesión." };
    }

    console.error("[PAYSLIPS] Error al obtener los desprendibles:", error);
    return { success: false, message: "No pudimos cargar tus desprendibles de pago." };
  }
}

export interface GetMyPayslipDetailResult extends ApiResponse {
  data?: MyPayslipDetail;
}

export async function getMyPayslipDetail(
  periodo: string,
): Promise<GetMyPayslipDetailResult> {
  if (!PERIODO_REGEX.test(periodo?.trim() ?? "")) {
    return { success: false, message: "Período inválido" };
  }

  const axios = await createServerAxios();

  try {
    const response = await axios.get(`payslips/me/${periodo.trim()}`, {
      headers: { "Cache-Control": "no-store" },
    });

    const payload = response.data?.data ?? response.data;
    if (!payload) {
      return { success: false, message: "Respuesta vacía del desprendible" };
    }

    return {
      success: true,
      message: "Desprendible obtenido correctamente",
      data: payload as MyPayslipDetail,
    };
  } catch (error: unknown) {
    const status = (error as { response?: { status?: number } })?.response?.status;
    if (status === 404) {
      return {
        success: false,
        message: "No encontramos un desprendible emitido para ese período.",
      };
    }

    console.error("[PAYSLIPS] Error al obtener el detalle:", error);
    return { success: false, message: "No pudimos cargar el desprendible." };
  }
}

export interface DownloadMyPayslipResult extends ApiResponse {
  data?: { filename: string; base64: string };
}

/**
 * PDF del desprendible propio. Viaja en base64 porque la server action no puede
 * transmitir un stream binario al cliente.
 */
export async function downloadMyPayslip(
  periodo: string,
): Promise<DownloadMyPayslipResult> {
  if (!PERIODO_REGEX.test(periodo?.trim() ?? "")) {
    return { success: false, message: "Período inválido" };
  }

  const axios = await createServerAxios();

  try {
    const response = await axios.get(`payslips/me/${periodo.trim()}/descargar`, {
      responseType: "arraybuffer",
      headers: { "Cache-Control": "no-store" },
    });

    const disposition = String(response.headers?.["content-disposition"] ?? "");
    const filename =
      /filename="?([^"]+)"?/.exec(disposition)?.[1] ?? "payslip.pdf";

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
        message: "No encontramos un desprendible emitido para ese período.",
      };
    }

    console.error("[PAYSLIPS] Error al descargar el desprendible:", error);
    return { success: false, message: "No pudimos descargar el desprendible." };
  }
}
