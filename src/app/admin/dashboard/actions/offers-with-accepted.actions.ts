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
  empresaNombre?: string; // Para el endpoint global, nombre de la firma
};

export type Postulacion = {
  id: string;
  candidato: Candidato;
  fechaPostulacion?: string;
  estadoPostulacion?: string;
};

// Para el endpoint global, cada postulante puede tener empresa asociada
export interface OfferWithAcceptedGlobal {
  id: string;
  titulo: string;
  descripcion: string;
  postulaciones: (Postulacion & { candidato: Candidato })[];
}

export interface OfferWithAccepted {
  id: string;
  titulo: string;
  descripcion: string;
  postulaciones: Postulacion[];
}

export async function getAllOffersWithAccepted(empresaId: string) {
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
  } catch {
    return {
      success: false,
      message: "Error fetching offers with accepted",
    };
  }
}

// Acción para el endpoint global de super admin
export async function getAllOffersWithAcceptedGlobal() {
  try {
    const axios = await createServerAxios();
    const response = await axios.get(`/companies/offers-with-accepted-global`);

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
      data: response.data as OfferWithAcceptedGlobal[],
    };
  } catch {
    return {
      success: false,
      message: "Error fetching global offers with accepted",
    };
  }
}
