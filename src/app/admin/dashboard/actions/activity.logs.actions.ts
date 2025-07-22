"use server";

import { createServerAxios } from "@/services/axios.server";
import { AxiosError } from "axios";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getCandidateActivityLogs(candidateId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(
      `${API_URL}admin/postulantes/${candidateId}/bitacora`
    );
    const data = await response.data;
    console.log("data", data);
    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.log("error", error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
    return {
      success: false,
      message: "Error getting candidate activity logs",
    };
  }
}

export async function createManualNote(candidateId: string, note: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.post(
      `${API_URL}admin/postulantes/${candidateId}/bitacora`,
      {
        nota: note,
      }
    );
    const data = await response.data;

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
    return {
      success: false,
      message: "Error getting candidate activity logs",
    };
  }
}

// Nueva función para editar un log existente
export async function updateActivityLog(logId: string, note: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`${API_URL}admin/bitacora/${logId}`, {
      descripcion: note,
    });

    return {
      success: true,
      data: response.data,
      message: "Log updated successfully",
    };
  } catch (error) {
    console.error("Error updating activity log:", error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || "Error updating activity log",
      };
    }
    return {
      success: false,
      message: "Error updating activity log",
    };
  }
}

// Nueva función para eliminar un log
export async function deleteActivityLog(logId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.delete(`${API_URL}admin/bitacora/${logId}`);

    return {
      success: true,
      data: response.data,
      message: "Log deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting activity log:", error);
    if (error instanceof AxiosError) {
      return {
        success: false,
        message: error.response?.data?.message || "Error deleting activity log",
      };
    }
    return {
      success: false,
      message: "Error deleting activity log",
    };
  }
}
