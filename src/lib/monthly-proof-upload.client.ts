"use client";

import { axiosClient } from "@/services/axios.client";

export type UploadMonthlyProofClientResult = {
  success: boolean;
  data?: { id: string; file: string };
  error?: string;
};

/**
 * Sube el comprobante directamente al API Nest (sin Server Action ni Route Handler de Next).
 * Evita límites de body y errores opacos de RSC en producción.
 */
export async function uploadMonthlyProofFromClient(
  contratoId: string,
  month: string,
  year: number,
  file: File
): Promise<UploadMonthlyProofClientResult> {
  try {
    const mime = file.type ? String(file.type) : "";
    const name = file.name ? String(file.name) : "";
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const isPdf = mime === "application/pdf" || ext === "pdf";
    const isImage =
      mime.startsWith("image/") ||
      ["jpg", "jpeg", "png", "webp", "gif", "heic"].includes(ext);

    let fileUrl: string = "";
    if (isPdf) {
      const formData = new FormData();
      formData.append("pdf", file);
      const fileResponse = await axiosClient.post(
        "/files/upload/pdf",
        formData
      );
      fileUrl = fileResponse.data;
    } else if (isImage) {
      const typeSlug = (() => {
        if (mime.startsWith("image/")) return mime.split("/")[1].toLowerCase();
        if (ext === "jpg") return "jpeg";
        return ext || "jpeg";
      })();
      const formData = new FormData();
      formData.append("image", file);
      formData.append("folder", "monthly-proofs");
      const fileResponse = await axiosClient.post(
        `/files/upload/image/${typeSlug}`,
        formData
      );
      fileUrl = fileResponse.data;
    } else {
      return {
        success: false,
        error: "Tipo de archivo no soportado. Sube un PDF o una imagen.",
      };
    }

    const monthIndex = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ].indexOf(month);

    if (monthIndex < 0) {
      return { success: false, error: "Mes inválido" };
    }

    const paddedMonth = String(monthIndex + 1).padStart(2, "0");
    const añoMes = `${year}-${paddedMonth}`;

    const evaluationResponse = await axiosClient.post(
      `/users/contratos/${contratoId}/evaluaciones-mensuales`,
      {
        añoMes,
        documentoSubido: fileUrl,
        fechaSubidaDocumento: new Date().toISOString(),
      }
    );

    const responseData =
      evaluationResponse.data?.data ?? evaluationResponse.data;

    return {
      success: true,
      data: {
        id: responseData?.id,
        file: fileUrl,
      },
    };
  } catch (error: unknown) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;
    const status = err?.response?.status;
    if (status === 413) {
      return { success: false, error: "FILE_TOO_LARGE" };
    }
    const msg =
      err?.response?.data?.message ||
      err?.message ||
      "Error al subir el archivo";
    return { success: false, error: String(msg) };
  }
}
