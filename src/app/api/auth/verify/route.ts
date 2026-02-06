import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3001";
const AUTH_COOKIE = "auth_token";

export async function GET() {
  try {
    console.log("[Verify Route] 🔍 Iniciando verificación de token...");
    const cookieStore = cookies();
    const authToken = (await cookieStore).get(AUTH_COOKIE)?.value;

    if (!authToken) {
      console.log("[Verify Route] ❌ No se encontró token en cookies");
      return NextResponse.json(
        { valid: false, message: "No token found" },
        { status: 401 },
      );
    }

    console.log("[Verify Route] ✅ Token encontrado, validando con backend...");
    console.log("[Verify Route] 🌐 API_URL:", API_URL);

    // Llamar al backend para validar el token
    const response = await fetch(`${API_URL}auth/verify`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${authToken}`,
        "Content-Type": "application/json",
      },
    });

    console.log(
      "[Verify Route] 📡 Respuesta del backend:",
      response.status,
      response.statusText,
    );

    if (!response.ok) {
      console.log(
        "[Verify Route] ❌ Backend rechazó el token (status:",
        response.status,
        ")",
      );
      return NextResponse.json(
        { valid: false, message: "Invalid or expired token" },
        { status: 401 },
      );
    }

    const data = await response.json();
    console.log(
      "[Verify Route] ✅ Token válido. Usuario:",
      data.user?.correo || data.user?.id,
    );
    return NextResponse.json({ valid: true, user: data.user });
  } catch (error) {
    console.error("[Verify Route] 💥 Error validando token:", error);
    return NextResponse.json(
      { valid: false, message: "Error validating token" },
      { status: 500 },
    );
  }
}
