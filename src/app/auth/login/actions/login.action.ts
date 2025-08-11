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

    // Debug logs para producción
    console.log("[DEBUG] API_URL:", process.env.NEXT_PUBLIC_API_URL);
    console.log("[DEBUG] NODE_ENV:", process.env.NODE_ENV);
    console.log("[DEBUG] Axios base URL:", axios.defaults.baseURL);

    // Intentar hacer el login - sin seguir redirecciones automáticamente
    // para evitar problemas con Next.js
    try {
      const response = await axios.post(
        "auth/login",
        {
          correo,
          contrasena,
        },
        {
          maxRedirects: 0, // No seguir redirecciones automáticamente para esta solicitud
        }
      );

      const data = response.data;

      // Si el inicio de sesión fue exitoso, establecer cookies
      if (data && data.data) {
        const userData = data.data.usuario || data.data;
        const token = data.data.accessToken || "default-token-placeholder";
        console.log("Datos de usuario:", userData);
        console.log("Token de acceso:", token);
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
    console.error("Error en el formulario:", error);

    // Manejar errores específicos de la API si es posible
    let errorMessage = "Error al iniciar sesión";

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
        "No se pudo conectar con el servidor. Verifique su conexión.";
    } else if (error.message) {
      errorMessage = error.message;
    }

    return {
      success: false,
      error: errorMessage,
    };
  }
}
