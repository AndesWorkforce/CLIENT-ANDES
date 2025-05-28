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
      pais: profileData.pais,
      paisImagen: profileData.paisImagen,
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
      message: "Profile updated successfully",
      data: responseData,
    };
  } catch (error) {
    console.error("[Profile] Error in updateProfile:", error);
    return {
      success: false,
      message: "Error in updateProfile: " + error,
    };
  }
}
