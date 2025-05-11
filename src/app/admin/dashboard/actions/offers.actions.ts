"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

export async function getPublishedOffers(page = 1, limit = 10, search = "") {
  const axios = await createServerAxios();
  try {
    const searchParam =
      search && search.trim()
        ? `&search=${encodeURIComponent(search.trim())}`
        : "";

    const requestUrl = `offers?${searchParam}&page=${page}&limit=${limit}`;

    const response = await axios.get(requestUrl);

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

    revalidatePath("/admin/dashboard");

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

export async function toggleOfferStatus(
  offerId: string,
  newStatus: "publicado" | "pausado"
) {
  const axios = await createServerAxios();
  try {
    const jsonData = {
      estado: newStatus,
    };

    const response = await axios.patch(`offers/${offerId}`, jsonData);

    const responseData = response.data;

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message:
        newStatus === "pausado"
          ? "Offer paused successfully"
          : "Offer published successfully",
      data: responseData,
    };
  } catch (error) {
    console.error(`[Offers] Error al cambiar estado a ${newStatus}:`, error);
    return {
      success: false,
      message: `Error al cambiar estado de la oferta: ${error}`,
    };
  }
}

export async function deleteOffer(offerId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.delete(`offers/${offerId}`);

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${response.data?.message || ""}`,
      };
    }

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Offer deleted successfully",
      data: response.data,
    };
  } catch (error) {
    console.error("[Offers] Error al eliminar oferta:", error);
    return {
      success: false,
      message: "Error deleting offer: " + error,
    };
  }
}

// Función para obtener una propuesta específica
export async function getProposal(propuestaId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/propuestas/${propuestaId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        next: { revalidate: 60 }, // Revalidar cada minuto
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener la propuesta");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error obteniendo propuesta:", error);
    return { success: false, error: (error as Error).message };
  }
}
