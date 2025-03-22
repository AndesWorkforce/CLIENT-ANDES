"use server"

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function removeVideoPresentation(userId: string) {
    try {
        if (!API_URL) {
            console.error("[VideoActions] No se encontró la URL de la API");
            return {
                success: false,
                message: "Error de configuración: URL de API no disponible"
            };
        }

        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if(!token) {
            console.error("[VideoActions] No se encontró el token de autenticación");
            return {
                success: false,
                message: "Error de autenticación: No se encontró el token"
            };
        }

        const response = await fetch(`${API_URL}users/${userId}/video-presentacion`, {
            method: "DELETE",
            headers: {
                "Authorization": `Bearer ${token}`
            }
        });

        if (!response.ok) {
            console.error("[VideoActions] Error al eliminar el video de presentación");
            return {
                success: false,
                message: "Error al eliminar el video de presentación"
            };
        }
        
        const data = await response.json();
        console.log("[VideoActions] Respuesta del servidor:", data);

        // Revalidar la ruta del perfil para actualizar los datos
        revalidatePath("/profile");
        
        return {
            success: true,
            message: "Video de presentación eliminado correctamente"
        };

    } catch (error) {
        console.error("[VideoActions] Error:", error);
        return {
            success: false,
            message: "Error al eliminar el video de presentación"
        };
    }
}

/**
 * Guarda la URL del video de presentación en el perfil del usuario
 * @param userId ID del usuario
 * @param videoUrl URL del video de presentación
 * @returns Resultado de la operación
 */
export async function saveVideoUrl(userId: string, videoUrl: string) {
  try {
    console.log("[VideoAction] Guardando URL del video para usuario:", userId);
    console.log("[VideoAction] URL del video:", videoUrl);
    
    // Obtener token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
      console.error("[VideoAction] Error: No hay token de autenticación");
      return { success: false, error: "No hay token de autenticación" };
    }
    
    // Construir URL de la API
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || '';
    const apiUrl = `${baseUrl}users/${userId}/profile-images`;
    console.log("[VideoAction] URL de API:", apiUrl);
    
    // Datos a enviar
    const payload = {
        videoPresentacion: videoUrl
    };
    
    // Realizar petición a la API
    const response = await fetch(apiUrl, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });
    
    // Parsear respuesta
    let responseData;
    const responseText = await response.text();
    
    try {
      responseData = responseText ? JSON.parse(responseText) : {};
    } catch (e) {
      responseData = { message: responseText };
    }
    
    // Verificar si la respuesta fue exitosa
    if (!response.ok) {
      console.error("[VideoAction] Error al guardar URL del video:", response.status, responseData);
      return { 
        success: false, 
        error: responseData.message || `Error ${response.status} al guardar URL del video` 
      };
    }
    
    // Revalidar la ruta del perfil para actualizar los datos
    revalidatePath("/profile");
    
    console.log("[VideoAction] URL del video guardada con éxito:", responseData);
    return { success: true, data: responseData };
    
  } catch (error) {
    console.error("[VideoAction] Error al guardar URL del video:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Error desconocido al guardar URL del video" 
    };
  }
}

/**
 * DOCUMENTACIÓN PARA EL BACKEND:
 * 
 * Para que el sistema de carga de videos funcione correctamente, es necesario implementar
 * un endpoint REST en el backend con la siguiente especificación:
 * 
 * Endpoint: POST /api/files/upload-video
 * 
 * Funcionalidad:
 * - Recibe un archivo de video enviado como FormData con el campo 'file'
 * - El backend debe encargarse de subir este archivo a Cloudflare R2
 * - Debe incluir los encabezados CORS adecuados para permitir solicitudes desde el cliente
 * 
 * Respuesta esperada (JSON):
 * {
 *   "success": true,
 *   "fileUrl": "https://appwiseinnovations.dev/r2-appwise/videos/nombre-archivo.mp4"
 * }
 * 
 * El endpoint debe manejar errores adecuadamente y devolver códigos HTTP apropiados
 * con mensajes de error descriptivos cuando sea necesario.
 */
