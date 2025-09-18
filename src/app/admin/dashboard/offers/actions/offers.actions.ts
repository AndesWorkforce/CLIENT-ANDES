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
    if (stageFilter && stageFilter !== "all") params.append("stageFilter", stageFilter);
    if (applicantStatusFilter && applicantStatusFilter !== "all") params.append("applicantStatusFilter", applicantStatusFilter);
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
