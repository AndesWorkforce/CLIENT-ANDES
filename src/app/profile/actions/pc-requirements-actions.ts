"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Guarda las URLs de las imágenes de requisitos de PC en el perfil del usuario
 * @param userId ID del usuario
 * @param imageUrls Array con las URLs de las imágenes (PCSpecs e Internet)
 * @returns Resultado de la operación
 */
export async function savePCRequirementsImages(
  userId: string,
  requerimientosPC: string,
  testVelocidad: string
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, error: "No hay token de autenticación" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = `${baseUrl}users/${userId}/profile-images`;

    const payload = {
      imagenRequerimientosPC: requerimientosPC,
      imagenTestVelocidad: testVelocidad,
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
      console.error("[PCRequirements] Error al analizar la respuesta:", e);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        error:
          responseData.message ||
          `Error ${response.status} al guardar URLs de imágenes`,
      };
    }

    revalidatePath("/profile");

    return { success: true, data: responseData };
  } catch (error) {
    console.error("[PCRequirements] Error al guardar URLs de imágenes:", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Error desconocido al guardar URLs de imágenes",
    };
  }
}

/**
 * Elimina las URLs de las imágenes de requisitos de PC del perfil del usuario
 * @param userId ID del usuario
 * @returns Resultado de la operación
 */
export async function deletePCRequirementsImages(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, error: "No hay token de autenticación" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = `${baseUrl}users/${userId}/test-images`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Error ${response.status} al eliminar URLs de imágenes`,
      };
    }

    revalidatePath("/profile");

    return { success: true };
  } catch (error) {
    console.error(
      "[PCRequirements] Error al eliminar URLs de imágenes:",
      error
    );
    return {
      success: false,
      error: "Error desconocido al eliminar URLs de imágenes",
    };
  }
}
