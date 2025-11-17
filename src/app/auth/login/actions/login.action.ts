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
    const { correo, contrasena, selectedRole, selectedCompanyId } =
      values as LoginFormValues;

    const axios = await createServerAxios();
    const cookieStore = await cookies();
    const cookieSelectedCompany = cookieStore.get("selected_company_id")?.value;
    const effectiveCompanyId = selectedCompanyId || cookieSelectedCompany;
    // Limpiar la cookie temporal si existe (one-shot)
    if (cookieSelectedCompany) {
      cookieStore.set({
        name: "selected_company_id",
        value: "",
        maxAge: 0,
        path: "/",
      });
    }

    console.log("[loginAction] payload", {
      correo,
      hasPassword: Boolean(contrasena?.length),
      selectedRole,
      selectedCompanyId,
      cookieSelectedCompany,
      effectiveCompanyId,
    });

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
          ...(selectedRole ? { selectedRole } : {}),
          ...(effectiveCompanyId
            ? { selectedCompanyId: effectiveCompanyId }
            : {}),
        },
        {
          maxRedirects: 0, // No seguir redirecciones automáticamente para esta solicitud
          headers: {
            ...(effectiveCompanyId
              ? { "x-company-id": effectiveCompanyId }
              : {}),
          },
        }
      );

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

          // Resolver empresa activa aun cuando no vino selectedCompanyId
          const resolvedCompanyId =
            effectiveCompanyId ||
            // Empresa de EMPRESA
            userData?.empresaId ||
            // Empresa dentro de empleadoEmpresa
            userData?.empleadoEmpresa?.empresa?.id ||
            // companyOptions (si backend lo envía y hay 1)
            (Array.isArray(userData?.companyOptions?.companies) &&
            userData?.companyOptions?.companies?.length === 1
              ? userData.companyOptions.companies[0]?.id
              : undefined);

          if (resolvedCompanyId) {
            cookieHandler.set({
              name: "active_company_id",
              value: String(resolvedCompanyId),
              httpOnly: true,
              secure: process.env.NODE_ENV === "production",
              maxAge: COOKIE_MAX_AGE,
              path: "/",
              sameSite: "strict",
            });
          }

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
    console.error("[loginAction] Error en el formulario:", error?.message);
    // Capturar payloads útiles si existen
    if (error?.response) {
      console.error(
        "[loginAction] error.response.status:",
        error.response.status
      );
      console.error("[loginAction] error.response.data:", error.response.data);
    }
    if (error?.request && !error?.response) {
      console.error("[loginAction] error.request (no response)");
    }

    // Extraer un mensaje amigable
    const data = error?.response?.data;
    const rawMessage =
      (Array.isArray(data?.message)
        ? data.message.join(" | ")
        : data?.message || data?.error) ||
      error?.message ||
      "Request failed";

    return { success: false, error: String(rawMessage) };
  }
}
