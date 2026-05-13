"use server";

import { AdminExperience } from "../components/AdminExperienceModal";
import { revalidatePath } from "next/cache";
import { createServerAxios } from "@/services/axios.server";
import { AxiosError } from "axios";

export async function getCandidateExperiences(candidateId: string) {
  try {
    const axios = await createServerAxios();
    const { data } = await axios.get(`experiencias/candidato/${candidateId}`, {
      headers: { "Cache-Control": "no-store" },
    });
    return { success: true, data };
  } catch (error) {
    console.error("Error obteniendo experiencias:", error);
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : (error as Error).message;
    return { success: false, error: message };
  }
}

export async function createExperience(
  candidateId: string,
  experienceData: AdminExperience
) {
  try {
    const axios = await createServerAxios();
    const { data } = await axios.post("experiencias", {
      ...experienceData,
      candidatoId: candidateId,
    });
    revalidatePath(`/admin/dashboard/candidates/${candidateId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error creando experiencia:", error);
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : (error as Error).message;
    return { success: false, error: message };
  }
}

export async function updateExperience(
  experienceId: string,
  candidateId: string,
  experienceData: AdminExperience
) {
  try {
    const axios = await createServerAxios();
    const { data } = await axios.put(
      `experiencias/${experienceId}`,
      experienceData
    );
    revalidatePath(`/admin/dashboard/candidates/${candidateId}`);
    return { success: true, data };
  } catch (error) {
    console.error("Error actualizando experiencia:", error);
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : (error as Error).message;
    return { success: false, error: message };
  }
}

export async function deleteExperience(
  experienceId: string,
  candidateId: string
) {
  try {
    const axios = await createServerAxios();
    await axios.delete(`experiencias/${experienceId}`);
    revalidatePath(`/admin/dashboard/candidates/${candidateId}`);
    return { success: true };
  } catch (error) {
    console.error("Error eliminando experiencia:", error);
    const message =
      error instanceof AxiosError
        ? error.response?.data?.message || error.message
        : (error as Error).message;
    return { success: false, error: message };
  }
}
