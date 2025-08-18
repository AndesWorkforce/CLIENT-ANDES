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
  } catch {
    return {
      success: false,
      message: `Error changing offer status`,
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

export async function getProposal(propuestaId: string) {
  const axios = await createServerAxios();
  try {
    // Utilizamos axios que ya tiene la configuración de autenticación
    // Registrar información detallada sobre la solicitud
    // Intentar obtener la propuesta - corregimos la ruta de API
    const response = await axios.get(`offers/${propuestaId}`);

    // Algunos APIs devuelven los datos dentro de un objeto 'data', otros directamente
    const responseData = response.data.data || response.data;

    return {
      success: true,
      data: responseData,
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    // Registrar información detallada sobre el error
    console.error(
      `[getProposal] Error obteniendo propuesta ${propuestaId}:`,
      error
    );

    if (error.response) {
      // Respuesta del servidor con un código de error
      console.error(`[getProposal] Detalles del error:`, {
        status: error.response.status,
        statusText: error.response.statusText,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // No hubo respuesta del servidor
      console.error(
        "[getProposal] No hubo respuesta del servidor:",
        error.request
      );
    }

    return {
      success: false,
      error: `Error al obtener la propuesta ${propuestaId}`,
      errorDetails: error.message || "Error desconocido",
      propuestaId,
    };
  }
}
