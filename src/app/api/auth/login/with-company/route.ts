import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  getAuthCookieBaseOptions,
  getClientReadableCookieOptions,
} from "@/lib/auth-cookies";
import { createServerAxios } from "@/services/axios.server";
import {
  getMfaLoginResponse,
  unwrapBackendData,
} from "@/lib/login-bff";

const AUTH_COOKIE = "auth_token";
const USER_INFO_COOKIE = "user_info";

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

    const payload = unwrapBackendData(response.data);
    if (!payload) {
      return NextResponse.json(
        { success: false, error: "Invalid login response" },
        { status: 500 }
      );
    }

    const mfaResponse = getMfaLoginResponse(payload);
    if (mfaResponse) {
      return NextResponse.json(mfaResponse);
    }

    const token =
      typeof payload.accessToken === "string" ? payload.accessToken : "";
    if (!token) {
      return NextResponse.json(
        { success: false, error: "Login succeeded without access token" },
        { status: 400 }
      );
    }

    const cookieStore = await cookies();

    // Token httpOnly
    cookieStore.set({
      name: AUTH_COOKIE,
      value: token,
      ...getAuthCookieBaseOptions(),
    });

    cookieStore.set({
      name: USER_INFO_COOKIE,
      value: JSON.stringify(payload.usuario || payload),
      ...getClientReadableCookieOptions(),
    });

    if (selectedCompanyId) {
      cookieStore.set({
        name: "active_company_id",
        value: selectedCompanyId,
        ...getAuthCookieBaseOptions(),
      });
    }

    return NextResponse.json({ success: true, data: payload });
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
