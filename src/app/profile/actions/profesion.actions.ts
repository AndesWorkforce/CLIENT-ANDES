"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

export async function updateProfesion(userId: string, profesion: string | null) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`usuarios/${userId}`, { profesion });

    if (response.status !== 200) {
      return {
        success: false,
        message: `Error del servidor: ${response.status} ${response.statusText}`,
      };
    }

    revalidatePath("/profile");
    return { success: true, message: "Profession updated successfully" };
  } catch (error) {
    return { success: false, message: "Error updating profession: " + error };
  }
}
