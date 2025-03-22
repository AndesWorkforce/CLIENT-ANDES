"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

/**
 * Guarda los datos del formulario para un usuario específico
 */
export async function guardarDatosFormulario(
  userId: string, 
  datosFormulario: Record<string, any>
) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;

    if (!token) {
        console.error("[Formulario] Error: No hay token de autenticación");
        return { success: false, error: "No hay token de autenticación" };
    }

    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = `${baseUrl}users/${userId}/datos-formulario`;
    console.log("[Formulario] URL de API:", apiUrl);
    
    // Validar que los datos sean un objeto válido
    if (!datosFormulario || typeof datosFormulario !== 'object') {
      throw new Error("Formato de datos inválido");
    }

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
      body: JSON.stringify(datosFormulario),
    });

    if (!response.ok) {
      console.error("[Formulario] Error al guardar datos del formulario:", response.status);
      return { success: false, error: `Error ${response.status} al guardar datos del formulario` };
    }

    revalidatePath(`/profile`);
    return { success: true };
  } catch (error: any) {    
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
      console.error("[Formulario] Error: No hay token de autenticación");
      return { success: false, error: "No hay token de autenticación" };
    }
    
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || "";
    const apiUrl = `${baseUrl}users/${userId}/datos-formulario`;
    console.log("[Formulario] URL de API:", apiUrl);

    const response = await fetch(apiUrl, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
      },
    });
    
    if (!response.ok) {
      console.error("[Formulario] Error al obtener datos del formulario:", response.status);
      return { success: false, error: `Error ${response.status} al obtener datos del formulario` };
    }

    const data = await response.json();
    console.log("[Formulario] Datos del formulario obtenidos:", data);

    revalidatePath(`/profile`);

    return { success: true, data };
  } catch (error: any) {
    console.error("[Formulario] Error al obtener datos del formulario:", error);
    return {
      success: false,
      message: error.message || "Error al obtener los datos del formulario"
    };
  }
}    
