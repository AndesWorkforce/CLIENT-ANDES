import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createServerAxios } from "@/services/axios.server";

const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";
const COOKIE_MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { correo, contrasena, selectedRole, selectedCompanyId } = body || {};

    try {
      console.log("[API /api/auth/login/with-company] incoming body:", {
        correo,
        selectedRole,
        selectedCompanyId,
      });
      console.log(
        "[API /api/auth/login/with-company] incoming header x-company-id:",
        request.headers.get("x-company-id")
      );
      console.log("[API /api/auth/login/with-company] partial headers:", {
        "content-type": request.headers.get("content-type"),
        "x-company-id": request.headers.get("x-company-id"),
      });
    } catch (logErr) {
      console.warn("[API with-company] could not log headers/body", logErr);
    }

    const axios = await createServerAxios();

    const response = await axios.post(
      "auth/login",
      {
        correo,
        contrasena,
        ...(selectedRole ? { selectedRole } : {}),
        ...(selectedCompanyId ? { selectedCompanyId } : {}),
      },
      {
        headers: {
          ...(selectedCompanyId ? { "x-company-id": selectedCompanyId } : {}),
        },
        maxRedirects: 0,
      }
    );

    console.log(
      "[API /api/auth/login/with-company] proxied to backend auth/login, status:",
      response.status
    );

    const data = response.data?.data;
    if (!data) {
      return NextResponse.json(
        { success: false, error: "Invalid login response" },
        { status: 500 }
      );
    }

    const cookieStore = await cookies();
    const token = data.accessToken || "default-token-placeholder";

    // Token httpOnly
    cookieStore.set({
      name: AUTH_COOKIE,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "strict",
    });

    // Usuario (no httpOnly)
    cookieStore.set({
      name: USER_INFO_COOKIE,
      value: JSON.stringify(data.usuario || data),
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      maxAge: COOKIE_MAX_AGE,
      path: "/",
      sameSite: "strict",
    });

    // Persist selected company for subsequent server requests
    if (selectedCompanyId) {
      cookieStore.set({
        name: "active_company_id",
        value: selectedCompanyId,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
        sameSite: "strict",
      });
    }

    return NextResponse.json({ success: true, data });
    // disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    const msg =
      (Array.isArray(error?.response?.data?.message)
        ? error.response.data.message.join(" | ")
        : error?.response?.data?.message || error?.message) || "Login failed";
    return NextResponse.json(
      { success: false, error: String(msg) },
      { status: 400 }
    );
  }
}
