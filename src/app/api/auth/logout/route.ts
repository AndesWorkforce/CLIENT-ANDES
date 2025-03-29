import { cookies } from "next/headers";
import { NextResponse } from "next/server";

// Constantes para las cookies
const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

export async function GET() {
  try {
    // Obtener la instancia de cookies
    const cookieStore = cookies();

    // Eliminar las cookies usando el método delete
    (await cookieStore).delete(AUTH_COOKIE);
    (await cookieStore).delete(USER_INFO_COOKIE);

    // Devolver una respuesta indicando éxito
    return NextResponse.json({
      success: true,
      message: "Sesión cerrada correctamente",
    });
  } catch (error) {
    console.error("Error al cerrar sesión:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Error al cerrar sesión",
      },
      { status: 500 }
    );
  }
}
