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
export async function updateUserSkills(userId: string, skills: Skill[]): Promise<{ success: boolean; message: string }> {
  try {
    // Verificar que tenemos una URL de API válida
    if (!API_URL) {
      console.error("[Skills] No se encontró la URL de la API");
      return {
        success: false,
        message: "Error de configuración: URL de API no disponible"
      };
    }

    // Obtener token de autenticación
    const cookieStore = await cookies();
    const token = cookieStore.get("auth_token")?.value;
    
    if (!token) {
      console.error("[Skills] No se encontró el token de autenticación");
      return {
        success: false,
        message: "Error de autenticación: No se encontró el token"
      };
    }

    // Transform skills to required format and set default level 5 for all skills
    const skillsPayload: SkillPayload[] = skills.map(skill => ({
      nombre: skill.nombre,
      nivel: 5 
    }));

    const apiUrl = `${API_URL}users/${userId}/skills`;
    console.log("[Skills] Request URL:", apiUrl);
    console.log("[Skills] Updating skills for user:", userId);
    console.log("[Skills] Payload:", JSON.stringify(skillsPayload));

    const response = await fetch(apiUrl, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(skillsPayload),
      cache: "no-store"
    });

    // Capturar el texto de respuesta para análisis (puede ser JSON o no)
    const responseText = await response.text();
    
    // Intenta analizar como JSON si es posible
    let responseData;
    try {
      responseData = JSON.parse(responseText);
    } catch (e) {
      responseData = { message: responseText };
    }

    if (!response.ok) {
      console.error("[Skills] API error status:", response.status, response.statusText);
      console.error("[Skills] API error body:", responseData);
      
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}. ${responseData.message || ''}`
      };
    }

    console.log("[Skills] Skills updated successfully:", responseData);
    
    // Revalidar la ruta del perfil para refrescar los datos automáticamente
    revalidatePath("/profile");
    console.log("[Skills] Revalidated profile path");

    return {
      success: true,
      message: "Skills updated successfully",
    };
  } catch (error) {
    console.error("[Skills] Error updating skills:", error);
    // Mostrar más detalles del error
    const errorMessage = error instanceof Error ? error.message : "Error desconocido";
    return {
      success: false,
      message: `Failed to update skills: ${errorMessage}`
    };
  }
} 

export async function deleteAllSkills(userId: string) {
    try {
        console.log("[Skills] Iniciando proceso de eliminación de habilidades");
        
        const cookieStore = await cookies();
        const token = cookieStore.get("auth_token")?.value;

        if (!token) {
            console.error("[Skills] No se encontró el token de autenticación");
            return {
                success: false,
                message: "Error de autenticación: No se encontró el token"
            };
        }

        console.log("[Skills] Eliminando todas las habilidades para el usuario:", userId);
        
        const apiUrl = `${API_URL}users/${userId}/skills`;
        console.log("[Skills] URL de la API para eliminación:", apiUrl);
        
        const response = await fetch(apiUrl, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            cache: "no-store"
        });

        // Capturar el texto de respuesta para análisis
        const responseText = await response.text();
        console.log("[Skills] Respuesta del servidor (texto):", responseText);
        
        // Intenta analizar como JSON si es posible
        let responseData;
        try {
            responseData = JSON.parse(responseText);
            console.log("[Skills] Respuesta del servidor (JSON):", responseData);
        } catch (e) {
            responseData = { message: responseText };
            console.log("[Skills] La respuesta no es JSON válido, usando texto como mensaje");
        }

        if (!response.ok) {
            console.error("[Skills] API error status:", response.status, response.statusText);
            console.error("[Skills] API error body:", responseData);
            
            return {
                success: false,
                message: `Error del servidor: ${response.status} ${response.statusText}. ${responseData.message || ''}`
            };
        }

        console.log("[Skills] Skills deleted successfully:", responseData);
        
        // Revalidar varias rutas usando todos los modos disponibles para forzar actualización
        console.log("[Skills] Revalidando todas las rutas...");
        
        try {
            // Revalidar con opción "layout" para refrescar los layouts
            revalidatePath("/profile", "layout");
            console.log("[Skills] Revalidada /profile con modo layout");
            
            // Revalidar con opción "page" para refrescar la página completa
            revalidatePath("/profile", "page");
            console.log("[Skills] Revalidada /profile con modo page");
            
            // También revalidamos la ruta raíz por si acaso
            revalidatePath("/", "layout");
            console.log("[Skills] Revalidada / con modo layout");
            
            // Doble verificación con la ruta más específica de skills
            revalidatePath("/profile/skills", "page");
            console.log("[Skills] Revalidada /profile/skills (si existe)");
        } catch (revalidateError) {
            console.error("[Skills] Error durante revalidación:", revalidateError);
            // Continuamos ya que la eliminación fue exitosa, solo hay problema con la revalidación
        }

        return {
            success: true,
            message: "Skills deleted successfully"
        };
    } catch (error) {
        console.error("[Skills] Error crítico eliminando skills:", error);
        const errorMessage = error instanceof Error ? error.message : "Error desconocido";
        return {
            success: false,
            message: `Failed to delete skills: ${errorMessage}`
        };
    }
}