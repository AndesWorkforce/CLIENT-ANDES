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
