"use server";

import { createServerAxios } from "@/services/axios.server";
import { AxiosError } from "axios";

function axiosErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof AxiosError)) {
    return error instanceof Error ? error.message : fallback;
  }
  const data = error.response?.data as
    | { message?: string | string[] }
    | undefined;
  const m = data?.message;
  if (Array.isArray(m)) return m.filter(Boolean).join("; ");
  if (typeof m === "string" && m.trim()) return m;
  if (error.response?.status) {
    return `${fallback} (HTTP ${error.response.status})`;
  }
  return error.message || fallback;
}

export async function getCandidateActivityLogs(candidateId: string) {
  const axios = await createServerAxios();
  try {
    const { data } = await axios.get(
      `admin/postulantes/${candidateId}/bitacora`,
    );
    return {
      success: true as const,
      data,
    };
  } catch (error) {
    console.error("[getCandidateActivityLogs]", error);
    return {
      success: false as const,
      message: axiosErrorMessage(error, "Could not load activity logs"),
    };
  }
}

export async function createManualNote(candidateId: string, note: string) {
  const axios = await createServerAxios();
  try {
    const { data } = await axios.post(
      `admin/postulantes/${candidateId}/bitacora`,
      {
        nota: note,
      },
    );

    return {
      success: true as const,
      data,
    };
  } catch (error) {
    return {
      success: false as const,
      message: axiosErrorMessage(error, "Could not add note"),
    };
  }
}

export async function updateActivityLog(logId: string, note: string) {
  const axios = await createServerAxios();
  try {
    const { data } = await axios.patch(`admin/bitacora/${logId}`, {
      descripcion: note,
    });

    return {
      success: true as const,
      data: data,
      message: "Log updated successfully",
    };
  } catch (error) {
    console.error("Error updating activity log:", error);
    return {
      success: false as const,
      message: axiosErrorMessage(error, "Error updating activity log"),
    };
  }
}

export async function deleteActivityLog(logId: string) {
  const axios = await createServerAxios();
  try {
    const { data } = await axios.delete(`admin/bitacora/${logId}`);

    return {
      success: true as const,
      data: data,
      message: "Log deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting activity log:", error);
    return {
      success: false as const,
      message: axiosErrorMessage(error, "Error deleting activity log"),
    };
  }
}
