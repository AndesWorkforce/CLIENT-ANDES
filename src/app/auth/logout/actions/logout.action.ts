"use server";

import { cookies } from "next/headers";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

export async function logoutAction() {
  try {
    // Eliminar cookies de autenticación
    const cookieStore = cookies();

    cookieStore.delete(AUTH_COOKIE);
    cookieStore.delete(USER_INFO_COOKIE);

    return { success: true };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return { success: false, error: "Error al cerrar sesión" };
  }
}
