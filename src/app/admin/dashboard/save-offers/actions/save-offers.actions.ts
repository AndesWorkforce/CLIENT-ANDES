"use server";

import { revalidatePath } from "next/cache";
import { createServerAxios } from "@/services/axios.server";

export async function getSavedOffers() {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(`offers/mis-ofertas?estado=borrador`);

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

    revalidatePath("/admin/dashboard/save-offers");

    return {
      success: true,
      message: "Ofertas guardadas obtenidas correctamente",
      data: responseData,
    };
  } catch (error) {
    console.error("[Offers] Error en getSavedOffers:", error);
    return {
      success: false,
      message: "Error en getSavedOffers: " + error,
    };
  }
}

export async function getOfferById(offerId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(`offers/${offerId}`);

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
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      };
    }

    return {
      success: true,
      message: "Oferta obtenida correctamente",
      data: responseData,
    };
  } catch (error) {
    console.error("[Offers] Error en getOfferById:", error);
    return {
      success: false,
      message: "Error en getOfferById: " + error,
    };
  }
}

export async function updateOffer(offerId: string, offerData: FormData) {
  const axios = await createServerAxios();
  try {
    const titulo = offerData.get("title") as string;
    const descripcion = offerData.get("description") as string;
    const estado = offerData.get("estado") as string;

    if (!titulo || !descripcion) {
      console.error("[ERROR] Datos incompletos para actualizar oferta");
      return {
        success: false,
        message: "Datos incompletos para actualizar oferta",
      };
    }

    const jsonData = {
      titulo: titulo,
      descripcion: descripcion,
      estado: estado,
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
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      };
    }

    revalidatePath("/admin/dashboard/save-offers");

    return {
      success: true,
      message: "Oferta actualizada correctamente",
      data: responseData,
    };
  } catch (error) {
    console.error("[Offers] Error en updateOffer:", error);
    return {
      success: false,
      message: "Error en updateOffer: " + error,
    };
  }
}

export async function deleteOffer(offerId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.delete(`offers/${offerId}`);

    const responseData = response.data;

    if (response.status !== 200) {
      console.error(
        "[Offers] API error status:",
        response.status,
        response.statusText
      );
      console.error("[Offers] API error body:", responseData);
    }

    revalidatePath("/admin/dashboard/save-offers");

    return {
      success: true,
      message: "Oferta eliminada correctamente",
      data: responseData,
    };
  } catch (error) {
    console.error("[Offers] Error en deleteOffer:", error);
    return {
      success: false,
      message: "Error en deleteOffer: " + error,
    };
  }
}
