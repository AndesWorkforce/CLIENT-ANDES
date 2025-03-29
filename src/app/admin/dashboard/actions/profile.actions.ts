"use server";

import { createServerAxios } from "@/services/axios.server";

export async function getProfile(id: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(`usuarios/${id}/perfil-completo`);
    const responseData = response.data;
    if (response.status !== 200) {
      console.error(
        "[Profile] API error status:",
        response.status,
        response.statusText
      );
      console.error("[Profile] API error body:", responseData);
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    return {
      success: true,
      message: "Perfil obtenido correctamente",
      data: responseData,
    };
  } catch (error) {
    console.error("[Profile] Error en getProfile:", error);
    return {
      success: false,
      message: "Error en getProfile: " + error,
    };
  }
}
