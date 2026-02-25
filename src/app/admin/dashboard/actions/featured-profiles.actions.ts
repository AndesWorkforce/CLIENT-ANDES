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

export type FeaturedProfilesResponse =
  | { success: true; data: FeaturedProfile[] }
  | { success: false; message: string };

export type ToggleFeaturedResponse =
  | { success: true; data: { id: string; isFeatured: boolean; message: string } }
  | { success: false; message: string };

/**
 * Obtiene todos los usuarios marcados como featured.
 * Endpoint público: GET /usuarios/featured
 */
export async function getFeaturedProfiles(): Promise<FeaturedProfilesResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.get("/usuarios/featured");

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      };
    }

    // TransformResponseInterceptor wraps the payload as { meta, data }
    const payload = response.data?.data ?? response.data;
    return { success: true, data: payload as FeaturedProfile[] };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

/**
 * Alterna el estado isFeatured de un usuario.
 * Endpoint admin: PATCH /usuarios/:id/toggle-featured
 */
export async function toggleFeaturedProfile(
  userId: string
): Promise<ToggleFeaturedResponse> {
  try {
    const axios = await createServerAxios();
    const response = await axios.patch(`/usuarios/${userId}/toggle-featured`);

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      };
    }

    const payload = response.data?.data ?? response.data;
    return { success: true, data: payload };
  } catch (error) {
    return {
      success: false,
      message:
        error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
