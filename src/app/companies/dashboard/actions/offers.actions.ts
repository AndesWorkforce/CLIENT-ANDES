"use server";

import { ApiResponse } from "@/app/types/offers";
import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

export async function getAssignedOffers(
  page: number = 1,
  limit: number = 10,
  searchTerm: string = ""
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(
      `offers/assigned?page=${page}&limit=${limit}&search=${searchTerm}`
    );

    console.log("🔍 [getAssignedOffers] Raw response:", {
      status: response.status,
      data: response.data,
      dataKeys: Object.keys(response.data),
      dataDataKeys: response.data.data
        ? Object.keys(response.data.data)
        : "No data.data",
      firstOffer: response.data.data?.data?.[0],
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}`,
      };
    }

    // Asegurarnos de que cada oferta tenga el conteo de postulaciones
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const offers = response.data.data.data.map((offer: any) => ({
      ...offer,
      postulacionesCount:
        offer._count?.postulaciones || offer.postulaciones?.length || 0,
    }));

    console.log("🔍 [getAssignedOffers] Processed offers:", {
      offersCount: offers.length,
      firstOffer: offers[0],
      firstOfferPostulaciones: offers[0]?.postulaciones,
    });

    revalidatePath("/companies/dashboard");

    return {
      success: true,
      message: "Assigned offers retrieved successfully",
      data: {
        ...response.data,
        data: offers,
      },
      hasMore: response.data.hasMore,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("[Companies] Error getting assigned offers:", error);
    return {
      success: false,
      message: error.response?.data?.message || "Error getting assigned offers",
    };
  }
}

export async function toggleOfferStatus(
  offerId: string,
  newStatus: string
): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(`offers/${offerId}/status`, {
      estado: newStatus,
    });

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${response.data.message || ""}`,
      };
    }

    revalidatePath("/companies/dashboard");

    return {
      success: true,
      message: "Estado de la oferta actualizado correctamente",
      data: response.data,
    };
  } catch (error) {
    console.error("[Companies] Error updating offer status:", error);
    return {
      success: false,
      message: "Error al actualizar el estado de la oferta",
    };
  }
}
