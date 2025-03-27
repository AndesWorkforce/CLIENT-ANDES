"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

export async function getPublishedOffers() {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(
      `offers/mis-ofertas?estado=publicado,pausado`
    );
    if (response.status !== 200) {
      console.error(
        "[Offers] API error status:",
        response.status,
        response.statusText
      );

      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${response.data.message || ""}`,
      };
    }

    const responseData = response.data;

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message: "Ofertas publicadas y pausadas obtenidas correctamente",
      data: responseData,
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

    revalidatePath("/admin/dashboard");

    return {
      success: true,
      message:
        newStatus === "pausado"
          ? "Oferta pausada correctamente"
          : "Oferta publicada correctamente",
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
