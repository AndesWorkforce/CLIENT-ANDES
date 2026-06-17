"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";
import { ApiResponse } from "@/interfaces/api.interface";

export interface Holiday {
  id: string;
  nombre: string;
  dia: number;
  mes: number;
  pais: string;
  codigoPais: string;
  activo: boolean;
  fechaCreacion: string;
  origen?: 'MANUAL' | 'AUTOMATICO';
}

interface GetHolidaysResponse extends ApiResponse {
  data?: {
    data: Holiday[];
    pagination?: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export async function getHolidays(
  page: number = 1,
  limit: number = 20
): Promise<GetHolidaysResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(`holidays`, {
      params: { page, limit },
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status === 200) {
      const backendData = response.data?.data || response.data;
      
      return {
        success: true,
        message: "Holidays fetched successfully",
        data: {
          data: Array.isArray(backendData.data) ? backendData.data : [],
          pagination: backendData.pagination || {
            total: backendData.total || 0,
            page: backendData.page || 1,
            limit: backendData.limit || 20,
            totalPages: backendData.totalPages || 0,
          },
        },
      };
    }

    return {
      success: false,
      message: "Error fetching holidays",
    };
  } catch (error) {
    console.error("[HOLIDAYS] Error al obtener festivos:", error);
    return {
      success: false,
      message: "Error fetching holidays",
    };
  }
}

export interface CreateHolidayData {
  nombre: string;
  dia: number;
  mes: number;
  pais: string;
  codigoPais: string;
}

export async function createHoliday(
  data: CreateHolidayData
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.post("holidays", data);

    if (response.status === 201) {
      revalidatePath("/admin-hub/configuracion/dias-festivos");
      return {
        success: true,
        message: "Holiday created successfully",
        data: response.data?.data || response.data,
      };
    }

    return {
      success: false,
      message: "Error creating holiday",
    };
  } catch (error: any) {
    console.error("[HOLIDAYS] Error al crear festivo:", error);
    const errorMessage =
      error?.response?.data?.message || 
      error?.response?.data?.meta?.message ||
      "Error creating holiday";
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function updateHoliday(
  id: string,
  data: Partial<CreateHolidayData>
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`holidays/${id}`, data);

    if (response.status === 200) {
      revalidatePath("/admin-hub/configuracion/dias-festivos");
      return {
        success: true,
        message: "Holiday updated successfully",
        data: response.data?.data || response.data,
      };
    }

    return {
      success: false,
      message: "Error updating holiday",
    };
  } catch (error: any) {
    console.error("[HOLIDAYS] Error al actualizar festivo:", error);
    const errorMessage =
      error?.response?.data?.message || 
      error?.response?.data?.meta?.message ||
      "Error updating holiday";
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function deleteHoliday(id: string): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.delete(`holidays/${id}`);

    if (response.status === 200) {
      revalidatePath("/admin-hub/configuracion/dias-festivos");
      return {
        success: true,
        message: "Holiday deleted successfully",
      };
    }

    return {
      success: false,
      message: "Error deleting holiday",
    };
  } catch (error: any) {
    console.error("[HOLIDAYS] Error al eliminar festivo:", error);
    const errorMessage =
      error?.response?.data?.message || 
      error?.response?.data?.meta?.message ||
      "Error deleting holiday";
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export async function getCountries(): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.get("holidays/countries");

    if (response.status === 200) {
      return {
        success: true,
        message: "Countries fetched successfully",
        data: response.data,
      };
    }

    return {
      success: false,
      message: "Error fetching countries",
    };
  } catch (error) {
    console.error("[HOLIDAYS] Error al obtener países:", error);
    return {
      success: false,
      message: "Error fetching countries",
    };
  }
}

export async function getHolidaysByCountry(
  countryName: string
): Promise<GetHolidaysResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(`holidays/by-country/${encodeURIComponent(countryName)}`, {
      headers: {
        "Cache-Control": "no-store",
      },
    });

    if (response.status === 200) {
      const backendData = response.data?.data || response.data;
      
      return {
        success: true,
        message: "Holidays fetched successfully",
        data: {
          data: Array.isArray(backendData) ? backendData : [],
          pagination: {
            total: Array.isArray(backendData) ? backendData.length : 0,
            page: 1,
            limit: Array.isArray(backendData) ? backendData.length : 0,
            totalPages: 1,
          },
        },
      };
    }

    return {
      success: false,
      message: "Error fetching holidays",
    };
  } catch (error) {
    console.error("[HOLIDAYS] Error al obtener festivos por país:", error);
    return {
      success: false,
      message: "Error fetching holidays",
    };
  }
}

export interface HolidayPreview {
  nombre: string;
  dia: number;
  mes: number;
  fecha: string;
  exists: boolean;
  origen?: 'MANUAL' | 'AUTOMATICO';
}

export interface PreviewSyncData {
  countryCode: string;
  year: number;
}

export async function previewSyncHolidays(
  data: PreviewSyncData
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.post("holidays/preview-sync", data);

    if (response.status === 200) {
      return {
        success: true,
        message: "Preview fetched successfully",
        data: response.data?.data || response.data,
      };
    }

    return {
      success: false,
      message: "Error fetching preview",
    };
  } catch (error: any) {
    console.error("[HOLIDAYS] Error al previsualizar sincronización:", error);
    const errorMessage =
      error?.response?.data?.message || 
      error?.response?.data?.meta?.message ||
      "Error fetching preview";
    return {
      success: false,
      message: errorMessage,
    };
  }
}

export interface SyncHolidaysData {
  countryCode: string;
  year: number;
  overwrite?: boolean;
}

export async function syncHolidays(
  data: SyncHolidaysData
): Promise<ApiResponse> {
  const axios = await createServerAxios();
  try {
    const response = await axios.post("holidays/sync", data);

    if (response.status === 200 || response.status === 201) {
      revalidatePath("/admin-hub/configuracion/dias-festivos");
      return {
        success: true,
        message: "Synchronization completed successfully",
        data: response.data?.data || response.data,
      };
    }

    return {
      success: false,
      message: "Error synchronizing holidays",
    };
  } catch (error: any) {
    console.error("[HOLIDAYS] Error al sincronizar festivos:", error);
    const errorMessage =
      error?.response?.data?.message || 
      error?.response?.data?.meta?.message ||
      "Error synchronizing holidays";
    return {
      success: false,
      message: errorMessage,
    };
  }
}
