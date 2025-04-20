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

export async function getApplicants(page = 1, limit = 10, search = "") {
  const axiosInstance = await createServerAxios();
  try {
    const params = new URLSearchParams();
    if (search && search.trim()) params.append("search", search.trim());
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

    const total =
      responseData.meta?.pagination?.total || responseData.total || 0;
    const totalPages =
      responseData.meta?.pagination?.totalPages ||
      Math.ceil(total / limit) ||
      1;
    const hasNextPage =
      responseData.meta?.pagination?.hasNextPage || page < totalPages;

    revalidatePath("/admin/dashboard/postulants");

    return {
      success: true,
      message: "Ofertas publicadas y pausadas obtenidas correctamente",
      data: responseData,
      currentPage: page,
      totalPages: totalPages,
      hasMore: hasNextPage,
    };
  } catch (error) {
    console.error("[Offers] Error en getPublishedOffers:", error);
    return {
      success: false,
      message: "Error en getPublishedOffers: " + error,
    };
  }
}
