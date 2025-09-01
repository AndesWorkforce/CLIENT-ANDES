"use server";

import { createServerAxios } from "@/services/axios.server";

export interface ResetPasswordFormValues {
  password: string;
  token: string;
}

export async function resetPasswordAction(values: ResetPasswordFormValues) {
  try {
    const { password, token } = values;
    const axios = await createServerAxios();

    try {
      const response = await axios.post(
        "auth/reset-password",
        {
          newPassword: password,
          token,
        },
        {
          maxRedirects: 0,
        }
      );

      const data = response.data;
      console.log("🔍 [Reset Password] Respuesta completa del servidor:", data);

      // La respuesta viene envuelta por el TransformResponseInterceptor
      // Estructura: { data: { success: true, message: "..." }, meta: { ... } }
      const responseData = data.data || data;

      return {
        success: responseData.success || true, // Si existe success lo usamos, sino asumimos true por status 200
        message: responseData.message || "Password reset successfully",
      };
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (axiosError: any) {
      // Si es un error relacionado con redirección 307, consideramos que el login fue exitoso
      if (axiosError.response && axiosError.response.status === 307) {
        console.log("Redirección 307 detectada en login");

        // En este caso, las cookies ya deberían haber sido establecidas por el servidor,
        // así que podemos considerar que el inicio de sesión fue exitoso
        return {
          success: true,
          data: {
            // No tenemos datos del usuario, pero el cliente lo manejará
            accessToken: "token-from-redirect",
          },
        };
      }

      // Propagar otros errores de axios
      throw axiosError;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("🔥 [Reset Password] Error:", error);

    // Handle specific API errors if possible
    let errorMessage = "Error during password reset";

    if (error.response) {
      console.log("🔍 [Reset Password] Error response:", error.response.data);

      // El error también puede venir envuelto por el interceptor
      const errorData = error.response.data?.data || error.response.data;

      errorMessage =
        errorData?.message ||
        error.response.data?.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      console.log("[DEBUG] Error request details:", {
        url: error.config?.url,
        baseURL: error.config?.baseURL,
        method: error.config?.method,
        timeout: error.config?.timeout,
      });
      errorMessage =
        "Could not connect to the server. Please check your connection.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
