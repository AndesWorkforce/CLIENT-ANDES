"use server";

import { createServerAxios } from "@/services/axios.server";
import { revalidatePath } from "next/cache";

interface ApiResponse {
  success: boolean;
  message?: string;
  error?: string;
}

export async function aceptarPoliticaDatos({
  userId,
}: {
  userId: string;
}): Promise<ApiResponse> {
  try {
    const axios = await createServerAxios();

    // Ahora hacemos la llamada al endpoint correcto
    const response = await axios.patch(`users/${userId}/politica-datos`);

    if (response.status !== 200) {
      return {
        success: false,
        error: response.data?.message || "Error accepting data policy",
      };
    }

    // Revalidar el perfil para actualizar la UI
    revalidatePath("/profile");

    return {
      success: true,
      message: "Data policy accepted successfully",
    };
  } catch (error) {
    console.error("[aceptarPoliticaDatos] Error:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
}
