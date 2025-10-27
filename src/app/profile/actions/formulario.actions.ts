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

    // Capa defensiva: permitir solo las preguntas del cuestionario conocidas
    const ALLOWED_QUESTIONS = new Set<string>([
      "What is your preferred first and last name?",
      "What phone number do you use for WhatsApp?",
      "In which city and country do you live?",
      "Have you been referred by someone?",
      "Referrer Name",
      "If you have a Gmail email address, what is it? (Some training documents are most easily shared with google accounts.)",
      "What 3 words best describe you and why?",
      "What unique qualities make your services stand out?",
      "Please write a few sentences about any previous experiences you have had doing services like Customer Service, Call Center, or Administrative Assistance",
      "On a scale of 1-10, how comfortable are you with making and/or taking calls with native English speakers? Please explain your answer.",
      "What type of computer do you use?",
      "How much RAM is available on your computer?",
      "How many monitors do you currently have/use for work?",
      "What type of headset do you currently have? How does it connect with your computer?",
      "What Internet provider do you use?",
      "What is the URL for their website?",
      "Do you use a wired internet connection?",
    ]);

    const sanitizedFormulario = Object.fromEntries(
      Object.entries(datosFormulario).filter(([key, value]) => {
        if (!ALLOWED_QUESTIONS.has(key)) return false;
        if (typeof value === "string") return value.trim().length > 0;
        if (Array.isArray(value)) return value.length > 0;
        if (value && typeof value === "object")
          return Object.keys(value).length > 0;
        return value !== undefined && value !== null;
      })
    );

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
          datosAdicionales: sanitizedFormulario,
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
