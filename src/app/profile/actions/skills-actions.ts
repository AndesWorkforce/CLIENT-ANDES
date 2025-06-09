"use server";

import { Skill } from "@/app/types/skill";
import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerAxios } from "@/services/axios.server";

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
  const axios = await createServerAxios();
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

    // Ahora solo enviamos un único skill que contiene todo el texto
    // Si hay más de uno por compatibilidad con código anterior, usamos solo el primero
    const skillsPayload: SkillPayload[] = [
      {
        nombre: skills.length > 0 ? skills[0].nombre : "",
        nivel: 5,
      },
    ];

    const apiUrl = `${API_URL}users/${userId}/skills`;

    // Corregimos la forma de enviar datos con axios.patch
    // El payload va como segundo parámetro y las opciones como tercero
    const response = await axios.patch(apiUrl, skillsPayload, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.data;

    if (response.status !== 200) {
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
  const axios = await createServerAxios();
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

    const response = await axios.delete(apiUrl, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const responseData = await response.data;

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${responseData.message || ""}`,
      };
    }

    revalidatePath("/profile", "layout");

    revalidatePath("/profile", "page");

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
