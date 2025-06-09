"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function saveIdentificationImages(
  userId: string,
  frontImage: string,
  backImage: string
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
      fotoCedulaFrente: frontImage,
      fotoCedulaDorso: backImage,
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
      console.error("[IdentificationModal] Error al analizar la respuesta:", e);
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
    console.error("[identification-actions] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
