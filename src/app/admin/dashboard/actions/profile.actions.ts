"use server";

import { createServerAxios } from "@/services/axios.server";

export async function getProfile(id: string) {
  console.log("[profile.actions] Iniciando getProfile para ID:", id);
  const axios = await createServerAxios();
  try {
    console.log("[profile.actions] Haciendo petición a la API");
    const response = await axios.get(`usuarios/${id}/perfil-completo`);
    const responseData = response.data;
    console.log(
      "[profile.actions] Respuesta recibida:",
      JSON.stringify(responseData).substring(0, 200) + "..."
    );

    if (response.status !== 200) {
      console.error(
        "[profile.actions] API error status:",
        response.status,
        response.statusText
      );
      console.error("[profile.actions] API error body:", responseData);
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    // Verificación de la estructura de datos
    if (!responseData || !responseData.data) {
      console.error(
        "[profile.actions] Estructura de datos inválida:",
        responseData
      );
      return {
        success: false,
        message: "Estructura de datos inválida en la respuesta",
      };
    }

    console.log("[profile.actions] Perfil obtenido correctamente");
    return {
      success: true,
      message: "Perfil obtenido correctamente",
      data: responseData,
    };
  } catch (error) {
    console.error("[profile.actions] Error en getProfile:", error);
    return {
      success: false,
      message: "Error en getProfile: " + error,
    };
  }
}
