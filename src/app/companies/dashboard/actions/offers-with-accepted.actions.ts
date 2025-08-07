"use server";
import { createServerAxios } from "@/services/axios.server";

export type OffersWithAcceptedResponse =
  | { success: true; data: OfferWithAccepted[]; message?: undefined }
  | { success: false; message: string; data?: undefined };

export type Candidato = {
  id: string;
  nombre: string;
  apellido: string;
  correo: string;
  telefono?: string;
  pais?: string;
  residencia?: string;
};

export type Postulacion = {
  id: string;
  candidato: Candidato;
  fechaPostulacion?: string;
  estadoPostulacion?: string;
};

export interface OfferWithAccepted {
  id: string;
  titulo: string;
  descripcion: string;
  postulaciones: Postulacion[];
}

export async function getOffersWithAccepted(empresaId: string) {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(
      `/companies/${empresaId}/offers-with-accepted`
    );

    if (response.status !== 200) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          response.data.message || ""
        }`,
      };
    }

    return {
      success: true,
      data: response.data as OfferWithAccepted[],
    };
  } catch (error: any) {
    console.error("[Companies] Error fetching offers with accepted:", error);
    return {
      success: false,
      message:
        error.response?.data?.message || "Error fetching offers with accepted",
    };
  }
}
