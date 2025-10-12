"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Guarda los datos del formulario para un usuario específico
 */
export async function guardarDatosFormulario(
  userId: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  datosFormulario: Record<string, any>
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, error: "No hay token de autenticación" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    // Endpoint correcto en el API Nest: /usuarios/:id/formulario (PATCH)
    const apiUrl = `${baseUrl}usuarios/${userId}/formulario`;

    if (!datosFormulario || typeof datosFormulario !== "object") {
      throw new Error("Formato de datos inválido");
    }

    // El API espera el DTO ActualizarFormularioDto; cuando solo enviamos
    // los datos adicionales del formulario, debemos anidarlos en
    // { datosFormulario: { datosAdicionales: { ... } } }
    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        datosFormulario: {
          datosAdicionales: datosFormulario,
        },
      }),
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Error ${response.status} al guardar datos del formulario`,
      };
    }

    revalidatePath(`/profile`);
    return { success: true };
  } catch (error) {
    console.error("[Formulario] Error al guardar datos del formulario:", error);
    return {
      success: false,
      error: "Error desconocido al guardar datos del formulario",
    };
  }
}

/**
 * Obtiene los datos del formulario de un usuario específico
 */
export async function eliminarDatosFormulario(userId: string) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
      return { success: false, error: "No hay token de autenticación" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = `${baseUrl}users/${userId}/datos-formulario`;

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      return {
        success: false,
        error: `Error ${response.status} al obtener datos del formulario`,
      };
    }

    const data = await response.json();

    revalidatePath(`/profile`);

    return { success: true, data };
  } catch (error) {
    console.error("[Formulario] Error al obtener datos del formulario:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Error desconocido",
    };
  }
}
