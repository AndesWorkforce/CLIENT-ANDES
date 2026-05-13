import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getApiUrl(): string {
  const rawUrl =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/";
  let url = rawUrl.trim();
  if (!url.endsWith("/")) url = `${url}/`;
  if (!url.toLowerCase().includes("/api/")) {
    url = `${url}api/`;
    url = url.replace(/([^:]\/)\/+/g, "$1");
  }
  return url;
}

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

    const apiUrl = getApiUrl();
    console.log("[Verify Route] ✅ Token encontrado, validando con backend...");
    console.log("[Verify Route] 🌐 API_URL:", apiUrl);

    // Llamar al backend para validar el token
    const response = await fetch(`${apiUrl}auth/verify`, {
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

    if (response.status === 401 || response.status === 403) {
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

    if (!response.ok) {
      console.warn(
        "[Verify Route] ⚠️ Backend no disponible para validar token (status:",
        response.status,
        ")",
      );
      return NextResponse.json(
        { valid: true, degraded: true, message: "Verification temporarily unavailable" },
        { status: 200 },
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
