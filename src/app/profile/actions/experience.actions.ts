"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { createServerAxios } from "@/services/axios.server";

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
  const axios = await createServerAxios();
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

    const response = await axios.patch(
      `${API_URL}users/${userId}/experience`,
      experience,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
    } catch (error) {
      console.error("[Experience] Error en addExperience:", error);
    }

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
  const axios = await createServerAxios();
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

    const response = await axios.delete(
      `${API_URL}users/${userId}/experience/${experienceId}`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );

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
    } catch (error) {
      console.error("[Experience] Error en deleteExperience:", error);
    }

    revalidatePath("/profile");

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
