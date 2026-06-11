import { NextResponse } from "next/server";
import { applyAuthSessionCookies } from "@/lib/set-auth-session";

/** @deprecated Preferir POST /session-api/set (no interceptado por proxy /api → Nest). */
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

    await applyAuthSessionCookies(token, user);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Set Session] ❌ Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set session" },
      { status: 500 },
    );
  }
}
