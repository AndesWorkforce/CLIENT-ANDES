"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function removeVideoPresentation(userId: string) {
  try {
    if (!API_URL) {
      return {
        success: false,
        message: "Error de configuración: URL de API no disponible",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const response = await fetch(
      `${API_URL}users/${userId}/video-presentacion`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      return {
        success: false,
        message: "Error al eliminar el video de presentación",
      };
    }

    const data = await response.json();
    console.log("[VideoActions] Respuesta del servidor:", data);

    revalidatePath("/profile");

    return {
      success: true,
      message: "Video de presentación eliminado correctamente",
    };
  } catch (error) {
    console.error("[VideoActions] Error:", error);
    return {
      success: false,
      message: "Error al eliminar el video de presentación",
    };
  }
}

/**
 * Guarda la URL del video de presentación en el perfil del usuario
 * @param userId ID del usuario
 * @param videoUrl URL del video de presentación
 * @returns Resultado de la operación
 */
export async function saveVideoUrl(userId: string, videoUrl: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, error: "No hay token de autenticación" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = `${baseUrl}users/${userId}/profile-images`;

    const payload = {
      videoPresentacion: videoUrl,
    };

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    let responseData;
    const responseText = await response.text();

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("[VideoAction] Error al guardar URL del video:", e);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        error:
          responseData.message ||
          `Error ${response.status} al guardar URL del video`,
      };
    }

    revalidatePath("/profile");

    return { success: true, data: responseData };
  } catch (error) {
    console.error("[VideoAction] Error al guardar URL del video:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al guardar URL del video",
    };
  }
}
