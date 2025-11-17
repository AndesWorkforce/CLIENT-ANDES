"use server";

import { cookies } from "next/headers";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";
const ACTIVE_COMPANY_COOKIE = "active_company_id";
const SELECTED_COMPANY_COOKIE = "selected_company_id";

export async function logoutAction() {
  try {
    // Eliminar cookies de autenticación
    const cookieStore = cookies();

    (await cookieStore).delete(AUTH_COOKIE);
    (await cookieStore).delete(USER_INFO_COOKIE);
    // Limpiar cookies de contexto de empresa para evitar fugas de scope
    (await cookieStore).delete(ACTIVE_COMPANY_COOKIE);
    (await cookieStore).delete(SELECTED_COMPANY_COOKIE);

    return { success: true };
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return { success: false, error: "Error al cerrar sesión" };
  }
}
