"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function changeEmail(userId: string, formData: FormData) {
  try {
    if (!API_URL) {
      console.error("[Account] No se encontró la URL de la API");
      return {
        success: false,
        message: "Error de configuración: URL de API no disponible",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.error("[Account] No se encontró el token de autenticación");
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const response = await fetch(`${API_URL}users/${userId}/change-email`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        emailActual: formData.get("current_email"),
        nuevoEmail: formData.get("new_email"),
        contrasena: formData.get("password"),
      }),
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
        "[Account] API error status:",
        response.status,
        response.statusText
      );
      console.error("[Account] API error body:", responseData);

      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    console.log("[Account] Email changed successfully:", responseData);

    revalidatePath("/account");
    console.log("[Account] Revalidated account path");

    return {
      success: true,
      message: "Email changed successfully",
    };
  } catch (error) {
    console.error("[Account] Error en changeEmail:", error);
    return {
      success: false,
      message: "Error en changeEmail: " + error,
    };
  }
}

export async function changePassword(userId: string, formData: FormData) {
  try {
    if (!API_URL) {
      console.error("[Account] No se encontró la URL de la API");
      return {
        success: false,
        message: "Error de configuración: URL de API no disponible",
      };
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      console.error("[Account] No se encontró el token de autenticación");
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const response = await fetch(`${API_URL}users/${userId}/change-password`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        contrasenaActual: formData.get("current_password"),
        nuevaContrasena: formData.get("new_password"),
        confirmarContrasena: formData.get("new_password"),
      }),
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
        "[Account] API error status:",
        response.status,
        response.statusText
      );
      console.error("[Account] API error body:", responseData);

      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    console.log("[Account] Password changed successfully:", responseData);

    revalidatePath("/account");
    console.log("[Account] Revalidated account path");

    return {
      success: true,
      message: "Password changed successfully",
    };
  } catch (error) {
    console.error("[Account] Error en changePassword:", error);
    return {
      success: false,
      message: "Error en changePassword: " + error,
    };
  }
}
