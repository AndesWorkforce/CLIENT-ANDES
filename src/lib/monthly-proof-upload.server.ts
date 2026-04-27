import { createServerAxios } from "@/services/axios.server";

export type UploadMonthlyProofResult = {
  success: boolean;
  data?: { id: string; file: string };
  error?: string;
};

/**
 * Sube un comprobante mensual al API (archivo a /files/... y registro a evaluaciones-mensuales).
 * Úsalo desde una Route Handler; no pasa por el límite de body de Server Actions.
 */
export async function uploadMonthlyProofToBackend(
  contratoId: string,
  month: string,
  year: number,
  file: File
): Promise<UploadMonthlyProofResult> {
  try {
    const axios = await createServerAxios();

    const mime = (file as any).type ? String((file as any).type) : "";
    const name = (file as any).name ? String((file as any).name) : "";
    const ext = name.split(".").pop()?.toLowerCase() || "";
    const isPdf = mime === "application/pdf" || ext === "pdf";
    const isImage =
      mime.startsWith("image/") ||
      ["jpg", "jpeg", "png", "webp", "gif", "heic"].includes(ext);

    let fileUrl: string = "";
    if (isPdf) {
      const formData = new FormData();
      formData.append("pdf", file);
      const fileResponse = await axios.post("/files/upload/pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
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
      const fileResponse = await axios.post(
        `/files/upload/image/${typeSlug}`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
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
      return {
        success: false,
        error: "Mes inválido",
      };
    }

    const paddedMonth = String(monthIndex + 1).padStart(2, "0");
    const añoMes = `${year}-${paddedMonth}`;

    const evaluationResponse = await axios.post(
      `/users/contratos/${contratoId}/evaluaciones-mensuales`,
      {
        añoMes,
        documentoSubido: fileUrl,
        fechaSubidaDocumento: new Date().toISOString(),
      }
    );

    const responseData =
      evaluationResponse.data?.data || evaluationResponse.data;

    return {
      success: true,
      data: {
        id: responseData?.id,
        file: fileUrl,
      },
    };
  } catch (error: any) {
    console.error("Error uploading monthly proof:", error);

    const status = error.response?.status;
    if (status === 413) {
      return {
        success: false,
        error: "FILE_TOO_LARGE",
      };
    }

    return {
      success: false,
      error: error.response?.data?.message || "Error al subir el archivo",
    };
  }
}
