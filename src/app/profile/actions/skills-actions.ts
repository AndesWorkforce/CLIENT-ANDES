"use server";

import { Skill } from "@/app/types/skill";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

interface SkillPayload {
  nombre: string;
  nivel: number;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Updates user skills in the backend API
 * @param userId User ID
 * @param skills Array of skills
 * @returns Response from the API
 */
export async function updateUserSkills(
  userId: string,
  skills: Skill[]
): Promise<{ success: boolean; message: string }> {
  try {
    // Verificar que tenemos una URL de API válida
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

    const skillsPayload: SkillPayload[] = skills.map((skill) => ({
      nombre: skill.nombre,
      nivel: 5,
    }));

    const apiUrl = `${API_URL}users/${userId}/skills`;

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(skillsPayload),
      cache: "no-store",
    });

    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      console.error("[Skills] Error al analizar la respuesta:", e);
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
      message: "Skills updated successfully",
    };
  } catch (error) {
    console.error("[Skills] Error updating skills:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return {
      success: false,
      message: `Failed to update skills: ${errorMessage}`,
    };
  }
}

export async function deleteAllSkills(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token",
      };
    }

    const apiUrl = `${API_URL}users/${userId}/skills`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      cache: "no-store",
    });

    const responseText = await response.text();

    let responseData;
    try {
      responseData = JSON.parse(responseText);
      console.log("[Skills] Respuesta del servidor (JSON):", responseData);
    } catch (e) {
      console.error("[Skills] Error al analizar la respuesta:", e);
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

    try {
      revalidatePath("/profile", "layout");

      revalidatePath("/profile", "page");

      revalidatePath("/", "layout");

      revalidatePath("/profile/skills", "page");
    } catch (revalidateError) {
      console.error("[Skills] Error durante revalidación:", revalidateError);
    }

    return {
      success: true,
      message: "Skills deleted successfully",
    };
  } catch (error) {
    console.error("[Skills] Error crítico eliminando skills:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Error desconocido";
    return {
      success: false,
      message: `Failed to delete skills: ${errorMessage}`,
    };
  }
}
