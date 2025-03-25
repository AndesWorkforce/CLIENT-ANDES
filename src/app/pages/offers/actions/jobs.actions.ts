"use server";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getOffers() {
  try {
    if (!API_URL) {
      console.error("[Education] No se encontró la URL de la API");
      return {
        success: false,
        message: "Error de configuración: URL de API no disponible",
      };
    }

    const response = await fetch(`${API_URL}offers/search`);
    const data = await response.json();

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return {
      success: false,
      message: "Error al obtener las ofertas",
    };
  }
}
