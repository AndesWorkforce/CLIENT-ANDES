"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { Education } from "@/app/types/education";
import { getApiUrl } from "@/services/axios.server";

export async function addEducation(userId: string, education: Education) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const response = await fetch(`${getApiUrl()}users/${userId}/education`, {
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
      console.error("[Education] Error al analizar la respuesta:", e);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    revalidatePath("/profile");

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
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const response = await fetch(
      `${getApiUrl()}users/${userId}/education/${educationId}`,
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
      console.error("[Education] Error al analizar la respuesta:", e);
      responseData = { message: responseText };
    }

    if (!response.ok) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    revalidatePath("/profile");

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
