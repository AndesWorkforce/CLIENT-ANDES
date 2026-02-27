"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

export async function saveProfilePhoto(userId: string, photoUrl: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, error: "No hay token de autenticación" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = `${baseUrl}users/${userId}/profile-images`;

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fotoPerfil: photoUrl }),
    });

    let responseData;
    const responseText = await response.text();

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("[profile-photo-actions] Error parsing response:", e);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        error:
          responseData.message ||
          `Error ${response.status} al guardar la foto de perfil`,
      };
    }

    revalidatePath("/profile");

    return { success: true, data: responseData };
  } catch (error) {
    console.error("[profile-photo-actions] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}

export async function removeProfilePhoto(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, error: "No hay token de autenticación" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = `${baseUrl}users/${userId}/profile-images`;

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ fotoPerfil: null }),
    });

    let responseData;
    const responseText = await response.text();

    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      console.error("[removeProfilePhoto] Error parsing response:", e);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        error:
          responseData.message ||
          `Error ${response.status} al eliminar la foto de perfil`,
      };
    }

    revalidatePath("/profile");

    return { success: true, data: responseData };
  } catch (error) {
    console.error("[removeProfilePhoto] Error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
