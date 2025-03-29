"use server";

import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function changeEmail(userId: string, formData: FormData) {
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
      console.error("[Account] Error al parsear la respuesta:", e);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          responseData.message || ""
        }`,
      };
    }

    revalidatePath("/account");

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
      console.error("[Account] Error al parsear la respuesta:", e);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        message: `Server error: ${response.status} ${response.statusText}. ${
          responseData.message || ""
        }`,
      };
    }

    revalidatePath("/account");

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
