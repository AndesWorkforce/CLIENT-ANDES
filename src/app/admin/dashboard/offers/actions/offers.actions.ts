"use server";

import { revalidatePath } from "next/cache";
import { createServerAxios } from "@/services/axios.server";

export async function createOffer(formData: FormData) {
  const axios = await createServerAxios();
  try {
    const dataToSend = {
      titulo: formData.get("title") as string,
      descripcion: formData.get("description") as string,
      estado: formData.get("estado") as string,
      pais: (formData.get("pais") as string) || undefined,
    };

    const response = await axios.post(`offers`, dataToSend);

    const responseData = response.data;

    if (response.status !== 201) {
      console.error(
        "[Offers] API error status:",
        response.status,
        response.statusText
      );
      console.error("[Offers] API error body:", responseData);

      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    console.log("[Offers] Oferta creada exitosamente:", responseData);

    revalidatePath("/admin/dashboard/offers");
    revalidatePath("/admin/dashboard/save-offers");
    console.log("[Offers] Revalidated offers path");

    return {
      success: true,
      message: "Oferta creada exitosamente",
    };
  } catch (error) {
    console.error("[Offers] Error en createOffer:", error);
    return {
      success: false,
      message: "Error en createOffer: " + error,
    };
  }
}

export async function getApplicants(
  page = 1,
  limit = 10,
  search = "",
  stageFilter = "all",
  applicantStatusFilter = "all"
) {
  const axiosInstance = await createServerAxios();
  try {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append("search", search.trim());
    if (stageFilter && stageFilter !== "all")
      params.append("stageFilter", stageFilter);
    if (applicantStatusFilter && applicantStatusFilter !== "all")
      params.append("applicantStatusFilter", applicantStatusFilter);
    params.append("page", String(page));
    params.append("limit", String(limit));
    const requestUrl = `users/postulantes?${params.toString()}`;

    const response = await axiosInstance.get(requestUrl);

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${response.data.message || ""}`,
      };
    }

    const responseData = response.data;

    // Manejar estructura anidada del backend
    const actualData = responseData.data || responseData;
    const resultados =
      actualData.resultados || actualData.data?.resultados || [];
    const pagination =
      actualData.pagination || actualData.data?.pagination || {};

    const total = pagination.total || responseData.total || resultados.length;
    const totalPages = pagination.totalPages || Math.ceil(total / limit) || 1;
    const hasNextPage = page < totalPages;

    revalidatePath("/admin/dashboard/postulants");

    return {
      success: true,
      message: "Aplicantes obtenidos correctamente",
      data: {
        resultados: resultados,
        pagination: {
          total,
          page,
          limit,
          totalPages,
        },
      },
      currentPage: page,
      totalPages: totalPages,
      hasMore: hasNextPage,
    };
  } catch (error) {
    console.error("[Offers] Error en getApplicants:", error);
    return {
      success: false,
      message: "Error en getApplicants: " + error,
    };
  }
}

export const assignOfferToCompanies = async (
  offerId: string,
  empresaIds: string[]
) => {
  const axios = await createServerAxios();
  try {
    const response = await axios.put(`offers/${offerId}/assign`, {
      empresaIds,
    });

    if (response.status !== 200) {
      throw new Error(response.data.message || "Error assigning offer");
    }

    return {
      success: true,
      message: "Offer assignments updated successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("Error in assignOfferToCompanies:", error);
    return {
      success: false,
      message: "Error updating offer assignments",
    };
  }
};

export async function getApplicantsHistory(
  offerId: string,
  options?: { includeAll?: boolean; limit?: number; estadoPostulacion?: string }
) {
  const axios = await createServerAxios();
  try {
    if (!offerId) {
      return { success: false, message: "offerId is required" };
    }

    const { includeAll = true, limit = 300, estadoPostulacion } = options || {};

    const params = new URLSearchParams();
    if (includeAll) params.append("includeAll", String(includeAll));
    if (limit) params.append("limit", String(limit));
    if (estadoPostulacion && estadoPostulacion.trim()) {
      params.append("estadoPostulacion", estadoPostulacion.trim());
    }

    const url = `offers/${offerId}/postulaciones/historial?${params.toString()}`;
    const response = await axios.get(url);

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${response.data?.message || ""}`,
      };
    }

    const api = response.data;
    // Robust unwrap: TransformResponseInterceptor => { data: original }
    // Service returns { data: applications[], total }
    // We want always an array for `data` in the returned object
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = api?.data ?? api ?? [];
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
    let rows: any[] = [];
    if (Array.isArray(payload)) {
      rows = payload;
    } else if (Array.isArray(payload?.data)) {
      rows = payload.data;
    } else {
      rows = [];
    }

    const total =
      Array.isArray(payload?.data) && typeof payload?.total === "number"
        ? payload.total
        : typeof api?.total === "number"
        ? api.total
        : undefined;

    return {
      success: true,
      message: "Historial obtenido correctamente",
      data: rows,
      total,
    };
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const status = error?.response?.status;
    const msg =
      error?.response?.data?.message || error?.message || String(error);
    console.error("[Offers] Error en getApplicantsHistory:", msg);
    return {
      success: false,
      message: status ? `${status}: ${msg}` : String(msg),
    };
  }
}
