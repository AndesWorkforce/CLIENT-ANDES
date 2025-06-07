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

    // Verificación más detallada de la estructura de datos
    if (!responseData) {
      console.error("[profile.actions] No hay datos en la respuesta");
      return {
        success: false,
        message: "No se recibieron datos del servidor",
      };
    }

    // Si los datos vienen directamente en responseData
    if (responseData.datosPersonales) {
      console.log(
        "[profile.actions] Datos encontrados directamente en responseData"
      );
      return {
        success: true,
        message: "Profile obtained successfully",
        data: {
          data: responseData,
        },
      };
    }

    // Si los datos vienen en responseData.data
    if (responseData.data && responseData.data.datosPersonales) {
      console.log("[profile.actions] Datos encontrados en responseData.data");
      return {
        success: true,
        message: "Profile obtained successfully",
        data: responseData,
      };
    }

    console.error(
      "[profile.actions] Estructura de datos inválida:",
      responseData
    );
    return {
      success: false,
      message: "Estructura de datos inválida en la respuesta",
    };
  } catch (error) {
    console.error("[profile.actions] Error in getProfile:", error);
    return {
      success: false,
      message: "Error in getProfile: " + error,
    };
  }
}
