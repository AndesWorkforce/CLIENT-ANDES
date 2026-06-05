import { NextResponse } from "next/server";
import { applyAuthSessionCookies } from "@/lib/set-auth-session";

/**
 * Ruta fuera de /api/* para evitar que nginx envíe el POST al backend Nest.
 * El cliente llama aquí tras login directo al API para persistir cookies httpOnly.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user } = body;

    if (!token || !user) {
      return NextResponse.json(
        { success: false, error: "Token and user required" },
        { status: 400 },
      );
    }

    console.log(
      "[Session API Set] 🍪 Setting cookies for:",
      (user as { correo?: string }).correo ?? "unknown",
    );

    await applyAuthSessionCookies(token, user);

    console.log("[Session API Set] ✅ Cookies set successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Session API Set] ❌ Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set session" },
      { status: 500 },
    );
  }
}
