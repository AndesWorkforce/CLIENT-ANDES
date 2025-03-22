"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

export interface Experience {
  id?: string;
  empresa: string;
  cargo: string;
  descripcion: string;
  fechaInicio: string;
  fechaFin?: string | null;
  esActual?: boolean;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function addExperience(userId: string, experience: Experience) {
  try {
    if (!API_URL) {
      console.error("[Experience] No se encontró la URL de la API");
      return {
        success: false,
        message: "Error de configuración: URL de API no disponible",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.error("[Experience] No se encontró el token de autenticación");
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const response = await fetch(`${API_URL}users/${userId}/experience`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(experience),
      cache: "no-store",
    });

    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      console.error(
        "[Experience] API error status:",
        response.status,
        response.statusText
      );
      console.error("[Experience] API error body:", responseData);

      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    console.log("[Experience] Experience added successfully:", responseData);

    // Revalidar la ruta del perfil para refrescar los datos automáticamente
    revalidatePath("/profile");
    console.log("[Experience] Revalidated profile path");

    return {
      success: true,
      message: "Experience added successfully",
    };
  } catch (error) {
    console.error("[Experience] Error en addExperience:", error);
    return {
      success: false,
      message: "Error en addExperience: " + error,
    };
  }
}

export async function deleteExperience(userId: string, experienceId: string) {
  try {
    if (!API_URL) {
      console.error("[Experience] No se encontró la URL de la API");
      return {
        success: false,
        message: "Error de configuración: URL de API no disponible",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.error("[Experience] No se encontró el token de autenticación");
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const response = await fetch(
      `${API_URL}users/${userId}/experience/${experienceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        cache: "no-store",
      }
    );

    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      console.error(
        "[Experience] API error status:",
        response.status,
        response.statusText
      );
      console.error("[Experience] API error body:", responseData);

      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    console.log("[Experience] Experience deleted successfully:", responseData);

    // Revalidar la ruta del perfil para refrescar los datos automáticamente
    revalidatePath("/profile");
    console.log("[Experience] Revalidated profile path");

    return {
      success: true,
      message: "Experience deleted successfully",
    };
  } catch (error) {
    console.error("[Experience] Error en deleteExperience:", error);
    return {
      success: false,
      message: "Error en deleteExperience: " + error,
    };
  }
}
