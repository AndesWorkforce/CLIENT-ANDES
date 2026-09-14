"use server";

import { createServerAxios } from "@/services/axios.server";

export async function getProfile(id: string) {
  console.log("\n\n\n Fetching profile for user ID:", id, "\n\n\n");
  const axios = await createServerAxios();
  try {
    const response = await axios.get(`usuarios/${id}/perfil-completo`);
    const responseData = response.data;

    if (response.status !== 200) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          responseData.message || ""
        }`,
      };
    }

    // Verificación más detallada de la estructura de datos
    if (!responseData) {
      return {
        success: false,
        message: "No data received from server",
      };
    }

    // Si los datos vienen directamente en responseData
    if (responseData.datosPersonales) {
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
      return {
        success: true,
        message: "Profile obtained successfully",
        data: responseData,
      };
    }

    return {
      success: false,
      message: "Invalid data structure in response",
    };
  } catch (error: any) {
    const apiMessage =
      error?.response?.data?.message ||
      error?.response?.data?.meta?.message ||
      error?.message;
    return {
      success: false,
      message: Array.isArray(apiMessage)
        ? apiMessage.join(", ")
        : apiMessage || "Error in getProfile",
    };
  }
}
