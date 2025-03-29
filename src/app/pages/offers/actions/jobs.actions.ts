"use server";

import { createServerAxios } from "@/services/axios.server";
import { AxiosError } from "axios";

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

export async function applyToOffer(offerId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.post(`${API_URL}applications`, {
      propuestaId: offerId,
    });
    const data = await response.data;

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Error al aplicar a la oferta:", error.response?.data);
      return {
        success: false,
        message: error.response?.data.message,
      };
    }
    console.error("Error al aplicar a la oferta:", error);
    return {
      success: false,
      message: "Error al aplicar a la oferta",
    };
  }
}

export async function userIsAppliedToOffer(userId: string) {
  const axios = await createServerAxios();
  try {
    const response = await axios.get(`users/${userId}/profile-status`);

    if (response.status !== 200) {
      return {
        success: false,
        message: "Error al obtener el estado del perfil",
      };
    }

    const data = await response.data;

    return {
      success: true,
      data: data,
    };
  } catch (error) {
    console.error("Error al obtener el estado del perfil:", error);
    return {
      success: false,
      message: "Error al obtener el estado del perfil",
    };
  }
}
