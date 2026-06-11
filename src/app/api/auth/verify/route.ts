import { NextResponse } from "next/server";
import { cookies } from "next/headers";

function getVerifyApiUrl(): string {
  const raw =
    process.env.INTERNAL_API_URL ||
    process.env.NEXT_PUBLIC_API_URL ||
    "http://localhost:5000/api/";
  let url = raw.trim();
  if (!url.endsWith("/")) url += "/";
  if (!url.toLowerCase().includes("/api/")) {
    url = `${url}${url.endsWith("/") ? "" : "/"}api/`.replace(/([^:]\/)\/+/g, "$1");
  }
  return url;
}
const AUTH_COOKIE = "auth_token";

function resolveAuthToken(request: Request, cookieToken?: string): string | undefined {
  if (cookieToken) return cookieToken;

  const authorization = request.headers.get("Authorization");
  if (authorization?.startsWith("Bearer ")) {
    return authorization.slice(7).trim();
  }

  return undefined;
}

export async function GET(request: Request) {
  try {
    console.log("[Verify Route] 🔍 Iniciando verificación de token...");
    const cookieStore = await cookies();
    const cookieToken = (await cookieStore).get(AUTH_COOKIE)?.value;
    const authToken = resolveAuthToken(request, cookieToken);

    if (!authToken) {
      console.log("[Verify Route] ❌ No se encontró token en cookies ni en Authorization");
      return NextResponse.json(
        { valid: false, message: "No token found" },
        { status: 401 },
      );
    }

    console.log("[Verify Route] ✅ Token encontrado, validando con backend...");
    const apiUrl = getVerifyApiUrl();
    console.log("[Verify Route] 🌐 API_URL:", apiUrl);

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
