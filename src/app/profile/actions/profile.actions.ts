"use server";

import { createServerAxios } from "@/services/axios.server";
import { ContactoFormValues } from "../components/ContactoModal";
import { revalidatePath } from "next/cache";

export async function updateProfilePersonal(
  userId: string,
  profileData: ContactoFormValues
) {
  const axios = await createServerAxios();
  try {
    const response = await axios.patch(`usuarios/${userId}`, {
      telefono: profileData.telefono,
      residencia: profileData.residencia,
    });

    if (response.status !== 200) {
      console.error(
        "[Profile] API error status:",
        response.status,
        response.statusText
      );

      return {
        success: false,
        message: `Error del servidor: ${response.status} ${
          response.statusText
        }. ${response.data.message || ""}`,
      };
    }

    const responseData = response.data;

    revalidatePath("/profile");

    return {
      success: true,
      message: "Perfil actualizado correctamente",
      data: responseData,
    };
  } catch (error) {
    console.error("[Profile] Error en updateProfile:", error);
    return {
      success: false,
      message: "Error en updateProfile: " + error,
    };
  }
}
