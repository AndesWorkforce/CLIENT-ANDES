"use server";

import { LoginFormValues } from "../schemas/login.schema";
import { cookies } from "next/headers";
import { createServerAxios } from "@/services/axios.server";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

// Duración de la cookie - 7 días en segundos
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export async function loginAction(values: LoginFormValues) {
  try {
    const { correo, contrasena } = values;
    const axios = await createServerAxios();

    // Configuración para manejar mejor las respuestas de error
    const response = await axios.post("auth/login", {
      correo,
      contrasena,
    });

    const data = response.data;

    // Si el inicio de sesión fue exitoso, establecer cookies
    if (data && data.data) {
      const userData = data.data.usuario || data.data;
      const token = data.data.accessToken || "default-token-placeholder";

      try {
        // Establecer cookie para el token (HTTP-only para seguridad)
        const cookieStore = cookies();
        const cookieHandler = await cookieStore;

        cookieHandler.set({
          name: AUTH_COOKIE,
          value: token,
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          maxAge: COOKIE_MAX_AGE,
          path: "/",
          sameSite: "strict",
        });

        // Establecer cookie con información del usuario
        cookieHandler.set({
          name: USER_INFO_COOKIE,
          value: JSON.stringify(userData),
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          maxAge: COOKIE_MAX_AGE,
          path: "/",
          sameSite: "strict",
        });

        console.log("Cookies establecidas correctamente");
      } catch (cookieError) {
        console.error("Error al establecer cookies:", cookieError);
      }

      return {
        success: true,
        data: data.data,
      };
    } else {
      return {
        success: false,
        error: "Error al iniciar sesión: Respuesta inválida del servidor",
      };
    }
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error en el formulario:", error);

    // Manejar errores específicos de la API si es posible
    let errorMessage = "Error al iniciar sesión";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage =
        "No se pudo conectar con el servidor. Verifique su conexión.";
    } else if (error.message && error.message.includes("NEXT_REDIRECT")) {
      // Capturar específicamente errores de redirección de Next.js
      return {
        success: true,
        data: {
          redirectError: true,
          redirectMessage:
            "La sesión se inició correctamente, pero hubo un problema con la redirección.",
        },
      };
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
