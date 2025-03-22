"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Education } from "@/app/types/education";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function addEducation(userId: string, education: Education) {
  try {
    if (!API_URL) {
      console.error("[Education] No se encontró la URL de la API");
      return {
        success: false,
        message: "Error de configuración: URL de API no disponible",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.error("[Education] No se encontró el token de autenticación");
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const response = await fetch(`${API_URL}users/${userId}/education`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(education),
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
        "[Education] API error status:",
        response.status,
        response.statusText
      );
      console.error("[Education] API error body:", responseData);

      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    console.log("[Education] Education added successfully:", responseData);

    revalidatePath("/profile");
    console.log("[Education] Revalidated profile path");

    return {
      success: true,
      message: "Education added successfully",
    };
  } catch (error) {
    console.error("[Education] Error en addEducation:", error);
    return {
      success: false,
      message: "Error en addEducation: " + error,
    };
  }
}

export async function deleteEducation(userId: string, educationId: string) {
  try {
    if (!API_URL) {
      console.error("[Education] No se encontró la URL de la API");
      return {
        success: false,
        message: "Error de configuración: URL de API no disponible",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.error("[Education] No se encontró el token de autenticación");
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const response = await fetch(
      `${API_URL}users/${userId}/education/${educationId}`,
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
        "[Education] API error status:",
        response.status,
        response.statusText
      );
      console.error("[Education] API error body:", responseData);

      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    console.log("[Education] Education deleted successfully:", responseData);

    // Revalidar la ruta del perfil para refrescar los datos automáticamente
    revalidatePath("/profile");
    console.log("[Education] Revalidated profile path");

    return {
      success: true,
      message: "Education deleted successfully",
    };
  } catch (error) {
    console.error("[Education] Error en deleteEducation:", error);
    return {
      success: false,
      message: "Error en deleteEducation: " + error,
    };
  }
}
