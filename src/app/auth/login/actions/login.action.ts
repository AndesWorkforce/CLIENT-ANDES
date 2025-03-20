"use server";

import { LoginFormValues } from "../schemas/login.schema";
import { cookies } from "next/headers";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

// Duración de la cookie - 7 días en segundos
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export async function loginAction(values: LoginFormValues) {
  try {
    const { correo, contrasena } = values;
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}auth/login`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ correo, contrasena }),
      }
    );
    const data = await response.json();

    // Si el inicio de sesión fue exitoso, establecer cookies
    if (data && data.data) {
      const userData = data.data.usuario || data.data;
      const token = data.data.accessToken || "default-token-placeholder";

      // Establecer cookie para el token (HTTP-only para seguridad)
      const cookieStore = cookies();

      (await cookieStore).set({
        name: AUTH_COOKIE,
        value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
        sameSite: "strict",
      });

      // Establecer cookie con información del usuario (no HTTP-only para que el cliente pueda leerla)
      (await cookieStore).set({
        name: USER_INFO_COOKIE,
        value: JSON.stringify(userData),
        httpOnly: false,
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
        sameSite: "strict",
      });

      console.log("Cookies establecidas correctamente");
    }

    return {
      success: true,
      data: data.data,
    };
  } catch (error) {
    console.error("Error en el formulario:", error);
    return {
      success: false,
      error: "Error al iniciar sesión",
    };
  }
}
