import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60; // 7 días

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { token, user } = body;

    if (!token || !user) {
      return NextResponse.json(
        { success: false, error: "Token and user required" },
        { status: 400 }
      );
    }

    console.log("[Set Session] 🍪 Setting cookies for user:", user.correo);

    const cookieStore = await cookies();

    // Set auth_token (httpOnly for security)
    cookieStore.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "strict",
    });

    // Set user_info (client-readable)
    cookieStore.set({
      name: USER_INFO_COOKIE,
      value: JSON.stringify(user),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "strict",
    });

    console.log("[Set Session] ✅ Cookies set successfully");

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Set Session] ❌ Error setting cookies:", error);
    return NextResponse.json(
      { success: false, error: "Failed to set session" },
      { status: 500 }
    );
  }
}
