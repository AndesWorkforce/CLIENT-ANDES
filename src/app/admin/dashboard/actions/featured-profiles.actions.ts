"use server";

import { createServerAxios } from "@/services/axios.server";

export type FeaturedProfile = {
  id: string;
  nombre: string | null;
  apellido: string | null;
  pais: string | null;
  paisImagen: string | null;
  fotoPerfil: string | null;
  position: string | null;
  client: string | null;
};

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function getFeaturedProfiles(): Promise<
  { success: true; data: FeaturedProfile[] } | { success: false; message: string }
> {
  try {
    if (!API_URL) {
      return { success: false, message: "Configuration error: API URL not available" };
    }

    const axios = await createServerAxios();
    const response = await axios.get<{ data: FeaturedProfile[] }>(`${API_URL}usuarios/featured`);
    const profiles = Array.isArray(response.data.data) ? response.data.data : [];

    return { success: true, data: profiles };
  } catch (error) {
    console.error("[getFeaturedProfiles] Error:", error);
    return { success: false, message: "Error fetching featured profiles" };
  }
}
