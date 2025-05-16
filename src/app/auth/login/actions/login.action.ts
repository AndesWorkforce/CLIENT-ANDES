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
    // Obtenemos el axios normal configurado con token y todo
    const axiosInstance = await createServerAxios();

    // Crear una configuración específica para la solicitud de login
    // sin afectar la configuración global de axios
    const config = {
      maxRedirects: 0, // No seguir redirecciones automáticamente
      validateStatus: (status: number) =>
        (status >= 200 && status < 300) || status === 307, // Aceptar 307 como válido
    };

    try {
      // Intentamos el post con la configuración específica
      const response = await axiosInstance.post(
        "auth/login",
        {
          correo,
          contrasena,
        },
        config
      );

      // Si recibimos un 307, significa que el login fue exitoso pero hay una redirección
      if (response.status === 307) {
        console.log("Redirección 307 detectada", response.headers?.location);

        // Intentar determinar el estado del perfil antes de decidir la redirección
        try {
          // Usamos el mismo axios que ya tenemos configurado
          const userResponse = await axiosInstance
            .get("users/me", {
              headers: {
                "Cache-Control": "no-store, no-cache",
              },
            })
            .catch(() => null); // Ignorar errores, podría no tener permisos todavía

          let perfilCompleto = false;
          if (userResponse && userResponse.data) {
            // Determinar si el perfil está completo según la respuesta
            perfilCompleto = userResponse.data.perfilCompleto === "COMPLETO";
          }

          // El token temporal no es necesario, el backend ya debería haberlo establecido
          return {
            success: true,
            data: {
              redirectError: true,
              // La URL depende del estado del perfil
              redirectUrl: perfilCompleto ? "/pages/offers" : "/profile",
              usuario: {
                perfilCompleto: perfilCompleto ? "COMPLETO" : "INCOMPLETO",
              },
            },
          };
        } catch (userError) {
          console.error("Error al obtener información del usuario:", userError);
          // Si no podemos determinar el estado del perfil, redirigimos a un lugar seguro
          return {
            success: true,
            data: {
              redirectError: true,
              redirectUrl: "/profile", // Por defecto enviamos a profile que es más seguro
              usuario: {
                perfilCompleto: "INCOMPLETO",
              },
            },
          };
        }
      }

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
    } catch (axiosError: any) {
      // Si es un error relacionado con redirección 307, manejarlo especialmente
      if (axiosError.response && axiosError.response.status === 307) {
        console.log(
          "Redirección 307 en el catch",
          axiosError.response.headers?.location
        );

        // Intentar determinar el estado del perfil para la redirección correcta
        try {
          // Usamos el mismo axios que ya tenemos configurado
          const userResponse = await axiosInstance
            .get("users/me", {
              headers: { "Cache-Control": "no-store, no-cache" },
            })
            .catch(() => null);

          let perfilCompleto = false;
          if (userResponse && userResponse.data) {
            perfilCompleto = userResponse.data.perfilCompleto === "COMPLETO";
          }

          return {
            success: true,
            data: {
              redirectError: true,
              redirectUrl: perfilCompleto ? "/pages/offers" : "/profile",
              usuario: {
                perfilCompleto: perfilCompleto ? "COMPLETO" : "INCOMPLETO",
              },
            },
          };
        } catch (userError) {
          console.error("Error al verificar perfil en catch:", userError);
          return {
            success: true,
            data: {
              redirectError: true,
              redirectUrl: "/profile", // Por defecto a profile como medida de seguridad
              usuario: {
                perfilCompleto: "INCOMPLETO",
              },
            },
          };
        }
      }

      // Propagar otros errores de axios
      throw axiosError;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error("Error en el formulario:", error);

    // Verificamos directamente si hay información de redirección en el error
    if (error.response && error.response.status === 307) {
      try {
        // Necesitamos crear una nueva instancia de axios ya que estamos en el catch
        const tempAxios = await createServerAxios();
        const userResponse = await tempAxios
          .get("users/me", {
            headers: { "Cache-Control": "no-store, no-cache" },
          })
          .catch(() => null);

        let perfilCompleto = false;
        if (userResponse && userResponse.data) {
          perfilCompleto = userResponse.data.perfilCompleto === "COMPLETO";
        }

        return {
          success: true,
          data: {
            redirectError: true,
            redirectUrl: perfilCompleto ? "/pages/offers" : "/profile",
            usuario: {
              perfilCompleto: perfilCompleto ? "COMPLETO" : "INCOMPLETO",
            },
          },
        };
      } catch (userError) {
        console.error("Error verificando perfil en última sección:", userError);
        return {
          success: true,
          data: {
            redirectError: true,
            redirectUrl: "/profile",
            usuario: {
              perfilCompleto: "INCOMPLETO",
            },
          },
        };
      }
    }

    // Manejar errores específicos de la API si es posible
    let errorMessage = "Error al iniciar sesión";

    if (error.response) {
      errorMessage =
        error.response.data?.message ||
        `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
      errorMessage =
        "No se pudo conectar con el servidor. Verifique su conexión.";
    } else if (
      error.message &&
      (error.message.includes("NEXT_REDIRECT") || error.message.includes("307"))
    ) {
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
