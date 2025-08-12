"use server";

import { createServerAxios } from "@/services/axios.server";

export interface ForgotPasswordFormValues {
  email: string;
}

export async function forgotPasswordAction(values: ForgotPasswordFormValues) {
  try {
    const { email } = values;
    const axios = await createServerAxios();

    try {
      const response = await axios.post(
        "auth/forgot-password",
        {
          email,
        },
        {
          maxRedirects: 0,
        }
      );

      const data = response.data;

      return {
        success: data.success,
        message: data.message,
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
    console.error("Form error:", error);

    // Handle specific API errors if possible
    let errorMessage = "Error during password recovery";

    if (error.response) {
      errorMessage =
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
