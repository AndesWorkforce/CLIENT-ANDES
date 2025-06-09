"use server";

import { AdminExperience } from "../components/AdminExperienceModal";
import { revalidatePath } from "next/cache";

// Función para obtener todas las experiencias de un candidato
export async function getCandidateExperiences(candidateId: string) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/experiencias/candidato/${candidateId}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error("Error al obtener experiencias");
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error("Error obteniendo experiencias:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Función para crear una nueva experiencia
export async function createExperience(
  candidateId: string,
  experienceData: AdminExperience
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/experiencias`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...experienceData,
          candidatoId: candidateId,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al crear experiencia");
    }

    const data = await response.json();
    revalidatePath(`/admin/dashboard/candidates/${candidateId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error creando experiencia:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Función para actualizar una experiencia existente
export async function updateExperience(
  experienceId: string,
  candidateId: string,
  experienceData: AdminExperience
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/experiencias/${experienceId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(experienceData),
      }
    );

    if (!response.ok) {
      throw new Error("Error al actualizar experiencia");
    }

    const data = await response.json();
    revalidatePath(`/admin/dashboard/candidates/${candidateId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error actualizando experiencia:", error);
    return { success: false, error: (error as Error).message };
  }
}

// Función para eliminar una experiencia
export async function deleteExperience(
  experienceId: string,
  candidateId: string
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/experiencias/${experienceId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar experiencia");
    }

    revalidatePath(`/admin/dashboard/candidates/${candidateId}`);
    return { success: true };
  } catch (error) {
    console.error("Error eliminando experiencia:", error);
    return { success: false, error: (error as Error).message };
  }
}
